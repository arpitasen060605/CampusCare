import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileUp, 
  MapPin, 
  Layers, 
  Sparkles, 
  X, 
  ArrowRight,
  UploadCloud,
  RefreshCw,
  Compass,
  Check
} from 'lucide-react';
import { complaintsAPI, aiAPI } from '../services/api';
import AIAnalysisCard from '../components/AIAnalysisCard';
import { AILoadingAnimation } from '../components/AIBadge';
import DuplicateWarningModal from '../components/DuplicateWarningModal';

const SubmitComplaint = ({ showToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Sanitation',
    location: 'Academic Block B - Ground Floor',
    priority: 'High',
    description: '',
    latitude: null,
    longitude: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState({
    category: 'Sanitation',
    priority: 'High',
    department: 'Maintenance',
    summary: 'Washroom near Block B has no water and requires cleaning',
    location: 'Academic Block B - Ground Floor',
    keywords: ['washroom', 'water', 'dirty'],
    priorityReason: 'Essential facility unavailable and may affect multiple students.'
  });

  // Duplicate Check Modal state
  const [duplicateData, setDuplicateData] = useState(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [bypassDuplicateCheck, setBypassDuplicateCheck] = useState(false);

  // Generate live image preview when selected file changes
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // Handle Browser Geolocation API
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      if (showToast) showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location: `${prev.location.split(' (Lat:')[0]} (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`,
        }));

        setIsLocating(false);
        setLocationSuccess(true);
        if (showToast) showToast(`Location acquired: (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      },
      (error) => {
        console.warn('[Geolocation Error]', error.message);
        setIsLocating(false);
        setLocationSuccess(false);
        let msg = 'Could not acquire location.';
        if (error.code === 1) msg = 'Location permission denied. You can still type location manually.';
        if (showToast) showToast(msg, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const triggerAIAnalysis = async (titleVal, descVal, locVal) => {
    if ((titleVal || descVal).length < 8) return;
    setIsAnalyzingAI(true);
    try {
      const res = await aiAPI.analyze({
        title: titleVal,
        description: descVal,
        location: locVal,
      });
      if (res.data && res.data.success) {
        setAiResult({
          category: res.data.category,
          priority: res.data.priority,
          department: res.data.department,
          summary: res.data.summary,
          location: res.data.location,
          keywords: res.data.keywords,
          priorityReason: res.data.priorityReason,
        });

        setFormData(prev => ({
          ...prev,
          category: res.data.category,
          priority: res.data.priority,
        }));
      }
    } catch (err) {
      console.warn('[SubmitComplaint AI Warning]', err.message);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleTextChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if ((field === 'title' || field === 'description') && value.length > 12) {
      triggerAIAnalysis(updated.title, updated.description, updated.location);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/)) {
        if (showToast) showToast('Invalid file type! Please select an image file (PNG, JPG, WEBP, GIF).', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        if (showToast) showToast('File size exceeds maximum limit of 5MB!', 'error');
        return;
      }

      setSelectedFile(file);
      if (showToast) showToast(`Selected photo: ${file.name}`);
    }
  };

  const handleFinalSubmit = async (duplicateLinkObj = null) => {
    setLoading(true);

    try {
      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append('title', formData.title);
        payload.append('description', formData.description);
        payload.append('category', formData.category);
        payload.append('location', formData.location);
        payload.append('priority', formData.priority);
        if (formData.latitude) payload.append('latitude', formData.latitude);
        if (formData.longitude) payload.append('longitude', formData.longitude);
        if (duplicateLinkObj) {
          payload.append('duplicateOf', duplicateLinkObj._id || duplicateLinkObj.complaintId);
          payload.append('duplicateSimilarity', duplicateLinkObj.similarity || 0.94);
        }
        payload.append('photo', selectedFile);
      } else {
        payload = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          priority: formData.priority,
          ...(formData.latitude ? { latitude: formData.latitude, longitude: formData.longitude } : {}),
          ...(duplicateLinkObj ? {
            duplicateOf: duplicateLinkObj._id || duplicateLinkObj.complaintId,
            duplicateSimilarity: duplicateLinkObj.similarity || 0.94,
          } : {})
        };
      }

      const res = await complaintsAPI.create(payload);
      const createdComp = res.data?.complaint;
      
      if (showToast) {
        showToast(duplicateLinkObj 
          ? `Complaint linked to #${duplicateLinkObj.complaintId || 'existing ticket'}!` 
          : `Complaint ${createdComp ? createdComp.complaintId : ''} submitted successfully!`);
      }
      setIsDuplicateModalOpen(false);
      navigate('/my-complaints');
    } catch (err) {
      console.error('[Submit Complaint Error]', err);
      const msg = err.response?.data?.message || 'Failed to submit complaint. Please check inputs.';
      if (showToast) showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bypassDuplicateCheck) {
      setLoading(true);
      try {
        const dupRes = await aiAPI.checkDuplicate({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          category: formData.category,
        });

        if (dupRes.data && dupRes.data.isDuplicate && dupRes.data.matches?.length > 0) {
          setDuplicateData(dupRes.data);
          setIsDuplicateModalOpen(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('[Duplicate Check Error]', err.message);
      } finally {
        setLoading(false);
      }
    }

    handleFinalSubmit(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gemini AI Triage & Geolocation Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">File a Campus Complaint</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Describe the issue below. Use GPS geolocation to pin exact coordinates on the Campus Incident Map.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Complaint Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The washroom near Block B has no water and is extremely dirty."
              value={formData.title}
              onChange={(e) => handleTextChange('title', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {['Sanitation', 'Electrical', 'Water Supply', 'Infrastructure', 'Security', 'Internet', 'Transportation', 'Hostel', 'Academic', 'Maintenance', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Campus Location
                </label>

                {/* "Use My Location" Geolocation Button */}
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={isLocating}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                    locationSuccess
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {isLocating ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Acquiring GPS...</span>
                    </>
                  ) : locationSuccess ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>GPS Pinned</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3 h-3 text-cyan-400" />
                      <span>Use My Location</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleTextChange('location', e.target.value)}
                  placeholder="Campus location or block name..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide exact details of what happened..."
              value={formData.description}
              onChange={(e) => handleTextChange('description', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Photo File Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Complaint Photo Evidence (Optional - Max 5MB)
            </label>

            {!previewUrl ? (
              <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-slate-900/50 group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-semibold text-slate-200">
                  Click or drag image file here
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Supported formats: JPG, PNG, WEBP, GIF (Max 5MB)</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 bg-slate-900 p-2 group">
                <img 
                  src={previewUrl} 
                  alt="Complaint Preview" 
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-500 transition-colors shadow-lg"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 px-2 flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                  <span>{(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="px-5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Uploading & Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Complaint</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Live AI Analysis Column */}
        <div className="lg:col-span-5 space-y-6">
          {isAnalyzingAI ? (
            <AILoadingAnimation message="AI is analyzing your complaint..." />
          ) : (
            <AIAnalysisCard analysis={aiResult} />
          )}
        </div>
      </div>

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        duplicateData={duplicateData}
        onLinkAsDuplicate={(matchedObj) => {
          handleFinalSubmit(matchedObj);
        }}
        onCreateSeparate={() => {
          setBypassDuplicateCheck(true);
          setIsDuplicateModalOpen(false);
          handleFinalSubmit(null);
        }}
      />
    </div>
  );
};

export default SubmitComplaint;

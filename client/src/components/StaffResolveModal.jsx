import React, { useState, useEffect } from 'react';
import { Check, UploadCloud, X, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Modal from './Modal';
import { complaintsAPI } from '../services/api';

const StaffResolveModal = ({
  isOpen,
  onClose,
  complaint,
  onResolveSuccess,
  showToast,
}) => {
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  if (!isOpen || !complaint) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Client side file type check
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/)) {
        if (showToast) showToast('Invalid file type! Please select an image file (PNG, JPG, WEBP, GIF).', 'error');
        return;
      }

      // Client side 5MB limit check
      if (file.size > 5 * 1024 * 1024) {
        if (showToast) showToast('File size exceeds maximum limit of 5MB!', 'error');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Prevent staff from resolving without a resolution note
    if (!resolutionNote || !resolutionNote.trim()) {
      setErrorMsg('Resolution note is required to resolve this complaint.');
      if (showToast) showToast('Resolution note is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const targetId = complaint.mongoId || complaint._id || complaint.id;

      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append('resolutionNote', resolutionNote.trim());
        payload.append('resolutionPhoto', selectedFile);
      } else {
        payload = {
          resolutionNote: resolutionNote.trim(),
        };
      }

      const res = await complaintsAPI.resolve(targetId, payload);

      if (showToast) showToast(`Ticket #${complaint.complaintId || complaint.id} marked as Resolved!`, 'success');
      if (onResolveSuccess) onResolveSuccess(res.data?.complaint);
      setResolutionNote('');
      setSelectedFile(null);
      onClose();
    } catch (err) {
      console.error('[Resolve Ticket Error]', err);
      const msg = err.response?.data?.message || 'Failed to submit ticket resolution';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Resolve Ticket #${complaint.complaintId || complaint.id}`}>
      <form onSubmit={handleResolveSubmit} className="space-y-5 text-xs pt-1">
        {/* Ticket Snippet */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="font-bold text-white text-sm line-clamp-1">{complaint.title}</div>
          <div className="text-[11px] text-slate-400">
            Location: <strong className="text-slate-200">{complaint.location}</strong>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mandatory Resolution Note */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
            Resolution Note & Actions Taken *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe maintenance work completed, replacement parts used, or inspection outcome (Mandatory)..."
            value={resolutionNote}
            onChange={(e) => { setResolutionNote(e.target.value); setErrorMsg(''); }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Optional Resolution Photo Attachment with Live Preview */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
            Resolution Photo Evidence (Optional - Max 5MB)
          </label>

          {!previewUrl ? (
            <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 text-center transition-colors cursor-pointer bg-slate-900/50 group">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-7 h-7 text-emerald-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-slate-200">
                Click or drag completed repair photo here
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, WEBP, GIF (Max 5MB)</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-900 p-2">
              <img 
                src={previewUrl} 
                alt="Resolution Preview" 
                className="w-full h-36 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-500 transition-colors shadow-lg"
                title="Remove Photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="mt-2 px-2 flex items-center justify-between text-xs text-slate-300 font-mono">
                <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                <span>{(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting Resolution...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Complete & Mark Resolved</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffResolveModal;

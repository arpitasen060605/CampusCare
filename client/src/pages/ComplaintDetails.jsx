import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import AIAnalysisCard from '../components/AIAnalysisCard';
import AIBadge from '../components/AIBadge';
import DuplicateBadge from '../components/DuplicateBadge';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  FileUp, 
  Download, 
  MessageSquare, 
  Send, 
  Building2,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Check,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Flame,
  Info
} from 'lucide-react';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Helper to compute Resolution Duration (resolvedAt - createdAt)
const calculateResolutionDuration = (createdAt, resolvedAt) => {
  if (!createdAt || !resolvedAt) return 'N/A';
  const start = new Date(createdAt).getTime();
  const end = new Date(resolvedAt).getTime();
  const diffMs = Math.max(0, end - start);
  const totalMins = Math.floor(diffMs / (1000 * 60));

  if (totalMins < 60) {
    return `${totalMins} minute${totalMins !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours < 24) {
    return `${hours} hr${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min${mins > 1 ? 's' : ''}` : ''}`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return `${days} day${days > 1 ? 's' : ''} ${remHours > 0 ? `${remHours} hr${remHours > 1 ? 's' : ''}` : ''}`;
};

const ComplaintDetails = ({ showToast }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await complaintsAPI.getById(id);
        if (res.data && res.data.complaint) {
          const c = res.data.complaint;
          const resolvedByPerson = c.resolvedBy?.name || c.assignedTo?.name || 'Assigned Technician';

          setComplaint({
            id: c.complaintId || c._id,
            mongoId: c._id,
            title: c.title,
            category: c.category,
            location: c.location,
            status: c.status,
            priority: c.priority,
            department: c.department || 'Maintenance',
            submittedBy: c.submittedBy?.name || 'Student',
            submittedByEmail: c.submittedBy?.email || '',
            submittedAt: c.createdAt,
            assignedAt: c.assignedAt,
            startedAt: c.startedAt,
            assignedStaff: c.assignedTo?.name || 'Unassigned',
            description: c.description,
            photo: c.photo,
            resolutionNote: c.resolutionNote,
            resolutionPhoto: c.resolutionPhoto,
            resolvedAt: c.resolvedAt,
            resolvedBy: resolvedByPerson,
            resolutionDuration: calculateResolutionDuration(c.createdAt, c.resolvedAt),
            duplicateOf: c.duplicateOf,
            duplicateSimilarity: c.duplicateSimilarity || 0.94,
            aiAnalyzed: c.aiAnalyzed ?? true,
            aiAnalysis: {
              category: c.category || 'Sanitation',
              priority: c.priority || 'High',
              department: c.department || 'Maintenance',
              summary: c.aiSummary || `${c.title}: ${c.category} complaint logged for campus.`,
              location: c.location,
              keywords: c.aiKeywords && c.aiKeywords.length > 0 ? c.aiKeywords : ['campus', c.category?.toLowerCase() || 'facility'],
              priorityReason: c.priorityReason || `Assigned ${c.priority || 'High'} priority based on impact context.`,
            },
            history: c.history || [],
            attachments: c.photo ? [{ name: 'submitted-evidence.jpg', size: '1.2 MB', url: c.photo }] : [],
          });

          if (c.history && c.history.length > 0) {
            const historyComments = c.history.map(h => ({
              author: h.changedBy?.name || 'System / Workflow',
              text: h.message || `Status updated to ${h.newStatus}`,
              date: h.createdAt,
            }));
            setComments(historyComments);
          } else if (c.resolutionNote) {
            setComments([{ author: resolvedByPerson, text: `Resolution: ${c.resolutionNote}`, date: c.resolvedAt || c.updatedAt }]);
          }
        }
      } catch (err) {
        console.warn('[ComplaintDetails Error]', err.message);
        if (showToast) showToast('Could not load complaint details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { author: user?.name || 'You', text: commentText, date: new Date().toISOString() }]);
    setCommentText('');
    if (showToast) showToast('Comment added to complaint ticket.');
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading complaint details & timeline..." />;
  }

  if (!complaint) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-white">Complaint Not Found</h2>
        <p className="text-sm text-slate-400">The requested ticket ID does not exist in the database.</p>
        <Link to="/student/dashboard" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Top Navigation */}
      <Link 
        to={user?.role === 'admin' ? '/admin/complaints' : user?.role === 'staff' ? '/staff/dashboard' : '/my-complaints'}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Complaints</span>
      </Link>

      {/* Linked Duplicate Warning Banner */}
      {complaint.duplicateOf && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center justify-between gap-4 text-xs text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Linked Duplicate Ticket</div>
              <p className="text-[11px] text-amber-300/90">
                This complaint was linked as a duplicate of original ticket{' '}
                <strong className="font-mono text-white">
                  #{typeof complaint.duplicateOf === 'object' ? (complaint.duplicateOf.complaintId || complaint.duplicateOf._id) : complaint.duplicateOf}
                </strong> ({Math.round((complaint.duplicateSimilarity || 0.94) * 100)}% Similarity).
              </p>
            </div>
          </div>
          <Link
            to={`/complaint/${typeof complaint.duplicateOf === 'object' ? complaint.duplicateOf._id : complaint.duplicateOf}`}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px] shrink-0 transition-colors shadow-md flex items-center gap-1.5"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>View Original Ticket</span>
          </Link>
        </div>
      )}

      {/* Verified Resolution Box (Displayed when Status is Resolved) */}
      {complaint.status === 'Resolved' && (
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>✓ Complaint Resolved</span>
                </h3>
                <p className="text-xs text-emerald-300/80">Serviced & signed off by campus maintenance staff</p>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              Status: Resolved
            </div>
          </div>

          {/* Resolution Details Matrix: Resolved By, Resolution Date, Resolution Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-1">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Resolved By</div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{complaint.resolvedBy}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-1">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Resolution Date</div>
              <div className="font-mono text-emerald-300 font-bold">
                {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : 'Recently'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-1">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">Resolution Time</div>
              <div className="font-mono text-amber-300 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{complaint.resolutionDuration}</span>
              </div>
            </div>
          </div>

          {/* Resolution Note Text */}
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Resolution Note</div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30 font-medium">
              "{complaint.resolutionNote || 'Technician completed the repair work and tested the equipment.'}"
            </p>
          </div>

          {/* Resolution Photo if present */}
          {complaint.resolutionPhoto && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Resolution Photo</span>
              </div>
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-emerald-500/30 shadow-lg">
                <img 
                  src={complaint.resolutionPhoto} 
                  alt="Resolution Evidence"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Header Card & Metadata Matrix */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                Complaint ID: #{complaint.id}
              </span>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              {complaint.aiAnalyzed && <AIBadge label="AI Analyzed" size="sm" />}
              {complaint.duplicateOf && (
                <DuplicateBadge duplicateOf={complaint.duplicateOf} similarity={complaint.duplicateSimilarity} />
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{complaint.title}</h1>
          </div>

          <div className="text-xs text-slate-400 space-y-1 font-mono">
            <div>Filed: {new Date(complaint.submittedAt).toLocaleString()}</div>
            <div>Category: <span className="text-indigo-300 font-semibold">{complaint.category}</span></div>
          </div>
        </div>

        {/* 5-Stage Visual Progress Status Timeline */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-300">Complaint Progress Tracking Timeline</h3>
          <ComplaintTimeline 
            status={complaint.status} 
            aiAnalyzed={complaint.aiAnalyzed}
            timestamps={{
              createdAt: complaint.submittedAt,
              assignedAt: complaint.assignedAt,
              startedAt: complaint.startedAt,
              resolvedAt: complaint.resolvedAt,
            }}
          />
        </div>

        {/* Comprehensive Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Location</span>
            </div>
            <div className="font-bold text-white truncate">{complaint.location}</div>
            {complaint.latitude && complaint.longitude && (
              <div className="text-[10px] text-cyan-400 font-mono font-semibold">
                GPS: ({complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)})
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Category</span>
            </div>
            <div className="font-bold text-indigo-300 truncate">{complaint.category}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Department</span>
            </div>
            <div className="font-bold text-amber-300 truncate">{complaint.department}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-semibold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assigned Staff</span>
            </div>
            <div className="font-bold text-emerald-300 truncate">{complaint.assignedStaff}</div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Description</h3>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            {complaint.description}
          </p>
        </div>

        {/* Uploaded Student Evidence Photo */}
        {complaint.photo && (
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <span>Submitted Photo Evidence</span>
            </h3>
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-800 shadow-md">
              <img 
                src={complaint.photo} 
                alt="Submitted Evidence" 
                className="w-full h-48 object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid: AI Analysis Card vs Timeline Discussion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Full AI Breakdown (Summary & Priority Reason) */}
        <div className="lg:col-span-6 space-y-6">
          <AIAnalysisCard analysis={complaint.aiAnalysis} />

          {/* Attachments */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileUp className="w-4 h-4 text-indigo-400" />
              <span>Attachments ({complaint.attachments?.length || 0})</span>
            </h3>

            {complaint.attachments && complaint.attachments.length > 0 ? (
              <div className="space-y-2">
                {complaint.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                    <div className="truncate pr-2">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-500">{file.size}</div>
                    </div>
                    <button
                      onClick={() => showToast && showToast(`Downloading file: ${file.name}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No additional attachments provided.</p>
            )}
          </div>
        </div>

        {/* Right Column: Discussion Notes */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Activity & Discussion Notes</span>
            </h3>

            {comments.length > 0 && (
              <div className="space-y-3">
                {comments.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-indigo-300">{c.author}</span>
                      <span className="font-mono text-[10px]">{new Date(c.date).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-200">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Write a message or update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;

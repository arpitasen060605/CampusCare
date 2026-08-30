import React from 'react';
import { AlertTriangle, ExternalLink, Link2, PlusCircle, Layers, MapPin } from 'lucide-react';
import Modal from './Modal';

const DuplicateWarningModal = ({
  isOpen,
  onClose,
  duplicateData,
  onLinkAsDuplicate,
  onCreateSeparate,
}) => {
  if (!isOpen || !duplicateData || !duplicateData.matches || duplicateData.matches.length === 0) {
    return null;
  }

  const topMatch = duplicateData.matches[0];
  const matchCount = duplicateData.matchCount || duplicateData.matches.length;
  const similarityPct = Math.round((topMatch.similarity || duplicateData.similarity || 0.9) * 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-6 pt-2">
        {/* Header Alert Banner */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <span>{similarityPct}% Similar Match</span>
            </div>
            <h2 className="text-xl font-black text-white">⚠️ Possible Duplicate Complaint</h2>
            <p className="text-xs text-slate-400">
              {matchCount > 1 
                ? `${matchCount} similar complaints detected on campus.` 
                : 'A similar complaint already exists on campus.'}
            </p>
          </div>
        </div>

        {/* Top Existing Complaint Card */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Existing Complaint:</span>
            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              #{topMatch.complaintId || 'CMP-1042'}
            </span>
          </div>

          <div className="text-sm font-bold text-white leading-snug">
            "{topMatch.title}"
          </div>

          {topMatch.description && (
            <p className="text-xs text-slate-400 line-clamp-2 italic">
              {topMatch.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {topMatch.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{topMatch.location}</span>
              </span>
            )}
            {topMatch.category && (
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{topMatch.category}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Button 1: View Existing Complaint */}
          <button
            type="button"
            onClick={() => {
              window.open(`/complaint/${topMatch._id || topMatch.complaintId}`, '_blank');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            <span>View Existing Complaint</span>
          </button>

          {/* Button 2: Link as Duplicate */}
          <button
            type="button"
            onClick={() => onLinkAsDuplicate(topMatch)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            <span>Link as Duplicate</span>
          </button>

          {/* Button 3: Create Separate Complaint */}
          <button
            type="button"
            onClick={onCreateSeparate}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Separate Complaint</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DuplicateWarningModal;

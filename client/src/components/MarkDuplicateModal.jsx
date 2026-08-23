import React, { useState, useEffect } from 'react';
import { Link2, RefreshCw, AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import { complaintsAPI } from '../services/api';

const MarkDuplicateModal = ({
  isOpen,
  onClose,
  complaint,
  onDuplicateMarked,
  showToast,
}) => {
  const [complaintList, setComplaintList] = useState([]);
  const [targetDuplicateId, setTargetDuplicateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !complaint) return;

    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await complaintsAPI.getAll();
        if (res.data && res.data.complaints) {
          // Filter out the current complaint itself
          const filtered = res.data.complaints.filter(c => {
            const cId = c._id || c.mongoId || c.id;
            const currentId = complaint._id || complaint.mongoId || complaint.id;
            return cId !== currentId;
          });
          setComplaintList(filtered);
          if (filtered.length > 0) {
            setTargetDuplicateId(filtered[0]._id || filtered[0].mongoId);
          }
        }
      } catch (err) {
        console.warn('[MarkDuplicateModal Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [isOpen, complaint]);

  if (!isOpen || !complaint) return null;

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    if (!targetDuplicateId) {
      if (showToast) showToast('Please select a target original complaint', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const currentId = complaint._id || complaint.mongoId || complaint.id;
      const res = await complaintsAPI.update(currentId, {
        duplicateOf: targetDuplicateId,
        duplicateSimilarity: 0.95,
      });

      const selectedTarget = complaintList.find(c => (c._id || c.mongoId) === targetDuplicateId);
      const targetLabel = selectedTarget ? (selectedTarget.complaintId || selectedTarget.id) : 'original ticket';

      if (showToast) showToast(`Marked ticket as duplicate of #${targetLabel}!`, 'success');
      if (onDuplicateMarked) onDuplicateMarked(res.data?.complaint);
      onClose();
    } catch (err) {
      console.error('[Mark Duplicate Error]', err);
      const msg = err.response?.data?.message || 'Failed to mark ticket as duplicate';
      if (showToast) showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mark Duplicate - Ticket #${complaint.complaintId || complaint.id}`}>
      <form onSubmit={handleMarkSubmit} className="space-y-5 text-xs pt-1">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Select the existing original ticket that this complaint is a duplicate of:</span>
        </div>

        {/* Current Complaint Title */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-400 font-semibold">Current Ticket:</div>
          <div className="text-white font-bold">{complaint.title}</div>
        </div>

        {/* Target Complaint Selector */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Original Ticket to Link *</span>
          </label>

          {loading ? (
            <div className="py-4 text-center text-slate-400 animate-pulse">Fetching complaint tickets...</div>
          ) : complaintList.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
              No other complaints available to link.
            </div>
          ) : (
            <select
              value={targetDuplicateId}
              onChange={(e) => setTargetDuplicateId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              {complaintList.map((item) => (
                <option key={item._id || item.mongoId} value={item._id || item.mongoId}>
                  #{item.complaintId || item.id} — {item.title} ({item.status})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Action Buttons */}
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
            disabled={submitting || complaintList.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-lg shadow-amber-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Linking Duplicate...</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                <span>Mark as Duplicate</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MarkDuplicateModal;

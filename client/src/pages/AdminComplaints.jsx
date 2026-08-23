import React, { useState, useEffect } from 'react';
import AdminComplaintsTable from '../components/AdminComplaintsTable';
import AssignStaffModal from '../components/AssignStaffModal';
import MarkDuplicateModal from '../components/MarkDuplicateModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';
import { complaintsAPI } from '../services/api';

const AdminComplaints = ({ showToast }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintsAPI.getAll();
      if (res.data && res.data.complaints) {
        const mapped = res.data.complaints.map(c => ({
          id: c.complaintId || c._id,
          mongoId: c._id,
          title: c.title,
          category: c.category,
          location: c.location,
          department: c.department || 'Maintenance',
          status: c.status,
          priority: c.priority,
          submittedBy: c.submittedBy?.name || 'Student',
          submittedAt: c.createdAt,
          assignedStaff: c.assignedTo?.name || 'Unassigned',
          duplicateOf: c.duplicateOf,
          duplicateSimilarity: c.duplicateSimilarity,
          description: c.description,
        }));
        setComplaints(mapped);
      }
    } catch (err) {
      console.warn('[AdminComplaints Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleOpenAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setIsAssignModalOpen(true);
  };

  const handleOpenDuplicate = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDuplicateModalOpen(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const target = complaints.find(c => c.id === id || c.mongoId === id);
      const targetId = target ? (target.mongoId || target.id) : id;
      await complaintsAPI.updateStatus(targetId, newStatus);
      if (showToast) showToast(`Updated ticket status to ${newStatus}`);
      fetchComplaints();
    } catch (err) {
      console.error('[Status Update Error]', err);
      if (showToast) showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Complaints Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Search, filter by category/priority/department/status, assign staff, and manage duplicate complaints.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-mono">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>{complaints.length} Total Complaints</span>
        </div>
      </div>

      {/* Admin Complaints Table */}
      {loading ? (
        <LoadingSpinner text="Fetching all campus tickets from MongoDB..." />
      ) : (
        <AdminComplaintsTable
          complaints={complaints}
          onOpenAssignModal={handleOpenAssign}
          onOpenDuplicateModal={handleOpenDuplicate}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Staff Assignment Modal */}
      <AssignStaffModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        complaint={selectedComplaint}
        onAssignmentSuccess={() => fetchComplaints()}
        showToast={showToast}
      />

      {/* Mark Duplicate Modal */}
      <MarkDuplicateModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        complaint={selectedComplaint}
        onDuplicateMarked={() => fetchComplaints()}
        showToast={showToast}
      />
    </div>
  );
};

export default AdminComplaints;

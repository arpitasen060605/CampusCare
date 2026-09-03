import React, { useState, useEffect } from 'react';
import { UserCheck, Building, RefreshCw, Check } from 'lucide-react';
import Modal from './Modal';
import { usersAPI, complaintsAPI } from '../services/api';

const AssignStaffModal = ({
  isOpen,
  onClose,
  complaint,
  onAssignmentSuccess,
  showToast,
}) => {
  const [staffList, setStaffList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await usersAPI.getStaff();
        if (res.data && res.data.staff) {
          setStaffList(res.data.staff);
          if (res.data.staff.length > 0) {
            setSelectedStaffId(res.data.staff[0]._id);
          }
        }
      } catch (err) {
        console.warn('[AssignStaffModal Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [isOpen]);

  if (!isOpen || !complaint) return null;

  const filteredStaff = staffList.filter(s => {
    return selectedDepartment === 'All' || s.department === selectedDepartment;
  });

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      if (showToast) showToast('Please select a staff member to assign', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const targetId = complaint.mongoId || complaint._id || complaint.id;
      const res = await complaintsAPI.assign(targetId, selectedStaffId);
      const assignedStaffObj = staffList.find(s => s._id === selectedStaffId);
      
      const successMsg = `Ticket #${complaint.complaintId || complaint.id} assigned to ${assignedStaffObj ? assignedStaffObj.name : 'Staff'}!`;
      if (showToast) showToast(successMsg, 'success');

      if (onAssignmentSuccess) onAssignmentSuccess(res.data?.complaint);
      onClose();
    } catch (err) {
      console.error('[Assign Error]', err);
      const msg = err.response?.data?.message || 'Failed to assign complaint to staff';
      if (showToast) showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Staff - Ticket #${complaint.complaintId || complaint.id}`}>
      <form onSubmit={handleAssignSubmit} className="space-y-5 text-xs pt-1">
        {/* Complaint Info Snippet */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="font-bold text-white text-sm line-clamp-1">{complaint.title}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-3">
            <span>Location: <strong className="text-slate-200">{complaint.location}</strong></span>
            <span>Category: <strong className="text-indigo-300">{complaint.category}</strong></span>
          </div>
        </div>

        {/* Filter Department */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter Staff by Department</span>
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              const matching = staffList.filter(s => e.target.value === 'All' || s.department === e.target.value);
              if (matching.length > 0) setSelectedStaffId(matching[0]._id);
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Electrical">Electrical</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Security">Security</option>
            <option value="IT">IT</option>
            <option value="Administration">Administration</option>
            <option value="Hostel">Hostel</option>
            <option value="Transport">Transport</option>
            <option value="Academic">Academic</option>
          </select>
        </div>

        {/* Staff Selection Dropdown */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Lead Technician / Staff Member *</span>
          </label>

          {loading ? (
            <div className="py-4 text-center text-slate-400 animate-pulse">Loading staff members...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              No staff members found for selected department.
            </div>
          ) : (
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              {filteredStaff.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name} — {staff.department} ({staff.email})
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
            disabled={submitting || filteredStaff.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Assigning...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Assign Ticket</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignStaffModal;

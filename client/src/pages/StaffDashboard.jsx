import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import StaffResolveModal from '../components/StaffResolveModal';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import DuplicateBadge from '../components/DuplicateBadge';
import { 
  CheckSquare, 
  RefreshCw, 
  CheckCircle2, 
  UserCheck, 
  Check,
  Play,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StaffDashboard = ({ showToast }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const fetchStaffComplaints = async () => {
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
      console.warn('[StaffDashboard Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffComplaints();
  }, [user]);

  const handleStartWork = async (complaint) => {
    try {
      const targetId = complaint.mongoId || complaint.id;
      await complaintsAPI.updateStatus(targetId, 'In Progress');
      if (showToast) showToast(`Started work on ticket #${complaint.id || complaint.complaintId}! Status updated to In Progress.`);
      fetchStaffComplaints();
    } catch (err) {
      console.error('[Start Work Error]', err);
      if (showToast) showToast(err.response?.data?.message || 'Failed to start work on ticket', 'error');
    }
  };

  const handleOpenResolve = (complaint) => {
    setSelectedTicket(complaint);
    setIsResolveModalOpen(true);
  };

  const assignedToMeCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Campus Technician Control Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Staff Workload Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Technician: <strong className="text-white">{user?.name || 'Staff Member'}</strong> • {user?.department || 'Facilities & Maintenance'}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Active Technician Queue</span>
        </div>
      </div>

      {/* Staff Metrics Cards: Assigned, In Progress, Resolved */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard
          title="Assigned Complaints"
          value={assignedToMeCount}
          icon={CheckSquare}
          color="indigo"
          subtitle="Total assigned to you"
        />
        <DashboardCard
          title="In Progress"
          value={inProgressCount}
          icon={RefreshCw}
          color="amber"
          subtitle="Currently servicing"
        />
        <DashboardCard
          title="Resolved"
          value={resolvedCount}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Completed tickets"
        />
      </div>

      {/* Assigned Complaints Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">My Assigned Queue</h2>
          <span className="text-xs text-slate-400">Manage status workflow: Assigned ➔ In Progress ➔ Resolved</span>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching assigned workload from MongoDB..." />
        ) : complaints.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Assigned Workload</h3>
            <p className="text-xs text-slate-400">You currently have no open complaints assigned to your queue.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6">ID & Title</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Location</th>
                    <th className="py-4 px-4">Priority</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Filed On</th>
                    <th className="py-4 px-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {complaints.map((c) => (
                    <tr key={c.id || c.mongoId || c._id} className="hover:bg-slate-900/50 transition-colors group">
                      {/* ID & Title */}
                      <td className="py-4 px-4 sm:px-6 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              {c.id}
                            </span>
                            {c.duplicateOf && (
                              <DuplicateBadge duplicateOf={c.duplicateOf} similarity={c.duplicateSimilarity} />
                            )}
                          </div>
                          <Link
                            to={`/complaint/${c.mongoId || c.id}`}
                            className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 text-sm"
                          >
                            {c.title}
                          </Link>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-300">
                        {c.category}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-400 truncate max-w-[140px]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{c.location}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} />
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>

                      {/* Created */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                        {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString() : 'Today'}
                      </td>

                      {/* Workflow Actions: View, Start Work, Resolve */}
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View */}
                          <Link
                            to={`/complaint/${c.mongoId || c.id}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          {/* Start Work */}
                          {c.status === 'Assigned' && (
                            <button
                              type="button"
                              onClick={() => handleStartWork(c)}
                              className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white transition-colors text-[11px] font-bold flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Start Work</span>
                            </button>
                          )}

                          {/* Resolve */}
                          {c.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() => handleOpenResolve(c)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-[11px] flex items-center gap-1 shadow-md"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Resolve</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Staff Resolution Modal */}
      <StaffResolveModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        complaint={selectedTicket}
        onResolveSuccess={() => fetchStaffComplaints()}
        showToast={showToast}
      />
    </div>
  );
};

export default StaffDashboard;

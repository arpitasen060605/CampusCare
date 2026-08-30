import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import ComplaintCard from '../components/ComplaintCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FileText, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  PlusCircle, 
  BrainCircuit, 
  ArrowRight,
  MapPin,
  Sparkles,
  Filter
} from 'lucide-react';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchStudentData = async () => {
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
            submittedBy: c.submittedBy?.name || user?.name || 'Student',
            submittedAt: c.createdAt,
            assignedStaff: c.assignedTo?.name || 'Unassigned',
            duplicateOf: c.duplicateOf,
            duplicateSimilarity: c.duplicateSimilarity,
            description: c.description,
            aiAnalysis: c.aiSummary ? {
              urgencyScore: c.priority === 'Urgent' || c.priority === 'Critical' ? 92 : c.priority === 'High' ? 82 : 60,
              aiSummary: c.aiSummary,
            } : null,
          }));
          setComplaints(mapped);
        }
      } catch (err) {
        console.warn('[StudentDashboard] Error fetching complaints:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  // Compute 4 Student Metrics: Total, Pending, In Progress, Resolved
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  // Filter complaints based on active status tab
  const filteredComplaints = complaints.filter(c => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return c.status === 'Pending';
    if (statusFilter === 'In Progress') return c.status === 'In Progress' || c.status === 'Assigned';
    if (statusFilter === 'Resolved') return c.status === 'Resolved';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Student Grievance Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {user?.department || 'Computer Science'} • {user?.email}
          </p>
        </div>

        <Link
          to="/submit-complaint"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>File New Complaint</span>
        </Link>
      </div>

      {/* 4 Dashboard Cards: Total, Pending, In Progress, Resolved */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Complaints"
          value={total}
          icon={FileText}
          color="indigo"
          subtitle="Submitted tickets"
        />
        <DashboardCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="cyan"
          subtitle="Awaiting technician review"
        />
        <DashboardCard
          title="In Progress"
          value={inProgress}
          icon={RefreshCw}
          color="amber"
          subtitle="Actively being serviced"
        />
        <DashboardCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Verified & completed"
        />
      </div>

      {/* Complaints Section with Status Tab Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">My Campus Complaints</h2>
            <p className="text-xs text-slate-400">Track real-time 5-stage resolution timeline & technician updates</p>
          </div>
          
          {/* Status Tabs: All, Pending, In Progress, Resolved */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold overflow-x-auto">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  statusFilter === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching your complaints from server..." />
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            title={`No ${statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} complaints found`}
            description="Have a broken lab equipment, Wi-Fi outage, or hostel issue? Report it now."
            actionText="Submit First Complaint"
            onAction={() => window.location.href = '/submit-complaint'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>

      {/* Quick AI & Map Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <BrainCircuit className="w-5 h-5" />
            <span>AI Automated Triage Active</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All submitted complaints are analyzed by Google Gemini AI to tag urgency ratings and route tickets automatically.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <MapPin className="w-5 h-5" />
              <span>Campus Incident Map</span>
            </div>
            <Link to="/map" className="text-xs text-indigo-400 hover:underline font-semibold">
              View Map
            </Link>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Explore live complaint pin clusters across Academic Blocks, Hostels, Library, and Mess facilities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

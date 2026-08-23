import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintTable from '../components/ComplaintTable';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  PlusCircle, 
  LayoutGrid, 
  List, 
  Search 
} from 'lucide-react';
import { complaintsAPI } from '../services/api';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [statusTab, setStatusTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
            status: c.status,
            priority: c.priority,
            submittedBy: c.submittedBy?.name || 'Student',
            submittedAt: c.createdAt,
            assignedStaff: c.assignedTo?.name || 'Unassigned',
            description: c.description,
            aiAnalysis: c.aiSummary ? {
              urgencyScore: c.priority === 'Urgent' ? 92 : c.priority === 'High' ? 82 : 60,
              aiSummary: c.aiSummary,
            } : null,
          }));
          setComplaints(mapped);
        }
      } catch (err) {
        console.warn('[MyComplaints Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((item) => {
    const matchesTab = statusTab === 'All' || item.status.toLowerCase() === statusTab.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Complaints History</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            View all grievances you have logged, track live status updates, and inspect technician notes.
          </p>
        </div>

        <Link
          to="/submit-complaint"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Complaint</span>
        </Link>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold overflow-x-auto">
          {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                statusTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Layout View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search my tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-slate-400">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-indigo-400' : 'hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-indigo-400' : 'hover:text-white'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <LoadingSpinner text="Loading tickets from server..." />
      ) : filteredComplaints.length === 0 ? (
        <EmptyState
          title={`No ${statusTab !== 'All' ? statusTab : ''} complaints found`}
          description="Try clearing your search query or selecting a different status filter."
          actionText="File New Complaint"
          onAction={() => window.location.href = '/submit-complaint'}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((item) => (
            <ComplaintCard key={item.id} complaint={item} />
          ))}
        </div>
      ) : (
        <ComplaintTable complaints={filteredComplaints} />
      )}
    </div>
  );
};

export default MyComplaints;

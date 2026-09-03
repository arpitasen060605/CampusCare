import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  MapPin, 
  Building, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Compass,
  Filter,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { complaintsAPI } from '../services/api';

const DEFAULT_BUILDINGS = [
  { id: 'bld-block-a', name: 'Academic Block A', matchKey: 'block a', lat: 12.9716, lng: 77.5946 },
  { id: 'bld-block-b', name: 'Academic Block B', matchKey: 'block b', lat: 12.9720, lng: 77.5950 },
  { id: 'bld-block-c', name: 'Academic Block C', matchKey: 'block c', lat: 12.9710, lng: 77.5940 },
  { id: 'bld-library', name: 'Central Library', matchKey: 'library', lat: 12.9712, lng: 77.5932 },
  { id: 'bld-science', name: 'Science Block & Labs', matchKey: 'science', lat: 12.9725, lng: 77.5955 },
  { id: 'bld-hostel', name: 'Campus Hostels', matchKey: 'hostel', lat: 12.9740, lng: 77.5970 },
  { id: 'bld-mess', name: 'Central Mess & Canteen', matchKey: 'mess', lat: 12.9705, lng: 77.5925 },
  { id: 'bld-sports', name: 'Sports Complex', matchKey: 'sports', lat: 12.9700, lng: 77.5920 },
  { id: 'bld-admin', name: 'Admin Building', matchKey: 'admin', lat: 12.9695, lng: 77.5915 },
];

const CampusMap = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
          latitude: c.latitude || 12.9716,
          longitude: c.longitude || 77.5946,
          status: c.status,
          priority: c.priority,
          department: c.department || 'Maintenance',
          submittedBy: c.submittedBy?.name || 'Student',
          submittedAt: c.createdAt,
          assignedStaff: c.assignedTo?.name || 'Unassigned',
          description: c.description,
        }));
        setComplaints(mapped);
      }
    } catch (err) {
      console.warn('[CampusMap Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter complaints based on user controls
  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchesSearch = !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  // Calculate building stats dynamically from real complaints
  const buildingNodes = DEFAULT_BUILDINGS.map(bld => {
    const bldTickets = filteredComplaints.filter(c => 
      c.location.toLowerCase().includes(bld.matchKey)
    );
    const criticalCount = bldTickets.filter(c => c.priority === 'Critical').length;
    const activeCount = bldTickets.filter(c => c.status !== 'Resolved').length;

    return {
      ...bld,
      tickets: bldTickets,
      activeCount,
      criticalCount,
      totalCount: bldTickets.length,
    };
  });

  const handleSelectBuilding = (node) => {
    setSelectedBuilding(node);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Geospatial Live MongoDB Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interactive Campus Incident Map</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time geospatial tracking of campus complaints color-coded by priority and filtered by status and category.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>{filteredComplaints.length} Active Spatial Pins</span>
        </div>
      </div>

      {/* Filter Control Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search map location or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 px-2 font-semibold">Priority:</span>
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                priorityFilter === p ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 px-2 font-semibold">Status:</span>
          {['All', 'Pending', 'In Progress', 'Resolved'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                statusFilter === s ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching spatial incident locations from MongoDB..." />
      ) : (
        /* Visual Interactive Campus Map Panel */
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 relative min-h-[420px] bg-slate-950/90 overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Map Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-slate-300 font-semibold">Critical Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-300 font-semibold">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-300 font-semibold">Active Incidents</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300 font-semibold">Resolved</span>
              </div>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">Click campus node to inspect complaints</span>
          </div>

          {/* Dynamic Campus Node Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {buildingNodes.map((bld) => {
              const hasCritical = bld.criticalCount > 0;
              const hasActive = bld.activeCount > 0;

              return (
                <div
                  key={bld.id}
                  onClick={() => handleSelectBuilding(bld)}
                  className={`glass-panel p-6 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] relative overflow-hidden ${
                    hasCritical 
                      ? 'border-rose-500/50 hover:border-rose-400 bg-rose-950/20' 
                      : hasActive 
                      ? 'border-indigo-500/40 hover:border-indigo-400' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-md ${
                      hasCritical 
                        ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' 
                        : hasActive 
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
                        : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    }`}>
                      <Building className="w-5 h-5" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                      hasCritical 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                        : hasActive 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {bld.totalCount} Ticket{bld.totalCount !== 1 ? 's' : ''} ({bld.activeCount} Active)
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                    {bld.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Coordinates: {bld.lat.toFixed(4)} N, {bld.lng.toFixed(4)} E
                  </p>

                  {hasCritical && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                      <Flame className="w-3.5 h-3.5 animate-pulse" />
                      <span>{bld.criticalCount} Critical Priority Alert</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="relative z-10 text-center text-xs text-slate-500 border-t border-slate-900 pt-4 font-mono">
            Interactive Campus Spatial Engine • Powered by Real MongoDB Location Data
          </div>
        </div>
      )}

      {/* Building Node Complaints Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBuilding ? `Complaints in ${selectedBuilding.name}` : 'Building Complaints'}
        maxWidth="max-w-3xl"
      >
        {selectedBuilding && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">Total Location Complaints:</span>
              <span className="font-bold text-white">{selectedBuilding.totalCount}</span>
            </div>

            {selectedBuilding.tickets.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500">
                No complaint tickets currently matching filter at {selectedBuilding.name}.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedBuilding.tickets.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-indigo-400">#{item.id}</span>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        <PriorityBadge priority={item.priority} />
                      </div>
                    </div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono">GPS: ({item.latitude.toFixed(4)}, {item.longitude.toFixed(4)})</span>
                      <Link
                        to={`/complaint/${item.mongoId || item.id}`}
                        onClick={() => setIsModalOpen(false)}
                        className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CampusMap;

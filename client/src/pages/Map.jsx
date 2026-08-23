import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  MapPin, 
  Layers, 
  ExternalLink, 
  Building2, 
  Compass, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search
} from 'lucide-react';
import { complaintsAPI } from '../services/api';

const Map = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMapData = async () => {
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
          if (mapped.length > 0) setSelectedComplaint(mapped[0]);
        }
      } catch (err) {
        console.warn('[Map Page Error]', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const getMarkerColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444'; // Red
      case 'High': return '#f97316';     // Orange
      case 'Medium': return '#f59e0b';   // Yellow
      case 'Low': default: return '#10b981'; // Green
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Incident Spatial Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Location Map</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Interactive spatial visualization of campus complaints color-coded by priority (Critical 🔴, High 🟠, Medium 🟡, Low 🟢).
          </p>
        </div>

        {/* Priority Filter Legend */}
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Map Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search map by title, ID or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                priorityFilter === p ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Map & Details Grid */}
      {loading ? (
        <LoadingSpinner text="Rendering Campus Incident Location Map..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Campus Blueprint Spatial Map View */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 relative min-h-[480px] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* SVG Campus Grid Graphic View */}
            <div className="absolute inset-0 bg-slate-950/80 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Campus Spatial Blueprint (Simulated Incident Map)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{filteredComplaints.length} Pinned Incidents</span>
            </div>

            {/* Simulated Campus Layout Block Canvas */}
            <div className="relative z-10 my-auto py-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {['Academic Block A', 'Academic Block B', 'Library Complex', 'Hostel Block C', 'Sports Arena', 'Central Mess'].map((block, bIdx) => {
                const blockIncidents = filteredComplaints.filter(c => c.location.toLowerCase().includes(block.toLowerCase().split(' ')[0]) || (bIdx === 0 && c.location.includes('Block A')) || (bIdx === 1 && c.location.includes('Block B')));

                return (
                  <div key={block} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 shadow-lg">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span className="truncate">{block}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                        {blockIncidents.length}
                      </span>
                    </div>

                    {/* Priority Colored Markers */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {blockIncidents.length === 0 ? (
                        <span className="text-[10px] text-slate-500 italic">No open incidents</span>
                      ) : (
                        blockIncidents.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setSelectedComplaint(c)}
                            style={{ backgroundColor: getMarkerColor(c.priority) }}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-white font-mono text-[10px] font-bold shadow-lg transition-transform hover:scale-125 ${
                              selectedComplaint?.id === c.id ? 'ring-4 ring-white scale-110 animate-bounce' : ''
                            }`}
                            title={`#${c.id} - ${c.title}`}
                          >
                            {c.priority[0]}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Campus Map Key: Fallback Blueprint View</span>
              <span>Click markers above to view popup card</span>
            </div>
          </div>

          {/* Right Selected Complaint Interactive Popup Card */}
          <div className="lg:col-span-4 space-y-4">
            {selectedComplaint ? (
              <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-5 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                    #{selectedComplaint.id}
                  </span>
                  <PriorityBadge priority={selectedComplaint.priority} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white line-clamp-2">{selectedComplaint.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Marker Detail Popup Metadata */}
                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-semibold text-indigo-300">{selectedComplaint.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[160px]">{selectedComplaint.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-semibold text-amber-300">{selectedComplaint.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assigned To:</span>
                    <span className="font-semibold text-cyan-300">{selectedComplaint.assignedStaff}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Status:</span>
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                </div>

                {/* "View Complaint" Link */}
                <div className="pt-3 border-t border-slate-800">
                  <Link
                    to={`/complaint/${selectedComplaint.mongoId || selectedComplaint.id}`}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>View Complaint</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 text-center rounded-3xl border border-slate-800 text-xs text-slate-400">
                Click any marker on the map to inspect details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;

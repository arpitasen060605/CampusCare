import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  MapPin, 
  Building, 
  Flame, 
  CheckCircle2, 
  BrainCircuit, 
  ArrowRight, 
  Compass,
  AlertTriangle
} from 'lucide-react';
import { mockCampusLocations, mockComplaints } from '../mock/mockData';

const CampusMap = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectBuilding = (bld) => {
    setSelectedBuilding(bld);
    setIsModalOpen(true);
  };

  const getBuildingComplaints = (bldId) => {
    return mockComplaints.filter(c => c.buildingId === bldId || c.location.toLowerCase().includes(bldId.replace('bld-', '')));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">Geospatial Tracking</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interactive Campus Incident Map</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Click any campus node to view active facility issues, critical priority pins, & maintenance status.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>Live GPS Grid Active</span>
        </div>
      </div>

      {/* Simulated Visual Interactive Campus Map Panel */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 relative min-h-[420px] bg-slate-950/90 overflow-hidden flex flex-col justify-between">
        {/* Background Grid Lines Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Map Legend */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-slate-300 font-semibold">Critical Pin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-slate-300 font-semibold">Active Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300 font-semibold">All Clear</span>
            </div>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">Click building marker to inspect</span>
        </div>

        {/* Interactive Campus Node Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {mockCampusLocations.map((bld) => {
            const hasCritical = bld.criticalCount > 0;
            const hasActive = bld.activeComplaints > 0;

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
                    {bld.activeComplaints} Active Ticket{bld.activeComplaints !== 1 ? 's' : ''}
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

        {/* Map Footer Info */}
        <div className="relative z-10 text-center text-xs text-slate-500 border-t border-slate-900 pt-4 font-mono">
          Interactive Geospatial Campus Map Engine • Synchronized with Gemini AI Location Routing
        </div>
      </div>

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
              <span className="text-slate-400">Total Active Complaints:</span>
              <span className="font-bold text-white">{selectedBuilding.activeComplaints}</span>
            </div>

            {getBuildingComplaints(selectedBuilding.id).length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500">
                No active complaint tickets reported at {selectedBuilding.name}.
              </p>
            ) : (
              <div className="space-y-3">
                {getBuildingComplaints(selectedBuilding.id).map((item) => (
                  <div key={item.id} className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-indigo-400">{item.id}</span>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        <PriorityBadge priority={item.priority} />
                      </div>
                    </div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.description}</p>
                    <div className="pt-2 flex justify-end">
                      <Link
                        to={`/complaint/${item.id}`}
                        onClick={() => setIsModalOpen(false)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
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

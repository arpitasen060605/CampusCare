import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import DuplicateBadge from './DuplicateBadge';
import { ExternalLink, User, MapPin } from 'lucide-react';

const ComplaintTable = ({ complaints = [], onStatusUpdate, showStaffActions = false }) => {
  if (!complaints || complaints.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-4 px-4 sm:px-6">ID & Title</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Location</th>
              <th className="py-4 px-4">Priority</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Assigned Staff</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {complaints.map((c) => (
              <tr key={c.id || c._id} className="hover:bg-slate-900/50 transition-colors group">
                {/* ID & Title */}
                <td className="py-4 px-4 sm:px-6 max-w-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {c.id || c.complaintId}
                      </span>
                      {c.duplicateOf && (
                        <DuplicateBadge duplicateOf={c.duplicateOf} similarity={c.duplicateSimilarity} />
                      )}
                    </div>
                    <Link
                      to={`/complaint/${c.mongoId || c._id || c.id}`}
                      className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 block text-sm"
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
                <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{c.location}</span>
                  </div>
                </td>

                {/* Priority */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <PriorityBadge priority={c.priority} />
                </td>

                {/* Status */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {showStaffActions && onStatusUpdate ? (
                    <select
                      value={c.status}
                      onChange={(e) => onStatusUpdate(c.id || c._id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    <StatusBadge status={c.status} />
                  )}
                </td>

                {/* Assigned Staff */}
                <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{c.assignedStaff || 'Unassigned'}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 whitespace-nowrap text-right">
                  <Link
                    to={`/complaint/${c.mongoId || c._id || c.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;

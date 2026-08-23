import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import AIBadge from './AIBadge';
import DuplicateBadge from './DuplicateBadge';
import { MapPin, ArrowRight, User } from 'lucide-react';

const ComplaintCard = ({ complaint }) => {
  if (!complaint) return null;

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
            #{complaint.id}
          </span>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>

        {/* AI Visual Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <AIBadge type="analyzed" label="🤖 AI Analyzed" size="sm" />
          <AIBadge type="priority" label="⚡ Priority Detected" size="sm" />
          {complaint.duplicateOf && (
            <DuplicateBadge duplicateOf={complaint.duplicateOf} similarity={complaint.duplicateSimilarity} />
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
          {complaint.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>

        {/* Location & Metadata */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{complaint.location}</span>
          </div>

          <span className="font-semibold text-indigo-300 shrink-0">
            {complaint.category}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="text-[11px] text-slate-500 font-mono">
          {complaint.submittedAt ? new Date(complaint.submittedAt).toLocaleDateString() : 'Today'}
        </div>

        <Link
          to={`/complaint/${complaint.mongoId || complaint.id}`}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 group-hover:bg-indigo-600 border border-slate-700/80 text-slate-300 group-hover:text-white font-bold transition-all flex items-center gap-1 shadow-md"
        >
          <span>Track Ticket</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ComplaintCard;

import React from 'react';
import { Flame, AlertTriangle, ArrowUpRight, Minus } from 'lucide-react';

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = () => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'critical':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-900/20',
          icon: <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />,
          label: 'Urgent'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-orange-900/20',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
          label: 'High'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-900/20',
          icon: <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Medium'
        };
      case 'low':
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <Minus className="w-3.5 h-3.5 text-slate-400" />,
          label: 'Low'
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border shadow-sm ${config.bg}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default PriorityBadge;

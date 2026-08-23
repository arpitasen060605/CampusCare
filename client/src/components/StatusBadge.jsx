import React from 'react';
import { Clock, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'in progress':
      case 'in_progress':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" />,
          label: 'In Progress'
        };
      case 'resolved':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Resolved'
        };
      case 'rejected':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: 'Rejected'
        };
      case 'pending':
      default:
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: 'Pending'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;

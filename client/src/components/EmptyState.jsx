import React from 'react';
import { Inbox, Plus } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No complaints found',
  description = 'There are no active records matching your criteria.',
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 border border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{description}</p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;

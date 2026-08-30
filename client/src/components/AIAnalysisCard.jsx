import React from 'react';
import { 
  BrainCircuit, 
  Zap, 
  Layers, 
  Building2, 
  FileText, 
  ShieldCheck,
  Search,
  Target,
  Sparkles
} from 'lucide-react';
import AIBadge from './AIBadge';

const AIAnalysisCard = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-5 shadow-2xl relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Google Gemini AI Triage</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </h3>
            <p className="text-[11px] text-slate-400">Automated classification, priority detection & department routing</p>
          </div>
        </div>
      </div>

      {/* AI Visual Badges Grid */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <AIBadge type="analyzed" label="🤖 AI Analyzed" size="sm" />
        <AIBadge type="priority" label="⚡ Priority Detected" size="sm" />
        <AIBadge type="duplicate" label="🔍 Duplicate Check" size="sm" />
        <AIBadge type="routed" label="🎯 Automatically Routed" size="sm" />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Category */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Category</span>
          </div>
          <div className="font-bold text-white text-sm">{analysis.category || 'Maintenance'}</div>
        </div>

        {/* Priority */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Priority Rating</span>
          </div>
          <div className="font-bold text-amber-400 text-sm">{analysis.priority || 'High'}</div>
        </div>

        {/* Routed Department */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Routed Department</span>
          </div>
          <div className="font-bold text-emerald-300 text-sm">{analysis.department || 'Maintenance'}</div>
        </div>
      </div>

      {/* Executive AI Summary */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Executive AI Summary</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 font-medium">
          "{analysis.summary || 'Complaint analyzed and tagged for department routing.'}"
        </p>
      </div>

      {/* Priority Reason */}
      {analysis.priorityReason && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Priority Allocation Rationale</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
            {analysis.priorityReason}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisCard;

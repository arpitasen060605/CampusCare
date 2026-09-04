import React from 'react';
import { Sparkles, BrainCircuit, Zap, Search, Target } from 'lucide-react';

const AIBadge = ({ label = 'AI Analyzed', type = 'analyzed', size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'priority':
        return {
          icon: Zap,
          text: label || '⚡ Priority Detected',
          classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          iconColor: 'text-amber-400',
        };
      case 'duplicate':
        return {
          icon: Search,
          text: label || '🔍 Duplicate Check',
          classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          iconColor: 'text-cyan-400',
        };
      case 'routed':
        return {
          icon: Target,
          text: label || '🎯 Automatically Routed',
          classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          iconColor: 'text-emerald-400',
        };
      case 'analyzed':
      default:
        return {
          icon: BrainCircuit,
          text: label || '🤖 AI Analyzed',
          classes: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          iconColor: 'text-indigo-400',
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[10px] gap-1' 
    : 'px-3 py-1 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold tracking-wide transition-all shadow-sm ${config.classes} ${sizeClasses}`}>
      <IconComponent className={`w-3.5 h-3.5 ${config.iconColor} shrink-0 animate-pulse`} />
      <span>{config.text}</span>
    </span>
  );
};

export const AILoadingAnimation = ({ message = 'AI is analyzing your complaint...' }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-4 text-center">
      <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
          <BrainCircuit className="w-6 h-6 animate-spin" />
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
          <span> Gemini AI Triage Active</span>
        </h4>
        <p className="text-xs text-slate-400">{message}</p>
      </div>
    </div>
  );
};

export default AIBadge;
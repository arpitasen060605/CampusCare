import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, text = 'Loading data...' }) => {
  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-400 animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-6">
      <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
      <span className="text-sm text-slate-400 font-medium">{text}</span>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
    <div className="h-4 bg-slate-800 rounded w-1/3" />
    <div className="h-6 bg-slate-800 rounded w-2/3" />
    <div className="h-4 bg-slate-800 rounded w-full" />
    <div className="h-10 bg-slate-800 rounded w-full mt-4" />
  </div>
);

export default LoadingSpinner;

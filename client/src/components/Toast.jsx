import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getConfig = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-slate-900 border-rose-500/40 text-rose-300',
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
        };
      case 'info':
        return {
          bg: 'bg-slate-900 border-cyan-500/40 text-cyan-300',
          icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
        };
      case 'success':
      default:
        return {
          bg: 'bg-slate-900 border-emerald-500/40 text-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
        };
    }
  };

  const config = getConfig();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl ${config.bg} max-w-md`}>
        {config.icon}
        <span className="text-sm font-medium text-slate-100 flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

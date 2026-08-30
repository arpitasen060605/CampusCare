import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, color = 'indigo', subtitle }) => {
  const getColorStyles = () => {
    switch (color) {
      case 'emerald':
        return {
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          glow: 'from-emerald-600/10 via-transparent to-transparent',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          glow: 'from-amber-600/10 via-transparent to-transparent',
        };
      case 'rose':
        return {
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          glow: 'from-rose-600/10 via-transparent to-transparent',
        };
      case 'cyan':
        return {
          iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          glow: 'from-cyan-600/10 via-transparent to-transparent',
        };
      case 'indigo':
      default:
        return {
          iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          glow: 'from-indigo-600/10 via-transparent to-transparent',
        };
    }
  };

  const style = getColorStyles();

  return (
    <div className="relative glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl overflow-hidden group hover:border-slate-700 transition-all duration-300">
      {/* Background glow gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.glow} rounded-bl-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${style.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`inline-flex items-center text-xs font-semibold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
            {trendValue}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 leading-tight">{subtitle}</p>
      )}
    </div>
  );
};

export default DashboardCard;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  CheckSquare, 
  BarChart3, 
  MapPin, 
  UserCheck, 
  ShieldAlert, 
  Settings,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ role = 'Student', isOpen = true, onClose }) => {
  const getNavItems = () => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return [
          { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Manage Complaints', path: '/admin/complaints', icon: FileText },
          { label: 'Staff Queue', path: '/staff/dashboard', icon: UserCheck },
          { label: 'Analytics Hub', path: '/analytics', icon: BarChart3 },
          { label: 'Campus Map', path: '/map', icon: MapPin },
        ];
      case 'staff':
        return [
          { label: 'Staff Workload Queue', path: '/staff/dashboard', icon: CheckSquare },
          { label: 'Campus Analytics', path: '/analytics', icon: BarChart3 },
          { label: 'Campus Map', path: '/map', icon: MapPin },
        ];
      case 'student':
      default:
        return [
          { label: 'Student Overview', path: '/student/dashboard', icon: LayoutDashboard },
          { label: 'Submit Complaint', path: '/submit-complaint', icon: PlusCircle },
          { label: 'My Complaints', path: '/my-complaints', icon: FileText },
          { label: 'Campus Map', path: '/map', icon: MapPin },
          { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        ];
    }
  };

  const items = getNavItems();

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-950/90 glass-panel border-r border-slate-800/80 transform transition-transform duration-200 ease-in-out flex flex-col justify-between ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="p-4 space-y-6">
        {/* Role badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Role View</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {role}
          </span>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Navigation Menu
          </span>
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4">
        <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-center justify-between px-1">
          <span className="font-mono">v1.0.0</span>
          <span>Campus Portal</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

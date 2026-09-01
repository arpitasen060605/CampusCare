import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FilePlus, 
  ListOrdered, 
  BarChart3, 
  MapPin, 
  LogOut, 
  UserCheck, 
  Menu, 
  X, 
  Sparkles,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ showToast }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    if (showToast) showToast('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const roleBadgeColors = {
    admin: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    staff: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    student: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="font-black text-white text-base sm:text-lg tracking-tight">
                <span>Smart Complaint</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold hidden sm:block">Campus Grievance System</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold">
              {/* Student Role Links */}
              {user?.role === 'student' && (
                <>
                  <Link
                    to="/student/dashboard"
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      isActive('/student/dashboard') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/submit-complaint"
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      isActive('/submit-complaint') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>File Complaint</span>
                  </Link>
                  <Link
                    to="/my-complaints"
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      isActive('/my-complaints') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4" />
                    <span>My Complaints</span>
                  </Link>
                </>
              )}

              {/* Staff Role Links */}
              {user?.role === 'staff' && (
                <Link
                  to="/staff/dashboard"
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    isActive('/staff/dashboard') ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Staff Workload</span>
                </Link>
              )}

              {/* Admin Role Links */}
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      isActive('/admin/dashboard') ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Workspace</span>
                  </Link>
                  <Link
                    to="/admin/complaints"
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      isActive('/admin/complaints') ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4" />
                    <span>All Complaints</span>
                  </Link>
                </>
              )}

              {/* Common Links: Analytics & Map */}
              <Link
                to="/analytics"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive('/analytics') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
              <Link
                to="/map"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive('/map') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Campus Map</span>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4 text-xs font-bold">
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* User Profile & Logout (Desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-white leading-tight">{user?.name}</div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-wider ${roleBadgeColors[user?.role] || roleBadgeColors.student}`}>
                  {user?.role}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-600/20 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-wider ${roleBadgeColors[user?.role] || roleBadgeColors.student}`}>
                {user?.role}
              </span>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 p-4 space-y-3 text-xs font-semibold animate-fadeIn">
          {isAuthenticated ? (
            <>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{user?.name}</div>
                  <div className="text-[11px] text-slate-400">{user?.email}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {user?.role === 'student' && (
                  <>
                    <Link
                      to="/student/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/submit-complaint"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                    >
                      <FilePlus className="w-4 h-4 text-cyan-400" />
                      <span>File Complaint</span>
                    </Link>
                    <Link
                      to="/my-complaints"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                    >
                      <ListOrdered className="w-4 h-4 text-emerald-400" />
                      <span>My Complaints</span>
                    </Link>
                  </>
                )}

                {user?.role === 'staff' && (
                  <Link
                    to="/staff/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-2 col-span-2"
                  >
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Staff Workload Portal</span>
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-rose-400" />
                      <span>Admin Workspace</span>
                    </Link>
                    <Link
                      to="/admin/complaints"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                    >
                      <ListOrdered className="w-4 h-4 text-rose-400" />
                      <span>All Complaints</span>
                    </Link>
                  </>
                )}

                <Link
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span>Analytics</span>
                </Link>
                <Link
                  to="/map"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Campus Map</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-center font-bold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-indigo-600 text-white text-center font-bold"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

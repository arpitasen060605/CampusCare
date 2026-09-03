import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Mail, Lock, Building, BadgeInfo, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = ({ showToast }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'Computer Science',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const newUser = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role,
        department: formData.department,
      });

      showToast(`Account registered successfully! Welcome ${newUser.name}!`);
      
      if (newUser.role === 'admin') navigate('/admin/dashboard');
      else if (newUser.role === 'staff') navigate('/staff/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      console.error('[Register Error]', err);
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Portal Account</h2>
          <p className="text-xs text-slate-400">Join your campus AI grievance resolution portal</p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          {['Student', 'Staff', 'Admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r.toLowerCase())}
              className={`py-2 rounded-lg transition-all capitalize ${
                role === r.toLowerCase() ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Aarav Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Campus Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Electrical">Electrical</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Security">Security</option>
                <option value="IT">IT</option>
                <option value="Administration">Administration</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="•••••••• (Min 6 chars)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register & Access Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

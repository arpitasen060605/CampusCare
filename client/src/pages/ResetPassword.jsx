import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { authAPI } from '../services/api';

const ResetPassword = ({ showToast }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Password reset token is missing or invalid. Please request a new link.');
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMsg('Please enter and confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check and try again.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.resetPassword({ token, password });
      setResetSuccess(true);
      if (showToast) showToast(res.data?.message || 'Password updated successfully!');
    } catch (err) {
      console.error('[Reset Password Error]', err);
      const msg = err.response?.data?.message || 'Invalid or expired reset token. Please request a new link.';
      setErrorMsg(msg);
      if (showToast) showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {resetSuccess ? 'Password Reset Successful' : 'Set New Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {resetSuccess
              ? 'Your password has been updated successfully.'
              : 'Enter a strong new password for your campus portal account.'}
          </p>
        </div>

        {/* Missing Token Alert */}
        {!token && !resetSuccess && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Missing reset token in link. Please click the full link sent to your email.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {resetSuccess ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-semibold text-sm text-white">Account Password Updated</p>
              <p>You can now sign in to your Smart Complaint portal account using your new password.</p>
            </div>
            <Link
              to="/login"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 chars)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

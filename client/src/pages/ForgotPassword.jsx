import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowRight, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../services/api';

const ForgotPassword = ({ showToast }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.trim()) {
      setErrorMsg('Please enter your campus email address.');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.forgotPassword(email.trim());
      setSubmitted(true);
      if (showToast) showToast(res.data?.message || 'Instructions sent to your email');
    } catch (err) {
      console.error('[Forgot Password Error]', err);
      const msg = err.response?.data?.message || 'Failed to send reset email. Please try again.';
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
          <h2 className="text-2xl font-extrabold text-white">Forgot Password?</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Enter your registered campus email and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-semibold text-sm text-white">Reset Link Dispatched</p>
              <p>If an account exists for <strong>{email}</strong>, a password reset link has been sent. Please check your inbox.</p>
            </div>
            <Link
              to="/login"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Campus Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered campus email"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
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
                  <span>Sending Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
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

export default ForgotPassword;

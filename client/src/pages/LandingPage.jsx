import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  BrainCircuit, 
  Flame, 
  CopyCheck, 
  GitFork, 
  Clock, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2,
  Users,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-blue-600/20 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] max-w-5xl mx-auto">
          Report Problems. <br className="hidden sm:inline" />
          <span className="gradient-text">We Make Sure They're Solved.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          AI-powered complaint management for smarter campuses and communities.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/submit-complaint"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span>Submit a Complaint</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link 
            to="/student/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-base border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Student Portal</span>
          </Link>
        </div>
      </section>

      {/* Visual Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">Automated Resolution Pipeline</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">How Smart Complaint Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'Report', desc: 'Student or faculty submits complaint with photo attachments.', icon: Zap },
            { step: '02', title: 'AI Understands', desc: 'Gemini AI analyzes urgency, confidence, & context.', icon: BrainCircuit },
            { step: '03', title: 'Automatically Routed', desc: 'Smart routing sends issue to appropriate department.', icon: GitFork },
            { step: '04', title: 'Assigned', desc: 'Available technician dispatched with priority SLA.', icon: Users },
            { step: '05', title: 'Resolved', desc: 'Work verified and live notification sent to reporter.', icon: CheckCircle2 },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 relative group hover:border-indigo-500/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {item.step}
                  </span>
                  <Icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Cards Grid (Requested 6 Features) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built with <span className="gradient-text">6 Core Innovations</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Eliminating long delays, lost tickets, and manual routing headaches across campus facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Complaint Understanding</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gemini AI extracts context, key entities, and intent from raw text reports to generate executive summaries.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Priority Detection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Flags safety hazards, electrical risks, and large-impact outages as Urgent/High priority automatically.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <CopyCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Duplicate Detection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Detects when multiple students report the same broken facility and clusters them into a single parent ticket.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Automatic Department Routing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Directs plumbing issues to Maintenance, Wi-Fi errors to IT, and mess hygiene reports to Food Inspection.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Step-by-step progress timeline updates keep students informed from inspection to final closure.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Impact Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Interactive Recharts dashboards help deans & administrators monitor resolution SLAs and department benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Role Portal Links Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/30 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Experience Next-Gen Complaint Management?
            </h3>
            <p className="text-slate-300 text-sm">
              Log in as Student, Staff Technician, or Campus Admin to explore the complete interactive portal.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/student/dashboard" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all">
              Student Portal
            </Link>
            <Link to="/staff/dashboard" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all">
              Staff Queue
            </Link>
            <Link to="/admin/dashboard" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold shadow-lg shadow-cyan-600/30 transition-all">
              Admin Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

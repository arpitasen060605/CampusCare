import React from 'react';
import { 
  ShieldAlert, 
  BrainCircuit, 
  BarChart3, 
  Clock, 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  Lock, 
  Layers,
  ArrowRight,
  Database,
  Server
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const mockAnalyticsData = [
  { day: 'Mon', complaints: 12, resolved: 10 },
  { day: 'Tue', complaints: 19, resolved: 15 },
  { day: 'Wed', complaints: 15, resolved: 14 },
  { day: 'Thu', complaints: 22, resolved: 18 },
  { day: 'Fri', complaints: 28, resolved: 25 },
  { day: 'Sat', complaints: 10, resolved: 9 },
  { day: 'Sun', complaints: 8, resolved: 8 },
];

const Home = ({ healthData, healthLoading, healthError, refetchHealth }) => {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        {/* Glow background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/20 via-blue-600/20 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs font-semibold text-indigo-300 border border-indigo-500/30 mb-8 animate-pulse-slow">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Next-Gen Campus Grievance Portal</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-slate-400">Powered by Gemini AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] max-w-5xl mx-auto">
          Smart <span className="gradient-text">Complaint Management</span> System
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          An intelligent AI-driven resolution platform designed for colleges & campuses. Report issues, automatically triage with Gemini AI, track progress in real-time, and gain actionable administrative analytics.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => alert('Submit Complaint feature initialized in Phase 1!')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span>Log a Complaint</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <a 
            href="#health-status"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-base border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Server className="w-5 h-5 text-indigo-400" />
            <span>Check API Health</span>
          </a>
        </div>
      </section>

      {/* Real-Time Health Check & API Monitor Card */}
      <section id="health-status" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-widest font-semibold">
                <Server className="w-4 h-4 text-cyan-400" />
                Backend Endpoint Status (GET /api/health)
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">Live Health Check Monitor</h2>
            </div>
            
            <button 
              onClick={refetchHealth}
              disabled={healthLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          {healthLoading ? (
            <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm">Connecting to backend server on port 5000...</p>
            </div>
          ) : healthError ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Unable to connect to Backend Server</p>
                <p className="text-xs text-rose-400/80 mt-1">Make sure the Express server is running on `http://localhost:5000` via `npm run dev:server`.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Server Status */}
              <div className="p-4 rounded-xl glass-card border border-slate-800/80">
                <div className="text-xs text-slate-400 font-medium">Server API Status</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{healthData?.status || 'OK'}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Online
                  </span>
                </div>
                <div className="mt-3 text-[11px] text-slate-400 font-mono">
                  Uptime: {healthData?.system?.uptimeSeconds || 0}s
                </div>
              </div>

              {/* Database Status */}
              <div className="p-4 rounded-xl glass-card border border-slate-800/80">
                <div className="text-xs text-slate-400 font-medium">MongoDB Connection</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-white capitalize">{healthData?.database?.status || 'Checking'}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    healthData?.database?.isHealthy 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <Database className="w-3.5 h-3.5" />
                    {healthData?.database?.isHealthy ? 'Connected' : 'Offline'}
                  </span>
                </div>
                <div className="mt-3 text-[11px] text-slate-400 font-mono">
                  Mongoose Driver Ready
                </div>
              </div>

              {/* Environment info */}
              <div className="p-4 rounded-xl glass-card border border-slate-800/80">
                <div className="text-xs text-slate-400 font-medium">Timestamp & Env</div>
                <div className="mt-2 text-sm font-semibold text-indigo-300 uppercase tracking-wide">
                  {healthData?.environment || 'Development'}
                </div>
                <div className="mt-3 text-[11px] text-slate-400 font-mono truncate">
                  {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : 'N/A'}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Key Feature Cards Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Designed for <span className="gradient-text">Speed, Transparency</span> & AI Intelligence
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Everything students, faculty, and campus administrators need to manage maintenance, academic, hostel, and IT complaints effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gemini AI Auto-Triage</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI automatically classifies complaints by urgency (Low, Medium, Critical), extracts key details, and assigns them to the right campus department.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <FileUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multer File Attachments</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Attach image evidence, photos of broken equipment, or PDF receipts directly with your complaints for fast verification.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">JWT & bcrypt Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Role-based access control (Student, Department Manager, Admin) secured with JSON Web Tokens and encrypted passwords.
            </p>
          </div>
        </div>
      </section>

      {/* Analytics Visualization Preview with Recharts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
              <BarChart3 className="w-4 h-4" /> Recharts Analytics Integration
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Real-Time Complaint Resolution Insights
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Campus administrators can monitor resolution metrics, bottleneck departments, and peak grievance hours using interactive data charts.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span>Logged Issues</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span>Resolved Issues</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 h-64 w-full bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAnalyticsData}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="complaints" stroke="#6366f1" fillOpacity={1} fill="url(#colorComplaints)" />
                <Area type="monotone" dataKey="resolved" stroke="#22d3ee" fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section id="tech-stack" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest font-semibold text-slate-500">Configured Tech Stack</span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-80">
          {['React 18', 'Vite', 'Tailwind CSS', 'React Router', 'Axios', 'Lucide React', 'Recharts', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Gemini AI'].map((tech, idx) => (
            <span key={idx} className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Flame,
  Calendar,
  Building2,
  PieChart as PieIcon,
  BarChart3,
  Layers
} from 'lucide-react';
import { analyticsAPI } from '../services/api';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d'); // '7d', '30d', '90d', 'all'
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
    criticalPriority: 0,
    resolutionRate: '0.0%',
    avgResolutionTime: '0.0 hrs',
  });
  const [charts, setCharts] = useState({
    byCategory: [],
    byDepartment: [],
    byPriority: [],
    overTime: [],
    resolvedVsUnresolved: [],
  });
  const [departmentPerformance, setDepartmentPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (rangeVal) => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getDashboard(rangeVal);
      if (res.data && res.data.success) {
        setStats(res.data.stats || {});
        setCharts(res.data.charts || {});
        setDepartmentPerformance(res.data.departmentPerformance || []);
      }
    } catch (err) {
      console.warn('[Analytics Page Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(dateRange);
  }, [dateRange]);

  return (
    <div className="space-y-8">
      {/* Top Banner with Date Filter Controls */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>MongoDB Real-Time Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Analytics Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time analytics, resolution times, SLA performance, and spatial incident distributions calculated from database.
          </p>
        </div>

        {/* Date Filter Tabs: 7 days, 30 days, 90 days, All time */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'all', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateRange(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                dateRange === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Executing MongoDB Aggregation Pipelines..." />
      ) : (
        <>
          {/* Top 7 Statistics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <DashboardCard
              title="Total Complaints"
              value={stats.total}
              icon={FileText}
              color="indigo"
              subtitle="Received tickets"
            />
            <DashboardCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              color="emerald"
              subtitle="Closed tickets"
            />
            <DashboardCard
              title="Pending Review"
              value={stats.pending}
              icon={Clock}
              color="cyan"
              subtitle="Unassigned queue"
            />
            <DashboardCard
              title="High Priority"
              value={stats.highPriority}
              icon={AlertTriangle}
              color="amber"
              subtitle="Elevated tickets"
            />
            <DashboardCard
              title="Critical Priority"
              value={stats.criticalPriority}
              icon={Flame}
              color="rose"
              subtitle="Emergency triage"
            />
            <DashboardCard
              title="Avg Resolution Time"
              value={stats.avgResolutionTime}
              icon={Clock}
              color="purple"
              subtitle="Turnaround SLA"
            />
            <DashboardCard
              title="Resolution Rate"
              value={stats.resolutionRate}
              icon={TrendingUp}
              color="emerald"
              subtitle="Completion %"
            />
          </div>

          {/* Row 1 Charts: Complaints Over Time & Resolved vs Unresolved */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 1. Complaints Over Time AreaChart */}
            <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>Complaints Intake & Resolution Over Time</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Monthly Trend</span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.overTime}>
                    <defs>
                      <linearGradient id="receivedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="received" stroke="#6366f1" fillOpacity={1} fill="url(#receivedGrad)" name="Tickets Filed" />
                    <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#resolvedGrad)" name="Tickets Resolved" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Resolved vs Unresolved PieChart */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <span>Resolved vs Unresolved</span>
              </h3>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.resolvedVsUnresolved}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {charts.resolvedVsUnresolved.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2 Charts: Complaints by Department & Complaints by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 3. Complaints by Department BarChart */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Complaints Workload by Department</span>
              </h3>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.byDepartment}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} name="Total Intake" />
                    <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. Complaints by Priority Donut Chart */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Complaints Breakdown by Priority</span>
              </h3>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.byPriority}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {charts.byPriority.map((entry, index) => (
                        <Cell key={`cell-pr-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Department Performance Matrix Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Department Operational Performance Matrix</span>
              </h2>
              <span className="text-xs text-slate-400">Calculated directly from MongoDB Mongoose aggregation</span>
            </div>

            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-4 px-4 sm:px-6">Department</th>
                      <th className="py-4 px-4">Total Complaints</th>
                      <th className="py-4 px-4">Resolved</th>
                      <th className="py-4 px-4">Pending</th>
                      <th className="py-4 px-4">Resolution Rate</th>
                      <th className="py-4 px-4 text-right">Avg Resolution Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {departmentPerformance.map((dept) => {
                      const rate = dept.total > 0 ? ((dept.resolved / dept.total) * 100).toFixed(1) : 0;
                      return (
                        <tr key={dept.department} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-bold text-white">
                            {dept.department}
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-200">
                            {dept.total}
                          </td>
                          <td className="py-4 px-4 font-mono text-emerald-400 font-bold">
                            {dept.resolved}
                          </td>
                          <td className="py-4 px-4 font-mono text-cyan-400">
                            {dept.pending}
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-300">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                              <span>{rate}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-mono text-amber-300 font-bold">
                            {dept.avgResolutionTime}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;

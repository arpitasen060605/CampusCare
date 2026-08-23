import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import AdminComplaintsTable from '../components/AdminComplaintsTable';
import LoadingSpinner from '../components/LoadingSpinner';
import AssignStaffModal from '../components/AssignStaffModal';
import MarkDuplicateModal from '../components/MarkDuplicateModal';
import { 
  FileText, 
  CheckCircle2, 
  Percent, 
  Clock, 
  Flame, 
  BarChart3, 
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Building2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar
} from 'recharts';
import { analyticsAPI, complaintsAPI } from '../services/api';

const AdminDashboard = ({ showToast }) => {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    resolutionRate: '0.0%',
    avgResolutionTime: '0.0 hrs',
    highPriority: 0,
  });

  const [charts, setCharts] = useState({
    byDepartment: [],
    byCategory: [],
    byPriority: [],
    overTime: [],
    resolutionDistribution: [],
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, compRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        complaintsAPI.getAll(),
      ]);

      if (dashRes.data && dashRes.data.stats) {
        setStats(dashRes.data.stats);
      }
      if (dashRes.data && dashRes.data.charts) {
        setCharts(dashRes.data.charts);
      }

      if (compRes.data && compRes.data.complaints) {
        const mapped = compRes.data.complaints.map(c => ({
          id: c.complaintId || c._id,
          mongoId: c._id,
          title: c.title,
          category: c.category,
          location: c.location,
          department: c.department || 'Maintenance',
          status: c.status,
          priority: c.priority,
          submittedBy: c.submittedBy?.name || 'Student',
          submittedAt: c.createdAt,
          assignedStaff: c.assignedTo?.name || 'Unassigned',
          duplicateOf: c.duplicateOf,
          duplicateSimilarity: c.duplicateSimilarity,
          description: c.description,
        }));
        setComplaints(mapped);
      }
    } catch (err) {
      console.warn('[AdminDashboard Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleOpenAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setIsAssignModalOpen(true);
  };

  const handleOpenDuplicate = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDuplicateModalOpen(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const target = complaints.find(c => c.id === id || c.mongoId === id);
      const targetId = target ? (target.mongoId || target.id) : id;
      await complaintsAPI.updateStatus(targetId, newStatus);
      if (showToast) showToast(`Updated ticket status to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      console.error('[Status Update Error]', err);
      if (showToast) showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">Executive Campus Analytics</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Control Center</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time MongoDB analytics, SLA metrics, department distributions, & complaint management.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>MongoDB Live Stream</span>
        </div>
      </div>

      {/* 5 Required Dashboard Cards: Total, Resolved, Resolution Rate, Avg Time, High Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Complaints"
          value={stats.total}
          icon={FileText}
          color="indigo"
          subtitle="Total logged tickets"
        />
        <DashboardCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Closed successfully"
        />
        <DashboardCard
          title="Resolution Rate"
          value={stats.resolutionRate}
          icon={Percent}
          color="cyan"
          subtitle="Target SLA: >80%"
        />
        <DashboardCard
          title="Avg Resolution Time"
          value={stats.avgResolutionTime}
          icon={Clock}
          color="amber"
          subtitle="Target SLA: <6.0 hrs"
        />
        <DashboardCard
          title="High Priority"
          value={stats.highPriority}
          icon={Flame}
          color="rose"
          subtitle="Urgent & Critical tickets"
        />
      </div>

      {/* 5 Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Complaints Over Time (AreaChart) - Col 8 */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>1. Complaints Volume Over Time</span>
              </h3>
              <p className="text-xs text-slate-400">Monthly ticket intake vs resolution count</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.overTime}>
                <defs>
                  <linearGradient id="overTimeIntake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="overTimeResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="received" stroke="#6366f1" fillOpacity={1} fill="url(#overTimeIntake)" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#overTimeResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Complaints by Category (PieChart) - Col 4 */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            <span>2. Complaints by Category</span>
          </h3>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {charts.byCategory.map((entry, idx) => (
                    <Cell key={`cat-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {charts.byCategory.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400 font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Complaints by Department (BarChart) - Col 6 */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>3. Complaints by Department</span>
          </h3>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.byDepartment}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Complaints by Priority (Donut Chart) - Col 3 */}
        <div className="lg:col-span-3 glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>4. Priority Breakdown</span>
          </h3>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.byPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {charts.byPriority.map((entry, idx) => (
                    <Cell key={`prio-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {charts.byPriority.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono text-slate-400 font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 5: Resolution Status Distribution - Col 3 */}
        <div className="lg:col-span-3 glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>5. Resolution Distribution</span>
          </h3>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.resolutionDistribution} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={90} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Overall SLA Rate:</span>
            <strong className="text-emerald-400 font-mono font-bold text-sm">{stats.resolutionRate}</strong>
          </div>
        </div>
      </div>

      {/* Professional Complaints Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Campus Complaints Directory</h2>
          <span className="text-xs text-slate-400">Manage assignments, statuses, & duplicate links</span>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching real-time MongoDB complaints..." />
        ) : (
          <AdminComplaintsTable
            complaints={complaints}
            onOpenAssignModal={handleOpenAssign}
            onOpenDuplicateModal={handleOpenDuplicate}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>

      {/* Staff Assignment Modal */}
      <AssignStaffModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        complaint={selectedComplaint}
        onAssignmentSuccess={() => fetchAdminData()}
        showToast={showToast}
      />

      {/* Mark Duplicate Modal */}
      <MarkDuplicateModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        complaint={selectedComplaint}
        onDuplicateMarked={() => fetchAdminData()}
        showToast={showToast}
      />
    </div>
  );
};

export default AdminDashboard;

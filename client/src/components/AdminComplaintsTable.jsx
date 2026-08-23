import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import DuplicateBadge from './DuplicateBadge';
import AIBadge from './AIBadge';
import { 
  Search, 
  UserCheck, 
  Copy, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Building2
} from 'lucide-react';

const AdminComplaintsTable = ({
  complaints = [],
  onOpenAssignModal,
  onOpenDuplicateModal,
  onStatusUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Filter complaints dynamically
  const filtered = complaints.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const matchesDepartment = departmentFilter === 'All' || item.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'All' && item.submittedAt) {
      const itemDate = new Date(item.submittedAt);
      const now = new Date();
      const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
      if (dateFilter === 'Today') matchesDate = diffDays <= 1;
      if (dateFilter === 'Last7') matchesDate = diffDays <= 7;
      if (dateFilter === 'Last30') matchesDate = diffDays <= 30;
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesDepartment &&
      matchesStatus &&
      matchesDate
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filtered.slice(startIndex, startIndex + itemsPerPage);

  const categories = ['All', 'Sanitation', 'Electrical', 'Water Supply', 'Infrastructure', 'Security', 'Internet', 'Transportation', 'Hostel', 'Academic', 'Maintenance', 'Other'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const departments = ['All', 'Maintenance', 'Electrical', 'Sanitation', 'Security', 'IT', 'Administration', 'Hostel', 'Transport', 'Academic'];
  const statuses = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'];

  return (
    <div className="space-y-4">
      {/* Search & Multi-Filter Control Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Complaint ID, Title, or Campus Location..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
          />
        </div>

        {/* 5 Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">Category: All</option>
            {categories.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">Priority: All</option>
            {priorities.filter(p => p !== 'All').map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">Department: All</option>
            {departments.filter(d => d !== 'All').map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">Status: All</option>
            {statuses.filter(s => s !== 'All').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">Date: All Time</option>
            <option value="Today">Today</option>
            <option value="Last7">Last 7 Days</option>
            <option value="Last30">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-4 px-4 sm:px-6">ID & Complaint</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Assigned To</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No complaints matching active search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedComplaints.map((item) => (
                  <tr key={item.id || item.mongoId} className="hover:bg-slate-900/50 transition-colors group">
                    {/* ID & Title */}
                    <td className="py-4 px-4 sm:px-6 max-w-xs">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            #{item.id}
                          </span>
                          <AIBadge type="analyzed" label="🤖 AI" size="sm" />
                          {item.duplicateOf && (
                            <DuplicateBadge duplicateOf={item.duplicateOf} similarity={item.duplicateSimilarity} />
                          )}
                        </div>
                        <Link
                          to={`/complaint/${item.mongoId || item.id}`}
                          className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 text-sm"
                        >
                          {item.title}
                        </Link>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-300">
                      {item.category}
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} />
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-400 truncate max-w-[140px]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-amber-300 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{item.department || 'Maintenance'}</span>
                      </div>
                    </td>

                    {/* Assigned To */}
                    <td className="py-4 px-4 whitespace-nowrap text-cyan-300 font-medium">
                      {item.assignedStaff || 'Unassigned'}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Action Buttons: View, Assign, Change Status, Mark Duplicate */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View */}
                        <Link
                          to={`/complaint/${item.mongoId || item.id}`}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Complaint Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Assign */}
                        <button
                          type="button"
                          onClick={() => onOpenAssignModal && onOpenAssignModal(item)}
                          className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white transition-colors"
                          title="Assign Staff Member"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>

                        {/* Mark Duplicate */}
                        <button
                          type="button"
                          onClick={() => onOpenDuplicateModal && onOpenDuplicateModal(item)}
                          className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 border border-amber-500/30 text-amber-300 hover:text-white transition-colors"
                          title="Mark Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="py-4 px-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/50">
          <div>
            Showing <strong className="text-white">{filtered.length > 0 ? startIndex + 1 : 0}</strong> to{' '}
            <strong className="text-white">{Math.min(startIndex + itemsPerPage, filtered.length)}</strong> of{' '}
            <strong className="text-white">{filtered.length}</strong> complaints
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintsTable;

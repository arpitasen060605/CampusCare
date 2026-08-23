export const mockUsers = {
  student: {
    id: 'usr-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    role: 'Student',
    department: 'Computer Science',
    rollNumber: 'CS2024-042',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  admin: {
    id: 'usr-901',
    name: 'Dr. Rajesh Verma',
    email: 'dean.admin@college.edu',
    role: 'Admin',
    department: 'Campus Administration',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  },
  staff: {
    id: 'usr-501',
    name: 'Vikram Singh',
    email: 'facilities.lead@college.edu',
    role: 'Staff',
    department: 'Facilities & Maintenance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  }
};

export const mockStats = {
  student: {
    total: 14,
    pending: 3,
    inProgress: 5,
    resolved: 6,
  },
  admin: {
    total: 184,
    resolved: 142,
    resolutionRate: '77.2%',
    avgResolutionTime: '4.2 hrs',
    highPriority: 18,
  },
  staff: {
    assignedToMe: 12,
    inProgress: 5,
    resolvedToday: 4,
    pendingVerification: 3,
  }
};

export const mockComplaints = [
  {
    id: 'CMP-2026-089',
    title: 'Water Leakage in CS Lab 302 Ceiling',
    category: 'Facilities & Maintenance',
    location: 'Academic Block B - 3rd Floor',
    buildingId: 'bld-academic-b',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    status: 'In Progress',
    priority: 'High',
    submittedBy: 'Aarav Sharma',
    submittedAt: '2026-08-20T09:30:00Z',
    updatedAt: '2026-08-20T14:15:00Z',
    assignedDepartment: 'Maintenance & Plumbing',
    assignedStaff: 'Vikram Singh',
    description: 'Continuous water dripping from the ceiling near row 4 workstations. Risk of damage to desktop computers and wiring.',
    aiAnalysis: {
      urgencyScore: 88,
      suggestedCategory: 'Facilities & Maintenance',
      confidence: 94,
      aiSummary: 'Critical water leakage detected near electrical equipment. High priority dispatch recommended to prevent infrastructure damage.',
      similarDuplicates: 1,
    },
    attachments: [
      { name: 'ceiling_dripping.jpg', size: '2.4 MB', type: 'image/jpeg' },
      { name: 'lab_computers.jpg', size: '1.8 MB', type: 'image/jpeg' },
    ],
    timeline: [
      { status: 'Reported', date: '2026-08-20T09:30:00Z', note: 'Complaint submitted by Aarav Sharma', actor: 'Aarav Sharma' },
      { status: 'AI Triaged', date: '2026-08-20T09:31:00Z', note: 'Gemini AI tagged High Priority & routed to Maintenance', actor: 'System (Gemini AI)' },
      { status: 'Assigned', date: '2026-08-20T10:15:00Z', note: 'Assigned to Senior Technician Vikram Singh', actor: 'Admin Office' },
      { status: 'In Progress', date: '2026-08-20T14:15:00Z', note: 'Inspection completed. Replacement pipe dispatched.', actor: 'Vikram Singh' },
    ]
  },
  {
    id: 'CMP-2026-090',
    title: 'Hostel 4 WiFi Access Point Offline',
    category: 'IT & Network Services',
    location: 'Hostel Block 4 - West Wing',
    buildingId: 'bld-hostel-4',
    coordinates: { lat: 18.5215, lng: 73.8580 },
    status: 'Pending',
    priority: 'Urgent',
    submittedBy: 'Riya Patel',
    submittedAt: '2026-08-20T11:45:00Z',
    updatedAt: '2026-08-20T11:45:00Z',
    assignedDepartment: 'IT Infrastructure',
    assignedStaff: 'Unassigned',
    description: 'The 3rd floor router AP-403 has been down for over 5 hours. Over 80 students unable to access college LMS for assignment submission.',
    aiAnalysis: {
      urgencyScore: 92,
      suggestedCategory: 'IT & Network Services',
      confidence: 98,
      aiSummary: 'Widespread network blackout impacting deadline submissions. High student density affected.',
      similarDuplicates: 3,
    },
    attachments: [
      { name: 'router_red_light.jpg', size: '1.2 MB', type: 'image/jpeg' }
    ],
    timeline: [
      { status: 'Reported', date: '2026-08-20T11:45:00Z', note: 'Complaint submitted by Riya Patel', actor: 'Riya Patel' },
      { status: 'AI Triaged', date: '2026-08-20T11:46:00Z', note: 'Gemini AI flagged Urgent due to 80+ affected users', actor: 'System (Gemini AI)' }
    ]
  },
  {
    id: 'CMP-2026-085',
    title: 'Library Air Conditioning Noise & Cooling Failure',
    category: 'HVAC & Environmental',
    location: 'Central Library - 2nd Floor Reading Room',
    buildingId: 'bld-library',
    coordinates: { lat: 18.5192, lng: 73.8550 },
    status: 'Resolved',
    priority: 'Medium',
    submittedBy: 'Priya Nambiar',
    submittedAt: '2026-08-19T08:15:00Z',
    updatedAt: '2026-08-19T16:30:00Z',
    assignedDepartment: 'HVAC Maintenance',
    assignedStaff: 'Suresh Kumar',
    description: 'AC unit #4 making loud rattling sound and blowing warm air. Reading room temperature is uncomfortable.',
    aiAnalysis: {
      urgencyScore: 64,
      suggestedCategory: 'HVAC & Environmental',
      confidence: 91,
      aiSummary: 'Non-critical HVAC compressor issue. Dispatched during scheduled afternoon slot.',
      similarDuplicates: 0,
    },
    attachments: [],
    timeline: [
      { status: 'Reported', date: '2026-08-19T08:15:00Z', note: 'Complaint submitted by Priya Nambiar', actor: 'Priya Nambiar' },
      { status: 'Assigned', date: '2026-08-19T09:00:00Z', note: 'Assigned to Suresh Kumar', actor: 'Admin Office' },
      { status: 'In Progress', date: '2026-08-19T11:30:00Z', note: 'HVAC filter cleaned and coolant topped up.', actor: 'Suresh Kumar' },
      { status: 'Resolved', date: '2026-08-19T16:30:00Z', note: 'Verified cooling restored. Issue closed.', actor: 'Priya Nambiar' }
    ]
  },
  {
    id: 'CMP-2026-082',
    title: 'Mess Food Hygiene & Untidy Serving Area',
    category: 'Mess & Food Safety',
    location: 'Main Mess Dining Hall',
    buildingId: 'bld-mess',
    coordinates: { lat: 18.5220, lng: 73.8595 },
    status: 'In Progress',
    priority: 'High',
    submittedBy: 'Karan Mehta',
    submittedAt: '2026-08-18T13:20:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
    assignedDepartment: 'Food & Sanitation Inspection',
    assignedStaff: 'Anil Deshmukh',
    description: 'Uncovered food trays during lunch hour and lack of hand sanitizer refills at entry point.',
    aiAnalysis: {
      urgencyScore: 82,
      suggestedCategory: 'Mess & Food Safety',
      confidence: 96,
      aiSummary: 'Health protocol issue flagged. High priority audit requested.',
      similarDuplicates: 2,
    },
    attachments: [
      { name: 'sanitizer_empty.jpg', size: '1.5 MB', type: 'image/jpeg' }
    ],
    timeline: [
      { status: 'Reported', date: '2026-08-18T13:20:00Z', note: 'Reported by Karan Mehta', actor: 'Karan Mehta' },
      { status: 'In Progress', date: '2026-08-20T10:00:00Z', note: 'Food Inspector visited site and issued notice.', actor: 'Anil Deshmukh' }
    ]
  },
  {
    id: 'CMP-2026-078',
    title: 'Broken Desk Chairs in Lecture Hall 101',
    category: 'Furniture & Carpentry',
    location: 'Main Auditorium & Lecture Complex',
    buildingId: 'bld-lectures',
    coordinates: { lat: 18.5185, lng: 73.8540 },
    status: 'Pending',
    priority: 'Low',
    submittedBy: 'Neha Sharma',
    submittedAt: '2026-08-17T15:10:00Z',
    updatedAt: '2026-08-17T15:10:00Z',
    assignedDepartment: 'Carpentry & Furniture',
    assignedStaff: 'Unassigned',
    description: 'Two desk chairs in row F have broken armrests and loose screws.',
    aiAnalysis: {
      urgencyScore: 35,
      suggestedCategory: 'Furniture & Carpentry',
      confidence: 89,
      aiSummary: 'Low urgency carpentry request. Can be batched with weekend maintenance.',
      similarDuplicates: 0,
    },
    attachments: [],
    timeline: [
      { status: 'Reported', date: '2026-08-17T15:10:00Z', note: 'Reported by Neha Sharma', actor: 'Neha Sharma' }
    ]
  }
];

export const mockAnalyticsData = {
  categoryDistribution: [
    { name: 'Facilities & Plumbing', count: 54, color: '#6366f1' },
    { name: 'IT & Network Services', count: 42, color: '#3b82f6' },
    { name: 'HVAC & Electrical', count: 38, color: '#06b6d4' },
    { name: 'Mess & Sanitation', count: 28, color: '#10b981' },
    { name: 'Furniture & Infrastructure', count: 22, color: '#f59e0b' },
  ],
  monthlyResolutionTrends: [
    { month: 'Jan', received: 45, resolved: 40 },
    { month: 'Feb', received: 52, resolved: 48 },
    { month: 'Mar', received: 68, resolved: 60 },
    { month: 'Apr', received: 85, resolved: 79 },
    { month: 'May', received: 94, resolved: 88 },
    { month: 'Jun', received: 72, resolved: 70 },
    { month: 'Jul', received: 110, resolved: 98 },
    { month: 'Aug', received: 125, resolved: 112 },
  ],
  priorityBreakdown: [
    { priority: 'Urgent', count: 18, color: '#ef4444' },
    { priority: 'High', count: 46, color: '#f97316' },
    { priority: 'Medium', count: 82, color: '#eab308' },
    { priority: 'Low', count: 38, color: '#3b82f6' },
  ],
  departmentPerformance: [
    { department: 'IT Infrastructure', avgTime: '2.5 hrs', score: '94%' },
    { department: 'Electrical Services', avgTime: '3.8 hrs', score: '91%' },
    { department: 'Plumbing & Facilities', avgTime: '4.5 hrs', score: '88%' },
    { department: 'Food & Sanitation', avgTime: '5.2 hrs', score: '85%' },
    { department: 'Carpentry & Works', avgTime: '8.0 hrs', score: '79%' },
  ]
};

export const mockCampusLocations = [
  { id: 'bld-academic-b', name: 'Academic Block B', lat: 18.5204, lng: 73.8567, activeComplaints: 3, criticalCount: 1 },
  { id: 'bld-hostel-4', name: 'Hostel Block 4', lat: 18.5215, lng: 73.8580, activeComplaints: 5, criticalCount: 2 },
  { id: 'bld-library', name: 'Central Library', lat: 18.5192, lng: 73.8550, activeComplaints: 1, criticalCount: 0 },
  { id: 'bld-mess', name: 'Main Dining Mess', lat: 18.5220, lng: 73.8595, activeComplaints: 2, criticalCount: 1 },
  { id: 'bld-lectures', name: 'Lecture Complex', lat: 18.5185, lng: 73.8540, activeComplaints: 1, criticalCount: 0 },
  { id: 'bld-sports', name: 'Sports Complex', lat: 18.5170, lng: 73.8530, activeComplaints: 0, criticalCount: 0 },
];

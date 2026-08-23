const User = require('../models/User');
const Complaint = require('../models/Complaint');

const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    const complaintCount = await Complaint.countDocuments();

    if (userCount >= 36 && complaintCount >= 50) {
      console.log('[AutoSeed] Database already contains full 50+ complaint records. Skipping.');
      return;
    }

    console.log('[AutoSeed] Initializing 36 user accounts and 52+ campus complaints dataset...');

    // Clear existing for clean seed
    await User.deleteMany({});
    await Complaint.deleteMany({});

    // 1. Create Admin (password will be hashed by User.js pre-save hook)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin',
      department: 'Administration',
    });

    // 2. Create 5 Staff Members
    const staffMembers = await User.create([
      { name: 'Vikram Singh', email: 'facilities.staff@college.edu', password: 'password123', role: 'staff', department: 'Maintenance' },
      { name: 'Anita Rao', email: 'electrical.staff@college.edu', password: 'password123', role: 'staff', department: 'Electrical' },
      { name: 'Rajesh Kumar', email: 'it.staff@college.edu', password: 'password123', role: 'staff', department: 'IT' },
      { name: 'Sanjay Dutt', email: 'sanitation.staff@college.edu', password: 'password123', role: 'staff', department: 'Sanitation' },
      { name: 'Priya Sharma', email: 'security.staff@college.edu', password: 'password123', role: 'staff', department: 'Security' },
    ]);

    // 3. Create 30 Students
    const studentData = [];
    for (let i = 1; i <= 30; i++) {
      studentData.push({
        name: `Student User ${i}`,
        email: `student${i}@college.edu`,
        password: 'password123',
        role: 'student',
        department: i % 2 === 0 ? 'Computer Science' : 'Electronics & Comm',
      });
    }
    const students = await User.create(studentData);

    // 4. Create 52 Realistic Complaints Across 10 Categories
    const categories = [
      'Sanitation', 'Electrical', 'Water Supply', 'Security', 'Internet',
      'Infrastructure', 'Hostel', 'Academic', 'Maintenance', 'Transport'
    ];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const makeId = (num) => `CMP-2026-${num.toString().padStart(3, '0')}`;

    const seededComplaints = [];
    let firstTicketId = null;

    for (let i = 1; i <= 52; i++) {
      const cat = categories[(i - 1) % categories.length];
      const status = i % 4 === 0 ? 'Resolved' : i % 4 === 1 ? 'Pending' : i % 4 === 2 ? 'Assigned' : 'In Progress';
      const priority = i % 5 === 0 ? 'Critical' : i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low';
      const student = pick(students);
      const staff = pick(staffMembers);

      const daysAgo = i;
      const createdAt = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));
      const assignedAt = status !== 'Pending' ? new Date(createdAt.getTime() + (2 * 60 * 60 * 1000)) : null;
      const startedAt = (status === 'In Progress' || status === 'Resolved') ? new Date(assignedAt.getTime() + (4 * 60 * 60 * 1000)) : null;
      const resolvedAt = status === 'Resolved' ? new Date(startedAt.getTime() + (5 * 60 * 60 * 1000)) : null;

      let title = `${cat} maintenance issue in Zone ${i}`;
      let description = `Detailed grievance report for campus ${cat.toLowerCase()} facility in Block ${String.fromCharCode(65 + (i % 4))}.`;
      let duplicateOf = null;
      let duplicateSimilarity = 0;

      // Duplicate Cluster 1: Block A Water Cooler
      if (i === 1) {
        title = 'Water cooler in Block A is not working.';
        description = 'The drinking water cooler near Room 204 in Academic Block A has stopped dispensing cold water.';
      } else if (i === 2) {
        title = 'The Block A water cooler has stopped working.';
        description = 'No drinking water available from cooler unit in Block A near the main stairs.';
        duplicateOf = firstTicketId;
        duplicateSimilarity = 0.94;
      } else if (i === 3) {
        title = 'No water coming from the cooler near Block A.';
        description = 'Water pressure in Block A cooler is zero and water is warm.';
        duplicateOf = firstTicketId;
        duplicateSimilarity = 0.91;
      } else if (i === 4) {
        title = 'Short circuit sparks in Physics Lab 204';
        description = 'Sparks and burning smell coming from main electrical panel.';
      } else if (i === 5) {
        title = 'CCTV Security Camera failure at Main Gate 2';
        description = 'Night vision PTZ camera went offline during evening patrol.';
      }

      const doc = await Complaint.create({
        complaintId: i === 1 ? 'CMP-1042' : makeId(i),
        title,
        description,
        category: cat,
        priority,
        department: staff.department,
        location: `Academic Block ${String.fromCharCode(65 + (i % 4))} - Floor ${(i % 4) + 1}`,
        latitude: 12.9716 + (Math.random() * 0.006 - 0.003),
        longitude: 77.5946 + (Math.random() * 0.006 - 0.003),
        status,
        submittedBy: student._id,
        assignedTo: status !== 'Pending' ? staff._id : null,
        resolvedBy: status === 'Resolved' ? staff._id : null,
        aiSummary: `${title}: ${cat} complaint logged for campus.`,
        aiKeywords: ['campus', cat.toLowerCase(), 'facility'],
        priorityReason: `Assigned ${priority} priority based on impact context.`,
        aiAnalyzed: true,
        duplicateOf,
        duplicateSimilarity,
        resolutionNote: status === 'Resolved' ? `Maintenance work completed by ${staff.name}. Equipment verified.` : '',
        createdAt,
        assignedAt,
        startedAt,
        resolvedAt,
      });

      if (i === 1) firstTicketId = doc._id;
      seededComplaints.push(doc);
    }

    console.log(`[AutoSeed] Successfully populated 36 users and ${seededComplaints.length} campus complaints!`);
  } catch (error) {
    console.error('[AutoSeed Error]', error.message);
  }
};

module.exports = autoSeed;

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Complaint = require('./models/Complaint');

// Helper to generate complaint ID (e.g. CMP-2026-001)
const makeId = (num) => `CMP-2026-${num.toString().padStart(3, '0')}`;

const seedDatabase = async () => {
  try {
    console.log('=== STARTING HACKATHON DATABASE SEEDER ===\n');

    // Connect to MongoDB (with In-Memory fallback for local testing)
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_complaint_db';
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log('--> Connected to MongoDB:', mongoose.connection.host);
    } catch (err) {
      console.warn(`[Seeder Warning] Local MongoDB service connection failed (${err.message}).`);
      console.log('[Seeder] Starting In-Memory MongoDB Server for seeding...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      console.log('--> Connected to In-Memory MongoDB successfully.');
    }

    // Clear existing collections
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('--> Cleared existing users and complaints collections.');

    // 1. Seed Admin User (Password will be bcrypt-hashed via User.js pre-save hook)
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin',
      department: 'Administration',
    });
    console.log('--> Created Admin account: admin@college.edu');

    // 2. Seed 5 Staff Members
    const staffData = [
      { name: 'Vikram Singh', email: 'facilities.staff@college.edu', department: 'Maintenance' },
      { name: 'Anita Rao', email: 'electrical.staff@college.edu', department: 'Electrical' },
      { name: 'Rajesh Kumar', email: 'it.staff@college.edu', department: 'IT' },
      { name: 'Sanjay Dutt', email: 'sanitation.staff@college.edu', department: 'Sanitation' },
      { name: 'Priya Sharma', email: 'security.staff@college.edu', department: 'Security' },
    ];

    const staffUsers = [];
    for (const s of staffData) {
      const u = await User.create({
        ...s,
        password: 'password123',
        role: 'staff',
      });
      staffUsers.push(u);
    }
    console.log(`--> Created ${staffUsers.length} Staff accounts.`);

    // 3. Seed 30 Student Accounts
    const studentUsers = [];
    for (let i = 1; i <= 30; i++) {
      const u = await User.create({
        name: `Student User ${i}`,
        email: `student${i}@college.edu`,
        password: 'password123',
        role: 'student',
        department: i % 2 === 0 ? 'Computer Science' : 'Electronics & Comm',
      });
      studentUsers.push(u);
    }
    console.log(`--> Created ${studentUsers.length} Student accounts.`);

    // Helper for random choice
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomDaysAgo = (days) => {
      const now = new Date();
      return new Date(now.getTime() - Math.floor(Math.random() * days * 24 * 60 * 60 * 1000));
    };

    // 4. Seed 52 Realistic Campus Complaints Across 10 Categories
    const categories = [
      'Sanitation', 'Electrical', 'Water Supply', 'Security', 'Internet',
      'Infrastructure', 'Hostel', 'Academic', 'Maintenance', 'Transport'
    ];

    const rawComplaintTemplates = [
      // Duplicate Cluster 1: Block A Water Cooler
      {
        title: 'Water cooler in Block A is not working.',
        description: 'The drinking water cooler near Room 204 in Academic Block A has stopped dispensing cold water and is making a buzzing sound.',
        category: 'Water Supply', priority: 'High', department: 'Maintenance', location: 'Academic Block A - 2nd Floor', latitude: 12.9716, longitude: 77.5946
      },
      {
        title: 'The Block A water cooler has stopped working.',
        description: 'No drinking water available from cooler unit in Block A near the main stairs.',
        category: 'Water Supply', priority: 'High', department: 'Maintenance', location: 'Academic Block A - 2nd Floor', latitude: 12.9718, longitude: 77.5948
      },
      {
        title: 'No water coming from the cooler near Block A.',
        description: 'Water pressure in Block A cooler is zero and water is warm.',
        category: 'Water Supply', priority: 'High', department: 'Maintenance', location: 'Academic Block A - Ground Floor', latitude: 12.9715, longitude: 77.5945
      },

      // Critical Priority Emergency Incidents
      {
        title: 'Short circuit sparks in Physics Lab 204',
        description: 'Visible sparks and burning smell coming from main electrical breaker panel in Physics Lab 204.',
        category: 'Electrical', priority: 'Critical', department: 'Electrical', location: 'Science Block - Room 204', latitude: 12.9725, longitude: 77.5955
      },
      {
        title: 'CCTV Security Camera failure at Main Gate 2',
        description: 'Night vision PTZ security camera at Campus Entry Gate 2 went offline during evening patrol.',
        category: 'Security', priority: 'Critical', department: 'Security', location: 'Campus Main Gate 2', latitude: 12.9701, longitude: 77.5911
      },
      {
        title: 'Main Transformer unit overheating near Hostel Block B',
        description: 'Substation transformer vibrating excessively with elevated temperature alarms.',
        category: 'Electrical', priority: 'Critical', department: 'Electrical', location: 'Hostel Substation B', latitude: 12.9730, longitude: 77.5960
      },

      // High Priority Incidents
      {
        title: 'Wi-Fi Access Point down in Central Library 3rd Floor',
        description: 'High-density Wi-Fi AP in Central Library 3rd floor reading hall disconnected 120+ students.',
        category: 'Internet', priority: 'High', department: 'IT', location: 'Central Library - 3rd Floor', latitude: 12.9712, longitude: 77.5932
      },
      {
        title: 'Washroom pipe leakage in Girls Hostel 1',
        description: 'Major water leakage from overhead pipe flooding ground floor corridor.',
        category: 'Sanitation', priority: 'High', department: 'Sanitation', location: 'Girls Hostel 1 - Ground Floor', latitude: 12.9740, longitude: 77.5970
      },
      {
        title: 'Shuttle Bus #4 air conditioning malfunction',
        description: 'AC unit failed on morning student transit route from city center.',
        category: 'Transport', priority: 'High', department: 'Transport', location: 'Campus Bus Depot', latitude: 12.9695, longitude: 77.5905
      },
      {
        title: 'Projector display failing in Auditorium 1',
        description: '4K ceiling projector lamp turns off automatically after 5 minutes during guest lectures.',
        category: 'Academic', priority: 'High', department: 'IT', location: 'Main Auditorium - Block C', latitude: 12.9710, longitude: 77.5940
      },

      // Medium & Low Priority General Complaints
      { title: 'Ceiling fan rattling in Room 102', description: 'Noise during lectures.', category: 'Electrical', priority: 'Medium', department: 'Electrical', location: 'Block A - Room 102' },
      { title: 'Broken door handle in Boys Hostel B', description: 'Door latch jammed.', category: 'Hostel', priority: 'Low', department: 'Maintenance', location: 'Hostel Block B - Room 312' },
      { title: 'Dustbin overflowing near Student Canteen', description: 'Requires immediate clearance.', category: 'Sanitation', priority: 'Medium', department: 'Sanitation', location: 'Student Canteen Area' },
      { title: 'Ethernet port inactive in Computer Lab 3', description: 'Port #14 no link light.', category: 'Internet', priority: 'Low', department: 'IT', location: 'IT Block - Lab 3' },
      { title: 'Flickering LED tube light in Seminar Hall', description: 'Strobe effect causing eye strain.', category: 'Electrical', priority: 'Low', department: 'Electrical', location: 'Seminar Hall - Block B' },
      { title: 'Broken bench near Sports Complex', description: 'Wooden slat cracked.', category: 'Infrastructure', priority: 'Low', department: 'Maintenance', location: 'Sports Complex Outdoor Ground' },
      { title: 'Low water pressure in 4th floor rest room', description: 'Taps trickling slowly.', category: 'Water Supply', priority: 'Medium', department: 'Maintenance', location: 'Academic Block C - 4th Floor' },
      { title: 'Street light bulb blown near Gate 3', description: 'Dark area at night.', category: 'Security', priority: 'Medium', department: 'Security', location: 'South Perimeter Pathway' },
      { title: 'Campus Shuttle Bus delayed on Route 2', description: 'Schedule variance over 20 mins.', category: 'Transport', priority: 'Low', department: 'Transport', location: 'Transit Stop 2' },
      { title: 'Whiteboard marker tray broken in Room 305', description: 'Plastic bracket snapped.', category: 'Academic', priority: 'Low', department: 'Academic', location: 'Block B - Room 305' },
      { title: 'Window glass cracked in Chemistry Lab', description: 'Needs glass replacement.', category: 'Infrastructure', priority: 'Medium', department: 'Maintenance', location: 'Science Block - Chem Lab 2' },
      { title: 'Drinking water dispenser filter warning light on', description: 'Filter replacement required.', category: 'Water Supply', priority: 'Low', department: 'Maintenance', location: 'Library Ground Floor' },
      { title: 'Mess dining hall table leg wobbly', description: 'Table #18 unsteady.', category: 'Hostel', priority: 'Low', department: 'Hostel', location: 'Central Mess Hall' },
      { title: 'Printer jam in Admin Office', description: 'Paper feed tray jammed.', category: 'Academic', priority: 'Low', department: 'Administration', location: 'Admin Building Room 12' },
      { title: 'Biometric attendance scanner slow', description: 'Takes 10s per student swipe.', category: 'Security', priority: 'Medium', department: 'IT', location: 'Main Academic Entrance' },
    ];

    const fullComplaintsList = [...rawComplaintTemplates];
    let counter = 1;
    while (fullComplaintsList.length < 52) {
      const cat = categories[counter % categories.length];
      const dept = pick(['Maintenance', 'Electrical', 'Sanitation', 'Security', 'IT', 'Administration', 'Hostel', 'Transport', 'Academic']);
      const priority = pick(['Low', 'Medium', 'High', 'Critical']);
      
      fullComplaintsList.push({
        title: `${cat} maintenance issue in Zone ${counter}`,
        description: `Routine maintenance report filed for campus ${cat.toLowerCase()} facility in Zone ${counter}.`,
        category: cat,
        priority: priority,
        department: dept,
        location: `Campus Zone ${counter} - Block ${String.fromCharCode(65 + (counter % 4))}`,
        latitude: 12.9710 + (Math.random() * 0.005),
        longitude: 77.5930 + (Math.random() * 0.005),
      });
      counter++;
    }

    const seededComplaints = [];
    let firstTicketId = null;

    for (let i = 0; i < fullComplaintsList.length; i++) {
      const c = fullComplaintsList[i];
      const complaintId = makeId(i + 1);
      const student = pick(studentUsers);
      const staff = pick(staffUsers);

      let status = 'Pending';
      if (i % 4 === 1) status = 'Assigned';
      if (i % 4 === 2) status = 'In Progress';
      if (i % 4 === 3) status = 'Resolved';

      const createdAt = randomDaysAgo(60);
      let assignedAt = null;
      let startedAt = null;
      let resolvedAt = null;
      let resolvedBy = null;
      let resolutionNote = '';

      if (status !== 'Pending') {
        assignedAt = new Date(createdAt.getTime() + (2 * 60 * 60 * 1000));
      }
      if (status === 'In Progress' || status === 'Resolved') {
        startedAt = new Date(assignedAt.getTime() + (4 * 60 * 60 * 1000));
      }
      if (status === 'Resolved') {
        resolvedAt = new Date(startedAt.getTime() + (5 * 60 * 60 * 1000));
        resolvedBy = staff._id;
        resolutionNote = `Maintenance work completed by ${staff.name}. Inspected, repaired, and verified normal operation.`;
      }

      let duplicateOf = null;
      let duplicateSimilarity = 0;
      if (i === 1 && firstTicketId) {
        duplicateOf = firstTicketId;
        duplicateSimilarity = 0.94;
      }
      if (i === 2 && firstTicketId) {
        duplicateOf = firstTicketId;
        duplicateSimilarity = 0.91;
      }

      const history = [
        {
          oldStatus: '',
          newStatus: 'Pending',
          changedBy: student._id,
          message: 'Complaint submitted by student',
          createdAt: createdAt,
        },
      ];
      if (assignedAt) {
        history.push({
          oldStatus: 'Pending',
          newStatus: 'Assigned',
          changedBy: adminUser._id,
          message: `Complaint assigned to staff member ${staff.name}`,
          createdAt: assignedAt,
        });
      }
      if (startedAt) {
        history.push({
          oldStatus: 'Assigned',
          newStatus: 'In Progress',
          changedBy: staff._id,
          message: `Staff member ${staff.name} started work on ticket`,
          createdAt: startedAt,
        });
      }
      if (resolvedAt) {
        history.push({
          oldStatus: 'In Progress',
          newStatus: 'Resolved',
          changedBy: staff._id,
          message: `Complaint resolved: ${resolutionNote}`,
          createdAt: resolvedAt,
        });
      }

      const createdDoc = await Complaint.create({
        complaintId,
        title: c.title,
        description: c.description,
        category: c.category,
        priority: c.priority,
        department: c.department,
        location: c.location,
        latitude: c.latitude || 12.9716,
        longitude: c.longitude || 77.5946,
        status: status,
        submittedBy: student._id,
        assignedTo: status !== 'Pending' ? staff._id : null,
        resolvedBy: resolvedBy,
        aiSummary: `${c.title}: ${c.category} complaint logged for campus.`,
        aiKeywords: ['campus', c.category.toLowerCase(), 'facility'],
        priorityReason: `Assigned ${c.priority} priority based on impact context.`,
        aiAnalyzed: true,
        duplicateOf: duplicateOf,
        duplicateSimilarity: duplicateSimilarity,
        resolutionNote: resolutionNote,
        createdAt: createdAt,
        assignedAt: assignedAt,
        startedAt: startedAt,
        resolvedAt: resolvedAt,
        history: history,
      });

      if (i === 0) firstTicketId = createdDoc._id;
      seededComplaints.push(createdDoc);
    }

    console.log(`--> Created ${seededComplaints.length} Campus Complaints across 10 Categories and 4 Statuses.`);

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY 100%! ===');
    process.exit(0);
  } catch (err) {
    console.error('[Seeder Crash Error]:', err);
    process.exit(1);
  }
};

seedDatabase();

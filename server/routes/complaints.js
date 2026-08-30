const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { analyzeComplaint } = require('../services/aiService');

// Helper to generate unique complaint ID (e.g. CMP-2026-101)
const generateComplaintId = async () => {
  const count = await Complaint.countDocuments();
  const year = new Date().getFullYear();
  const nextNum = (count + 1).toString().padStart(3, '0');
  return `CMP-${year}-${nextNum}`;
};

// @route   POST /api/complaints
// @desc    Create a new complaint (Auto-analyzed by Gemini AI / Fallback)
// @access  Private
router.post('/', protect, upload.single('photo'), async (req, res, next) => {
  try {
    const { title, description, category, priority, department, location, latitude, longitude, duplicateOf, duplicateSimilarity } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ error: 'Bad Request', message: 'Title, description, and location are required' });
    }

    const complaintId = await generateComplaintId();
    const photoPath = req.file ? `/uploads/${req.file.filename}` : (req.body.photo || '');

    // Invoke Automated AI Complaint Analysis (Gemini API with deterministic fallback)
    const aiResult = await analyzeComplaint({ title, description, location });

    const finalCategory = category || aiResult.category;
    const finalPriority = priority || aiResult.priority;
    const finalDepartment = department || aiResult.department;

    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      category: finalCategory,
      priority: finalPriority,
      department: finalDepartment,
      location,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      photo: photoPath,
      submittedBy: req.user.id,
      aiSummary: aiResult.summary,
      aiKeywords: aiResult.keywords,
      priorityReason: aiResult.priorityReason,
      aiAnalyzed: true,
      duplicateOf: duplicateOf || null,
      duplicateSimilarity: duplicateSimilarity ? parseFloat(duplicateSimilarity) : 0,
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email department role')
      .populate('duplicateOf', 'complaintId title status');

    res.status(201).json({
      success: true,
      message: 'Complaint created and AI-analyzed successfully',
      complaint: populatedComplaint,
      aiAnalysis: aiResult,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/complaints
// @desc    Get list of complaints (Strictly scoped by role)
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { status, category, priority, department, search, isDuplicate } = req.query;
    let query = {};

    // Role-based visibility scoping
    if (req.user.role === 'student') {
      query.submittedBy = req.user.id;
    } else if (req.user.role === 'staff') {
      // Staff strictly see ONLY complaints assigned directly to them
      query.assignedTo = req.user.id;
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (department) query.department = department;

    if (isDuplicate === 'true') {
      query.duplicateOf = { $ne: null };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email department role')
      .populate('assignedTo', 'name email department role')
      .populate('resolvedBy', 'name email department role')
      .populate('duplicateOf', 'complaintId title status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint by MongoDB ObjectId or complaintId string
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    let complaint;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      complaint = await Complaint.findById(req.params.id)
        .populate('submittedBy', 'name email department role')
        .populate('assignedTo', 'name email department role')
        .populate('resolvedBy', 'name email department role')
        .populate('duplicateOf', 'complaintId title status description category location');
    } else {
      complaint = await Complaint.findOne({ complaintId: req.params.id })
        .populate('submittedBy', 'name email department role')
        .populate('assignedTo', 'name email department role')
        .populate('resolvedBy', 'name email department role')
        .populate('duplicateOf', 'complaintId title status description category location');
    }

    if (!complaint) {
      return res.status(404).json({ error: 'Not Found', message: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/complaints/:id
// @desc    Update complaint details
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Not Found', message: 'Complaint not found' });
    }

    if (req.user.role === 'student' && complaint.submittedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Forbidden', message: 'Not authorized to edit this complaint' });
    }

    complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('submittedBy', 'name email department role')
      .populate('assignedTo', 'name email department role')
      .populate('resolvedBy', 'name email department role')
      .populate('duplicateOf', 'complaintId title status');

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete complaint
// @access  Private (Admin or Submitter)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Not Found', message: 'Complaint not found' });
    }

    if (req.user.role !== 'admin' && complaint.submittedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Forbidden', message: 'Not authorized to delete this complaint' });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/complaints/:id/assign
// @desc    Assign complaint to staff member
// @access  Private (Admin or Staff)
router.put('/:id/assign', protect, authorize('admin', 'staff'), async (req, res, next) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({ error: 'Bad Request', message: 'Please provide staffId to assign' });
    }

    const staffUser = await User.findById(staffId);
    if (!staffUser) {
      return res.status(404).json({ error: 'Not Found', message: 'Staff user not found' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Not Found', message: 'Complaint not found' });
    }

    complaint.assignedTo = staffId;
    complaint.status = 'Assigned';
    complaint.assignedAt = new Date();
    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email department role')
      .populate('assignedTo', 'name email department role');

    res.status(200).json({
      success: true,
      message: `Complaint assigned to ${staffUser.name}`,
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status (e.g. Start Work -> In Progress)
// @access  Private (Admin or Staff)
router.put('/:id/status', protect, authorize('admin', 'staff'), async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Assigned', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Please provide valid status (Pending, Assigned, In Progress, Resolved)' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Not Found', message: 'Complaint not found' });
    }

    complaint.status = status;
    if (status === 'In Progress' && !complaint.startedAt) {
      complaint.startedAt = new Date();
    }
    if (status === 'Resolved') {
      if (!complaint.resolvedAt) complaint.resolvedAt = new Date();
      if (!complaint.resolvedBy) complaint.resolvedBy = req.user.id;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email department role')
      .populate('assignedTo', 'name email department role')
      .populate('resolvedBy', 'name email department role');

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}`,
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/complaints/:id/resolve
// @desc    Mark complaint as resolved (Mandatory resolution note)
// @access  Private (Admin or Staff)
router.post('/:id/resolve', protect, authorize('admin', 'staff'), upload.single('resolutionPhoto'), async (req, res, next) => {
  try {
    const { resolutionNote } = req.body;

    // Prevent staff from resolving without a resolution note
    if (!resolutionNote || !resolutionNote.trim()) {
      return res.status(400).json({ error: 'Bad Request', message: 'Resolution note is required to resolve a complaint' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Not Found', message: 'Complaint not found' });
    }

    const resolutionPhotoPath = req.file ? `/uploads/${req.file.filename}` : (req.body.resolutionPhoto || '');

    complaint.status = 'Resolved';
    complaint.resolutionNote = resolutionNote.trim();
    if (resolutionPhotoPath) {
      complaint.resolutionPhoto = resolutionPhotoPath;
    }
    complaint.resolvedAt = new Date();
    complaint.resolvedBy = req.user.id;

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email department role')
      .populate('assignedTo', 'name email department role')
      .populate('resolvedBy', 'name email department role');

    res.status(200).json({
      success: true,
      message: 'Complaint resolved successfully',
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

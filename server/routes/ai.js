const express = require('express');
const router = express.Router();
const { analyzeComplaint } = require('../services/aiService');
const { findDuplicateComplaints } = require('../services/duplicateDetector');
const Complaint = require('../models/Complaint');

// @route   POST /api/ai/analyze
// @desc    Analyze complaint title, description, and location using Gemini AI (with fallback)
// @access  Public / Private
router.post('/analyze', async (req, res, next) => {
  try {
    const { title, description, location } = req.body;

    if (!title && !description) {
      return res.status(400).json({ error: 'Bad Request', message: 'Please provide at least a title or description for AI analysis' });
    }

    const aiResult = await analyzeComplaint({
      title: title || '',
      description: description || '',
      location: location || '',
    });

    res.status(200).json({
      success: true,
      ...aiResult,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/check-duplicate
// @desc    Check potential duplicate complaints against existing database tickets
// @access  Public / Private
router.post('/check-duplicate', async (req, res, next) => {
  try {
    const { title, description, location, category, threshold } = req.body;

    if (!title && !description) {
      return res.status(400).json({ error: 'Bad Request', message: 'Please provide title or description to check for duplicates' });
    }

    // Fetch existing complaints from MongoDB
    const existingComplaints = await Complaint.find()
      .select('_id complaintId title description location category status createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    const parsedThreshold = threshold !== undefined ? parseFloat(threshold) : 0.50;

    const checkResult = findDuplicateComplaints(
      { title, description, location, category },
      existingComplaints,
      parsedThreshold
    );

    res.status(200).json({
      success: true,
      isDuplicate: checkResult.isDuplicate,
      similarity: checkResult.similarity,
      threshold: checkResult.threshold,
      matchCount: checkResult.matchCount,
      matches: checkResult.matches,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

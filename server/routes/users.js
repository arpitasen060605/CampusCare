const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/staff
// @desc    Get list of all staff members (for task assignment dropdowns)
// @access  Private
router.get('/staff', protect, async (req, res, next) => {
  try {
    const staff = await User.find({ role: { $in: ['staff', 'admin'] } }).select('-password').sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users
// @desc    Get list of all users (Admin only)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require('express');
const { applyForLeave, getLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, employerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply for leave (Employee)
router.post('/', protect, applyForLeave);

// Get leaves (Employee sees their own, Employer sees all)
router.get('/', protect, getLeaves);

// Update leave status (Employer only)
router.put('/:id/status', protect, employerOnly, updateLeaveStatus);

module.exports = router;

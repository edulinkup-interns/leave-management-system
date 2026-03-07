const LeaveRequest = require('../models/LeaveRequest');

const applyForLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Basic date validation
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after or equal to the start date' });
    }

    const leaveRequest = await LeaveRequest.create({
      employeeId: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaves = async (req, res) => {
  try {
    if (req.user.role === 'Employer') {
      const leaves = await LeaveRequest.find({}).populate('employeeId', 'name email');
      res.json(leaves);
    } else {
      const leaves = await LeaveRequest.find({ employeeId: req.user._id });
      res.json(leaves);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (leaveRequest) {
      leaveRequest.status = status;
      const updatedLeave = await leaveRequest.save();
      res.json(updatedLeave);
    } else {
      res.status(404).json({ message: 'Leave request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyForLeave, getLeaves, updateLeaveStatus };

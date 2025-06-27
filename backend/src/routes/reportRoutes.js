const express = require('express');
const router = express.Router();

// Import the controller functions for event reports
const {
  createEventReport,
  getAllEventReports,
  getEventReportById,
  updateEventReport,
  deleteEventReport,
} = require('../controllers/reportConroller'); // Adjust path as per your project structure

// Import authentication and authorization middleware
// These are examples; replace with your actual middleware
const userAuth = require('../middlewares/userAuth');
// --- Event Report Routes ---

// @route   POST /api/reports
// @desc    Create a new event report
// @access  Private (User must be logged in)
router.post('/:eventId', userAuth, createEventReport);



// // @route   GET /api/reports
// // @desc    Get all event reports
// // @access  Private (Admin only)
// //router.get('/', userAuth, admin, getAllEventReports);

// // @route   GET /api/reports/:reportId
// // @desc    Get a single event report by its ID
// // @access  Private (Admin only)
// router.get('/:reportId', protect, admin, getEventReportById);

// // @route   PUT /api/reports/:reportId
// // @desc    Update an event report (e.g., status, admin notes)
// // @access  Private (Admin only)
// router.put('/:reportId', protect, admin, updateEventReport);

// // @route   DELETE /api/reports/:reportId
// // @desc    Delete an event report
// // @access  Private (Admin only - typically super admin)
// router.delete('/:reportId', protect, admin, deleteEventReport);

module.exports = router;

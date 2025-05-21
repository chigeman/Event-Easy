const Event = require('../models/eventModel'); // Make sure path is correct!
const User = require('../models/userModel');   // Same here
const EventReport = require('../models/reportModel'); // The report model

const createEventReport = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { reason, description } = req.body;
    const reporterUserId = req.user.id;; // Assuming user ID is available from auth middleware (e.g., req.user)

    // Basic validation
    if (!eventId || !reason || !description) {
      return res.status(400).json({ message: 'Event ID, reason, and description are required.' });
    }

    // Check if the event exists
    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if the reporter user exists (though this should be guaranteed by auth)
    const reporterExists = await User.findById(reporterUserId);
    if (!reporterExists) {
      // This case should ideally not happen if authentication is working correctly
      return res.status(404).json({ message: 'Reporter user not found.' });
    }

    // Optional: Prevent a user from reporting the same event multiple times for the same reason
    // const existingReport = await EventReport.findOne({ eventId, reporterUserId, reason });
    // if (existingReport) {
    //   return res.status(400).json({ message: 'You have already reported this event for this reason.' });
    // }

    const newReport = new EventReport({
      eventId,
      reporterUserId,
      reason,
      description,
      // Status defaults to 'Pending' as per the model
    });

    const savedReport = await newReport.save();

    // Populate event and reporter details for the response
    await savedReport.populate('eventId', 'eventName'); // Populate event name
    await savedReport.populate('reporterUserId', 'name email'); // Populate reporter name and email

    res.status(201).json({
      message: 'Event reported successfully.',
      report: savedReport,
    });

  } catch (error) {
    console.error('Error creating event report:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating report.' });
  }
};

// @desc    Get all event reports
// @route   GET /api/reports
// @access  Private (Admin only)
const getAllEventReports = async (req, res) => {
  try {
    // Basic pagination (optional, but good for many reports)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering (optional)
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.eventId) {
      filter.eventId = req.query.eventId;
    }

    const reports = await EventReport.find(filter)
      .populate('eventId', 'eventName category') // Populate event details
      .populate('reporterUserId', 'name email role') // Populate reporter details
      .sort({ createdAt: -1 }) // Show newest reports first
      .skip(skip)
      .limit(limit);

    const totalReports = await EventReport.countDocuments(filter);

    res.status(200).json({
      message: 'Reports retrieved successfully.',
      currentPage: page,
      totalPages: Math.ceil(totalReports / limit),
      totalReports,
      reports,
    });
  } catch (error) {
    console.error('Error getting all event reports:', error);
    res.status(500).json({ message: 'Server error while retrieving reports.' });
  }
};

// @desc    Get a single event report by ID
// @route   GET /api/reports/:reportId
// @access  Private (Admin only)
const getEventReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return res.status(400).json({ message: 'Invalid report ID format.' });
    }

    const report = await EventReport.findById(reportId)
      .populate('eventId') // Populate full event details
      .populate('reporterUserId', 'name email role profilePicture'); // Populate reporter details

    if (!report) {
      return res.status(404).json({ message: 'Event report not found.' });
    }

    res.status(200).json({
      message: 'Report retrieved successfully.',
      report,
    });
  } catch (error) {
    console.error('Error getting event report by ID:', error);
    res.status(500).json({ message: 'Server error while retrieving report.' });
  }
};

// @desc    Update an event report (e.g., status, admin notes)
// @route   PUT /api/reports/:reportId
// @access  Private (Admin only)
const updateEventReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return res.status(400).json({ message: 'Invalid report ID format.' });
    }

    // Validate status if provided
    const allowedStatuses = ['Pending', 'Under Review', 'Resolved', 'Dismissed'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    const report = await EventReport.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: 'Event report not found.' });
    }

    // Update fields if they are provided in the request body
    if (status) {
      report.status = status;
    }
    if (adminNotes !== undefined) { // Check for undefined to allow clearing notes with an empty string
      report.adminNotes = adminNotes;
    }

    const updatedReport = await report.save();

    // Populate for response
    await updatedReport.populate('eventId', 'eventName');
    await updatedReport.populate('reporterUserId', 'name email');

    res.status(200).json({
      message: 'Report updated successfully.',
      report: updatedReport,
    });
  } catch (error) {
    console.error('Error updating event report:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while updating report.' });
  }
};

// @desc    Delete an event report (use with caution, consider changing status instead)
// @route   DELETE /api/reports/:reportId
// @access  Private (Admin only, super admin)
const deleteEventReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return res.status(400).json({ message: 'Invalid report ID format.' });
    }

    const report = await EventReport.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: 'Event report not found.' });
    }

    await report.deleteOne(); // or report.remove() for older Mongoose versions

    res.status(200).json({ message: 'Event report deleted successfully.' });
  } catch (error) {
    console.error('Error deleting event report:', error);
    res.status(500).json({ message: 'Server error while deleting report.' });
  }
};


// Helper function to check for valid ObjectId (if not already part of a utility library)
// Mongoose is needed for this, so ensure it's imported at the top
const mongoose = require('mongoose');

module.exports = {
  createEventReport,
  getAllEventReports,
  getEventReportById,
  updateEventReport,
  deleteEventReport,
};
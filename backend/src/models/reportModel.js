const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Refers to your Event model
    required: true,
  },
  reporterUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to your User model
    required: true,
  },
  reason: {
    type: String,
    required: [true, "Reason for reporting is required"],
    trim: true,
    enum: [ // You can customize these reasons
      'Inappropriate Content',
      'Misleading Information',
      'Safety Concern',
      'Spam',
      'Fraudulent Event',
      'Organizer Issue',
      'Venue Problem',
      'Technical Issue',
      'Other'
    ],
  },
  description: {
    type: String,
    required: [true, "A detailed description of the issue is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Resolved', 'Dismissed'],
    default: 'Pending',
  },
  adminNotes: { // Optional notes an admin can add
    type: String,
    trim: true,
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});


module.exports = mongoose.model('Report', reportSchema);
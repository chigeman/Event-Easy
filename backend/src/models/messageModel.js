// models/Message.js (MongoDB + Mongoose)
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: { type: String, default: '' }, // Optional image URL
  videoUrl: { type: String, default: '' }, // Optional video URL
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);

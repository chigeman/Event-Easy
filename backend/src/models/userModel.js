const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0, // OTP valid for 24 hours
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyOtp: {
    type: String,
  },
  resetOtp: {
    type: String,
    default: null,
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0, // OTP valid for 10 minutes
  },
  role: {
    type: String,
    enum: ['attendee', 'organizer'],  // Allowed roles
    default: 'attendee',  // Default role
  required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = mongoose.model("Attendee", userSchema, "Attendee");

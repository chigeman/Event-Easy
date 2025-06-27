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
  imageUrl: { 
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },         
  },
  
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },

  bio: {
    type: String,
    maxlength: 1000,
    default: "",
  },

  social: {
    facebook: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?facebook\.com\/.+$/, "Invalid Facebook URL"],
      default: "",
    },
    twitter: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?twitter\.com\/.+$/, "Invalid Twitter URL"],
      default: "",
    },
    instagram: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?instagram\.com\/.+$/, "Invalid Instagram URL"],
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.+$/, "Invalid LinkedIn URL"],
      default: "",
    },
  },

  bankAccount: {
    account_name: {
      type: String,
      trim: true,
      default: "",
    },
    account_number: {
      type: String,
      trim: true,
      default: "",
    },
    bank_code: {
      type: String,
      trim: true,
      default: "",
    },
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
    enum: ["attendee", "organizer"], // Allowed roles
    default: "attendee",
    required: true,
  },
});

// Generate JWT method
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

// Export model with explicit collection name "Users"
module.exports = mongoose.model("User", userSchema, "Users");

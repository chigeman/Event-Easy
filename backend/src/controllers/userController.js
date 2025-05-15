const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");

const registerUser = async (req, res) => {
  const { name, email, password ,role} = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send the welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Event Easy",
      text: `Hello ${name},\n\nThank you for registering on Event Easy! We are excited to have you on board.\n\nBest regards,\nEvent Easy Team`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Welcome email sent to:", email);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Optional: continue even if email fails
    }

    return res.status(200).json({ message: "User created successfully", user ,token });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Error creating user", error: err });
  }
};

const loginUser =async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Attendee not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Optional: Generate JWT token here if needed
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' , sameSite:process.env.NODE_ENV === 'production'?"none" : "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.status(200).json({ message: "Login successful", userId: user._id , token });
   

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
}

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production' , 
      sameSite:process.env.NODE_ENV === 'production'?"none" : "Strict", 
    });

    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
}

const sendVerifyOtp = async (req, res) => {
  const { email } = req.body;  // Now we expect email in the body, not from req.user
  try {
    // Find user by email
    const user = await userModel.findOne({ email });  
    
    console.log("Email from request:", email, user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP

    user.verifyOtp = otp;
    user.verifyOtpExpires = Date.now() + 24*60*60*1000 ; // OTP valid for 24 hours
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. It is valid for 24 hours.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("OTP sent to:", user.email);
      return res.status(200).json({ success: true, message: "OTP sent successfully!" });
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return res.status(500).json({ message: "Error sending OTP email" });
    }

  } catch (error) {
    console.error("Error during OTP generation:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
}


const verifyOtp = async (req, res) => {
  const { otp } = req.body; // Get only the OTP from body
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    if (Date.now() > user.verifyOtpExpires) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    user.isVerified = true;
    user.verifyOtp = undefined; // Clear OTP
    user.verifyOtpExpireAt = undefined; // Clear OTP expiry
    await user.save();

    return res.status(200).json({ message: "User verified successfully!" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
};

const isAuthenticated = async (req, res) => {

  try {
    return res.status(200).json({ message: "User is authenticated!" });
  } catch (err) {
    console.log("JWT error:", err.message);
    res.json({success:false,message:err.message});
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password -verifyOtp -verifyOtpExpires"); // Exclude sensitive fields
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.findById(userId).select("-password -verifyOtp -verifyOtpExpires"); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
}

const updateUser = async (req, res) => {
  const userId = req.params.id; // or get it from JWT: req.user.id
  const { name, email, password, role } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if email is changing, and if it's already taken by another user
    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: "Email already in use by another user!" });
      }
      user.email = email;
    }

    // Update name and role if provided
    if (name) user.name = name;

    await user.save();

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Error updating user", error: err });
  }
};



module.exports = { registerUser ,loginUser ,getAllUsers ,logoutUser, sendVerifyOtp, verifyOtp ,isAuthenticated ,getUserById, deleteUser ,updateUser};
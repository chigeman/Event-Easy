require("dotenv").config({ path: "../.env" }); // Load environment variables
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/userModel");

// Connect to the database
const app = express();
app.use(express.json());
app.use(cors());


app.post("/Event-Easy/attendee", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(200).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", error: err });
  }
});


app.post("/Event-Easy/attendee/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const attendee = await userModel.findOne({ email });

    if (!attendee) {
      return res.status(400).json({ message: "Attendee not found!" });
    }

    const isMatch = await bcrypt.compare(password, attendee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Optional: Generate JWT token here if needed
    const token = jwt.sign({ id: attendee._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error, try again later!" });
  }
});

// Start the server 
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
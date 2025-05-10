require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/routes.js');         // Handles register/login/etc.
const userDataRoutes = require('./routes/userRoutes'); // Handles user /data endpoint

const app = express();

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/Event-Easy/attendee', authRoutes);
app.use('/Event-Easy/attendee', userDataRoutes);

// Default fallback route
app.get('/', (req, res) => {
  res.send('🚀 Event-Easy backend is running');
});

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

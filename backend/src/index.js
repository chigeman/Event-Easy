require('dotenv').config(envPath = "../.env");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const router = require('./routes/routes');
const userRouter = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes')
// const userRouter = require('./routes/userRoutes');
// const eventRouter = require('./routes/eventRoutes');


// Route imports


const app = express();

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes


// Default fallback route
app.get('/', (req, res) => {
  res.send('🚀 Event-Easy backend is running');
});

app.use("/Event-Easy/users", router);
app.use("/Event-Easy/user", userRouter);
app.use("/Event-Easy/Event", eventRouter);

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

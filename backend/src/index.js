require('dotenv').config(envPath = "../.env");
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const router = require('./routes/routes');
const userRouter = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes')
// const userRouter = require('./routes/userRoutes');
// const eventRouter = require('./routes/eventRoutes');


const app = express();

// Middleware
app.use(express.json());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true 
}));

app.use("/Event-Easy/users", router);
app.use("/Event-Easy/user", userRouter);
app.use("/Event-Easy/Event", eventRouter);


// Initialize database connection before starting server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);
    });
    
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
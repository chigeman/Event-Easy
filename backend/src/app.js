const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const router = require("./routes/routes");
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const reviewRouter = require("./routes/reviewRoutes");



// Connect to the database
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your React app
  credentials: true, 
}));


app.use("/Event-Easy/users", router);
app.use("/Event-Easy/user", userRouter);
app.use("/Event-Easy/Event", eventRouter);
app.use('/Event-Easy/review', reviewRouter);
 
app.get("/", (req, res) => {
  res.send("Backend for event easy is running...");
});

module.exports = app; // Export the app for use in index.js
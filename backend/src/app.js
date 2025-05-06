const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const router = require("./routes/routes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/users", userRoutes);
app.use("/Event-Easy/attendee", router);
app.use("/Event-Easy/user", userRouter);
 
app.get("/", (req, res) => {
  res.send("Backend for event easy is running...");
});

module.exports = app; // Export the app for use in index.js
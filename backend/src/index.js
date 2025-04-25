require("dotenv").config({ path: "../.env" }); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/routes");
const userRouter = require("./routes/userRoutes");

// Connect to the database
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your React app
  credentials: true, 
}));


app.use("/Event-Easy/attendee", router);
app.use("/Event-Easy/user", userRouter);


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
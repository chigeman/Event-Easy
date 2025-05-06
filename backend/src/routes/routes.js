const express = require("express");
const { registerUser, loginUser, logoutUser, sendVerifyOtp, verifyOtp, isAuthenticated } = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-otp", userAuth, verifyOtp); // Assuming you want to use the same route for verification
router.get("/is-auth", userAuth, isAuthenticated)

module.exports = router;
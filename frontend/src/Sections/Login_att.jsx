import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import bg_1 from "../assets/bg_1.jpg"; // replace or add more bg images if needed

export default function AttendeeLogin() {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentBg, setCurrentBg] = useState(0);

  const bgImages = [bg_1];
  const headingControls = useAnimation();

  useEffect(() => {
    if (hovered) {
      headingControls.start({
        x: [0, 20],
        y: [0, 20],
        transition: { yoyo: Infinity, duration: 0.5 },
      });
    } else {
      headingControls.stop();
    }
  }, [hovered]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="bg-white rounded-3xl shadow-2xl grid grid-cols-2 w-[900px] h-[600px] overflow-hidden relative">
        {/* Glowing circle that follows cursor */}
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 pointer-events-none"
          style={{
            left: mousePos.x - 50,
            top: mousePos.y - 50,
            position: "fixed",
          }}
        />

        {/* Left Side - Login Form */}
        <div className="flex flex-col justify-center px-10">
          <motion.h1
            className="text-4xl font-bold mb-4 text-gray-800"
            animate={headingControls}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ rotate: 1 }}
          >
            Join the Experience!
          </motion.h1>

          <motion.p
            className="mb-6 text-sm text-gray-600"
            whileHover={{ scale: 1.03, color: "#6d28d9" }}
          >
            Log in to explore and attend exciting events near you.
          </motion.p>

          <input
            placeholder="Email Address"
            type="email"
            className="mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
          <input
            placeholder="Password"
            type="password"
            className="mb-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />

          <motion.a
            href="#"
            className="text-sm text-blue-600 hover:underline mb-6"
            whileHover={{ color: "#1e3a8a" }}
          >
            Forgot your password?
          </motion.a>

          <motion.button
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-3 rounded-lg font-semibold shadow-md"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Log In
          </motion.button>

          <div className="text-center text-sm my-4 text-gray-500">
            — or login using —
          </div>

          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
            className="flex items-center justify-center w-full border px-4 py-3 rounded-lg font-medium"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt="Google Logo"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </motion.button>

          <p className="mt-6 text-sm text-center text-gray-600">
            New to events?{" "}
            <Link to="/Signup_Attendee">
            <a href="#" className="text-blue-600 hover:underline">
              Sign up here
            </a>
            </Link>
          </p>
        </div>

        {/* Right Side - Background Image & Quote */}
        <motion.div
          className="relative h-full w-full"
          initial={{ rotateY: 0 }}
          whileHover={{ rotateY: 180 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={bgImages[currentBg]}
            alt="Event Illustration"
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6 }}
          />
          <motion.p
            className="absolute bottom-4 left-4 right-4 text-gray-500 text-sm text-center"
            whileHover={{ x: [0, 10, -10, 0], transition: { duration: 1 } }}
          >
            Your gateway to unforgettable experiences.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

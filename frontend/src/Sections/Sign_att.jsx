import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

import bg_1 from "../assets/bg_1.jpg"; // Feel free to add more images

export default function SignUpAttendee() {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentBg, setCurrentBg] = useState(0);

  const bgImages = [bg_1];
  const headingControls = useAnimation();

  useEffect(() => {
    if (hovered) {
      headingControls.start({
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.6, repeat: Infinity },
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
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-pink-600 text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div className="bg-white rounded-3xl shadow-2xl grid grid-cols-2 w-[900px] h-[650px] overflow-hidden relative">
        {/* Glowing Cursor Circle */}
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-yellow-400 opacity-20 pointer-events-none"
          style={{
            left: mousePos.x - 50,
            top: mousePos.y - 50,
            position: "fixed",
          }}
        />

        {/* Left Side - Sign Up Form */}
        <div className="flex flex-col justify-center px-10">
          <motion.h1
            className="text-4xl font-bold mb-4 text-gray-800"
            animate={headingControls}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ color: "#ec4899" }}
          >
            Join the Event Vibe!
          </motion.h1>

          <motion.p
            className="mb-6 text-sm text-gray-600"
            whileHover={{ scale: 1.04 }}
          >
            Create an attendee account and never miss a moment of excitement!
          </motion.p>

          <input
            placeholder="Full Name"
            type="text"
            className="mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
          />
          <input
            placeholder="Email Address"
            type="email"
            className="mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
          />
          <input
            placeholder="Password"
            type="password"
            className="mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
          />
          <input
            placeholder="Confirm Password"
            type="password"
            className="mb-6 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
          />

          <motion.button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-lg font-semibold shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
          <div className="text-center text-sm my-4 text-gray-500">
            — or sign up using —
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
            Sign up with Google
          </motion.button>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/Login_Attendee">
            <a href="#" className="text-pink-600 hover:underline">
              Log in here
            </a>
            </Link>
          </p>
        </div>

        {/* Right Side - Background and Quote */}
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={bgImages[currentBg]}
            alt="Event Background"
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
          <motion.p
            className="absolute bottom-4 left-4 right-4 text-gray-100 text-sm text-center bg-black bg-opacity-30 px-2 py-1 rounded"
            whileHover={{
              rotate: [0, -2, 2, 0],
              transition: { duration: 1 },
            }}
          >
            Be more than a spectator — be part of the experience! 🎉
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

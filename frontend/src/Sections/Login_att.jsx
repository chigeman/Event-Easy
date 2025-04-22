import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bg_1 from "../assets/bg_1.jpg";

export default function AttendeeLogin() {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentBg, setCurrentBg] = useState(0);
  const headingControls = useAnimation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/Event-Easy/attendee/login", formData)
      .then((response) => {
        console.log("Login successful:", response.data);
        alert("Welcome back! 🎉");
        // You can redirect after login here
        navigate("/Attendee_Dashboard");
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Invalid credentials or server issue. Try again!");
      });
  };

  useEffect(() => {
    if (hovered) {
      headingControls.start({
        rotate: [0, 3, -3, 0],
        transition: { duration: 0.5, repeat: Infinity },
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
      setCurrentBg((prev) => (prev + 1) % 1); // Only one image now
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
            whileHover={{ color: "#6366f1" }}
          >
            Welcome Back!
          </motion.h1>

          <motion.p
            className="mb-6 text-sm text-gray-600"
            whileHover={{ scale: 1.03 }}
          >
            Log in and dive back into the event excitement.
          </motion.p>

          <form onSubmit={handleSubmit}>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              type="email"
              className="mb-4 px-4 py-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              className="mb-4 px-4 py-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
            <motion.a
              href="#"
              className="text-sm text-indigo-600 hover:underline mb-6 inline-block"
              whileHover={{ color: "#4f46e5" }}
            >
              Forgot your password?
            </motion.a>

            <motion.button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Log In
            </motion.button>
          </form>

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
            <Link to="/Signup_Attendee" className="text-indigo-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Right Side - Background Image & Quote */}
        <motion.div
          className="relative h-full w-full"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={bg_1}
            alt="Event Background"
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6 }}
          />
          <motion.p
            className="absolute bottom-4 left-4 right-4 text-white text-sm text-center bg-black bg-opacity-30 px-2 py-1 rounded"
            whileHover={{
              x: [0, 5, -5, 0],
              transition: { duration: 1 },
            }}
          >
            Unlock moments. Unleash memories. 🌟
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

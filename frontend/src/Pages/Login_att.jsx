import { motion, useAnimation } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bg_1 from "../assets/bg_1.jpg";
import { appContent } from "../context/AppContext";

export default function AttendeeLogin() {
  const { setIsLoggedin, getUserData } = useContext(appContent);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentBg, setCurrentBg] = useState(0);
  const headingControls = useAnimation();
  const navigate = useNavigate();
  const [state, setState] = useState('Sign In'); // Default state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // add confirmPassword field for validation
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        // Step 1: Check if passwords match
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        // Step 2: Send registration request with role set to "attendee"
        const { data } = await axios.post("http://localhost:5000/Event-Easy/users/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'attendee',  // Adding the role field
        });

        // Step 3: Check if user was created successfully
        if (data.message === "User created successfully") {
          alert("Signup successful!");
          setIsLoggedin(true);

          // If the backend sends a token after signup, store it like login
          if (data.token) {
            localStorage.setItem("token", data.token); // Save the token
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; // Set token in axios headers
          }

          await getUserData(); // fetch user data after registration

          // Step 4: Send OTP for email verification
          await sendVerificatonOtp(formData.email);  // Ensure OTP is sent here
          navigate("/email-verify");   // Redirect to email verification page
        } else {
          alert("Signup failed: " + data.message);
        }

        return; // stop here, don't proceed to login below
      }

      // Login logic (Sign In)
      const response = await axios.post(
        "http://localhost:5000/Event-Easy/users/login",
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setIsLoggedin(true);
        await getUserData();
        alert("Login successful! Welcome back! 🎉");
        navigate("/Attendee");
      }

    } catch (error) {
      console.error("Auth error:", error);
      if (error.response && error.response.data) {
        alert(`Server Error: ${error.response.data.message || "Unknown error"}`);
      } else {
        alert("Connection issue. Is the server running?");
      }
    }
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
      setCurrentBg((prev) => (prev + 1) % 1);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const sendVerificatonOtp = async (email) => {
    try {
      axios.defaults.withCredentials = true;

      // Send the email to the backend to trigger OTP
      const { data } = await axios.post(
        'http://localhost:5000/Event-Easy/users/send-verify-otp',
        { email },  // Send the email as part of the body
        { withCredentials: true }
      );

      if (data.success) {
        console.log("Verification email sent successfully:", data.message);
        alert("An OTP has been sent to your email address. Please verify your email.");
      } else {
        console.error("Failed to send verification email:", data.message);
        alert("Failed to send verification OTP. Please try again.");
      }

    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("There was an error sending the OTP. Please try again.");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 text-gray-800 px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="bg-white rounded-2xl shadow-2xl grid grid-cols-2 w-[90vw] max-w-[750px] h-[85vh] overflow-hidden relative">
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 pointer-events-none"
          style={{
            left: mousePos.x - 30,
            top: mousePos.y - 30,
            position: "fixed",
          }}
        />

        {/* Left Side - Login Form */}
        <div className="flex flex-col justify-center px-6 text-xs md:text-sm">
          <div>
            <h2>
              {state === "Sign Up" ? (
                <motion.h1
                  className="text-2xl md:text-3xl font-bold mb-2 text-gray-800"
                  animate={headingControls}
                  onHoverStart={() => setHovered(true)}
                  onHoverEnd={() => setHovered(false)}
                  whileHover={{ color: "#ec4899" }}
                >
                  Join the Event Vibe!
                </motion.h1>
              ) : (
                <motion.h1
                  className="text-2xl md:text-3xl font-bold mb-2 text-gray-800"
                  animate={headingControls}
                  onHoverStart={() => setHovered(true)}
                  onHoverEnd={() => setHovered(false)}
                  whileHover={{ color: "#6366f1" }}
                >
                  Welcome Back!
                </motion.h1>
              )}
            </h2>
            <p>
              {state === "Sign Up" ? (
                <motion.p
                  className="mb-4 text-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  Create an attendee account and never miss a moment of excitement!
                </motion.p>
              ) : (
                <motion.p
                  className="mb-4 text-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  Log in and dive back into the event excitement.
                </motion.p>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {(state === "Sign In" || state === "Sign Up") && (
              <>
                {state === "Sign Up" && (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    type="text"
                    className="mb-3 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs"
                    required
                  />
                )}
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  type="email"
                  className={`mb-3 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 ${
                    state === "Sign Up" ? "focus:ring-pink-400" : "focus:ring-indigo-500"
                  } text-xs`}
                  required
                />
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  className={`mb-3 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 ${
                    state === "Sign Up" ? "focus:ring-pink-400" : "focus:ring-indigo-500"
                  } text-xs`}
                  required
                />
                {state === "Sign Up" && (
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    type="password"
                    className="mb-4 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs"
                    required
                  />
                )}
              </>
            )}

            <motion.a
              href="#"
              className="text-xs text-indigo-600 hover:underline mb-4 inline-block"
              whileHover={{ color: "#4f46e5" }}
            >
              Forgot your password?
            </motion.a>

            <motion.button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md font-semibold text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {state}
            </motion.button>
          </form>

          <div className="text-center text-xs my-3 text-gray-500">
            — Or {state} using —
          </div>

          {/* Google Auth Button + Toggle */}
          <div>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
              className="flex items-center justify-center w-full border px-3 py-2 rounded-md font-medium text-xs"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                alt="Google Logo"
                className="w-4 h-4 mr-2"
              />
              {state} with Google
            </motion.button>

            <p className="mt-4 text-xs text-center text-gray-600">
              {state === "Sign Up" ? "Already have an account?" : "New to events?"}{" "}
              <span
                className="text-indigo-600 hover:underline cursor-pointer"
                onClick={() =>
                  setState(state === "Sign In" ? "Sign Up" : "Sign In")
                }
              >
                {state === "Sign In" ? "Sign-Up here" : "Login here"}
              </span>
            </p>
          </div>
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
            className="absolute bottom-2 left-2 right-2 text-white text-xs text-center bg-black bg-opacity-30 px-2 py-1 rounded"
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

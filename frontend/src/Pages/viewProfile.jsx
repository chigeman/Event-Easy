// UserProfileCommon.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaTwitter,
  FaChartBar, FaMapMarkerAlt, FaBriefcase, FaLinkedin, FaChevronDown, FaEdit, FaTimes // Added FaEdit, FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AppContent } from "../context/AppContext"; // Ensure this path is correct
import EditProfileModalContent from "./editProfile"; // Assuming EditProfile is renamed/exported as EditProfileModalContent
import { toast } from 'react-toastify'; // Import toast for messages

// Animation Variants (refined for more flow) - Keep these as they are
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.5, ease: "easeIn" } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.15,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -30 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

const socialIconHover = {
  scale: 1.3,
  rotate: [0, 15, -15, 0],
  transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 10 },
};

const floatVariants = {
  initial: { opacity: 0, y: 0, x: 0 },
  animate: {
    opacity: 0.1,
    y: [0, -20, 0],
    x: [0, 10, -10, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};


const buttonHoverTap = { // Added for the edit button
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
};

const UserProfileCommon = ({ profileMode = "organizer" }) => {
  const { userData, setUserData } = useContext(AppContent); // Get setUserData from context
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const isOrganizer = profileMode === "organizer";

  // State for controlling the Edit Profile modal visibility
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    name = "Anonymous",
    role = "User",
    bio = "No bio available.",
    email = "no-email@example.com",
    phone = "",
    image = "",
    location = "",
    social = {},
    stats = { eventsOrganized: 0, eventsAttended: 0, averageRating: 0, categories: [] },
  } = userData || {};

  // Function to re-fetch user data after an update
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = userData?._id;
      if (!userId) return;

      const userRes = await axios.get(
        `http://localhost:5000/Event-Easy/users/${userId}`, // Your endpoint to get user data
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(userRes.data); // Update context
      // No toast.success here, EditProfileModalContent already handles it.
    } catch (err) {
      console.error("Failed to re-fetch user data", err);
      toast.error("Failed to reload profile data after update.");
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = userData?._id;
        if (!userId) return;

        // Fetch events and reviews based on profileMode
        if (isOrganizer) {
          const eventsRes = await axios.get(
            `http://localhost:5000/Event-Easy/Event/events/organizer/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setEvents(eventsRes.data);

          const reviewRes = await axios.get(
            `http://localhost:5000/Event-Easy/review/organizer/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReviews(reviewRes.data.reviews || []);
          setAverageRating(parseFloat(reviewRes.data.averageRating || 0));
        } else {
          const attendedRes = await axios.get(
            `http://localhost:5000/Event-Easy/ticket/attendee/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setEvents(attendedRes.data || []);
        }
      } catch (err) {
        console.error("Failed fetching profile data", err);
      }
    };
    fetchData();
  }, [userData?._id, profileMode]); // Depend on userData._id to re-fetch if the user changes


  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200&font-size=0.33`;

  // --- SLIDER LOGIC ---
  const carouselWrapperRef = useRef(null);
  const carouselContentRef = useRef(null);
  const [constraints, setConstraints] = useState(0);

  useEffect(() => {
    const calculateConstraints = () => {
      if (carouselContentRef.current && carouselWrapperRef.current) {
        const contentWidth = carouselContentRef.current.scrollWidth;
        const wrapperWidth = carouselWrapperRef.current.offsetWidth;
        setConstraints(contentWidth > wrapperWidth ? contentWidth - wrapperWidth : 0);
      }
    };

    calculateConstraints();
    window.addEventListener('resize', calculateConstraints);

    return () => {
      window.removeEventListener('resize', calculateConstraints);
    };
  }, [reviews]); // Recalculate if reviews change, ensuring all DOM elements are present


  return (
    <AnimatePresence mode="wait">
      <motion.div key="user-profile" variants={pageVariants} initial="initial" animate="animate" exit="exit"
        className="min-h-screen relative overflow-hidden
                   bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100
                   dark:from-gray-900 dark:via-slate-800 dark:to-gray-900
                   py-12 px-4 flex justify-center items-start">

        {/* Subtle Floating Shapes (Background) */}
        <motion.div
          variants={floatVariants} initial="initial" animate="animate"
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400 dark:bg-purple-700 rounded-full blur-2xl opacity-10"
        ></motion.div>
        <motion.div
          variants={floatVariants} initial="initial" animate="animate"
          className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-indigo-300 dark:bg-indigo-600 rounded-full blur-2xl opacity-10"
          style={{ animationDelay: '2s' }}
        ></motion.div>
        <motion.div
          variants={floatVariants} initial="initial" animate="animate"
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-300 dark:bg-pink-600 rounded-full blur-2xl opacity-10"
          style={{ animationDelay: '4s' }}
        ></motion.div>

        {/* Main Content Card */}
        <motion.div className="max-w-4xl w-full mx-auto p-6 sm:p-8 mt-10 rounded-3xl shadow-2xl
          bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: "circOut" } }}
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Edit Profile Button */}
          {/* You might want to add logic here to only show this button if the logged-in user is viewing their own profile */}
          {userData?._id && ( // Example: if userData exists, assume it's the current user's profile
            <motion.button
              {...buttonHoverTap}
              onClick={() => setShowEditModal(true)}
              className="absolute top-4 right-4 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full shadow-lg transition-colors z-20"
              aria-label="Edit Profile"
            >
              <FaEdit className="text-xl" />
            </motion.button>
          )}

          {/* Profile Header */}
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
            <motion.img
              src={userData?.imageUrl?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'U')}&background=0D8ABC&color=fff`}              alt={name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.3 } }}
            />
            <motion.div variants={itemVariants} className="text-center sm:text-left flex-1 space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 animate-gradient">
                {name}
              </h1>
              <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-center sm:justify-start gap-2">
                <FaBriefcase /> {role}
              </p>
              {location && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
                  <FaMapMarkerAlt /> {location}
                </p>
              )}
              <p className="text-base text-gray-700 dark:text-gray-300 pt-2 leading-relaxed max-w-prose mx-auto sm:mx-0">{bio}</p>
            </motion.div>
          </motion.div>

          {/* Scroll Down Indicator (Pro Tip) */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 dark:text-gray-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaChevronDown size={24} />
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="mb-10 p-6 bg-white/50 dark:bg-gray-700/40 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-3">
              <FaPhone /> Contact & Socials
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <motion.p variants={itemVariants} className="flex items-center gap-3">
                <FaEnvelope className="text-indigo-500" /> <a href={`mailto:${email}`} className="hover:text-indigo-600 transition-colors">{email}</a>
              </motion.p>
              {phone && <motion.p variants={itemVariants} className="flex items-center gap-3">
                <FaPhone className="text-indigo-500" /> {phone}
              </motion.p>}
            </div>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-5 mt-6 text-3xl justify-center sm:justify-start">
              {Object.entries(social).map(([key, url]) => {
                if (!url) return null;
                const icons = { facebook: FaFacebook, twitter: FaTwitter, instagram: FaInstagram, linkedin: FaLinkedin };
                const Icon = icons[key];
                return (
                  <motion.a whileHover={socialIconHover} key={key} href={url} target="_blank" rel="noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                    <Icon />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Activity Section */}
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="mb-10 p-6 bg-white/50 dark:bg-gray-700/40 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-6 flex items-center gap-3">
              <FaChartBar /> {isOrganizer ? "Organizer Stats" : "My Participation"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {isOrganizer ? (
                <>
                  <motion.div variants={itemVariants}>
                    <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{events.length}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Events Organized</p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.eventsAttended}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Events Attended</p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{averageRating.toFixed(1)}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Avg Rating</p>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={itemVariants}>
                  <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{events.length}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">Events Attended</p>
                </motion.div>
              )}
            </div>

            {/* Categories */}
            {isOrganizer && (
              <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-3">
                {stats.categories.length > 0 ? (
                  stats.categories.map((cat) => (
                    <motion.span key={cat} variants={badgeVariants}
                      className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-full text-base font-medium shadow-md">
                      {cat}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-center w-full">No categories listed yet.</p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Reviews - NOW A DRAGGABLE SLIDER */}
          {isOrganizer && (
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
              className="mb-10 p-6 bg-white/50 dark:bg-gray-700/40 rounded-2xl shadow-md relative">
              <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-3">🗨️ Reviews</h2>
              {reviews.length > 0 ? (
                // Outer wrapper for the carousel that defines the visible area
                <div ref={carouselWrapperRef} className="overflow-hidden">
                  {/* Inner motion.div that will be draggable */}
                  <motion.div
                    ref={carouselContentRef}
                    className="flex cursor-grab active:cursor-grabbing pb-4"
                    whileTap={{ cursor: "grabbing" }}
                    drag="x"
                    dragConstraints={{ right: 0, left: -constraints }}
                  >
                    {reviews.map((rev) => (
                      <motion.div
                        key={rev._id}
                        variants={itemVariants}
                        className="min-w-[calc(100%-2rem)] sm:min-w-[calc(50%-1rem)] xl:min-w-[calc(33.333%-1rem)]
                                   bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700
                                   transition-all hover:shadow-lg mr-4 flex-shrink-0"
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{rev.userId?.name || "Anonymous"} | {new Date(rev.createdAt).toLocaleDateString()}</p>
                        <p className="mt-2 text-gray-800 dark:text-gray-200 line-clamp-3">{rev.comment}</p>
                        <p className="text-yellow-500 mt-2 text-xl">{"⭐".repeat(rev.rating)} <span className="text-sm font-medium">({rev.rating}/5)</span></p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <p className="italic text-gray-500 text-center">No reviews yet. Be the first to leave one!</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            key="edit-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex justify-center items-center p-4 transition-opacity"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              key="edit-modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Edit Profile</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
              {/* Pass onClose and onUpdateSuccess to the EditProfileModalContent */}
              <EditProfileModalContent
                onClose={() => setShowEditModal(false)}
                onUpdateSuccess={fetchUserData} // This will trigger re-fetching user data in UserProfileCommon
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default UserProfileCommon;
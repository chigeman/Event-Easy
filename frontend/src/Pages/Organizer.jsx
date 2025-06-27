import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext'; // Using your actual AppContent
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarCheck, FaLayerGroup, FaClock, FaShapes, FaComments, FaStar,
  FaUpload, FaVideo, FaPaperPlane, FaSpinner, FaUserCircle, FaPlusCircle,
  FaListAlt, FaEdit // Added for potential future use or consistency
} from 'react-icons/fa'; // Using react-icons for consistency

// Animation Variants (inspired by UserProfile example)
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeInOut' } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2, delayChildren: i * 0.1, duration: 0.7, ease: 'easeOut' },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const cardHover = {
  scale: 1.03,
  boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
  transition: { type: "spring", stiffness: 300, damping: 15 }
};

const buttonHoverTap = {
  hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" },
  tap: { scale: 0.95 }
};

const Organizer = () => {
  // Using your actual AppContent. Ensure AppContent.Provider is wrapping this component tree.
  const appContextValue = useContext(AppContent);

  // Defensive check for appContextValue and userData
  const userData = appContextValue ? appContextValue.userData : null;


  const [form, setForm] = useState({
    eventName: '',
    time: '',
    category: '',
    pattern: '',
    description: '',
    updates: '',
  });

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [events, setEvents] = useState([]);
  const [reviewsByEvent, setReviewsByEvent] = useState({});

  // Default profile image if not available from userData
  const profileImage = userData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'O')}&background=8B5CF6&color=fff&size=128`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === 'imageUrl') setImage(file);
    else if (e.target.name === 'videoUrl') setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?._id) {
        setMsg('Error: Organizer data is not available or Organizer ID is missing. Please ensure you are logged in and context is providing data.');
        return;
    }
    setLoading(true);
    setMsg('');

    const formDataToSend = new FormData();
    Object.entries(form).forEach(([key, value]) => formDataToSend.append(key, value));
    if (image) formDataToSend.append('imageUrl', image);
    if (video) formDataToSend.append('videoUrl', video);
    
    formDataToSend.append('organizer', userData._id);


    try {
      await axios.post('http://localhost:5000/Event-Easy/Event/createEvents', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMsg('Event created successfully! 🎉');
      setForm({ eventName: '', time: '', category: '', pattern: '', description: '', updates: '' }); // Reset form
      setImage(null);
      setVideo(null);
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
      fetchEvents(); // Refresh event list
    } catch (err) {
      console.error('Event creation error:', err.response?.data || err.message);
      setMsg(`Failed to create event: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (!userData?._id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/Event-Easy/Event/events/organizer/${userData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(res.data || []);
      if (res.data && res.data.length > 0) {
        fetchReviewsForEvents(res.data);
      } else {
        setReviewsByEvent({});
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const fetchReviewsForEvents = async (eventList) => {
    const token = localStorage.getItem('token');
    const reviewMap = {};
    for (const event of eventList) {
      try {
        const res = await axios.get(
          `http://localhost:5000/Event-Easy/review/${event._id}/reviews`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        reviewMap[event._id] = res.data.reviews || res.data || [];
      } catch (error) {
        console.error(`Error fetching reviews for event ${event._id}:`, error);
        reviewMap[event._id] = [];
      }
    }
    setReviewsByEvent(reviewMap);
  };

  useEffect(() => {
    if (userData?._id) { 
      fetchEvents();
    } else if (appContextValue === undefined) {
        console.warn("AppContent context is undefined. Make sure Organizer component is wrapped in AppContent.Provider.");
        setMsg("Error: Application context not found. Please contact support or try refreshing.");
    }
  }, [userData?._id, appContextValue]); 

  // Conditional rendering if userData is not available
  if (!userData) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-stone-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <FaSpinner className="animate-spin text-4xl text-indigo-600 dark:text-indigo-400 mb-4" />
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
                Loading organizer data or user not logged in...
            </p>
            {msg && <p className="mt-4 text-red-500 dark:text-red-400 text-center">{msg}</p>}
            {/* You might want to add a link to the login page here */}
        </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="organizer-page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Organizer Profile Header - Hero Section */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 mb-12 p-6 sm:p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 rounded-2xl shadow-xl text-white"
          >
            <motion.img
              src={profileImage}
              alt={userData.name || "Organizer"}
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <motion.div variants={itemVariants} className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold">{userData.name || "Organizer Dashboard"}</h1>
              <p className="text-md sm:text-lg mt-1 text-indigo-200 flex items-center justify-center sm:justify-start">
                <FaCalendarCheck className="mr-2" />
                Managing {events.length} Event{events.length !== 1 && 's'}
              </p>
            </motion.div>
          </motion.div>

          {/* Events List Section */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={2}
          >
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 sm:mb-8 flex items-center gap-3">
              <FaListAlt /> Your Events
            </h2>
            {events.length === 0 && !loading && (
                 <motion.p variants={itemVariants} className="text-center text-gray-500 dark:text-gray-400 py-8 text-lg">
                    You haven't created any events yet. Let's make some magic happen! ✨
                 </motion.p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  variants={itemVariants}
                  whileHover={cardHover}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.eventName}</h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1 flex items-center"><FaLayerGroup className="mr-2 opacity-70" />{event.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center"><FaClock className="mr-2 opacity-70" />{new Date(event.time).toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center"><FaShapes className="mr-2 opacity-70" />{event.pattern}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3">
                      {event.description}
                    </p>
                  </div>

                  {reviewsByEvent[event._id]?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto', transition: { delay: 0.2 } }}
                      className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3"
                    >
                      <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm flex items-center">
                        <FaComments className="mr-2 opacity-80" />Recent Reviews ({reviewsByEvent[event._id].length})
                      </h4>
                      <ul className="space-y-2 max-h-32 overflow-y-auto pr-1 text-xs custom-scrollbar">
                        {reviewsByEvent[event._id].slice(0, 2).map((review) => ( 
                          <li key={review._id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                            <p className="text-gray-800 dark:text-gray-100 truncate">"{review.comment}"</p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-500'} />
                              ))}
                              <span className="ml-2 text-gray-500 dark:text-gray-400">({review.rating}/5)</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Event Creation Form Section */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={3}
            className="p-6 sm:p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-8 flex items-center justify-center gap-3">
              <FaPlusCircle /> Create New Event
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {[
                { name: 'eventName', label: 'Event Name', type: 'text', placeholder: 'e.g., Annual Tech Summit' },
                { name: 'time', label: 'Date and Time', type: 'datetime-local' },
                { name: 'category', label: 'Category', type: 'select', options: [
                    { value: "", label: "-- Select Category --" },
                    { value: "Educational/Academic Events", label: "Educational/Academic" },
                    { value: "Social & Cultural Events", label: "Social & Cultural" },
                    { value: "Sports & Recreational Events", label: "Sports & Recreational" },
                    { value: "Entertainment Events", label: "Entertainment" },
                    { value: "Professional & Educational Events", label: "Professional" },
                    { value: "Religious", label: "Religious" },
                  ]
                },
                { name: 'pattern', label: 'Event Pattern/Type', type: 'text', placeholder: 'e.g., Workshop, Conference, Meetup' },
                { name: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'Describe your event in detail...' },
                { name: 'updates', label: 'Additional Updates (Optional)', type: 'textarea', rows: 2, placeholder: 'Any specific updates or notes?' },
              ].map((field) => (
                <motion.div key={field.name} variants={itemVariants}>
                  <label htmlFor={field.name} className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      required={field.name !== 'updates'}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-shadow hover:shadow-md"
                    >
                      {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={field.rows}
                      value={form[field.name]}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-shadow hover:shadow-md"
                      placeholder={field.placeholder}
                      onChange={handleChange}
                      required={field.name !== 'updates' && field.name !== 'description'}
                    />
                  ) : (
                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-shadow hover:shadow-md"
                      placeholder={field.placeholder}
                      onChange={handleChange}
                      required={field.name !== 'updates'}
                    />
                  )}
                </motion.div>
              ))}

              <motion.div variants={itemVariants}>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><FaUpload /> Event Image</label>
                <input type="file" name="imageUrl" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-800 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-700 cursor-pointer"/>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><FaVideo /> Event Video (Optional)</label>
                <input type="file" name="videoUrl" accept="video/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-800 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-700 cursor-pointer"/>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? buttonHoverTap.hover : {}}
                  whileTap={!loading ? buttonHoverTap.tap : {}}
                  className={`px-8 py-3 font-bold text-white rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg flex items-center justify-center gap-2
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                  {loading ? 'Submitting...' : 'Create Event'}
                </motion.button>
              </motion.div>
            </form>

            {msg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 text-center p-3 rounded-md text-sm font-medium ${msg.includes('success') ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'}`}
              >
                {msg}
              </motion.div>
            )}
          </motion.section>
        </div>
      </motion.div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; // cool-gray-300
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563; // gray-600
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; // cool-gray-400
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280; // gray-500
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default Organizer;

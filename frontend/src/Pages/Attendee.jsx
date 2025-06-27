import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from "date-fns";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFilter, FaStar, FaCommentDots, FaPaperPlane, FaExclamationTriangle, FaTimes,
  FaCalendarAlt, FaTag, FaInfoCircle, FaVideo, FaImage, FaChevronDown, FaChevronUp,
  FaFlag, FaSignInAlt, FaPlus, FaSpinner, FaUserCircle // Added FaSpinner and FaUserCircle
} from 'react-icons/fa';

// Define categories for filtering
const categories = [
  'Educational/Academic Events',
  'Social & Cultural Events',
  'Sports & Recreational Events',
  'Entertainment Events',
  'Professional & Educational Events',
  'Religious',
];

// Define reasons for reporting, matching the backend enum
const reportReasons = [
  'Inappropriate Content',
  'Misleading Information',
  'Safety Concern',
  'Spam',
  'Fraudulent Event',
  'Organizer Issue',
  'Venue Problem',
  'Technical Issue',
  'Other'
];

// Animation Variants
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
    transition: { staggerChildren: 0.1, delayChildren: i * 0.05, duration: 0.7, ease: 'easeOut' },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const cardHover = {
  scale: 1.02,
  boxShadow: "0px 10px 30px rgba(0,0,0,0.08)", // Softer shadow
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

const buttonHoverTap = {
  hover: { scale: 1.05, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" },
  tap: { scale: 0.95 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2, ease: 'easeIn' } }
};


const AttendeePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [reviews, setReviews] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingEvent, setReportingEvent] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportStatusMessage, setReportStatusMessage] = useState('');
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);


  const toggleShowAll = (eventId) => {
    setShowAllComments(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleRatingChange = (eventId, value) => {
    setRatings({ ...ratings, [eventId]: value });
  };

  const handleCommentChange = (eventId, text) => {
    setComments({ ...comments, [eventId]: text });
  };

  const handleSubmitReview = async (eventId) => {
    const rating = ratings[eventId] || 0;
    const comment = comments[eventId] || '';
    const reviewData = { rating, comment };
    const token = localStorage.getItem('token');

    if (!rating) {
      // Consider a more styled notification instead of alert
      setReportStatusMessage({type: 'error', text: 'Please select a rating before submitting.'});
      setTimeout(() => setReportStatusMessage(''), 3000);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/Event-Easy/review/${eventId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        setReportStatusMessage({type: 'success', text: 'Review submitted successfully!'});
        setComments((prev) => ({ ...prev, [eventId]: '' }));
        setRatings((prev) => ({ ...prev, [eventId]: '' }));
        fetchReviews(eventId);
      } else {
        const errorData = await res.json();
        setReportStatusMessage({type: 'error', text: `Failed to submit review: ${errorData.message || 'Please try again.'}`});
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setReportStatusMessage({type: 'error', text: 'An error occurred while submitting your review.'});
    }
    setTimeout(() => setReportStatusMessage(''), 3000); // Clear message after 3s
  };

  const fetchReviews = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:5000/Event-Easy/review/${eventId}/reviews`);
      setReviews((prev) => ({ ...prev, [eventId]: response.data.reviews || [] }));
    } catch (error) {
      console.error(`Error fetching reviews for event ${eventId}:`, error);
      setReviews((prev) => ({ ...prev, [eventId]: [] }));
    }
  };

  const calculateAverageRating = (eventId) => {
    const eventReviews = reviews[eventId];
    if (!eventReviews || eventReviews.length === 0) return null;
    const total = eventReviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / eventReviews.length).toFixed(1);
  };

  const handleOpenReportModal = (event) => {
    setReportingEvent(event);
    setShowReportModal(true);
    setReportReason('');
    setReportDescription('');
    setReportStatusMessage('');
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportingEvent(null);
  };

  const handleSubmitReport = async () => {
    if (!reportingEvent || !reportReason || !reportDescription) {
      setReportStatusMessage({type: 'error', text: 'Reason and description are required.'});
      setTimeout(() => setReportStatusMessage(''), 3000);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setReportStatusMessage({type: 'error', text: 'You must be logged in to report an event.'});
      setTimeout(() => setReportStatusMessage(''), 3000);
      return;
    }
    const reportData = { eventId: reportingEvent._id, reason: reportReason, description: reportDescription };
    try {
      // Ensure this endpoint matches your backend: /api/reports (POST)
      const response = await axios.post('http://localhost:5000/api/reports', reportData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (response.status === 201) {
        setReportStatusMessage({type: 'success', text: 'Event reported successfully!'});
        setTimeout(() => {
            handleCloseReportModal();
            setReportStatusMessage('');
        }, 2000);
      } else {
        setReportStatusMessage({type: 'error', text: response.data.message || 'Failed to report event.'});
        setTimeout(() => setReportStatusMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting report:', error.response?.data?.message || error.message);
      setReportStatusMessage({type: 'error', text: error.response?.data?.message || 'An error occurred.'});
      setTimeout(() => setReportStatusMessage(''), 3000);
    }
  };

  useEffect(() => {
    setIsLoadingEvents(true);
    fetch('http://localhost:5000/Event-Easy/Event/events')
      .then((res) => res.json())
      .then((data) => {
        const allEvents = Array.isArray(data) ? data : (data.events || []);
        const approvedEvents = allEvents.filter((event) => event.status === 'approved');
        setEvents(approvedEvents);
        setFilteredEvents(approvedEvents);
        approvedEvents.forEach((event) => fetchReviews(event._id));
      })
      .catch((error) => console.error('Error fetching events:', error))
      .finally(() => setIsLoadingEvents(false));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredEvents(
      category === 'All' ? events : events.filter((e) => e.category === category)
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="attendee-page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 min-h-screen py-10 px-4 sm:px-6 flex flex-col items-center"
      >
        <div className="max-w-6xl w-full space-y-10">
          {/* Category Filter */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-5 flex items-center gap-2">
              <FaFilter /> Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {['All', ...categories].map((category) => (
                <motion.button
                  key={category}
                  variants={itemVariants}
                  whileHover={buttonHoverTap.hover}
                  whileTap={buttonHoverTap.tap}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                    ${selectedCategory === category 
                      ? 'bg-indigo-600 text-white border-indigo-600 focus:ring-indigo-500' 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 focus:ring-indigo-400'}`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.section>

          {/* Global Status Message for Reviews/Reports */}
          <AnimatePresence>
            {reportStatusMessage?.text && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed top-5 right-5 p-4 rounded-lg shadow-xl text-sm z-[100]
                        ${reportStatusMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                >
                    {reportStatusMessage.text}
                </motion.div>
            )}
          </AnimatePresence>
          
          {isLoadingEvents && (
            <motion.div variants={itemVariants} className="flex justify-center items-center py-20">
                <FaSpinner className="animate-spin text-4xl text-indigo-500" />
                <p className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading events...</p>
            </motion.div>
          )}

          {/* Event Cards */}
          {!isLoadingEvents && filteredEvents.length === 0 && (
            <motion.p variants={itemVariants} className="text-center text-xl text-gray-500 dark:text-gray-400 py-16">
              No events found for "{selectedCategory}". Try a different category! ✨
            </motion.p>
          )}

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={2} // Stagger after filter
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredEvents.map((event) => {
              const organizerName = event.organizer?.name || 'Unknown Organizer';
              const organizerImage = event.organizer?.imageUrl?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(organizerName)}&background=random&color=fff&font-size=0.33`;
              const eventReviews = reviews[event._id] || [];
              const visibleReviews = eventReviews.slice(0, showAllComments[event._id] ? eventReviews.length : 2); // Show 2 by default

              return (
                <motion.div
                  key={event._id}
                  variants={itemVariants}
                  whileHover={cardHover}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-6 flex flex-col space-y-4 border border-gray-200 dark:border-gray-700/80 overflow-hidden"
                >
                  {/* Organizer Info */}
                  <div className="flex items-center space-x-3">
                    <img src={organizerImage} alt={organizerName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-700" onError={(e) => e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(organizerName)}&background=random&color=fff&font-size=0.33`} />
                    <div>
                      <p className="text-sm sm:text-md font-bold text-gray-900 dark:text-white">{organizerName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <FaCalendarAlt className="mr-1.5" /> {event.createdAt ? formatDistanceToNow(new Date(event.createdAt), { addSuffix: true }) : 'Date unavailable'}
                      </p>
                    </div>
                  </div>

                  {/* Event Content */}
                  <h2 className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-400 line-clamp-2">{event.eventName || event.title || 'Event Title Missing'}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{event.description || 'No description available.'}</p>

                  {/* Media */}
                  {(event.imageUrl?.url || event.videoUrl?.url) && (
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {event.imageUrl?.url && (
                        <motion.img whileHover={{scale:1.05}} src={event.imageUrl.url} alt={event.eventName || "Event"} className="rounded-lg w-full h-40 sm:h-48 object-cover border dark:border-gray-700 shadow-sm"/>
                      )}
                      {event.videoUrl?.url && (
                        <video controls className="rounded-lg w-full h-40 sm:h-48 object-cover border dark:border-gray-700 shadow-sm"><source src={event.videoUrl.url} type="video/mp4" />Video not supported.</video>
                      )}
                    </div>
                  )}

                  {/* Review Section */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center"><FaStar className="text-yellow-500 mr-1.5" />Avg Rating:</span>
                        {calculateAverageRating(event._id) ? (
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{calculateAverageRating(event._id)} / 5</span>
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500 italic">Not rated</span>
                        )}
                    </div>

                    {/* Display Reviews */}
                    {visibleReviews.length > 0 && (
                      <div className="space-y-2">
                        {visibleReviews.map(review => (
                          <motion.div key={review._id} variants={itemVariants} className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border dark:border-gray-600 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                                <FaUserCircle className="mr-1.5 text-indigo-500"/> {review.userId?.name || "Anonymous"}
                              </p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'} />)}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">"{review.comment}"</p>
                          </motion.div>
                        ))}
                        {eventReviews.length > 2 && (
                          <motion.button {...buttonHoverTap} onClick={() => toggleShowAll(event._id)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center">
                            {showAllComments[event._id] ? <FaChevronUp className="mr-1"/> : <FaChevronDown className="mr-1"/>}
                            {showAllComments[event._id] ? "Show Less" : `Show ${eventReviews.length - 2} More`}
                          </motion.button>
                        )}
                      </div>
                    )}
                     {eventReviews.length === 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center py-2">No reviews yet. Be the first!</p>
                    )}


                    {/* Add Review Form */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50">
                       <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 flex items-center"><FaPlus className="mr-1.5 text-green-500"/>Leave a Review</h4>
                       <div className="grid gap-2">
                           <select value={ratings[event._id] || ''} onChange={(e) => handleRatingChange(event._id, Number(e.target.value))} className="w-full rounded-md border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs">
                               <option value="">Rate event...</option>
                               {[1,2,3,4,5].map(star => <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>)}
                           </select>
                           <textarea value={comments[event._id] || ''} onChange={(e) => handleCommentChange(event._id, e.target.value)} rows="2" placeholder="Your comment..." className="w-full rounded-md border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"/>
                       </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2 justify-end">
                    <motion.button {...buttonHoverTap} onClick={() => handleOpenReportModal(event)} className="flex items-center justify-center gap-1.5 w-full sm:w-auto text-xs px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm">
                      <FaFlag/> Report
                    </motion.button>
                    <motion.button {...buttonHoverTap} onClick={() => handleSubmitReview(event._id)} className="flex items-center justify-center gap-1.5 w-full sm:w-auto text-xs px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm">
                      <FaPaperPlane/> Submit Review
                    </motion.button>
                    <Link to={`/attend/${event._id}`} className="w-full sm:w-auto">
                        <motion.button {...buttonHoverTap} className="flex items-center justify-center gap-1.5 w-full text-xs px-3 py-2 rounded-md border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 font-semibold shadow-sm">
                            <FaSignInAlt/> Attend
                        </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Report Event Modal */}
        <AnimatePresence>
        {showReportModal && reportingEvent && (
          <motion.div
            key="report-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-[99] transition-opacity"
            onClick={handleCloseReportModal} // Close on backdrop click
          >
            <motion.div
              key="report-modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md space-y-5 border dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-500"/> Report: <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-[200px] sm:max-w-xs">{reportingEvent.eventName || reportingEvent.title}</span>
                </h3>
                <motion.button {...buttonHoverTap} onClick={handleCloseReportModal} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl">
                  <FaTimes />
                </motion.button>
              </div>
              
              {reportStatusMessage?.text && !reportStatusMessage.type.includes('success') && ( // Only show error/info in modal
                <p className={`text-xs p-2.5 rounded-md ${reportStatusMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                  {reportStatusMessage.text}
                </p>
              )}

              <div>
                <label htmlFor="reportReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                <select id="reportReason" value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm">
                  <option value="">Select a reason...</option>
                  {reportReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="reportDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Details</label>
                <textarea id="reportDescription" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} rows="3" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" placeholder="Provide details..."/>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <motion.button {...buttonHoverTap} onClick={handleCloseReportModal} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</motion.button>
                <motion.button {...buttonHoverTap} onClick={handleSubmitReport} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md flex items-center gap-1.5">
                    <FaPaperPlane/> Submit Report
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
        <style jsx global>{`
            .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
            /* Custom scrollbar for review lists within cards */
            .custom-scrollbar::-webkit-scrollbar { width: 5px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; } /* gray-300 */
            .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; } /* gray-600 */
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default AttendeePage;


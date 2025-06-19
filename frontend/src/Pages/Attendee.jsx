import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from "date-fns";
import { Link } from 'react-router-dom';

const categories = [
  'Educational/Academic Events',
  'Social & Cultural Events',
  'Sports & Recreational Events',
  'Entertainment Events',
  'Professional & Educational Events',
  'Religious',
];

const AttendeePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [reviews, setReviews] = useState({});
  const [showAllComments, setShowAllComments] = useState({});

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
    const review = { rating, comment, author: 'Anonymous' };
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`https://event-easy-backendbacken.onrender.com/Event-Easy/review/${eventId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(review),
      });

      if (res.ok) {
        alert('Review submitted!');
        setComments((prev) => ({ ...prev, [eventId]: '' }));
        fetchReviews(eventId);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const fetchReviews = async (eventId) => {
    try {
      const response = await axios.get(`https://event-easy-backendbacken.onrender.com/Event-Easy/review/${eventId}/reviews`);
      setReviews((prev) => ({ ...prev, [eventId]: response.data.reviews || [] }));
    } catch (error) {
      console.error(`Error fetching reviews for event ${eventId}:`, error);
    }
  };

  const calculateAverageRating = (eventId) => {
    const eventReviews = reviews[eventId];
    if (!eventReviews || eventReviews.length === 0) return null;
    const total = eventReviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / eventReviews.length).toFixed(1);
  };

  useEffect(() => {
    fetch('https://event-easy-backendbacken.onrender.com/Event-Easy/Event/events')
      .then((res) => res.json())
      .then((data) => {
        const approvedEvents = data.filter((event) => event.status === 'approved');
        setEvents(approvedEvents);
        setFilteredEvents(approvedEvents);
        approvedEvents.forEach((event) => fetchReviews(event._id));
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredEvents(
      category === 'All' ? events : events.filter((e) => e.category === category)
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 via-white to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-10 px-6 flex justify-center items-start">
      <div className="max-w-5xl w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4">🎯 Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {['All', ...categories].map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border shadow-sm ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.map((event) => {
          const organizerName = event.organizer?.name || 'Unknown Organizer';
          const organizerImage = event.organizerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(organizerName)}`;
          const eventReviews = reviews[event._id] || [];
          const visibleReviews = eventReviews.slice(0, showAllComments[event._id] ? eventReviews.length : 1);

          return (
            <div key={event._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 space-y-5">
              {/* Organizer Info */}
              <div className="flex items-center space-x-4">
                <img src={organizerImage} alt="Organizer" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{organizerName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</p>
                </div>
              </div>

              {/* Event Content */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{event.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{event.description}</p>

              {/* Media */}
              {(event.imageUrl?.url || event.videoUrl?.url) && (
                <div className="flex flex-col md:flex-row gap-4">
                  {event.imageUrl?.url && (
                    <img
                      src={event.imageUrl.url}
                      alt="Event"
                      className="rounded-xl w-full md:w-1/2 h-64 object-cover border"
                    />
                  )}
                  {event.videoUrl?.url && (
                    <video controls className="rounded-xl w-full md:w-1/2 h-64 object-cover border">
                      <source src={event.videoUrl.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              {/* Review Section */}
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <span className="text-lg font-semibold">Average Rating:</span>
                  {calculateAverageRating(event._id) ? (
                    <span className="flex items-center gap-1 text-xl font-bold">
                      ⭐ {calculateAverageRating(event._id)} / 5
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Not rated yet</span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-wide">💬 Reviews</h3>

                {visibleReviews && visibleReviews.length > 0 ? (
                  <>
                    {visibleReviews.map((review) => (
                      <div key={review._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-4 shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-lg">
                              {review.userId?.name?.[0]?.toUpperCase() || "A"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-semibold text-blue-700 dark:text-blue-300">
                                {review.userId?.name || "Anonymous"}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <span className="text-yellow-500 font-medium text-sm sm:text-base">
                            ⭐ {review.rating}/5
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mt-2">
                          {review.comment}
                        </p>
                      </div>
                    ))}

                    {eventReviews.length > 1 && (
                      <button
                        onClick={() => toggleShowAll(event._id)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm"
                      >
                        {showAllComments[event._id] ? "See Less 🔽" : "See More 💬"}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm italic">No reviews yet. Be the first to share your thoughts! 📝</p>
                )}

                {/* Add Review Form */}
                <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🌟 Leave a Review</h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Your Rating</label>
                      <select
                        value={ratings[event._id] || ''}
                        onChange={(e) => handleRatingChange(event._id, Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select...</option>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <option key={star} value={star}>
                            {star} Star{star > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Your Comment</label>
                      <textarea
                        value={comments[event._id] || ''}
                        onChange={(e) => handleCommentChange(event._id, e.target.value)}
                        rows="3"
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-end items-center gap-6 mt-4">
                      <Link
                        to={`/attend/${event._id}`}
                        className="text-orange-600 hover:text-blue-800 font-medium inline-block text-lg transition-colors duration-300"
                        title="View Details"
                      >
                        Attend
                      </Link>
                      <button
                        onClick={() => handleSubmitReview(event._id)}
                        className="bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-xl"
                        title="Submit your review"
                      >
                        Submit Review ✍️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendeePage;

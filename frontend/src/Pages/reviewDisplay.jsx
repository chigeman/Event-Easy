import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const ReviewDisplay = () => {
  const { userData } = useContext(AppContent);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventDetailsMap, setEventDetailsMap] = useState({}); // key: eventId, value: eventDetails

  const fetchReviews = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/Event-Easy/review/user/${userId}/reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const reviewList = res.data.reviews || [];
      setReviews(reviewList);

      // Extract unique event IDs safely (string _id)
      const uniqueEventIds = [
        ...new Set(
          reviewList.map((r) =>
            typeof r.eventId === "object" ? r.eventId._id : r.eventId
          )
        ),
      ];

      // Fetch event details for each unique event ID
      const eventRequests = uniqueEventIds.map((id) =>
        axios.get(`http://localhost:5000/Event-Easy/event/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const eventResponses = await Promise.all(eventRequests);

      const eventMap = {};
      eventResponses.forEach((res) => {
        const event = res.data;
        eventMap[event._id] = event;
      });

      setEventDetailsMap(eventMap);
    } catch (error) {
      console.error("Error fetching reviews or events:", error);
      toast.error("Failed to load reviews or event details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchReviews(userData._id);
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading reviews...</p>;
  }

  if (!reviews.length) {
    return <p className="text-center text-gray-500">No reviews found.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Reviews</h2>
      {reviews.map((review) => {
        // Safely get eventId as string
        const eventId =
          typeof review.eventId === "object" ? review.eventId._id : review.eventId;
        const event = eventDetailsMap[eventId] || {};

        return (
          <div
            key={review._id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 border-blue-500"
          >
            <h3 className="text-lg font-semibold text-blue-600">
              {event.eventName || "Unknown Event"}
            </h3>
            <p className="text-gray-700 italic mb-1">
              <span className="font-medium text-gray-600">Organizer:</span>{" "}
              {event.organizer?.name || "Unknown"}
            </p>
            <p className="text-gray-700">
              {event.description || "No event description available."}
            </p>
            <p className="text-gray-700 mt-2">{review.comment}</p>
            <p className="text-yellow-500">Rating: {review.rating}/5</p>
            <p className="text-sm text-gray-400 mt-2">
              {formatDistanceToNow(new Date(review.createdAt))} ago
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewDisplay;

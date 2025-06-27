const Review = require('../models/eventReviewModel');
const Event = require('../models/eventModel'); // Assuming you have an Event model

const createOrUpdateReview = async (req, res) => {
  const { eventId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    let review = await Review.findOne({ eventId, userId });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
      return res.status(200).json({ success: true, message: "Review updated", review });
    }

    review = await Review.create({ eventId, userId, rating, comment });
    res.status(201).json({ success: true, message: "Review created", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving review" });
  }
};

const getEventReviews = async (req, res) => {
  const { eventId } = req.params;

  try {
    const reviews = await Review.find({ eventId }).populate("userId", "name"); 
    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};


const getReviewsByOrganizer = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    // Step 1: Get all events by the organizer
    const events = await Event.find({ organizer: organizerId }, '_id');

    if (events.length === 0) {
      return res.status(200).json({ averageRating: 0, reviews: [] });
    }

    const eventIds = events.map((event) => event._id);

    // Step 2: Fetch all reviews for those events
    const reviews = await Review.find({ eventId: { $in: eventIds } }).populate('userId', 'name');

    // Step 3: Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.status(200).json({
      averageRating: averageRating.toFixed(2),
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error while fetching reviews" });
  }
};

const getUserReviews = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await Review.find({ userId })
      .populate('eventId', 'name') // Get event name
      .sort({ createdAt: -1 });     // Most recent first

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

module.exports = { createOrUpdateReview, getUserReviews, getEventReviews ,getReviewsByOrganizer};
const Review = require('../models/eventReviewModel');

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

module.exports = { createOrUpdateReview, getEventReviews };
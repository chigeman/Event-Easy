const express = require('express');
const { createOrUpdateReview, getEventReviews,getUserReviews ,getReviewsByOrganizer} = require('../controllers/reviewController');
const userAuth = require('../middlewares/userAuth');

const router = express.Router();

router.post('/:eventId/review',userAuth, createOrUpdateReview);
router.get('/:eventId/reviews', getEventReviews);
router.get('/user/:userId/reviews', userAuth, getUserReviews);
router.get('/organizer/:organizerId', userAuth, getReviewsByOrganizer ); // Assuming you want to get reviews by organizer ID

module.exports = router;

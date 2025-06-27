const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth"); // Assume this middleware checks if a user is authenticated
//const { isAdmin } = require("../middlewares/roleMiddleware"); // Assume this middleware checks if the user has admin role
const {
  createEvent,
  getAllEvents,
  getEventById,
  attendEvent,
  leaveEvent,
  updateEventStatus,
  updateEvent,
  deleteEvent,
  getOrganizerEvents
} = require("../controllers/eventController");

// router.post("/createEvents", isAuthenticated, createEvent);
const upload = require("../middlewares/multer");

router.post(
  "/createEvents",
  upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'videoUrl', maxCount: 1 }
  ]),
  userAuth,
  createEvent
);

// Get events by organizer name (query param)
router.get('/events/organizer/:organizerId', getOrganizerEvents);

router.get("/events", getAllEvents);

router.get("/events/:id", getEventById);

router.post("/events/:id/attend", userAuth, attendEvent);

router.get("/events/:id", userAuth, getEventById);


// router.post("/events/:id/leave", isAuthenticated, leaveEvent);

// router.put("/events/:id/status", userAuth, isAdmin, updateEventStatus);

router.put("/events/:id/status", userAuth,updateEventStatus); // Assuming you want to allow all authenticated users to update status

router.put("/events/:id/status", userAuth, updateEvent); // Assuming you want to allow all authenticated users to update status

router.delete("/events/:id", userAuth, deleteEvent); // Assuming you want to allow all authenticated users to delete events

module.exports = router;
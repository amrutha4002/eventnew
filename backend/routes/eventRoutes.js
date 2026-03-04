const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getEvents)
    .post(protect, authorize('organizer', 'admin'), createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, authorize('organizer', 'admin'), updateEvent)
    .delete(protect, authorize('organizer', 'admin'), deleteEvent);

router.post('/:id/rsvp', protect, authorize('user', 'organizer', 'admin'), rsvpEvent);

module.exports = router;

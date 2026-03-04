const express = require('express');
const router = express.Router();
const {
    getPendingOrganizers,
    approveOrganizer,
    rejectOrganizer,
    getPendingEvents,
    approveEvent,
    rejectEvent,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require admin
router.get('/organizers/pending', protect, authorize('admin'), getPendingOrganizers);
router.put('/organizers/:id/approve', protect, authorize('admin'), approveOrganizer);
router.put('/organizers/:id/reject', protect, authorize('admin'), rejectOrganizer);

router.get('/events/pending', protect, authorize('admin'), getPendingEvents);
router.put('/events/:id/approve', protect, authorize('admin'), approveEvent);
router.put('/events/:id/reject', protect, authorize('admin'), rejectEvent);

module.exports = router;
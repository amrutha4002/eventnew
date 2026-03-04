const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    requestOrganizerVerification,
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/organizer-request', protect, requestOrganizerVerification); // user can later request organizer status
router.get('/me', protect, getMe);

// Example of Admin-only route for testing RBAC
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
    res.status(200).json({ message: 'Welcome to the admin area' });
});

module.exports = router;

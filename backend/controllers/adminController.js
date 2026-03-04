const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Get list of organizers pending verification
// @route   GET /api/admin/organizers/pending
// @access  Private/Admin
const getPendingOrganizers = asyncHandler(async (req, res) => {
    const pending = await User.find({ role: 'organizer', isVerified: false });
    res.status(200).json({ success: true, data: pending });
});

// @desc    Approve an organizer request
// @route   PUT /api/admin/organizers/:id/approve
// @access  Private/Admin
const approveOrganizer = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'organizer') {
        res.status(404);
        throw new Error('Organizer not found');
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, data: user });
});

// @desc    Reject an organizer request (revert to regular user)
// @route   PUT /api/admin/organizers/:id/reject
// @access  Private/Admin
const rejectOrganizer = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'organizer') {
        res.status(404);
        throw new Error('Organizer not found');
    }

    user.role = 'user';
    user.isVerified = false;
    user.organizationDetails = undefined;
    await user.save();

    res.status(200).json({ success: true, data: user });
});

// @desc    Get list of events pending approval
// @route   GET /api/admin/events/pending
// @access  Private/Admin
const getPendingEvents = asyncHandler(async (req, res) => {
    const pending = await Event.find({ status: 'pending' }).populate('organizer', 'name email organizationDetails');
    res.status(200).json({ success: true, data: pending });
});

// @desc    Approve an event
// @route   PUT /api/admin/events/:id/approve
// @access  Private/Admin
const approveEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    event.status = 'approved';
    await event.save();

    res.status(200).json({ success: true, data: event });
});

// @desc    Reject an event
// @route   PUT /api/admin/events/:id/reject
// @access  Private/Admin
const rejectEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    event.status = 'rejected';
    await event.save();

    res.status(200).json({ success: true, data: event });
});

module.exports = {
    getPendingOrganizers,
    approveOrganizer,
    rejectOrganizer,
    getPendingEvents,
    approveEvent,
    rejectEvent,
};

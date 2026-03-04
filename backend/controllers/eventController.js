const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events or filter by distance ($near)
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const { lat, lng, distance, category } = req.query;

    let query = { status: 'approved' }; // Only show approved events

    // Build the geospatial query if lat, lng and distance are provided
    if (lat && lng && distance) {
        // distance is usually in kilometers, MongoDB $near uses meters for 2dsphere
        const radius = distance * 1000;

        query.location = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)],
                },
                $maxDistance: radius,
            },
        };
    }

    // Filter by category if provided
    if (category) {
        query.category = category;
    }

    const events = await Event.find(query).populate('organizer', 'name email');

    res.status(200).json({
        success: true,
        count: events.length,
        data: events,
    });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
        .populate('organizer', 'name email')
        .populate('rsvps', 'name');

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    res.status(200).json({
        success: true,
        data: event,
    });
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin only)
const createEvent = asyncHandler(async (req, res) => {
    // Check if organizer is verified
    if (req.user.role === 'organizer' && !req.user.isVerified) {
        res.status(403);
        throw new Error('Your organizer account is pending verification by an admin.');
    }

    const { title, description, category, date, location } = req.body;

    // Validate required fields
    if (!title || !description || !category || !date || !location) {
        res.status(400);
        throw new Error('Please provide all required fields: title, description, category, date, and location');
    }

    // Validate location object
    if (!location.type || !location.coordinates) {
        res.status(400);
        throw new Error('Location must include type (Point) and coordinates [longitude, latitude]');
    }

    // Add the currently logged in user as the organizer
    const eventData = {
        title,
        description,
        category,
        date,
        location,
        organizer: req.user.id,
    };

    const event = await Event.create(eventData);

    res.status(201).json({
        success: true,
        data: event,
    });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin only)
const updateEvent = asyncHandler(async (req, res) => {
    let event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if the user is the organizer of the event or an admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this event');
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: event,
    });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin only)
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if the user is the organizer of the event or an admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this event');
    }

    await event.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc    RSVP to an event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if user has already RSVP'd
    if (event.rsvps.includes(req.user.id)) {
        // Un-RSVP (Remove user from array)
        event.rsvps = event.rsvps.filter((userId) => userId.toString() !== req.user.id);
    } else {
        // Add user to RSVP array
        event.rsvps.push(req.user.id);
    }

    await event.save();

    res.status(200).json({
        success: true,
        data: event.rsvps,
    });
});

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpEvent,
};

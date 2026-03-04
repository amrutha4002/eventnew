const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role,
        organizationName,
        registrationTaxId,
        website,
        contactEmail,
        contactPhone,
    } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Determine if organizer needs verification
    const isOrganizer = role === 'organizer';

    // If registering as organizer, require verification fields
    if (isOrganizer) {
        if (
            !organizationName ||
            !registrationTaxId ||
            !website ||
            !contactEmail ||
            !contactPhone
        ) {
            res.status(400);
            throw new Error('All organizer verification fields are required');
        }
    }

    // Create user payload
    const userData = {
        name,
        email,
        password,
        role: role || 'user',
        isVerified: isOrganizer ? false : true, // Organizers need admin approval
    };
    if (isOrganizer) {
        userData.organizationDetails = {
            organizationName,
            registrationTaxId,
            website,
            contactEmail,
            contactPhone,
        };
    }

    // Create user
    const user = await User.create(userData);

    if (user) {
        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        };
        if (user.organizationDetails) {
            response.organizationDetails = user.organizationDetails;
        }
        res.status(201).json(response);
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        };
        if (user.organizationDetails) {
            response.organizationDetails = user.organizationDetails;
        }
        res.json(response);
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // req.user is set in authMiddleware
    res.status(200).json(req.user);
});

// @desc    Request organizer verification (already registered user)
// @route   POST /api/auth/organizer-request
// @access  Private (user only)
const requestOrganizerVerification = asyncHandler(async (req, res) => {
    const { organizationName, registrationTaxId, website, contactEmail, contactPhone } = req.body;

    if (req.user.role !== 'user') {
        res.status(400);
        throw new Error('Only standard users may request organizer status');
    }

    if (
        !organizationName ||
        !registrationTaxId ||
        !website ||
        !contactEmail ||
        !contactPhone
    ) {
        res.status(400);
        throw new Error('All organizer verification fields are required');
    }

    req.user.role = 'organizer';
    req.user.isVerified = false;
    req.user.organizationDetails = {
        organizationName,
        registrationTaxId,
        website,
        contactEmail,
        contactPhone,
    };

    const updated = await req.user.save();

    const response = {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        isVerified: updated.isVerified,
        token: req.headers.authorization.split(' ')[1], // Preserve existing session token
        organizationDetails: updated.organizationDetails,
    };

    res.status(200).json(response);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    requestOrganizerVerification,
};

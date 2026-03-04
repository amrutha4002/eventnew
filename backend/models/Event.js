const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add an event title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: [
                'Music',
                'Tech',
                'Art',
                'Sports',
                'Food',
                'Business',
                'Networking',
                'Other'
            ],
        },
        date: {
            type: Date,
            required: [true, 'Please add an event date/time'],
        },
        // GeoJSON Point for Geospatial Queries
        location: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true,
            },
            coordinates: {
                type: [Number], // Array of numbers: [longitude, latitude]
                required: true,
            },
            formattedAddress: String, // Optional: if you add geocoding later
        },
        organizer: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        rsvps: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Create the 2dsphere index for radius-based geographic queries
eventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Event', eventSchema);

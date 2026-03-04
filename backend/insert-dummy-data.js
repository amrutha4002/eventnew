const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
require('dotenv').config();

const dummyUsers = [
  // Admin User
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    role: "admin",
    isVerified: true
  },
  // Pending Organizers
  {
    name: "Tech Events Co",
    email: "organizer1@example.com",
    password: "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    role: "organizer",
    isVerified: false,
    organizationDetails: {
      organizationName: "Tech Events Co",
      registrationTaxId: "TAX123456",
      website: "https://techevents.com",
      contactEmail: "contact@techevents.com",
      contactPhone: "555-0101"
    }
  },
  {
    name: "Sports League International",
    email: "organizer2@example.com",
    password: "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    role: "organizer",
    isVerified: false,
    organizationDetails: {
      organizationName: "Sports League International",
      registrationTaxId: "TAX789012",
      website: "https://sportsleague.io",
      contactEmail: "admin@sportsleague.io",
      contactPhone: "555-0202"
    }
  },
  {
    name: "Community Arts Foundation",
    email: "organizer3@example.com",
    password: "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    role: "organizer",
    isVerified: false,
    organizationDetails: {
      organizationName: "Community Arts Foundation",
      registrationTaxId: "TAX345678",
      website: "https://communityarts.org",
      contactEmail: "info@communityarts.org",
      contactPhone: "555-0303"
    }
  },
  // Verified Organizer
  {
    name: "Music Fest Productions",
    email: "musicfest@example.com",
    password: "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    role: "organizer",
    isVerified: true,
    organizationDetails: {
      organizationName: "Music Fest Productions",
      registrationTaxId: "TAX111111",
      website: "https://musicfest.com",
      contactEmail: "hello@musicfest.com",
      contactPhone: "555-0404"
    }
  },
  // Regular Users
  {
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    role: "user",
    isVerified: false
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    role: "user",
    isVerified: false
  }
];

const dummyEvents = [
  {
    title: "Summer Music Festival 2026",
    description: "Join us for the biggest music festival of the year featuring top artists from around the world",
    date: new Date("2026-06-15"),
    category: "Music",
    location: {
      type: "Point",
      coordinates: [-73.9654, 40.7829], // [longitude, latitude]
      formattedAddress: "Central Park Amphitheater, New York"
    },
    status: 'approved'
  },
  {
    title: "Jazz Night Under the Stars",
    description: "An intimate evening of live jazz performances in an outdoor garden setting",
    date: new Date("2026-05-22"),
    category: "Music",
    location: {
      type: "Point",
      coordinates: [-73.9776, 40.7614],
      formattedAddress: "Riverside Garden Venue, New York"
    },
    status: 'approved'
  },
  {
    title: "Rock Concert Extravaganza",
    description: "Experience the most electrifying rock concert with legendary bands performing",
    date: new Date("2026-07-10"),
    category: "Music",
    location: {
      type: "Point",
      coordinates: [-73.9934, 40.7505],
      formattedAddress: "Downtown Arena, New York"
    },
    status: 'approved'
  }
];

async function insertDummyData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventfinder');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Insert users
    const insertedUsers = await User.insertMany(dummyUsers);
    console.log(`✓ Inserted ${insertedUsers.length} users`);

    // Get the verified organizer ID
    const verifiedOrganizer = await User.findOne({ email: "musicfest@example.com" });
    
    // Add organizer ID and name to events
    const eventsWithOrganizer = dummyEvents.map(event => ({
      ...event,
      organizer: verifiedOrganizer._id,
      attendees: []
    }));

    // Insert events
    const insertedEvents = await Event.insertMany(eventsWithOrganizer);
    console.log(`✓ Inserted ${insertedEvents.length} events`);

    console.log('\n✅ Dummy data inserted successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Organizer (Verified): musicfest@example.com / admin123');
    console.log('Organizer (Pending): organizer1@example.com / admin123');
    console.log('User: john@example.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error inserting dummy data:', error);
    process.exit(1);
  }
}

insertDummyData();

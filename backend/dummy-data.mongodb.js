// Insert Admin User (if not already inserted)
db.users.insertOne({
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
  "role": "admin",
  "isVerified": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
});

// Insert Test Organizers (Pending Verification)
db.users.insertMany([
  {
    "name": "Tech Events Co",
    "email": "organizer1@example.com",
    "password": "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    "role": "organizer",
    "isVerified": false,
    "organizationDetails": {
      "organizationName": "Tech Events Co",
      "registrationTaxId": "TAX123456",
      "website": "https://techevents.com",
      "contactEmail": "contact@techevents.com",
      "contactPhone": "555-0101"
    },
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Sports League International",
    "email": "organizer2@example.com",
    "password": "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    "role": "organizer",
    "isVerified": false,
    "organizationDetails": {
      "organizationName": "Sports League International",
      "registrationTaxId": "TAX789012",
      "website": "https://sportsleague.io",
      "contactEmail": "admin@sportsleague.io",
      "contactPhone": "555-0202"
    },
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "name": "Community Arts Foundation",
    "email": "organizer3@example.com",
    "password": "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    "role": "organizer",
    "isVerified": false,
    "organizationDetails": {
      "organizationName": "Community Arts Foundation",
      "registrationTaxId": "TAX345678",
      "website": "https://communityarts.org",
      "contactEmail": "info@communityarts.org",
      "contactPhone": "555-0303"
    },
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
]);

// Insert Verified Organizers
db.users.insertMany([
  {
    "name": "Music Fest Productions",
    "email": "musicfest@example.com",
    "password": "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    "role": "organizer",
    "isVerified": true,
    "organizationDetails": {
      "organizationName": "Music Fest Productions",
      "registrationTaxId": "TAX111111",
      "website": "https://musicfest.com",
      "contactEmail": "hello@musicfest.com",
      "contactPhone": "555-0404"
    },
    "createdAt": new Date("2026-02-01"),
    "updatedAt": new Date("2026-02-15")
  }
]);

// Insert Test Events (created by verified organizer)
const verifiedOrganizerEmail = "musicfest@example.com";
const verifiedOrganizer = db.users.findOne({ email: verifiedOrganizerEmail });

if (verifiedOrganizer) {
  db.events.insertMany([
    {
      "title": "Summer Music Festival 2026",
      "description": "Join us for the biggest music festival of the year featuring top artists from around the world",
      "date": new Date("2026-06-15"),
      "time": "18:00",
      "location": "Central Park Amphitheater",
      "latitude": 40.7829,
      "longitude": -73.9654,
      "capacity": 5000,
      "category": "Music",
      "imageUrl": "https://via.placeholder.com/400x300?text=Music+Festival",
      "organizerId": verifiedOrganizer._id,
      "organizerName": verifiedOrganizer.name,
      "attendees": [],
      "createdAt": new Date("2026-02-20"),
      "updatedAt": new Date("2026-02-20")
    },
    {
      "title": "Jazz Night Under the Stars",
      "description": "An intimate evening of live jazz performances in an outdoor garden setting",
      "date": new Date("2026-05-22"),
      "time": "20:00",
      "location": "Riverside Garden Venue",
      "latitude": 40.7614,
      "longitude": -73.9776,
      "capacity": 800,
      "category": "Music",
      "imageUrl": "https://via.placeholder.com/400x300?text=Jazz+Night",
      "organizerId": verifiedOrganizer._id,
      "organizerName": verifiedOrganizer.name,
      "attendees": [],
      "createdAt": new Date("2026-02-20"),
      "updatedAt": new Date("2026-02-20")
    },
    {
      "title": "Rock Concert Extravaganza",
      "description": "Experience the most electrifying rock concert with legendary bands performing",
      "date": new Date("2026-07-10"),
      "time": "19:00",
      "location": "Downtown Arena",
      "latitude": 40.7505,
      "longitude": -73.9934,
      "capacity": 10000,
      "category": "Music",
      "imageUrl": "https://via.placeholder.com/400x300?text=Rock+Concert",
      "organizerId": verifiedOrganizer._id,
      "organizerName": verifiedOrganizer.name,
      "attendees": [],
      "createdAt": new Date("2026-02-20"),
      "updatedAt": new Date("2026-02-20")
    }
  ]);
}

// Insert Regular Users
db.users.insertMany([
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    "role": "user",
    "isVerified": false,
    "createdAt": new Date("2026-01-15"),
    "updatedAt": new Date("2026-01-15")
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "$2a$10$zO8io5YU0/A2JljZ71mCHuGJCc9VzDHf8tjvhSjBERfTvyaOotL3m",
    "role": "user",
    "isVerified": false,
    "createdAt": new Date("2026-01-20"),
    "updatedAt": new Date("2026-01-20")
  }
]);

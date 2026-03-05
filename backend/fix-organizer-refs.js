const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');

async function fixOrganizerReferences() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/eventfinder');
        console.log('Connected to MongoDB');

        // Get all events and their organizers
        const events = await Event.find({});
        console.log(`\nFound ${events.length} events:`);
        
        events.forEach(e => {
            console.log(`Event: ${e.title}`);
            console.log(`  ID: ${e._id}`);
            console.log(`  Organizer ID: ${e.organizer}`);
        });

        // Get all users
        const users = await User.find({});
        console.log(`\nFound ${users.length} users:`);
        
        users.forEach(u => {
            console.log(`User: ${u.name}`);
            console.log(`  ID: ${u._id}`);
            console.log(`  Email: ${u.email}`);
            console.log(`  Role: ${u.role}`);
        });

        // Find the verified organizer
        const verifiedOrg = await User.findOne({ email: 'musicfest@example.com' });
        
        if (verifiedOrg) {
            console.log(`\n✓ Verified organizer found: ${verifiedOrg._id}`);
            
            // Update all events to have the correct organizer
            await Event.updateMany(
                { },
                { organizer: verifiedOrg._id }
            );
            console.log('✓ Updated all events with correct organizer ID');
        } else {
            console.log('\n✗ Verified organizer not found!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

fixOrganizerReferences();

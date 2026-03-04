import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EventsList = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('date'); // date or upcoming
    const [rsvpStatus, setRsvpStatus] = useState({});

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const fetchAllEvents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/events');
            const approvedEvents = data.data || [];
            
            // Sort by date
            approvedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            setEvents(approvedEvents);
            setFilteredEvents(approvedEvents);
            
            // Build RSVP status map
            const status = {};
            approvedEvents.forEach(event => {
                status[event._id] = event.rsvps?.includes(user?._id) || false;
            });
            setRsvpStatus(status);
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = events;

        if (category) {
            filtered = filtered.filter(e => e.category === category);
        }

        if (sortBy === 'upcoming') {
            filtered = filtered.filter(e => new Date(e.date) > new Date());
        } else if (sortBy === 'past') {
            filtered = filtered.filter(e => new Date(e.date) < new Date());
        }

        setFilteredEvents(filtered);
    }, [category, sortBy, events]);

    const handleRSVP = async (eventId) => {
        if (!user) {
            alert('Please log in to RSVP to events');
            return;
        }

        try {
            await api.post(`/events/${eventId}/rsvp`);
            
            // Update RSVP status
            const newStatus = { ...rsvpStatus };
            newStatus[eventId] = !newStatus[eventId];
            setRsvpStatus(newStatus);
            
            // Refresh events
            fetchAllEvents();
            alert(newStatus[eventId] ? 'RSVP confirmed!' : 'RSVP cancelled');
        } catch (error) {
            console.error('RSVP failed', error);
            alert('Failed to process RSVP');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">All Events</h1>
                    <p className="text-gray-600">Browse and RSVP to approved events in your area</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Categories</option>
                                <option value="Music">Music</option>
                                <option value="Tech">Tech</option>
                                <option value="Art">Art</option>
                                <option value="Sports">Sports</option>
                                <option value="Food">Food</option>
                                <option value="Business">Business</option>
                                <option value="Networking">Networking</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Filter</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Events</option>
                                <option value="upcoming">Upcoming Events</option>
                                <option value="past">Past Events</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-semibold">
                                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading events...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500 text-lg">No events found matching your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => {
                            const isRsvpd = rsvpStatus[event._id];
                            const isPast = new Date(event.date) < new Date();

                            return (
                                <div key={event._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col">
                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">
                                                {event.category}
                                            </span>
                                            {isPast && (
                                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    Past Event
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{event.description}</p>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <span>📅</span>
                                                <span>{new Date(event.date).toLocaleDateString()} @ {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>📍</span>
                                                <span className="truncate">{event.location?.formattedAddress || `${event.location?.coordinates[1]}, ${event.location?.coordinates[0]}`}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>👥</span>
                                                <span>{event.rsvps?.length || 0} going</span>
                                            </div>
                                        </div>

                                        {event.organizer && (
                                            <div className="text-xs text-gray-500 mb-4 pb-4 border-t">
                                                By: <span className="font-semibold">{event.organizer.name || 'Unknown'}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-6 pb-6">
                                        {user ? (
                                            <button
                                                onClick={() => handleRSVP(event._id)}
                                                disabled={isPast}
                                                className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                                                    isPast
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : isRsvpd
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                }`}
                                            >
                                                {isPast ? 'Event Ended' : isRsvpd ? '✓ Going' : 'RSVP Now'}
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full py-2 px-4 rounded-lg font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                                            >
                                                Log in to RSVP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsList;

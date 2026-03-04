import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rsvpedEvents, setRsvpedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyRSVPs = async () => {
            try {
                const { data } = await api.get('/events');
                // Filter events where current user is in the RSVPs array
                const myRSVPs = data.data.filter((event) =>
                    event.rsvps.some(rsvp => rsvp === user._id || rsvp._id === user._id)
                );
                setRsvpedEvents(myRSVPs);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch events', error);
                setLoading(false);
            }
        };

        // Simulating fetching for demonstration without backend data running
        // In production uncomment the query above.
        setTimeout(() => {
            setRsvpedEvents([
                {
                    _id: 'e1',
                    title: 'Indie Music Fest',
                    category: 'Music',
                    date: new Date(Date.now() + 172800000).toISOString(),
                    location: { coordinates: [-0.105, 51.512] }
                }
            ]);
            setLoading(false);
        }, 1000);

        // fetchMyRSVPs();
    }, [user]);

    if (!user || user.role !== 'user') {
        return <Navigate to="/login" replace />;
    }

    const handleCancelRSVP = async (eventId) => {
        // try { await api.post(`/events/${eventId}/rsvp`); } catch(e) {}
        setRsvpedEvents(rsvpedEvents.filter(e => e._id !== eventId));
        alert("RSVP Canceled");
    }

    if (loading) return <div className="text-center pt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans py-10">
            <main className="flex-grow w-full max-w-7xl mx-auto px-4">

                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Tickets & RSVPs</h2>
                        <p className="mt-2 text-gray-500">View upcoming events you've committed to attending.</p>
                    </div>
                    <div className="flex gap-3">
                        {user.role === 'user' && (
                            <button
                                onClick={() => navigate('/organizer-request')}
                                className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-sm text-sm"
                            >
                                Apply to be Organizer
                            </button>
                        )}
                        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm text-sm">
                            Discover More
                        </button>
                    </div>
                </div>

                {/* Saved Events Grid */}
                {rsvpedEvents.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🎟️</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Upcoming RSVPs</h3>
                        <p className="max-w-md mx-auto">You haven't saved any events yet. Check out the interactive map to find what's happening nearby!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rsvpedEvents.map((event) => (
                            <div key={event._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
                                <div className="h-32 bg-indigo-50 relative">
                                    <span className="absolute top-4 left-4 bg-white text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                        {event.category}
                                    </span>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h4 className="text-xl font-bold text-gray-900 leading-tight mb-2">{event.title}</h4>
                                    <div className="text-sm text-gray-500 mb-4 flex-grow flex flex-col gap-1 font-medium">
                                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                        <span>📍 Coordinates: {event.location?.coordinates[1]}, {event.location?.coordinates[0]}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCancelRSVP(event._id)}
                                        className="w-full text-center text-red-600 bg-red-50 hover:bg-red-100 font-semibold py-2.5 rounded-xl transition mt-auto"
                                    >
                                        Cancel RSVP
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;

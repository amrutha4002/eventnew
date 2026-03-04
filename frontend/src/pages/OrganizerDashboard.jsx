import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const OrganizerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                // Here we're using the standard get events but this would usually have a filter
                // for `?organizer=${user._id}` on the backend, but we'll fetch all and filter client side 
                // to simplify for this demonstration
                const { data } = await api.get('/events');
                // Filter events belonging to logged in organizer
                const myEvents = data.data.filter(
                    (event) => event.organizer._id === user._id || event.organizer === user._id
                );
                setEvents(myEvents);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch events', error);
                setLoading(false);
            }
        };
        fetchMyEvents();
    }, [user]);

    if (!user || user.role !== 'organizer') {
        return <Navigate to="/login" replace />;
    }

    if (!user.isVerified) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 pt-20">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 text-center text-red-600">
                    <h1 className="text-2xl font-bold mb-4">Account Pending Verification</h1>
                    <p>An Admin needs to review and approve your account before you can create events.</p>
                </div>
            </div>
        );
    }

    if (loading) return <div className="text-center pt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Organizer Dashboard</h2>
                    {user.isVerified && (
                        <button onClick={() => navigate('/create-event')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Create New Event
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-800">My Hosted Events</h3>
                    </div>
                    {events.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            You haven't hosted any events yet! Create one right now.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <li key={event._id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold text-indigo-600 uppercase mb-1 block">
                                                {event.category}
                                            </span>
                                            <h4 className="text-xl font-bold text-gray-900">{event.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-2xl">{event.description}</p>
                                            <div className="mt-4 flex gap-6 text-sm text-gray-500 font-medium">
                                                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    👥 {event.rsvps?.length || 0} RSVPs Let's Go
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 p-2">Edit</button>
                                            <button className="text-sm font-semibold text-red-600 hover:text-red-800 p-2">Delete</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrganizerDashboard;

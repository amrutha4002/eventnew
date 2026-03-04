import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pendingEventsRes = await api.get('/admin/events/pending');
                setPendingEvents(pendingEventsRes.data.data || []);

                const usersRes = await api.get('/admin/organizers/pending');
                setUsers(usersRes.data.data || []);

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const handleVerify = async (userId) => {
        try {
            await api.put(`/admin/organizers/${userId}/approve`);
            setUsers(users.map(u => (u._id === userId ? { ...u, isVerified: true } : u)));
            alert('Organizer approved!');
        } catch (err) {
            console.error(err);
            alert('Failed to approve organizer');
        }
    };

    const handleApproveEvent = async (eventId) => {
        try {
            await api.put(`/admin/events/${eventId}/approve`);
            setPendingEvents(pendingEvents.filter(e => e._id !== eventId));
            alert('Event approved!');
        } catch (err) {
            console.error(err);
            alert('Failed to approve event');
        }
    };

    const handleRejectEvent = async (eventId) => {
        try {
            await api.put(`/admin/events/${eventId}/reject`);
            setPendingEvents(pendingEvents.filter(e => e._id !== eventId));
            alert('Event rejected!');
        } catch (err) {
            console.error(err);
            alert('Failed to reject event');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await api.delete(`/events/${eventId}`);
            setEvents(events.filter(e => e._id !== eventId));
        } catch (err) {
            console.error("Failed to delete event", err);
            alert("Failed to delete event");
        }
    };

    if (loading) return <div className="text-center pt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans py-10">
            <main className="flex-grow w-full max-w-7xl mx-auto px-4">

                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Control Panel</h2>
                    <p className="mt-2 text-gray-500">Manage pending organizers, monitor system events, and moderation.</p>
                </div>

                {/* Verification Queue Map */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-800">Pending Organizer Verification Queue</h3>
                    </div>
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            All organizers have been verified.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {users.map((organizer) => (
                                <li key={organizer._id} className="p-6 hover:bg-gray-50 transition flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{organizer.organizationDetails?.organizationName || organizer.name}</h4>
                                        <p className="text-sm text-gray-500">{organizer.email} • Applied to be an Organizer</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await api.put(`/admin/organizers/${organizer._id}/reject`);
                                                    setUsers(users.filter(u => u._id !== organizer._id));
                                                    alert('Request rejected');
                                                } catch (e) {
                                                    console.error(e);
                                                    alert('Failed to reject');
                                                }
                                            }}
                                            className="text-sm text-red-600 hover:text-red-800 font-semibold px-4 py-2 bg-red-50 rounded-lg"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleVerify(organizer._id)}
                                            className="text-sm text-white font-semibold flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 hover:shadow-sm transition"
                                        >
                                            Approve Profile
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Event Moderation List - Pending Events */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-800">Event Approval Queue (Pending Review)</h3>
                    </div>
                    {pendingEvents.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            All events have been reviewed.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {pendingEvents.map((event) => (
                                <li key={event._id} className="p-6 hover:bg-gray-50 transition flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{event.title} <span className="text-xs ml-2 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">{event.category}</span></h4>
                                        <p className="text-xs text-gray-500 mt-1 max-w-xl truncate">{event.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">Organizer: {event.organizer?.name || 'Unknown'}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleRejectEvent(event._id)}
                                            className="text-sm text-red-600 hover:text-red-800 font-semibold px-4 py-2 bg-red-50 rounded-lg"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleApproveEvent(event._id)}
                                            className="text-sm text-white font-semibold flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 hover:shadow-sm transition"
                                        >
                                            Approve
                                        </button>
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

export default AdminDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import MapComponent from '../components/MapComponent';

function CreateEvent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('Music');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || user.role !== 'organizer') {
            setError('You must be logged in as an organizer to create an event.');
            return;
        }

        if (!lat || !lng) {
            setError('Please select a location on the map or enter latitude and longitude.');
            return;
        }

        try {
            const response = await api.post('/events', {
                title,
                description,
                date,
                category,
                location: {
                    type: 'Point',
                    coordinates: [Number(lng), Number(lat)],
                    formattedAddress: `${lat}, ${lng}`
                }
            });
            console.log('Event created:', response.data);
            navigate('/organizer');
        } catch (err) {
            console.error('Error creating event:', err.response);
            setError(err.response?.data?.message || err.message || 'Failed to create event. Try again later.');
        }
    };

    if (user && user.role === 'organizer' && !user.isVerified) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-200 max-w-md text-center">
                    <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 text-2xl">⏳</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Pending</h2>
                    <p className="text-gray-600">Your organizer account is currently pending verification by an admin. You will be able to create events once approved.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-100 shadow-sm rounded-xl">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Create New Event</h2>
                {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}

                {/* interactive map for location selection */}
                <MapComponent
                    isSelectable
                    onLocationSelect={(coords) => {
                        setLng(coords[0]);
                        setLat(coords[1]);
                    }}
                    events={[]}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Title</label>
                        <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea required rows="4" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input required type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="Music">Music</option>
                                <option value="Tech">Tech</option>
                                <option value="Art">Art</option>
                                <option value="Sports">Sports</option>
                                <option value="Food">Food</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Latitude</label>
                            <input required type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} placeholder="51.505" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Longitude</label>
                            <input required type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} placeholder="-0.09" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm">
                        Publish Event
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;

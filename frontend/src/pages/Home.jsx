import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import api from '../api/axios';

function Home() {
    const [radius, setRadius] = useState(5); // km
    const [category, setCategory] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    // Fetch events from backend
    const fetchEvents = async () => {
        setLoading(true);
        try {
            let url = '/events';
            const params = new URLSearchParams();
            
            if (userLocation) {
                params.append('lat', userLocation.lat);
                params.append('lng', userLocation.lng);
                params.append('distance', radius);
            }
            
            if (category) {
                params.append('category', category);
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const { data } = await api.get(url);
            setEvents(data.data || []);
        } catch (error) {
            console.error('Failed to fetch events', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchEvents();
        // Get user's location if permission granted
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log('Location permission denied:', error);
                }
            );
        }
    }, []);

    const handleSearch = () => {
        fetchEvents();
    };

    return (
        <div className="flex-grow flex flex-col">
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

                <div className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Events Near You</h2>
                    <p className="mt-2 text-base sm:text-lg text-gray-500 max-w-2xl">Discover and join local activities happening in your community. Enable location services to find events in your immediate area.</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-4 flex-wrap w-full md:w-auto">
                        <div className="w-full md:w-48 relative">
                            <label htmlFor="radius-select" className="sr-only">Distance</label>
                            <select
                                id="radius-select"
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                                className="block w-full rounded-xl border-gray-200 bg-gray-50 py-3 px-4 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white transition"
                            >
                                <option value="1">Within 1 km</option>
                                <option value="5">Within 5 km</option>
                                <option value="10">Within 10 km</option>
                                <option value="25">Within 25 km</option>
                            </select>
                        </div>

                        <div className="w-full md:w-48 relative">
                            <label htmlFor="category-select" className="sr-only">Category</label>
                            <select
                                id="category-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="block w-full rounded-xl border-gray-200 bg-gray-50 py-3 px-4 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white transition"
                            >
                                <option value="">All Categories</option>
                                <option value="Music">Music</option>
                                <option value="Tech">Tech</option>
                                <option value="Art">Art</option>
                                <option value="Sports">Sports</option>
                                <option value="Food">Food</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition shadow-sm"
                    >
                        Search Area
                    </button>
                </div>

                {/* Map Container */}
                <MapComponent
                    events={events}
                    defaultRadius={radius * 1000} // Pass meters to Leaflet 
                />

                {/* Events List */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Approved Events {events.length > 0 && `(${events.length})`}
                    </h3>
                    
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading events...</div>
                    ) : events.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <p className="text-gray-500">No events found. Try adjusting your filters or search location.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div key={event._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">
                                                {event.category}
                                            </span>
                                            <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">✓ Approved</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h4>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                        
                                        <div className="space-y-2 text-xs text-gray-500">
                                            <p>📅 {new Date(event.date).toLocaleDateString()} @ {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            <p>📍 {event.location?.formattedAddress || `${event.location?.coordinates[1]}, ${event.location?.coordinates[0]}`}</p>
                                            <p>👥 {event.rsvps?.length || 0} people going</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>

            <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        <span className="font-bold tracking-tight">EventFinder</span>
                    </div>
                    <p className="text-sm text-gray-500">&copy; 2026 EventFinder Platform. Built for Local Communities.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;

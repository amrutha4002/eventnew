import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Event Icon (Red)
const eventIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Helper component to dynamically change map view center
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const MapComponent = ({ events = [], onLocationSelect, isSelectable = false, defaultRadius = 5000 }) => {
    const [position, setPosition] = useState([51.505, -0.09]); // Default (London)
    const [hasLocation, setHasLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Attempt auto-location on mount
        locateUser();
    }, []);

    const locateUser = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                    setHasLocation(true);
                    setLoading(false);
                },
                (err) => {
                    console.error("Geolocation error:", err.message);
                    setLoading(false);
                }
            );
        }
    };

    const LocationSelector = () => {
        const map = useMap();

        // Add click event if the map is selectable (for Organizers creating events)
        useEffect(() => {
            if (!isSelectable) return;

            const onMapClick = (e) => {
                const { lat, lng } = e.latlng;
                setSelectedLocation([lat, lng]);
                if (onLocationSelect) {
                    // Emit in GeoJSON format: [longitude, latitude]
                    onLocationSelect([lng, lat]);
                }
            };

            map.on('click', onMapClick);
            return () => {
                map.off('click', onMapClick);
            };
        }, [map, isSelectable, onLocationSelect]);

        return selectedLocation ? (
            <Marker position={selectedLocation} icon={eventIcon}>
                <Popup>Selected Event Location</Popup>
            </Marker>
        ) : null;
    };

    return (
        <div className="relative w-full h-[500px] sm:h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {/* GPS Locate Me Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    locateUser();
                }}
                className="absolute top-4 right-4 z-[400] bg-white p-3 rounded-full shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Find My Location"
            >
                <Navigation size={20} className={hasLocation ? "text-indigo-600" : "text-gray-400"} />
            </button>

            <MapContainer
                center={position}
                zoom={13}
                className="w-full h-full z-0 font-sans"
                scrollWheelZoom={true}
            >
                <ChangeView center={position} zoom={13} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* User's Current Location & Search Radius */}
                {hasLocation && (
                    <>
                        <Marker position={position}>
                            <Popup>You are here!</Popup>
                        </Marker>
                        {!isSelectable && (
                            <Circle
                                center={position}
                                radius={defaultRadius}
                                pathOptions={{ color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.1, weight: 1.5 }}
                            />
                        )}
                    </>
                )}

                {/* Existing Event Markers */}
                {!isSelectable && events.map((event) => {
                    // Ensure event has a valid GeoJSON Point structure
                    if (event.location && event.location.coordinates && event.location.coordinates.length === 2) {
                        // Backend stores as [lng, lat], Leaflet displays as [lat, lng]
                        const latLng = [event.location.coordinates[1], event.location.coordinates[0]];

                        return (
                            <Marker key={event._id} position={latLng} icon={eventIcon}>
                                <Popup className="custom-popup w-64">
                                    <div className="flex flex-col gap-1 p-0.5 font-sans">
                                        <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full w-max tracking-wide uppercase">
                                            {event.category}
                                        </span>
                                        <h3 className="font-bold text-base text-gray-900 leading-tight mt-1">{event.title}</h3>
                                        <p className="text-xs text-gray-600 line-clamp-2 mt-1 mb-2">{event.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
                                            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                            <span>👥 {event.rsvps?.length || 0} RSVPs</span>
                                        </div>
                                        <button className="mt-3 w-full bg-indigo-600 text-white py-1.5 rounded-md text-sm font-semibold hover:bg-indigo-700 transition shadow-sm">
                                            View Details
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}

                <LocationSelector />
            </MapContainer>
        </div>
    );
};

export default MapComponent;

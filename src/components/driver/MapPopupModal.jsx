import React from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '12px',
};

// Mock coordinates for Colombo Airport and Galle Fort
const pickupCoords = { lat: 7.1807, lng: 79.8841 };
const destinationCoords = { lat: 6.0320, lng: 80.2170 };

const center = {
  lat: (pickupCoords.lat + destinationCoords.lat) / 2,
  lng: (pickupCoords.lng + destinationCoords.lng) / 2,
};

const MapPopupModal = ({ open, onClose, pickup, destination }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'MOCK_KEY',
    libraries: ['places', 'marker'], // Use consistent libraries
    preventGoogleFontsLoading: true
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="text-2xl">×</span>
        </button>
        <h2 className="text-xl font-bold mb-4">Trip Route Map</h2>
        <div className="mb-4">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={8}
            >
              <Marker position={pickupCoords} label="Pickup" />
              <Marker position={destinationCoords} label="Destination" />
              <Polyline
                path={[pickupCoords, destinationCoords]}
                options={{ strokeColor: '#4285F4', strokeWeight: 4 }}
              />
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">Loading map...</div>
          )}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span><strong>Pickup:</strong> {pickup}</span>
          <span><strong>Destination:</strong> {destination}</span>
        </div>
      </div>
    </div>
  );
};

export default MapPopupModal;

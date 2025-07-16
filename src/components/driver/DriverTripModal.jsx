import React from 'react';

const DriverTripModal = ({ open, onClose, trip }) => {
  if (!open || !trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>
        <div className="flex items-center mb-4">
          <img
            src={trip.passengerAvatar}
            alt={trip.passenger}
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{trip.passenger}</h2>
            <p className="text-sm text-gray-500">Trip #{trip.id}</p>
            <p className="text-xs text-gray-400">Phone: {trip.passengerPhone || '+94 77 000 0000'}</p>
            <p className="text-xs text-gray-400">Rating: {trip.passengerRating || 'N/A'}</p>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 mr-2">From:</span>
              <span className="text-gray-600">{trip.pickupLocation}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 mr-2">To:</span>
              <span className="text-gray-600">{trip.destination}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 mr-2">Distance:</span>
              <span className="text-gray-600">{trip.distance}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 mr-2">Estimated Time:</span>
              <span className="text-gray-600">{trip.estimatedTime}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 mr-2">Fare:</span>
              <span className="text-gray-600">${trip.fare}</span>
            </div>
            {trip.tip !== undefined && (
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-700 mr-2">Tip:</span>
                <span className="text-green-600">${trip.tip}</span>
              </div>
            )}
            {trip.driverRating && (
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-700 mr-2">Your Rating:</span>
                <span className="text-yellow-600">{trip.driverRating}/5</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center">
            {/* Static map image, replace with dynamic if needed */}
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(trip.pickupLocation)},Sri+Lanka&zoom=8&size=300x180&maptype=roadmap&markers=color:blue%7C${encodeURIComponent(trip.pickupLocation)},Sri+Lanka|${encodeURIComponent(trip.destination)},Sri+Lanka&key=YOUR_GOOGLE_MAPS_API_KEY`}
              alt="Trip Map"
              className="rounded-xl border border-gray-200 mb-2"
              style={{ width: '100%', height: 'auto', minHeight: '120px', objectFit: 'cover' }}
            />
            <span className="text-xs text-gray-400">Route preview</span>
          </div>
        </div>
        {trip.note && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <span className="text-sm text-blue-700">{trip.note}</span>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverTripModal;

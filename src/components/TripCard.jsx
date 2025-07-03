import React from 'react';

const TripCard = ({ trip }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group cursor-pointer">
      {/* Trip Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Overlay for status */}
        <div className="absolute top-3 right-3">
          {trip.isCompleted ? (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Completed
            </span>
          ) : (
            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Trip Details */}
      <div className="p-4">
        {/* Trip Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {trip.name}
        </h3>

        {/* Destination */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          {trip.destination}
        </p>

        {/* Dates */}
        <p className="text-gray-500 text-sm mb-3">
          {trip.dates}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors duration-200">
            View details
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;

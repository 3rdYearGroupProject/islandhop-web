import React from 'react';
import { MapPin, Users, Star, Camera } from 'lucide-react';

const TripBanner = ({ tripData, formattedDates, daysLeft }) => {
  const {
    tripName = 'Untitled Trip',
    baseCity: destination = 'Unknown Destination',
    preferredActivities = []
  } = tripData;

  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-[300px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
      <div className="relative max-w-7xl mx-auto px-4 pt-40 pb-12" style={{ zIndex: 1 }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Ongoing Trip</span>
              <span className="text-white/80 text-sm">{formattedDates}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{tripName}</h1>
            <div className="flex items-center text-white/90 mb-2">
              <MapPin className="h-5 w-5 mr-2 text-blue-200" />
              <span className="text-lg font-medium">{destination}</span>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center text-blue-100">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">1 traveler</span>
              </div>
              {daysLeft > 0 && (
                <span className="px-3 py-1 bg-orange-100/80 text-orange-900 text-xs rounded-full font-semibold">{daysLeft} days left</span>
              )}
            </div>
            {preferredActivities && preferredActivities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {preferredActivities.slice(0, 3).map((activity, idx) => (
                  <span key={idx} className="inline-block px-2 py-1 bg-white/20 text-blue-100 text-xs rounded-md capitalize">{activity}</span>
                ))}
                {preferredActivities.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-white/10 text-white text-xs rounded-md">+{preferredActivities.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripBanner;

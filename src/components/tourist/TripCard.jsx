import React, { useState, useEffect } from 'react';
import { Heart, MoreHorizontal, MapPin, Calendar, Users, Star, Camera, Share2, Edit3 } from 'lucide-react';
import { placeholderImage, getCityImageUrl, logImageError } from '../../utils/imageUtils';

const TripCard = ({ trip, getStatusColor, onClick }) => {
  // State to track if image failed to load
  const [imageError, setImageError] = useState(false);
  // State to store the actual image URL to use
  const [imageUrl, setImageUrl] = useState(null);

  // Pre-validate image URL and set up fallbacks
  useEffect(() => {
    // First try using the city image directly if no image is provided
    if (!trip.image) {
      const cityImage = trip.destination ? getCityImageUrl(trip.destination) : placeholderImage;
      setImageUrl(cityImage);
      return;
    }

    // If previous attempt resulted in error, use city image
    if (imageError) {
      const cityImage = trip.destination ? getCityImageUrl(trip.destination) : placeholderImage;
      setImageUrl(cityImage);
      return;
    }

    // Set up the initial image URL from the trip
    setImageUrl(trip.image);

    // Skip pre-validation for local assets or if the image is already a local import
    if (typeof trip.image === 'object' || 
        (typeof trip.image === 'string' && 
         (trip.image.startsWith('data:') || 
          trip.image.startsWith('/') || 
          trip.image === placeholderImage))) {
      return;
    }

    // Pre-validate external image URLs
    const img = new Image();
    img.onload = () => {
      // Image loaded successfully, no action needed
    };
    img.onerror = () => {
      logImageError('TripCard', trip, trip.image);
      const fallbackUrl = trip.destination ? getCityImageUrl(trip.destination) : placeholderImage;
      setImageUrl(fallbackUrl);
      setImageError(true);
    };
    img.src = trip.image;
  }, [trip.image, trip.destination, trip.name, trip.id, imageError]);

  // Handler for image load errors during render
  const handleImageError = () => {
    logImageError('TripCard', trip, imageUrl);
    const fallbackUrl = trip.destination ? getCityImageUrl(trip.destination) : placeholderImage;
    setImageUrl(fallbackUrl);
    setImageError(true);
  };

  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1 flex flex-col h-[500px] max-h-[500px] min-h-[500px] cursor-pointer"
      onClick={() => onClick && onClick(trip)}
    >
      <div className="relative">
        <img 
          src={imageUrl || placeholderImage} 
          alt={trip.destination || "Trip destination"}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
        />
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor ? getStatusColor(trip.status) : ''}`}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
        {trip.status === 'active' && trip.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="flex items-center justify-between text-white text-sm mb-2">
              <span>Trip Progress</span>
              <span>{trip.progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${trip.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {trip.name}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{trip.destination}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{trip.dates}</span>
            {trip.daysLeft && trip.daysLeft > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                {trip.daysLeft} days left
              </span>
            )}
          </div>

          {trip.travelers && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {trip.highlights && trip.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {trip.highlights.slice(0, 3).map((highlight, index) => (
                <span key={index} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {highlight}
                </span>
              ))}
              {trip.highlights.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                  +{trip.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {trip.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span>{trip.rating}</span>
              </div>
            )}
            {trip.memories > 0 && (
              <div className="flex items-center">
                <Camera className="h-4 w-4 mr-1" />
                <span>{trip.memories}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;

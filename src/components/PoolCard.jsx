import React, { useState, useEffect } from 'react';
import { Heart, MoreHorizontal, MapPin, Calendar, Users, Star, Share2, UserPlus, Eye, TrendingUp } from 'lucide-react';
import { placeholderImage, getCityImageUrl, getRandomCityImage, logImageError } from '../utils/imageUtils';

const PoolCard = ({ pool, onJoinPool, onClick, buttonText = "Join Pool", buttonIcon = UserPlus, showCompatibilityScore = false, compatibilityScore }) => {
  // State to track if image failed to load
  const [imageError, setImageError] = useState(false);
  // State to store the actual image URL to use
  const [imageUrl, setImageUrl] = useState(null);

  // Debug log to check pool structure and visibility
  console.log('🔍 PoolCard - Pool data:', pool);
  console.log('🔍 PoolCard - Pool visibility:', pool.visibility);
  console.log('🔍 PoolCard - Pool status:', pool.status);
  
  // Pre-validate image URL and set up fallbacks - similar to TripCard
  useEffect(() => {
    // If no image provided, use a random city image based on pool ID for consistency
    if (!pool.image) {
      const randomImage = getRandomCityImage(pool.id || pool.name);
      setImageUrl(randomImage);
      return;
    }

    // If previous attempt resulted in error, use random image
    if (imageError) {
      const randomImage = getRandomCityImage(pool.id || pool.name);
      setImageUrl(randomImage);
      return;
    }

    // Set up the initial image URL from the pool
    setImageUrl(pool.image);

    // Skip pre-validation for local assets or if the image is already a local import
    if (typeof pool.image === 'object' || 
        (typeof pool.image === 'string' && 
         (pool.image.startsWith('data:') || 
          pool.image.startsWith('/') || 
          pool.image === placeholderImage))) {
      return;
    }

    // Pre-validate external image URLs
    const img = new Image();
    img.onload = () => {
      // Image loaded successfully, no action needed
    };
    img.onerror = () => {
      logImageError('PoolCard', pool, pool.image);
      const fallbackUrl = getRandomCityImage(pool.id || pool.name);
      setImageUrl(fallbackUrl);
      setImageError(true);
    };
    img.src = pool.image;
  }, [pool.image, pool.destinations, pool.name, pool.id, imageError]);

  // Handler for image load errors during render
  const handleImageError = () => {
    logImageError('PoolCard', pool, imageUrl);
    const fallbackUrl = getRandomCityImage(pool.id || pool.name);
    setImageUrl(fallbackUrl);
    setImageError(true);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-400';
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'open':
        return 'Open';
      case 'draft':
        return 'Draft';
      case 'full':
        return 'Full';
      case 'closed':
        return 'Closed';
      case 'completed':
        return 'Completed';
      default:
        return 'Available';
    }
  };

  const handleJoinPool = () => {
    if (onJoinPool) {
      onJoinPool(pool);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(pool);
    }
  };

  const ButtonIcon = buttonIcon;

  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1 flex flex-col h-[380px] sm:h-[500px] w-full cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={imageUrl || placeholderImage} 
          alt={pool.name || "Pool destination"}
          className="w-full h-36 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
        />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(pool.status || 'open')}`}>
            {getStatusText(pool.status || 'open')}
          </span>
        </div>

        {/* Visibility Label */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold border shadow ${
            pool.visibility === 'public'
              ? 'bg-blue-100 text-blue-800 border-blue-400'
              : pool.visibility === 'private'
                ? 'bg-gray-100 text-gray-800 border-gray-300'
                : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}>
            {pool.visibility === 'public' ? 'Public' : pool.visibility === 'private' ? 'Private' : 'Private'}
          </span>
        </div>
        
        {/* Heart Button - moved below visibility label */}
        <div className="absolute top-12 right-3 sm:top-16 sm:right-4">
          <button className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
        
        {/* Compatibility Score Badge */}
        {showCompatibilityScore && compatibilityScore && (
          <div className="absolute top-3 left-3 mt-7 sm:top-4 sm:left-4 sm:mt-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {Math.round(compatibilityScore * 100)}% Match
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1 sm:mb-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {pool.name}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
          by {pool.owner}
        </div>

        <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
            <span className="text-xs sm:text-sm">{pool.destinations}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
            <span className="text-xs sm:text-sm">{pool.date}</span>
            {pool.duration && (
              <span className="ml-1 sm:ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                {pool.duration}
              </span>
            )}
          </div>

          <div className="flex items-center text-gray-600">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
            <span className="text-xs sm:text-sm">{pool.participants} participants</span>
            {pool.maxParticipants && (
              <span className="text-xs text-gray-500 ml-1">/ {pool.maxParticipants}</span>
            )}
          </div>
        </div>

        {pool.highlights && pool.highlights.length > 0 && (
          <div className="mb-2 sm:mb-3">
            <div className="flex flex-wrap gap-1">
              {pool.highlights.slice(0, 3).map((highlight, index) => (
                <span key={index} className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {highlight}
                </span>
              ))}
              {pool.highlights.length > 3 && (
                <span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-md">
                  +{pool.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Compatibility Details for Similar Trips */}
        {showCompatibilityScore && pool.compatibilityDetails && (
          <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs font-medium text-green-800 mb-1 sm:mb-2">Why this matches:</div>
            <div className="space-y-1">
              {pool.compatibilityDetails.commonActivities?.length > 0 && (
                <div className="text-xs text-green-700">
                  <span className="font-medium">Common activities:</span> {pool.compatibilityDetails.commonActivities.slice(0, 3).join(', ')}
                  {pool.compatibilityDetails.commonActivities.length > 3 && ` +${pool.compatibilityDetails.commonActivities.length - 3} more`}
                </div>
              )}
              {pool.compatibilityDetails.commonTerrains?.length > 0 && (
                <div className="text-xs text-green-700">
                  <span className="font-medium">Common terrains:</span> {pool.compatibilityDetails.commonTerrains.slice(0, 3).join(', ')}
                  {pool.compatibilityDetails.commonTerrains.length > 3 && ` +${pool.compatibilityDetails.commonTerrains.length - 3} more`}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full border border-blue-300 transition-colors">
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
          <div className="flex items-center">
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleJoinPool();
              }}
              className="flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
            >
              <ButtonIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
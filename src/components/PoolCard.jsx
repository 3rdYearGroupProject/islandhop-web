import React from 'react';
import { Heart, MoreHorizontal, MapPin, Calendar, Users, Star, Share2, UserPlus, Eye } from 'lucide-react';

const PoolCard = ({ pool, onJoinPool, buttonText = "Join Pool", buttonIcon = UserPlus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleJoinPool = () => {
    if (onJoinPool) {
      onJoinPool(pool);
    }
  };

  const ButtonIcon = buttonIcon;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1 flex flex-col h-[580px] max-h-[580px] min-h-[580px]">
      <div className="relative">
        <img 
          src={pool.image} 
          alt={pool.name}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(pool.status || 'open')}`}>
            {(pool.status || 'open').charAt(0).toUpperCase() + (pool.status || 'open').slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow">
            {pool.price}
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {pool.name}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          by {pool.owner}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{pool.destinations}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{pool.date}</span>
            {pool.duration && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                {pool.duration}
              </span>
            )}
          </div>

          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{pool.participants} participants</span>
            {pool.maxParticipants && (
              <span className="text-xs text-gray-500 ml-1">/ {pool.maxParticipants}</span>
            )}
          </div>
        </div>

        {pool.highlights && pool.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {pool.highlights.slice(0, 3).map((highlight, index) => (
                <span key={index} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {highlight}
                </span>
              ))}
              {pool.highlights.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                  +{pool.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {pool.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span>{pool.rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button 
              onClick={handleJoinPool}
              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
            >
              <ButtonIcon className="h-4 w-4 mr-1" />
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
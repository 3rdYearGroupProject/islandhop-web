import React from 'react';
import Card, { CardBody } from './Card';
import { 
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const PoolCard = ({ pool, onJoinPool }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 fill-yellow-200 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const handleJoinPool = () => {
    if (onJoinPool) {
      onJoinPool(pool);
    }
  };

  return (
    <Card hover className="group cursor-pointer">
      <div className="relative">
        <img
          src={pool.image}
          alt={pool.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {pool.duration}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
          {pool.price}
        </div>
      </div>
      
      <CardBody>
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
            {pool.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            by {pool.owner}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex mr-2">{renderStars(pool.rating)}</div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {pool.rating}
          </span>
        </div>

        {/* Destinations */}
        <div className="flex items-start mb-3">
          <MapPinIcon className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {pool.destinations}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center mb-3">
          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {pool.date}
          </span>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {pool.participants} participants
            </span>
          </div>
          <button 
            onClick={handleJoinPool}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Join Pool
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PoolCard;
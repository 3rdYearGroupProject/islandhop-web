import React, { useState } from 'react';
import { 
  StarIcon, 
  ChartBarIcon, 
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const DriverReviews = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const reviewStats = {
    averageRating: 4.8,
    totalReviews: 324,
    ratingDistribution: [
      { stars: 5, count: 245, percentage: 75.6 },
      { stars: 4, count: 58, percentage: 17.9 },
      { stars: 3, count: 15, percentage: 4.6 },
      { stars: 2, count: 4, percentage: 1.2 },
      { stars: 1, count: 2, percentage: 0.6 }
    ]
  };

  const reviews = [
    {
      id: 1,
      passenger: 'Sarah Johnson',
      rating: 5,
      date: '2024-07-03',
      trip: 'Colombo Airport → Galle Fort',
      comment: 'Excellent driver! Very punctual, safe driving, and friendly conversation. The car was clean and comfortable. Highly recommend!',
      tags: ['punctual', 'safe driving', 'clean car']
    },
    {
      id: 2,
      passenger: 'Michael Chen',
      rating: 5,
      date: '2024-07-02',
      trip: 'Kandy → Nuwara Eliya',
      comment: 'Amazing experience! John knew all the best scenic routes and made great suggestions for stops along the way.',
      tags: ['scenic route', 'local knowledge', 'helpful']
    },
    {
      id: 3,
      passenger: 'Emily Davis',
      rating: 4,
      date: '2024-07-01',
      trip: 'Mount Lavinia → Colombo City',
      comment: 'Good trip overall. Driver was on time and professional. Could have been more conversational but driving was excellent.',
      tags: ['professional', 'on time']
    },
    {
      id: 4,
      passenger: 'James Wilson',
      rating: 5,
      date: '2024-06-30',
      trip: 'Negombo → Sigiriya',
      comment: 'Outstanding service! The driver went above and beyond, helping with luggage and providing water bottles. Very comfortable ride.',
      tags: ['helpful', 'comfortable', 'extra service']
    },
    {
      id: 5,
      passenger: 'Lisa Thompson',
      rating: 4,
      date: '2024-06-29',
      trip: 'Ella → Colombo',
      comment: 'Safe and smooth journey. Driver was very knowledgeable about the area and shared interesting stories about local culture.',
      tags: ['safe driving', 'cultural knowledge', 'entertaining']
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === 'all') return true;
    return review.rating.toString() === selectedFilter;
  });

  const renderStars = (rating, size = 'h-5 w-5') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
   
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reviews & Ratings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            See what passengers are saying about your service
          </p>
        </div>

        {/* Rating Overview */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                {reviewStats.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(reviewStats.averageRating), 'h-8 w-8')}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Based on {reviewStats.totalReviews} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {reviewStats.ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.stars}</span>
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Rating
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
              >
                {timeFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {review.passenger}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {review.trip}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    {renderStars(review.rating, 'h-4 w-4')}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {review.date}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {review.tags && (
                <div className="flex flex-wrap gap-2">
                  {review.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 border border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors duration-200">
            Load More Reviews
          </button>
        </div>
      </div>
    
  );
};

export default DriverReviews;

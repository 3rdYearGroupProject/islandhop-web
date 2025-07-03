import React, { useState } from 'react';
import { TruckIcon, StarIcon } from '@heroicons/react/24/outline';

const DriverStatusCard = ({ compact = false, showToggle = true, className = '' }) => {
  const [driverStatus, setDriverStatus] = useState({
    online: true,
    activeTrips: 1,
    todayEarnings: 245.50,
    rating: 4.8
  });

  const toggleOnlineStatus = () => {
    setDriverStatus(prev => ({ ...prev, online: !prev.online }));
  };

  if (compact) {
    // Compact version for sidebar
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 ${driverStatus.online ? 'bg-green-500' : 'bg-red-500'} rounded-full ${driverStatus.online ? 'animate-pulse' : ''}`}></div>
            <span className={`text-xs font-medium ${driverStatus.online ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {driverStatus.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center p-2 bg-white/50 dark:bg-secondary-800/50 rounded-lg">
            <span className="block font-medium text-gray-600 dark:text-gray-400">Today</span>
            <span className="text-green-600 dark:text-green-400 font-bold">${driverStatus.todayEarnings}</span>
          </div>
          <div className="text-center p-2 bg-white/50 dark:bg-secondary-800/50 rounded-lg">
            <span className="block font-medium text-gray-600 dark:text-gray-400">Rating</span>
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">⭐ {driverStatus.rating}</span>
          </div>
        </div>
      </div>
    );
  }

  // Full version for dashboard
  return (
    <div className={`bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <TruckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Driver Status</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {driverStatus.online ? 'You are online and accepting trips' : 'You are offline'}
            </p>
          </div>
        </div>
        
        {showToggle && (
          <button
            onClick={toggleOnlineStatus}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              driverStatus.online
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
            }`}
          >
            {driverStatus.online ? 'Go Offline' : 'Go Online'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-secondary-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{driverStatus.activeTrips}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Active Trips</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-secondary-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">${driverStatus.todayEarnings}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Today's Earnings</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-secondary-700 rounded-lg">
          <div className="flex items-center justify-center space-x-1">
            <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{driverStatus.rating}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
        </div>
      </div>
    </div>
  );
};

export default DriverStatusCard;

import React, { useState } from 'react';
import { 
  AcademicCapIcon,
  GlobeAltIcon,
  ClockIcon,
  StarIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';

const GuideStatusCard = ({ compact = false, showToggle = true }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [status, setStatus] = useState('available'); // available, busy, offline

  const toggleAvailability = () => {
    if (showToggle) {
      setIsAvailable(!isAvailable);
      setStatus(isAvailable ? 'offline' : 'available');
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          color: 'bg-green-500',
          text: 'Available',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-700 dark:text-green-400'
        };
      case 'busy':
        return {
          color: 'bg-yellow-500',
          text: 'Busy',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          textColor: 'text-yellow-700 dark:text-yellow-400'
        };
      case 'offline':
        return {
          color: 'bg-gray-500',
          text: 'Offline',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          textColor: 'text-gray-700 dark:text-gray-400'
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Offline',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          textColor: 'text-gray-700 dark:text-gray-400'
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (compact) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-4 border border-gray-200 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <AcademicCapIcon className="h-5 w-5 text-primary-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Guide Status
              </div>
              <div className={`text-xs ${statusConfig.textColor}`}>
                Currently {statusConfig.text}
              </div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${statusConfig.color}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <AcademicCapIcon className="h-6 w-6 text-primary-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Guide Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your current availability
            </p>
          </div>
        </div>
        
        {showToggle && (
          <button
            onClick={toggleAvailability}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              isAvailable ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                isAvailable ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        )}
      </div>

      {/* Status Display */}
      <div className={`${statusConfig.bgColor} rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${statusConfig.color}`}></div>
            <span className={`font-medium ${statusConfig.textColor}`}>
              {statusConfig.text}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Since 9:00 AM
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <GlobeAltIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">4</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Active Tours
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <LanguageIcon className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-1" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">5</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Languages
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideStatusCard;

import React, { useState } from 'react';
import { MapIcon } from '@heroicons/react/24/outline';

const OnlineToggle = ({ userType = 'driver', className = '', size = 'default' }) => {
  const [isOnline, setIsOnline] = useState(false);

  const handleToggle = () => {
    setIsOnline(!isOnline);
    // Add API call here to update online status
    console.log(`${userType} is now ${!isOnline ? 'online' : 'offline'}`);
  };

  const sizeClasses = {
    small: 'p-2 text-xs',
    default: 'p-3 text-sm',
    large: 'px-4 py-3 text-sm'
  };

  const baseClasses = `flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer ${sizeClasses[size]}`;
  
  const onlineClasses = `${baseClasses} bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30`;
  const offlineClasses = `${baseClasses} bg-gray-100 dark:bg-secondary-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-secondary-600`;

  return (
    <button
      onClick={handleToggle}
      className={`${isOnline ? onlineClasses : offlineClasses} ${className}`}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${
        isOnline 
          ? 'bg-blue-500 animate-pulse' 
          : 'bg-gray-400 dark:bg-gray-500'
      }`}></div>
      {isOnline ? 'Online' : 'Offline'}
    </button>
  );
};

export default OnlineToggle;

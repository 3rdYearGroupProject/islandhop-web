import React from 'react';
import { TruckIcon, StarIcon, CalendarIcon } from '@heroicons/react/24/outline';

const VehicleInfoCard = ({ vehicle, compact = false, showActions = false, className = '' }) => {
  if (!vehicle) return null;

  if (compact) {
    // Compact version for profile page
    return (
      <div className={`bg-white dark:bg-secondary-800 rounded-lg p-4 border border-gray-200 dark:border-secondary-700 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <TruckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{vehicle.plateNumber}</span>
              <span>•</span>
              <span className="capitalize">{vehicle.color}</span>
              <span>•</span>
              <span>{vehicle.capacity} seats</span>
            </div>
          </div>
          {vehicle.isActive && (
            <div className="px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
              Active
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full version for vehicle page
  return (
    <div className={`bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <TruckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 capitalize">
              {vehicle.type} • {vehicle.color} • {vehicle.capacity} passengers
            </p>
          </div>
        </div>
        {vehicle.isActive && (
          <div className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium">
            Active Vehicle
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Details */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Vehicle Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Plate Number:</span>
              <span className="font-medium text-gray-900 dark:text-white">{vehicle.plateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Type:</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">{vehicle.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Capacity:</span>
              <span className="font-medium text-gray-900 dark:text-white">{vehicle.capacity} passengers</span>
            </div>
          </div>
        </div>

        {/* Insurance Info */}
        {vehicle.insurance && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Insurance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Company:</span>
                <span className="font-medium text-gray-900 dark:text-white">{vehicle.insurance.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Policy:</span>
                <span className="font-medium text-gray-900 dark:text-white">{vehicle.insurance.policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Expires:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(vehicle.insurance.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Images */}
      {vehicle.images && vehicle.images.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Photos</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {vehicle.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Vehicle ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {showActions && (
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Edit Vehicle
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
            View Documents
          </button>
        </div>
      )}
    </div>
  );
};

export default VehicleInfoCard;

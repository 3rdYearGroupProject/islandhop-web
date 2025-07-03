import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DriverDashboardLayout from '../components/DriverDashboardLayout';

// Placeholder components for driver routes
const DriverDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Driver Dashboard
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Active Rides</h2>
        <p className="text-gray-600 dark:text-gray-400">Current and upcoming rides</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Earnings</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your earnings</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Schedule</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your availability</p>
      </div>
    </div>
  </div>
);

const DriverRoutes = () => {
  return (
    <DriverDashboardLayout>
      <Routes>
        <Route path="/" element={<DriverDashboard />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        {/* Add other driver routes here */}
      </Routes>
    </DriverDashboardLayout>
  );
};

export default DriverRoutes;

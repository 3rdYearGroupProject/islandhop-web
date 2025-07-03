import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

// Placeholder components for tourist routes
const TouristDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Tourist Dashboard
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">My Trips</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your upcoming trips</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Find Pools</h2>
        <p className="text-gray-600 dark:text-gray-400">Join ride sharing pools</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Explore</h2>
        <p className="text-gray-600 dark:text-gray-400">Discover new destinations</p>
      </div>
    </div>
  </div>
);

const TouristRoutes = () => {
  return (
    <DashboardLayout userRole="tourist">
      <Routes>
        <Route path="/" element={<TouristDashboard />} />
        <Route path="dashboard" element={<TouristDashboard />} />
        {/* Add other tourist routes here */}
      </Routes>
    </DashboardLayout>
  );
};

export default TouristRoutes;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

// Placeholder components for guide routes
const GuideDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Guide Dashboard
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Active Tours</h2>
        <p className="text-gray-600 dark:text-gray-400">Current and upcoming tours</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Bookings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage tour bookings</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Reviews</h2>
        <p className="text-gray-600 dark:text-gray-400">View customer feedback</p>
      </div>
    </div>
  </div>
);

const GuideRoutes = () => {
  return (
    <DashboardLayout userRole="guide">
      <Routes>
        <Route path="/" element={<GuideDashboard />} />
        <Route path="dashboard" element={<GuideDashboard />} />
        {/* Add other guide routes here */}
      </Routes>
    </DashboardLayout>
  );
};

export default GuideRoutes;

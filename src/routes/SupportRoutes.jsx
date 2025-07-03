import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupportDashboardLayout from '../components/SupportDashboardLayout';

// Placeholder components for support routes
const SupportDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Support Dashboard
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Open Tickets</h2>
        <p className="text-gray-600 dark:text-gray-400">Active support tickets</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Knowledge Base</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage help articles</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">User Issues</h2>
        <p className="text-gray-600 dark:text-gray-400">Track user problems</p>
      </div>
    </div>
  </div>
);

const SupportRoutes = () => {
  return (
    <SupportDashboardLayout>
      <Routes>
        <Route path="/" element={<SupportDashboard />} />
        <Route path="dashboard" element={<SupportDashboard />} />
        {/* Add other support routes here */}
      </Routes>
    </SupportDashboardLayout>
  );
};

export default SupportRoutes;

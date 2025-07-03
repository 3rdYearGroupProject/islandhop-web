import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

// Placeholder components for admin routes
const AdminDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Admin Dashboard
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage all users</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">View system analytics</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">System configuration</p>
      </div>
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Reports</h2>
        <p className="text-gray-600 dark:text-gray-400">Generate reports</p>
      </div>
    </div>
  </div>
);

const AdminRoutes = () => {
  return (
    <DashboardLayout userRole="admin">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Add other admin routes here */}
      </Routes>
    </DashboardLayout>
  );
};

export default AdminRoutes;

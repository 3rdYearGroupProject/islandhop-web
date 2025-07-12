import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboardLayout from '../components/AdminDashboardLayout';

// Import admin page components
import AdminDashboard from '../pages/admin/AdminDashboard';
import Analytics from '../pages/admin/Analytics';
import SystemSettings from '../pages/admin/SystemSettings';
import Reviews from '../pages/admin/Reviews';
import Notifications from '../pages/admin/Notifications';
import ProfileDetails from '../pages/admin/ProfileDetails';
import SystemHistory from '../pages/admin/SystemHistory';
import APIs from '../pages/admin/APIs';
import AISettings from '../pages/admin/AISettings';
import Hosting from '../pages/admin/Hosting';
import Accounts from '../pages/admin/Accounts';
import UpdateUserProfile from '../pages/admin/UpdateUserProfile';
import Communications from '../pages/admin/Communications';

const AdminRoutes = () => {
  return (
    <AdminDashboardLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="communications" element={<Communications />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="ai-settings" element={<AISettings />} />
        <Route path="hosting" element={<Hosting />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<ProfileDetails />} />
        <Route path="history" element={<SystemHistory />} />
        <Route path="apis" element={<APIs />} />
        <Route path="update-user/:userId" element={<UpdateUserProfile />} />
      </Routes>
    </AdminDashboardLayout>
  );
};

export default AdminRoutes;

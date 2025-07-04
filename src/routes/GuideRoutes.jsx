import React from 'react';
import { Routes, Route } from 'react-router-dom';


import GuideDashboardLayout from '../components/GuideDashboardLayout';
import GuideDashboard from '../pages/guide/GuideDashboard';
import GuideProfile from '../pages/guide/GuideProfile';
import GuideTrips from '../pages/guide/GuideTrips';
import GuideEarnings from '../pages/guide/GuideEarnings';
import GuideSchedule from '../pages/guide/GuideSchedule';
import GuideChat from '../pages/guide/GuideChat';
import GuidePackages from '../pages/guide/GuidePackages';
import GuideReviews from '../pages/guide/GuideReviews';
import GuideHistory from '../pages/guide/GuideHistory';
import GuideAnalytics from '../pages/guide/GuideAnalytics';

const GuideRoutes = () => {
  return (
    <GuideDashboardLayout>
      <Routes>
        <Route path="/dashboard" element={<GuideDashboard />} />
        <Route path="/trips" element={<GuideTrips />} />
        <Route path="/schedule" element={<GuideSchedule />} />
        <Route path="/earnings" element={<GuideEarnings />} />
        <Route path="/chat" element={<GuideChat />} />
        <Route path="/packages" element={<GuidePackages />} />
        <Route path="/reviews" element={<GuideReviews />} />
        <Route path="/history" element={<GuideHistory />} />
        <Route path="/analytics" element={<GuideAnalytics />} />
        <Route path="/profile" element={<GuideProfile />} />
        <Route path="/" element={<GuideDashboard />} />
      </Routes>
    </GuideDashboardLayout>
  );
};

export default GuideRoutes;

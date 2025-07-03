import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DriverDashboardLayout from '../components/DriverDashboardLayout';

// Import driver page components
import DriverDashboard from '../pages/driver/DriverDashboard';
import DriverTrips from '../pages/driver/DriverTrips';
import DriverEarnings from '../pages/driver/DriverEarnings';
import DriverProfile from '../pages/driver/DriverProfile';
import DriverChat from '../pages/driver/DriverChat';
import DriverSchedule from '../pages/driver/DriverSchedule';
import DriverVehicle from '../pages/driver/DriverVehicle';
import DriverReviews from '../pages/driver/DriverReviews';
import DriverHistory from '../pages/driver/DriverHistory';
import DriverAnalytics from '../pages/driver/DriverAnalytics';

const DriverRoutes = () => {
  return (
    <DriverDashboardLayout>
      <Routes>
        <Route path="/" element={<DriverDashboard />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
        <Route path="/trips" element={<DriverTrips />} />
        <Route path="/earnings" element={<DriverEarnings />} />
        <Route path="/profile" element={<DriverProfile />} />
        <Route path="/chat" element={<DriverChat />} />
        <Route path="/schedule" element={<DriverSchedule />} />
        <Route path="/vehicle" element={<DriverVehicle />} />
        <Route path="/reviews" element={<DriverReviews />} />
        <Route path="/history" element={<DriverHistory />} />
        <Route path="/analytics" element={<DriverAnalytics />} />
      </Routes>
    </DriverDashboardLayout>
  );
};

export default DriverRoutes;

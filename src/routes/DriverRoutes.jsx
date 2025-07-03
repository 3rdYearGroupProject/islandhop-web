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
      </Routes>
    </DriverDashboardLayout>
  );
};

export default DriverRoutes;

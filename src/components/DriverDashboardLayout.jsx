import React from 'react';
import DashboardLayout from './DashboardLayout';

const DriverDashboardLayout = ({ children }) => {
  return (
    <DashboardLayout userRole="driver">
      {children}
    </DashboardLayout>
  );
};

export default DriverDashboardLayout;

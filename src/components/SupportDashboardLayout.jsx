import React from 'react';
import DashboardLayout from './DashboardLayout';

const SupportDashboardLayout = ({ children }) => {
  return (
    <DashboardLayout userRole="support">
      {children}
    </DashboardLayout>
  );
};

export default SupportDashboardLayout;

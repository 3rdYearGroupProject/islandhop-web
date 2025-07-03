import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import DriverSidebar from './sidebars/DriverSidebar';

const DriverDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />
      
      {/* Driver Sidebar */}
      <DriverSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="min-h-screen pt-16">
          <div className="px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboardLayout;

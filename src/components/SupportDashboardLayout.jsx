import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import SupportSidebar from './sidebars/SupportSidebar';

const SupportDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />
      
      {/* Sidebar */}
      <SupportSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen pt-16 bg-gray-50 dark:bg-secondary-900">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupportDashboardLayout;

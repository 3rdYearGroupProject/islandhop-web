import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './sidebars/Sidebar';
import MobileMenu from './MobileMenu';

const DashboardLayout = ({ children, userRole }) => {
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
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={userRole}
      />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={userRole}
      />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

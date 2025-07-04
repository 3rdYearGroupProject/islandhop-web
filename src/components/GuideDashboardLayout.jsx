import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import GuideSidebar from './sidebars/GuideSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const GuideDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Mobile Menu Button - Fixed Position */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white dark:bg-secondary-800 rounded-lg shadow-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
      
      {/* Guide Sidebar */}
      <GuideSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="min-h-screen">
          <div className="px-4 py-6 lg:px-8 pt-16 lg:pt-6">
            {children}
          </div>
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

export default GuideDashboardLayout;

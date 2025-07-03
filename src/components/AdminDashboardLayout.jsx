import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import AdminSidebar from './sidebars/AdminSidebar';
import MobileMenu from './MobileMenu';

const AdminDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />
      
      {/* Admin Sidebar */}
      <AdminSidebar 
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

export default AdminDashboardLayout;

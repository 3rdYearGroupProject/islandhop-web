import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Sidebar from './sidebars/Sidebar';
import AdminSidebar from './sidebars/AdminSidebar';

// Import all page components
import Home from '../pages/traveler/Home';
import Profile from '../pages/traveler/Profile';
import Trips from '../pages/traveler/Trips';
import RidePools from '../pages/traveler/RidePools';
import Messaging from '../pages/traveler/Messaging';
import Support from '../pages/traveler/Support';
import Emergency from '../pages/traveler/Emergency';

import AdminDashboard from '../pages/admin/AdminDashboard';
import Analytics from '../pages/admin/Analytics';
import SystemSettings from '../pages/admin/SystemSettings';
import Hosting from '../pages/admin/Hosting';
import AISettings from '../pages/admin/AISettings';
import APIs from '../pages/admin/APIs';
import SystemHistory from '../pages/admin/SystemHistory';
import Accounts from '../pages/admin/Accounts';
import Reviews from '../pages/admin/Reviews';
import Notifications from '../pages/admin/Notifications';

import './DashboardLayout.css';

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('Home');
  const [userRole, setUserRole] = useState('traveler'); // 'traveler' or 'admin'
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Handle direct navigation to /profile
    if (location.pathname === '/profile') {
      setCurrentPage('Profile');
    }
  }, [location]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const handleRoleChange = (role) => {
    setUserRole(role);
    // Reset to appropriate home page when switching roles
    if (role === 'admin') {
      setCurrentPage('AdminDashboard');
    } else {
      setCurrentPage('Home');
    }
  };

  const renderCurrentPage = () => {
    // Traveler pages
    if (userRole === 'traveler') {
      switch (currentPage) {
        case 'Home': return <Home onPageChange={setCurrentPage} />;
        case 'Profile': return <Profile />;
        case 'Trips': return <Trips />;
        case 'RidePools': return <RidePools />;
        case 'Messaging': return <Messaging />;
        case 'Support': return <Support />;
        case 'Emergency': return <Emergency />;
        default: return <Home onPageChange={setCurrentPage} />;
      }
    }
    
    // Admin pages
    if (userRole === 'admin') {
      switch (currentPage) {
        case 'AdminDashboard': return <AdminDashboard onPageChange={setCurrentPage} />;
        case 'Profile': return <Profile />;
        case 'Analytics': return <Analytics />;
        case 'SystemSettings': return <SystemSettings />;
        case 'Hosting': return <Hosting />;
        case 'AISettings': return <AISettings />;
        case 'APIs': return <APIs />;
        case 'SystemHistory': return <SystemHistory />;
        case 'Accounts': return <Accounts />;
        case 'Reviews': return <Reviews />;
        case 'Notifications': return <Notifications />;
        default: return <AdminDashboard onPageChange={setCurrentPage} />;
      }
    }
  };

  return (
    <div className="dashboard-layout">
      {userRole === 'traveler' ? (
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      ) : (
        <AdminSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
      
      <div className="main-content">
        <div className="role-switcher">
          <button 
            className={`role-button ${userRole === 'traveler' ? 'active' : ''}`}
            onClick={() => handleRoleChange('traveler')}
          >
            Traveler
          </button>
          <button 
            className={`role-button ${userRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            Admin
          </button>
        </div>
        
        <div className="page-container">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

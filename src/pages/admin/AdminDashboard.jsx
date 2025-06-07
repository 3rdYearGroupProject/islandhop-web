import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import '../Page.css';

const AdminDashboard = ({ onPageChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewProfile = () => {
    if (onPageChange) {
      onPageChange('Profile');
    }
    setIsDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };  return (
    <div className="page">
      <div className="page-content-card">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1>Admin Dashboard</h1>
              <p>System overview and administrative controls</p>
            </div>
            <div className="account-info" onClick={toggleDropdown}>
              <div className="account-details">
                <span className="account-name">Admin User</span>
                <span className="account-role">Administrator</span>
              </div>
              <div className="account-avatar">
                <span>AU</span>
              </div>
              {isDropdownOpen && (
                <div className="account-dropdown">
                  <button className="dropdown-item" onClick={handleViewProfile}>
                    View Profile
                  </button>
                  <button className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    Settings
                  </button>
                  <button className="dropdown-item logout" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="page-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">1,247</p>
            </div>
            <div className="stat-card">
              <h3>Active Drivers</h3>
              <p className="stat-number">89</p>
            </div>
            <div className="stat-card">
              <h3>Active Guides</h3>
              <p className="stat-number">34</p>
            </div>
            <div className="stat-card">
              <h3>System Health</h3>
              <p className="stat-number">99.9%</p>
            </div>
            <div className="stat-card">
              <h3>Revenue (Month)</h3>
              <p className="stat-number">$45,670</p>
            </div>
            <div className="stat-card">
              <h3>Pending Approvals</h3>
              <p className="stat-number">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

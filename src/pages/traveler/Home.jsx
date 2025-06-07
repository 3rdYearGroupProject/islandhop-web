import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import '../Page.css';

const Home = ({ onPageChange }) => {
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
              <h1>Home</h1>
              <p>Welcome to your IslandHop home</p>
            </div>
            <div className="account-info" onClick={toggleDropdown}>
              <div className="account-details">
                <span className="account-name">John Smith</span>
                <span className="account-role">General User</span>
              </div>
              <div className="account-avatar">
                <span>JS</span>
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
              <h3>Total Trips</h3>
              <p className="stat-number">127</p>
            </div>
            <div className="stat-card">
              <h3>Active Drivers</h3>
              <p className="stat-number">24</p>
            </div>
            <div className="stat-card">
              <h3>Revenue Today</h3>
              <p className="stat-number">$1,456</p>
            </div>
            <div className="stat-card">
              <h3>Ride Pools</h3>
              <p className="stat-number">8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

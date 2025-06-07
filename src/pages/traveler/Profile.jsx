import React, { useState } from 'react';
import '../Page.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street, City, State 12345',
    emergencyContact: 'Jane Smith - +1 (555) 987-6543',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      language: 'English',
      currency: 'USD'
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile saved:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any unsaved changes
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  return (
    <div className="page">
      <div className="page-content-card">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1>My Profile</h1>
              <p>Manage your personal information and preferences</p>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="page-content">
        <div className="profile-container">
          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-picture-large">
              <span>{profileData.firstName[0]}{profileData.lastName[0]}</span>
            </div>
            {isEditing && (
              <button className="btn-secondary">Change Photo</button>
            )}
          </div>

          {/* Personal Information */}
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                ) : (
                  <span>{profileData.firstName}</span>
                )}
              </div>
              
              <div className="profile-field">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                ) : (
                  <span>{profileData.lastName}</span>
                )}
              </div>
              
              <div className="profile-field">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <span>{profileData.email}</span>
                )}
              </div>
              
              <div className="profile-field">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <span>{profileData.phone}</span>
                )}
              </div>
              
              <div className="profile-field">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                ) : (
                  <span>{new Date(profileData.dateOfBirth).toLocaleDateString()}</span>
                )}
              </div>
              
              <div className="profile-field full-width">
                <label>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                ) : (
                  <span>{profileData.address}</span>
                )}
              </div>
              
              <div className="profile-field full-width">
                <label>Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  />
                ) : (
                  <span>{profileData.emergencyContact}</span>
                )}
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="profile-section">
            <h2>Preferences</h2>
            <div className="preferences-grid">
              <div className="preference-item">
                <label>Email Notifications</label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    disabled={!isEditing}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="preference-item">
                <label>SMS Notifications</label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.smsNotifications}
                    onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                    disabled={!isEditing}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="preference-item">
                <label>Language</label>
                {isEditing ? (
                  <select
                    value={profileData.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                ) : (
                  <span>{profileData.preferences.language}</span>
                )}
              </div>
              
              <div className="preference-item">
                <label>Currency</label>
                {isEditing ? (
                  <select
                    value={profileData.preferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                ) : (
                  <span>{profileData.preferences.currency}</span>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="profile-section">
            <h2>Security</h2>
            <div className="security-options">
              <button className="btn-secondary">Change Password</button>
              <button className="btn-secondary">Two-Factor Authentication</button>
              <button className="btn-secondary">Login History</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

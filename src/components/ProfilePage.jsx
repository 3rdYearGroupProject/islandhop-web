import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    dateOfBirth: '',
    occupation: '',
    interests: []
  });
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize with Firebase user data and dummy data
    const user = auth.currentUser;
    if (user) {
      const initialProfile = {
        displayName: user.displayName || 'John Doe',
        email: user.email || 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        bio: 'Travel enthusiast who loves exploring new islands and beaches around the world.',
        location: 'San Francisco, CA',
        dateOfBirth: '1990-05-15',
        occupation: 'Software Engineer',
        interests: ['Travel', 'Photography', 'Swimming', 'Hiking', 'Food']
      };
      setProfile(initialProfile);
      setEditedProfile(initialProfile);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      // Update Firebase profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: editedProfile.displayName
        });
      }
      
      // Update local state (in a real app, this would be saved to a database)
      setProfile({ ...editedProfile });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestChange = (index, value) => {
    const newInterests = [...editedProfile.interests];
    newInterests[index] = value;
    setEditedProfile(prev => ({
      ...prev,
      interests: newInterests
    }));
  };

  const addInterest = () => {
    setEditedProfile(prev => ({
      ...prev,
      interests: [...prev.interests, '']
    }));
  };

  const removeInterest = (index) => {
    const newInterests = editedProfile.interests.filter((_, i) => i !== index);
    setEditedProfile(prev => ({
      ...prev,
      interests: newInterests
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={`https://ui-avatars.com/api/?name=${profile.displayName}&size=120&background=4285f4&color=fff`}
            alt="Profile Avatar"
          />
        </div>
        <div className="profile-info">
          <h1>{profile.displayName}</h1>
          <p className="profile-email">{profile.email}</p>
          <p className="profile-location">{profile.location}</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <>
              <button onClick={handleEdit} className="edit-button">
                Edit Profile
              </button>
              <button onClick={handleSignOut} className="logout-button">
                Log Out
              </button>
            </>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-button">
                Save Changes
              </button>
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                />
              ) : (
                <p>{profile.displayName}</p>
              )}
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <p>{profile.email}</p>
              {isEditing && <small>Email cannot be changed here</small>}
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>
            
            <div className="form-group">
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedProfile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              ) : (
                <p>{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
              )}
            </div>
            
            <div className="form-group">
              <label>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              ) : (
                <p>{profile.location}</p>
              )}
            </div>
            
            <div className="form-group">
              <label>Occupation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                />
              ) : (
                <p>{profile.occupation}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>About Me</h3>
          <div className="form-group">
            <label>Bio</label>
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p>{profile.bio}</p>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Interests</h3>
          <div className="interests-container">
            {isEditing ? (
              <div className="interests-edit">
                {editedProfile.interests.map((interest, index) => (
                  <div key={index} className="interest-input">
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => handleInterestChange(index, e.target.value)}
                      placeholder="Enter interest"
                    />
                    <button
                      type="button"
                      onClick={() => removeInterest(index)}
                      className="remove-interest"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button onClick={addInterest} className="add-interest">
                  + Add Interest
                </button>
              </div>
            ) : (
              <div className="interests-display">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

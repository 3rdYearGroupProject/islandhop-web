import React, { useState, useEffect } from 'react';
import logo from '../assets/islandHopIcon.png';
import logoText from '../assets/IslandHop.png';
import api from '../api/axios';
import { getAuth } from 'firebase/auth';
import '../firebase';

// List of countries (shortened for brevity, use a full list in production)
const COUNTRIES = [
  'Sri Lanka', 'India', 'United States', 'United Kingdom', 'Australia', 'Canada', 'France', 'Germany', 'Japan', 'China', 'Singapore', 'Malaysia', 'Italy', 'Spain', 'Russia', 'Brazil', 'South Africa', 'New Zealand', 'Thailand', 'Nepal', 'Maldives', 'Pakistan', 'Bangladesh', 'Indonesia', 'Vietnam', 'Philippines', 'Turkey', 'UAE', 'Saudi Arabia', 'Egypt', 'Argentina', 'Mexico', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Netherlands', 'Belgium', 'Austria', 'Greece', 'Portugal', 'Ireland', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Ukraine', 'Belarus', 'Georgia', 'Armenia', 'Azerbaijan', 'Israel', 'Jordan', 'Lebanon', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Morocco', 'Tunisia', 'Algeria', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia', 'Tanzania', 'Uganda', 'Zimbabwe', 'Zambia', 'Botswana', 'Namibia', 'Mozambique', 'Angola', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Paraguay', 'Uruguay', 'Bolivia', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Trinidad and Tobago', 'Barbados', 'Bahamas', 'Fiji', 'Samoa', 'Tonga', 'Papua New Guinea', 'Other'
];

// List of languages (shortened for brevity, use a full list in production)
const LANGUAGES = [
  'English', 'සිංහල', 'தமிழ்', 'Hindi', 'Mandarin', 'French', 'German', 'Spanish', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Portuguese', 'Italian', 'Dutch', 'Bengali', 'Urdu', 'Malay', 'Thai', 'Vietnamese', 'Filipino', 'Swahili', 'Greek', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Turkish', 'Hebrew', 'Other'
];

const ProfileModal = ({ show, onClose, userProfile, setUserProfile }) => {
  const [profile, setProfile] = useState(userProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: userProfile.firstName || '',
    lastName: userProfile.lastName || '',
    dob: userProfile.dob || '',
    nationality: userProfile.nationality || '',
    email: userProfile.email || '',
    languages: userProfile.languages || [],
    profilePicture: userProfile.profilePicture || '', // base64 or url
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(userProfile.profilePicture || '');
  const [languageInput, setLanguageInput] = useState('');

  // Get logged-in user email from Firebase
  const getFirebaseUserEmail = () => {
    try {
      const auth = getAuth();
      return auth.currentUser?.email || '';
    } catch {
      return '';
    }
  };

  // Fetch latest profile on open
  useEffect(() => {
    if (show) {
      setLoading(true);
      const email = getFirebaseUserEmail();
      if (!email) {
        setError('Not logged in');
        setLoading(false);
        return;
      }
      api.get('/tourist/profile', {
        params: { email }
      })
        .then(res => {
          const profileData = res.data;
          setProfile(profileData);
          
          // Handle profile picture - it's already a base64 string from backend
          const profilePicBase64 = profileData.profilePic ? 
            byteArrayToBase64(profileData.profilePic) : '';
          
          setForm({
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            dob: profileData.dob || '',
            nationality: profileData.nationality || '',
            email: profileData.email || '',
            languages: profileData.languages || [],
            profilePicture: profilePicBase64,
          });
          setImagePreview(profilePicBase64);
          console.log('Profile loaded with image:', profilePicBase64 ? 'Yes' : 'No');
        })
        .catch((err) => {
          console.error('Profile fetch error:', err);
          setError('Failed to load profile');
        })
        .finally(() => setLoading(false));
    }
  }, [show, userProfile.email]);

  // Handle form changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Handle nationality dropdown
  const handleNationalityChange = e => {
    setForm(f => ({ ...f, nationality: e.target.value }));
  };

  // Handle language dropdown add
  const handleAddLanguage = e => {
    const lang = e.target.value;
    if (lang && !form.languages.includes(lang)) {
      setForm(f => ({ ...f, languages: [...f.languages, lang] }));
    }
    setLanguageInput('');
  };

  // Remove a language
  const handleRemoveLanguage = lang => {
    setForm(f => ({ ...f, languages: f.languages.filter(l => l !== lang) }));
  };

  // Handle image upload
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, profilePicture: reader.result })); // base64 string
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert base64 image to byte array (for backend List<Integer> handling)
  const base64ToByteArray = (base64) => {
    if (!base64) return null;
    // Remove data URL prefix if present
    const base64String = base64.split(',')[1] || base64;
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = [];
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes; // Return as regular array for JSON
  };

  // Convert byte array back to base64 for display
  const byteArrayToBase64 = (byteArray) => {
    if (!byteArray) return '';
    // If it's already a base64 string, return it with data URL prefix
    if (typeof byteArray === 'string') {
      return byteArray.startsWith('data:') ? byteArray : `data:image/jpeg;base64,${byteArray}`;
    }
    // If it's an array, convert to base64
    if (Array.isArray(byteArray)) {
      const binaryString = String.fromCharCode(...byteArray);
      return `data:image/jpeg;base64,${btoa(binaryString)}`;
    }
    return '';
  };

  // Save profile
  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    const email = getFirebaseUserEmail();
    if (!email) {
      setError('Not logged in');
      setLoading(false);
      return;
    }
    try {
      const imageByteArray = base64ToByteArray(form.profilePicture);
      const res = await api.put('/tourist/profile', {
        firstName: form.firstName,
        lastName: form.lastName,
        dob: form.dob,
        nationality: form.nationality,
        languages: form.languages,
        email, // Always send Firebase email for backend auth
        profilePicture: imageByteArray, // Send as byte array for bytea column
      });
      setProfile(res.data);
      setUserProfile && setUserProfile(res.data);
      setEditing(false);
      setSuccess('Profile updated!');
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="mt-12 sm:mt-20 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative animate-navbar-dropdown">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transition-colors z-10" onClick={onClose} aria-label="Close profile">&times;</button>
        
        {/* Header - Logo only without blue banner */}
        <div className="flex items-center justify-center py-6 px-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <img src={logo} alt="IslandHop Icon" className="h-8 w-8" />
            <img src={logoText} alt="IslandHop" className="h-6" />
          </div>
        </div>
        <div className="p-8 pt-4">
          {loading && <div className="text-center text-gray-500 mb-2">Loading...</div>}
          {error && <div className="text-center text-red-500 mb-2">{error}</div>}
          {success && <div className="text-center text-green-600 mb-2">{success}</div>}
          {/* Profile Image */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative w-32 h-32 mb-2">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-primary-500 shadow-lg" />
              ) : (
                <div className="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center shadow-lg border-4 border-primary-500">
                  <span className="text-white text-5xl font-bold">{profile.firstName?.[0] || profile.lastName?.[0] || 'U'}</span>
                </div>
              )}
              {editing && (
                <label className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-primary-500 flex items-center justify-center text-primary-600 hover:text-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm mb-1">{profile.email}</div>
          </div>
          {/* Section: Personal Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-400 uppercase mb-1">First Name</label>
                {editing ? (
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-300 dark:bg-gray-800 dark:text-white"
                    placeholder="First Name"
                  />
                ) : (
                  <div className="font-semibold text-gray-700 dark:text-white text-base">{profile.firstName}</div>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase mb-1">Last Name</label>
                {editing ? (
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-300 dark:bg-gray-800 dark:text-white"
                    placeholder="Last Name"
                  />
                ) : (
                  <div className="font-semibold text-gray-700 dark:text-white text-base">{profile.lastName}</div>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase mb-1">Date of Birth</label>
                {editing ? (
                  <input
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-300 dark:bg-gray-800 dark:text-white"
                    placeholder="Date of Birth"
                  />
                ) : (
                  <div className="font-semibold text-gray-700 dark:text-white text-base">{profile.dob}</div>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase mb-1">Nationality</label>
                {editing ? (
                  <select
                    name="nationality"
                    value={form.nationality}
                    onChange={handleNationalityChange}
                    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-300 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select country...</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                ) : (
                  <div className="font-semibold text-gray-700 dark:text-white text-base">{profile.nationality}</div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 uppercase mb-1">Email</label>
                <div className="font-semibold text-gray-700 dark:text-white text-base">{profile.email}</div>
              </div>
            </div>
          </div>
          {/* Section: Languages */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-4">Spoken Languages</h3>
            {editing ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.languages.map(lang => (
                    <span key={lang} className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                      {lang}
                      <button type="button" className="ml-2 text-blue-600 hover:text-red-600 dark:text-blue-300 dark:hover:text-red-400" onClick={() => handleRemoveLanguage(lang)} title="Remove">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  value={languageInput}
                  onChange={e => { setLanguageInput(e.target.value); handleAddLanguage(e); }}
                  className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-300 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Add language...</option>
                  {LANGUAGES.filter(l => !form.languages.includes(l)).map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(profile.languages || []).map(lang => (
                  <span key={lang} className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mt-8 gap-2">
            {editing ? (
              <>
                <button
                  className="px-5 py-2 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
                  onClick={handleSave}
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  onClick={() => { 
                    setEditing(false); 
                    // Reset form to current profile data
                    const profilePicBase64 = profile.profilePic ? 
                      byteArrayToBase64(profile.profilePic) : '';
                    setForm({
                      firstName: profile.firstName || '',
                      lastName: profile.lastName || '',
                      dob: profile.dob || '',
                      nationality: profile.nationality || '',
                      email: profile.email || '',
                      languages: profile.languages || [],
                      profilePicture: profilePicBase64,
                    }); 
                    setImagePreview(profilePicBase64); 
                    setError(''); 
                    setSuccess(''); 
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="px-5 py-2 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

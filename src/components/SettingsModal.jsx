import React, { useState } from 'react';
import { getAuth, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import api from '../api/axios';
import '../firebase';

// All available currencies
const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
  'MXN', 'SGD', 'HKD', 'NOK', 'ZAR', 'THB', 'BRL', 'INR', 'RUB', 'KRW',
  'PLN', 'TRY', 'AED', 'SAR', 'EGP', 'LKR', 'PKR', 'BDT', 'NPR', 'MVR',
  'IDR', 'MYR', 'PHP', 'VND', 'KHR', 'LAK', 'MMK', 'CZK', 'HUF', 'RON',
  'BGN', 'HRK', 'DKK', 'ISK', 'ALL', 'RSD', 'BAM', 'MKD', 'MDL', 'UAH',
  'BYN', 'GEL', 'AMD', 'AZN', 'KZT', 'UZS', 'KGS', 'TJS', 'TMT', 'AFN',
  'IRR', 'IQD', 'JOD', 'KWD', 'LBP', 'OMR', 'QAR', 'SYP', 'YER', 'BHD',
  'ILS', 'CLP', 'COP', 'PEN', 'ARS', 'BOB', 'PYG', 'UYU', 'VES', 'GYD',
  'SRD', 'FKP', 'CRC', 'NIO', 'PAB', 'GTQ', 'HNL', 'SVC', 'BZD', 'JMD',
  'HTG', 'DOP', 'CUP', 'BBD', 'XCD', 'TTD', 'AWG', 'ANG', 'SZL', 'LSL',
  'BWP', 'NAD', 'ZWL', 'ZMW', 'UGX', 'TZS', 'SOS', 'SCR', 'RWF', 'MZN',
  'MWK', 'MGF', 'KMF', 'DJF', 'ETB', 'ERN', 'SDP', 'LYD', 'TND', 'DZD',
  'MAD', 'GHS', 'NGN', 'XOF', 'XAF', 'GMD', 'GNF', 'LRD', 'SLL', 'CVE',
  'STD', 'AOA', 'CDF', 'BIF', 'KES', 'UGX', 'XPF', 'TOP', 'WST', 'VUV',
  'SBD', 'PGK', 'FJD', 'NCF', 'AUD', 'NZD'
];

const SettingsModal = ({ show, onClose, currentCurrency, setCurrentCurrency, currentUnits, setCurrentUnits }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get Firebase user email
  const getFirebaseUserEmail = () => {
    try {
      const auth = getAuth();
      return auth.currentUser?.email || '';
    } catch {
      return '';
    }
  };

  // Save settings to backend
  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    const email = getFirebaseUserEmail();
    console.log("Email:" + email);
    if (!email) {
      setError('Not logged in');
      setLoading(false);
      return;
    }

    try {
      await api.put('/tourist/settings', {
        email,
        currency: currentCurrency,
        units: currentUnits
      });
      setSuccess('Settings saved successfully!');
    } catch (err) {
      console.error('Settings save error:', err);
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        // Reauthenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
        setSuccess('Password updated successfully!');
        setShowPasswordModal(false);
        setNewPassword('');
        setCurrentPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError('Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  // Deactivate/Delete account
  const handleDeactivateAccount = async () => {
    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        // Reauthenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Delete user account
        await deleteUser(user);
        setSuccess('Account deleted successfully!');
        onClose();
      }
    } catch (err) {
      console.error('Account deletion error:', err);
      setError('Failed to delete account. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings from backend on open
  React.useEffect(() => {
    if (show) {
      const email = getFirebaseUserEmail();
      if (!email) return;
      setLoading(true);
      api.get('/tourist/settings', { params: { email } })
        .then(res => {
          if (res.data) {
            setCurrentCurrency(res.data.currency || 'USD');
            setCurrentUnits(res.data.units || 'Imperial');
          }
        })
        .catch(err => {
          console.error('Settings fetch error:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [show]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="mt-12 sm:mt-20 bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 relative animate-navbar-dropdown">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl transition-colors z-10" onClick={onClose} aria-label="Close settings">&times;</button>
        {/* Settings Header */}
        <div className="bg-white h-20 w-full flex items-center justify-center px-6 border-b border-gray-100">
          <div className="text-2xl font-bold text-gray-800 tracking-tight">Settings</div>
        </div>
        {/* Settings Body */}
        <div className="p-6">
          {loading && <div className="text-center text-blue-500 mb-2">Loading...</div>}
          {error && <div className="text-center text-red-500 mb-2">{error}</div>}
          {success && <div className="text-center text-green-600 mb-2">{success}</div>}
          
          {/* Settings Options */}
          <div className="space-y-4">
            {/* Change Password */}
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">Change Password</div>
                  <div className="text-xs text-gray-500">Update your account password</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Change Currency */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800">Currency</div>
                  <div className="text-xs text-gray-500">Select your preferred currency</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {CURRENCIES.map((currency) => (
                  <button
                    key={currency}
                    onClick={() => setCurrentCurrency(currency)}
                    className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                      currentCurrency === currency 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            {/* Change Units */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800">Units</div>
                  <div className="text-xs text-gray-500">Choose measurement system</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Imperial', 'Metric'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setCurrentUnits(unit)}
                    className={`p-2 rounded-full text-sm font-medium transition-colors ${
                      currentUnits === unit 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Settings Button */}
            <button 
              onClick={handleSaveSettings}
              disabled={loading}
              className="w-full p-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-xl transition-colors font-semibold"
            >
              Save Settings
            </button>

            {/* Deactivate Account */}
            <button 
              onClick={() => setShowDeactivateModal(true)}
              className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 border-2 border-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-red-700">Delete Account</div>
                  <div className="text-xs text-red-500">Permanently disable your account</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 p-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg font-semibold"
              >
                Change Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Deactivation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Account</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. Your account and all data will be permanently deleted.
            </p>
            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeactivateAccount}
                disabled={loading}
                className="flex-1 p-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg font-semibold"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModal;

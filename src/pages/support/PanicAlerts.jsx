import React, { useState, useEffect } from "react";
import {
  ShieldExclamationIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Base URL for Lost Items API
const LOST_ITEMS_API_BASE_URL = process.env.REACT_APP_API_BASE_URL_LOST_ITEMS || 'http://localhost:8062';

const PanicAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    skip: 0,
    hasMore: false
  });
  
  // Demo alert for UI display (can be removed once real data is working)
  const [alert] = useState({
    id: "ALERT-20250622-001",
    time: "2025-06-22 14:37",
    location: "Colombo Fort Railway Station",
    lat: 6.9344,
    lng: 79.8428,
    user: {
      name: "Ayesha Fernando",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      phone: "+94 77 123 4567",
      email: "ayesha.fernando@email.com",
      role: "Tourist",
    },
    status: "Active",
  });
  
  const [resolution, setResolution] = useState("");
  const [handled, setHandled] = useState(false);

  // Fetch panic alerts from the backend
  useEffect(() => {
    const fetchPanicAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching panic alerts...');
        
        // Build query parameters
        const queryParams = new URLSearchParams({
          status: 'active',
          limit: pagination.limit.toString(),
          skip: pagination.skip.toString()
        });
        
        const url = `${LOST_ITEMS_API_BASE_URL}/panic-alerts/`;
        console.log(`📤 API Request: GET ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          //credentials: 'include', 
        });

        console.log(`📥 API Response: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📥 Response data:', data);

        if (data.success) {
          setAlerts(data.data);
          setPagination(data.pagination);
          console.log('✅ Panic alerts fetched successfully:', data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch panic alerts');
        }
      } catch (err) {
        console.error('❌ Error fetching panic alerts:', err);
        setError(err.message || 'Failed to fetch panic alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchPanicAlerts();
  }, [pagination.limit, pagination.skip]); // Re-fetch when pagination changes

  // Function to refresh alerts
  // const refreshAlerts = async () => {
  //   try {
  //     setError(null);
  //     console.log('🔄 Refreshing panic alerts...');
      
  //     // Build query parameters
  //     const queryParams = new URLSearchParams({
  //       status: 'active',
  //       limit: pagination.limit.toString(),
  //       skip: pagination.skip.toString()
  //     });
      
  //     const url = `${LOST_ITEMS_API_BASE_URL}/panic-alerts?${queryParams}`;
  //     console.log(`📤 API Request: GET ${url}`);
      
  //     const response = await fetch(url, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //     });

  //     console.log(`📥 API Response: ${response.status} ${response.statusText}`);

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     if (data.success) {
  //       setAlerts(data.data);
  //       setPagination(data.pagination);
  //       console.log('✅ Panic alerts refreshed successfully');
  //     } else {
  //       throw new Error(data.message || 'Failed to refresh panic alerts');
  //     }
  //   } catch (err) {
  //     console.error('❌ Error refreshing panic alerts:', err);
  //     setError(err.message || 'Failed to refresh panic alerts');
  //   }
  // };

  const handleContact = (type, userData = alert.user) => {
    const phone = userData?.phone || userData?.phoneNumber;
    const email = userData?.email;
    
    if (type === "phone" && phone) {
      window.location.href = `tel:${phone}`;
    } else if (type === "email" && email) {
      window.location.href = `mailto:${email}`;
    } else {
      console.warn(`No ${type} information available for contact`);
    }
  };

  const handleMarkHandled = async (alertId) => {
    try {
      console.log('🔄 Marking alert as handled:', alertId);
      
      // Make API call to mark alert as resolved
      const url = `${LOST_ITEMS_API_BASE_URL}/panic-alerts/${alertId}/status`;
      console.log(`📤 API Request: PUT ${url}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'resolved',
          notes: 'Alert marked as handled by support agent'
        })
      });

      console.log(`📥 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to mark alert as handled');
      }
      
      console.log('✅ Alert marked as handled successfully');
      setHandled(true);
      alert("Panic alert has been marked as handled!");
      
      // Refresh the alerts list
      // await refreshAlerts();
    } catch (err) {
      console.error('❌ Error marking alert as handled:', err);
      alert('Failed to mark alert as handled. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panic Alerts
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Handle emergency panic button alerts from users
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading panic alerts...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-danger-600 dark:text-danger-400" />
            <div>
              <h3 className="text-sm font-medium text-danger-800 dark:text-danger-300">
                Error Loading Panic Alerts
              </h3>
              <p className="text-sm text-danger-700 dark:text-danger-400 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Summary */}
      {!loading && !error && (
        <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldExclamationIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Active Panic Alerts
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pagination.total} total alerts found
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {alerts.length} of {pagination.total}
              </p>
            </div>
          </div>
        </div>
      )}

      {handled && (
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <ShieldExclamationIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
            <div>
              <h3 className="text-sm font-medium text-success-800 dark:text-success-300">
                Panic Alert Resolved
              </h3>
              <p className="text-sm text-success-700 dark:text-success-400 mt-1">
                The panic alert has been successfully handled and resolved.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Display fetched alerts or demo alert */}
        {!loading && !error && (
          <div className="space-y-6">
            {alerts.length > 0 ? (
              // Render fetched alerts
              alerts.map((alertItem) => (
                <AlertCard 
                  key={alertItem._id || alertItem.id} 
                  alert={alertItem} 
                  onContact={handleContact}
                  onMarkHandled={handleMarkHandled}
                />
              ))
            ) : (
              // Render demo alert when no real alerts are available
              <AlertCard 
                alert={alert} 
                onContact={handleContact}
                onMarkHandled={handleMarkHandled}
              />
            )}
            
            {/* Refresh Button */}
            {/* <div className="flex justify-center mt-6">
              <button
                onClick={refreshAlerts}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Refresh Alerts
              </button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

// Extract AlertCard as a separate component for better organization
const AlertCard = ({ alert, onContact, onMarkHandled }) => {
  const [handled, setHandled] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get user data with fallbacks for different data structures
  const userData = alert.touristDetails || alert.userDetails || alert.user || {};
  const userName = userData.first_name && userData.last_name 
    ? `${userData.first_name} ${userData.last_name}` 
    : userData.name || userData.fullName || alert.userName || 'Unknown User';
  const userPhone = userData.phone || userData.phoneNumber || alert.userPhone || 'No phone';
  const userEmail = userData.email || alert.userEmail || 'No email';
  const userAvatar = userData.avatar || userData.profilePicture || "https://randomuser.me/api/portraits/women/68.jpg";
  const userRole = userData.role || 'Tourist';
  const userNationality = userData.nationality || 'Unknown';

  // Helper function to safely render string values
  const safeRender = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return fallback;
    return String(value);
  };

  const handleMarkAsHandled = async () => {
    try {
      setIsMarking(true);
      await onMarkHandled(alert._id || alert.id);
      setHandled(true);
    } catch (error) {
      // Error is already handled in the parent function
      console.error('Error in AlertCard handleMarkAsHandled:', error);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Card */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 ${
                handled || alert.status === 'resolved'
                  ? "text-success-600 dark:text-success-400"
                  : "text-danger-600 dark:text-danger-400"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  handled || alert.status === 'resolved' 
                    ? "bg-success-500" 
                    : "bg-danger-500 animate-pulse"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {handled || alert.status === 'resolved' ? "Resolved" : "Active"}
              </span>
            </div>
          </div>
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              handled || alert.status === 'resolved'
                ? "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300"
                : alert.priority === 'high'
                ? "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300"
                : "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300"
            }`}
          >
            {handled || alert.status === 'resolved' ? "Resolved" : 
             alert.priority === 'high' ? "High Priority" : 
             alert.priority ? alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1) : "Emergency"}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <ShieldExclamationIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Panic Alert - {safeRender(alert.id || alert._id, 'Unknown ID')}
            </h2>
          </div>

          {/* {alert.message && (
            <div className="bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-800 rounded-lg p-3">
              <p className="text-sm text-danger-800 dark:text-danger-300">
                <strong>Message:</strong> {safeRender(alert.message, 'No message')}
              </p>
            </div>
          )} */}

          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <ClockIcon className="h-4 w-4" />
            <span>Alert Time: {formatTimestamp(alert.alertTimestamp || alert.time)}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-primary-600 dark:text-primary-400">
            <MapPinIcon className="h-4 w-4" />
            <span className="font-medium">
              {alert.location?.address || 
               (alert.location?.latitude && alert.location?.longitude 
                 ? `${alert.location.latitude}, ${alert.location.longitude}` 
                 : typeof alert.location === 'string' 
                   ? alert.location 
                   : 'Unknown location')}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg border border-gray-200 dark:border-secondary-600">
          <div className="flex items-center space-x-4">
            <img
              src={userAvatar}
              alt={userName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {safeRender(userName, 'Unknown User')}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({safeRender(userRole, 'Tourist')})
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                📧 {safeRender(userEmail, 'No email')}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                📞 {safeRender(userPhone, 'No phone')}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                🌍 {safeRender(userNationality, 'Unknown nationality')}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => onContact("phone", userData)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 transition-colors duration-200"
              >
                <PhoneIcon className="h-3 w-3 mr-1" />
                Emergency Call
              </button>
              <button
                onClick={() => onContact("email", userData)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info-500 transition-colors duration-200"
              >
                <EnvelopeIcon className="h-3 w-3 mr-1" />
                Email
              </button>
            </div>
          </div>
        </div>

        {/* Mark as Handled Button */}
        {!handled && alert.status !== 'resolved' && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleMarkAsHandled}
              disabled={isMarking}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-colors duration-200 ${
                isMarking
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500'
              }`}
            >
              {isMarking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Marking as Handled...
                </>
              ) : (
                'Mark as Handled'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Removed separate resolution section - now integrated above */}
    </div>
  );
};

export default PanicAlerts;

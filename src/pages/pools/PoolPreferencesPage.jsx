import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mountain, Waves, Camera, MapPin, Utensils, Music, Gamepad2, Book, Building, ChevronLeft, Trees, Camera as CameraIcon } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PoolProgressBar from '../../components/PoolProgressBar';
import { getUserUID, getUserData } from '../../utils/userStorage';

const PoolPreferencesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { poolName, selectedDates, poolSize, poolPrivacy, poolId, pool, userUid } = location.state || {};

  console.log('📍 PoolPreferencesPage received:', { poolName, selectedDates, poolSize, poolPrivacy, poolId, userUid });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTerrainPreferences, setSelectedTerrainPreferences] = useState([]);
  const [selectedActivityPreferences, setSelectedActivityPreferences] = useState([]);
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCheckingGroups, setIsCheckingGroups] = useState(false);
  const [compatibleGroups, setCompatibleGroups] = useState([]);
  const [showCompatibleGroups, setShowCompatibleGroups] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [joiningGroupId, setJoiningGroupId] = useState(null);

  const terrainPreferences = [
    { id: 'beaches', name: 'Beach', icon: Waves, color: '#007bff' },
    { id: 'mountains', name: 'Mountain', icon: Mountain, color: '#28a745' },
    { id: 'forests', name: 'Forest', icon: Trees, color: '#20c997' },
    { id: 'historical', name: 'Historical', icon: Book, color: '#6f42c1' },
    { id: 'city', name: 'City', icon: Building, color: '#fd7e14' },
    { id: 'parks', name: 'National Park', icon: MapPin, color: '#198754' },
    { id: 'islands', name: 'Island', icon: Waves, color: '#0dcaf0' },
    { id: 'wetland', name: 'Wetland', icon: CameraIcon, color: '#6c757d' },
    { id: 'countryside', name: 'Countryside', icon: MapPin, color: '#ffc107' }
  ];

  const activityPreferences = [
    { id: 'surfing', name: 'Surfing', icon: Waves, color: '#007bff' },
    { id: 'hiking', name: 'Hiking', icon: Mountain, color: '#28a745' },
    { id: 'photography', name: 'Photography', icon: Camera, color: '#6f42c1' },
    { id: 'sightseeing', name: 'Sightseeing', icon: MapPin, color: '#fd7e14' },
    { id: 'dining', name: 'Fine Dining', icon: Utensils, color: '#dc3545' },
    { id: 'nightlife', name: 'Nightlife', icon: Music, color: '#e83e8c' },
    { id: 'snorkeling', name: 'Snorkeling', icon: Waves, color: '#0dcaf0' },
    { id: 'adventure', name: 'Adventure Sports', icon: Gamepad2, color: '#ff6b35' },
    { id: 'culture', name: 'Cultural Tours', icon: Book, color: '#6f42c1' },
    { id: 'wildlife', name: 'Wildlife Safari', icon: Camera, color: '#198754' },
    { id: 'wellness', name: 'Spa & Wellness', icon: Mountain, color: '#20c997' },
    { id: 'shopping', name: 'Shopping', icon: Building, color: '#ffc107' }
  ];

  // API function to pre-check compatible groups for public pooling
  const preCheckCompatibleGroups = async () => {
    console.log('🔍 PRE-CHECK COMPATIBLE GROUPS START');
    
    try {
      setIsCheckingGroups(true);
      
      // Get user ID from session
      const userId = getUserUID();
      if (!userId) {
        alert('Please log in to check compatible groups');
        navigate('/login');
        return;
      }

      const currentUser = getUserData();
      if (!currentUser || !currentUser.email) {
        alert('User data not found. Please log in again.');
        return;
      }
      
      // Prepare dates in YYYY-MM-DD format
      const startDate = selectedDates && selectedDates[0] ? 
        selectedDates[0].toISOString().split('T')[0] : null;
      const endDate = selectedDates && selectedDates.length > 1 && selectedDates[1] ? 
        selectedDates[1].toISOString().split('T')[0] : startDate;
      
      if (!startDate || !endDate) {
        alert('Please select valid travel dates');
        return;
      }
      
      // Prepare request data according to the API schema
      const requestData = {
        userId: userId,
        userEmail: currentUser.email, // From Firebase user data
        baseCity: "Colombo", // Always hardcoded as requested
        startDate: startDate,
        endDate: endDate,
        budgetLevel: "Medium", // Default value
        preferredActivities: selectedActivityPreferences,
        preferredTerrains: selectedTerrainPreferences,
        activityPacing: "Normal", // Default value
        visibility: poolPrivacy, // Use privacy setting from modal
        multiCityAllowed: true // Default value
      };
      
      console.log('📦 Pre-check API Request data:', requestData);
      
      // Make API call to pre-check compatible groups
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086'}/api/v1/public-pooling/pre-check`;
      
      console.log('📡 Making POST request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });
      
      console.log('📨 Pre-check API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Pre-check API Error response:', errorData);
        
        if (response.status === 400) {
          alert(`Invalid request: ${errorData.message || 'Please check your preferences'}`);
        } else if (response.status === 500) {
          alert(`Server error: ${errorData.message || 'Please try again later'}`);
        } else {
          alert(`Failed to check groups: ${errorData.message || 'Unknown error'}`);
        }
        return;
      }
      
      const result = await response.json();
      console.log('✅ Pre-check API Success response:', result);
      
      // Handle successful response
      if (result.status === 'success') {
        const groups = result.compatibleGroups || [];
        setCompatibleGroups(groups);
        setShowCompatibleGroups(true);
        
        if (groups.length === 0) {
          console.log('🔍 No compatible groups found - showing create group option');
        } else {
          console.log(`🎉 Found ${groups.length} compatible groups`);
        }
      } else {
        console.error('❌ Unexpected pre-check response format:', result);
        alert(`Failed to check groups: ${result.message || 'Unexpected response format'}`);
      }
      
    } catch (error) {
      console.error('❌ PRE-CHECK COMPATIBLE GROUPS FAILED');
      console.error('❌ Error:', error);
      
      // Network or other errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Network error: Please check your internet connection and try again');
      } else {
        alert(`Failed to check groups: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsCheckingGroups(false);
    }
  };

  // API function to request to join a public group
  const requestToJoinGroup = async (groupId, groupName) => {
    console.log('🤝 REQUEST TO JOIN GROUP START');
    console.log('📦 Join request:', { groupId, groupName });
    
    try {
      setIsJoiningGroup(true);
      setJoiningGroupId(groupId);
      
      // Get user ID from session
      const userId = getUserUID();
      if (!userId) {
        alert('Please log in to join a group');
        navigate('/login');
        return;
      }
      
      // Get user information (in a real app, this would come from user profile)
      const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
      const userName = localStorage.getItem('userName') || 'Anonymous User';
      
      // Create a personalized message based on user preferences
      const activityText = selectedActivityPreferences.length > 0 
        ? selectedActivityPreferences.slice(0, 3).join(', ')
        : 'various activities';
      const terrainText = selectedTerrainPreferences.length > 0
        ? selectedTerrainPreferences.slice(0, 2).join(' and ')
        : 'different terrains';
      
      // Prepare request data according to the API schema
      const requestData = {
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        message: `Hi! I would love to join your "${groupName}" trip! I'm particularly interested in ${activityText} and would enjoy exploring ${terrainText} areas. I think we have similar travel preferences and I'd be excited to plan this adventure together!`,
        userProfile: {
          age: 25, // Default value - in real app would come from user profile
          interests: selectedActivityPreferences,
          experience: "intermediate" // Default value
        }
      };
      
      console.log('📦 Join API Request data:', requestData);
      
      // Make API call to request to join group
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086'}/api/v1/groups/${groupId}/join`;
      
      console.log('📡 Making POST request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });
      
      console.log('📨 Join API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Join API Error response:', errorData);
        
        if (response.status === 400) {
          alert(`Invalid request: ${errorData.message || 'Unable to process join request'}`);
        } else if (response.status === 409) {
          alert(`Already a member: ${errorData.message || 'You are already a member of this group'}`);
        } else if (response.status === 404) {
          alert(`Group not found: ${errorData.message || 'This group may no longer exist'}`);
        } else if (response.status === 500) {
          alert(`Server error: ${errorData.message || 'Please try again later'}`);
        } else {
          alert(`Failed to join group: ${errorData.message || 'Unknown error'}`);
        }
        return;
      }
      
      const result = await response.json();
      console.log('✅ Join API Success response:', result);
      
      // Handle successful response
      if (result.status === 'pending') {
        const successMessage = `🎉 Join request submitted successfully!\n\n` +
          `Your request to join "${groupName}" has been sent to all group members. ` +
          `They will review your profile and message before approving your request.\n\n` +
          `✉️ Your personalized message has been shared with the group.\n` +
          `📋 Your travel preferences (${selectedActivityPreferences.slice(0, 2).join(', ')}) have been included.\n\n` +
          `You'll receive a notification once all members respond to your request.`;
        
        alert(successMessage);
        
        // Optionally update the UI to show request sent
        setCompatibleGroups(prev => 
          prev.map(group => 
            group.groupId === groupId 
              ? { ...group, requestSent: true, requestStatus: 'pending' }
              : group
          )
        );
      } else if (result.status === 'approved') {
        alert(`🎉 Welcome to the group!\n\nYou've been automatically approved to join "${groupName}". You can now start planning your trip together!`);
        
        // Navigate to the group's trip planning page
        if (result.tripId) {
          navigate(`/pool-itinerary`, {
            state: {
              tripId: result.tripId,
              groupId: groupId,
              tripName: groupName,
              poolName: groupName,
              selectedDates: selectedDates,
              userUid: userUid,
              selectedTerrains: selectedTerrainPreferences,
              selectedActivities: selectedActivityPreferences
            }
          });
        }
      } else {
        console.error('❌ Unexpected join response format:', result);
        alert(`Request processed but status unclear: ${result.message || 'Please check your group memberships'}`);
      }
      
    } catch (error) {
      console.error('❌ REQUEST TO JOIN GROUP FAILED');
      console.error('❌ Error:', error);
      
      // Network or other errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Network error: Please check your internet connection and try again');
      } else {
        alert(`Failed to join group: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsJoiningGroup(false);
      setJoiningGroupId(null);
    }
  };

  // API function to create group with trip planning
  const createGroupWithTrip = async () => {
    console.log('🌟 CREATE GROUP WITH TRIP START');
    
    try {
      setIsCreatingGroup(true);
      
      // Get user ID from session
      const userId = getUserUID();
      if (!userId) {
        alert('Please log in to create a pool');
        navigate('/login');
        return;
      }
      
      // Prepare dates in YYYY-MM-DD format
      const startDate = selectedDates && selectedDates[0] ? 
        selectedDates[0].toISOString().split('T')[0] : null;
      const endDate = selectedDates && selectedDates.length > 1 && selectedDates[1] ? 
        selectedDates[1].toISOString().split('T')[0] : startDate;
      
      if (!startDate || !endDate) {
        alert('Please select valid travel dates');
        return;
      }
      
      if (!poolName) {
        alert('Please provide a trip name');
        return;
      }
      
      // Prepare request data according to CreateGroupWithTripRequest schema
      const requestData = {
        // Required fields
        userId: userId,
        tripName: poolName, // Trip name from the modal
        startDate: startDate,
        endDate: endDate,
        baseCity: "Colombo", // Always hardcoded as requested
        groupName: poolName || 'My Pool', // Use pool name from state or default

        
        // Optional fields with defaults
        multiCityAllowed: true,
        activityPacing: "Normal",
        budgetLevel: "Medium",
        preferredTerrains: selectedTerrainPreferences,
        preferredActivities: selectedActivityPreferences,
        visibility: poolPrivacy, // Use privacy setting from modal
        maxMembers: poolSize || 6,
        requiresApproval: false,
        additionalPreferences: {}
      };
      
      console.log('📦 API Request data:', requestData);
      
      // Make API call to create group with trip
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086'}/api/v1/groups/with-trip`;
      
      console.log('📡 Making POST request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });
      
      console.log('📨 API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ API Error response:', errorData);
        
        if (response.status === 400) {
          alert(`Invalid request: ${errorData.message || 'Please check your input data'}`);
        } else if (response.status === 500) {
          alert(`Server error: ${errorData.message || 'Please try again later'}`);
        } else {
          alert(`Failed to create group: ${errorData.message || 'Unknown error'}`);
        }
        return;
      }
      
      const result = await response.json();
      console.log('✅ API Success response:', result);
      
      // Check response status and handle success
      if (result.status === 'success' && result.groupId && result.tripId) {
        console.log('🎉 Group created successfully:', {
          groupId: result.groupId,
          tripId: result.tripId,
          isDraft: result.isDraft
        });
        
        // Show success notification
        alert(`Group created successfully! You can now plan your trip.`);
        
        // Redirect to pool itinerary page
        navigate('/pool-itinerary', {
          state: {
            tripId: result.tripId,
            groupId: result.groupId,
            tripName: poolName,
            poolName: poolName,
            startDate,
            endDate,
            selectedTerrains: selectedTerrainPreferences,
            selectedActivities: selectedActivityPreferences,
            userUid: userId,
            isDraft: result.isDraft
          }
        });
      } else {
        console.error('❌ Unexpected API response format:', result);
        alert(`Failed to create group: ${result.message || 'Unexpected response format'}`);
      }
      
    } catch (error) {
      console.error('❌ CREATE GROUP WITH TRIP FAILED');
      console.error('❌ Error:', error);
      
      // Network or other errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Network error: Please check your internet connection and try again');
      } else {
        alert(`Failed to create group: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleTerrainToggle = (preferenceId) => {
    setSelectedTerrainPreferences(prev => 
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const handleActivityToggle = (preferenceId) => {
    setSelectedActivityPreferences(prev => 
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedTerrainPreferences.length > 0;
    if (currentStep === 2) return selectedActivityPreferences.length > 0;
    return false;
  };

  const handleNext = async () => {
    if (canProceed()) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        // Both preferences are filled
        if (poolPrivacy === 'private') {
          // For private pools, go directly to pool itinerary page
          navigate('/pool-itinerary', {
            state: {
              poolName,
              selectedDates,
              poolSize,
              poolPrivacy,
              selectedTerrains: selectedTerrainPreferences,
              selectedActivities: selectedActivityPreferences,
              poolId,
              pool,
              userUid
            }
          });
        } else {
          // For public pools, create group with trip planning via API
          await createGroupWithTrip();
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/pool-duration', {
        state: {
          poolName,
          poolPrivacy, // Pass privacy setting
          userUid
        }
      });
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <Navbar />
      <PoolProgressBar poolName={poolName} onBack={handleBack} currentStep={3} completedSteps={[1, 2]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card - Terrain or Activity Preferences */}
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col ${currentStep === 1 ? 'mx-auto lg:col-span-2 max-w-4xl p-8' : currentStep === 2 ? 'mx-auto lg:col-span-2 max-w-5xl p-8' : 'p-6'}`}> 
            {currentStep === 1 && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    What terrains do you prefer?
                  </h2>
                  <p className="text-gray-600">
                    Select the types of landscapes you'd like to visit in Sri Lanka
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {terrainPreferences.map(preference => {
                    const IconComponent = preference.icon;
                    const isSelected = selectedTerrainPreferences.includes(preference.id);
                    return (
                      <button
                        key={preference.id}
                        onClick={() => handleTerrainToggle(preference.id)}
                        className={`relative p-8 rounded-2xl border-2 text-center transition-all duration-200 group hover:scale-105 ${
                          isSelected
                            ? 'border-primary-600 bg-primary-600 text-white shadow-lg'
                            : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-24 h-24 rounded-full mx-auto mb-4 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-white bg-opacity-20' 
                            : 'bg-gray-100 group-hover:bg-primary-50'
                        }`}>
                          <IconComponent 
                            size={48} 
                            className={`transition-colors duration-200 ${
                              isSelected ? 'text-white' : 'text-primary-600'
                            }`}
                          />
                        </div>
                        <span className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {preference.name}
                        </span>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-white rounded-full p-1">
                              <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    What activities interest you?
                  </h2>
                  <p className="text-gray-600">
                    Select the activities you'd like to enjoy during your trip
                  </p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
                  {activityPreferences.map(activity => {
                    const IconComponent = activity.icon;
                    const isSelected = selectedActivityPreferences.includes(activity.id);
                    return (
                      <button
                        key={activity.id}
                        onClick={() => handleActivityToggle(activity.id)}
                        className={`relative px-6 py-8 rounded-2xl border-2 text-center transition-all duration-200 group hover:scale-105 ${
                          isSelected
                            ? 'border-primary-600 bg-primary-600 text-white shadow-lg'
                            : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-white bg-opacity-20' 
                            : 'bg-gray-100 group-hover:bg-primary-50'
                        }`}>
                          <IconComponent 
                            size={40} 
                            className={`transition-colors duration-200 ${
                              isSelected ? 'text-white' : 'text-primary-600'
                            }`}
                          />
                        </div>
                        <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {activity.name}
                        </span>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-white rounded-full p-1">
                              <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Compatible Groups Display */}
          {showCompatibleGroups && (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {compatibleGroups.length > 0 ? 'Compatible Groups Found' : 'No Compatible Groups'}
                  </h3>
                  <p className="text-gray-600">
                    {compatibleGroups.length > 0 
                      ? `Found ${compatibleGroups.length} groups with similar preferences and travel dates`
                      : 'No existing groups match your preferences and dates. Create a new group to start planning!'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowCompatibleGroups(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {compatibleGroups.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {compatibleGroups.map((group, index) => (
                      <div key={group.groupId || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{group.groupName}</h4>
                            <p className="text-sm text-gray-600">📍 {group.baseCity}</p>
                            {group.memberCount && (
                              <p className="text-xs text-gray-500 mt-1">
                                👥 {group.memberCount} members
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Compatible
                            </div>
                            {group.requestSent && (
                              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Pending
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          {group.matchingActivities && group.matchingActivities.length > 0 && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Shared Activities:</span> {group.matchingActivities.join(', ')}
                            </p>
                          )}
                          {group.matchingTerrains && group.matchingTerrains.length > 0 && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Shared Terrains:</span> {group.matchingTerrains.join(', ')}
                            </p>
                          )}
                          {group.tripDuration && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Duration:</span> {group.tripDuration}
                            </p>
                          )}
                          {group.budgetLevel && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Budget Level:</span> {group.budgetLevel}
                            </p>
                          )}
                        </div>
                        <button 
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            group.requestSent 
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-primary-600 text-white hover:bg-primary-700'
                          }`}
                          onClick={() => {
                            if (!group.requestSent && !isJoiningGroup) {
                              requestToJoinGroup(group.groupId, group.groupName);
                            }
                          }}
                          disabled={group.requestSent || isJoiningGroup || joiningGroupId === group.groupId}
                        >
                          {joiningGroupId === group.groupId ? 'Sending Request...' :
                           group.requestSent ? 'Request Sent ✓' : 'Request to Join'}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 text-center mb-4">
                      Don't see a group that fits? You can create your own group below.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium mb-2">No compatible groups found</p>
                  <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                    Be the first to create a group with your preferences! Other travelers with similar interests will be able to join your group.
                  </p>
                  <button
                    onClick={createGroupWithTrip}
                    disabled={isCreatingGroup}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isCreatingGroup ? 'Creating Group...' : 'Create New Group'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons - styled like TripDurationPage */}
          <div className="lg:col-span-2 flex flex-row gap-4 justify-end mt-6">
            <button
              onClick={handleBack}
              className="bg-white border border-primary-600 text-primary-600 px-8 py-3 rounded-full shadow hover:bg-primary-50 font-medium transition-colors"
            >
              Back
            </button>
            
            {/* Show "Check Existing Groups" button only on final step for public pools */}
            {currentStep === 2 && poolPrivacy === 'public' && (
              <button
                onClick={preCheckCompatibleGroups}
                className="bg-blue-100 border border-blue-600 text-blue-600 px-8 py-3 rounded-full shadow hover:bg-blue-200 font-medium transition-colors"
                disabled={isCreatingGroup || isCheckingGroups || !canProceed()}
              >
                {isCheckingGroups ? 'Checking Groups...' : 'Check Existing Groups'}
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!canProceed() || isCreatingGroup || isCheckingGroups}
              className={`px-8 py-3 rounded-full shadow font-medium transition-colors border ${(canProceed() && !isCreatingGroup && !isCheckingGroups) ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700' : 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed hover:bg-gray-200 hover:text-gray-500 hover:shadow-none'}`}
            >
              {isCreatingGroup ? 'Creating Group...' : 
               isCheckingGroups ? 'Checking...' :
               currentStep === 2 ? 
                 (poolPrivacy === 'private' ? 'Continue to Itinerary' : 'Create New Group & Start Planning') : 
                 'Next'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoolPreferencesPage;

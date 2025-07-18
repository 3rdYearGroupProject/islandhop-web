import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mountain, Waves, Camera, MapPin, Utensils, Music, Gamepad2, Book, Building, ChevronLeft, Trees, Camera as CameraIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import TripProgressBar from '../components/TripProgressBar';

import Footer from '../components/Footer';

const TripPreferencesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripName, selectedDates, userUid } = location.state || {};
  
  console.log('📍 TripPreferencesPage received:', { tripName, selectedDates, userUid });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTerrainPreferences, setSelectedTerrainPreferences] = useState([]);
  const [selectedActivityPreferences, setSelectedActivityPreferences] = useState([]);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [customTerrain, setCustomTerrain] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [terrainPreferences, setTerrainPreferences] = useState([
    { id: 'beaches', name: 'Beach', icon: Waves, color: '#007bff' },
    { id: 'mountains', name: 'Mountain', icon: Mountain, color: '#28a745' },
    { id: 'forests', name: 'Forest', icon: Trees, color: '#20c997' },
    { id: 'historical', name: 'Historical', icon: Book, color: '#6f42c1' },
    { id: 'city', name: 'City', icon: Building, color: '#fd7e14' },
    { id: 'parks', name: 'National Park', icon: MapPin, color: '#198754' },
    { id: 'islands', name: 'Island', icon: Waves, color: '#0dcaf0' },
    { id: 'wetland', name: 'Wetland', icon: CameraIcon, color: '#6c757d' },
    { id: 'countryside', name: 'Countryside', icon: MapPin, color: '#ffc107' }
  ]);

  const [activityPreferences, setActivityPreferences] = useState([
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
  ]);

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

  // Create trip itinerary function - sends data to backend
  const createTripItinerary = async (tripData) => {
    // Input validation
    if (!tripData.userId?.trim()) {
      throw new Error('User ID is required');
    }
    if (!tripData.tripName?.trim()) {
      throw new Error('Trip name is required');
    }
    if (!tripData.startDate) {
      throw new Error('Start date is required');
    }
    if (!tripData.endDate) {
      throw new Error('End date is required');
    }

    // Date validation
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    if (startDate > endDate) {
      throw new Error('Start date must be before or equal to end date');
    }

    // Prepare request payload with proper defaults matching backend expectations
    const requestPayload = {
      userId: tripData.userId.trim(),
      tripName: tripData.tripName.trim(),
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      arrivalTime: tripData.arrivalTime || "21:30", // Default hardcoded arrival time
      baseCity: "Colombo", // Always Colombo as specified
      multiCityAllowed: true, // Always true as specified
      activityPacing: "Normal", // Always Normal as specified
      budgetLevel: "Medium", // Always Medium as specified
      preferredTerrains: tripData.terrains || [],
      preferredActivities: tripData.activities || []
    };

    try {
      console.log('🚀 Creating trip itinerary...', requestPayload);
      
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL_TRIP_PLANNING || 'http://localhost:8084/api/v1';
      const response = await fetch(`${apiBaseUrl}/itinerary/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // CORS: Include credentials if needed
        body: JSON.stringify(requestPayload)
      });

      const responseData = await response.json();
      
      if (response.status === 201) {
        console.log('✅ Trip created successfully:', responseData);
        return responseData;
      } else if (response.status === 400) {
        console.error('❌ Validation error:', responseData);
        const errorMessages = responseData.errors 
          ? Object.values(responseData.errors).join(', ')
          : responseData.message;
        throw new Error(`Validation failed: ${errorMessages}`);
      } else if (response.status === 500) {
        console.error('💥 Server error:', responseData);
        throw new Error('Server error: Please try again later');
      } else {
        console.error('🔴 Unexpected error:', responseData);
        throw new Error(responseData.message || 'Unexpected error occurred');
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 Network error - backend may be unavailable:', error);
        throw new Error('Backend service unavailable. Please check your connection and try again.');
      }
      
      console.error('❌ Trip creation failed:', error);
      throw error;
    }
  };

  // Create trip with preferences using backend request
  const createTripWithPreferences = async (tripData) => {
    console.log('🚀 Creating trip with preferences...', tripData);
    
    try {
      // Format dates properly - selectedDates is an array of Date objects
      const startDate = tripData.selectedDates[0] instanceof Date 
        ? tripData.selectedDates[0].toISOString().split('T')[0]
        : tripData.selectedDates[0];
      const endDate = tripData.selectedDates[1] instanceof Date 
        ? tripData.selectedDates[1].toISOString().split('T')[0] 
        : tripData.selectedDates[1];

      const response = await createTripItinerary({
        userId: tripData.userUid,
        tripName: tripData.tripName,
        startDate: startDate,
        endDate: endDate,
        terrains: tripData.selectedTerrains,
        activities: tripData.selectedActivities
      });

      console.log('✅ Trip created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating trip:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    if (canProceed()) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        // Both preferences are filled, create trip with backend
        if (userUid && tripName && selectedDates && selectedTerrainPreferences.length > 0 && selectedActivityPreferences.length > 0) {
          setIsCreatingTrip(true);
          
          try {
            const tripResponse = await createTripWithPreferences({
              userUid,
              tripName,
              selectedDates,
              selectedTerrains: selectedTerrainPreferences,
              selectedActivities: selectedActivityPreferences
            });
            
            console.log('🎉 Trip created successfully:', tripResponse);
            
            // Navigate to itinerary planning with the created trip data
            navigate('/trip-itinerary', { 
              state: { 
                tripName, 
                selectedDates, 
                selectedTerrains: selectedTerrainPreferences,
                selectedActivities: selectedActivityPreferences,
                tripId: tripResponse.tripId,
                trip: tripResponse,
                userUid
              } 
            });
          } catch (error) {
            console.error('Failed to create trip:', error);
            // Show error to user but allow navigation to continue with local state
            alert(`Failed to create trip: ${error.message}. You can continue planning locally.`);
            navigate('/trip-itinerary', { 
              state: { 
                tripName, 
                selectedDates, 
                selectedTerrains: selectedTerrainPreferences,
                selectedActivities: selectedActivityPreferences,
                userUid
              } 
            });
          } finally {
            setIsCreatingTrip(false);
          }
        } else {
          // Missing required data, navigate anyway with warning
          console.warn('Missing required data for trip creation:', { userUid, tripName, selectedDates });
          navigate('/trip-itinerary', { 
            state: { 
              tripName, 
              selectedDates, 
              selectedTerrains: selectedTerrainPreferences,
              selectedActivities: selectedActivityPreferences,
              userUid
            } 
          });
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/trip-duration', { 
        state: { 
          tripName,
          userUid
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Spacer to prevent overlap with fixed/floating navbar */}
      <div className="h-20 md:h-24 lg:h-28 bg-white"></div>

      <TripProgressBar tripName={tripName} onBack={handleBack} currentStep={3} completedSteps={[1, 2]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card - Terrain Preferences */}
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
                  {terrainPreferences.filter(pref => ['beaches', 'mountains', 'forests', 'historical', 'city', 'parks', 'islands', 'wetland', 'countryside'].includes(pref.id)).map(preference => {
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
                        {IconComponent && (
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
                        )}
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
                {/* Custom terrain preferences below the cards */}
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {terrainPreferences.filter(pref => !['beaches', 'mountains', 'forests', 'historical', 'city', 'parks', 'islands', 'wetland', 'countryside'].includes(pref.id)).map(pref => (
                      <div
                        key={pref.id}
                        className="flex items-center bg-primary-600 text-white px-3 py-1 rounded-full border border-primary-600"
                      >
                        <span className="mr-2 text-sm font-medium">{pref.name}</span>
                        <button
                          onClick={() => {
                            setTerrainPreferences(prev => prev.filter(p => p.id !== pref.id));
                            setSelectedTerrainPreferences(prev => prev.filter(id => id !== pref.id));
                          }}
                          className="text-white hover:text-gray-200 focus:outline-none text-sm"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Add your own terrain preference"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      value={customTerrain}
                      onChange={(e) => setCustomTerrain(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (customTerrain.trim()) {
                          const newPreference = {
                            id: customTerrain.trim().toLowerCase().replace(/\s+/g, '-'),
                            name: customTerrain.trim(),
                            color: '#6c757d' // Default color
                          };
                          setSelectedTerrainPreferences(prev => [...prev, newPreference.id]);
                          setTerrainPreferences(prev => [...prev, newPreference]);
                          setCustomTerrain('');
                        }
                      }}
                      className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
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
                <div className="grid grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                  {activityPreferences.filter(activity => [
                    'surfing', 'hiking', 'photography', 'sightseeing', 'dining', 'nightlife', 'snorkeling', 'adventure', 'culture', 'wildlife', 'wellness', 'shopping'
                  ].includes(activity.id)).map(activity => {
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
                {/* Custom activity preferences and input below the cards */}
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activityPreferences.filter(pref => ![
                      'surfing', 'hiking', 'photography', 'sightseeing', 'dining', 'nightlife', 'snorkeling', 'adventure', 'culture', 'wildlife', 'wellness', 'shopping'
                    ].includes(pref.id)).map(pref => (
                      <div
                        key={pref.id}
                        className="flex items-center bg-primary-600 text-white px-3 py-1 rounded-full border border-primary-600"
                      >
                        <span className="mr-2 text-sm font-medium">{pref.name}</span>
                        <button
                          onClick={() => {
                            setActivityPreferences(prev => prev.filter(p => p.id !== pref.id));
                            setSelectedActivityPreferences(prev => prev.filter(id => id !== pref.id));
                          }}
                          className="text-white hover:text-gray-200 focus:outline-none text-sm"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Add your own activity preference"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (customActivity && customActivity.trim()) {
                          const newPreference = {
                            id: customActivity.trim().toLowerCase().replace(/\s+/g, '-'),
                            name: customActivity.trim(),
                            color: '#6c757d'
                          };
                          setSelectedActivityPreferences(prev => [...prev, newPreference.id]);
                          setActivityPreferences(prev => [...prev, newPreference]);
                          setCustomActivity('');
                        }
                      }}
                      className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Right Card - Activity Preferences (only on step 2) */}
          {/* Removed - now using single card layout for activities */}
          {/* Navigation Buttons - styled like TripDurationPage */}
          <div className="lg:col-span-2 flex flex-row gap-4 justify-end mt-6">
            <button
              onClick={handleBack}
              className="px-6 py-2 rounded-full border border-primary-600 text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 transition-all duration-200 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 text-base"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || isCreatingTrip}
              className={`px-6 py-2 rounded-full font-semibold text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 ${
                canProceed() && !isCreatingTrip
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isCreatingTrip ? 'Creating Trip...' : currentStep === 2 ? 'Create Trip & Continue' : 'Next'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripPreferencesPage;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mountain, Waves, Camera, MapPin, Utensils, Music, Gamepad2, Book, Building, ChevronLeft, Trees, Camera as CameraIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import TripProgressBar from '../components/TripProgressBar';
import { tripPlanningApi } from '../api/axios';

const TripPreferencesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripName, selectedDates, tripId, trip, userUid } = location.state || {};
  
  console.log('📍 TripPreferencesPage received:', { tripName, selectedDates, tripId, userUid });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTerrainPreferences, setSelectedTerrainPreferences] = useState([]);
  const [selectedActivityPreferences, setSelectedActivityPreferences] = useState([]);
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);

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

  // Update trip preferences with backend request
  const updateTripPreferences = async (tripId, preferences, userId) => {
    console.log('🚀 Sending trip preferences update to backend...', {
      tripId,
      userId,
      terrainPreferences: preferences.terrain,
      activityPreferences: preferences.activities
    });
    
    try {
      const response = await tripPlanningApi.post(`/trip/${tripId}/preferences`, {
        userId: userId,
        terrainPreferences: preferences.terrain,
        activityPreferences: preferences.activities
      });

      console.log('✅ Trip preferences update response received:', response.data);
      
      return {
        message: response.data.message,
        userId: response.data.userId,
        trip: response.data.trip
      };
    } catch (error) {
      console.error('❌ Error updating trip preferences:', error);
      throw new Error(`Failed to update preferences: ${error.response?.status || 'unknown'}`);
    }
  };

  const handleNext = async () => {
    if (canProceed()) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        // Both preferences are filled, send request to backend
        if (tripId && userUid && selectedTerrainPreferences.length > 0 && selectedActivityPreferences.length > 0) {
          setIsUpdatingPreferences(true);
          
          try {
            const result = await updateTripPreferences(tripId, {
              terrain: selectedTerrainPreferences,
              activities: selectedActivityPreferences
            }, userUid);
            
            console.log('🎉 Trip preferences updated successfully:', result);
            
            // Navigate to itinerary planning with updated trip data
            navigate('/trip-itinerary', { 
              state: { 
                tripName, 
                selectedDates, 
                selectedTerrains: selectedTerrainPreferences,
                selectedActivities: selectedActivityPreferences,
                tripId,
                trip: result.trip || trip,
                userUid
              } 
            });
          } catch (error) {
            console.error('Failed to update trip preferences:', error);
            // Continue to next page even if backend fails
            navigate('/trip-itinerary', { 
              state: { 
                tripName, 
                selectedDates, 
                selectedTerrains: selectedTerrainPreferences,
                selectedActivities: selectedActivityPreferences,
                tripId,
                trip,
                userUid
              } 
            });
          } finally {
            setIsUpdatingPreferences(false);
          }
        } else {
          // Missing required data, navigate anyway
          navigate('/trip-itinerary', { 
            state: { 
              tripName, 
              selectedDates, 
              selectedTerrains: selectedTerrainPreferences,
              selectedActivities: selectedActivityPreferences,
              tripId,
              trip,
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
          {/* Right Card - Activity Preferences (only on step 2) */}
          {/* Removed - now using single card layout for activities */}
          {/* Navigation Buttons - styled like TripDurationPage */}
          <div className="lg:col-span-2 flex flex-row gap-4 justify-end mt-6">
            <button
              onClick={handleBack}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:border-blue-300 hover:text-blue-700 transition-all duration-200 font-semibold order-1 sm:order-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 2 ? 'Continue with Planning' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPreferencesPage;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mountain, Waves, Camera, MapPin, Utensils, Music, Gamepad2, Book, Building, ChevronLeft, Trees, Camera as CameraIcon } from 'lucide-react';
import Navbar from '../components/Navbar';

const TripPreferencesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripName, selectedDates } = location.state || {};
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTerrainPreferences, setSelectedTerrainPreferences] = useState([]);
  const [selectedActivityPreferences, setSelectedActivityPreferences] = useState([]);

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

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        // Navigate to itinerary planning
        navigate('/trip-itinerary', { 
          state: { 
            tripName, 
            selectedDates, 
            selectedTerrains: selectedTerrainPreferences,
            selectedActivities: selectedActivityPreferences
          } 
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/trip-duration', { state: { tripName } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Step {currentStep} of 2</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Tell us about your travel style</h1>
            <div className="flex justify-center gap-2">
              <div className={`w-10 h-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  What terrains do you prefer?
                </h2>
                <p className="text-gray-600">
                  Select the types of landscapes you'd like to visit in Sri Lanka
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {terrainPreferences.map(preference => {
                  const IconComponent = preference.icon;
                  const isSelected = selectedTerrainPreferences.includes(preference.id);
                  return (
                    <button
                      key={preference.id}
                      onClick={() => handleTerrainToggle(preference.id)}
                      className={`relative p-6 rounded-xl border-2 text-center transition-all duration-200 group hover:scale-105 ${
                        isSelected
                          ? 'border-primary-600 bg-primary-600 text-white shadow-lg'
                          : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-3 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-white bg-opacity-20' 
                          : 'bg-gray-100 group-hover:bg-primary-50'
                      }`}>
                        <IconComponent 
                          size={32} 
                          className={`transition-colors duration-200 ${
                            isSelected ? 'text-white' : 'text-primary-600'
                          }`}
                        />
                      </div>
                      <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  What activities interest you?
                </h2>
                <p className="text-gray-600">
                  Select the activities you'd like to enjoy during your trip
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activityPreferences.map(activity => {
                  const IconComponent = activity.icon;
                  const isSelected = selectedActivityPreferences.includes(activity.id);
                  return (
                    <button
                      key={activity.id}
                      onClick={() => handleActivityToggle(activity.id)}
                      className={`relative p-6 rounded-xl border-2 text-center transition-all duration-200 group hover:scale-105 ${
                        isSelected
                          ? 'border-primary-600 bg-primary-600 text-white shadow-lg'
                          : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-3 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-white bg-opacity-20' 
                          : 'bg-gray-100 group-hover:bg-primary-50'
                      }`}>
                        <IconComponent 
                          size={28} 
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
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
            
            <button 
              onClick={handleNext}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                canProceed()
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canProceed()}
            >
              <span>
                {currentStep === 2 ? 'Complete Trip Setup' : 'Next'}
              </span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPreferencesPage;

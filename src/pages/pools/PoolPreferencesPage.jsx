import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mountain, Waves, Camera, MapPin, Utensils, Music, Gamepad2, Book, Building, ChevronLeft, Trees, Camera as CameraIcon } from 'lucide-react';
import Navbar from '../../components/Navbar';
import PoolProgressBar from '../../components/PoolProgressBar';

const PoolPreferencesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    poolName, 
    poolDescription, 
    selectedDates, 
    poolSize, 
    startDate, 
    endDate, 
    userUid 
  } = location.state || {};
  
  console.log('📍 PoolPreferencesPage received:', { 
    poolName, 
    poolDescription, 
    selectedDates, 
    poolSize, 
    userUid 
  });
  
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

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Navigate to destinations page
      navigate('/pool-destinations', {
        state: {
          poolName,
          poolDescription,
          selectedDates,
          poolSize,
          startDate,
          endDate,
          selectedTerrains: selectedTerrainPreferences,
          selectedActivities: selectedActivityPreferences,
          userUid
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/pool-duration', {
        state: {
          poolName,
          poolDescription,
          userUid
        }
      });
    } else {
      setCurrentStep(1);
    }
  };

  const canProceed = currentStep === 1 
    ? selectedTerrainPreferences.length > 0
    : selectedActivityPreferences.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <PoolProgressBar 
        poolName={poolName}
        onBack={handleBack}
        currentStep={3}
        completedSteps={[1, 2]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentStep === 1 ? 'What kind of places interest you?' : 'What activities do you enjoy?'}
          </h1>
          <p className="text-lg text-gray-600">
            {currentStep === 1 
              ? 'Choose the types of terrain and environments you\'d like to explore together'
              : 'Select activities that you and your pool members would enjoy doing'
            }
          </p>
        </div>

        {/* Preferences Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(currentStep === 1 ? terrainPreferences : activityPreferences).map((preference) => {
              const Icon = preference.icon;
              const isSelected = currentStep === 1 
                ? selectedTerrainPreferences.includes(preference.id)
                : selectedActivityPreferences.includes(preference.id);
              
              return (
                <button
                  key={preference.id}
                  onClick={() => currentStep === 1 
                    ? handleTerrainToggle(preference.id)
                    : handleActivityToggle(preference.id)
                  }
                  className={`
                    relative p-4 rounded-lg border-2 text-center transition-all duration-200 hover:scale-105
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div 
                      className={`p-3 rounded-full ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}
                      style={{ 
                        backgroundColor: isSelected ? `${preference.color}20` : undefined 
                      }}
                    >
                      <Icon 
                        className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}
                        style={{ 
                          color: isSelected ? preference.color : undefined 
                        }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                      {preference.name}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Summary */}
        {((currentStep === 1 && selectedTerrainPreferences.length > 0) || 
          (currentStep === 2 && selectedActivityPreferences.length > 0)) && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-2">
              Selected {currentStep === 1 ? 'Terrains' : 'Activities'}: 
            </p>
            <div className="flex flex-wrap gap-2">
              {(currentStep === 1 ? selectedTerrainPreferences : selectedActivityPreferences).map((id) => {
                const preference = (currentStep === 1 ? terrainPreferences : activityPreferences)
                  .find(p => p.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {preference?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6">
          <button
            onClick={handleBack}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed || isUpdatingPreferences}
            className={`
              flex items-center px-8 py-3 rounded-lg font-medium transition-all
              ${canProceed && !isUpdatingPreferences
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isUpdatingPreferences ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : currentStep === 1 ? (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Continue to Destinations
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolPreferencesPage;

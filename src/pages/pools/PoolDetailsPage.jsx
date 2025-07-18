import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Clock, 
  Car, 
  Bed, 
  Camera, 
  MessageCircle, 
  ArrowRight,
  Check,
  MapPin,
  Users,
  Calendar
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import PoolProgressBar from '../../components/PoolProgressBar';

const PoolDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    poolName, 
    poolDescription, 
    selectedDates, 
    poolSize, 
    startDate, 
    endDate, 
    selectedTerrains,
    selectedActivities,
    destinations,
    userUid 
  } = location.state || {};
  
  console.log('📍 PoolDetailsPage received all data:', {
    poolName,
    poolDescription,
    selectedDates,
    poolSize,
    selectedTerrains,
    selectedActivities,
    destinations,
    userUid
  });
  
  const [poolDetails, setPoolDetails] = useState({
    budget: '',
    transportation: 'shared',
    accommodation: 'shared',
    meetingPoint: '',
    additionalNotes: ''
  });
  
  const [isCreatingPool, setIsCreatingPool] = useState(false);

  const budgetOptions = [
    { value: 'budget', label: 'Budget ($50-100/day)', icon: '💰' },
    { value: 'mid-range', label: 'Mid-range ($100-200/day)', icon: '💳' },
    { value: 'luxury', label: 'Luxury ($200+/day)', icon: '💎' },
    { value: 'flexible', label: 'Flexible/Discuss', icon: '🤝' }
  ];

  const transportationOptions = [
    { value: 'shared', label: 'Shared Transportation', description: 'Split costs for van/bus rental' },
    { value: 'individual', label: 'Individual Transport', description: 'Each person arranges own transport' },
    { value: 'public', label: 'Public Transport', description: 'Use buses, trains, and tuk-tuks' }
  ];

  const accommodationOptions = [
    { value: 'shared', label: 'Shared Accommodation', description: 'Share rooms/houses to split costs' },
    { value: 'individual', label: 'Individual Rooms', description: 'Everyone books their own room' },
    { value: 'mixed', label: 'Mixed/Flexible', description: 'Decide per location' }
  ];

  const handleInputChange = (field, value) => {
    setPoolDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePool = async () => {
    setIsCreatingPool(true);
    
    try {
      const poolData = {
        poolName,
        poolDescription,
        selectedDates,
        poolSize,
        startDate,
        endDate,
        destinations,
        ...poolDetails,
        userUid,
        createdAt: new Date()
      };

      console.log('🎉 Pool created successfully:', poolData);
      
      // Navigate back to pools page with the new pool data
      navigate('/pools', {
        state: {
          newPool: poolData,
          message: 'Pool created successfully!'
        }
      });
    } catch (error) {
      console.error('Failed to create pool:', error);
      // Still navigate back but show error
      navigate('/pools', {
        state: {
          error: 'Failed to create pool. Please try again.'
        }
      });
    } finally {
      setIsCreatingPool(false);
    }
  };

  const handleBack = () => {
    navigate('/pool-destinations', { 
      state: { 
        poolName,
        poolDescription,
        selectedDates,
        poolSize,
        startDate,
        endDate,
        selectedTerrains,
        selectedActivities,
        userUid
      } 
    });
  };

  const formatDateRange = () => {
    if (!selectedDates || selectedDates.length === 0) return 'No dates selected';
    if (selectedDates.length === 1) {
      return selectedDates[0].toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    const start = selectedDates[0];
    const end = selectedDates[1];
    
    return `${start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} → ${end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  };

  const isFormValid = poolDetails.budget && poolDetails.meetingPoint.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <PoolProgressBar poolName={poolName} onBack={handleBack} currentStep={5} completedSteps={[1, 2, 3, 4]} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Pool Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Budget Range</h2>
                </div>
                <p className="text-gray-600">
                  What's your expected budget range per person per day?
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('budget', option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      poolDetails.budget === option.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transportation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Car className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Transportation</h2>
                </div>
                <p className="text-gray-600">
                  How do you prefer to travel between destinations?
                </p>
              </div>
              
              <div className="space-y-3">
                {transportationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('transportation', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      poolDetails.transportation === option.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accommodation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Bed className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Accommodation</h2>
                </div>
                <p className="text-gray-600">
                  What's your preference for accommodation arrangements?
                </p>
              </div>
              
              <div className="space-y-3">
                {accommodationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('accommodation', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      poolDetails.accommodation === option.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meeting Point */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Meeting Point</h2>
                </div>
                <p className="text-gray-600">
                  Where should the group meet to start the trip?
                </p>
              </div>
              
              <input
                type="text"
                placeholder="e.g., Bandaranaike International Airport, Colombo Fort Railway Station"
                value={poolDetails.meetingPoint}
                onChange={(e) => handleInputChange('meetingPoint', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Additional Notes</h2>
                </div>
                <p className="text-gray-600">
                  Any special requirements, preferences, or information for potential pool members?
                </p>
              </div>
              
              <textarea
                rows={4}
                placeholder="e.g., Must be comfortable with early morning starts, vegetarian meals preferred, photographers welcome..."
                value={poolDetails.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Right Side - Pool Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Pool Summary</h3>
              
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{poolName}</div>
                  {poolDescription && (
                    <div className="text-sm text-gray-600 mt-1">{poolDescription}</div>
                  )}
                </div>
                
                {/* Details Grid */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{formatDateRange()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{poolSize} people total</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{destinations?.length || 0} destinations</span>
                  </div>
                </div>

                {/* Destinations List */}
                {destinations && destinations.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-900 mb-2">Route:</div>
                    <div className="space-y-1">
                      {destinations.map((dest, index) => (
                        <div key={dest.id} className="text-sm text-gray-600 flex items-center">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2">
                            {index + 1}
                          </span>
                          {dest.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Preferences */}
                <div className="space-y-2 text-sm">
                  {poolDetails.budget && (
                    <div>
                      <span className="font-medium text-gray-900">Budget: </span>
                      <span className="text-gray-600">
                        {budgetOptions.find(opt => opt.value === poolDetails.budget)?.label}
                      </span>
                    </div>
                  )}
                  
                  {poolDetails.transportation && (
                    <div>
                      <span className="font-medium text-gray-900">Transport: </span>
                      <span className="text-gray-600">
                        {transportationOptions.find(opt => opt.value === poolDetails.transportation)?.label}
                      </span>
                    </div>
                  )}
                  
                  {poolDetails.accommodation && (
                    <div>
                      <span className="font-medium text-gray-900">Stay: </span>
                      <span className="text-gray-600">
                        {accommodationOptions.find(opt => opt.value === poolDetails.accommodation)?.label}
                      </span>
                    </div>
                  )}
                  
                  {poolDetails.meetingPoint && (
                    <div>
                      <span className="font-medium text-gray-900">Meeting: </span>
                      <span className="text-gray-600">{poolDetails.meetingPoint}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Create Pool Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCreatePool}
                  disabled={!isFormValid || isCreatingPool}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    !isFormValid || isCreatingPool
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isCreatingPool ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Pool...
                    </>
                  ) : (
                    <>
                      <Check className="mr-3 h-5 w-5" />
                      Create Pool
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolDetailsPage;

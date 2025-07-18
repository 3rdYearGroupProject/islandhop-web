import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Plus, Trash2, GripVertical, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import PoolProgressBar from '../../components/PoolProgressBar';

const PoolDestinationsPage = () => {
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
    userUid 
  } = location.state || {};
  
  console.log('📍 PoolDestinationsPage received:', { 
    poolName, 
    poolDescription, 
    selectedDates, 
    poolSize,
    selectedTerrains,
    selectedActivities, 
    userUid 
  });
  
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingDestinations, setIsAddingDestinations] = useState(false);

  // Popular Sri Lankan destinations
  const popularDestinations = [
    { 
      id: 'colombo', 
      name: 'Colombo', 
      type: 'City',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&q=80',
      description: 'Vibrant capital city with shopping and nightlife'
    },
    { 
      id: 'kandy', 
      name: 'Kandy', 
      type: 'Cultural',
      image: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=300&q=80',
      description: 'Sacred city with the Temple of the Tooth'
    },
    { 
      id: 'galle', 
      name: 'Galle', 
      type: 'Historical',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=300&q=80',
      description: 'Historic fort city with colonial architecture'
    },
    { 
      id: 'ella', 
      name: 'Ella', 
      type: 'Mountain',
      image: 'https://images.unsplash.com/photo-1565052350231-8c3f9006b114?auto=format&fit=crop&w=300&q=80',
      description: 'Scenic hill country with tea plantations'
    },
    { 
      id: 'sigiriya', 
      name: 'Sigiriya', 
      type: 'Archaeological',
      image: 'https://images.unsplash.com/photo-1580711508409-0b77fe05b61c?auto=format&fit=crop&w=300&q=80',
      description: 'Ancient rock fortress and UNESCO site'
    },
    { 
      id: 'mirissa', 
      name: 'Mirissa', 
      type: 'Beach',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6dee05d?auto=format&fit=crop&w=300&q=80',
      description: 'Beautiful beach town for whale watching'
    },
    { 
      id: 'nuwara-eliya', 
      name: 'Nuwara Eliya', 
      type: 'Mountain',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80',
      description: 'Cool climate hill station with tea estates'
    },
    { 
      id: 'anuradhapura', 
      name: 'Anuradhapura', 
      type: 'Archaeological',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=300&q=80',
      description: 'Ancient capital with sacred Buddhist sites'
    }
  ];

  const filteredDestinations = popularDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addDestination = (destination) => {
    if (!destinations.find(d => d.id === destination.id)) {
      setDestinations([...destinations, destination]);
    }
  };

  const removeDestination = (destinationId) => {
    setDestinations(destinations.filter(d => d.id !== destinationId));
  };

  const handleNext = async () => {
    if (destinations.length >= 1) {
      setIsAddingDestinations(true);
      
      try {
        console.log('🎉 Pool destinations selected successfully');
        
        // Navigate to next step with pool data
        navigate('/pool-details', { 
          state: { 
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
          } 
        });
      } catch (error) {
        console.error('Failed to process pool destinations:', error);
        navigate('/pool-details', { 
          state: { 
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
          } 
        });
      } finally {
        setIsAddingDestinations(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/pool-preferences', { 
      state: { 
        poolName,
        poolDescription,
        selectedDates,
        poolSize,
        startDate,
        endDate,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <PoolProgressBar poolName={poolName} onBack={handleBack} currentStep={4} completedSteps={[1, 2, 3]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Destination Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Choose Your Destinations</h2>
                </div>
                <p className="text-gray-600">
                  Select the places you want to visit during your pool trip. You can add multiple destinations to create your route.
                </p>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Destination Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      destinations.find(d => d.id === destination.id)
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => {
                      if (destinations.find(d => d.id === destination.id)) {
                        removeDestination(destination.id);
                      } else {
                        addDestination(destination);
                      }
                    }}
                  >
                    <div className="relative h-32">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full">
                          {destination.type}
                        </span>
                      </div>
                      {destinations.find(d => d.id === destination.id) && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{destination.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{destination.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Selected Route & Summary */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Selected Route */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Route</h3>
                
                {destinations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Select destinations to build your route</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {destinations.map((destination, index) => (
                      <div key={destination.id} className="flex items-center bg-gray-50 rounded-lg p-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{destination.name}</div>
                          <div className="text-sm text-gray-500">{destination.type}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDestination(destination.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pool Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pool Summary</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-gray-900">{poolName}</div>
                    {poolDescription && (
                      <div className="text-sm text-gray-600">{poolDescription}</div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Dates:</strong> {formatDateRange()}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Pool Size:</strong> {poolSize} people
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Destinations:</strong> {destinations.length} selected
                  </div>
                </div>

                {/* Next Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleNext}
                    disabled={destinations.length === 0 || isAddingDestinations}
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      destinations.length === 0 || isAddingDestinations
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {isAddingDestinations ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue to Final Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolDestinationsPage;

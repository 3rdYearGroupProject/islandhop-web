import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, RefreshCw, MapPin, Clock, Calendar, User, Camera, Utensils, Mountain, Waves } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { tripPlanningApi } from '../api/axios';

const AITripItineraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    tripName, 
    selectedDates, 
    selectedTerrains, 
    selectedActivities, 
    isPool, 
    userUid, 
    isAI,
    generatedTrip,
    tripId 
  } = location.state || {};
  
  console.log('📍 AITripItineraryPage received:', { 
    tripName, 
    selectedDates, 
    selectedTerrains, 
    selectedActivities, 
    isPool, 
    userUid, 
    isAI,
    generatedTrip,
    tripId 
  });

  const [itinerary, setItinerary] = useState(generatedTrip || {});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(tripId);

  useEffect(() => {
    if (generatedTrip) {
      setItinerary(generatedTrip);
      setCurrentTripId(generatedTrip.tripId || generatedTrip.id || tripId);
    }
  }, [generatedTrip, tripId]);

  const handleSuggestDifferent = async () => {
    setIsGenerating(true);
    
    try {
      const tripData = {
        tripName,
        selectedDates,
        isPool,
        userUid,
        isAI: true,
        terrainPreferences: selectedTerrains,
        activityPreferences: selectedActivities,
        regenerate: true // Flag to indicate we want a different suggestion
      };

      console.log('🔄 Requesting new AI trip suggestion:', tripData);
      
      const response = await tripPlanningApi.post('/ai-trip-suggestions', tripData);
      const newTrip = response.data;
      
      console.log('✨ Received new AI trip suggestion:', newTrip);
      
      setItinerary(newTrip);
      setCurrentTripId(newTrip.tripId || newTrip.id);
      
    } catch (error) {
      console.error('❌ Failed to generate new AI trip:', error);
      alert('Failed to generate new suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    navigate('/ai-trip-preferences');
  };

  const handleBookTrip = () => {
    if (currentTripId) {
      navigate(`/trip/${currentTripId}/booking`, {
        state: {
          trip: itinerary,
          tripId: currentTripId,
          isAI: true
        }
      });
    }
  };

  const handleViewTrip = () => {
    if (currentTripId) {
      navigate(`/trip/${currentTripId}`, {
        state: {
          trip: itinerary,
          tripId: currentTripId,
          isAI: true
        }
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityIcon = (activity) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes('beach') || activityLower.includes('surf')) return Waves;
    if (activityLower.includes('mountain') || activityLower.includes('hike')) return Mountain;
    if (activityLower.includes('food') || activityLower.includes('dining')) return Utensils;
    if (activityLower.includes('photo') || activityLower.includes('sight')) return Camera;
    return MapPin;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-800">Your AI-Generated Trip</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Here's your personalized trip itinerary created by AI
            </p>
          </div>

          {/* Trip Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{tripName}</h2>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{formatDate(selectedDates[0])} - {formatDate(selectedDates[selectedDates.length - 1])}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{selectedDates.length} days</span>
                  </div>
                  {isPool && (
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      <span>Pool Trip</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4 mt-4 md:mt-0">
                <button
                  onClick={handleSuggestDifferent}
                  disabled={isGenerating}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isGenerating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Suggest Different
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleBookTrip}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book This Trip
                </button>
              </div>
            </div>
          </div>

          {/* Itinerary Content */}
          {itinerary && (
            <div className="space-y-6">
              {/* Display generated itinerary */}
              {itinerary.itinerary && Array.isArray(itinerary.itinerary) ? (
                itinerary.itinerary.map((day, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Day {index + 1}</h3>
                        <p className="text-gray-600">{formatDate(selectedDates[index])}</p>
                      </div>
                    </div>
                    
                    {day.activities && day.activities.length > 0 ? (
                      <div className="space-y-4">
                        {day.activities.map((activity, actIndex) => {
                          const IconComponent = getActivityIcon(activity.name || activity.title || '');
                          return (
                            <div key={actIndex} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                              <IconComponent className="w-6 h-6 text-blue-600 mt-1" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">
                                  {activity.name || activity.title || 'Activity'}
                                </h4>
                                <p className="text-gray-600">
                                  {activity.description || activity.details || 'Activity details'}
                                </p>
                                {activity.location && (
                                  <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{activity.location}</span>
                                  </div>
                                )}
                                {activity.time && (
                                  <div className="flex items-center mt-1 text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>{activity.time}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                          {day.description || `Explore and enjoy Day ${index + 1} of your trip!`}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Fallback display if itinerary structure is different
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Overview</h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Your AI-generated trip includes activities based on your preferences for:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerrains?.map((terrain, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {terrain}
                        </span>
                      ))}
                      {selectedActivities?.map((activity, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {activity}
                        </span>
                      ))}
                    </div>
                    {itinerary.description && (
                      <p className="text-gray-700 mt-4">{itinerary.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Trip Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Duration</h4>
                    <p className="text-gray-600">{selectedDates.length} days</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Trip Type</h4>
                    <p className="text-gray-600">{isPool ? 'Pool Trip' : 'Individual Trip'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Terrain Preferences</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTerrains?.map((terrain, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {terrain}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Activity Preferences</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedActivities?.map((activity, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              className="flex items-center px-4 md:px-6 py-2 md:py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
              style={{ minWidth: '100px' }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Preferences
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={handleViewTrip}
                className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              
              <button
                onClick={handleBookTrip}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book This Trip
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AITripItineraryPage;

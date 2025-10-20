import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  MapPin, 
  Star,
  Camera,
  CheckCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PoolCard from '../../components/PoolCard';
import JoinPoolModal from '../../components/JoinPoolModal';
import PoolsApi from '../../api/poolsApi';
import { getUserUID } from '../../utils/userStorage';
import { useAuth } from '../../hooks/useAuth';

const TripSuggestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get data from PoolItineraryPage
  const {
    tripId,
    groupId,
    tripName,
    startDate,
    endDate,
    destinations,
    terrains,
    activities,
    itinerary,
    userUid,
    suggestions = [],
    totalSuggestions = 0,
    hasSuggestions = false,
    backendResponse,
    // Cost breakdown from PoolCostEstimationPage
    costBreakdown,
    needDriver,
    needGuide,
    selectedVehicle
  } = location.state || {};

  const [isFinalizingTrip, setIsFinalizingTrip] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTripToJoin, setSelectedTripToJoin] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  console.log('🎯 ===== TRIP SUGGESTIONS PAGE INITIALIZATION =====');
  console.log('🎯 Received state from PoolCostEstimationPage:', location.state);
  console.log('🎯 Trip information:');
  console.log('  - tripId:', tripId);
  console.log('  - groupId:', groupId);
  console.log('  - tripName:', tripName);
  console.log('  - startDate:', startDate);
  console.log('  - endDate:', endDate);
  console.log('  - destinations:', destinations);
  console.log('  - userUid:', userUid);
  console.log('🎯 Cost breakdown information:');
  console.log('  - costBreakdown:', costBreakdown);
  console.log('  - needDriver:', needDriver);
  console.log('  - needGuide:', needGuide);
  console.log('  - selectedVehicle:', selectedVehicle);
  console.log('🎯 Suggestions information:');
  console.log('  - suggestions count:', suggestions?.length || 0);
  console.log('  - totalSuggestions:', totalSuggestions);
  console.log('  - hasSuggestions:', hasSuggestions);
  console.log('  - suggestions data:', suggestions);
  console.log('🎯 Backend response:', backendResponse);
  console.log('🎯 ===== END INITIALIZATION =====');

  useEffect(() => {
    // Redirect if no required data
    if (!tripId || !groupId || !tripName) {
      console.warn('⚠️ Missing required trip data, redirecting to pool preferences');
      navigate('/pool-preferences');
      return;
    }
  }, [tripId, groupId, tripName, navigate]);

  // Transform suggestions to PoolCard format
  const transformSuggestionToPoolFormat = (suggestion) => {
    return {
      id: suggestion.groupId || suggestion.id,
      name: suggestion.groupName || suggestion.name || 'Adventure Trip',
      image: suggestion.image || '/api/placeholder/400/250',
      price: suggestion.estimatedCost || 'Price TBD',
      owner: suggestion.organizer || 'Group Organizer',
      destinations: suggestion.destinations?.join(', ') || suggestion.baseCity || 'Sri Lanka',
      date: suggestion.startDate && suggestion.endDate 
        ? `${formatDate(suggestion.startDate)} - ${formatDate(suggestion.endDate)}`
        : 'Dates TBD',
      duration: suggestion.tripDuration || calculateDuration(suggestion.startDate, suggestion.endDate),
      participants: suggestion.memberCount || suggestion.currentMembers || 0,
      maxParticipants: suggestion.maxMembers || suggestion.maxParticipants || 6,
      status: suggestion.status || 'open',
      highlights: suggestion.preferredActivities || suggestion.activities || [],
      
      // Additional compatibility data
      compatibilityScore: suggestion.compatibilityScore,
      compatibilityDetails: suggestion.compatibilityDetails,
      
      // Original suggestion data for join operations
      originalGroup: suggestion
    };
  };

  // Helper functions
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Date TBD';
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    } catch {
      return null;
    }
  };

  // Handle creating user's own trip (finalize)
  const handleCreateMyTrip = async () => {
    console.log('🎯 ===== FINALIZING USER\'S OWN TRIP =====');
    console.log('🎯 Trip and user information:');
    console.log('  - groupId:', groupId);
    console.log('  - tripId:', tripId);
    console.log('  - userUid (from state):', userUid);
    console.log('  - user?.uid (from auth):', user?.uid);
    console.log('  - getUserUID() (from storage):', getUserUID());
    console.log('  - user object:', user);
    console.log('🎯 Group creation context (from backend response):');
    console.log('  - backendResponse:', backendResponse);
    
    setIsFinalizingTrip(true);
    
    try {
      // Use the same getUserUID() function that was used for group creation
      const currentUserId = getUserUID() || user?.uid || userUid;
      
      const finalizeData = {
        groupId: groupId,  // Include groupId in the request body
        userId: currentUserId,
        action: 'finalize',
        // Cost breakdown details
        averageDriverCost: costBreakdown?.averageDriverCost || 0,
        averageGuideCost: costBreakdown?.averageGuideCost || 0,
        totalCost: costBreakdown?.totalCost || 0,
        costPerPerson: costBreakdown?.costPerPerson || 0,
        maxParticipants: costBreakdown?.maxParticipants || 1,
        vehicleType: costBreakdown?.vehicleType || selectedVehicle || '',
        needDriver: costBreakdown?.needDriver || needDriver || false,
        needGuide: costBreakdown?.needGuide || needGuide || false
      };
      
      console.log('🎯 ===== FINALIZE REQUEST DETAILS =====');
      console.log('🎯 Request URL will be: /groups/{groupId}/finalize');
      console.log('🎯 Group ID in URL:', groupId);
      console.log('🎯 Request body data:', finalizeData);
      console.log('🎯 User ID being sent:', finalizeData.userId);
      console.log('🎯 Action being sent:', finalizeData.action);
      console.log('🎯 Cost breakdown being sent:');
      console.log('  - averageDriverCost:', finalizeData.averageDriverCost);
      console.log('  - averageGuideCost:', finalizeData.averageGuideCost);
      console.log('  - totalCost:', finalizeData.totalCost);
      console.log('  - costPerPerson:', finalizeData.costPerPerson);
      console.log('  - maxParticipants:', finalizeData.maxParticipants);
      console.log('  - vehicleType:', finalizeData.vehicleType);
      console.log('  - needDriver:', finalizeData.needDriver);
      console.log('  - needGuide:', finalizeData.needGuide);
      console.log('🎯 getUserUID():', getUserUID());
      console.log('🎯 user?.uid:', user?.uid);
      console.log('🎯 userUid:', userUid);
      console.log('🎯 Final userId chosen:', currentUserId);
      console.log('🎯 ===== END FINALIZE REQUEST DETAILS =====');
      
      console.log('🎯 Calling PoolsApi.finalizeGroup with groupId:', groupId, 'and data:', finalizeData);
      
      const response = await PoolsApi.finalizeGroup(groupId, finalizeData);
      
      console.log('🎯 ===== FINALIZE RESPONSE ANALYSIS =====');
      console.log('🎯 Finalize response:', response);
      console.log('🎯 Response success:', response?.success);
      console.log('🎯 Response status:', response?.status);
      console.log('🎯 Response message:', response?.message);
      console.log('🎯 ===== END FINALIZE RESPONSE ANALYSIS =====');
      
      if (response.success || response.status === 'success') {
        console.log('✅ Trip finalized successfully');
        
        alert('Trip created and finalized successfully!');
        
        // Navigate to pools page with success message
        navigate('/pools', {
          state: {
            newPool: {
              id: groupId || tripId || Date.now(),
              tripId: tripId,
              groupId: groupId,
              name: tripName,
              startDate: startDate,
              endDate: endDate,
              terrains: terrains,
              activities: activities,
              itinerary: itinerary,
              createdAt: new Date(),
              status: 'finalized'
            },
            message: 'Trip created and finalized successfully!'
          }
        });
      } else {
        throw new Error(response.message || 'Failed to finalize trip');
      }
    } catch (error) {
      console.error('❌ ===== FINALIZE ERROR ANALYSIS =====');
      console.error('❌ Error finalizing trip:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ ===== END FINALIZE ERROR ANALYSIS =====');
      
      alert(`Error finalizing trip: ${error.message}`);
    }
    
    setIsFinalizingTrip(false);
  };

  // Handle joining a similar trip
  const handleJoinSimilarTrip = (suggestionPool) => {
    console.log('🤝 ===== JOINING SIMILAR TRIP =====');
    console.log('🤝 Selected trip to join:', suggestionPool);
    console.log('🤝 Original group data:', suggestionPool.originalGroup);
    console.log('🤝 ===== END JOIN SIMILAR TRIP =====');
    
    setSelectedTripToJoin(suggestionPool);
    setShowJoinModal(true);
  };

  // Handle pool card click (view details)
  const handlePoolClick = (poolData) => {
    console.log('👀 Pool card clicked for details:', poolData);
    // Could navigate to detailed trip view in the future
  };

  // Handle successful join
  const handleJoinSuccess = () => {
    console.log('✅ Successfully joined similar trip');
    setShowJoinModal(false);
    
    alert('Successfully joined similar trip!');
    
    // Navigate to pools page
    navigate('/pools', {
      state: {
        message: 'Successfully joined similar trip!'
      }
    });
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to PoolItineraryPage
  };

  // Transform suggestions to pool format
  const transformedSuggestions = suggestions.map(transformSuggestionToPoolFormat);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Itinerary
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Trip Suggestions for "{tripName}"
            </h1>
            <p className="text-gray-600 mb-4">
              We've saved your trip and found {totalSuggestions} similar trips. 
              You can join an existing group or continue with your own trip.
            </p>
            
            {/* Trip Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Your Trip Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span><strong>Dates:</strong> {formatDate(startDate)} - {formatDate(endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span><strong>Destinations:</strong> {destinations?.map(d => d.name).join(', ') || 'Various'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span><strong>Activities:</strong> {activities?.slice(0, 2).join(', ') || 'Various'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span><strong>Terrains:</strong> {terrains?.slice(0, 2).join(', ') || 'Various'}</span>
                </div>
              </div>
              
              {/* Cost Breakdown Display */}
              {costBreakdown && (costBreakdown.totalCost > 0) && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Cost Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {costBreakdown.needDriver && (
                      <div className="bg-white rounded px-3 py-2">
                        <span className="text-gray-600">Driver Cost:</span>
                        <div className="font-semibold text-blue-800">LKR {costBreakdown.averageDriverCost?.toLocaleString() || '0'}</div>
                      </div>
                    )}
                    {costBreakdown.needGuide && (
                      <div className="bg-white rounded px-3 py-2">
                        <span className="text-gray-600">Guide Cost:</span>
                        <div className="font-semibold text-blue-800">LKR {costBreakdown.averageGuideCost?.toLocaleString() || '0'}</div>
                      </div>
                    )}
                    <div className="bg-white rounded px-3 py-2">
                      <span className="text-gray-600">Total Cost:</span>
                      <div className="font-semibold text-blue-800">LKR {costBreakdown.totalCost?.toLocaleString() || '0'}</div>
                    </div>
                    <div className="bg-white rounded px-3 py-2">
                      <span className="text-gray-600">Per Person:</span>
                      <div className="font-semibold text-green-700">LKR {costBreakdown.costPerPerson?.toLocaleString() || '0'}</div>
                    </div>
                  </div>
                  {costBreakdown.vehicleType && (
                    <div className="mt-2 text-xs text-blue-700">
                      <strong>Vehicle:</strong> {costBreakdown.vehicleType} (Max {costBreakdown.maxParticipants} people)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Trips Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Similar Trips Available {totalSuggestions > 0 && `(${totalSuggestions} found)`}
            </h2>
          </div>

          {transformedSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {transformedSuggestions.map((pool) => (
                <PoolCard 
                  key={pool.id} 
                  pool={pool} 
                  onJoinPool={handleJoinSimilarTrip}
                  onClick={handlePoolClick}
                  buttonText="Request to Join"
                  showCompatibilityScore={true}
                  compatibilityScore={pool.compatibilityScore}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Similar Trips Found</h3>
              <p className="text-gray-600 mb-6">
                No existing trips match your preferences right now. 
                You can create your own trip with your exact preferences!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCreateMyTrip}
              disabled={isFinalizingTrip}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isFinalizingTrip ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Finalizing Trip...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Create My Trip
                </>
              )}
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Back to Itinerary
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            You can create your own trip or join one of the similar trips above
          </p>
        </div>
      </div>

      {/* Join Modal */}
      <JoinPoolModal
        show={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        pool={selectedTripToJoin}
        onJoinSuccess={handleJoinSuccess}
      />

      <Footer />
    </div>
  );
};

export default TripSuggestionsPage;

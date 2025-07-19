import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin, FiUsers, FiCalendar, FiDollarSign, FiStar, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import { PoolsApi } from '../../api/poolsApi';
import { useAuth } from '../../hooks/useAuth';
import JoinPoolModal from '../../components/JoinPoolModal';

const TripSuggestionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [finalizingGroup, setFinalizingGroup] = useState(null);

  // Get trip data from navigation state
  const tripData = location.state?.tripData;
  const groupId = location.state?.groupId;

  useEffect(() => {
    if (tripData && groupId && user) {
      fetchSuggestions();
    } else {
      setError('Missing trip data or user information');
      setLoading(false);
    }
  }, [tripData, groupId, user]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await PoolsApi.saveTripAndGetSuggestions(groupId, {
        userId: user.uid,
        tripDetails: tripData,
        optionalField: 'suggestion_request'
      });

      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinExistingPool = (pool) => {
    setSelectedPool(pool);
    setJoinModalOpen(true);
  };

  const handleJoinSuccess = async (result) => {
    console.log('Join request sent:', result);
    alert('Join request sent successfully! All group members must approve before you can join.');
    setJoinModalOpen(false);
    setSelectedPool(null);
  };

  const handleFinalizeNewGroup = async () => {
    if (!groupId || !user) {
      alert('Missing group information');
      return;
    }

    try {
      setFinalizingGroup(groupId);
      
      const result = await PoolsApi.finalizeGroup(groupId, {
        userId: user.uid,
        action: 'finalize'
      });

      alert('Group finalized successfully! Your new travel group is now active.');
      navigate('/trips'); // Navigate to user's trips page
      
    } catch (error) {
      console.error('Error finalizing group:', error);
      alert(`Failed to finalize group: ${error.message}`);
    } finally {
      setFinalizingGroup(null);
    }
  };

  const handleCancelGroup = async (reason) => {
    if (!groupId || !user) {
      alert('Missing group information');
      return;
    }

    try {
      setFinalizingGroup(groupId);
      
      const result = await PoolsApi.finalizeGroup(groupId, {
        userId: user.uid,
        action: 'cancel',
        reason: reason || 'User chose to join existing group'
      });

      console.log('Group cancelled:', result);
      
    } catch (error) {
      console.error('Error cancelling group:', error);
      // Don't show error to user as this might be called when joining another group
    } finally {
      setFinalizingGroup(null);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Please log in</h3>
          <p className="text-gray-600">You need to be logged in to view trip suggestions.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Trip Suggestions
                </h1>
                <p className="text-gray-600">
                  Found similar groups for your trip "{tripData?.tripName || 'Unnamed Trip'}"
                </p>
              </div>
              <button
                onClick={handleGoBack}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Finding similar groups...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={fetchSuggestions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Trip Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Trip Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Trip Name</h3>
                  <p className="text-gray-600">{tripData?.tripName || 'Unnamed Trip'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Places to Visit</h3>
                  <p className="text-gray-600">
                    {tripData?.places?.join(', ') || 'No places specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Similar Groups Available
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.groupId} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {suggestion.groupName}
                          </h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Available
                          </span>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-600">
                            <FiMapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{suggestion.baseCity}</span>
                          </div>
                          
                          {suggestion.memberCount && (
                            <div className="flex items-center text-gray-600">
                              <FiUsers className="w-4 h-4 mr-2" />
                              <span className="text-sm">
                                {suggestion.memberCount}/{suggestion.maxMembers || 'N/A'} members
                              </span>
                            </div>
                          )}
                          
                          {suggestion.startDate && (
                            <div className="flex items-center text-gray-600">
                              <FiCalendar className="w-4 h-4 mr-2" />
                              <span className="text-sm">
                                {new Date(suggestion.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          {suggestion.estimatedCost && (
                            <div className="flex items-center text-gray-600">
                              <FiDollarSign className="w-4 h-4 mr-2" />
                              <span className="text-sm">${suggestion.estimatedCost}</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleJoinExistingPool(suggestion)}
                          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <FiArrowRight className="w-4 h-4 mr-2" />
                          Request to Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 mb-8">
                <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Similar Groups Found
                </h3>
                <p className="text-gray-600">
                  No existing groups match your trip preferences. You can create a new group instead.
                </p>
              </div>
            )}

            {/* Create New Group Option */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
              <div className="text-center">
                <FiUsers className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Create Your Own Group
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  {suggestions.length > 0 
                    ? "Didn't find the perfect match? Create your own travel group and invite others to join your adventure!"
                    : "Start your own travel group and connect with like-minded travelers for your trip."
                  }
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handleGoBack}
                    className="flex items-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Go Back
                  </button>
                  
                  <button
                    onClick={handleFinalizeNewGroup}
                    disabled={finalizingGroup === groupId}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {finalizingGroup === groupId ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <FiCheck className="w-4 h-4 mr-2" />
                    )}
                    Create New Group
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Join Pool Modal */}
      <JoinPoolModal
        open={joinModalOpen}
        onClose={() => {
          setJoinModalOpen(false);
          setSelectedPool(null);
        }}
        poolData={selectedPool}
        onSuccess={(result) => {
          handleJoinSuccess(result);
          // Cancel the new group since user is joining existing one
          handleCancelGroup('User joined existing group');
        }}
      />
    </div>
  );
};

export default TripSuggestionsPage;

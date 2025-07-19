import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign,
  Clock,
  Star,
  ChevronRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PoolCard from '../../components/PoolCard';
import PoolsApi from '../../api/poolsApi';
import { getUserUID } from '../../utils/userStorage';

const CompatibleGroupsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get preferences from previous page
  const { 
    preferences, 
    poolName,
    selectedDates,
    poolSize,
    poolPrivacy 
  } = location.state || {};

  const [compatibleGroups, setCompatibleGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [creatingGroup, setCreatingGroup] = useState(false);

  console.log('🔍 CompatibleGroupsPage received preferences:', preferences);

  useEffect(() => {
    if (!preferences) {
      // If no preferences provided, redirect back to preferences page
      navigate('/pool-preferences', { replace: true });
      return;
    }

    fetchCompatibleGroups();
  }, [preferences]);

  const fetchCompatibleGroups = async () => {
    if (!preferences) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Searching for compatible groups with preferences:', preferences);
      
      const response = await PoolsApi.preCheckCompatibleGroups(preferences);
      
      if (response.status === 'success') {
        setCompatibleGroups(response.compatibleGroups || []);
        console.log(`✅ Found ${response.compatibleGroups?.length || 0} compatible groups`);
      } else {
        throw new Error(response.message || 'Failed to find compatible groups');
      }

    } catch (error) {
      console.error('❌ Error fetching compatible groups:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (group) => {
    try {
      setJoiningGroup(group.groupId);
      
      const userId = getUserUID();
      if (!userId) {
        alert('Please log in to join a group');
        navigate('/login');
        return;
      }

      console.log('🤝 Requesting to join group:', group.groupName);
      
      // For now, we'll use a simple join request
      // You can expand this to use a proper join request API
      const result = await PoolsApi.joinPool(group.groupId, userId);
      
      alert(`Successfully requested to join ${group.groupName}!`);
      
      // Navigate to the group details or pools page
      navigate('/pools');
      
    } catch (error) {
      console.error('❌ Error joining group:', error);
      alert(`Failed to join group: ${error.message}`);
    } finally {
      setJoiningGroup(null);
    }
  };

  const handleCreateNewGroup = async () => {
    try {
      setCreatingGroup(true);
      
      const userId = getUserUID();
      if (!userId) {
        alert('Please log in to create a group');
        navigate('/login');
        return;
      }

      if (!preferences) {
        alert('Preferences not found. Please go back and set your preferences.');
        return;
      }

      // Prepare group data similar to the preferences page
      const groupData = {
        // Required fields
        userId: userId,
        tripName: poolName || 'My Adventure Trip',
        startDate: preferences.startDate,
        endDate: preferences.endDate,
        baseCity: preferences.baseCity || 'Colombo',
        groupName: poolName || 'My Adventure Group',
        
        // Optional fields with defaults
        multiCityAllowed: preferences.multiCityAllowed !== undefined ? preferences.multiCityAllowed : true,
        activityPacing: preferences.activityPacing || 'Normal',
        budgetLevel: preferences.budgetLevel || 'Medium',
        preferredTerrains: preferences.preferredTerrains || [],
        preferredActivities: preferences.preferredActivities || [],
        visibility: poolPrivacy || 'public',
        maxMembers: poolSize || 6,
        requiresApproval: false,
        additionalPreferences: {}
      };

      console.log('🌟 Creating new group with data:', groupData);
      
      const result = await PoolsApi.createGroupWithTrip(groupData);
      
      // Check response status and handle success
      if (result.status === 'success' && result.groupId && result.tripId) {
        console.log('🎉 Group created successfully:', {
          groupId: result.groupId,
          tripId: result.tripId,
          isDraft: result.isDraft
        });
        
        alert(`Group created successfully! You can now plan your trip.`);
        
        // Navigate to pool itinerary page
        navigate('/pool-itinerary', {
          state: {
            tripId: result.tripId,
            groupId: result.groupId,
            tripName: poolName || 'My Adventure Trip',
            poolName: poolName || 'My Adventure Group',
            startDate: preferences.startDate,
            endDate: preferences.endDate,
            selectedTerrains: preferences.preferredTerrains || [],
            selectedActivities: preferences.preferredActivities || [],
            userUid: userId,
            isDraft: result.isDraft
          }
        });
      } else {
        throw new Error(result.message || 'Unexpected response format');
      }

    } catch (error) {
      console.error('❌ Error creating group:', error);
      alert(`Failed to create group: ${error.message}`);
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleRefresh = () => {
    fetchCompatibleGroups();
  };

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

  const formatPreferences = (items) => {
    if (!items || items.length === 0) return 'None specified';
    return items.slice(0, 3).join(', ') + (items.length > 3 ? `, +${items.length - 3} more` : '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Preferences
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Compatible Travel Groups
            </h1>
            <p className="text-gray-600 mb-4">
              We found groups that match your travel preferences. You can join an existing group or create your own at any time.
            </p>
            
            {/* Your Preferences Summary */}
            {preferences && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Your Travel Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span><strong>From:</strong> {preferences.baseCity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span><strong>Dates:</strong> {formatDate(preferences.startDate)} - {formatDate(preferences.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span><strong>Budget:</strong> {preferences.budgetLevel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span><strong>Pace:</strong> {preferences.activityPacing}</span>
                  </div>
                </div>
                
                {(preferences.preferredActivities?.length > 0 || preferences.preferredTerrains?.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {preferences.preferredActivities?.length > 0 && (
                        <div>
                          <strong className="text-blue-900">Activities:</strong> {formatPreferences(preferences.preferredActivities)}
                        </div>
                      )}
                      {preferences.preferredTerrains?.length > 0 && (
                        <div>
                          <strong className="text-blue-900">Terrains:</strong> {formatPreferences(preferences.preferredTerrains)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Compatible Groups Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Compatible Groups {!loading && `(${compatibleGroups.length} found)`}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              {/* Always show Create New Group button */}
              <button
                onClick={handleCreateNewGroup}
                disabled={creatingGroup}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingGroup ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create New Group
                  </>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Searching for compatible groups...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-800 font-medium mb-2">Failed to load compatible groups</div>
              <div className="text-red-600 text-sm mb-4">{error}</div>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : compatibleGroups.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Compatible Groups Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any existing groups that match your preferences. 
                No worries - you can create your own group with your exact preferences!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {compatibleGroups.map((group) => (
                <CompatibleGroupCard 
                  key={group.groupId} 
                  group={group}
                  onJoin={handleJoinGroup}
                  isJoining={joiningGroup === group.groupId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Compatible Group Card Component
const CompatibleGroupCard = ({ group, onJoin, isJoining }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{group.groupName}</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Compatible
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{group.baseCity}</span>
            </div>
            {group.memberCount !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{group.memberCount} members</span>
              </div>
            )}
            {group.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{group.rating}/5</span>
              </div>
            )}
          </div>
          
          {group.description && (
            <p className="text-gray-700 text-sm mb-4">{group.description}</p>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onJoin(group)}
            disabled={isJoining}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Request to Join
              </>
            )}
          </button>
          
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition-colors"
            onClick={() => {
              // Navigate to group details if available
              console.log('View details for group:', group.groupId);
            }}
          >
            View Details
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompatibleGroupsPage;

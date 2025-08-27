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
import { useAuth } from '../../hooks/useAuth';

// Utility function to remove duplicates and sort by compatibility
const deduplicateAndSortGroups = (groups) => {
  if (!groups || !Array.isArray(groups)) return [];
  
  // Create a map to track unique groups by name and base location
  const uniqueGroups = new Map();
  
  groups.forEach(group => {
    const key = `${group.groupName?.toLowerCase()}_${group.baseCity?.toLowerCase()}`;
    
    // Keep the group with higher compatibility score if duplicates exist
    if (!uniqueGroups.has(key) || 
        (group.compatibilityScore && group.compatibilityScore > uniqueGroups.get(key).compatibilityScore)) {
      uniqueGroups.set(key, group);
    }
  });
  
  // Convert back to array and sort by compatibility score (highest first)
  return Array.from(uniqueGroups.values())
    .sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
};

// Transform compatible groups data to match PoolCard expected format
const transformGroupToPoolFormat = (group) => {
  return {
    // Required PoolCard fields
    id: group.groupId || group.id,
    name: group.groupName || 'Adventure Group',
    image: group.image || '/api/placeholder/400/250', // Default placeholder
    price: group.estimatedCost || 'Price TBD',
    owner: group.organizer || 'Group Organizer',
    destinations: group.baseCity || group.destinations || 'Sri Lanka',
    date: group.startDate && group.endDate 
      ? `${formatDate(group.startDate)} - ${formatDate(group.endDate)}`
      : 'Dates TBD',
    duration: group.tripDuration || calculateDuration(group.startDate, group.endDate),
    participants: group.memberCount || group.currentMembers || 0,
    maxParticipants: group.maxMembers || group.maxParticipants || 6,
    status: group.status || 'open',
    highlights: group.preferredActivities || group.activities || [],
    
    // Additional compatibility data
    compatibilityScore: group.compatibilityScore,
    compatibilityDetails: group.compatibilityDetails,
    
    // Original group data for join operations
    originalGroup: group
  };
};

// Helper function to calculate duration between dates
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

// Helper function to format dates
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

const CompatibleGroupsPage = () => {
  const location = useLocation();
  const { user } = useAuth();
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
        const uniqueGroups = deduplicateAndSortGroups(response.suggestions || []);
        // Transform groups to match PoolCard format
        const transformedGroups = uniqueGroups.map(transformGroupToPoolFormat);
        setCompatibleGroups(transformedGroups);
        console.log(`✅ Found ${response.suggestions?.length || 0} total groups, ${uniqueGroups.length} unique groups after deduplication`);
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

  const handleJoinGroup = async (poolData) => {
    try {
      // Extract original group data from the transformed pool data
      const group = poolData.originalGroup || poolData;
      setJoiningGroup(group.groupId || poolData.id);
      
      const userId = getUserUID();
      if (!userId) {
        alert('Please log in to join a group');
        navigate('/login');
        return;
      }

      console.log('🤝 Requesting to join group:', group.groupName || poolData.name);
      
      // For now, we'll use a simple join request
      // You can expand this to use a proper join request API
      const result = await PoolsApi.joinPool(group.groupId || poolData.id, userId);
      
      alert(`Successfully requested to join ${group.groupName || poolData.name}!`);
      
      // Navigate to the group details or pools page
      navigate('/pools');
      
    } catch (error) {
      console.error('❌ Error joining group:', error);
      alert(`Failed to join group: ${error.message}`);
    } finally {
      setJoiningGroup(null);
    }
  };

  const handlePoolClick = (poolData) => {
    // Navigate to group details or show more info
    const group = poolData.originalGroup || poolData;
    console.log('👀 View details for group:', group.groupId || poolData.id);
    // You can navigate to a detailed group view page here
    // navigate(`/pools/${group.groupId || poolData.id}`);
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
        userEmail: user?.email || 'user@example.com', // Add userEmail field
        tripName: poolName || 'My Adventure Trip',
        startDate: preferences.startDate,
        endDate: preferences.endDate,
        baseCity: preferences.baseCity || 'Colombo',
        groupName: poolName || 'My Adventure Group',
        
        // Optional fields with defaults
        arrivalTime: "14:30", // Default arrival time
        multiCityAllowed: preferences.multiCityAllowed !== undefined ? preferences.multiCityAllowed : true,
        activityPacing: preferences.activityPacing || 'Normal',
        budgetLevel: preferences.budgetLevel || 'Medium',
        preferredTerrains: preferences.preferredTerrains || [],
        preferredActivities: preferences.preferredActivities || [],
        visibility: poolPrivacy || 'public',
        maxMembers: poolSize || 6,
        requiresApproval: false
      };

      console.log('🌟 Creating new group with data:', groupData);
      
      const result = await PoolsApi.createGroupWithTrip(groupData);
      
      console.log('✅ API Success response:', result);
      console.log('🔍 Checking response structure:', {
        hasGroupId: !!result.groupId,
        hasTrippId: !!result.tripId,
        groupIdValue: result.groupId,
        tripIdValue: result.tripId,
        status: result.status,
        draft: result.draft,
        fullResponse: result
      });
      
      // Extract IDs from the exact API response structure
      const extractedGroupId = result.groupId;
      const extractedTripId = result.tripId;
      const responseStatus = result.status;
      const isDraft = result.draft; // API uses "draft" not "isDraft"
      
      console.log('🔧 Extracted values:', {
        extractedGroupId,
        extractedTripId,
        responseStatus,
        isDraft
      });
      
      // Check response status and handle success
      if (responseStatus === 'success' && extractedGroupId && extractedTripId) {
        console.log('🎉 Group created successfully:', {
          groupId: extractedGroupId,
          tripId: extractedTripId,
          isDraft: isDraft
        });
        
        alert(`Group created successfully! You can now plan your trip.`);
        
        // Navigate to pool itinerary page
        navigate('/pool-itinerary', {
          state: {
            tripId: extractedTripId,
            groupId: extractedGroupId,
            tripName: poolName || 'My Adventure Trip',
            poolName: poolName || 'My Adventure Group',
            startDate: preferences.startDate,
            endDate: preferences.endDate,
            selectedTerrains: preferences.preferredTerrains || [],
            selectedActivities: preferences.preferredActivities || [],
            userUid: userId,
            isDraft: isDraft
          }
        });
      } else if (extractedGroupId && extractedTripId) {
        // IDs found but status might be different
        console.log('🔧 Found IDs but status unclear, proceeding anyway...');
        navigate('/pool-itinerary', {
          state: {
            tripId: extractedTripId,
            groupId: extractedGroupId,
            tripName: poolName || 'My Adventure Trip',
            poolName: poolName || 'My Adventure Group',
            startDate: preferences.startDate,
            endDate: preferences.endDate,
            selectedTerrains: preferences.preferredTerrains || [],
            selectedActivities: preferences.preferredActivities || [],
            userUid: userId,
            isDraft: isDraft || true
          }
        });
      } else {
        console.error('❌ Could not extract required IDs from API response:', result);
        console.error('🔍 Missing required fields:', {
          missingGroupId: !extractedGroupId,
          missingTripId: !extractedTripId,
          responseStatus: responseStatus
        });
        
        throw new Error(result.message || 'Missing required group or trip ID from server response');
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compatibleGroups.map((pool) => (
                <PoolCard 
                  key={pool.id} 
                  pool={pool} 
                  onJoinPool={handleJoinGroup}
                  onClick={handlePoolClick}
                  buttonText="Request to Join"
                  showCompatibilityScore={true}
                  compatibilityScore={pool.compatibilityScore}
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

export default CompatibleGroupsPage;

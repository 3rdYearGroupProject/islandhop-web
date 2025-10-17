import { poolingServicesApi, userServicesApi } from './axios';
import { getAuth } from 'firebase/auth';

/**
 * Pool API service for managing pool/group operations
 */
export class PoolsApi {
  /**
   * Fetch enhanced public pools with filtering capabilities
   * @param {Object} params - Filter parameters
   * @param {string} [params.userId] - Current user ID (optional)
   * @param {string} [params.baseCity] - Filter by base city
   * @param {string} [params.startDate] - Filter by start date
   * @param {string} [params.endDate] - Filter by end date
   * @param {string} [params.budgetLevel] - Filter by budget level
   * @param {string[]} [params.preferredActivities] - Filter by preferred activities
   * @returns {Promise<Array>} Array of enhanced pool data
   */
  static async getEnhancedPools(params = {}) {
    try {
      console.log('🏊‍♂️ Fetching enhanced pools with params:', params);
      
      // Only include parameters that have values
      const requestParams = {};
      
      if (params.userId) requestParams.userId = params.userId;
      if (params.baseCity) requestParams.baseCity = params.baseCity;
      if (params.startDate) requestParams.startDate = params.startDate;
      if (params.endDate) requestParams.endDate = params.endDate;
      if (params.budgetLevel) requestParams.budgetLevel = params.budgetLevel;
      if (params.preferredActivities && params.preferredActivities.length > 0) {
        requestParams.preferredActivities = params.preferredActivities;
      }
      
      const response = await poolingServicesApi.get('/groups/public/enhanced', {
        params: requestParams
      });

      console.log('🟡 [PUBLIC POOLS] Enhanced PUBLIC pools fetched successfully:', response.data);
      console.log('🟡 [PUBLIC POOLS] WARNING: This should NOT be called from MyPools page!');
      console.trace('🟡 [PUBLIC POOLS] Call stack to find where this was called from:');
      return response.data;
    } catch (error) {
      console.error('🏊‍♂️❌ Error fetching enhanced pools:', error);
      throw new Error(`Failed to fetch pools: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Pre-check for compatible public groups before creating a new one
   * @param {Object} preferences - User preferences for trip matching
   * @param {string} preferences.userId - Current user ID
   * @param {string} preferences.baseCity - Starting city
   * @param {string} preferences.startDate - Trip start date (YYYY-MM-DD)
   * @param {string} preferences.endDate - Trip end date (YYYY-MM-DD)
   * @param {string} preferences.budgetLevel - Budget level (Low/Medium/High)
   * @param {string[]} preferences.preferredActivities - Array of preferred activities
   * @param {string[]} preferences.preferredTerrains - Array of preferred terrains
   * @param {string} preferences.activityPacing - Activity pacing (Relaxed/Normal/Intense)
   * @param {boolean} preferences.multiCityAllowed - Whether multi-city trips are allowed
   * @returns {Promise<Object>} Compatible groups response
   */
  static async preCheckCompatibleGroups(preferences) {
    try {
      console.log('🏊‍♂️ Pre-checking compatible groups with preferences:', preferences);
      
      // Use the exact path from your API specification: /v1/public-pooling/pre-check
      // Since base URL is http://localhost:8086/api/v1, we need to construct the full URL manually
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/public-pooling/pre-check`;
      
      console.log('🌐 Making request to:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🏊‍♂️ Compatible groups found:', result);
      return result;
    } catch (error) {
      console.error('🏊‍♂️❌ Error pre-checking compatible groups:', error);
      throw new Error(`Failed to find compatible groups: ${error.message}`);
    }
  }

  /**
   * Create a new group with trip planning
   * @param {Object} groupData - Group creation data
   * @param {string} groupData.userId - Current user ID
   * @param {string} groupData.tripName - Name of the trip
   * @param {string} groupData.startDate - Trip start date (YYYY-MM-DD)
   * @param {string} groupData.endDate - Trip end date (YYYY-MM-DD)
   * @param {string} groupData.baseCity - Starting city
   * @param {string} groupData.groupName - Name of the group
   * @param {boolean} [groupData.multiCityAllowed] - Whether multi-city trips are allowed
   * @param {string} [groupData.activityPacing] - Activity pacing (Relaxed/Normal/Intense)
   * @param {string} [groupData.budgetLevel] - Budget level (Low/Medium/High)
   * @param {string[]} [groupData.preferredTerrains] - Array of preferred terrains
   * @param {string[]} [groupData.preferredActivities] - Array of preferred activities
   * @param {string} [groupData.visibility] - Group visibility (public/private)
   * @param {number} [groupData.maxMembers] - Maximum number of members
   * @param {boolean} [groupData.requiresApproval] - Whether group requires approval to join
   * @param {Object} [groupData.additionalPreferences] - Additional preferences
   * @returns {Promise<Object>} Group creation response
   * @note Email will be automatically fetched from the current logged-in user
   */
  static async createGroupWithTrip(groupData) {
    try {
      console.log('🏊‍♂️ Creating group with trip:', groupData);
      
      // Get current user's email from Firebase Auth and backend profile
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found. Please log in to create a group.');
      }
      
      let userEmail = currentUser.email;
      console.log('🏊‍♂️ Firebase user email:', userEmail);
      
      // If no email from Firebase, try to fetch from backend profile
      if (!userEmail && groupData.userId) {
        try {
          console.log('🏊‍♂️ Fetching email from user profile for userId:', groupData.userId);
          const profileResponse = await userServicesApi.get('/tourist/profile', { 
            params: { email: currentUser.email || groupData.userId } 
          });
          userEmail = profileResponse.data?.email || currentUser.email;
          console.log('🏊‍♂️ Email from profile API:', userEmail);
        } catch (profileError) {
          console.warn('🏊‍♂️⚠️ Could not fetch email from profile, using Firebase email:', profileError.message);
          userEmail = currentUser.email;
        }
      }
      
      if (!userEmail) {
        throw new Error('Could not determine user email. Please ensure your profile is complete.');
      }
      
      // Create the complete request payload with email
      const completeGroupData = {
        ...groupData,
        email: userEmail // Automatically include the current user's email
      };
      
      console.log('🏊‍♂️ Email automatically added to request:', userEmail);
      console.log('🏊‍♂️ Complete request payload:', JSON.stringify(completeGroupData, null, 2));
      console.log('🏊‍♂️ Email field specifically:', completeGroupData.email);
      console.log('🏊‍♂️ UserId field:', completeGroupData.userId);
      
      const response = await poolingServicesApi.post('/groups/with-trip', completeGroupData);

      console.log('🏊‍♂️ Group created successfully:', response.data);
      console.log('🏊‍♂️ Response before navigation - Full response:', response);
      console.log('🏊‍♂️ Response before navigation - Status:', response.status);
      console.log('🏊‍♂️ Response before navigation - Data keys:', Object.keys(response.data || {}));
      console.log('🏊‍♂️ Response before navigation - Data:', response.data);
      console.log('🏊‍♂️ Response before navigation:', response.data);
      // Also store in localStorage for debugging
      localStorage.setItem('lastApiResponse', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('🏊‍♂️❌ Error creating group with trip:', error);
      console.error('🏊‍♂️❌ Request data that failed:', groupData);
      console.error('🏊‍♂️❌ Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      throw new Error(`Failed to create group: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Convert enhanced group response to frontend pool format
   * @param {Object} group - Enhanced group response from backend
   * @returns {Object} Pool object in frontend format
   */
  static convertToPoolFormat(group) {
    // Debug log to check group structure
    console.log('🔍 convertToPoolFormat - Raw group data:', group);
    console.log('🔍 convertToPoolFormat - Group visibility:', group.visibility);
    
    // Create a comprehensive pool object that matches the existing frontend format
    return {
      id: group.groupId,
      groupId: group.groupId,
      tripId: group.tripId,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', // Default image
      name: group.tripName || group.groupName || 'Adventure Trip',
      owner: group.creatorName || 'Unknown',
      creatorUserId: group.creatorUserId,
      destinations: Array.isArray(group.cities) ? group.cities.join(', ') : (group.baseCity || 'Various Locations'),
      cities: group.cities || [],
      participants: group.memberCount || 0,
      maxParticipants: group.maxMembers || 6,
      memberCountText: group.memberCountText || `${group.memberCount || 0} participants / ${group.maxMembers || 6}`,
      rating: 4.5, // Default rating since it's not in the API response
      price: this.calculatePrice(group.budgetLevel),
      date: group.formattedDateRange || this.formatDateRange(group.startDate, group.endDate),
      duration: group.tripDurationDays ? `${group.tripDurationDays} days` : 'Multi-day',
      status: group.status || 'open',
      visibility: group.visibility || 'private', // Add visibility property
      highlights: group.topAttractions || [],
      members: group.members || [], // Add member data if available
      
      // Additional data from backend
      baseCity: group.baseCity,
      startDate: group.startDate,
      endDate: group.endDate,
      budgetLevel: group.budgetLevel,
      activityPacing: group.activityPacing,
      preferredActivities: group.preferredActivities || [],
      preferredTerrains: group.preferredTerrains || [],
      tripDurationDays: group.tripDurationDays,
      createdAt: group.createdAt,
      
      // Create a basic itinerary from cities if available
      itinerary: this.createBasicItinerary(group)
    };
  }

  /**
   * Calculate price display based on budget level
   * @param {string} budgetLevel - Budget level from backend
   * @returns {string} Formatted price string
   */
  static calculatePrice(budgetLevel) {
    switch (budgetLevel?.toLowerCase()) {
      case 'low':
        return 'Rs. 10,000 - 15,000';
      case 'medium':
        return 'Rs. 15,000 - 25,000';
      case 'high':
        return 'Rs. 25,000+';
      default:
        return 'Contact for pricing';
    }
  }

  /**
   * Format date range for display
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {string} Formatted date range
   */
  static formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return 'Dates TBD';
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const startStr = start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const endStr = end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      
      return `${startStr} - ${endStr}`;
    } catch (error) {
      console.warn('Error formatting dates:', error);
      return 'Dates TBD';
    }
  }

  /**
   * Create a basic itinerary from cities and dates
   * @param {Object} group - Group data
   * @returns {Array} Basic itinerary array
   */
  static createBasicItinerary(group) {
    if (!group.cities || !Array.isArray(group.cities) || group.cities.length === 0) {
      return [];
    }

    const { cities, startDate, tripDurationDays } = group;
    const itinerary = [];

    cities.forEach((city, index) => {
      const dayDate = this.calculateDayDate(startDate, index);
      itinerary.push({
        day: index + 1,
        date: dayDate,
        location: city,
        activities: [
          `Explore ${city}`,
          'Local sightseeing',
          'Cultural experiences'
        ]
      });
    });

    return itinerary;
  }

  /**
   * Calculate date for a specific day of the trip
   * @param {string} startDate - Trip start date
   * @param {number} dayOffset - Number of days to add
   * @returns {string} Formatted date string
   */
  static calculateDayDate(startDate, dayOffset) {
    if (!startDate) return `Day ${dayOffset + 1}`;
    
    try {
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayOffset);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return `Day ${dayOffset + 1}`;
    }
  }

  /**
   * Join a pool/group (Updated to use new API)
   * @param {string} groupId - Group ID to join
   * @param {Object} joinData - Join request data
   * @param {string} joinData.userId - User ID joining the group
   * @param {string} joinData.userName - User name
   * @param {string} joinData.message - Personal message for join request
   * @param {Object} joinData.userProfile - User profile information
   * @returns {Promise<Object>} Join result
   * @note Email will be automatically fetched from the current logged-in user
   */
  static async joinPool(groupId, joinData) {
    try {
      console.log('🏊‍♂️ Requesting to join pool:', { groupId, joinData });
      
      // Get current user's email from Firebase Auth and backend profile
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found. Please log in to join a pool.');
      }
      
      let userEmail = currentUser.email;
      console.log('🏊‍♂️ Firebase user email:', userEmail);
      
      // If no email from Firebase, try to fetch from backend profile
      if (!userEmail && joinData.userId) {
        try {
          console.log('🏊‍♂️ Fetching email from user profile for userId:', joinData.userId);
          const profileResponse = await userServicesApi.get('/tourist/profile', { 
            params: { email: currentUser.email || joinData.userId } 
          });
          userEmail = profileResponse.data?.email || currentUser.email;
          console.log('🏊‍♂️ Email from profile API:', userEmail);
        } catch (profileError) {
          console.warn('🏊‍♂️⚠️ Could not fetch email from profile, using Firebase email:', profileError.message);
          userEmail = currentUser.email;
        }
      }
      
      if (!userEmail) {
        throw new Error('Could not determine user email. Please ensure your profile is complete.');
      }
      
      // Create the complete request payload with email
      const completeJoinData = {
        ...joinData,
        userEmail: userEmail // Automatically include the current user's email
      };
      
      console.log('🏊‍♂️ Email automatically added to join request:', userEmail);
      console.log('🏊‍♂️ Complete join request payload:', JSON.stringify(completeJoinData, null, 2));
      console.log('🏊‍♂️ Email field specifically:', completeJoinData.userEmail);
      console.log('🏊‍♂️ UserId field:', completeJoinData.userId);
      
      // Use the new API endpoint for joining groups
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/${groupId}/join`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(completeJoinData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🏊‍♂️ Successfully submitted join request:', result);
      return result;
    } catch (error) {
      console.error('🏊‍♂️❌ Error joining pool:', error);
      console.error('🏊‍♂️❌ Join request data that failed:', joinData);
      console.error('🏊‍♂️❌ Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      throw new Error(`Failed to join pool: ${error.message}`);
    }
  }

  /**
   * Vote on a join request
   * @param {string} groupId - Group ID
   * @param {Object} voteData - Vote data
   * @param {string} voteData.userId - Current user ID (voting)
   * @param {string} voteData.joinRequestId - Join request ID
   * @param {string} voteData.action - 'approve' or 'reject'
   * @param {string} [voteData.reason] - Reason for rejection (optional)
   * @returns {Promise<Object>} Vote result
   */
  static async voteOnJoinRequest(groupId, voteData) {
    try {
      console.log('🗳️ Voting on join request:', { groupId, voteData });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/${groupId}/join-requests/vote`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(voteData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🗳️ Vote submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('🗳️❌ Error voting on join request:', error);
      throw new Error(`Failed to vote on join request: ${error.message}`);
    }
  }

  /**
   * Get pending join requests for a group
   * @param {string} groupId - Group ID
   * @param {string} userId - Current user ID
   * @returns {Promise<Object>} Pending join requests
   */
  static async getPendingJoinRequests(groupId, userId) {
    try {
      console.log('📋 Getting pending join requests for group:', groupId);
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/${groupId}/join-requests/pending?userId=${userId}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📋 Pending join requests fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('📋❌ Error fetching pending join requests:', error);
      throw new Error(`Failed to fetch pending join requests: ${error.message}`);
    }
  }

  /**
   * Get ALL pending items requiring user action - both invitations received and join requests to vote on.
   * This comprehensive endpoint combines:
   * 1. Invitations the user has received (to join groups)
   * 2. Join requests that need the user's vote (for groups they're a member of)
   * 
   * @param {string} userId - The ID of the current user
   * @param {string} userEmail - The email of the current user
   * @returns {Promise<Object>} ComprehensivePendingItemsResponse with all pending items requiring user attention
   */
  static async getAllPendingItems(userId, userEmail) {
    try {
      console.log('📋🔔 Starting getAllPendingItems for userId:', userId, 'userEmail:', userEmail);
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/all-pending-items?userId=${userId}&email=${encodeURIComponent(userEmail)}`;
      
      console.log('📋🔔 Making request to URL:', fullUrl);
      console.log('📋🔔 Base URL from env:', process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('📋🔔 Response status:', response.status);
      console.log('📋🔔 Response ok:', response.ok);
      console.log('📋🔔 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('📋🔔 Error response data:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📋🔔 All pending items fetched successfully:', result);
      console.log('📋🔔 Result type:', typeof result);
      console.log('📋🔔 Result keys:', Object.keys(result || {}));
      console.log('📋🔔 Total pending items:', result.totalPendingItems);
      console.log('📋🔔 Total invitations:', result.totalInvitations);
      console.log('📋🔔 Total vote requests:', result.totalVoteRequests);
      return result;
    } catch (error) {
      console.error('📋🔔❌ Error fetching all pending items:', error);
      console.error('📋🔔❌ Error name:', error.name);
      console.error('📋🔔❌ Error message:', error.message);
      console.error('📋🔔❌ Error stack:', error.stack);
      throw new Error(`Failed to fetch all pending items: ${error.message}`);
    }
  }

  /**
   * Get user invitations
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User invitations
   */
  static async getUserInvitations(userId) {
    try {
      console.log('📨 Starting getUserInvitations for userId:', userId);
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/invitations/${userId}`;
      
      console.log('📨 Making request to URL:', fullUrl);
      console.log('📨 Base URL from env:', process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);
      console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('📨 Error response data:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📨 User invitations fetched successfully:', result);
      console.log('📨 Result type:', typeof result);
      console.log('📨 Result keys:', Object.keys(result || {}));
      return result;
    } catch (error) {
      console.error('📨❌ Error fetching user invitations:', error);
      console.error('📨❌ Error name:', error.name);
      console.error('📨❌ Error message:', error.message);
      console.error('📨❌ Error stack:', error.stack);
      throw new Error(`Failed to fetch user invitations: ${error.message}`);
    }
  }

  /**
   * Get all pending requests that the user needs to vote on
   * GET /api/v1/groups/my-pending-requests?userId={userId}
   * @param {string} userId - Current user ID
   * @returns {Promise<Object>} All pending requests across groups where user is a member
   */
  static async getMyPendingRequests(userId) {
    try {
      console.log('🗳️ Starting getMyPendingRequests for userId:', userId);
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/my-pending-requests?userId=${userId}`;
      
      console.log('🗳️ Making request to URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('🗳️ Response status:', response.status);
      console.log('🗳️ Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('🗳️ Error response data:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🗳️ My pending requests fetched successfully:', result);
      console.log('🗳️ Total groups with pending requests:', result.totalGroups || 0);
      console.log('🗳️ Total pending requests:', result.totalPendingRequests || 0);
      return result;
    } catch (error) {
      console.error('🗳️❌ Error fetching my pending requests:', error);
      throw new Error(`Failed to fetch my pending requests: ${error.message}`);
    }
  }

  /**
   * Vote on a join request - Updated endpoint format
   * POST /api/v1/groups/{groupId}/join-requests/{requestUserId}/vote
   * @param {string} groupId - Group ID
   * @param {string} requestUserId - ID of user who requested to join
   * @param {Object} voteData - Vote data
   * @param {string} voteData.userId - Current user ID (voter)
   * @param {boolean} voteData.approved - true for approve, false for reject
   * @param {string} [voteData.comment] - Optional comment
   * @returns {Promise<Object>} Vote result
   */
  static async voteOnJoinRequestNew(groupId, requestUserId, voteData) {
    try {
      console.log('🗳️ Starting voteOnJoinRequestNew:', { groupId, requestUserId, voteData });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/${groupId}/join-requests/${requestUserId}/vote`;
      
      console.log('🗳️ Making vote request to URL:', fullUrl);
      console.log('🗳️ Request payload:', voteData);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(voteData)
      });

      console.log('🗳️ Vote response status:', response.status);
      console.log('🗳️ Vote response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('🗳️ Vote error response data:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🗳️ Vote submitted successfully:', result);
      console.log('🗳️ Final request status:', result.requestStatus);
      console.log('🗳️ Votes received:', result.totalVotesReceived, '/', result.totalMembersRequired);
      return result;
    } catch (error) {
      console.error('🗳️❌ Error voting on join request:', error);
      throw new Error(`Failed to vote on join request: ${error.message}`);
    }
  }

  /**
   * Respond to an invitation (accept or reject)
   * @param {Object} responseData - Response data
   * @param {string} responseData.invitationId - The ID of the invitation
   * @param {string} responseData.userId - Firebase UID of the responding user
   * @param {string} responseData.userEmail - Email of the responding user
   * @param {string} responseData.action - "accept" or "reject"
   * @param {string|null} [responseData.message] - Optional message when rejecting (null if not provided)
   * @returns {Promise<Object>} Response result
   */
  static async respondToInvitation(responseData) {
    try {
      console.log('📮 Starting respondToInvitation with data:', responseData);
      
      // Ensure the request body matches backend requirements exactly
      const requestBody = {
        invitationId: responseData.invitationId,
        userId: responseData.userId,
        userEmail: responseData.userEmail,
        action: responseData.action,  // "accept" or "reject"
        message: responseData.message || null // Optional, only for reject
      };
      
      console.log('📮 Structured request body:', requestBody);
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      // Ensure proper URL construction - add /api/v1 if not already present
      const apiBaseUrl = baseUrl.includes('/api/v1') ? baseUrl : `${baseUrl}/api/v1`;
      const fullUrl = `${apiBaseUrl}/groups/invitations/respond`;
      
      console.log('📮 Making request to URL:', fullUrl);
      console.log('📮 Request payload:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('📮 Response status:', response.status);
      console.log('📮 Response ok:', response.ok);
      console.log('📮 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('📮 Error response data:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Successfully responded to invitation:', result);
      console.log('📮 Result type:', typeof result);
      console.log('📮 Result keys:', Object.keys(result || {}));
      return result;
    } catch (error) {
      console.error('❌ Error responding to invitation:', error);
      console.error('📮❌ Error name:', error.name);
      console.error('📮❌ Error message:', error.message);
      console.error('📮❌ Error stack:', error.stack);
      throw new Error(`Failed to respond to invitation: ${error.message}`);
    }
  }

  /**
   * Invite a user to a group
   * @param {string} groupId - Group ID
   * @param {Object} inviteData - Invitation data
   * @param {string} inviteData.userId - Current user ID (inviting)
   * @param {string} [inviteData.invitedUserId] - Invited user ID (optional)
   * @param {string} [inviteData.invitedEmail] - Invited user email (optional)
   * @param {string} inviteData.message - Invitation message
   * @param {number} [inviteData.expirationDays] - Expiration days (default 7)
   * @returns {Promise<Object>} Invitation result
   */
  static async inviteUserToGroup(groupId, inviteData) {
    try {
      console.log('📤 Inviting user to group:', { groupId, inviteData });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/${groupId}/invite`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...inviteData,
          expirationDays: inviteData.expirationDays || 7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📤 User invited successfully:', result);
      return result;
    } catch (error) {
      console.error('📤❌ Error inviting user to group:', error);
      throw new Error(`Failed to invite user to group: ${error.message}`);
    }
  }

  /**
   * Get user's created pools (both public and private)
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of user's created pools
   */
  static async getUserCreatedPools(userId) {
    try {
      console.log('🔴 [ONLY USER CREATED] Fetching user created pools for:', userId);
      console.log('🔴 [ONLY USER CREATED] This should NOT call any public pools endpoints!');
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/groups/created-by/${userId}`;
      
      console.log('🔴 [ONLY USER CREATED] Making fetch call to:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🔴 [ONLY USER CREATED] Raw API response received:', result);
      console.log('� [ONLY USER CREATED] Number of pools from user-created endpoint:', result.length);
      
      // Log visibility details for each pool
      result.forEach((pool, index) => {
        console.log(`� [ONLY USER CREATED] Pool ${index + 1}:`, {
          name: pool.tripName || pool.groupName,
          visibility: pool.visibility,
          groupId: pool.groupId,
          status: pool.status
        });
      });
      
      console.log('🔴 [ONLY USER CREATED] Returning ONLY user created pools - no public pools mixed in!');
      return result;
    } catch (error) {
      console.error('🏊‍♂️❌ Error fetching user created pools:', error);
      throw new Error(`Failed to fetch user created pools: ${error.message}`);
    }
  }

  /**
   * Get user's pools from the API (ONLY user's created pools - both public and private)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Object containing ongoing, upcoming, and past pools
   */
  static async getUserPools(userId) {
    try {
      console.log('🏊‍♂️ [MyPools] Fetching ONLY user created pools for:', userId);
      console.log('🏊‍♂️ [MyPools] API URL: http://localhost:8086/api/v1/groups/created-by/' + userId);
      
      // ONLY get user's created pools (both public and private) from dedicated endpoint
      // DO NOT use any cached data or public pools data
      const createdPoolsResponse = await this.getUserCreatedPools(userId);
      console.log('🔍 [MyPools] Raw API response from /groups/created-by/', createdPoolsResponse);
      console.log('🔍 [MyPools] Number of pools returned by API:', createdPoolsResponse.length);

      // ✅ Backend already filters by creator via /groups/created-by/ endpoint
      // No additional filtering needed - trust the backend response completely
      const userCreatedPools = createdPoolsResponse;
      console.log('🔍 [MyPools] Using all pools from backend (already filtered):', userCreatedPools.length);
      
      // Convert all the user's created pools to pool format
      const createdPools = userCreatedPools.map(group => {
        console.log('🔍 [MyPools] Converting pool:', {
          name: group.tripName || group.groupName,
          visibility: group.visibility,
          status: group.status,
          groupId: group.groupId
        });
        return this.convertToPoolFormat(group);
      });
      console.log('🔍 [MyPools] Converted user created pools:', createdPools);
      
      // Use all the user's created pools from backend - no additional filtering
      const allUserPools = createdPools;
      
      console.log('🏊‍♂️ [MyPools] Final user pools (should match API exactly):', allUserPools);
      
      // Organize pools by actual dates (not status)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare dates only
      
      const result = {
        upcoming: allUserPools.filter(pool => {
          const startDate = new Date(pool.startDate);
          startDate.setHours(0, 0, 0, 0);
          return startDate > today;
        }),
        ongoing: allUserPools.filter(pool => {
          const startDate = new Date(pool.startDate);
          const endDate = new Date(pool.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          return startDate <= today && endDate >= today;
        }),
        past: allUserPools.filter(pool => {
          const endDate = new Date(pool.endDate);
          endDate.setHours(23, 59, 59, 999);
          return endDate < today;
        })
      };
      
      console.log('🔍 [MyPools] Organized pools by dates:', result);
      console.log('🔍 [MyPools] Date comparison reference - Today:', today.toISOString().split('T')[0]);
      console.log('🔍 [MyPools] Pool date analysis:');
      allUserPools.forEach(pool => {
        const startDate = new Date(pool.startDate);
        const endDate = new Date(pool.endDate);
        console.log(`  📅 ${pool.name}: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]} (${pool.startDate > today ? 'upcoming' : pool.endDate >= today ? 'ongoing' : 'past'})`);
      });
      console.log('🔍 [MyPools] Total pools shown:', {
        ongoing: result.ongoing.length,
        upcoming: result.upcoming.length,
        past: result.past.length,
        total: result.ongoing.length + result.upcoming.length + result.past.length
      });
      
      return result;
    } catch (error) {
      console.error('🏊‍♂️❌ [MyPools] Error fetching user pools:', error);
      throw new Error(`Failed to fetch user pools: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get all public pools for browsing (Find Pools page)
   * @param {Object} filters - Optional filters to apply on frontend
   * @param {Array} [allPools] - Optional pre-fetched pools data to filter from
   * @returns {Promise<Array>} Array of pools available for joining
   */
  static async getPublicPools(filters = {}, allPools = null) {
    try {
      console.log('🏊‍♂️ Getting public pools with filters:', filters);
      
      let pools = allPools;
      
      // If no pre-fetched data, fetch all pools
      if (!pools) {
        const response = await this.getEnhancedPools();
        pools = response.map(group => this.convertToPoolFormat(group));
      } else {
        // Convert if needed
        pools = pools.map(group => 
          group.id ? group : this.convertToPoolFormat(group)
        );
      }
      
      // Apply frontend filters
      let filteredPools = pools;
      
      // Filter by search query (name, destinations, activities)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredPools = filteredPools.filter(pool =>
          pool.name.toLowerCase().includes(query) ||
          pool.destinations.toLowerCase().includes(query) ||
          pool.preferredActivities.some(activity => 
            activity.toLowerCase().includes(query)
          )
        );
      }
      
      // Filter by base city
      if (filters.baseCity) {
        filteredPools = filteredPools.filter(pool =>
          pool.baseCity === filters.baseCity
        );
      }
      
      // Filter by budget level
      if (filters.budgetLevel) {
        filteredPools = filteredPools.filter(pool =>
          pool.budgetLevel === filters.budgetLevel
        );
      }
      
      // Filter by preferred activities
      if (filters.preferredActivities && filters.preferredActivities.length > 0) {
        filteredPools = filteredPools.filter(pool =>
          filters.preferredActivities.some(activity =>
            pool.preferredActivities.includes(activity)
          )
        );
      }
      
      // Filter by date range
      if (filters.startDate || filters.endDate) {
        filteredPools = filteredPools.filter(pool => {
          const poolStart = new Date(pool.startDate);
          const poolEnd = new Date(pool.endDate);
          
          if (filters.startDate) {
            const filterStart = new Date(filters.startDate);
            if (poolStart < filterStart) return false;
          }
          
          if (filters.endDate) {
            const filterEnd = new Date(filters.endDate);
            if (poolEnd > filterEnd) return false;
          }
          
          return true;
        });
      }
      
      // Only show active and open pools in public view
      filteredPools = filteredPools.filter(pool =>
        pool.status === 'active' || pool.status === 'open'
      );
      
      console.log('🏊‍♂️ Public pools filtered successfully:', filteredPools.length);
      return filteredPools;
    } catch (error) {
      console.error('🏊‍♂️❌ Error getting public pools:', error);
      throw new Error(`Failed to get public pools: ${error.message}`);
    }
  }

  /**
   * Cache for pools data to avoid multiple API calls
   */
  static _poolsCache = null;
  static _cacheTimestamp = null;
  static _cacheExpiry = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached pools or fetch fresh data
   * @param {boolean} forceRefresh - Force refresh the cache
   * @returns {Promise<Array>} Array of raw pool data
   */
  static async getCachedPools(forceRefresh = false) {
    const now = Date.now();
    
    // Check if cache is valid and not expired
    if (!forceRefresh && 
        this._poolsCache && 
        this._cacheTimestamp && 
        (now - this._cacheTimestamp) < this._cacheExpiry) {
      console.log('🏊‍♂️ Using cached pools data');
      return this._poolsCache;
    }
    
    try {
      console.log('🏊‍♂️ Fetching fresh pools data');
      const freshData = await this.getEnhancedPools();
      
      // Update cache
      this._poolsCache = freshData;
      this._cacheTimestamp = now;
      
      return freshData;
    } catch (error) {
      // If API fails, return cached data if available
      if (this._poolsCache) {
        console.warn('🏊‍♂️ API failed, using stale cached data');
        return this._poolsCache;
      }
      throw error;
    }
  }

  /**
   * Clear the pools cache
   */
  static clearCache() {
    this._poolsCache = null;
    this._cacheTimestamp = null;
    console.log('🏊‍♂️ Pools cache cleared');
  }

  /**
   * Paginate an array of pools (frontend-only pagination)
   * @param {Array} pools - Array of pools to paginate
   * @param {number} page - Current page number (1-based)
   * @param {number} pageSize - Number of items per page
   * @returns {Object} Pagination result with pools and metadata
   */
  static paginatePools(pools, page = 1, pageSize = 9) {
    const totalPools = pools.length;
    const totalPages = Math.ceil(totalPools / pageSize);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPools = pools.slice(startIndex, endIndex);
    
    console.log('📄 Frontend pagination:', {
      totalPools,
      totalPages,
      currentPage,
      pageSize,
      startIndex,
      endIndex,
      paginatedPoolsCount: paginatedPools.length
    });
    
    return {
      pools: paginatedPools,
      pagination: {
        currentPage,
        totalPages,
        totalPools,
        pageSize,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        startIndex: startIndex + 1, // 1-based for display
        endIndex: Math.min(endIndex, totalPools) // Actual end index
      }
    };
  }

  /**
   * Get paginated public pools for browsing (Find Pools page)
   * @param {Object} options - Pagination and filter options
   * @param {number} [options.page=1] - Page number (1-based)
   * @param {number} [options.pageSize=9] - Number of pools per page
   * @param {Object} [options.filters={}] - Filter options
   * @param {Array} [options.allPools] - Optional pre-fetched pools data
   * @returns {Promise<Object>} Paginated pools with metadata
   */
  static async getPaginatedPublicPools({ page = 1, pageSize = 9, filters = {}, allPools = null } = {}) {
    try {
      console.log('📄 Getting paginated public pools:', { page, pageSize, filters });
      
      // Get all filtered pools first
      const filteredPools = await this.getPublicPools(filters, allPools);
      
      // Apply frontend pagination
      const result = this.paginatePools(filteredPools, page, pageSize);
      
      console.log('📄 Paginated public pools result:', {
        poolsCount: result.pools.length,
        pagination: result.pagination
      });
      
      return result;
    } catch (error) {
      console.error('📄❌ Error getting paginated public pools:', error);
      throw new Error(`Failed to get paginated pools: ${error.message}`);
    }
  }

  /**
   * Get paginated user pools (My Pools page)
   * @param {string} userId - User ID
   * @param {Object} options - Pagination options
   * @param {number} [options.pageSize=9] - Number of pools per page for each section
   * @returns {Promise<Object>} Paginated user pools organized by status
   */
  static async getPaginatedUserPools(userId, { pageSize = 9 } = {}) {
    try {
      console.log('📄 Getting paginated user pools for:', userId, { pageSize });
      
      // Get all user pools first
      const userPools = await this.getUserPools(userId);
      
      // Apply pagination to each section
      const result = {
        ongoing: this.paginatePools(userPools.ongoing, 1, pageSize),
        upcoming: this.paginatePools(userPools.upcoming, 1, pageSize),
        past: this.paginatePools(userPools.past, 1, pageSize)
      };
      
      console.log('📄 Paginated user pools result:', {
        ongoing: result.ongoing.pools.length,
        upcoming: result.upcoming.pools.length,
        past: result.past.pools.length
      });
      
      return result;
    } catch (error) {
      console.error('📄❌ Error getting paginated user pools:', error);
      throw new Error(`Failed to get paginated user pools: ${error.message}`);
    }
  }

  /**
   * Save trip and get similar group suggestions
   * @param {string} groupId - Group ID
   * @param {Object} tripData - Trip data to save
   * @param {string} tripData.userId - User ID
   * @param {Object} tripData.tripDetails - Trip details
   * @param {string} tripData.tripDetails.tripName - Trip name
   * @param {Array<string>} tripData.tripDetails.places - Places to visit
   * @returns {Promise<Object>} Suggestions result
   */
  static async saveTripAndGetSuggestions(groupId, tripData) {
    try {
      console.log('💾 ===== SAVE TRIP AND GET SUGGESTIONS API CALL =====');
      console.log('💾 Group ID:', groupId); 
      console.log('💾 Raw tripData received:', tripData);
      console.log('💾 tripData type:', typeof tripData);
      console.log('💾 tripData keys:', Object.keys(tripData || {}));
      
      // Log each property individually
      if (tripData) {
        console.log('💾 tripData.userId:', tripData.userId);
        console.log('💾 tripData.tripId:', tripData.tripId);
        console.log('💾 tripData.tripData:', tripData.tripData);
        console.log('💾 tripData.tripDetails:', tripData.tripDetails);
        console.log('💾 tripData.optionalField:', tripData.optionalField);
        
        // If tripData has nested structure, log it too
        if (tripData.tripData) {
          console.log('💾 tripData.tripData structure:', {
            keys: Object.keys(tripData.tripData),
            name: tripData.tripData.name,
            tripName: tripData.tripData.tripName,
            startDate: tripData.tripData.startDate,
            endDate: tripData.tripData.endDate,
            destinations: tripData.tripData.destinations,
            destinationsType: Array.isArray(tripData.tripData.destinations) ? 'Array' : typeof tripData.tripData.destinations,
            destinationsLength: tripData.tripData.destinations?.length,
            terrains: tripData.tripData.terrains,
            activities: tripData.tripData.activities,
            places: tripData.tripData.places,
            placesType: Array.isArray(tripData.tripData.places) ? 'Array' : typeof tripData.tripData.places,
            itinerary: tripData.tripData.itinerary ? 'Present' : 'Not present'
          });
          
          // Log destinations in detail if they exist
          if (tripData.tripData.destinations) {
            console.log('💾 Destinations detailed analysis:');
            console.log('  - Type:', Array.isArray(tripData.tripData.destinations) ? 'Array' : typeof tripData.tripData.destinations);
            console.log('  - Length:', tripData.tripData.destinations?.length);
            console.log('  - Content:', tripData.tripData.destinations);
            if (Array.isArray(tripData.tripData.destinations)) {
              tripData.tripData.destinations.forEach((dest, index) => {
                console.log(`  - [${index}]:`, dest, '(type:', typeof dest, ')');
              });
            }
          }
        }
      }
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/public-pooling/groups/${groupId}/save-trip`;
      
      console.log('💾 Full API URL:', fullUrl);
      console.log('💾 Request body (stringified):', JSON.stringify(tripData, null, 2));
      
      const requestPayload = JSON.stringify(tripData);
      console.log('💾 Final request payload length:', requestPayload.length);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: requestPayload
      });

      console.log('💾 Response status:', response.status);
      console.log('💾 Response status text:', response.statusText);
      console.log('💾 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('💾❌ Error response body:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Unknown error' };
        }
        
        console.log('💾❌ Parsed error data:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const responseText = await response.text();
      console.log('💾 Raw response text:', responseText);
      
      const result = JSON.parse(responseText);
      console.log('💾 Parsed response result:', result);
      console.log('💾 Response result keys:', Object.keys(result || {}));
      
      // Return the result with proper structure expected by frontend
      const finalResult = {
        success: true,
        ...result
      };
      
      console.log('💾 Final result being returned:', finalResult);
      console.log('💾 ===== END SAVE TRIP API CALL =====');
      
      return finalResult;
    } catch (error) {
      console.error('💾❌ Error saving trip and getting suggestions:', error);
      console.error('💾❌ Error stack:', error.stack);
      throw new Error(`Failed to save trip and get suggestions: ${error.message}`);
    }
  }

  /**
   * Finalize a public pooling group
   * @param {string} groupId - Group ID
   * @param {Object} finalizeData - Finalization data
   * @param {string} finalizeData.userId - User ID
   * @param {string} finalizeData.action - 'finalize' or 'cancel'
   * @param {string} [finalizeData.reason] - Reason for cancellation (optional)
   * @returns {Promise<Object>} Finalization result
   */
  static async finalizeGroup(groupId, finalizeData) {
    try {
      console.log('🏁 ===== FINALIZE GROUP REQUEST DETAILS =====');
      console.log('🏁 Group ID parameter:', groupId);
      console.log('🏁 Group ID type:', typeof groupId);
      console.log('🏁 Finalize data received:', finalizeData);
      console.log('🏁 Finalize data type:', typeof finalizeData);
      console.log('🏁 Finalize data keys:', Object.keys(finalizeData || {}));
      
      // Log each property individually
      if (finalizeData) {
        console.log('🏁 finalizeData.userId:', finalizeData.userId, '(type:', typeof finalizeData.userId, ')');
        console.log('🏁 finalizeData.groupId:', finalizeData.groupId, '(type:', typeof finalizeData.groupId, ')');
        console.log('🏁 finalizeData.action:', finalizeData.action, '(type:', typeof finalizeData.action, ')');
        console.log('🏁 finalizeData.reason:', finalizeData.reason, '(type:', typeof finalizeData.reason, ')');
      }
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086/api/v1';
      const fullUrl = `${baseUrl}/public-pooling/groups/${groupId}/finalize`;
      
      console.log('🏁 ===== FINALIZE GROUP HTTP REQUEST =====');
      console.log('🏁 Full API URL:', fullUrl);
      console.log('🏁 HTTP Method: POST');
      console.log('🏁 Request headers:');
      console.log('  - Accept: application/json');
      console.log('  - Content-Type: application/json');
      console.log('  - credentials: include');
      console.log('🏁 Request body (raw object):', finalizeData);
      console.log('🏁 Request body (stringified):', JSON.stringify(finalizeData, null, 2));
      
      const requestPayload = JSON.stringify(finalizeData);
      console.log('🏁 Final request payload:', requestPayload);
      console.log('🏁 Final request payload length:', requestPayload.length);
      console.log('🏁 ===== SENDING REQUEST =====');
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: requestPayload
      });

      console.log('🏁 ===== FINALIZE GROUP RESPONSE RECEIVED =====');
      console.log('🏁 Response status:', response.status);
      console.log('🏁 Response status text:', response.statusText);
      console.log('🏁 Response ok:', response.ok);
      console.log('🏁 Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('🏁 ===== PROCESSING RESPONSE =====');

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🏁❌ ===== ERROR RESPONSE ANALYSIS =====');
        console.log('🏁❌ Error response status:', response.status);
        console.log('🏁❌ Error response body (raw):', errorText);
        console.log('🏁❌ Error response length:', errorText.length);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          console.log('🏁❌ Error response parsed successfully:', errorData);
        } catch (parseError) {
          console.log('🏁❌ Error parsing response JSON:', parseError.message);
          errorData = { message: errorText || 'Unknown error' };
        }
        
        console.log('🏁❌ Final parsed error data:', errorData);
        console.log('🏁❌ Error message to throw:', errorData.message || `HTTP ${response.status}`);
        console.log('🏁❌ ===== END ERROR ANALYSIS =====');
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const responseText = await response.text();
      console.log('🏁✅ ===== SUCCESS RESPONSE ANALYSIS =====');
      console.log('🏁✅ Raw response text:', responseText);
      console.log('🏁✅ Response text length:', responseText.length);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('🏁✅ Response parsed successfully:', result);
        console.log('🏁✅ Response result type:', typeof result);
        console.log('🏁✅ Response result keys:', Object.keys(result || {}));
        
        // Log specific response properties
        if (result) {
          console.log('🏁✅ result.status:', result.status);
          console.log('🏁✅ result.success:', result.success);
          console.log('🏁✅ result.message:', result.message);
          console.log('🏁✅ result.data:', result.data);
        }
        console.log('🏁✅ ===== END SUCCESS ANALYSIS =====');
      } catch (parseError) {
        console.log('🏁❌ Error parsing success response JSON:', parseError.message);
        console.log('🏁❌ Falling back to text response');
        result = { status: 'success', message: responseText };
      }
      
      // Return the result with proper structure expected by frontend
      const finalResult = {
        success: true,
        ...result
      };
      
      console.log('🏁✅ ===== RETURNING SUCCESS RESULT =====');
      console.log('🏁✅ Final result being returned:', finalResult);
      console.log('🏁✅ Final result type:', typeof finalResult);
      console.log('🏁✅ Final result keys:', Object.keys(finalResult));
      console.log('🏁✅ ===== END FINALIZE GROUP API CALL SUCCESS =====');
      
      return finalResult;
    } catch (error) {
      console.error('🏁❌ ===== FINALIZE GROUP API ERROR CAUGHT =====');
      console.error('🏁❌ Error object:', error);
      console.error('🏁❌ Error type:', typeof error);
      console.error('🏁❌ Error name:', error.name);
      console.error('🏁❌ Error message:', error.message);
      console.error('🏁❌ Error stack:', error.stack);
      console.error('🏁❌ Error constructor:', error.constructor.name);
      console.error('🏁❌ ===== THROWING ENHANCED ERROR =====');
      throw new Error(`Failed to finalize group: ${error.message}`);
    }
  }

  /**
   * Get comprehensive trip details including itinerary and joined members
   * @param {string} tripId - Trip ID to fetch comprehensive details for
   * @param {string} [userId] - Optional user ID for personalized data
   * @returns {Promise<Object>} Comprehensive trip response matching ComprehensiveTripResponse DTO
   */
  static async getComprehensiveTripDetails(tripId, userId = null) {
    try {
      console.log('🔍📋 ===== FETCHING COMPREHENSIVE TRIP DETAILS =====');
      console.log('🔍📋 Trip ID:', tripId);
      console.log('🔍📋 User ID:', userId);
      console.log('🔍📋 API Base URL:', poolingServicesApi.defaults.baseURL);
      
      // Construct the API endpoint
      const endpoint = `/public-pooling/trips/${tripId}/comprehensive`;
      console.log('🔍📋 Endpoint:', endpoint);
      
      // Prepare query parameters
      const params = {};
      if (userId) {
        params.userId = userId;
        console.log('🔍📋 Including userId in params:', userId);
      }
      
      console.log('🔍📋 Making API request...');
      const response = await poolingServicesApi.get(endpoint, { params });
      
      console.log('🔍📋 ===== API RESPONSE RECEIVED =====');
      console.log('🔍📋 Status:', response.status);
      console.log('🔍📋 Status Text:', response.statusText);
      console.log('🔍📋 Response Headers:', response.headers);
      console.log('🔍📋 Response Data Keys:', Object.keys(response.data || {}));
      console.log('🔍📋 Full Response Data:', response.data);
      
      if (response.data) {
        console.log('🔍📋 Trip Details:', response.data.tripDetails);
        console.log('🔍📋 Group Info:', response.data.groupInfo);
        console.log('🔍📋 Members Count:', response.data.members?.length || 0);
        console.log('🔍📋 Daily Plans Count:', response.data.tripDetails?.dailyPlans?.length || 0);
      }
      
      console.log('🔍📋 ===== COMPREHENSIVE TRIP DETAILS FETCHED SUCCESSFULLY =====');
      return response.data;
    } catch (error) {
      console.error('🔍📋❌ ===== COMPREHENSIVE TRIP DETAILS ERROR =====');
      console.error('🔍📋❌ Error object:', error);
      console.error('🔍📋❌ Error type:', typeof error);
      console.error('🔍📋❌ Error name:', error.name);
      console.error('🔍📋❌ Error message:', error.message);
      console.error('🔍📋❌ Error stack:', error.stack);
      console.error('🔍📋❌ Response status:', error.response?.status);
      console.error('🔍📋❌ Response data:', error.response?.data);
      console.error('🔍📋❌ Response headers:', error.response?.headers);
      console.error('🔍📋❌ ===== END ERROR DETAILS =====');
      
      throw new Error(`Failed to fetch comprehensive trip details: ${error.response?.data?.message || error.message}`);
    }
  }

  // ===============================
  // POOLING CONFIRMATION METHODS
  // ===============================

  /**
   * Initiate trip confirmation - Only the trip creator can call this
   * POST /api/v1/pooling-confirm/initiate
   * @param {Object} confirmationData - Trip confirmation data
   * @returns {Promise<Object>} Confirmation initiation result
   */
  static async initiateTripConfirmation(confirmationData) {
    try {
      console.log('🎯 Initiating trip confirmation:', confirmationData);
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/initiate`;
      
      console.log('🎯 Making initiate request to URL:', fullUrl);
      console.log('🎯 Request payload:', JSON.stringify(confirmationData, null, 2));
      
      // Simplified fetch without problematic headers
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(confirmationData)
      });

      console.log('🎯 Initiate response status:', response.status);
      console.log('🎯 Initiate response ok:', response.ok);
      console.log('🎯 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎯 Initiate error response text:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Unknown error' };
        }
        console.error('🎯 Initiate error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('🎯 Trip confirmation initiated successfully:', result);
      return result;
    } catch (error) {
      console.error('🎯❌ Error initiating trip confirmation:', error);
      console.error('🎯❌ Error type:', error.name);
      console.error('🎯❌ Error message:', error.message);
      console.error('🎯❌ Error stack:', error.stack);
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to confirmation service. This is likely a CORS issue. Backend: ${baseUrl}`);
      }
      
      throw new Error(`Failed to initiate trip confirmation: ${error.message}`);
    }
  }

  /**
   * Confirm participation in a trip - Members call this to confirm
   * POST /api/v1/pooling-confirm/{confirmedTripId}/confirm
   * @param {string} confirmedTripId - The confirmed trip ID
   * @param {string} userId - User ID confirming participation
   * @returns {Promise<Object>} Confirmation result
   */
  static async confirmParticipation(confirmedTripId, userId) {
    try {
      console.log('✅ Confirming participation:', { confirmedTripId, userId });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/${confirmedTripId}/confirm`;
      
      console.log('✅ Making confirm request to URL:', fullUrl);
      console.log('✅ Request payload:', JSON.stringify({ userId }, null, 2));
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      console.log('✅ Confirm response status:', response.status);
      console.log('✅ Confirm response ok:', response.ok);
      console.log('✅ Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('✅ Confirm error response text:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Unknown error' };
        }
        console.error('✅ Confirm error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Participation confirmed successfully:', result);
      return result;
    } catch (error) {
      console.error('✅❌ Error confirming participation:', error);
      console.error('✅❌ Error type:', error.name);
      console.error('✅❌ Error message:', error.message);
      console.error('✅❌ Error stack:', error.stack);
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to confirmation service. This is likely a CORS issue. Backend: ${process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074'}`);
      }
      
      throw new Error(`Failed to confirm participation: ${error.message}`);
    }
  }

  /**
   * Get confirmation status for a trip
   * GET /api/v1/pooling-confirm/{confirmedTripId}/status?userId={userId}
   * @param {string} confirmedTripId - The confirmed trip ID
   * @param {string} userId - User ID to check status for
   * @returns {Promise<Object>} Confirmation status
   */
  static async getConfirmationStatus(confirmedTripId, userId) {
    try {
      console.log('📊 Getting confirmation status:', { confirmedTripId, userId });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/${confirmedTripId}/status?userId=${userId}`;
      
      console.log('📊 Making status request to URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('📊 Status response status:', response.status);
      console.log('📊 Status response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('📊 Status error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 Confirmation status retrieved:', result);
      return result;
    } catch (error) {
      console.error('📊❌ Error getting confirmation status:', error);
      throw new Error(`Failed to get confirmation status: ${error.message}`);
    }
  }

  /**
   * Get trip details by trip ID
   * GET /api/v1/pooling-confirm/trip/{tripId}/status?userId={userId}
   * @param {string} tripId - The trip ID
   * @param {string} userId - User ID for context
   * @returns {Promise<Object>} Trip details
   */
  static async getTripDetailsByTripId(tripId, userId) {
    try {
      console.log('🚀 Getting trip details by tripId:', { tripId, userId });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/trip/${tripId}/status?userId=${userId}`;
      
      console.log('🚀 Making trip details request to URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('🚀 Trip details response status:', response.status);
      console.log('🚀 Trip details response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('🚀 Trip details error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🚀 Trip details retrieved:', result);
      return result;
    } catch (error) {
      console.error('🚀❌ Error getting trip details by tripId:', error);
      throw new Error(`Failed to get trip details: ${error.message}`);
    }
  }

  /**
   * Cancel trip confirmation - Only trip creator can call this
   * POST /api/v1/pooling-confirm/{confirmedTripId}/cancel
   * @param {string} confirmedTripId - The confirmed trip ID
   * @param {string} userId - User ID canceling (must be creator)
   * @param {string} reason - Reason for cancellation
   * @returns {Promise<Object>} Cancellation result
   */
  static async cancelTripConfirmation(confirmedTripId, userId, reason) {
    try {
      console.log('❌ Canceling trip confirmation:', { confirmedTripId, userId, reason });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/${confirmedTripId}/cancel`;
      
      console.log('❌ Making cancel request to URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ userId, reason })
      });

      console.log('❌ Cancel response status:', response.status);
      console.log('❌ Cancel response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Cancel error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('❌ Trip confirmation canceled successfully:', result);
      return result;
    } catch (error) {
      console.error('❌❌ Error canceling trip confirmation:', error);
      throw new Error(`Failed to cancel trip confirmation: ${error.message}`);
    }
  }

  /**
   * Get user confirmed trips
   * GET /api/v1/pooling-confirm/user/{userId}/trips
   * @param {string} userId - User ID
   * @param {Object} options - Query options (status, page, limit)
   * @returns {Promise<Object>} User confirmed trips
   */
  static async getUserConfirmedTrips(userId, options = {}) {
    try {
      console.log('📋 Getting user confirmed trips:', { userId, options });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const queryParams = new URLSearchParams();
      
      if (options.status) queryParams.append('status', options.status);
      if (options.page) queryParams.append('page', options.page);
      if (options.limit) queryParams.append('limit', options.limit);
      
      const fullUrl = `${baseUrl}/pooling-confirm/user/${userId}/trips${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      console.log('📋 Making user trips request to URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('📋 User trips response status:', response.status);
      console.log('📋 User trips response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('📋 User trips error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📋 User confirmed trips retrieved:', result);
      return result;
    } catch (error) {
      console.error('📋❌ Error getting user confirmed trips:', error);
      throw new Error(`Failed to get user confirmed trips: ${error.message}`);
    }
  }

  /**
   * Get comprehensive trip details including payment status
   * GET /api/v1/pooling-confirm/{confirmedTripId}/details
   * @param {string} confirmedTripId - The confirmed trip ID
   * @param {string} userId - User ID for context
   * @returns {Promise<Object>} Comprehensive trip details with payment info
   */
  static async getConfirmedTripDetails(confirmedTripId, userId) {
    try {
      console.log('📊 Getting confirmed trip details:', { confirmedTripId, userId });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/${confirmedTripId}/details?userId=${userId}`;
      
      console.log('📊 Making trip details request to URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('📊 Trip details response status:', response.status);
      console.log('📊 Trip details response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('📊 Trip details error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 Trip details retrieved successfully:', result);
      return result;
    } catch (error) {
      console.error('📊❌ Error getting trip details:', error);
      throw new Error(`Failed to get trip details: ${error.message}`);
    }
  }

  /**
   * Make upfront payment (50% of trip cost)
   * POST /api/v1/pooling-confirm/{confirmedTripId}/payment/upfront
   * @param {string} confirmedTripId - The confirmed trip ID
   * @param {string} userId - User ID making payment
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result
   */
  static async makeUpfrontPayment(confirmedTripId, userId, paymentData) {
    try {
      console.log('💳 Making upfront payment:', { confirmedTripId, userId, paymentData });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/${confirmedTripId}/payment/upfront`;
      
      console.log('💳 Making upfront payment request to URL:', fullUrl);
      
      const requestBody = {
        userId,
        ...paymentData,
        // Mock payment data for now
        paymentMethod: 'mock',
        mockPayment: true
      };
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('💳 Upfront payment response status:', response.status);
      console.log('💳 Upfront payment response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('💳 Upfront payment error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('💳 Upfront payment completed successfully:', result);
      return result;
    } catch (error) {
      console.error('💳❌ Error making upfront payment:', error);
      throw new Error(`Failed to make upfront payment: ${error.message}`);
    }
  }

  /**
   * Make final payment (remaining 50% of trip cost)
   * POST /api/v1/pooling-confirm/{confirmedTripId}/payment/final
   * @param {string} confirmedTripId - The confirmed trip ID
   * @param {string} userId - User ID making payment
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result
   */
  static async makeFinalPayment(confirmedTripId, userId, paymentData) {
    try {
      console.log('💰 Making final payment:', { confirmedTripId, userId, paymentData });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/${confirmedTripId}/payment/final`;
      
      console.log('💰 Making final payment request to URL:', fullUrl);
      
      const requestBody = {
        userId,
        ...paymentData,
        // Mock payment data for now
        paymentMethod: 'mock',
        mockPayment: true
      };
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('💰 Final payment response status:', response.status);
      console.log('💰 Final payment response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('💰 Final payment error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('💰 Final payment completed successfully:', result);
      return result;
    } catch (error) {
      console.error('💰❌ Error making final payment:', error);
      throw new Error(`Failed to make final payment: ${error.message}`);
    }
  }

  /**
   * Vote during decision period when partial payments received
   * POST /api/v1/pooling-confirm/{confirmedTripId}/vote
   * @param {string} confirmedTripId - The confirmed trip ID
   * @param {string} userId - User ID voting
   * @param {string} decision - 'continue' or 'cancel'
   * @param {string} reason - Optional reason for vote
   * @returns {Promise<Object>} Vote result
   */
  static async voteOnTripDecision(confirmedTripId, userId, decision, reason = '') {
    try {
      console.log('🗳️ Voting on trip decision:', { confirmedTripId, userId, decision, reason });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/${confirmedTripId}/vote`;
      
      console.log('🗳️ Making vote request to URL:', fullUrl);
      
      const requestBody = {
        userId,
        decision, // 'continue' or 'cancel'
        reason
      };
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('🗳️ Vote response status:', response.status);
      console.log('🗳️ Vote response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('🗳️ Vote error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🗳️ Vote submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('🗳️❌ Error voting on trip decision:', error);
      throw new Error(`Failed to vote on trip decision: ${error.message}`);
    }
  }

  /**
   * Cancel individual participation with penalty
   * POST /api/v1/pooling-confirm/{confirmedTripId}/cancel-participation
   * @param {string} confirmedTripId - The confirmed trip ID
   * @param {string} userId - User ID canceling
   * @param {string} reason - Reason for cancellation
   * @returns {Promise<Object>} Cancellation result
   */
  static async cancelIndividualParticipation(confirmedTripId, userId, reason) {
    try {
      console.log('❌ Canceling individual participation:', { confirmedTripId, userId, reason });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_CONFIRM || 'http://localhost:8074/api/v1';
      const fullUrl = `${baseUrl}/pooling-confirm/${confirmedTripId}/cancel-participation`;
      
      console.log('❌ Making cancellation request to URL:', fullUrl);
      
      const requestBody = {
        userId,
        reason
      };
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('❌ Cancellation response status:', response.status);
      console.log('❌ Cancellation response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Cancellation error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('❌ Participation canceled successfully:', result);
      return result;
    } catch (error) {
      console.error('❌❌ Error canceling participation:', error);
      throw new Error(`Failed to cancel participation: ${error.message}`);
    }
  }
}

// Export both the class and an instance for convenience
export const poolsApi = PoolsApi;
export default PoolsApi;

import { poolingServicesApi } from './axios';

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
      
      const response = await poolingServicesApi.get('/api/v1/groups/public/enhanced', {
        params: requestParams
      });

      console.log('🏊‍♂️ Enhanced pools fetched successfully:', response.data);
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
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/public-pooling/pre-check`;
      
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
   */
  static async createGroupWithTrip(groupData) {
    try {
      console.log('🏊‍♂️ Creating group with trip:', groupData);
      
      const response = await poolingServicesApi.post('/api/v1/groups/with-trip', groupData);

      console.log('🏊‍♂️ Group created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🏊‍♂️❌ Error creating group with trip:', error);
      throw new Error(`Failed to create group: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Convert enhanced group response to frontend pool format
   * @param {Object} group - Enhanced group response from backend
   * @returns {Object} Pool object in frontend format
   */
  static convertToPoolFormat(group) {
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
      highlights: group.topAttractions || [],
      
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
   * @param {string} joinData.userEmail - User email
   * @param {string} joinData.userName - User name
   * @param {string} joinData.message - Personal message for join request
   * @param {Object} joinData.userProfile - User profile information
   * @returns {Promise<Object>} Join result
   */
  static async joinPool(groupId, joinData) {
    try {
      console.log('🏊‍♂️ Requesting to join pool:', { groupId, joinData });
      
      // Use the new API endpoint for joining groups
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/groups/${groupId}/join`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(joinData)
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
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/groups/${groupId}/join-requests/vote`;
      
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
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/groups/${groupId}/join-requests/pending?userId=${userId}`;
      
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
   * Get user invitations
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User invitations
   */
  static async getUserInvitations(userId) {
    try {
      console.log('📨 Getting invitations for user:', userId);
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/groups/invitations/${userId}`;
      
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
      console.log('📨 User invitations fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('📨❌ Error fetching user invitations:', error);
      throw new Error(`Failed to fetch user invitations: ${error.message}`);
    }
  }

  /**
   * Respond to an invitation
   * @param {Object} responseData - Response data
   * @param {string} responseData.userId - Current user ID
   * @param {string} responseData.invitationId - Invitation ID
   * @param {string} responseData.action - 'accept' or 'reject'
   * @param {string} [responseData.message] - Optional message for rejection
   * @returns {Promise<Object>} Response result
   */
  static async respondToInvitation(responseData) {
    try {
      console.log('📮 Responding to invitation:', responseData);
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/groups/invitations/respond`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(responseData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📮 Invitation response sent successfully:', result);
      return result;
    } catch (error) {
      console.error('📮❌ Error responding to invitation:', error);
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
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/groups/${groupId}/invite`;
      
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
   * Get user's pools (groups they are part of)
   * @param {string} userId - User ID
   * @param {Array} [allPools] - Optional pre-fetched pools data to filter from
   * @returns {Promise<Object>} Object containing ongoing, upcoming, and past pools
   */
  static async getUserPools(userId, allPools = null) {
    try {
      console.log('🏊‍♂️ Fetching user pools for:', userId);
      
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
      
      // Filter pools where the user is the creator or member
      const userPools = pools.filter(pool => 
        pool.creatorUserId === userId
        // TODO: Add member check when we have member data
      );
      
      console.log('🏊‍♂️ User pools filtered successfully:', userPools.length);
      
      // Organize pools by status
      const result = {
        ongoing: userPools.filter(pool => pool.status === 'active'),
        upcoming: userPools.filter(pool => pool.status === 'draft' || pool.status === 'open'),
        past: userPools.filter(pool => pool.status === 'closed' || pool.status === 'completed')
      };
      
      return result;
    } catch (error) {
      console.error('🏊‍♂️❌ Error fetching user pools:', error);
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
      console.log('💾 Saving trip and getting suggestions:', { groupId, tripData });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/public-pooling/groups/${groupId}/save-trip`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(tripData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('💾 Trip saved and suggestions received:', result);
      
      // Return the result with proper structure expected by frontend
      return {
        success: true,
        ...result
      };
    } catch (error) {
      console.error('💾❌ Error saving trip and getting suggestions:', error);
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
      console.log('🏁 Finalizing group:', { groupId, finalizeData });
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE || 'http://localhost:8086';
      const fullUrl = `${baseUrl}/api/v1/public-pooling/groups/${groupId}/finalize`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(finalizeData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🏁 Group finalized successfully:', result);
      
      // Return the result with proper structure expected by frontend
      return {
        success: true,
        ...result
      };
    } catch (error) {
      console.error('🏁❌ Error finalizing group:', error);
      throw new Error(`Failed to finalize group: ${error.message}`);
    }
  }
}

export default PoolsApi;

import { poolingServicesApi } from './axios';

/**
 * Pool API service for managing pool/group operations
 */
export class PoolsApi {
  /**
   * Fetch enhanced public pools with filtering capabilities
   * @param {Object} params - Filter parameters
   * @param {string} params.userId - Current user ID (required)
   * @param {string} [params.baseCity] - Filter by base city
   * @param {string} [params.startDate] - Filter by start date
   * @param {string} [params.endDate] - Filter by end date
   * @param {string} [params.budgetLevel] - Filter by budget level
   * @param {string[]} [params.preferredActivities] - Filter by preferred activities
   * @returns {Promise<Array>} Array of enhanced pool data
   */
  static async getEnhancedPools(params) {
    try {
      console.log('🏊‍♂️ Fetching enhanced pools with params:', params);
      
      const response = await poolingServicesApi.get('/api/v1/groups/public/enhanced', {
        params: {
          userId: params.userId,
          ...(params.baseCity && { baseCity: params.baseCity }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
          ...(params.budgetLevel && { budgetLevel: params.budgetLevel }),
          ...(params.preferredActivities && params.preferredActivities.length > 0 && { 
            preferredActivities: params.preferredActivities 
          })
        }
      });

      console.log('🏊‍♂️ Enhanced pools fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🏊‍♂️❌ Error fetching enhanced pools:', error);
      throw new Error(`Failed to fetch pools: ${error.response?.data?.message || error.message}`);
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
   * Join a pool/group
   * @param {string} groupId - Group ID to join
   * @param {string} userId - User ID joining the group
   * @returns {Promise<Object>} Join result
   */
  static async joinPool(groupId, userId) {
    try {
      console.log('🏊‍♂️ Joining pool:', { groupId, userId });
      
      const response = await poolingServicesApi.post(`/groups/${groupId}/join`, {
        userId
      });

      console.log('🏊‍♂️ Successfully joined pool:', response.data);
      return response.data;
    } catch (error) {
      console.error('🏊‍♂️❌ Error joining pool:', error);
      throw new Error(`Failed to join pool: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get user's pools (groups they are part of)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Object containing ongoing, upcoming, and past pools
   */
  static async getUserPools(userId) {
    try {
      console.log('🏊‍♂️ Fetching user pools for:', userId);
      
      const response = await poolingServicesApi.get(`/groups/user/${userId}`);
      
      console.log('🏊‍♂️ User pools fetched successfully:', response.data);
      
      // Organize pools by status
      const pools = response.data.map(group => this.convertToPoolFormat(group));
      
      const result = {
        ongoing: pools.filter(pool => pool.status === 'ongoing' || pool.status === 'active'),
        upcoming: pools.filter(pool => pool.status === 'open' || pool.status === 'pending'),
        past: pools.filter(pool => pool.status === 'closed' || pool.status === 'completed')
      };
      
      return result;
    } catch (error) {
      console.error('🏊‍♂️❌ Error fetching user pools:', error);
      throw new Error(`Failed to fetch user pools: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get pools created by the user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of pools created by the user
   */
  static async getCreatedPools(userId) {
    try {
      console.log('🏊‍♂️ Fetching created pools for:', userId);
      
      const response = await poolingServicesApi.get(`/groups/created/${userId}`);
      
      console.log('🏊‍♂️ Created pools fetched successfully:', response.data);
      
      const pools = response.data.map(group => this.convertToPoolFormat(group));
      return pools;
    } catch (error) {
      console.error('🏊‍♂️❌ Error fetching created pools:', error);
      throw new Error(`Failed to fetch created pools: ${error.response?.data?.message || error.message}`);
    }
  }
}

export default PoolsApi;

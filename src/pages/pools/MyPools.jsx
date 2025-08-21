import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody } from '../../components/Card';
import PoolCard from '../../components/PoolCard';
import PoolsApi from '../../api/poolsApi';
import { getUserUID } from '../../utils/userStorage';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Eye } from 'lucide-react';

const MyPools = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');
  
  // API state
  const [ongoingPools, setOngoingPools] = useState([]);
  const [upcomingPools, setUpcomingPools] = useState([]);
  const [poolHistory, setPoolHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize user and fetch pools on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Get current user
        const userId = getUserUID();
        if (!userId) {
          setError('Please log in to view your pools');
          setLoading(false);
          return;
        }
        
        setCurrentUser(userId);
        console.log('🏊‍♂️ Current user:', userId);
        
        // Fetch user's pools
        await fetchUserPools(userId);
      } catch (error) {
        console.error('🏊‍♂️❌ Error initializing component:', error);
        setError('Failed to load your pools');
        setLoading(false);
      }
    };

    initializeComponent();
  }, []);

  /**
   * Fetch user's pools from the API
   */
  const fetchUserPools = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🏊‍♂️ Fetching user pools...');

      // Use cached data for efficiency
      const cachedPools = await PoolsApi.getCachedPools();
      const userPools = await PoolsApi.getUserPools(userId, cachedPools);
      
      setOngoingPools(userPools.ongoing || []);
      setUpcomingPools(userPools.upcoming || []);
      setPoolHistory(userPools.past || []);
      
      console.log('🏊‍♂️ User pools loaded successfully:', {
        ongoing: userPools.ongoing?.length || 0,
        upcoming: userPools.upcoming?.length || 0,
        past: userPools.past?.length || 0
      });
      
    } catch (error) {
      console.error('🏊‍♂️❌ Error fetching user pools:', error);
      setError(error.message || 'Failed to load your pools');
    } finally {
      setLoading(false);
    }
  };

  // Get the current ongoing pool (first one if any)
  const ongoingPool = ongoingPools.length > 0 ? ongoingPools[0] : null;

  const handlePoolAction = (pool) => {
    console.log('Pool action:', pool);
    // Add your pool action logic here
  };

  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your pools...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
          <div className="text-red-800 font-medium mb-2">Failed to load pools</div>
          <div className="text-red-600 text-sm mb-4">{error}</div>
          <button 
            onClick={() => currentUser && fetchUserPools(currentUser)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Content - Only show if not loading and no error */}
      {!loading && !error && (
        <>
          {/* Search and Filters */}
          <div className="mb-6 sm:mb-10 flex justify-center">
            <div className="flex flex-col gap-3 sm:gap-2 sm:flex-row items-center justify-center w-full max-w-2xl">
              {/* Search Input */}
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your pools..."
                  className="w-full px-4 py-3 sm:py-2 pl-10 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white text-sm shadow-none"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Destination Filter */}
              <div className="relative w-full sm:w-44">
                <div className="relative">
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="appearance-none w-full px-4 py-3 sm:py-2 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white text-sm shadow-none pr-8 min-w-[120px] cursor-pointer transition-colors duration-200"
                  >
                    <option value="">All Destinations</option>
                    <option value="kandy">Kandy</option>
                    <option value="ella">Ella</option>
                    <option value="colombo">Colombo</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center h-full">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Pool - Full Width Card */}
          {ongoingPool ? (
            <div className="mb-8 sm:mb-12 max-w-sm sm:max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Current Pool
              </h2>
              <div className="group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl sm:rounded-2xl border border-green-200 hover:border-green-400 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 flex flex-col lg:flex-row h-full">
                {/* Image on the left */}
                <div className="relative w-full lg:w-1/3 h-48 sm:h-56 lg:h-auto flex-shrink-0">
                  <img
                    src={ongoingPool.image}
                    alt={ongoingPool.name}
                    className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-none lg:rounded-l-2xl"
                    style={{ borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }}
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                      Ongoing
                    </span>
                  </div>
                </div>
                {/* Details on the right */}
                <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {ongoingPool.name}
                    </h3>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    by {ongoingPool.owner}
                  </div>
                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500" />
                      <span className="text-xs sm:text-sm">{ongoingPool.destinations}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500" />
                      <span className="text-xs sm:text-sm">{ongoingPool.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserGroupIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500" />
                      <span className="text-xs sm:text-sm">{ongoingPool.memberCountText || `${ongoingPool.participants}/${ongoingPool.maxParticipants} participants`}</span>
                    </div>
                  </div>
                  {/* Itinerary Timeline */}
                  {ongoingPool.itinerary && ongoingPool.itinerary.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 sm:mb-3">
                        Itinerary Progress
                      </h4>
                      <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                        {ongoingPool.itinerary.map((destination, index) => (
                          <div key={destination} className="flex items-center flex-shrink-0">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 text-center">
                                {destination}
                              </span>
                            </div>
                            {index < ongoingPool.itinerary.length - 1 && (
                              <div className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-gray-300 mx-2 rounded-full min-w-[30px] sm:min-w-[40px]"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-auto gap-3 sm:gap-0">
                    <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                      {/* You can add a rating or other info here if needed */}
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-700 transition-colors flex-1 sm:flex-none justify-center">
                        View Details
                      </button>
                      <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-full hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors flex-1 sm:flex-none justify-center">
                        Contact Group
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 sm:mb-12 max-w-sm sm:max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Current Pool
              </h2>
              <div className="text-center py-6 sm:py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-2xl">
                <div className="text-base sm:text-lg font-medium mb-2">No ongoing pools</div>
                <div className="text-xs sm:text-sm">You don't have any active pools right now.</div>
              </div>
            </div>
          )}

          {/* Upcoming Pools */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Upcoming Pools
            </h2>
            {upcomingPools.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <div className="text-base sm:text-lg font-medium mb-2">No upcoming pools</div>
                <div className="text-xs sm:text-sm">You haven't joined any upcoming pools yet.</div>
              </div>
            ) : (
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-4 sm:gap-6 min-w-[600px]">
                  {upcomingPools.map((pool) => (
                    <div className="min-w-[280px] max-w-[280px] sm:min-w-[340px] sm:max-w-[340px] flex-shrink-0" key={pool.id}>
                      <PoolCard 
                        pool={pool} 
                        onJoinPool={handlePoolAction}
                        buttonText="View Details"
                        buttonIcon={Eye}
                        onClick={() => {
                          console.log('🔍 MyPools - Viewing pool:', pool.name);
                          console.log('🔍 MyPools - Pool data:', { groupId: pool.id, tripId: pool.tripId });
                          const urlId = pool.tripId || pool.id;
                          navigate(`/pool/${urlId}`, { state: { pool } });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pool History */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Pool History
            </h2>
            {poolHistory.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <div className="text-base sm:text-lg font-medium mb-2">No pool history</div>
                <div className="text-xs sm:text-sm">You haven't completed any pools yet.</div>
              </div>
            ) : (
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-4 sm:gap-6 min-w-[600px]">
                  {poolHistory.map((pool) => (
                    <div key={pool.id} className="opacity-80 min-w-[280px] max-w-[280px] sm:min-w-[340px] sm:max-w-[340px] flex-shrink-0">
                      <PoolCard 
                        pool={pool} 
                        onJoinPool={handlePoolAction}
                        buttonText="View Details"
                        buttonIcon={Eye}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyPools;

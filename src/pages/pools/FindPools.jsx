import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PoolCard from '../../components/PoolCard';
import JoinPoolModal from '../../components/JoinPoolModal';
import PoolsApi from '../../api/poolsApi';
import { getUserUID } from '../../utils/userStorage';
import { useAuth } from '../../hooks/useAuth';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Mountain, Waves, Trees, Book, Building, Camera, Utensils, Music, Gamepad2 } from 'lucide-react';

const FindPools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // New filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTerrains, setSelectedTerrains] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [budgetLevel, setBudgetLevel] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); // Fixed at 9 pools per page (3x3 grid)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPools: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  // API state
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Join modal state
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedPoolForJoin, setSelectedPoolForJoin] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Terrain options (matching PoolPreferencesPage)
  const terrainOptions = [
    { id: 'beaches', name: 'Beach', icon: Waves },
    { id: 'mountains', name: 'Mountain', icon: Mountain },
    { id: 'forests', name: 'Forest', icon: Trees },
    { id: 'historical', name: 'Historical', icon: Book },
    { id: 'city', name: 'City', icon: Building },
    { id: 'parks', name: 'National Park', icon: MapPinIcon }
  ];

  // Activity options (matching PoolPreferencesPage)
  const activityOptions = [
    { id: 'hiking', name: 'Hiking', icon: Mountain },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'surfing', name: 'Surfing', icon: Waves },
    { id: 'dining', name: 'Fine Dining', icon: Utensils },
    { id: 'nightlife', name: 'Nightlife', icon: Music },
    { id: 'adventure', name: 'Adventure Sports', icon: Gamepad2 },
    { id: 'culture', name: 'Cultural Tours', icon: Book },
    { id: 'wildlife', name: 'Wildlife Safari', icon: Camera }
  ];

  // Initialize user and fetch pools on component mount
  useEffect(() => {
    console.log('🟡 [FindPools] Component mounted - this should ONLY happen when Find Pools tab is active!');
    
    const initializeComponent = async () => {
      try {
        // Get current user (optional for public pools)
        const userId = getUserUID();
        setCurrentUser(userId);
        console.log('🟡 [FindPools] Current user:', userId || 'Guest user');
        
        // Fetch pools (works with or without user)
        await fetchPools(userId);
      } catch (error) {
        console.error('🏊‍♂️❌ Error initializing component:', error);
        setError('Failed to load pools');
        setLoading(false);
      }
    };

    initializeComponent();
    
    // Cleanup function to log when component unmounts
    return () => {
      console.log('🟡 [FindPools] Component unmounting - this should happen when switching away from Find Pools tab');
    };
  }, []);

  // Fetch pools with current filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPools(currentUser);
    }, 500); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [selectedDestination, selectedSeats, startDate, endDate, selectedTerrains, selectedActivities, budgetLevel, currentUser, currentPage]);

  // Debounced search query effect (reset to page 1 on new search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchPools(currentUser);
    }, 300); // Shorter debounce for search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentUser]);

  /**
   * Fetch pools from the API with current filters and pagination
   */
  const fetchPools = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🏊‍♂️ Fetching paginated pools with filters:', {
        page: currentPage,
        pageSize,
        filters: {
          searchQuery,
          baseCity: selectedDestination,
          startDate,
          endDate,
          budgetLevel,
          preferredActivities: selectedActivities
        }
      });
      
      const filters = {
        searchQuery,
        baseCity: selectedDestination,
        startDate,
        endDate,
        budgetLevel,
        preferredActivities: selectedActivities
      };

      // Use cached data to avoid multiple API calls
      const cachedPools = await PoolsApi.getCachedPools();
      let allFilteredPools = await PoolsApi.getPublicPools(filters, cachedPools);

      // Apply seats filter
      if (selectedSeats) {
        const seatsNum = parseInt(selectedSeats);
        allFilteredPools = allFilteredPools.filter(pool => {
          const availableSeats = pool.maxParticipants - pool.participants;
          if (seatsNum === 1) return availableSeats >= 1;
          if (seatsNum === 2) return availableSeats >= 2;
          if (seatsNum === 3) return availableSeats >= 3;
          return true;
        });
      }

      // Apply terrain filter (frontend only since it's not in API yet)
      if (selectedTerrains.length > 0) {
        allFilteredPools = allFilteredPools.filter(pool => {
          // For now, use basic matching against pool name and highlights
          const poolText = `${pool.name} ${pool.highlights.join(' ')}`.toLowerCase();
          return selectedTerrains.some(terrain => {
            switch (terrain) {
              case 'beaches': return poolText.includes('beach') || poolText.includes('coast') || poolText.includes('sea');
              case 'mountains': return poolText.includes('mountain') || poolText.includes('hill') || poolText.includes('peak');
              case 'forests': return poolText.includes('forest') || poolText.includes('jungle') || poolText.includes('rainforest');
              case 'historical': return poolText.includes('historical') || poolText.includes('ancient') || poolText.includes('temple');
              case 'city': return poolText.includes('city') || poolText.includes('urban') || poolText.includes('colombo');
              case 'parks': return poolText.includes('park') || poolText.includes('safari') || poolText.includes('wildlife');
              default: return false;
            }
          });
        });
      }

      // Apply frontend pagination
      const paginationResult = PoolsApi.paginatePools(allFilteredPools, currentPage, pageSize);
      
      setPools(paginationResult.pools);
      setPagination(paginationResult.pagination);
      
      console.log('🏊‍♂️ Paginated pools loaded:', {
        totalPools: paginationResult.pagination.totalPools,
        currentPage: paginationResult.pagination.currentPage,
        totalPages: paginationResult.pagination.totalPages,
        poolsOnThisPage: paginationResult.pools.length
      });
      
    } catch (error) {
      console.error('🏊‍♂️❌ Error fetching pools:', error);
      setError(error.message || 'Failed to load pools');
    } finally {
      setLoading(false);
    }
  };

  // Filter helper functions
  const toggleTerrain = (terrainId) => {
    setSelectedTerrains(prev => 
      prev.includes(terrainId)
        ? prev.filter(id => id !== terrainId)
        : [...prev, terrainId]
    );
  };

  const toggleActivity = (activityId) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDestination('');
    setSelectedSeats('');
    setStartDate('');
    setEndDate('');
    setSelectedTerrains([]);
    setSelectedActivities([]);
    setBudgetLevel('');
  };

  const hasActiveFilters = () => {
    return searchQuery || selectedDestination || selectedSeats || startDate || endDate || 
           selectedTerrains.length > 0 || selectedActivities.length > 0 || budgetLevel;
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const current = pagination.currentPage;
    
    // Always show first page
    if (totalPages > 0) pages.push(1);
    
    // Calculate start and end of visible page range
    let start = Math.max(2, current - 2);
    let end = Math.min(totalPages - 1, current + 2);
    
    // Add ellipsis before visible range if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add visible page range
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis after visible range if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if different from first)
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  const handleJoinPool = async (pool) => {
    try {
      console.log('🏊‍♂️ Opening join modal for pool:', pool.name);
      
      if (!user) {
        alert('Please log in to join a pool');
        navigate('/login');
        return;
      }

      // Open the join modal instead of directly joining
      setSelectedPoolForJoin(pool);
      setJoinModalOpen(true);
      
    } catch (error) {
      console.error('🏊‍♂️❌ Error opening join modal:', error);
      alert(`Failed to open join request: ${error.message}`);
    }
  };

  const handleJoinSuccess = async (result) => {
    console.log('🏊‍♂️✅ Join request sent successfully:', result);
    
    // Refresh pools to show updated state
    await fetchPools(currentUser);
    
    // Show success message
    alert(`Join request sent successfully! All group members must approve before you can join.`);
  };

  const handleCloseJoinModal = () => {
    setJoinModalOpen(false);
    setSelectedPoolForJoin(null);
  };

  const handlePoolClick = (pool) => {
    console.log('🔍 Viewing pool:', pool.name);
    console.log('🔍 Pool data:', { groupId: pool.id, tripId: pool.tripId });
    
    // Use tripId for the URL since that's what the comprehensive endpoint expects
    const urlId = pool.tripId || pool.id; // Fallback to groupId if no tripId
    
    // Navigate to the view pool page with pool data
    navigate(`/pool/${urlId}`, { 
      state: { 
        pool: pool,
        sourcePage: 'findPools'
      } 
    });
  };

  return (
    <div>
      {/* Search and Basic Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination, owner, or name..."
            className="w-full sm:w-[400px] md:w-[500px] lg:w-[600px] px-4 py-3 pl-12 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2">
          <div className="relative min-w-[140px]">
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white appearance-none w-full pr-10"
            >
              <option value="">All Destinations</option>
              <option value="Kandy">Kandy</option>
              <option value="Ella">Ella</option>
              <option value="Colombo">Colombo</option>
              <option value="Galle">Galle</option>
              <option value="Sigiriya">Sigiriya</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Mirissa">Mirissa</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
              <option value="Yala">Yala</option>
              <option value="Udawalawe">Udawalawe</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Trincomalee">Trincomalee</option>
              <option value="Bentota">Bentota</option>
              <option value="Hikkaduwa">Hikkaduwa</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </div>
          
          <div className="relative min-w-[120px]">
            <select
              value={selectedSeats}
              onChange={(e) => setSelectedSeats(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white appearance-none w-full pr-10"
            >
              <option value="">All Seats</option>
              <option value="1">1 seat</option>
              <option value="2">2 seats</option>
              <option value="3">3+ seats</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-full transition-colors ${
              showAdvancedFilters || hasActiveFilters()
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters() && (
              <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[selectedTerrains.length, selectedActivities.length, startDate ? 1 : 0, budgetLevel ? 1 : 0].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <div className="flex gap-2">
              {hasActiveFilters() && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Travel Dates</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Start Date"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="End Date"
                  />
                </div>
              </div>
            </div>

            {/* Budget Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Budget Level</label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any Budget</option>
                <option value="Low">Low (Under Rs. 15,000)</option>
                <option value="Medium">Medium (Rs. 15,000 - 30,000)</option>
                <option value="High">High (Above Rs. 30,000)</option>
              </select>
            </div>
          </div>

          {/* Terrain Preferences */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Terrains</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {terrainOptions.map(terrain => {
                const IconComponent = terrain.icon;
                const isSelected = selectedTerrains.includes(terrain.id);
                return (
                  <button
                    key={terrain.id}
                    onClick={() => toggleTerrain(terrain.id)}
                    className={`flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 mb-1 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className="text-xs font-medium">{terrain.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Preferences */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Activities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {activityOptions.map(activity => {
                const IconComponent = activity.icon;
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <button
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`flex flex-col items-center p-3 border-2 rounded-lg transition-all ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mb-1 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className="text-xs font-medium text-center">{activity.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters() && !showAdvancedFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {selectedTerrains.map(terrainId => {
              const terrain = terrainOptions.find(t => t.id === terrainId);
              return (
                <span key={terrainId} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                  {terrain?.name}
                  <button onClick={() => toggleTerrain(terrainId)} className="ml-1 hover:text-primary-900">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {selectedActivities.map(activityId => {
              const activity = activityOptions.find(a => a.id === activityId);
              return (
                <span key={activityId} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {activity?.name}
                  <button onClick={() => toggleActivity(activityId)} className="ml-1 hover:text-blue-900">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {startDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                From: {new Date(startDate).toLocaleDateString()}
                <button onClick={() => setStartDate('')} className="ml-1 hover:text-green-900">
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                To: {new Date(endDate).toLocaleDateString()}
                <button onClick={() => setEndDate('')} className="ml-1 hover:text-green-900">
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {budgetLevel && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                {budgetLevel} Budget
                <button onClick={() => setBudgetLevel('')} className="ml-1 hover:text-yellow-900">
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Pool Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading pools...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-800 font-medium mb-2">Failed to load pools</div>
          <div className="text-red-600 text-sm mb-4">{error}</div>
          <button 
            onClick={() => fetchPools(currentUser)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : pools.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-600 font-medium mb-2">No pools found</div>
          <div className="text-gray-500 text-sm">
            {hasActiveFilters() 
              ? 'Try adjusting your filters to see more results' 
              : 'No pools are currently available. Check back later!'}
          </div>
          {hasActiveFilters() && (
            <button 
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <PoolCard 
              key={pool.id} 
              pool={pool} 
              onJoinPool={handleJoinPool}
              onClick={handlePoolClick}
            />
          ))}
        </div>
      )}

      {/* Pagination - Only show if there are pools and multiple pages */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button 
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage}
              className={`px-4 py-2 border rounded-full transition-colors ${
                pagination.hasPreviousPage
                  ? 'border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
                  : 'border-gray-200 dark:border-secondary-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            
            {/* Show up to 5 page numbers with current page in center */}
            {getPageNumbers().map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-full font-medium flex items-center justify-center transition-colors ${
                    pageNum === pagination.currentPage
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
            
            <button 
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
              className={`px-4 py-2 border rounded-full transition-colors ${
                pagination.hasNextPage
                  ? 'border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
                  : 'border-gray-200 dark:border-secondary-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Join Pool Modal */}
      <JoinPoolModal
        open={joinModalOpen}
        onClose={handleCloseJoinModal}
        poolData={selectedPoolForJoin}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default FindPools;

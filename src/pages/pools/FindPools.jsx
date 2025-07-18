import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PoolCard from '../../components/PoolCard';
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
  
  const navigate = useNavigate();

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

  const pools = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      name: 'Adventure to Ella',
      owner: 'John Doe',
      destinations: 'Kandy, Nuwara Eliya, Ella',
      participants: 3,
      maxParticipants: 5,
      rating: 4.8,
      price: 'Rs. 15,000',
      date: 'Aug 15-17, 2025',
      duration: '3 days',
      status: 'open',
      highlights: ['Tea Plantations', 'Nine Arch Bridge', 'Little Adams Peak'],
      itinerary: [
        {
          day: 1,
          date: 'Aug 15, 2025',
          location: 'Kandy',
          activities: [
            'Temple of the Sacred Tooth visit',
            'Kandy Lake walk',
            'Traditional cultural show'
          ]
        },
        {
          day: 2,
          date: 'Aug 16, 2025',
          location: 'Nuwara Eliya',
          activities: [
            'Tea plantation tour',
            'Gregory Lake activities',
            'Strawberry farm visit'
          ]
        },
        {
          day: 3,
          date: 'Aug 17, 2025',
          location: 'Ella',
          activities: [
            'Nine Arch Bridge exploration',
            'Little Adams Peak hike',
            'Ella Rock viewpoint'
          ]
        }
      ]
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
      name: 'Beach Escape',
      owner: 'Jane Smith',
      destinations: 'Colombo, Galle, Mirissa',
      participants: 2,
      maxParticipants: 4,
      rating: 4.6,
      price: 'Rs. 12,000',
      date: 'Aug 20-21, 2025',
      duration: '2 days',
      status: 'open',
      highlights: ['Whale Watching', 'Galle Fort', 'Beach Sunset'],
      itinerary: [
        {
          day: 1,
          date: 'Aug 20, 2025',
          location: 'Colombo & Galle',
          activities: [
            'Departure from Colombo',
            'Galle Fort exploration',
            'Local seafood lunch'
          ]
        },
        {
          day: 2,
          date: 'Aug 21, 2025',
          location: 'Mirissa',
          activities: [
            'Whale watching tour',
            'Beach relaxation',
            'Sunset viewing'
          ]
        }
      ]
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
      name: 'Cultural Wonders',
      owner: 'Sam Perera',
      destinations: 'Anuradhapura, Sigiriya, Polonnaruwa',
      participants: 5,
      maxParticipants: 7,
      rating: 4.9,
      price: 'Rs. 18,000',
      date: 'Aug 25-28, 2025',
      duration: '4 days',
      status: 'open',
      highlights: ['Ancient Ruins', 'Lion Rock', 'Sacred Sites', 'Buddhist Temples'],
      itinerary: [
        {
          day: 1,
          date: 'Aug 25, 2025',
          location: 'Anuradhapura',
          activities: [
            'Ancient city exploration',
            'Sacred Bodhi Tree visit',
            'Ruwanwelisaya Stupa'
          ]
        },
        {
          day: 2,
          date: 'Aug 26, 2025',
          location: 'Sigiriya',
          activities: [
            'Lion Rock climb',
            'Ancient palace ruins',
            'Sigiriya Museum visit'
          ]
        },
        {
          day: 3,
          date: 'Aug 27, 2025',
          location: 'Polonnaruwa',
          activities: [
            'Ancient kingdom tour',
            'Gal Vihara Buddha statues',
            'Royal Palace ruins'
          ]
        },
        {
          day: 4,
          date: 'Aug 28, 2025',
          location: 'Return Journey',
          activities: [
            'Final temple visits',
            'Local handicraft shopping',
            'Departure'
          ]
        }
      ]
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
      name: 'Hill Country Hike',
      owner: 'Ayesha Fernando',
      destinations: 'Kandy, Haputale, Ella',
      participants: 1,
      maxParticipants: 5,
      rating: 4.5,
      price: 'Rs. 16,000',
      date: 'Sep 1-3, 2025',
      duration: '3 days',
      status: 'open',
      highlights: ['Mountain Views', 'Train Ride', 'Hiking Trails']
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
      name: 'Wildlife Safari',
      owner: 'Kasun Silva',
      destinations: 'Yala, Udawalawe, Tissamaharama',
      participants: 4,
      maxParticipants: 6,
      rating: 4.7,
      price: 'Rs. 20,000',
      date: 'Sep 5-7, 2025',
      duration: '3 days',
      status: 'open',
      highlights: ['Safari Drives', 'Elephants', 'Leopards']
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
      name: 'Northern Explorer',
      owner: 'Priya Kumari',
      destinations: 'Jaffna, Mannar, Kilinochchi',
      participants: 2,
      maxParticipants: 5,
      rating: 4.4,
      price: 'Rs. 22,000',
      date: 'Sep 10-13, 2025',
      duration: '4 days',
      status: 'open',
      highlights: ['Cultural Heritage', 'Baobab Tree', 'Jaffna Fort']
    }
  ];

  const handleJoinPool = (pool) => {
    console.log('Joining pool:', pool);
    // Add your join pool logic here
  };

  const handlePoolClick = (pool) => {
    console.log('🔍 Viewing pool:', pool.name);
    // Navigate to the view pool page with pool data
    navigate(`/pool/${pool.id}`, { 
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
              <option value="kandy">Kandy</option>
              <option value="ella">Ella</option>
              <option value="colombo">Colombo</option>
              <option value="galle">Galle</option>
              <option value="sigiriya">Sigiriya</option>
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

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
            Previous
          </button>
          <button className="w-10 h-10 bg-primary-600 text-white rounded-full font-medium flex items-center justify-center">
            1
          </button>
          <button className="w-10 h-10 border border-gray-300 dark:border-secondary-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors flex items-center justify-center">
            2
          </button>
          <button className="w-10 h-10 border border-gray-300 dark:border-secondary-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors flex items-center justify-center">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindPools;

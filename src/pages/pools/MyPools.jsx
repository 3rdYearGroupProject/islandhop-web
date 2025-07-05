import React, { useState } from 'react';
import Card, { CardBody } from '../../components/Card';
import PoolCard from '../../components/PoolCard';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');

  // Ongoing Pool Data
  const ongoingPool = {
    id: 'ongoing',
    name: 'Highlands Adventure',
    destinations: 'Kandy, Nuwara Eliya, Ella',
    date: '2025-07-15',
    status: 'Ongoing',
    participants: '4/6',
    owner: 'John Doe',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    itinerary: ['Kandy', 'Nuwara Eliya', 'Ella']
  };

  // Upcoming Pools Data
  const upcomingPools = [
    {
      id: 201,
      name: 'Central Highlands Trek',
      destinations: 'Nuwara Eliya, Ella',
      date: 'Aug 15-17, 2025',
      status: 'open',
      image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
      participants: 3,
      maxParticipants: 5,
      price: 'Rs. 16,000',
      duration: '3 days',
      owner: 'Sarah Johnson',
      rating: 4.7,
      highlights: ['Mountain Views', 'Tea Plantations', 'Hiking']
    },
    {
      id: 202,
      name: 'West Coast Adventure',
      destinations: 'Negombo, Chilaw',
      date: 'Sep 2-3, 2025',
      status: 'open',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      participants: 2,
      maxParticipants: 4,
      price: 'Rs. 12,000',
      duration: '2 days',
      owner: 'Mike Chen',
      rating: 4.5,
      highlights: ['Beach', 'Fishing', 'Sunset']
    },
    {
      id: 203,
      name: 'Rainforest Expedition',
      destinations: 'Sinharaja',
      date: 'Sep 20-22, 2025',
      status: 'open',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
      participants: 4,
      maxParticipants: 6,
      price: 'Rs. 18,000',
      duration: '3 days',
      owner: 'David Silva',
      rating: 4.8,
      highlights: ['Wildlife', 'Biodiversity', 'Nature Walk']
    },
    {
      id: 204,
      name: 'Cultural Fest',
      destinations: 'Kandy',
      date: 'Oct 5-6, 2025',
      status: 'open',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
      participants: 5,
      maxParticipants: 7,
      price: 'Rs. 10,000',
      duration: '2 days',
      owner: 'Priya Perera',
      rating: 4.6,
      highlights: ['Temple Visits', 'Cultural Shows', 'Local Food']
    }
  ];

  // Pool History Data
  const poolHistory = [
    {
      id: 101,
      name: 'Sigiriya Adventure',
      destinations: 'Sigiriya, Dambulla',
      date: 'Dec 10-12, 2024',
      status: 'closed',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      participants: 6,
      maxParticipants: 6,
      price: 'Rs. 14,000',
      duration: '3 days',
      owner: 'Alex Thompson',
      rating: 4.9,
      highlights: ['Ancient Ruins', 'Lion Rock', 'Cave Temples']
    },
    {
      id: 102,
      name: 'South Coast Roadtrip',
      destinations: 'Galle, Matara, Tangalle',
      date: 'Jan 22-24, 2025',
      status: 'closed',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
      participants: 5,
      maxParticipants: 5,
      price: 'Rs. 15,000',
      duration: '3 days',
      owner: 'Lisa Wong',
      rating: 4.7,
      highlights: ['Coastal Drive', 'Historic Fort', 'Beach Time']
    },
    {
      id: 103,
      name: 'Hill Country Trek',
      destinations: 'Kandy, Nuwara Eliya',
      date: 'Mar 5-7, 2025',
      status: 'closed',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
      participants: 0,
      maxParticipants: 6,
      price: 'Rs. 16,000',
      duration: '3 days',
      owner: 'John Smith',
      rating: null,
      highlights: ['Cancelled Trip']
    },
    {
      id: 104,
      name: 'Northern Explorer',
      destinations: 'Jaffna, Mannar',
      date: 'Apr 12-15, 2025',
      status: 'closed',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
      participants: 4,
      maxParticipants: 4,
      price: 'Rs. 22,000',
      duration: '4 days',
      owner: 'Ravi Kumar',
      rating: 4.8,
      highlights: ['Cultural Heritage', 'Baobab Tree', 'Jaffna Fort']
    }
  ];

  const handlePoolAction = (pool) => {
    console.log('Pool action:', pool);
    // Add your pool action logic here
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-10 flex justify-center">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-center w-full max-w-2xl">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your pools..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white text-sm shadow-none"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Destination Filter */}
          <div className="relative w-full md:w-44">
            <div className="relative">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="appearance-none w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white text-sm shadow-none pr-8 min-w-[120px] cursor-pointer transition-colors duration-200"
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

          {/* Create New Button removed as requested */}
        </div>
      </div>

      {/* Ongoing Pool - Full Width Card */}
      {ongoingPool && (
        <div className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Current Pool
          </h2>
          <div className="group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 hover:border-green-400 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 flex flex-col lg:flex-row h-full">
            {/* Image on the left */}
            <div className="relative w-full lg:w-1/3 h-56 lg:h-auto flex-shrink-0">
              <img
                src={ongoingPool.image}
                alt={ongoingPool.name}
                className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-none lg:rounded-l-2xl"
                style={{ borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }}
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                  Ongoing
                </span>
              </div>
            </div>
            {/* Details on the right */}
            <div className="flex-1 flex flex-col p-8">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {ongoingPool.name}
                </h3>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                by {ongoingPool.owner}
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{ongoingPool.destinations}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{ongoingPool.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{ongoingPool.participants} participants</span>
                </div>
              </div>
              {/* Itinerary Timeline */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Itinerary Progress
                </h4>
                <div className="flex items-center space-x-4">
                  {ongoingPool.itinerary.map((destination, index) => (
                    <div key={destination} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                          {destination}
                        </span>
                      </div>
                      {index < ongoingPool.itinerary.length - 1 && (
                        <div className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-gray-300 mx-2 rounded-full min-w-[40px]"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {/* You can add a rating or other info here if needed */}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors">
                    Contact Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Pools */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Upcoming Pools
        </h2>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-6 min-w-[600px]">
            {upcomingPools.map((pool) => (
              <div className="min-w-[340px] max-w-[340px] flex-shrink-0" key={pool.id}>
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
      </div>

      {/* Pool History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Pool History
        </h2>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-6 min-w-[600px]">
            {poolHistory.map((pool) => (
              <div key={pool.id} className="opacity-80 min-w-[340px] max-w-[340px] flex-shrink-0">
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
      </div>
    </div>
  );
};

export default MyPools;
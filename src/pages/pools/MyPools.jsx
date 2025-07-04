import React, { useState } from 'react';
import Card, { CardBody } from '../../components/Card';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

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
      date: '2025-08-15',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
      participants: '3/5',
      price: 'Rs. 16,000'
    },
    {
      id: 202,
      name: 'West Coast Adventure',
      destinations: 'Negombo, Chilaw',
      date: '2025-09-02',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      participants: '2/4',
      price: 'Rs. 12,000'
    },
    {
      id: 203,
      name: 'Rainforest Expedition',
      destinations: 'Sinharaja',
      date: '2025-09-20',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
      participants: '4/6',
      price: 'Rs. 18,000'
    },
    {
      id: 204,
      name: 'Cultural Fest',
      destinations: 'Kandy',
      date: '2025-10-05',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
      participants: '5/7',
      price: 'Rs. 10,000'
    }
  ];

  // Pool History Data
  const poolHistory = [
    {
      id: 101,
      name: 'Sigiriya Adventure',
      destinations: 'Sigiriya, Dambulla',
      date: '2024-12-10',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 102,
      name: 'South Coast Roadtrip',
      destinations: 'Galle, Matara, Tangalle',
      date: '2025-01-22',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 103,
      name: 'Hill Country Trek',
      destinations: 'Kandy, Nuwara Eliya',
      date: '2025-03-05',
      status: 'Cancelled',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 104,
      name: 'Northern Explorer',
      destinations: 'Jaffna, Mannar',
      date: '2025-04-12',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    }
  ];

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
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="appearance-none px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white text-sm shadow-none pr-8 min-w-[120px] cursor-pointer transition-colors duration-200"
            >
              <option value="">All Destinations</option>
              <option value="kandy">Kandy</option>
              <option value="ella">Ella</option>
              <option value="colombo">Colombo</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Create New Button */}
          <button className="flex items-center justify-center gap-2 bg-success-600 text-white px-6 py-2 rounded-full font-medium hover:bg-success-700 transition-colors text-sm w-full md:w-44 min-w-[120px]">
            <PlusIcon className="h-4 w-4" />
            Create New
          </button>
        </div>
      </div>

      {/* Ongoing Pool - Full Width Card */}
      {ongoingPool && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Current Trip
          </h2>
          <Card className="bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-2 border-success-200 dark:border-success-700 p-0 overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full">
              <div className="relative w-full lg:w-1/2 h-48 lg:h-auto flex-shrink-0">
                <img
                  src={ongoingPool.image}
                  alt={ongoingPool.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-success-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  {ongoingPool.status}
                </div>
              </div>
              <CardBody className="flex-1">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-success-800 dark:text-success-200 mb-2">
                        {ongoingPool.name}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-2">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {ongoingPool.destinations}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {ongoingPool.date}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {ongoingPool.participants}
                        </div>
                      </div>
                      {/* Status badge removed from right side */}
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
                            <div className="w-4 h-4 bg-success-600 rounded-full border-2 border-white shadow-md"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                              {destination}
                            </span>
                          </div>
                          {index < ongoingPool.itinerary.length - 1 && (
                            <div className="flex-1 h-1 bg-gradient-to-r from-success-600 to-gray-300 mx-2 rounded-full min-w-[40px]"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button className="bg-success-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-success-700 transition-colors">
                      View Details
                    </button>
                    <button className="bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors">
                      Contact Group
                    </button>
                  </div>
                </div>
              </CardBody>
            </div>
          </Card>
        </div>
      )}

      {/* Upcoming Pools */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Upcoming Pools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {upcomingPools.map((pool) => (
            <Card key={pool.id} hover className="group cursor-pointer p-0 flex flex-col">
              <div className="relative w-full aspect-[4/3] flex-shrink-0">
                <img
                  src={pool.image}
                  alt={pool.name}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                  style={{ margin: 0, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}
                />
                <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  {pool.status}
                </div>
              </div>
              
              <CardBody className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-700 transition-colors">
                  {pool.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {pool.destinations}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {pool.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {pool.participants}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-primary-600">
                      {pool.price}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors mt-auto">
                  View Details
                </button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Pool History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Pool History
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {poolHistory.map((pool) => (
            <Card key={pool.id} hover className="group cursor-pointer opacity-80 p-0 flex flex-col">
              <div className="relative w-full aspect-[4/3] flex-shrink-0">
                <img
                  src={pool.image}
                  alt={pool.name}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                  style={{ margin: 0, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}
                />
              </div>
              
              <CardBody className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-primary-600 transition-colors">
                  {pool.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {pool.destinations}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {pool.date}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className={`text-sm font-medium ${
                      pool.status === 'Completed' 
                        ? 'text-success-600' 
                        : 'text-danger-600'
                    }`}>
                      {pool.status}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors mt-auto">
                  View Details
                </button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPools;
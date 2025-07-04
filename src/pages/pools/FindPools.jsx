import React, { useState } from 'react';
import PoolCard from '../../components/PoolCard';
import { 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const FindPools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');

  const pools = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      name: 'Adventure to Ella',
      owner: 'John Doe',
      destinations: 'Kandy, Nuwara Eliya, Ella',
      participants: '3/5',
      rating: 4.8,
      price: 'Rs. 15,000',
      date: '2025-08-15',
      duration: '3 days'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
      name: 'Beach Escape',
      owner: 'Jane Smith',
      destinations: 'Colombo, Galle, Mirissa',
      participants: '2/4',
      rating: 4.6,
      price: 'Rs. 12,000',
      date: '2025-08-20',
      duration: '2 days'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
      name: 'Cultural Wonders',
      owner: 'Sam Perera',
      destinations: 'Anuradhapura, Sigiriya, Polonnaruwa',
      participants: '5/7',
      rating: 4.9,
      price: 'Rs. 18,000',
      date: '2025-08-25',
      duration: '4 days'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
      name: 'Hill Country Hike',
      owner: 'Ayesha Fernando',
      destinations: 'Kandy, Haputale, Ella',
      participants: '1/5',
      rating: 4.5,
      price: 'Rs. 16,000',
      date: '2025-09-01',
      duration: '3 days'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
      name: 'Wildlife Safari',
      owner: 'Kasun Silva',
      destinations: 'Yala, Udawalawe, Tissamaharama',
      participants: '4/6',
      rating: 4.7,
      price: 'Rs. 20,000',
      date: '2025-09-05',
      duration: '3 days'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
      name: 'Northern Explorer',
      owner: 'Priya Kumari',
      destinations: 'Jaffna, Mannar, Kilinochchi',
      participants: '2/5',
      rating: 4.4,
      price: 'Rs. 22,000',
      date: '2025-09-10',
      duration: '4 days'
    }
  ];

  const handleJoinPool = (pool) => {
    console.log('Joining pool:', pool);
    // Add your join pool logic here
  };

  return (

    <div>
      {/* Search and Filters on Same Line, Centered and Closer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-8">
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

        {/* Filters */}
        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white appearance-none min-w-[140px]"
        >
          <option value="">All Destinations</option>
          <option value="kandy">Kandy</option>
          <option value="ella">Ella</option>
          <option value="colombo">Colombo</option>
          <option value="galle">Galle</option>
          <option value="sigiriya">Sigiriya</option>
        </select>
        <select
          value={selectedSeats}
          onChange={(e) => setSelectedSeats(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white appearance-none min-w-[120px]"
        >
          <option value="">All Seats</option>
          <option value="1">1 seat</option>
          <option value="2">2 seats</option>
          <option value="3">3+ seats</option>
        </select>
      </div>

      {/* Pool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <PoolCard 
            key={pool.id} 
            pool={pool} 
            onJoinPool={handleJoinPool}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindPools;

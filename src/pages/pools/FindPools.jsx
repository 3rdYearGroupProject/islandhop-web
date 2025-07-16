import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PoolCard from '../../components/PoolCard';
import { 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const FindPools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');
  const navigate = useNavigate();

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
          <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center h-full">
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
          <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center h-full">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </span>
        </div>
      </div>

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

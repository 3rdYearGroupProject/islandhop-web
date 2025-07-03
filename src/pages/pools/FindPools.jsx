import React, { useState } from 'react';
import Card, { CardBody } from '../../components/Card';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  StarIcon
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 fill-yellow-200 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-8 bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination, owner, or name..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Destination Filter */}
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
          >
            <option value="">All Destinations</option>
            <option value="kandy">Kandy</option>
            <option value="ella">Ella</option>
            <option value="colombo">Colombo</option>
            <option value="galle">Galle</option>
            <option value="sigiriya">Sigiriya</option>
          </select>

          {/* Seats Filter */}
          <select
            value={selectedSeats}
            onChange={(e) => setSelectedSeats(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
          >
            <option value="">All Seats</option>
            <option value="1">1 seat</option>
            <option value="2">2 seats</option>
            <option value="3">3+ seats</option>
          </select>
        </div>
      </div>

      {/* Pool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <Card key={pool.id} hover className="group cursor-pointer">
            <div className="relative">
              <img
                src={pool.image}
                alt={pool.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {pool.duration}
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                {pool.price}
              </div>
            </div>
            
            <CardBody>
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                  {pool.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {pool.owner}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex mr-2">{renderStars(pool.rating)}</div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pool.rating}
                </span>
              </div>

              {/* Destinations */}
              <div className="flex items-start mb-3">
                <MapPinIcon className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pool.destinations}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center mb-3">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pool.date}
                </span>
              </div>

              {/* Participants */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {pool.participants} participants
                  </span>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Join Pool
                </button>
              </div>
            </CardBody>
          </Card>
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

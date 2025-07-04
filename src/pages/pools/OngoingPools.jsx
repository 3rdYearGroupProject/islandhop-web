import React from 'react';
import Card, { CardBody } from '../../components/Card';
import { 
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  PhoneIcon,
  ClockIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const OngoingPools = () => {
  // Ongoing Pool Data
  const ongoingPool = {
    id: 'ongoing',
    name: 'Highlands Adventure',
    destinations: 'Kandy, Nuwara Eliya, Ella',
    date: '2025-07-15',
    status: 'Ongoing',
    participants: '4/6',
    owner: 'John Doe',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=320&q=80',
    itinerary: ['Kandy', 'Nuwara Eliya', 'Ella'],
    currentLocation: 'Nuwara Eliya',
    notes: 'Please be ready at the pickup point in Kandy by 7:30 AM. Bring your hiking gear and water bottles. Contact the owner for any questions.',
    nextDestination: 'Ella',
    estimatedArrival: '3:30 PM'
  };

  // Participants Data
  const participants = [
    { name: 'John Doe', role: 'Owner', img: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'active' },
    { name: 'Jane Smith', role: 'Traveler', img: 'https://randomuser.me/api/portraits/women/44.jpg', status: 'active' },
    { name: 'Sam Perera', role: 'Traveler', img: 'https://randomuser.me/api/portraits/men/45.jpg', status: 'active' },
    { name: 'Ayesha Fernando', role: 'Traveler', img: 'https://randomuser.me/api/portraits/women/46.jpg', status: 'active' }
  ];

  // Live Updates Data
  const liveUpdates = [
    { time: '2:15 PM', message: 'Just arrived in Nuwara Eliya! Beautiful tea plantations everywhere 🌿', author: 'John Doe' },
    { time: '1:45 PM', message: 'Taking a break at a local tea factory. Amazing views!', author: 'Jane Smith' },
    { time: '12:30 PM', message: 'Lunch stop at a traditional Sri Lankan restaurant', author: 'Sam Perera' },
    { time: '10:00 AM', message: 'Started our journey from Kandy. Weather is perfect!', author: 'John Doe' }
  ];

  return (
    <div>
      <Card className="bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-2 border-success-200 dark:border-success-700">
        <CardBody className="p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <img
              src={ongoingPool.image}
              alt={ongoingPool.name}
              className="w-full lg:w-48 h-32 object-cover rounded-xl border-2 border-success-300"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-success-800 dark:text-success-200 mb-4">
                {ongoingPool.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span><strong>Destinations:</strong> {ongoingPool.destinations}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span><strong>Date:</strong> {ongoingPool.date}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span><strong>Participants:</strong> {ongoingPool.participants}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-success-600 mr-2" />
                  <span className="text-success-600 font-bold">Status: {ongoingPool.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Status Banner */}
          <div className="bg-success-600 text-white rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold">LIVE NOW</span>
                <span>Currently in: <strong>{ongoingPool.currentLocation}</strong></span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Next: {ongoingPool.nextDestination}</div>
                <div className="font-bold">ETA: {ongoingPool.estimatedArrival}</div>
              </div>
            </div>
          </div>

          {/* Itinerary Progress */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Journey Progress
            </h3>
            <div className="flex items-center justify-center space-x-8">
              {ongoingPool.itinerary.map((destination, index) => {
                const isCompleted = index === 0; // Kandy completed
                const isCurrent = index === 1; // Currently in Nuwara Eliya
                const isNext = index === 2; // Next is Ella
                
                return (
                  <div key={destination} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                        isCompleted 
                          ? 'bg-success-600' 
                          : isCurrent 
                          ? 'bg-warning-500 animate-pulse' 
                          : 'bg-gray-300'
                      }`}></div>
                      <span className={`text-sm font-semibold mt-2 ${
                        isCompleted 
                          ? 'text-success-600' 
                          : isCurrent 
                          ? 'text-warning-600' 
                          : 'text-gray-500'
                      }`}>
                        {destination}
                      </span>
                      {isCurrent && (
                        <span className="text-xs text-warning-600 font-bold mt-1">
                          Current
                        </span>
                      )}
                    </div>
                    {index < ongoingPool.itinerary.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 rounded-full min-w-[60px] max-w-[100px] ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-success-600 to-warning-500' 
                          : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Map Placeholder */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapIcon className="h-6 w-6 mr-2" />
              Live Location
            </h3>
            <div className="bg-gray-100 dark:bg-secondary-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-secondary-600">
              <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Live map tracking would be integrated here
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Real-time GPS location of the travel group
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Participants */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Active Participants
              </h3>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.name} className="flex items-center gap-3 bg-white dark:bg-secondary-800 rounded-lg p-3 border border-gray-200 dark:border-secondary-600">
                    <div className="relative">
                      <img
                        src={participant.img}
                        alt={participant.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-success-500"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {participant.name}
                      </div>
                      <div className="text-sm text-success-600 font-medium">
                        {participant.role} • Online
                      </div>
                    </div>
                    <button className="bg-success-600 text-white px-3 py-1 rounded-full text-sm hover:bg-success-700 transition-colors">
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Updates Feed */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                Live Updates
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {liveUpdates.map((update, index) => (
                  <div key={index} className="bg-white dark:bg-secondary-800 rounded-lg p-4 border border-gray-200 dark:border-secondary-600">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {update.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {update.time}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {update.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Info */}
          <div className="mt-8 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <ExclamationCircleIcon className="h-6 w-6 text-warning-600" />
              <h4 className="font-bold text-warning-800 dark:text-warning-200">
                Emergency Information
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-warning-800 dark:text-warning-200">Emergency Contact:</span>
                <br />
                <span className="text-warning-700 dark:text-warning-300">+94 77 123 4567</span>
              </div>
              <div>
                <span className="font-semibold text-warning-800 dark:text-warning-200">Guide Contact:</span>
                <br />
                <span className="text-warning-700 dark:text-warning-300">+94 71 987 6543</span>
              </div>
              <div>
                <span className="font-semibold text-warning-800 dark:text-warning-200">Driver Contact:</span>
                <br />
                <span className="text-warning-700 dark:text-warning-300">+94 75 456 7890</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="flex-1 bg-success-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-success-700 transition-colors flex items-center justify-center gap-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Join Group Chat
            </button>
            <button className="flex-1 bg-warning-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-warning-700 transition-colors flex items-center justify-center gap-2">
              <PhoneIcon className="h-5 w-5" />
              Emergency Call
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2">
              <MapIcon className="h-5 w-5" />
              Share Location
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OngoingPools;

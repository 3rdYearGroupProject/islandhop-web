import React, { useState } from 'react';
import Card, { CardBody } from '../../components/Card';
import GroupChat from '../../components/GroupChat';
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
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
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

  // Prevent background scroll when GroupChat is open
  React.useEffect(() => {
    if (isGroupChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGroupChatOpen]);

  return (
    <div className="space-y-8">
      {/* Trip Summary - ConfirmedPools style, but with Ongoing details */}
      <div className="mb-12">
        <div className="relative group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 hover:border-green-400 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 flex flex-col lg:flex-row h-full max-w-4xl mx-auto">
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
                {ongoingPool.status}
              </span>
            </div>
          </div>
          {/* Details on the right */}
          <div className="flex-1 flex flex-col p-8">
            <div className="flex flex-col items-start justify-between mb-3">
              <span className="uppercase tracking-wide text-gray-400 text-xs font-semibold mb-1">Ongoing Pool</span>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {ongoingPool.name}
              </h3>
            </div>
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
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
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm text-green-700 font-bold">Status: {ongoingPool.status}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Owner: {ongoingPool.owner}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Current: {ongoingPool.currentLocation}</span>
                </div>
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

      {/* Live Status Banner & Emergency Info Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Status Banner */}
        <Card className="!bg-green-600 !border-green-600 text-white min-h-[60px]">
          <CardBody className="p-2 !bg-green-600 flex items-center h-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-xs">LIVE NOW</span>
                <span className="text-xs">Currently in: <strong>{ongoingPool.currentLocation}</strong></span>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-90">Next: {ongoingPool.nextDestination}</div>
                <div className="font-bold text-xs">ETA: {ongoingPool.estimatedArrival}</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Emergency Info */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
          <CardBody className="p-2">
            <div className="flex items-center gap-2 mb-1">
              <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />
              <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-xs">
                Emergency Information
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200 block">Emergency:</span>
                <span className="text-yellow-700 dark:text-yellow-300">+94 77 123 4567</span>
              </div>
              <div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200 block">Guide:</span>
                <span className="text-yellow-700 dark:text-yellow-300">+94 71 987 6543</span>
              </div>
              <div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200 block">Driver:</span>
                <span className="text-yellow-700 dark:text-yellow-300">+94 75 456 7890</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Itinerary Progress */}
      <Card>
        <CardBody>
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
                        ? 'bg-green-600' 
                        : isCurrent 
                        ? 'bg-yellow-500 animate-pulse' 
                        : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-sm font-semibold mt-2 ${
                      isCompleted 
                        ? 'text-green-600' 
                        : isCurrent 
                        ? 'text-yellow-600' 
                        : 'text-gray-500'
                    }`}>
                      {destination}
                    </span>
                    {isCurrent && (
                      <span className="text-xs text-yellow-600 font-bold mt-1">
                        Current
                      </span>
                    )}
                  </div>
                  {index < ongoingPool.itinerary.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full min-w-[60px] max-w-[100px] ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-600 to-yellow-500' 
                        : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Live Map Placeholder */}
      <Card>
        <CardBody>
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
        </CardBody>
      </Card>

      {/* Participants & Live Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Participants */}
        <Card>
          <CardBody>
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
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {participant.name}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {participant.role} • Online
                    </div>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 transition-colors">
                    Message
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Live Updates Feed */}
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
              Live Updates
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {liveUpdates.map((update, index) => (
                <div key={index} className="bg-white dark:bg-secondary-800 rounded-lg p-4 border border-gray-200 dark:border-secondary-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
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
          </CardBody>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsGroupChatOpen(true)}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Group Chat
            </button>
            <button className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
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

      {/* Group Chat Modal */}
      <GroupChat 
        isOpen={isGroupChatOpen}
        onClose={() => setIsGroupChatOpen(false)}
        participants={participants}
        poolName={ongoingPool.name}
      />
    </div>
  );
};

export default OngoingPools;

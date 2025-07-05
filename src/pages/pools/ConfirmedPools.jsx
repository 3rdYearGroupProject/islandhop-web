import React from 'react';
import Card, { CardBody } from '../../components/Card';
import { 
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  PhoneIcon,
  ClockIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const ConfirmedPools = () => {
  // Confirmed Pool Data
  const confirmedPool = {
    id: 'confirmed',
    name: 'Highlands Adventure',
    destinations: 'Kandy, Nuwara Eliya, Ella',
    date: '2025-07-15',
    status: 'Confirmed',
    participants: '6/6',
    guide: 'Michael Guide',
    driver: 'Priyantha Driver',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=320&q=80',
    itinerary: [
      { destination: 'Kandy', date: 'July 15' },
      { destination: 'Nuwara Eliya', date: 'July 16' },
      { destination: 'Ella', date: 'July 17' }
    ],
    notes: 'All participants, please check your emails for the final itinerary and pickup times. Payment has been received for all travelers. Contact the guide or driver for any last-minute questions.'
  };

  // Payment Status Data
  const paymentStatus = [
    { name: 'John Doe', amount: 20000, paid: 20000, status: 'Paid', method: 'Credit Card' },
    { name: 'Jane Smith', amount: 20000, paid: 15000, status: 'Partial', method: 'Credit Card' },
    { name: 'Sam Perera', amount: 20000, paid: 20000, status: 'Paid', method: 'Bank Transfer' },
    { name: 'Ayesha Fernando', amount: 20000, paid: 5000, status: 'Partial', method: 'Credit Card' }
  ];

  // Participants Data
  const participants = [
    { name: 'John Doe', role: 'Owner', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Jane Smith', role: 'Traveler', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Sam Perera', role: 'Traveler', img: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Ayesha Fernando', role: 'Traveler', img: 'https://randomuser.me/api/portraits/women/46.jpg' },
    { name: 'Michael Guide', role: 'Guide', img: 'https://randomuser.me/api/portraits/men/47.jpg', from: 'Colombo', contact: '+94 77 987 6543', rating: 4.9 },
    {
      name: 'Priyantha Driver',
      role: 'Driver',
      img: 'https://randomuser.me/api/portraits/men/48.jpg',
      car: 'Toyota Prius 2018',
      from: 'Kandy',
      contact: '+94 77 123 4567',
      rating: 4.8
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trip Summary - MyPools Style Card */}
      <div className="mb-12">
        <div className="relative group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 hover:border-green-400 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 flex flex-col lg:flex-row h-full max-w-4xl mx-auto">
          {/* Image on the left */}
          <div className="relative w-full lg:w-1/3 h-56 lg:h-auto flex-shrink-0">
            <img
              src={confirmedPool.image}
              alt={confirmedPool.name}
              className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-none lg:rounded-l-2xl"
              style={{ borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }}
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                {confirmedPool.status}
              </span>
            </div>
          </div>
          {/* Details on the right */}
          <div className="flex-1 flex flex-col p-8">
            <div className="flex flex-col items-start justify-between mb-3">
              <span className="uppercase tracking-wide text-gray-400 text-xs font-semibold mb-1">Confirmed Pool</span>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {confirmedPool.name}
              </h3>
            </div>
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{confirmedPool.destinations}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{confirmedPool.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{confirmedPool.participants} participants</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm text-green-700 font-bold">Status: {confirmedPool.status}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Guide: {confirmedPool.guide}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Driver: {confirmedPool.driver}</span>
                </div>
              </div>
            </div>
            {/* Itinerary Timeline */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Itinerary Progress
              </h4>
              <div className="flex items-center space-x-4">
                {confirmedPool.itinerary.map((item, index) => (
                  <div key={item.destination} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                        {item.destination}
                      </span>
                    </div>
                    {index < confirmedPool.itinerary.length - 1 && (
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

      {/* Itinerary Section */}
      <Card className="rounded-xl">
        <CardBody>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Itinerary
          </h3>
          <div className="flex items-start justify-center">
            {confirmedPool.itinerary.map((item, index) => (
              <React.Fragment key={item.destination}>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: '#1C4ED8' }}></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
                    {item.destination}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.date}
                  </span>
                </div>
                {index < confirmedPool.itinerary.length - 1 && (
                  <div className="flex items-center" style={{ marginTop: '12px' }}>
                    <div className="w-16 h-1 rounded-full" style={{ backgroundColor: '#1C4ED8' }}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Payment Status & Participants Side by Side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment Status Section */}
        <Card className="rounded-xl flex-1">
          <CardBody>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCardIcon className="h-6 w-6 mr-2" />
              Payment Status
            </h3>
            <div className="space-y-4">
              {paymentStatus.map((payment) => {
                const percent = Math.round((payment.paid / payment.amount) * 100);
                return (
                  <div key={payment.name} className="bg-white dark:bg-secondary-800 rounded-lg p-4 border border-gray-200 dark:border-secondary-600">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                      <span className="font-bold text-gray-900 dark:text-white min-w-[120px]">
                        {payment.name}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Amount:</strong> Rs. {payment.amount.toLocaleString()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        payment.status === 'Paid' 
                          ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' 
                          : 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                      }`}>
                        {payment.status}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Method:</strong> {payment.method}
                      </span>
                    </div>
                    <div className="relative">
                    <div className="w-full rounded-full h-3" style={{ backgroundColor: '#e6effc' }}>
                      <div 
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: '#1C4ED8' }}
                      ></div>
                    </div>
                      <span className="absolute right-0 -top-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
        {/* Participants Section */}
        <Card className="rounded-xl flex-1">
          <CardBody>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Participants
            </h3>
            {/* Highlight Guide and Driver at the top */}
            <div className="space-y-2 mb-4">
              {participants.filter(p => p.role === 'Guide' || p.role === 'Driver').map((participant) => (
                <div
                  key={participant.name}
                  className={`relative flex flex-col md:flex-row items-center gap-4 p-5 rounded-2xl max-w-xl mx-auto ${
                    participant.role === 'Guide'
                      ? 'border-green-200 dark:border-green-300 bg-green-50 dark:bg-green-900/20'
                      : 'border-blue-200 dark:border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                  style={{ minWidth: 0, borderWidth: 2 }}
                >
                  <div className="flex flex-col items-center md:items-start w-32 flex-shrink-0">
                    <div className="relative">
                      <img
                        src={participant.img}
                        alt={participant.name}
                        className={`w-24 h-24 rounded-full object-cover border-4 ${
                          participant.role === 'Guide'
                            ? 'border-green-400'
                            : 'border-blue-400'
                        }`}
                      />
                      <span className={`absolute -bottom-2 -right-2 p-1 rounded-full bg-white dark:bg-secondary-900 border ${
                        participant.role === 'Guide' ? 'border-green-400' : 'border-blue-400'
                      }`}>{participant.role === 'Guide' ? (
                        <IdentificationIcon className="h-6 w-6 text-green-500" />
                      ) : (
                        <UserIcon className="h-6 w-6 text-blue-500" />
                      )}</span>
                    </div>
                    {/* No details for Guide below image, only in details section */}
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-gray-900 dark:text-white truncate">{participant.name}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        participant.role === 'Guide'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                      }`}>{participant.role}</span>
                    </div>
                    {/* Extra info for Guide and Driver */}
                    {participant.role === 'Driver' && (
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <div><span className="font-semibold">Car:</span> {participant.car}</div>
                        <div><span className="font-semibold">From:</span> {participant.from}</div>
                        <div><span className="font-semibold">Contact:</span> {participant.contact}</div>
                        <div className="flex items-center"><span className="font-semibold mr-1">Rating:</span> <span>{participant.rating}</span> <span className="ml-1 text-yellow-400">★</span></div>
                      </div>
                    )}
                    {participant.role === 'Guide' && (
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <div><span className="font-semibold">Contact:</span> {participant.contact ? participant.contact : 'N/A'}</div>
                        <div><span className="font-semibold">From:</span> {participant.from ? participant.from : ''}</div>
                        <div className="flex items-center"><span className="font-semibold mr-1">Rating:</span> <span>4.9</span> <span className="ml-1 text-yellow-400">★</span></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Other participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participants.filter(p => p.role !== 'Guide' && p.role !== 'Driver').map((participant) => (
                <div key={participant.name} className="flex items-center gap-3 bg-white dark:bg-secondary-800 rounded-lg p-3 border border-gray-200 dark:border-secondary-600">
                  <img
                    src={participant.img}
                    alt={participant.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-info-500"
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {participant.name}
                    </div>
                    <div className="text-sm font-medium text-info-600">
                      {participant.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Notes Section */}
      <Card className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-700 rounded-xl">
        <CardBody>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <ClockIcon className="h-6 w-6 mr-2" />
            Important Notes
          </h3>
          <div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {confirmedPool.notes}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <Card className="rounded-xl">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-green-200 text-green-900 py-3 px-6 rounded-full font-medium hover:bg-green-300 transition-colors border border-green-400">
              Contact Guide
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors">
              Contact Driver
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors">
              Download Itinerary
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ConfirmedPools;

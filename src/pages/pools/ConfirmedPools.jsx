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
  ExclamationTriangleIcon
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
    itinerary: ['Kandy', 'Nuwara Eliya', 'Ella'],
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
    { name: 'Michael Guide', role: 'Guide', img: 'https://randomuser.me/api/portraits/men/47.jpg' },
    { name: 'Priyantha Driver', role: 'Driver', img: 'https://randomuser.me/api/portraits/men/48.jpg' }
  ];

  return (
    <div>
      <Card className="bg-gradient-to-r from-info-50 to-info-100 dark:from-info-900/20 dark:to-info-800/20 border-2 border-info-200 dark:border-info-700">
        <CardBody className="p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <img
              src={confirmedPool.image}
              alt={confirmedPool.name}
              className="w-full lg:w-48 h-32 object-cover rounded-xl border-2 border-info-300"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-info-800 dark:text-info-200 mb-4">
                {confirmedPool.name} (Confirmed)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span><strong>Destinations:</strong> {confirmedPool.destinations}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span><strong>Date:</strong> {confirmedPool.date}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span><strong>Participants:</strong> {confirmedPool.participants}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-info-600 mr-2" />
                  <span className="text-info-600 font-bold">Status: {confirmedPool.status}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span><strong>Guide:</strong> {confirmedPool.guide}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span><strong>Driver:</strong> {confirmedPool.driver}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status Section */}
          <div className="mb-8">
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
                      <div className="w-full bg-gray-200 dark:bg-secondary-600 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            percent === 100 ? 'bg-success-500' : 'bg-warning-500'
                          }`}
                          style={{ width: `${percent}%` }}
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
          </div>

          {/* Itinerary Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Itinerary
            </h3>
            <div className="flex items-center justify-center space-x-8">
              {confirmedPool.itinerary.map((destination, index) => (
                <div key={destination} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-info-600 rounded-full border-2 border-white shadow-lg"></div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
                      {destination}
                    </span>
                  </div>
                  {index < confirmedPool.itinerary.length - 1 && (
                    <div className="flex-1 h-1 bg-gradient-to-r from-info-600 to-gray-300 mx-4 rounded-full min-w-[60px] max-w-[100px]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Participants Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Participants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participants.map((participant) => (
                <div key={participant.name} className="flex items-center gap-3 bg-white dark:bg-secondary-800 rounded-lg p-3 border border-gray-200 dark:border-secondary-600">
                  <img
                    src={participant.img}
                    alt={participant.name}
                    className={`w-12 h-12 rounded-full object-cover border-2 ${
                      participant.role === 'Guide' 
                        ? 'border-warning-500' 
                        : participant.role === 'Driver' 
                        ? 'border-danger-500' 
                        : 'border-info-500'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {participant.name}
                    </div>
                    <div className={`text-sm font-medium ${
                      participant.role === 'Guide' 
                        ? 'text-warning-600' 
                        : participant.role === 'Driver' 
                        ? 'text-danger-600' 
                        : 'text-info-600'
                    }`}>
                      {participant.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ClockIcon className="h-6 w-6 mr-2" />
              Important Notes
            </h3>
            <div className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {confirmedPool.notes}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-info-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-info-700 transition-colors">
              Contact Guide
            </button>
            <button className="flex-1 bg-danger-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-danger-700 transition-colors">
              Contact Driver
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors">
              Download Itinerary
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ConfirmedPools;

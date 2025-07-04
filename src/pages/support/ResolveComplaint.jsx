import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

const ResolveComplaint = () => {
  const [ticket] = useState({
    id: 'TCK-20250621-0012',
    title: 'Driver did not arrive at pickup location',
    status: 'pending',
    createdAt: '2025-06-21 09:14',
    assignedTo: 'Agent Samantha',
    description: 'Tourist reported that the assigned driver did not arrive at the scheduled pickup location in Colombo. The tourist waited for 30 minutes and had to book another ride.',
    tourist: {
      name: 'Ayesha Fernando',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      role: 'Tourist',
      email: 'ayesha.fernando@email.com',
      phone: '+94 77 123 4567',
      history: [
        { label: 'Total Bookings', value: 18 },
        { label: 'Complaints Filed', value: 2 },
        { label: 'Last Trip', value: '2025-06-19' },
      ],
    },
    driver: {
      name: 'Nuwan Perera',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      role: 'Driver',
      email: 'nuwan.perera@email.com',
      phone: '+94 76 987 6543',
      history: [
        { label: 'Total Rides', value: 142 },
        { label: 'Complaints Received', value: 1 },
        { label: 'Last Trip', value: '2025-06-21' },
      ],
    },
  });

  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState(ticket.status);

  const handleContact = (type, person) => {
    if (type === 'email') {
      window.location.href = `mailto:${person.email}`;
    } else if (type === 'phone') {
      window.location.href = `tel:${person.phone}`;
    }
  };

  const handleResolve = () => {
    alert('Complaint marked as resolved!');
    setStatus('resolved');
  };

  const handleEscalate = () => {
    alert('Complaint escalated to management!');
    setStatus('escalated');
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300';
      case 'resolved':
        return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300';
      case 'escalated':
        return 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Resolve Complaint
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and resolve customer complaints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Card */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {ticket.title}
                </h2>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClasses(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Ticket ID: {ticket.id}</p>
              <p>Created: {ticket.createdAt}</p>
              <p>Assigned to: {ticket.assignedTo}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">{ticket.description}</p>
            </div>
          </div>

          {/* Resolution Notes */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resolution Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your resolution notes here..."
              rows={6}
              className="w-full rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
            />
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleEscalate}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-danger-600 hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 transition-colors duration-200"
              >
                <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                Escalate
              </button>
              <button
                onClick={handleResolve}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition-colors duration-200"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - User Profiles */}
        <div className="space-y-6">
          {/* Tourist Profile */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex flex-col items-center text-center mb-4">
              <img
                src={ticket.tourist.avatar}
                alt={ticket.tourist.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600 mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticket.tourist.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {ticket.tourist.role}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              {ticket.tourist.history.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleContact('phone', ticket.tourist)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <PhoneIcon className="h-4 w-4 mr-1" />
                Call
              </button>
              <button
                onClick={() => handleContact('email', ticket.tourist)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-info-600 hover:bg-info-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info-500 transition-colors duration-200"
              >
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email
              </button>
            </div>
          </div>

          {/* Driver Profile */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex flex-col items-center text-center mb-4">
              <img
                src={ticket.driver.avatar}
                alt={ticket.driver.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600 mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticket.driver.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {ticket.driver.role}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              {ticket.driver.history.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleContact('phone', ticket.driver)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <PhoneIcon className="h-4 w-4 mr-1" />
                Call
              </button>
              <button
                onClick={() => handleContact('email', ticket.driver)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-info-600 hover:bg-info-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info-500 transition-colors duration-200"
              >
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolveComplaint;

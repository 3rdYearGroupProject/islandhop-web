import React, { useState } from 'react';
import { 
  ArchiveBoxXMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const LostItemTracker = () => {
  const [reports, setReports] = useState([
    {
      id: 'LI-20250621-001',
      date: '2025-06-21',
      item: 'Black Backpack',
      desc: 'Left in the back seat of the vehicle after trip from Colombo to Kandy.',
      tourist: {
        name: 'Ayesha Fernando',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        email: 'ayesha.fernando@email.com',
        phone: '+94 77 123 4567',
      },
      driver: {
        name: 'Nuwan Perera',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        email: 'nuwan.perera@email.com',
        phone: '+94 76 987 6543',
      },
      status: 'Ongoing',
      update: '',
    },
    {
      id: 'LI-20250620-002',
      date: '2025-06-20',
      item: 'iPhone 13',
      desc: 'Tourist lost phone during city tour. Suspected left in the van.',
      tourist: {
        name: 'Ruwan Silva',
        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
        email: 'ruwan.silva@email.com',
        phone: '+94 76 987 6543',
      },
      driver: {
        name: 'Saman Jayasuriya',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        email: 'saman.j@email.com',
        phone: '+94 77 555 1234',
      },
      status: 'Unresolved',
      update: '',
    },
    {
      id: 'LI-20250619-003',
      date: '2025-06-19',
      item: 'Blue Suitcase',
      desc: 'Forgotten in hotel lobby, guide last seen with item.',
      tourist: {
        name: 'Ishara Perera',
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
        email: 'ishara.p@email.com',
        phone: '+94 71 222 3344',
      },
      driver: null,
      guide: {
        name: 'Dilani Fernando',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        email: 'dilani.f@email.com',
        phone: '+94 77 888 9999',
      },
      status: 'Resolved',
      update: 'Suitcase returned to tourist on 2025-06-20.',
    },
  ]);

  const statusOptions = ['Ongoing', 'Resolved', 'Unresolved'];

  const handleStatusChange = (idx, newStatus) => {
    setReports(reports.map((report, index) => 
      index === idx ? { ...report, status: newStatus } : report
    ));
  };

  const handleContact = (type, person) => {
    if (type === 'email') {
      window.location.href = `mailto:${person.email}`;
    } else if (type === 'phone') {
      window.location.href = `tel:${person.phone}`;
    }
  };

  const handleUpdate = (idx, value) => {
    setReports(reports.map((report, index) => 
      index === idx ? { ...report, update: value } : report
    ));
  };

  const handleSaveUpdate = (idx) => {
    alert('Update saved successfully!');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ongoing':
        return <ClockIcon className="h-4 w-4" />;
      case 'Resolved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'Unresolved':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300';
      case 'Resolved':
        return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300';
      case 'Unresolved':
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
          Lost Item Tracker
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage lost item reports from tourists
        </p>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {reports.map((report, idx) => (
          <div key={report.id} className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0 lg:space-x-6">
              
              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <ArchiveBoxXMarkIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.id}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(report.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3 text-sm text-gray-500 dark:text-gray-400 space-x-4">
                  <span>Date: {report.date}</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    Item: {report.item}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {report.desc}
                </p>

                {/* Status Dropdown */}
                <div className="flex items-center space-x-3">
                  <label htmlFor={`status-${idx}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status:
                  </label>
                  <select
                    id={`status-${idx}`}
                    value={report.status}
                    onChange={(e) => handleStatusChange(idx, e.target.value)}
                    className={`rounded-lg border border-gray-300 dark:border-secondary-600 px-3 py-1 text-sm focus:border-primary-500 focus:ring-primary-500 ${getStatusClasses(report.status)}`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contacts */}
              <div className="lg:w-80 space-y-4">
                {/* Tourist */}
                <div className="bg-gray-50 dark:bg-secondary-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={report.tourist.avatar}
                      alt={report.tourist.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-secondary-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {report.tourist.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tourist</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                    <p>{report.tourist.email}</p>
                    <p>{report.tourist.phone}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleContact('phone', report.tourist)}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
                    >
                      <PhoneIcon className="h-3 w-3 mr-1" />
                      Call
                    </button>
                    <button
                      onClick={() => handleContact('email', report.tourist)}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded bg-info-600 text-white hover:bg-info-700 transition-colors duration-200"
                    >
                      <EnvelopeIcon className="h-3 w-3 mr-1" />
                      Email
                    </button>
                  </div>
                </div>

                {/* Driver or Guide */}
                {(report.driver || report.guide) && (
                  <div className="bg-gray-50 dark:bg-secondary-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={(report.driver || report.guide).avatar}
                        alt={(report.driver || report.guide).name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-secondary-600"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {(report.driver || report.guide).name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {report.driver ? 'Driver' : 'Guide'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                      <p>{(report.driver || report.guide).email}</p>
                      <p>{(report.driver || report.guide).phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleContact('phone', report.driver || report.guide)}
                        className="flex-1 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
                      >
                        <PhoneIcon className="h-3 w-3 mr-1" />
                        Call
                      </button>
                      <button
                        onClick={() => handleContact('email', report.driver || report.guide)}
                        className="flex-1 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded bg-info-600 text-white hover:bg-info-700 transition-colors duration-200"
                      >
                        <EnvelopeIcon className="h-3 w-3 mr-1" />
                        Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Update Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-secondary-700">
              <label htmlFor={`update-${idx}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Update
              </label>
              <div className="flex space-x-3">
                <textarea
                  id={`update-${idx}`}
                  value={report.update}
                  onChange={(e) => handleUpdate(idx, e.target.value)}
                  placeholder="Add update about the lost item status..."
                  rows={2}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
                />
                <button
                  onClick={() => handleSaveUpdate(idx)}
                  disabled={!report.update.trim()}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Save Update
                </button>
              </div>
              {report.status === 'Resolved' && report.update && (
                <div className="mt-3 p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
                  <p className="text-sm text-success-800 dark:text-success-300">
                    <strong>Resolution:</strong> {report.update}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostItemTracker;

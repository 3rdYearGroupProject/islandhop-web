import React, { useState } from 'react';
import { 
  TicketIcon, 
  ExclamationTriangleIcon, 
  ShieldExclamationIcon,
  ArchiveBoxXMarkIcon 
} from '@heroicons/react/24/outline';

const ViewTickets = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-20250621-0012',
      type: 'Complaint',
      subject: 'Driver did not arrive at pickup location',
      createdAt: '2025-06-21 09:14',
      user: {
        name: 'Ayesha Fernando',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
      assignedTo: '',
      status: 'New',
    },
    {
      id: 'TCK-20250621-0013',
      type: 'Lost Item',
      subject: 'Lost iPhone in vehicle',
      createdAt: '2025-06-21 10:22',
      user: {
        name: 'Ruwan Silva',
        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
      },
      assignedTo: 'Agent Samantha',
      status: 'In Progress',
    },
    {
      id: 'TCK-20250621-0014',
      type: 'Safety Alert',
      subject: 'Panic button pressed during ride',
      createdAt: '2025-06-21 11:05',
      user: {
        name: 'Ishara Perera',
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      },
      assignedTo: '',
      status: 'New',
    },
    {
      id: 'TCK-20250620-0015',
      type: 'Complaint',
      subject: 'Driver was rude',
      createdAt: '2025-06-20 16:44',
      user: {
        name: 'Dilani Fernando',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      },
      assignedTo: 'Agent Samantha',
      status: 'Resolved',
    },
    {
      id: 'TCK-20250620-0016',
      type: 'Lost Item',
      subject: 'Forgot suitcase at hotel',
      createdAt: '2025-06-20 18:10',
      user: {
        name: 'Nuwan Perera',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
      assignedTo: '',
      status: 'New',
    },
  ]);

  const [filter, setFilter] = useState('All');
  const issueTypes = ['All', 'Complaint', 'Lost Item', 'Safety Alert'];
  const agentName = 'Agent Samantha';

  const filteredTickets = filter === 'All' 
    ? tickets 
    : tickets.filter((t) => t.type === filter);

  const handleClaim = (id) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id 
        ? { ...ticket, assignedTo: agentName, status: 'In Progress' }
        : ticket
    ));
  };

  const handleMarkInProgress = (id) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id 
        ? { ...ticket, status: 'In Progress' }
        : ticket
    ));
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'New':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300';
      case 'In Progress':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300';
      case 'Resolved':
        return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Complaint':
        return ExclamationTriangleIcon;
      case 'Lost Item':
        return ArchiveBoxXMarkIcon;
      case 'Safety Alert':
        return ShieldExclamationIcon;
      default:
        return TicketIcon;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage all customer support tickets
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <label htmlFor="filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by type:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
            >
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredTickets.length} tickets
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-8 text-center">
            <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No tickets found for the selected filter.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const TypeIcon = getTypeIcon(ticket.type);
            return (
              <div
                key={ticket.id}
                className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200"
              >
                <div className="flex items-start justify-between space-x-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={ticket.user.avatar}
                      alt={ticket.user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {ticket.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {ticket.id}
                      </p>
                    </div>
                  </div>

                  {/* Ticket Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <TypeIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                        {ticket.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Created: {ticket.createdAt}
                    </p>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end space-y-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(ticket.status)}`}>
                      {ticket.status}
                    </span>

                    {ticket.assignedTo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned to: <span className="font-medium">{ticket.assignedTo}</span>
                      </p>
                    )}

                    <div className="flex space-x-2">
                      {!ticket.assignedTo && ticket.status === 'New' && (
                        <button
                          onClick={() => handleClaim(ticket.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                          Claim
                        </button>
                      )}
                      
                      {ticket.assignedTo === agentName && ticket.status === 'New' && (
                        <button
                          onClick={() => handleMarkInProgress(ticket.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-warning-600 hover:bg-warning-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning-500 transition-colors duration-200"
                        >
                          Start Work
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ViewTickets;

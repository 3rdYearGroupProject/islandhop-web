import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldExclamationIcon,
  TruckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const ResolveComplaint = () => {
  // State for complaints data
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Sample ticket state (keeping for now)
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

  // Toggle expand/collapse for individual cards
  const toggleExpanded = (complaintId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(complaintId)) {
      newExpanded.delete(complaintId);
    } else {
      newExpanded.add(complaintId);
    }
    setExpandedCards(newExpanded);
  };

  const isExpanded = (complaintId) => expandedCards.has(complaintId);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace this URL with your actual backend endpoint
        const response = await fetch('http://localhost:8061/tickets/complaints', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setComplaints(result.data || []); // Access data from the "data" attribute
        
        console.log('Complaints fetched successfully:', result);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError(err.message);
        
        // Fallback to sample data in case of error
        const mockData = {
          data: [
            {
              id: 'TCK-20250621-0012',
              title: 'Driver did not arrive at pickup location',
              status: 'pending',
              createdAt: '2025-06-21T09:14:00Z',
              assignedTo: 'Agent Samantha',
              description: 'Tourist reported that the assigned driver did not arrive at the scheduled pickup location in Colombo.',
              tourist: {
                name: 'Ayesha Fernando',
                email: 'ayesha.fernando@email.com',
                phone: '+94 77 123 4567'
              },
              driver: {
                name: 'Nuwan Perera',
                email: 'nuwan.perera@email.com',
                phone: '+94 76 987 6543'
              }
            },
            {
              id: 'TCK-20250621-0013',
              title: 'Guide was unprofessional during tour',
              status: 'pending',
              createdAt: '2025-06-21T14:30:00Z',
              assignedTo: 'Agent John',
              description: 'Tourist complained about guide being rude and not providing proper information during the city tour.',
              tourist: {
                name: 'Michael Johnson',
                email: 'michael.johnson@email.com',
                phone: '+1 555 123 4567'
              },
              guide: {
                name: 'Ravi Silva',
                email: 'ravi.silva@email.com',
                phone: '+94 71 456 7890'
              }
            }
          ]
        };
        setComplaints(mockData.data);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []); // Empty dependency array means this runs once on component mount

  const handleContact = (type, person) => {
    if (type === 'email') {
      window.location.href = `mailto:${person.email}`;
    } else if (type === 'phone') {
      window.location.href = `tel:${person.phone}`;
    }
  };

  const handleResolve = async (complaintId) => {
    try {
      console.log(`Marking complaint ${complaintId} as resolved...`);
      
      const response = await fetch(`http://localhost:8061/tickets/mark-resolved/${complaintId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('Response from marking resolved:', result);

      if (response.ok && result.success) {
        alert('Complaint marked as resolved!');
        
        // Update the local state to reflect the change
        setComplaints(prevComplaints => 
          prevComplaints.map(complaint => 
            complaint._id === complaintId 
              ? { ...complaint, status: 'resolved' }
              : complaint
          )
        );
        
        console.log(`Complaint ${complaintId} successfully marked as resolved`);
      } else {
        console.error('Failed to mark complaint as resolved:', result.message);
        alert(`Failed to mark complaint as resolved: ${result.message}`);
      }
    } catch (error) {
      console.error('Error marking complaint as resolved:', error);
      alert('Error occurred while marking complaint as resolved. Please try again.');
    }
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Resolve Complaint
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and resolve customer complaints
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading complaints...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading complaints
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {error}. Showing sample data instead.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading */}
      {!loading && complaints.length > 0 && (

      <div className="space-y-4">
        {/* Display all complaints */}
        {complaints.map((complaint, index) => (
          <div key={complaint._id} className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700">
            {/* Compact Header View */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {complaint.topic}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ticket ID: {complaint._id} • Created: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClasses(complaint.status)}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => toggleExpanded(complaint._id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
                  >
                    {isExpanded(complaint._id) ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Basic Info - Always Visible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{complaint.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tourist Details</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {complaint.tourist ? `${complaint.tourist.first_name} ${complaint.tourist.last_name}` : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {complaint.tourist ? complaint.tourist.email : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Always Visible */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleContact('email', complaint.tourist)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                  >
                    <EnvelopeIcon className="h-3 w-3 mr-1" />
                    Contact Tourist
                  </button>
                  <button
                    onClick={() => handleResolve(complaint._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-success-600 hover:bg-success-700 transition-colors duration-200"
                  >
                    Quick Resolve
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  #{index + 1} of {complaints.length}
                </p>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded(complaint._id) && (
              <div className="border-t border-gray-200 dark:border-secondary-600 p-4 bg-gray-50 dark:bg-secondary-900">
                <div className="lg:col-span-2 space-y-6">
                  {/* Driver and Guide Details Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Driver & Guide Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Driver Profile */}
                      {complaint.driver && (
                        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <TruckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                {`${complaint.driver.first_name} ${complaint.driver.last_name}`}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Driver</p>
                            </div>
                          </div>

                          <div className="space-y-3 mb-3 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Email:</span>
                              <p className="font-medium text-gray-900 dark:text-white break-words">
                                {complaint.driver.email}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {complaint.driver.phone}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={() => handleContact('email', complaint.driver)}
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                            >
                              <EnvelopeIcon className="h-4 w-4 mr-2" />
                              Email Driver
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Guide Profile */}
                      {complaint.guide && (
                        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                {`${complaint.guide.first_name} ${complaint.guide.last_name}`}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Tour Guide</p>
                            </div>
                          </div>

                          <div className="space-y-3 mb-3 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Email:</span>
                              <p className="font-medium text-gray-900 dark:text-white break-words">
                                {complaint.guide.email}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {complaint.guide.phone}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={() => handleContact('email', complaint.guide)}
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                            >
                              <EnvelopeIcon className="h-4 w-4 mr-2" />
                              Email Guide
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => handleResolve(complaint._id)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition-colors duration-200"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ResolveComplaint;

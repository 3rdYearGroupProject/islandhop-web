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
import { useToast } from '../../components/ToastProvider';

const ResolveComplaint = () => {
  // Toast hook
  const { success, error: showError, info, warning } = useToast();
  
  // State for complaints data
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'high-priority'
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [thirdPartyDrivers, setThirdPartyDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);

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
              _id: 'TCK-20250621-0012',
              type: 'Driver_didnt_show_up',
              priority: 'high',
              status: 'not resolved',
              createdAt: '2025-10-17T12:05:41.541Z',
              description: 'Tourist reported that the assigned driver did not arrive at the scheduled pickup location in Colombo.',
              tourist: {
                first_name: 'Ayesha',
                last_name: 'Fernando',
                email: 'ayesha.fernando@email.com',
                nationality: 'Sri Lanka'
              },
              driver: {
                first_name: 'Nuwan',
                last_name: 'Perera',
                email: 'nuwan.perera@email.com',
                phone: '+94 76 987 6543'
              },
              tripId: '06ed669b-296a-4a2e-9ab4-21f5f8260f25',
              trip_details: {
                _id: '06ed669b-296a-4a2e-9ab4-21f5f8260f25',
                originalTripId: '06ed669b-296a-4a2e-9ab4-21f5f8260f25',
                activityPacing: 'Normal',
                arrivalTime: '21:30',
                averageTripDistance: 158.834,
                baseCity: 'Colombo',
                budgetLevel: 'Medium',
                createdAt: '2025-09-08T11:07:26.680Z',
                dailyPlans: [
                  {
                    day: 1,
                    city: 'Colombo',
                    attractions: ['National Museum'],
                    start: '2025-09-08T11:14:13.231Z',
                    end: '2025-09-08T11:24:49.511Z'
                  },
                  {
                    day: 2,
                    city: 'Kandy',
                    attractions: ['Temple of Tooth'],
                    start: '2025-09-08T11:51:26.796Z',
                    end: '2025-09-08T11:52:34.763Z'
                  }
                ]
              }
            },
            {
              _id: 'TCK-20250621-0013',
              type: 'Guide_behavior_issue',
              priority: 'medium',
              status: 'pending',
              createdAt: '2025-10-17T14:30:00Z',
              description: 'Tourist complained about guide being rude and not providing proper information during the city tour.',
              tourist: {
                first_name: 'Michael',
                last_name: 'Johnson',
                email: 'michael.johnson@email.com',
                nationality: 'USA'
              },
              driver: {
                first_name: 'Kasun',
                last_name: 'Silva',
                email: 'kasun.silva@email.com',
                phone: '+94 77 123 4567'
              },
              guide: {
                first_name: 'Ravi',
                last_name: 'Silva',
                email: 'ravi.silva@email.com',
                phone: '+94 71 456 7890'
              }
            },
            {
              _id: 'TCK-20250621-0014',
              type: 'Driver_didnt_show_up',
              priority: 'high',
              status: 'not resolved',
              createdAt: '2025-10-17T16:15:30.000Z',
              description: 'Driver was a no-show for the scheduled pickup. Tourist had to find alternative transportation.',
              tourist: {
                first_name: 'Sarah',
                last_name: 'Wilson',
                email: 'sarah.wilson@email.com',
                nationality: 'UK'
              },
              driver: {
                first_name: 'Ruwan',
                last_name: 'Gunasekara',
                email: 'ruwan.gunasekara@email.com',
                phone: null
              },
              tripId: '12ab345c-567d-8e9f-0123-456789abcdef',
              trip_details: {
                _id: '12ab345c-567d-8e9f-0123-456789abcdef',
                originalTripId: '12ab345c-567d-8e9f-0123-456789abcdef',
                activityPacing: 'Fast',
                arrivalTime: '18:45',
                averageTripDistance: 245.672,
                baseCity: 'Galle',
                budgetLevel: 'High',
                createdAt: '2025-09-08T15:30:00.000Z',
                dailyPlans: [
                  {
                    day: 1,
                    city: 'Galle',
                    attractions: ['Galle Fort', 'Dutch Museum'],
                    start: '2025-09-08T15:30:00.000Z',
                    end: '2025-09-08T18:00:00.000Z'
                  },
                  {
                    day: 2,
                    city: 'Nuwara Eliya',
                    attractions: ['Tea Plantations', 'Gregory Lake'],
                    start: '2025-09-09T08:00:00.000Z',
                    end: '2025-09-09T17:30:00.000Z'
                  },
                  {
                    day: 3,
                    city: 'Ella',
                    attractions: ['Nine Arch Bridge', 'Little Adams Peak'],
                    start: '2025-09-10T09:00:00.000Z',
                    end: '2025-09-10T16:00:00.000Z'
                  }
                ]
              }
            }
          ]
        };
        setComplaints(mockData.data);
        
        // Fetch third party drivers from API
        fetchThirdPartyDrivers();
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []); // Empty dependency array means this runs once on component mount

  // Fetch third party drivers from backend
  const fetchThirdPartyDrivers = async () => {
    try {
      setDriversLoading(true);
      console.log('Fetching third party drivers...');
      
      const response = await fetch('http://localhost:8061/tickets/3rd-party-drivers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Response received for third party drivers:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setThirdPartyDrivers(result.data);
        console.log('Third party drivers fetched successfully:', result.message);
        console.log(`Loaded ${result.count} drivers`);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (err) {
      console.error('Error fetching third party drivers:', err);
      
      // Fallback to mock data if API fails
      const mockDriversData = [
        {
          _id: 'TPD-001',
          companyName: 'Pick Me Urban',
          companyEmail: 'pickme@sl.com',
          district: 'Kurunegala',
          contactNumber1: '637264783267',
          contactNumber2: '54353',
          createdAt: '2025-10-16T18:02:22.442Z'
        },
        {
          _id: 'TPD-002',
          companyName: 'Ceylon Cab Company',
          companyEmail: 'ceyloncab@email.com',
          district: 'Gampaha',
          contactNumber1: '+94 76 987 6543',
          contactNumber2: '+94 70 876 5432',
          createdAt: '2025-10-15T14:30:00.000Z'
        },
        {
          _id: 'TPD-003',
          companyName: 'Island Tours Transport',
          companyEmail: 'contact@islandtours.com',
          district: 'Kandy',
          contactNumber1: '+94 75 456 7890',
          contactNumber2: '+94 78 567 8901',
          createdAt: '2025-10-14T10:15:30.000Z'
        }
      ];
      setThirdPartyDrivers(mockDriversData);
    } finally {
      setDriversLoading(false);
    }
  };

  const handleContact = (type, person) => {
    if (type === 'email') {
      window.location.href = `mailto:${person.email}`;
    } else if (type === 'phone') {
      window.location.href = `tel:${person.phone}`;
    }
  };

  const handleAssignNewDriver = (complaintId) => {
    setSelectedComplaintId(complaintId);
    setShowAssignDriverModal(true);
    
    // Optionally refresh driver data when modal opens to get latest availability
    fetchThirdPartyDrivers();
  };

  const handleDriverSelection = (driver) => {
    // TODO: Implement driver assignment API call
    success(`Assigning driver ${driver.companyName} to complaint ${selectedComplaintId}`);
    console.log(`Assigning driver:`, driver, `to complaint:`, selectedComplaintId);
    setShowAssignDriverModal(false);
    setSelectedComplaintId(null);
  };

  const closeAssignDriverModal = () => {
    setShowAssignDriverModal(false);
    setSelectedComplaintId(null);
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
        success('Complaint marked as resolved!');
        
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
        showError(`Failed to mark complaint as resolved: ${result.message}`);
      }
    } catch (error) {
      console.error('Error marking complaint as resolved:', error);
      showError('Error occurred while marking complaint as resolved. Please try again.');
    }
  };

  const handleEscalate = () => {
    warning('Complaint escalated to management!');
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

  const getPriorityBadgeClasses = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  // Filter complaints based on active tab
  const filteredComplaints = activeTab === 'high-priority' 
    ? complaints.filter(complaint => complaint.priority === 'high')
    : complaints;

  const highPriorityCount = complaints.filter(complaint => complaint.priority === 'high').length;

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

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700">
        <div className="border-b border-gray-200 dark:border-secondary-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span>All Complaints</span>
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-medium">
                  {complaints.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('high-priority')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'high-priority'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldExclamationIcon className="h-5 w-5" />
                <span>High Priority</span>
                {highPriorityCount > 0 && (
                  <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-0.5 px-2 rounded-full text-xs font-medium">
                    {highPriorityCount}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>
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
      {!loading && filteredComplaints.length > 0 && (

      <div className="space-y-4">
        {/* Display filtered complaints */}
        {filteredComplaints.map((complaint, index) => (
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
                      {complaint.type ? complaint.type.replace('_', ' ') : complaint.description}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ticket ID: {complaint._id} • Created: {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {complaint.priority && (
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClasses(complaint.priority)}`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
                    </span>
                  )}
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
                  #{index + 1} of {filteredComplaints.length}
                </p>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded(complaint._id) && (
              <div className="border-t border-gray-200 dark:border-secondary-600 p-4 bg-gray-50 dark:bg-secondary-900">
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Conditional Content Based on Priority and Tab */}
                  {activeTab === 'high-priority' ? (
                    /* High Priority Tab - Driver and Trip Details Only */
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Driver & Trip Details
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
                                  {complaint.driver.phone || 'Not provided'}
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

                        {/* Trip Details */}
                        {complaint.trip_details && (
                          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                  Trip Information
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Trip ID: {complaint.tripId}</p>
                              </div>
                            </div>

                            <div className="space-y-3 mb-3 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Base City:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {complaint.trip_details.baseCity || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Number of Days:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {complaint.trip_details.dailyPlans?.length || 'N/A'} days
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Daily Destinations:</span>
                                <div className="mt-2 space-y-1">
                                  {complaint.trip_details.dailyPlans?.map((plan, index) => (
                                    <p key={index} className="font-medium text-gray-900 dark:text-white text-xs">
                                      Day {plan.day}: {plan.city}
                                    </p>
                                  )) || <p className="font-medium text-gray-900 dark:text-white">N/A</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* All Complaints Tab - Driver and Guide Details */
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
                                  {complaint.driver.phone || 'Not provided'}
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
                                  {complaint.guide.phone || 'Not provided'}
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
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-6">
                    <div className="flex space-x-4">
                      {/* Show Assign New Driver button only for high priority complaints */}
                      {activeTab === 'high-priority' && (
                        <button
                          onClick={() => handleAssignNewDriver(complaint._id)}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <TruckIcon className="h-4 w-4 mr-2" />
                          Assign New Driver
                        </button>
                      )}
                      
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

      {/* Assign Driver Modal */}
      {showAssignDriverModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-secondary-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assign New Driver
              </h3>
              <button
                onClick={closeAssignDriverModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-96 overflow-y-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select an available third party driver to assign to complaint #{selectedComplaintId}
              </p>
              
              {driversLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading drivers...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {thirdPartyDrivers
                    .map((driver) => (
                      <div 
                        key={driver._id}
                        className="border border-gray-200 dark:border-secondary-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-secondary-700 cursor-pointer transition-colors"
                        onClick={() => handleDriverSelection(driver)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <TruckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                  {driver.firstName || driver.name} {driver.lastName || ''}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {driver.companyName || driver.company} • {driver.district}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Contact 1:</span>
                                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                  {driver.contactNumber1 || 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Contact 2:</span>
                                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                  {driver.contactNumber2 || 'N/A'}
                                </span>
                              </div>
                              <div className="md:col-span-2">
                                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                <span className="ml-2 font-medium text-gray-900 dark:text-white text-xs">
                                  {driver.companyEmail || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              
              {!driversLoading && thirdPartyDrivers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No drivers available at the moment.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={closeAssignDriverModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolveComplaint;

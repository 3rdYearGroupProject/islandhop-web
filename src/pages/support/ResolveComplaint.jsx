import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldExclamationIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const ResolveComplaint = () => {
  // State for complaints data
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      <div className="space-y-5">
        {/* Display all complaints */}
        {complaints.map((complaint, index) => (
          <div key={complaint._id} className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 bg-gray-50 dark:bg-secondary-900 rounded-xl">
            {/* Main Ticket Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Ticket Card */}
              <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {complaint.topic}
                    </h2>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClasses(complaint.status)}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' ')}
                  </span>
                </div>
                
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>Ticket ID: {complaint._id}</p>
                  <p>Created: {new Date().toLocaleDateString()}</p>
                  <p>Complaint #{index + 1} of {complaints.length}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{complaint.description}</p>
                </div>
              {/* </div> */}

              {/* Resolution Notes */}
              {/* <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-3"> */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resolution Notes
                </h3>
                <textarea
                  value={complaint.resolution_notes || notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your resolution notes here..."
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
                />
                
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={handleEscalate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 transition-colors duration-200"
                  >
                    <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                    Escalate
                  </button>
                  <button
                    onClick={() => handleResolve(complaint._id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition-colors duration-200"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar - User Profiles */}
            <div className="space-y-6">
              {/* Tourist Profile */}
              <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-4 h-full">
                <div className="flex flex-col items-center text-center mb-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-secondary-600 mb-2">
                    <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {complaint.tourist ? `${complaint.tourist.first_name} ${complaint.tourist.last_name}` : 'N/A'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tourist
                  </p>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right break-words max-w-32">
                      {complaint.tourist ? complaint.tourist.email : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {complaint.tourist ? complaint.tourist.contact_no : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Trips:</span>
                    <span className="font-medium text-gray-900 dark:text-white">5</span>
                  </div>
                </div>

                <div className="mb-4">
                  <button
                    onClick={() => handleContact('email', complaint.tourist)}
                    className="w-full inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <EnvelopeIcon className="h-3 w-3 mr-1" />
                    Contact Tourist
                  </button>
                </div>

                {/* Driver Profile - Integrated into same card */}
                <div className="border-t border-gray-200 dark:border-secondary-600 pt-4">
                  <div className="flex flex-col items-center text-center mb-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-secondary-600 mb-2">
                      <TruckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {complaint.driver ? `${complaint.driver.first_name} ${complaint.driver.last_name}` : 'N/A'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Driver
                    </p>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-white text-right break-words max-w-32">
                        {complaint.driver ? complaint.driver.email : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {complaint.driver ? complaint.driver.contact_no : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                      <span className="font-medium text-gray-900 dark:text-white">4.8 ⭐</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleContact('email', complaint.driver)}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info-500 transition-colors duration-200"
                    >
                      <EnvelopeIcon className="h-3 w-3 mr-1" />
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ResolveComplaint;

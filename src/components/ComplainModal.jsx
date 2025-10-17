import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastProvider';

const ComplainModal = ({ onClose }) => {
  const [complaint, setComplaint] = useState('');
  const [selectedTrip, setSelectedTrip] = useState('');
  const [completedTrips, setCompletedTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  // Fetch completed trips when component mounts
  useEffect(() => {
    const fetchCompletedTrips = async () => {
      if (!user?.uid) {
        console.log('❌ User not available yet:', user);
        return;
      }
      
      setIsLoadingTrips(true);
      try {
        console.log('🔄 Fetching completed trips for user:', user.uid);
        const response = await fetch(`http://localhost:8062/tourist/trips/${user.uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 Complete backend response:', data);
        
        if (data && data.success && data.trips && data.trips.length > 0) {
          console.log('✅ Trips fetched successfully:', data.trips.length, 'trips');
          console.log('📋 Trips data:', data.trips);
          setCompletedTrips(data.trips);
        } else {
          console.log('⚠️ No trips found in response');
        }
      } catch (error) {
        console.error('❌ Error fetching completed trips:', error);
        // You could show a toast notification here
      } finally {
        setIsLoadingTrips(false);
      }
    };

    fetchCompletedTrips();
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md border border-yellow-100 relative animate-fade-in-up">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-extrabold text-yellow-700 mb-6 flex items-center gap-3">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.994-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.994L18.222 4H6.364c-1.054 0-1.918.816-1.994 1.85L4.364 6v12c0 1.054.816 1.918 1.85 1.994l.15.006z" />
          </svg>
          Complain
        </h2>
        <div className="space-y-4">
          <textarea
            className="w-full border border-yellow-100 bg-yellow-50 focus:bg-white focus:border-yellow-400 rounded-xl p-4 min-h-[96px] text-base mb-1 transition placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
            rows={4}
            placeholder="Describe your complaint..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          ></textarea>
          <div>
            <label className="block text-gray-600 font-medium mb-1" htmlFor="trip-select">
              Select Trip <span className="text-gray-400 font-normal">(related to complaint)</span>
            </label>
            {isLoadingTrips ? (
              <div className="w-full border border-yellow-100 bg-yellow-50 rounded-xl p-3 text-base flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading trips...
              </div>
            ) : completedTrips.length > 0 ? (
              <select
                id="trip-select"
                className="w-full border border-yellow-100 bg-yellow-50 focus:bg-white focus:border-yellow-400 rounded-xl p-3 text-base transition focus:outline-none focus:ring-2 focus:ring-yellow-100"
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
              >
                <option value="">Select a trip...</option>
                {completedTrips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.tripName} - {trip.destination} ({new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-base text-gray-500 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No completed trips found
              </div>
            )}
          </div>
        </div>
        <button
          className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-full font-semibold text-lg shadow transition focus:outline-none focus:ring-2 focus:ring-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!complaint.trim()}
          onClick={async () => {
            try {
              const selectedTripData = completedTrips.find(trip => trip._id === selectedTrip);
              const complaintData = {
                description: complaint,
                tripId: selectedTripData?.originalTripId || null,
                userId: user?.uid,
                email: user?.email,
                // tripDetails: selectedTripData ? {
                //   tripName: selectedTripData.tripName,
                //   destination: selectedTripData.destination,
                //   startDate: selectedTripData.startDate,
                //   endDate: selectedTripData.endDate
                // } : null
              };
              
              console.log('Complaint data:', complaintData);

              // Replace with your actual complaint submission endpoint
              const res = await fetch('http://localhost:8061/tickets/add-complaint', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(complaintData)
              });

              if (res.ok) {
                const responseData = await res.json();
                onClose(); // Close modal first
                
                // Show success toast
                success(
                  `Complaint submitted successfully!`,
                  {
                    duration: 5000,
                    showProgress: true
                  }
                );
              } else {
                // Show error toast
                error('Failed to submit complaint. Please try again.', {
                  duration: 4000,
                  showProgress: true
                });
              }
            } catch (err) {
              console.error('Error submitting complaint:', err);
              error('Network error. Please check your connection and try again.', {
                duration: 4000,
                showProgress: true
              });
            }
          }}
        >
          Submit Complaint
        </button>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.3s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ComplainModal;

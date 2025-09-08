import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastProvider';


const ReportLostItemModal = ({ onClose }) => {
  const [lostItem, setLostItem] = useState('');
  const [lostDate, setLostDate] = useState('');
  const [selectedTrip, setSelectedTrip] = useState('');
  const [completedTrips, setCompletedTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();
  console.log("user from ReportLostItemModal", user);

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
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md border border-blue-100 relative animate-fade-in-up">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6 flex items-center gap-3">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-4 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4 4v6m-4 0h8" />
          </svg>
          Report Lost Item
        </h2>
        <div className="space-y-4">
          <textarea
            className="w-full border border-blue-100 bg-blue-50 focus:bg-white focus:border-blue-400 rounded-xl p-4 min-h-[96px] text-base mb-1 transition placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={4}
            placeholder="Describe the lost item..."
            value={lostItem}
            onChange={(e) => setLostItem(e.target.value)}
          ></textarea>
          <div>
            <label className="block text-gray-600 font-medium mb-1" htmlFor="lost-date">Date lost <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              id="lost-date"
              type="date"
              className="w-full border border-blue-100 bg-blue-50 focus:bg-white focus:border-blue-400 rounded-xl p-3 text-base transition focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={lostDate}
              onChange={e => setLostDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1" htmlFor="trip-select">
              Select Trip <span className="text-gray-400 font-normal">(where item was lost)</span>
            </label>
            {isLoadingTrips ? (
              <div className="w-full border border-blue-100 bg-blue-50 rounded-xl p-3 text-base flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading trips...
              </div>
            ) : completedTrips.length > 0 ? (
              <select
                id="trip-select"
                className="w-full border border-blue-100 bg-blue-50 focus:bg-white focus:border-blue-400 rounded-xl p-3 text-base transition focus:outline-none focus:ring-2 focus:ring-blue-100"
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
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold text-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!lostItem.trim()}
          onClick={async () => {
            try {
              const selectedTripData = completedTrips.find(trip => trip._id === selectedTrip);
              const reportData = {
                description: lostItem,
                dateLost: lostDate,
                tripId: selectedTripData.tripId,
                userId: user?.uid,
                email: user?.email
              };
              
              console.log('Lost item report data:', reportData);

              const res = await fetch('http://localhost:8062/tourist/addLostItem', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
              });

              if (res.ok) {
                const responseData = await res.json();
                onClose(); // Close modal first
                
                // Show success toast
                success(
                  `Lost item reported successfully!${selectedTripData ? ` Trip: ${selectedTripData.tripName} - ${selectedTripData.destination}` : ''}`,
                  {
                    duration: 5000,
                    showProgress: true
                  }
                );
              } else {
                // Show error toast
                error('Failed to report lost item. Please try again.', {
                  duration: 4000,
                  showProgress: true
                });
              }
            } catch (err) {
              console.error('Error reporting lost item:', err);
              error('Network error. Please check your connection and try again.', {
                duration: 4000,
                showProgress: true
              });
            }
          }}
        >
          Report Item
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

export default ReportLostItemModal;

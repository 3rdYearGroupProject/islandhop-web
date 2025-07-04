import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CreateTripModal from '../components/CreateTripModal';
import myTripsVideo from '../assets/mytrips.mp4';

const placeholder = 'https://placehold.co/400x250';

const MyTripsPage = () => {
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [trips, setTrips] = useState([
    {
      id: 1,
      name: 'new trip',
      dates: 'Jun 11 → Jun 21, 2025',
      destination: 'Sri Lanka',
      image: placeholder,
      isCompleted: true
    }
  ]);

  // Handle new trip data from the complete trip flow
  useEffect(() => {
    if (location.state?.newTrip) {
      const newTrip = location.state.newTrip;
      const formattedTrip = {
        id: Date.now(), // Simple ID generation
        name: newTrip.name,
        dates: newTrip.dates.length === 2 
          ? `${newTrip.dates[0].toLocaleDateString()} → ${newTrip.dates[1].toLocaleDateString()}`
          : newTrip.dates.length === 1 
          ? newTrip.dates[0].toLocaleDateString()
          : 'Dates not set',
        destination: 'Sri Lanka', // Default destination
        image: placeholder,
        isCompleted: false,
        terrains: newTrip.terrains || [],
        activities: newTrip.activities || [],
        createdAt: newTrip.createdAt
      };
      
      setTrips(prev => [formattedTrip, ...prev]);
      
      // Clear the location state to prevent re-adding on refresh
      navigate('/trips', { replace: true });
    }
  }, [location.state, navigate]);

  const handleCreateTrip = (tripData) => {
    // Navigate to trip duration page with trip name
    navigate('/trip-duration', { state: { tripName: tripData.name } });
    setIsCreateTripModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Video Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src={myTripsVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Your Travel Journey<br />
            Starts Here
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            Manage, plan, and discover amazing experiences with IslandHop
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full py-8">
        <div className="page-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My trips</h1>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setIsCreateTripModalOpen(true)}
                className="flex items-center justify-center px-6 py-16 border-2 border-dashed border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600 bg-white rounded-xl w-64 flex-col transition-all duration-200 hover:shadow-md group"
              >
                <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-primary-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-medium">Create a new trip</span>
              </button>
              
              <button className="flex items-center justify-center px-6 py-16 border-2 border-dashed border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600 bg-white rounded-xl w-64 flex-col transition-all duration-200 hover:shadow-md group">
                <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-primary-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="font-medium">Build a trip with AI</span>
              </button>
            </div>
          </div>

          {/* Current Trip Section */}
          {trips.filter(trip => !trip.isCompleted).length > 0 && (
            <section className="mb-12">
              {trips.filter(trip => !trip.isCompleted).map((trip) => (
                <div key={trip.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden relative hover:shadow-lg transition-all duration-200">
                  <div className="flex">
                    <img 
                      src={trip.image} 
                      alt={trip.destination}
                      className="w-80 h-60 object-cover"
                    />
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{trip.name}</h3>
                          <div className="flex items-center text-gray-600 mb-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{trip.destination}</span>
                          </div>
                          <div className="text-gray-600 mb-6">
                            <p>Have dates yet? <button className="text-primary-600 underline hover:text-primary-700 font-medium transition-colors">Add dates</button></p>
                          </div>
                          
                          {/* Trip Progress Indicators */}
                          {(trip.terrains || trip.activities) && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {trip.terrains?.length > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {trip.terrains.length} terrain{trip.terrains.length !== 1 ? 's' : ''} selected
                                </span>
                              )}
                              {trip.activities?.length > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {trip.activities.length} activit{trip.activities.length !== 1 ? 'ies' : 'y'} selected
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Completed Trips Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed trips</h2>
            
            {trips.filter(trip => trip.isCompleted).length > 0 ? (
              <div className="space-y-4">
                {trips.filter(trip => trip.isCompleted).map((trip) => (
                  <div key={trip.id} className="flex items-center bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-primary-300">
                    <img 
                      src={trip.image} 
                      alt={trip.destination}
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 capitalize">{trip.name}</h3>
                      <p className="text-gray-600 text-sm">{trip.dates}</p>
                      <p className="text-gray-500 text-sm">{trip.destination}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No completed trips yet</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateTripModalOpen}
        onClose={() => setIsCreateTripModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />
    </div>
  );
};

export default MyTripsPage;

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CreateTripModal from '../components/CreateTripModal';
import TripCard from '../components/TripCard';
import Button from '../components/Button';

const placeholder = 'https://placehold.co/400x250';

const MyTripsPage = () => {
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
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

  const handleCreateTrip = (tripData) => {
    const newTrip = {
      id: Date.now(),
      name: tripData.name,
      destination: tripData.destination,
      dates: 'New Trip',
      image: placeholder,
      isCompleted: false
    };
    setTrips([...trips, newTrip]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full py-8">
        <div className="page-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My trips</h1>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={() => setIsCreateTripModalOpen(true)}
                variant="outline"
                className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600 bg-white"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create a new trip
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600 bg-white"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Build a trip with AI
              </Button>
            </div>
          </div>

          {/* Completed Trips Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed trips</h2>
            
            {trips.filter(trip => trip.isCompleted).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.filter(trip => trip.isCompleted).map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No completed trips yet</p>
              </div>
            )}
          </section>

          {/* Upcoming Trips Section */}
          {trips.filter(trip => !trip.isCompleted).length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.filter(trip => !trip.isCompleted).map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}
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

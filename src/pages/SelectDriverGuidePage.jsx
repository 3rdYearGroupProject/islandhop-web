import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, Mail, Car, Users, Award, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ExpandableCostSection component

function CostSection({ label, color, items }) {
  const colorMap = {
    purple: 'text-purple-900',
    orange: 'text-orange-900',
    blue: 'text-blue-900',
    cyan: 'text-cyan-900',
    green: 'text-green-900',
    gray: 'text-gray-900',
  };
  const borderColorMap = {
    purple: 'border-purple-200',
    orange: 'border-orange-200',
    blue: 'border-blue-200',
    cyan: 'border-cyan-200',
    green: 'border-green-200',
    gray: 'border-gray-200',
  };
  const total = items.reduce((sum, item) => {
    const price = parseInt((item.price || '').replace(/[^0-9]/g, ''));
    return !isNaN(price) ? sum + price : sum;
  }, 0);
  return (
    <div className={`border-b ${borderColorMap[color] || 'border-gray-100'} pb-1 mb-1`}> 
      <div className="flex justify-between items-center select-none">
        <span className={`font-medium ${colorMap[color]}`}>{label}</span>
        <span className={`${colorMap[color]}`}>{total > 0 ? `$${total}` : '--'}</span>
      </div>
      {items.length > 0 && (
        <div className="pl-2 mt-1 space-y-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs text-gray-700">
              <span>{item.day ? `Day ${item.day}: ` : ''}{item.name}{item.location ? ` (${item.location})` : ''}</span>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced mock data for drivers and guides with more details
const mockDrivers = [
  { 
    id: 1, 
    name: 'Samantha Perera', 
    rating: 4.8, 
    reviews: 147,
    vehicle: 'Toyota Prius (Hybrid)', 
    image: 'https://placehold.co/120x120?text=Driver+1',
    experience: '8 years',
    languages: ['English', 'Sinhala', 'Tamil'],
    phone: '+94 77 123 4567',
    email: 'samantha@islandhop.com',
    license: 'Class B - Valid until 2026',
    specialties: ['Airport Transfers', 'City Tours', 'Long Distance'],
    description: 'Professional driver with extensive knowledge of Sri Lankan roads and tourist destinations.',
    price: '$45/day',
    availability: 'Available',
    features: ['Air Conditioning', 'WiFi', 'Phone Charger', 'Bottled Water']
  },
  { 
    id: 2, 
    name: 'Rukmal Fernando', 
    rating: 4.9, 
    reviews: 203,
    vehicle: 'Honda Fit (Compact)', 
    image: 'https://placehold.co/120x120?text=Driver+2',
    experience: '12 years',
    languages: ['English', 'Sinhala'],
    phone: '+94 71 987 6543',
    email: 'rukmal@islandhop.com',
    license: 'Class B - Valid until 2025',
    specialties: ['Mountain Roads', 'Cultural Sites', 'Wildlife Parks'],
    description: 'Experienced driver specializing in hill country and wildlife safari transportation.',
    price: '$40/day',
    availability: 'Available',
    features: ['Air Conditioning', 'GPS Navigation', 'First Aid Kit', 'Umbrella']
  },
  { 
    id: 3, 
    name: 'Dinesh Silva', 
    rating: 4.6, 
    reviews: 89,
    vehicle: 'Suzuki WagonR (Economy)', 
    image: 'https://placehold.co/120x120?text=Driver+3',
    experience: '5 years',
    languages: ['English', 'Sinhala'],
    phone: '+94 76 555 7890',
    email: 'dinesh@islandhop.com',
    license: 'Class B - Valid until 2027',
    specialties: ['Budget Travel', 'Local Routes', 'Beach Areas'],
    description: 'Friendly and reliable driver perfect for budget-conscious travelers.',
    price: '$35/day',
    availability: 'Available',
    features: ['Air Conditioning', 'Local Music', 'Snacks', 'Maps']
  }
];

const mockGuides = [
  { 
    id: 1, 
    name: 'Nimal Rajapakse', 
    rating: 4.9, 
    reviews: 156,
    languages: ['English', 'German', 'Sinhala'], 
    image: 'https://placehold.co/120x120?text=Guide+1',
    experience: '15 years',
    phone: '+94 77 234 5678',
    email: 'nimal@islandhop.com',
    certifications: ['Licensed Tour Guide', 'Wildlife Expert', 'Cultural Heritage Specialist'],
    specialties: ['Historical Sites', 'Wildlife Tours', 'Cultural Experiences'],
    description: 'Expert guide with deep knowledge of Sri Lankan history, culture, and wildlife.',
    price: '$60/day',
    availability: 'Available',
    education: 'Bachelor in Tourism Management',
    areas: ['Kandy', 'Sigiriya', 'Dambulla', 'Polonnaruwa']
  },
  { 
    id: 2, 
    name: 'Priya Wickramasinghe', 
    rating: 4.7, 
    reviews: 134,
    languages: ['English', 'French', 'Sinhala'], 
    image: 'https://placehold.co/120x120?text=Guide+2',
    experience: '10 years',
    phone: '+94 71 345 6789',
    email: 'priya@islandhop.com',
    certifications: ['Licensed Tour Guide', 'Ayurveda Specialist', 'Tea Expert'],
    specialties: ['Tea Plantation Tours', 'Wellness Tourism', 'Hill Country'],
    description: 'Specialized guide for hill country experiences, tea plantations, and wellness tourism.',
    price: '$55/day',
    availability: 'Available',
    education: 'Diploma in Hospitality',
    areas: ['Nuwara Eliya', 'Ella', 'Kandy', 'Badulla']
  },
  { 
    id: 3, 
    name: 'Chaminda Bandara', 
    rating: 4.8, 
    reviews: 198,
    languages: ['English', 'Japanese', 'Sinhala'], 
    image: 'https://placehold.co/120x120?text=Guide+3',
    experience: '12 years',
    phone: '+94 76 456 7890',
    email: 'chaminda@islandhop.com',
    certifications: ['Licensed Tour Guide', 'Marine Life Expert', 'Adventure Tourism'],
    specialties: ['Beach Tours', 'Whale Watching', 'Water Sports'],
    description: 'Marine specialist guide perfect for coastal and beach experiences.',
    price: '$58/day',
    availability: 'Available',
    education: 'Marine Biology Certificate',
    areas: ['Mirissa', 'Galle', 'Unawatuna', 'Bentota']
  }
];


const SelectDriverGuidePage = () => {
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get trip data from previous page
  const trip = location.state?.trip;

  // Helper to format date (copied from ViewTripPage for consistency)
  const formatTripDate = (date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleProceed = () => {
    if (!selectedDriver && !selectedGuide) {
      setShowNoSelectionModal(true);
      return;
    }
    // Proceed as normal if at least one is selected
    navigate('/trips', {
      state: {
        selectedDriver,
        selectedGuide,
        trip
      }
    });
  };

  const handleModalConfirm = () => {
    setShowNoSelectionModal(false);
    navigate('/trips', {
      state: {
        selectedDriver: null,
        selectedGuide: null,
        trip
      }
    });
  };

  const handleModalCancel = () => {
    setShowNoSelectionModal(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Floating Navbar overlays the top, so pull content down and let blue header go behind */}
      <div className="relative z-10">
        <Navbar />
      </div>
      {/* Trip Header - blue gradient background, matching ViewTripPage */}
      <div className="relative">
        <div className="absolute inset-0 w-full h-[300px] bg-gradient-to-r from-primary-600 to-primary-700 pointer-events-none" style={{ zIndex: 0 }}></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-40 pb-12" style={{ zIndex: 1 }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {trip?.status === 'completed' ? 'Completed' : 'Upcoming'}
                </span>
                <span className="text-white/80 text-sm">
                  {trip?.totalDays || 5} days • {Array.isArray(trip?.destinations) ? trip.destinations.join(', ') : trip?.destinations || trip?.destination || 'Sri Lanka'}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white drop-shadow">{trip?.name || 'Trip'}</h1>
              <p className="text-white/90 text-lg">
                {trip?.dates ? `${formatTripDate(trip.dates[0])} - ${formatTripDate(trip.dates[1])}` : 'Dates TBD'}
              </p>
            </div>
            {/* Optionally, you can add actions here if needed */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mx-auto w-full max-w-7xl">
            {/* Cost Breakdown */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                {/* Driver */}
                <CostSection
                  label="Driver"
                  color="blue"
                  items={selectedDriver && trip?.totalDays ? [{ name: selectedDriver.name, price: `$${parseInt(selectedDriver.price.replace(/[^0-9]/g, '')) * trip.totalDays}`, day: null, location: selectedDriver.vehicle }] : []}
                />
                {/* Guide */}
                <CostSection
                  label="Guide"
                  color="green"
                  items={selectedGuide && trip?.totalDays ? [{ name: selectedGuide.name, price: `$${parseInt(selectedGuide.price.replace(/[^0-9]/g, '')) * trip.totalDays}`, day: null, location: selectedGuide.languages?.join(', ') }] : []}
                />
                {/* Advance Payment */}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Advance Payment (50%)</span>
                  <span className="text-gray-700">
                    {(() => {
                      let total = 0;
                      if (selectedDriver && trip?.totalDays) {
                        total += parseInt(selectedDriver.price.replace(/[^0-9]/g, '')) * trip.totalDays;
                      }
                      if (selectedGuide && trip?.totalDays) {
                        total += parseInt(selectedGuide.price.replace(/[^0-9]/g, '')) * trip.totalDays;
                      }
                      return total > 0 ? `$${(total * 0.5).toFixed(2)}` : '--';
                    })()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => navigate('/trips')}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full transition-colors"
              >
                Back to Trips
              </button>
              <button
                onClick={handleProceed}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-colors"
              >
                {selectedDriver || selectedGuide ? 'Confirm Selection' : 'Proceed Without Driver/Guide'}
              </button>
            </div>
            {/* Modal for proceeding without driver/guide */}
            {showNoSelectionModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full border border-gray-200">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Proceed Without Driver or Guide?</h2>
                  <div className="border-b border-gray-200 mb-4"></div>
                  <p className="text-gray-700 mb-4">You have not selected a driver or a guide. You can proceed on your own, or facilitate your own driver and guide for this trip. IslandHop will not provide professional assistance for transportation or guided tours unless you select a driver or guide.</p>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={handleModalCancel}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleModalConfirm}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold"
                    >
                      Proceed Anyway
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Stripe Payment Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Stripe payment logic here
              alert('Redirecting to Stripe for payment...');
            }}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-colors"
          >
            Pay with Stripe
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SelectDriverGuidePage;

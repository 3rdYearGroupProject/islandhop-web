import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, Mail, Car, Users, Award, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';

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
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showNoSelectionModal, setShowNoSelectionModal] = useState(false);
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Drivers Section */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-100 px-6 py-4 border-b border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 flex items-center">
              <Car className="w-6 h-6 mr-3 text-blue-500" />
              Choose Your Driver
            </h2>
            <p className="text-blue-700 text-sm mt-1">Professional drivers with local expertise</p>
          </div>
            {/* Search and Filters for Drivers */}
            <div className="p-6 pb-2 border-b border-blue-100 bg-white">
              <div className="flex flex-row items-center gap-4 mb-4 w-full">
                <input
                  type="text"
                  placeholder="Search drivers by name, vehicle, or language..."
                  className="min-w-[220px] w-72 px-5 py-2 border border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition focus:bg-blue-50 text-base flex-shrink-0"
                  // onChange={...}
                />
                <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent py-1">
                  <select className="px-4 py-2 border border-blue-200 rounded-full text-sm bg-white focus:ring-2 focus:ring-blue-300 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 appearance-none flex-shrink-0">
                    <option value="">All Experience</option>
                    <option value="5">5+ years</option>
                    <option value="10">10+ years</option>
                  </select>
                  <select className="px-4 py-2 border border-blue-200 rounded-full text-sm bg-white focus:ring-2 focus:ring-blue-300 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 appearance-none flex-shrink-0">
                    <option value="">All Languages</option>
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                  <select className="px-4 py-2 border border-blue-200 rounded-full text-sm bg-white focus:ring-2 focus:ring-blue-300 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 appearance-none flex-shrink-0">
                    <option value="">All Vehicles</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Compact">Compact</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
              {mockDrivers.map(driver => (
                <div
                  key={driver.id}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedDriver?.id === driver.id 
                      ? 'border-blue-500 bg-blue-50 border' 
                      : 'border-gray-200 hover:border-blue-300 border'
                  }`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img 
                        src={driver.image} 
                        alt={driver.name} 
                        className="w-20 h-20 rounded-full object-cover border-3 border-white border" 
                      />
                      {selectedDriver?.id === driver.id && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">{driver.rating}</span>
                          <span className="text-sm text-gray-500">({driver.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center text-gray-600">
                          <Car className="w-4 h-4 mr-2 text-blue-500" />
                          {driver.vehicle}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          {driver.experience} experience
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-blue-500" />
                          {driver.phone}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Shield className="w-4 h-4 mr-2 text-blue-500" />
                          {driver.availability}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{driver.description}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Languages:</p>
                        <div className="flex flex-wrap gap-1">
                          {driver.languages.map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Vehicle Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {driver.features.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">{driver.price}</span>
                        {selectedDriver?.id === driver.id && (
                          <span className="text-blue-600 font-bold flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guides Section */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-green-100 px-6 py-4 border-b border-green-200">
            <h2 className="text-2xl font-bold text-green-900 flex items-center">
              <Users className="w-6 h-6 mr-3 text-green-600" />
              Choose Your Guide
            </h2>
            <p className="text-green-700 text-sm mt-1">Expert local guides with cultural knowledge</p>
          </div>
            {/* Search and Filters for Guides */}
            <div className="p-6 pb-2 border-b border-green-100 bg-white">
              <div className="flex flex-row items-center gap-4 mb-4 w-full">
                <input
                  type="text"
                  placeholder="Search guides by name, specialty, or language..."
                  className="min-w-[220px] w-72 px-5 py-2 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm transition focus:bg-green-50 text-base flex-shrink-0"
                  // onChange={...}
                />
                <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent py-1">
                  <select className="px-4 py-2 border border-green-200 rounded-full text-sm bg-white focus:ring-2 focus:ring-green-300 shadow-sm transition hover:border-green-400 hover:bg-green-50 appearance-none flex-shrink-0">
                    <option value="">All Experience</option>
                    <option value="5">5+ years</option>
                    <option value="10">10+ years</option>
                  </select>
                  <select className="px-4 py-2 border border-green-200 rounded-full text-sm bg-white focus:ring-2 focus:ring-green-300 shadow-sm transition hover:border-green-400 hover:bg-green-50 appearance-none flex-shrink-0">
                    <option value="">All Languages</option>
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                  <select className="px-4 py-2 border border-green-200 rounded-full text-sm bg-white focus:ring-2 focus:ring-green-300 shadow-sm transition hover:border-green-400 hover:bg-green-50 appearance-none flex-shrink-0">
                    <option value="">All Specialties</option>
                    <option value="Historical Sites">Historical Sites</option>
                    <option value="Wildlife Tours">Wildlife Tours</option>
                    <option value="Cultural Experiences">Cultural Experiences</option>
                    <option value="Tea Plantation Tours">Tea Plantation Tours</option>
                    <option value="Wellness Tourism">Wellness Tourism</option>
                    <option value="Beach Tours">Beach Tours</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
              {mockGuides.map(guide => (
                <div
                  key={guide.id}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedGuide?.id === guide.id 
                      ? 'border-green-500 bg-green-50 border' 
                      : 'border-gray-200 hover:border-green-300 border'
                  }`}
                  onClick={() => setSelectedGuide(guide)}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img 
                        src={guide.image} 
                        alt={guide.name} 
                        className="w-20 h-20 rounded-full object-cover border-3 border-white border" 
                      />
                      {selectedGuide?.id === guide.id && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{guide.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">{guide.rating}</span>
                          <span className="text-sm text-gray-500">({guide.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center text-gray-600">
                          <Award className="w-4 h-4 mr-2 text-green-500" />
                          {guide.experience} experience
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-green-500" />
                          {guide.phone}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-green-500" />
                          {guide.education}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Shield className="w-4 h-4 mr-2 text-green-500" />
                          {guide.availability}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Languages:</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.specialties.map((specialty, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">{guide.price}</span>
                        {selectedGuide?.id === guide.id && (
                          <span className="text-green-600 font-bold flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mx-auto w-full max-w-7xl">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                {/* Accommodation */}
                <CostSection
                  label="Accommodation"
                  color="purple"
                  items={(() => {
                    if (!trip?.itinerary) return [];
                    let items = [];
                    Object.entries(trip.itinerary).forEach(([dayIdx, day]) => {
                      (day.places || []).forEach(place => {
                        if (place.price && place.price.includes('/night')) {
                          items.push({
                            name: place.name,
                            price: place.price,
                            day: parseInt(dayIdx) + 1,
                            location: place.location
                          });
                        }
                      });
                    });
                    return items;
                  })()}
                />
                {/* Food */}
                <CostSection
                  label="Food"
                  color="orange"
                  items={(() => {
                    if (!trip?.itinerary) return [];
                    let items = [];
                    Object.entries(trip.itinerary).forEach(([dayIdx, day]) => {
                      (day.food || []).forEach(food => {
                        if (food.priceRange) {
                          let avg = null;
                          const match = food.priceRange.match(/\$(\d+)[-–]\$(\d+)/);
                          if (match) {
                            avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
                          } else {
                            const single = parseInt(food.priceRange.replace(/[^0-9]/g, ''));
                            if (!isNaN(single)) avg = single;
                          }
                          if (avg !== null) {
                            items.push({
                              name: food.name,
                              price: `$${avg}`,
                              day: parseInt(dayIdx) + 1,
                              location: food.location
                            });
                          }
                        }
                      });
                    });
                    return items;
                  })()}
                />
                {/* Activities */}
                <CostSection
                  label="Activities"
                  color="blue"
                  items={(() => {
                    if (!trip?.itinerary) return [];
                    let items = [];
                    Object.entries(trip.itinerary).forEach(([dayIdx, day]) => {
                      (day.activities || []).forEach(act => {
                        if (act.price && act.price !== 'Free') {
                          items.push({
                            name: act.name,
                            price: act.price,
                            day: parseInt(dayIdx) + 1,
                            location: act.location
                          });
                        }
                      });
                    });
                    return items;
                  })()}
                />
                {/* Transportation */}
                <CostSection
                  label="Transportation"
                  color="cyan"
                  items={(() => {
                    if (!trip?.itinerary) return [];
                    let items = [];
                    Object.entries(trip.itinerary).forEach(([dayIdx, day]) => {
                      (day.transportation || []).forEach(tr => {
                        if (tr.price && tr.price !== 'Free') {
                          items.push({
                            name: tr.name,
                            price: tr.price,
                            day: parseInt(dayIdx) + 1,
                            location: tr.location
                          });
                        }
                      });
                    });
                    return items;
                  })()}
                />
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
                {/* Trip Duration */}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Trip Duration</span>
                  <span className="text-gray-700">{trip?.totalDays || '--'} days</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                {/* Total */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    {(() => {
                      let total = 0;
                      // Accommodation
                      if (trip?.itinerary) {
                        Object.values(trip.itinerary).forEach(day => {
                          (day.places || []).forEach(place => {
                            if (place.price && place.price.includes('/night')) {
                              const price = parseInt(place.price.replace(/[^0-9]/g, ''));
                              total += price;
                            }
                          });
                        });
                        // Food
                        Object.values(trip.itinerary).forEach(day => {
                          (day.food || []).forEach(food => {
                            if (food.priceRange) {
                              const match = food.priceRange.match(/\$(\d+)[-–]\$(\d+)/);
                              if (match) {
                                const avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
                                total += avg;
                              } else {
                                const single = parseInt(food.priceRange.replace(/[^0-9]/g, ''));
                                if (!isNaN(single)) total += single;
                              }
                            }
                          });
                        });
                        // Activities
                        Object.values(trip.itinerary).forEach(day => {
                          (day.activities || []).forEach(act => {
                            if (act.price && act.price !== 'Free') {
                              const price = parseInt(act.price.replace(/[^0-9]/g, ''));
                              if (!isNaN(price)) total += price;
                            }
                          });
                        });
                        // Transportation
                        Object.values(trip.itinerary).forEach(day => {
                          (day.transportation || []).forEach(tr => {
                            if (tr.price && tr.price !== 'Free') {
                              const price = parseInt(tr.price.replace(/[^0-9]/g, ''));
                              if (!isNaN(price)) total += price;
                            }
                          });
                        });
                      }
                      // Driver
                      if (selectedDriver && trip?.totalDays) {
                        total += parseInt(selectedDriver.price.replace(/[^0-9]/g, '')) * trip.totalDays;
                      }
                      // Guide
                      if (selectedGuide && trip?.totalDays) {
                        total += parseInt(selectedGuide.price.replace(/[^0-9]/g, '')) * trip.totalDays;
                      }
                      return total > 0 ? `$${total}` : '--';
                    })()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">All prices are estimated and inclusive of service fees.</div>
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
      </div>
    </div>
  );
};

export default SelectDriverGuidePage;

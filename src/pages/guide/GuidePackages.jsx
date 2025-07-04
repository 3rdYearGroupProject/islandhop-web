import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Star,
  CheckCircle,
  Calendar,
  Camera,
  Save,
  X
} from 'lucide-react';

const GuidePackages = () => {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Kandy Cultural Heritage Tour',
      description: 'Explore the sacred city of Kandy with temple visits, cultural shows, and traditional experiences.',
      duration: '6 hours',
      price: 150,
      currency: 'USD',
      maxGroupSize: 8,
      difficulty: 'Easy',
      category: 'Cultural',
      isActive: true,
      bookings: 23,
      rating: 4.8,
      reviews: 15,
      images: [
        'https://images.unsplash.com/photo-1566754827201-e6d9e4a0fc23?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=250&fit=crop'
      ],
      highlights: [
        'Temple of the Tooth Relic',
        'Royal Botanical Gardens',
        'Traditional Kandyan Dance Show',
        'Local handicraft shopping'
      ],
      itinerary: [
        { time: '9:00 AM', activity: 'Pick up from hotel' },
        { time: '9:30 AM', activity: 'Temple of the Tooth visit' },
        { time: '11:00 AM', activity: 'Royal Botanical Gardens' },
        { time: '1:00 PM', activity: 'Traditional lunch' },
        { time: '2:30 PM', activity: 'Cultural dance performance' },
        { time: '3:30 PM', activity: 'Local market visit' },
        { time: '4:30 PM', activity: 'Return to hotel' }
      ],
      inclusions: [
        'Professional tour guide',
        'Transportation',
        'Entrance fees',
        'Traditional lunch',
        'Cultural show tickets'
      ],
      exclusions: [
        'Personal expenses',
        'Gratuities',
        'Hotel pickup (outside city center)'
      ]
    },
    {
      id: 2,
      name: 'Ella Adventure Trek',
      description: 'Hiking adventure through Ella\'s stunning landscapes with breathtaking views and natural wonders.',
      duration: '8 hours',
      price: 180,
      currency: 'USD',
      maxGroupSize: 6,
      difficulty: 'Moderate',
      category: 'Adventure',
      isActive: true,
      bookings: 18,
      rating: 4.9,
      reviews: 12,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400&h=250&fit=crop'
      ],
      highlights: [
        'Ella Rock summit hike',
        'Nine Arch Bridge',
        'Little Adam\'s Peak',
        'Tea plantation visit'
      ],
      itinerary: [
        { time: '7:00 AM', activity: 'Early morning pickup' },
        { time: '8:00 AM', activity: 'Begin Ella Rock trek' },
        { time: '10:30 AM', activity: 'Summit photography' },
        { time: '12:00 PM', activity: 'Lunch with a view' },
        { time: '1:30 PM', activity: 'Nine Arch Bridge visit' },
        { time: '2:30 PM', activity: 'Little Adam\'s Peak hike' },
        { time: '4:00 PM', activity: 'Tea plantation tour' },
        { time: '5:00 PM', activity: 'Return journey' }
      ],
      inclusions: [
        'Experienced trekking guide',
        'Transportation',
        'Hiking equipment',
        'Lunch and refreshments',
        'First aid kit'
      ],
      exclusions: [
        'Personal gear',
        'Insurance',
        'Extra meals'
      ]
    },
    {
      id: 3,
      name: 'Colombo Food Discovery',
      description: 'A culinary journey through Colombo\'s diverse food scene, from street food to fine dining.',
      duration: '4 hours',
      price: 95,
      currency: 'USD',
      maxGroupSize: 10,
      difficulty: 'Easy',
      category: 'Food & Culture',
      isActive: false,
      bookings: 8,
      rating: 4.6,
      reviews: 6,
      images: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop'
      ],
      highlights: [
        'Traditional street food tasting',
        'Local market exploration',
        'Cooking demonstration',
        'Spice garden visit'
      ],
      itinerary: [
        { time: '4:00 PM', activity: 'Meet at Pettah Market' },
        { time: '4:30 PM', activity: 'Street food tour' },
        { time: '6:00 PM', activity: 'Traditional restaurant' },
        { time: '7:30 PM', activity: 'Dessert and tea' },
        { time: '8:00 PM', activity: 'Tour ends' }
      ],
      inclusions: [
        'Food tastings',
        'Local guide',
        'Market tour',
        'Recipe cards'
      ],
      exclusions: [
        'Transportation',
        'Alcoholic beverages',
        'Extra food purchases'
      ]
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    currency: 'USD',
    maxGroupSize: '',
    difficulty: 'Easy',
    category: 'Cultural',
    highlights: [''],
    inclusions: [''],
    exclusions: ['']
  });

  const categories = ['Cultural', 'Adventure', 'Food & Culture', 'Nature', 'Historical', 'Religious'];
  const difficulties = ['Easy', 'Moderate', 'Challenging'];

  const filteredPackages = packages.filter(pkg => {
    if (filter === 'active') return pkg.isActive;
    if (filter === 'inactive') return !pkg.isActive;
    return true;
  });

  const handleCreatePackage = () => {
    if (newPackage.name && newPackage.description && newPackage.price) {
      const packageToAdd = {
        id: Date.now(),
        ...newPackage,
        price: parseFloat(newPackage.price),
        maxGroupSize: parseInt(newPackage.maxGroupSize),
        isActive: true,
        bookings: 0,
        rating: 0,
        reviews: 0,
        images: [],
        itinerary: []
      };
      setPackages([...packages, packageToAdd]);
      setNewPackage({
        name: '',
        description: '',
        duration: '',
        price: '',
        currency: 'USD',
        maxGroupSize: '',
        difficulty: 'Easy',
        category: 'Cultural',
        highlights: [''],
        inclusions: [''],
        exclusions: ['']
      });
      setIsCreating(false);
    }
  };

  const togglePackageStatus = (id) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
    ));
  };

  const deletePackage = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Challenging':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Cultural': 'bg-purple-100 text-purple-800',
      'Adventure': 'bg-orange-100 text-orange-800',
      'Food & Culture': 'bg-pink-100 text-pink-800',
      'Nature': 'bg-green-100 text-green-800',
      'Historical': 'bg-blue-100 text-blue-800',
      'Religious': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tour Packages</h1>
            <p className="text-gray-600">Create and manage your tour packages</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Package
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Packages</p>
                <p className="text-2xl font-bold text-gray-900">{packages.filter(p => p.isActive).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{packages.reduce((sum, p) => sum + p.bookings, 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.length > 0 ? (packages.reduce((sum, p) => sum + p.rating, 0) / packages.length).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'all', label: 'All Packages' },
            { key: 'active', label: 'Active' },
            { key: 'inactive', label: 'Inactive' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                filter === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Package Image */}
            <div className="relative h-48 bg-gray-200">
              {pkg.images.length > 0 ? (
                <img 
                  src={pkg.images[0]} 
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="absolute top-3 left-3 flex space-x-1">
                <button
                  onClick={() => setViewingPackage(pkg)}
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors duration-200"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setEditingPackage(pkg)}
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors duration-200"
                >
                  <Edit3 className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Package Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{pkg.name}</h3>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

              {/* Package Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pkg.category)}`}>
                  {pkg.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pkg.difficulty)}`}>
                  {pkg.difficulty}
                </span>
              </div>

              {/* Package Details */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Max {pkg.maxGroupSize} people</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="font-semibold">${pkg.price} {pkg.currency}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{pkg.rating} ({pkg.reviews} reviews)</span>
                </div>
                <span>{pkg.bookings} bookings</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => togglePackageStatus(pkg.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pkg.isActive
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {pkg.isActive ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1 inline" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1 inline" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => deletePackage(pkg.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't created any tour packages yet." 
              : `No ${filter} packages found.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Package
            </button>
          )}
        </div>
      )}

      {/* Create Package Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Package</h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                  <input
                    type="text"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter package name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={newPackage.description}
                    onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your tour package"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={newPackage.duration}
                      onChange={(e) => setNewPackage({...newPackage, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 6 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Group Size</label>
                    <input
                      type="number"
                      value={newPackage.maxGroupSize}
                      onChange={(e) => setNewPackage({...newPackage, maxGroupSize: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newPackage.category}
                      onChange={(e) => setNewPackage({...newPackage, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={newPackage.difficulty}
                      onChange={(e) => setNewPackage({...newPackage, difficulty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Highlights</label>
                {newPackage.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...newPackage.highlights];
                        newHighlights[index] = e.target.value;
                        setNewPackage({...newPackage, highlights: newHighlights});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a highlight"
                    />
                    {newPackage.highlights.length > 1 && (
                      <button
                        onClick={() => {
                          const newHighlights = newPackage.highlights.filter((_, i) => i !== index);
                          setNewPackage({...newPackage, highlights: newHighlights});
                        }}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewPackage({...newPackage, highlights: [...newPackage.highlights, '']})}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Highlight
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePackage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Create Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Detail Modal */}
      {viewingPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{viewingPackage.name}</h2>
                <button
                  onClick={() => setViewingPackage(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Package Images */}
              {viewingPackage.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {viewingPackage.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`${viewingPackage.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Package Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{viewingPackage.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${viewingPackage.price} {viewingPackage.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Group:</span>
                      <span className="font-medium">{viewingPackage.maxGroupSize} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(viewingPackage.difficulty)}`}>
                        {viewingPackage.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(viewingPackage.category)}`}>
                        {viewingPackage.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bookings:</span>
                        <span className="font-medium">{viewingPackage.bookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{viewingPackage.rating} ({viewingPackage.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 mb-6">{viewingPackage.description}</p>

                  <h4 className="font-medium text-gray-900 mb-3">Highlights</h4>
                  <ul className="space-y-2 mb-6">
                    {viewingPackage.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {viewingPackage.itinerary && viewingPackage.itinerary.length > 0 && (
                    <>
                      <h4 className="font-medium text-gray-900 mb-3">Itinerary</h4>
                      <div className="space-y-2">
                        {viewingPackage.itinerary.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-sm font-medium text-blue-600 mr-3 mt-0.5 flex-shrink-0">
                              {item.time}
                            </span>
                            <span className="text-sm text-gray-600">{item.activity}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              {(viewingPackage.inclusions?.length > 0 || viewingPackage.exclusions?.length > 0) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewingPackage.inclusions?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
                      <ul className="space-y-2">
                        {viewingPackage.inclusions.map((item, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {viewingPackage.exclusions?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">What's Not Included</h4>
                      <ul className="space-y-2">
                        {viewingPackage.exclusions.map((item, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidePackages;

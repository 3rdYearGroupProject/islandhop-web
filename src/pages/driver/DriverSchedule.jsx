import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin,
  Car,
  Users,
  DollarSign,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DriverSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, month, day
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const scheduleData = {
    availability: [
      {
        id: 1,
        date: '2025-01-08',
        startTime: '08:00',
        endTime: '18:00',
        status: 'available',
        preferredAreas: ['Colombo', 'Kandy'],
        notes: 'Available for long distance trips'
      },
      {
        id: 2,
        date: '2025-01-09',
        startTime: '06:00',
        endTime: '14:00',
        status: 'available',
        preferredAreas: ['Galle', 'Matara'],
        notes: 'Morning shift only'
      },
      {
        id: 3,
        date: '2025-01-10',
        startTime: '00:00',
        endTime: '23:59',
        status: 'unavailable',
        reason: 'Personal day off'
      }
    ],
    scheduledTrips: [
      {
        id: 'TR001',
        date: '2025-01-08',
        startTime: '09:00',
        endTime: '12:30',
        passenger: 'Sarah Johnson',
        from: 'Colombo Airport',
        to: 'Galle Fort',
        distance: '120 km',
        fare: 89.50,
        status: 'confirmed',
        passengerRating: 4.9
      },
      {
        id: 'TR002',
        date: '2025-01-08',
        startTime: '14:00',
        endTime: '16:45',
        passenger: 'Michael Chen',
        from: 'Kandy Central',
        to: 'Nuwara Eliya',
        distance: '75 km',
        fare: 95.00,
        status: 'pending',
        passengerRating: 4.7
      },
      {
        id: 'TR003',
        date: '2025-01-09',
        startTime: '07:30',
        endTime: '11:00',
        passenger: 'Emma Wilson',
        from: 'Ella Station',
        to: 'Kandy',
        distance: '85 km',
        fare: 78.00,
        status: 'confirmed',
        passengerRating: 4.9,
        isPartialTrip: true
      }
    ]
  };

  const getDaysInWeek = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDayNumber = (date) => {
    return date.getDate();
  };

  const getScheduleForDate = (date) => {
    const dateStr = formatDate(date);
    const availability = scheduleData.availability.find(a => a.date === dateStr);
    const trips = scheduleData.scheduledTrips.filter(t => t.date === dateStr);
    return { availability, trips };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const weekDays = getDaysInWeek(currentDate);
  const today = new Date();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Availability</h1>
            <p className="text-gray-600 mt-1">Manage your working hours and view upcoming trips</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['day', 'week', 'month'].map(viewType => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                    view === viewType
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Availability
            </button>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Week Calendar */}
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((day, index) => {
            const { availability, trips } = getScheduleForDate(day);
            const isToday = formatDate(day) === formatDate(today);
            const isPast = day < today;

            return (
              <div 
                key={index}
                className={`border-r border-gray-200 last:border-r-0 min-h-[200px] ${
                  isPast ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                {/* Day Header */}
                <div className={`p-3 border-b border-gray-200 text-center ${
                  isToday ? 'bg-primary-50' : ''
                }`}>
                  <div className="text-sm font-medium text-gray-600">
                    {formatDayName(day)}
                  </div>
                  <div className={`text-lg font-bold ${
                    isToday ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    {formatDayNumber(day)}
                  </div>
                </div>

                {/* Day Content */}
                <div className="p-2 space-y-2">
                  {/* Availability Status */}
                  {availability && (
                    <div className={`p-2 rounded-lg border text-xs font-medium ${
                      getStatusColor(availability.status)
                    }`}>
                      {availability.status === 'available' ? (
                        <div>
                          <div>Available</div>
                          <div className="text-xs opacity-75">
                            {availability.startTime} - {availability.endTime}
                          </div>
                        </div>
                      ) : (
                        <div>Unavailable</div>
                      )}
                    </div>
                  )}

                  {/* Scheduled Trips */}
                  {trips.map(trip => (
                    <div
                      key={trip.id}
                      className={`p-2 rounded-lg text-xs cursor-pointer hover:shadow-md transition-shadow ${
                        getStatusColor(trip.status)
                      }`}
                      onClick={() => setSelectedSchedule(trip)}
                    >
                      <div className="font-medium">{trip.passenger}</div>
                      <div className="text-xs opacity-75">
                        {trip.startTime} - {trip.endTime}
                      </div>
                      <div className="text-xs opacity-75 truncate">
                        {trip.from} → {trip.to}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-medium">${trip.fare}</span>
                        {trip.isPartialTrip && (
                          <span className="text-xs bg-orange-200 text-orange-800 px-1 rounded">
                            Partial
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Empty State */}
                  {!availability && trips.length === 0 && (
                    <div className="text-center text-gray-400 text-xs py-4">
                      No schedule set
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Days</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled Trips</p>
              <p className="text-2xl font-bold text-gray-900">{scheduleData.scheduledTrips.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Working Hours</p>
              <p className="text-2xl font-bold text-gray-900">48h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expected Earnings</p>
              <p className="text-2xl font-bold text-gray-900">$262</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Trips</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {scheduleData.scheduledTrips
            .filter(trip => new Date(`${trip.date}T${trip.startTime}`) >= today)
            .map(trip => (
              <div key={trip.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{trip.passenger}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-green-500 mr-2" />
                            <span>From: {trip.from}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-red-500 mr-2" />
                            <span>To: {trip.to}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold text-sm">{trip.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-semibold text-sm">{trip.startTime}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fare</p>
                            <p className="font-semibold text-sm">${trip.fare}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            {trip.passengerRating}
                          </div>
                          <span>{trip.distance}</span>
                          {trip.isPartialTrip && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                              Partial Trip
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {scheduleData.scheduledTrips.filter(trip => new Date(`${trip.date}T${trip.startTime}`) >= today).length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
            <p className="text-gray-600">Your schedule is clear. New trip requests will appear here.</p>
          </div>
        )}
      </div>

      {/* Add Availability Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Set Availability</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Areas</label>
                <select multiple className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="colombo">Colombo</option>
                  <option value="kandy">Kandy</option>
                  <option value="galle">Galle</option>
                  <option value="ella">Ella</option>
                  <option value="nuwara-eliya">Nuwara Eliya</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special notes about your availability..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Save Availability
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverSchedule;

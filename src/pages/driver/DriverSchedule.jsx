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
  ChevronRight,
  X
} from 'lucide-react';

const DriverSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, month, day
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [loading, setLoading] = useState(false);

  const scheduleData = {
    availability: [
      {
        id: 1,
        date: '2025-07-18',
        startTime: '08:00',
        endTime: '18:00',
        status: 'available',
        preferredAreas: ['Colombo', 'Kandy'],
        notes: 'Available for long distance trips'
      },
      {
        id: 2,
        date: '2025-07-19',
        startTime: '06:00',
        endTime: '14:00',
        status: 'available',
        preferredAreas: ['Galle', 'Matara'],
        notes: 'Morning shift only'
      },
      {
        id: 3,
        date: '2025-07-20',
        startTime: '00:00',
        endTime: '23:59',
        status: 'unavailable',
        reason: 'Personal day off'
      },
      {
        id: 4,
        date: '2025-07-21',
        startTime: '09:00',
        endTime: '17:00',
        status: 'available',
        preferredAreas: ['Kandy', 'Nuwara Eliya'],
        notes: 'Hill country tours preferred'
      },
      {
        id: 5,
        date: '2025-07-22',
        startTime: '07:00',
        endTime: '19:00',
        status: 'available',
        preferredAreas: ['Colombo', 'Negombo', 'Galle'],
        notes: 'Available for airport transfers'
      },
      {
        id: 6,
        date: '2025-07-23',
        startTime: '10:00',
        endTime: '16:00',
        status: 'available',
        preferredAreas: ['Ella', 'Kandy'],
        notes: 'Weekend availability'
      },
      {
        id: 7,
        date: '2025-07-24',
        startTime: '08:00',
        endTime: '20:00',
        status: 'available',
        preferredAreas: ['Colombo', 'Kandy', 'Galle'],
        notes: 'Full day availability'
      },
      {
        id: 8,
        date: '2025-07-25',
        startTime: '07:30',
        endTime: '18:30',
        status: 'available',
        preferredAreas: ['Anuradhapura', 'Polonnaruwa'],
        notes: 'Ancient cities tour specialist'
      },
      {
        id: 9,
        date: '2025-07-26',
        startTime: '08:00',
        endTime: '16:00',
        status: 'available',
        preferredAreas: ['Sigiriya', 'Dambulla'],
        notes: 'Cultural triangle tours'
      },
      {
        id: 10,
        date: '2025-07-27',
        startTime: '09:00',
        endTime: '17:00',
        status: 'available',
        preferredAreas: ['Bentota', 'Hikkaduwa'],
        notes: 'Beach destinations'
      }
    ],
    scheduledTrips: [
      {
        id: 'TR001',
        date: '2025-07-18',
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
        date: '2025-07-18',
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
        date: '2025-07-19',
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
      },
      {
        id: 'TR004',
        date: '2025-07-19',
        startTime: '12:00',
        endTime: '13:30',
        passenger: 'David Kumar',
        from: 'Galle Fort',
        to: 'Unawatuna',
        distance: '8 km',
        fare: 25.00,
        status: 'confirmed',
        passengerRating: 4.8
      },
      {
        id: 'TR005',
        date: '2025-07-21',
        startTime: '10:00',
        endTime: '14:30',
        passenger: 'Lisa Thompson',
        from: 'Kandy',
        to: 'Sigiriya',
        distance: '95 km',
        fare: 125.00,
        status: 'confirmed',
        passengerRating: 4.6
      },
      {
        id: 'TR006',
        date: '2025-07-21',
        startTime: '15:30',
        endTime: '16:45',
        passenger: 'James Wilson',
        from: 'Sigiriya',
        to: 'Dambulla',
        distance: '20 km',
        fare: 35.00,
        status: 'pending',
        passengerRating: 4.7,
        isPartialTrip: true
      },
      {
        id: 'TR007',
        date: '2025-07-22',
        startTime: '08:00',
        endTime: '10:30',
        passenger: 'Anna Martinez',
        from: 'Negombo',
        to: 'Colombo Airport',
        distance: '15 km',
        fare: 45.00,
        status: 'confirmed',
        passengerRating: 4.9
      },
      {
        id: 'TR008',
        date: '2025-07-22',
        startTime: '13:00',
        endTime: '17:00',
        passenger: 'Robert Brown',
        from: 'Colombo',
        to: 'Bentota',
        distance: '65 km',
        fare: 85.00,
        status: 'confirmed',
        passengerRating: 4.8
      },
      {
        id: 'TR009',
        date: '2025-07-23',
        startTime: '11:00',
        endTime: '14:00',
        passenger: 'Sophie Davis',
        from: 'Ella',
        to: 'Badulla',
        distance: '45 km',
        fare: 55.00,
        status: 'pending',
        passengerRating: 4.5
      },
      {
        id: 'TR010',
        date: '2025-07-24',
        startTime: '09:30',
        endTime: '13:00',
        passenger: 'Mark Taylor',
        from: 'Kandy',
        to: 'Peradeniya',
        distance: '12 km',
        fare: 30.00,
        status: 'confirmed',
        passengerRating: 4.7
      },
      {
        id: 'TR011',
        date: '2025-07-24',
        startTime: '14:30',
        endTime: '18:00',
        passenger: 'Jennifer Lee',
        from: 'Galle',
        to: 'Mirissa',
        distance: '25 km',
        fare: 40.00,
        status: 'confirmed',
        passengerRating: 4.9,
        isPartialTrip: true
      },
      {
        id: 'TR012',
        date: '2025-07-25',
        startTime: '08:30',
        endTime: '12:00',
        passenger: 'Alex Johnson',
        from: 'Colombo',
        to: 'Anuradhapura',
        distance: '205 km',
        fare: 150.00,
        status: 'confirmed',
        passengerRating: 4.8
      },
      {
        id: 'TR013',
        date: '2025-07-25',
        startTime: '14:00',
        endTime: '16:30',
        passenger: 'Maria Rodriguez',
        from: 'Anuradhapura',
        to: 'Polonnaruwa',
        distance: '104 km',
        fare: 75.00,
        status: 'pending',
        passengerRating: 4.6
      },
      {
        id: 'TR014',
        date: '2025-07-26',
        startTime: '09:00',
        endTime: '11:30',
        passenger: 'Thomas Anderson',
        from: 'Dambulla',
        to: 'Sigiriya',
        distance: '20 km',
        fare: 35.00,
        status: 'confirmed',
        passengerRating: 4.9
      },
      {
        id: 'TR015',
        date: '2025-07-26',
        startTime: '13:00',
        endTime: '15:00',
        passenger: 'Lisa Chang',
        from: 'Sigiriya',
        to: 'Kandy',
        distance: '95 km',
        fare: 80.00,
        status: 'confirmed',
        passengerRating: 4.7
      },
      {
        id: 'TR016',
        date: '2025-07-27',
        startTime: '10:00',
        endTime: '12:30',
        passenger: 'Daniel Murphy',
        from: 'Colombo',
        to: 'Bentota',
        distance: '65 km',
        fare: 70.00,
        status: 'pending',
        passengerRating: 4.5
      },
      {
        id: 'TR017',
        date: '2025-07-27',
        startTime: '14:00',
        endTime: '16:00',
        passenger: 'Emily Watson',
        from: 'Bentota',
        to: 'Hikkaduwa',
        distance: '28 km',
        fare: 45.00,
        status: 'confirmed',
        passengerRating: 4.8
      },
      {
        id: 'TR018',
        date: '2025-07-28',
        startTime: '08:00',
        endTime: '10:00',
        passenger: 'Kevin Smith',
        from: 'Hikkaduwa',
        to: 'Galle',
        distance: '20 km',
        fare: 35.00,
        status: 'confirmed',
        passengerRating: 4.9
      },
      {
        id: 'TR019',
        date: '2025-07-28',
        startTime: '11:30',
        endTime: '15:30',
        passenger: 'Rachel Green',
        from: 'Galle',
        to: 'Colombo',
        distance: '116 km',
        fare: 95.00,
        status: 'pending',
        passengerRating: 4.6
      },
      {
        id: 'TR020',
        date: '2025-07-29',
        startTime: '09:00',
        endTime: '13:00',
        passenger: 'Jason Williams',
        from: 'Colombo',
        to: 'Kandy',
        distance: '115 km',
        fare: 85.00,
        status: 'confirmed',
        passengerRating: 4.8
      },
      {
        id: 'TR021',
        date: '2025-07-29',
        startTime: '15:00',
        endTime: '17:30',
        passenger: 'Michelle Davis',
        from: 'Kandy',
        to: 'Nuwara Eliya',
        distance: '75 km',
        fare: 90.00,
        status: 'confirmed',
        passengerRating: 4.7,
        isPartialTrip: true
      },
      {
        id: 'TR022',
        date: '2025-07-30',
        startTime: '07:00',
        endTime: '09:30',
        passenger: 'Christopher Lee',
        from: 'Nuwara Eliya',
        to: 'Ella',
        distance: '45 km',
        fare: 60.00,
        status: 'pending',
        passengerRating: 4.9
      },
      {
        id: 'TR023',
        date: '2025-07-30',
        startTime: '11:00',
        endTime: '14:00',
        passenger: 'Amanda Wilson',
        from: 'Ella',
        to: 'Yala',
        distance: '65 km',
        fare: 75.00,
        status: 'confirmed',
        passengerRating: 4.6
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
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Loading Screen */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Availability</h1>
            <p className="text-gray-600 mt-1">Manage your working hours and view upcoming trips</p>
          </div>
          
          <div className="flex items-center space-x-3">
           
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Schedule
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
                className={`border-r border-gray-200 last:border-r-0 min-h-[280px] ${
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
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Available
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {availability.startTime} - {availability.endTime}
                          </div>
                          {availability.preferredAreas && (
                            <div className="text-xs opacity-75 mt-1">
                              {availability.preferredAreas.join(', ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Unavailable
                        </div>
                      )}
                    </div>
                  )}

                  {/* Trip Count Badge */}
                  {trips.filter(trip => trip.status === 'confirmed').length > 0 && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {trips.filter(trip => trip.status === 'confirmed').length} trip{trips.filter(trip => trip.status === 'confirmed').length > 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-500">
                        ${trips.filter(trip => trip.status === 'confirmed').reduce((sum, trip) => sum + trip.fare, 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Scheduled Trips */}
                  {trips.filter(trip => trip.status === 'confirmed').map(trip => (
                    <div
                      key={trip.id}
                      className="p-2 rounded-lg text-xs cursor-pointer hover:shadow-md transition-shadow border-l-2 bg-blue-50 border-blue-400 hover:bg-blue-100"
                      onClick={() => setSelectedSchedule(trip)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-gray-900 truncate">{trip.passenger}</div>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {trip.startTime} - {trip.endTime}
                      </div>
                      <div className="text-xs text-gray-600 mb-1 truncate">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {trip.from} → {trip.to}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-600">${trip.fare}</span>
                        <div className="flex items-center space-x-1">
                          {trip.isPartialTrip && (
                            <span className="text-xs bg-orange-200 text-orange-800 px-1 rounded">
                              Partial
                            </span>
                          )}
                          
                        </div>
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
              <p className="text-2xl font-bold text-gray-900">9</p>
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
              <p className="text-2xl font-bold text-gray-900">{scheduleData.scheduledTrips.filter(trip => trip.status === 'confirmed').length}</p>
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
              <p className="text-2xl font-bold text-gray-900">85h</p>
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
              <p className="text-2xl font-bold text-gray-900">${scheduleData.scheduledTrips.filter(trip => trip.status === 'confirmed').reduce((sum, trip) => sum + trip.fare, 0).toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Trips</h2>
        </div>

        <div className="space-y-4">
          {scheduleData.scheduledTrips
            .filter(trip => new Date(`${trip.date}T${trip.startTime}`) >= today && trip.status === 'confirmed')
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

        {scheduleData.scheduledTrips.filter(trip => new Date(`${trip.date}T${trip.startTime}`) >= today && trip.status === 'confirmed').length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
            <p className="text-gray-600">Your schedule is clear. New trip requests will appear here.</p>
          </div>
        )}
      </div>

      {/* Trip Details Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Trip Details</h3>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedSchedule.passenger}</h4>
                  
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Trip ID</p>
                  <p className="text-sm text-gray-600">{selectedSchedule.id}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Route</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">From: {selectedSchedule.from}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">To: {selectedSchedule.to}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Date & Time</p>
                  <p className="text-sm text-gray-600">{selectedSchedule.date}</p>
                  <p className="text-sm text-gray-600">{selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Trip Details</p>
                  <p className="text-sm text-gray-600">{selectedSchedule.distance}</p>
                  <p className="text-sm font-semibold text-green-600">${selectedSchedule.fare}</p>
                </div>
              </div>
              
              {selectedSchedule.isPartialTrip && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">Partial Trip</p>
                  <p className="text-xs text-orange-700">This is part of a multi-stop journey</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedSchedule(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
              <button
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Contact Passenger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Availability Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Set Schedule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={availabilityStatus === 'available'}
                      onChange={(e) => setAvailabilityStatus(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="unavailable"
                      checked={availabilityStatus === 'unavailable'}
                      onChange={(e) => setAvailabilityStatus(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Unavailable</span>
                  </label>
                </div>
              </div>
              
              {availabilityStatus === 'available' && (
                <>
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
                </>
              )}
              
              {availabilityStatus === 'unavailable' && (
                <div>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    You are setting yourself as unavailable for this date. No trip requests will be accepted.
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {availabilityStatus === 'available' ? 'Notes (Optional)' : 'Additional Notes (Optional)'}
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={availabilityStatus === 'available' 
                    ? "Any special notes about your availability..." 
                    : "Additional details about your unavailability..."}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAvailabilityStatus('available');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAvailabilityStatus('available');
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverSchedule;

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  MapPin, 
  Users, 
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  Car
} from 'lucide-react';

const GuideSchedule = () => {
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
        date: '2025-07-19',
        startTime: '08:00',
        endTime: '18:00',
        status: 'available',
        preferredTours: ['Cultural Tours', 'Adventure Tours'],
        notes: 'Available for full day tours'
      },
      {
        id: 2,
        date: '2025-07-20',
        startTime: '06:00',
        endTime: '14:00',
        status: 'available',
        preferredTours: ['Nature Tours', 'Trekking'],
        notes: 'Morning tours preferred'
      },
      {
        id: 3,
        date: '2025-07-21',
        startTime: '00:00',
        endTime: '23:59',
        status: 'unavailable',
        reason: 'Personal day off'
      },
      {
        id: 4,
        date: '2025-07-22',
        startTime: '09:00',
        endTime: '17:00',
        status: 'available',
        preferredTours: ['Historical Sites', 'Cultural Tours'],
        notes: 'Ancient sites specialist'
      },
      {
        id: 5,
        date: '2025-07-23',
        startTime: '07:00',
        endTime: '19:00',
        status: 'available',
        preferredTours: ['Wildlife', 'Safari Tours'],
        notes: 'Available for safari tours'
      },
      {
        id: 6,
        date: '2025-07-24',
        startTime: '10:00',
        endTime: '16:00',
        status: 'available',
        preferredTours: ['City Tours', 'Food Tours'],
        notes: 'Weekend availability'
      },
      {
        id: 7,
        date: '2025-07-25',
        startTime: '08:00',
        endTime: '20:00',
        status: 'available',
        preferredTours: ['Adventure Tours', 'Trekking'],
        notes: 'Full day availability'
      }
    ],
    scheduledTours: [
      {
        id: 'GT001',
        date: '2025-07-19',
        startTime: '09:00',
        endTime: '15:00',
        tourist: 'Emily Johnson',
        tourType: 'Kandy Cultural Heritage Tour',
        location: 'Kandy City Center',
        groupSize: 4,
        fee: 8500.00,
        status: 'confirmed',
        touristRating: 4.9
      },
      {
        id: 'GT002',
        date: '2025-07-19',
        startTime: '16:00',
        endTime: '18:30',
        tourist: 'Marco Rodriguez',
        tourType: 'Colombo Food Discovery Walk',
        location: 'Pettah Market',
        groupSize: 2,
        fee: 4500.00,
        status: 'pending',
        touristRating: 4.7
      },
      {
        id: 'GT003',
        date: '2025-07-20',
        startTime: '07:30',
        endTime: '13:00',
        tourist: 'Sarah Chen',
        tourType: 'Ella Adventure Trek',
        location: 'Ella Train Station',
        groupSize: 3,
        fee: 7800.00,
        status: 'confirmed',
        touristRating: 4.8
      },
      {
        id: 'GT004',
        date: '2025-07-22',
        startTime: '10:00',
        endTime: '16:00',
        tourist: 'James Wilson',
        tourType: 'Sigiriya Historical Tour',
        location: 'Dambulla',
        groupSize: 6,
        fee: 12500.00,
        status: 'confirmed',
        touristRating: 4.6
      },
      {
        id: 'GT005',
        date: '2025-07-23',
        startTime: '08:00',
        endTime: '12:30',
        tourist: 'Lisa Thompson',
        tourType: 'Yala Safari Experience',
        location: 'Yala National Park',
        groupSize: 5,
        fee: 15000.00,
        status: 'confirmed',
        touristRating: 4.9
      },
      {
        id: 'GT006',
        date: '2025-07-23',
        startTime: '14:00',
        endTime: '17:00',
        tourist: 'David Kumar',
        tourType: 'Galle Fort Walking Tour',
        location: 'Galle Fort',
        groupSize: 2,
        fee: 3500.00,
        status: 'pending',
        touristRating: 4.5
      },
      {
        id: 'GT007',
        date: '2025-07-24',
        startTime: '11:00',
        endTime: '15:00',
        tourist: 'Anna Martinez',
        tourType: 'Nuwara Eliya Tea Country Tour',
        location: 'Pedro Tea Estate',
        groupSize: 4,
        fee: 9200.00,
        status: 'confirmed',
        touristRating: 4.8
      },
      {
        id: 'GT008',
        date: '2025-07-25',
        startTime: '08:30',
        endTime: '14:00',
        tourist: 'Robert Brown',
        tourType: 'Anuradhapura Ancient City Tour',
        location: 'Sri Maha Bodhi',
        groupSize: 8,
        fee: 16000.00,
        status: 'confirmed',
        touristRating: 4.7
      },
      {
        id: 'GT009',
        date: '2025-07-25',
        startTime: '15:30',
        endTime: '18:00',
        tourist: 'Sophie Davis',
        tourType: 'Sunset Photography Tour',
        location: 'Mihintale',
        groupSize: 3,
        fee: 5800.00,
        status: 'pending',
        touristRating: 4.9
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
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      week.push(newDate);
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
    const tours = scheduleData.scheduledTours.filter(t => t.date === dateStr);
    return { availability, tours };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
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
            <p className="text-gray-600 mt-1">Manage your working hours and view upcoming tours</p>
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
            const { availability, tours } = getScheduleForDate(day);
            const isToday = formatDate(day) === formatDate(today);
            const isPast = day < today;

            return (
              <div key={index} className={`p-4 border-r border-b border-gray-200 last:border-r-0 min-h-32 ${
                isToday ? 'bg-blue-50' : 'bg-white'
              }`}>
                <div className="text-center mb-3">
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    {formatDayName(day)}
                  </div>
                  <div className={`text-lg font-bold mt-1 ${
                    isToday ? 'text-blue-600' : isPast ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {formatDayNumber(day)}
                  </div>
                </div>

                {/* Availability Status */}
                {availability && (
                  <div className={`text-xs px-2 py-1 rounded-full text-center mb-2 ${getStatusColor(availability.status)}`}>
                    {availability.status === 'available' ? 'Available' : 'Unavailable'}
                  </div>
                )}

                {/* Tours */}
                <div className="space-y-1">
                  {tours.map(tour => (
                    <div 
                      key={tour.id}
                      onClick={() => setSelectedSchedule(tour)}
                      className={`p-2 rounded text-xs cursor-pointer transition-all hover:shadow-md ${
                        tour.status === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-yellow-400 text-black'
                      }`}
                    >
                      <div className="font-medium truncate">{tour.startTime}</div>
                      <div className="truncate">{tour.tourType}</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{tour.groupSize}</span>
                        </div>
                        <div className="text-xs opacity-75">LKR{tour.fee}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Availability info */}
                {availability && availability.status === 'available' && tours.length === 0 && (
                  <div className="text-xs text-gray-500 text-center mt-2">
                    {availability.startTime} - {availability.endTime}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Days</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled Tours</p>
                <p className="text-2xl font-bold text-gray-900">{scheduleData.scheduledTours.filter(tour => tour.status === 'confirmed').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tours */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Tours</h2>
        </div>

        <div className="space-y-4">
          {scheduleData.scheduledTours
            .filter(tour => new Date(`${tour.date}T${tour.startTime}`) >= today && tour.status === 'confirmed')
            .map(tour => (
              <div key={tour.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{tour.tourist}</h3>
                       
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                            <span>{tour.tourType}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-green-500 mr-2" />
                            <span>Location: {tour.location}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold text-sm">{tour.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-semibold text-sm">{tour.startTime}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fee</p>
                            <p className="font-semibold text-sm">LKR{tour.fee}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {tour.groupSize} people
                          </span>
                          <span>{tour.startTime} - {tour.endTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {scheduleData.scheduledTours.filter(tour => new Date(`${tour.date}T${tour.startTime}`) >= today && tour.status === 'confirmed').length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming tours</h3>
            <p className="text-gray-600">Your schedule is clear. New tour requests will appear here.</p>
          </div>
        )}
      </div>

      {/* Tour Details Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Tour Details</h3>
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
                  <h4 className="font-semibold text-gray-900">{selectedSchedule.tourist}</h4>
               
                </div>   <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">{selectedSchedule.touristRating} rating</span>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Tour ID</p>
                  <p className="text-sm text-gray-600">{selectedSchedule.id}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tour Details</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">{selectedSchedule.tourType}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Location: {selectedSchedule.location}</span>
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
                  <p className="text-sm font-medium text-gray-700">Group Details</p>
                  <p className="text-sm text-gray-600">{selectedSchedule.groupSize} people</p>
                  <p className="text-sm font-semibold text-green-600">LKR{selectedSchedule.fee}</p>
                </div>
              </div>
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
                Contact Tourist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Schedule Modal */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Tour Types</label>
                    <select multiple className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="cultural">Cultural Tours</option>
                      <option value="adventure">Adventure Tours</option>
                      <option value="nature">Nature Tours</option>
                      <option value="wildlife">Wildlife Tours</option>
                      <option value="historical">Historical Sites</option>
                    </select>
                  </div>
                </>
              )}
              
              {availabilityStatus === 'unavailable' && (
                <div>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    You are setting yourself as unavailable for this date. No tour requests will be accepted.
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
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    setShowAddModal(false);
                    setAvailabilityStatus('available');
                  }, 1000);
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

export default GuideSchedule;

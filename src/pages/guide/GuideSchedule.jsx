import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  MapPin, 
  Users, 
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Settings
} from 'lucide-react';

const GuideSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, month
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const [availability, setAvailability] = useState({
    monday: { available: true, start: '08:00', end: '18:00' },
    tuesday: { available: true, start: '08:00', end: '18:00' },
    wednesday: { available: true, start: '08:00', end: '18:00' },
    thursday: { available: true, start: '08:00', end: '18:00' },
    friday: { available: true, start: '08:00', end: '18:00' },
    saturday: { available: true, start: '09:00', end: '17:00' },
    sunday: { available: false, start: '09:00', end: '17:00' }
  });

  const [scheduledTours, setScheduledTours] = useState([
    {
      id: 'ST001',
      date: '2024-12-15',
      startTime: '09:00',
      endTime: '15:00',
      package: 'Kandy Cultural Heritage Tour',
      tourist: 'Emily Johnson',
      groupSize: 4,
      status: 'confirmed',
      location: 'Kandy City Center',
      notes: 'Vegetarian lunch required'
    },
    {
      id: 'ST002',
      date: '2024-12-16',
      startTime: '07:00',
      endTime: '15:00',
      package: 'Ella Adventure Trek',
      tourist: 'Marco Rodriguez',
      groupSize: 2,
      status: 'confirmed',
      location: 'Ella Train Station',
      notes: 'Early morning start'
    },
    {
      id: 'ST003',
      date: '2024-12-17',
      startTime: '16:00',
      endTime: '20:00',
      package: 'Colombo Food Discovery',
      tourist: 'Sarah Chen',
      groupSize: 3,
      status: 'pending',
      location: 'Galle Face Green',
      notes: 'No spicy food'
    },
    {
      id: 'ST004',
      date: '2024-12-18',
      startTime: '10:00',
      endTime: '16:00',
      package: 'Sigiriya Historical Tour',
      tourist: 'James Wilson',
      groupSize: 6,
      status: 'confirmed',
      location: 'Dambulla',
      notes: 'Photography focus'
    }
  ]);

  const [blockedDates, setBlockedDates] = useState([
    {
      id: 'BD001',
      date: '2024-12-19',
      reason: 'Personal leave',
      isFullDay: true
    },
    {
      id: 'BD002',
      date: '2024-12-20',
      startTime: '14:00',
      endTime: '18:00',
      reason: 'Equipment maintenance',
      isFullDay: false
    }
  ]);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getWeekDates = (date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      week.push(newDate);
    }
    return week;
  };

  const getMonthDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // Adjust to show full weeks
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isSameMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getTourForDate = (date) => {
    return scheduledTours.filter(tour => tour.date === formatDate(date));
  };

  const getBlockedForDate = (date) => {
    return blockedDates.filter(block => block.date === formatDate(date));
  };

  const isAvailable = (date) => {
    const dayName = days[date.getDay()].toLowerCase();
    return availability[dayName]?.available;
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateAvailability = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const weekDates = getWeekDates(currentDate);
  const monthDates = getMonthDates(currentDate);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule</h1>
            <p className="text-gray-600">Manage your availability and bookings</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAvailabilityModal(true)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Availability
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Block Time
            </button>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {view === 'week' 
                ? `Week of ${months[weekDates[0].getMonth()]} ${weekDates[0].getDate()}, ${weekDates[0].getFullYear()}`
                : `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              }
            </h2>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                view === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                view === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-xl font-bold text-gray-900">{scheduledTours.length} tours</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-xl font-bold text-gray-900">
                  {scheduledTours.filter(t => t.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {scheduledTours.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                <p className="text-xl font-bold text-gray-900">
                  {scheduledTours.reduce((sum, tour) => sum + tour.groupSize, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {view === 'week' ? (
          // Week View
          <div>
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-600">Time</span>
              </div>
              {weekDates.map((date, index) => (
                <div key={index} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm text-gray-600">{days[date.getDay()]}</div>
                  <div className={`text-lg font-semibold mt-1 ${
                    isToday(date) ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  {!isAvailable(date) && (
                    <div className="text-xs text-red-600 mt-1">Unavailable</div>
                  )}
                </div>
              ))}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {Array.from({ length: 12 }, (_, hour) => hour + 7).map(hour => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-100 min-h-16">
                  <div className="p-3 border-r border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-600">
                      {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
                    </span>
                  </div>
                  {weekDates.map((date, dayIndex) => {
                    const tours = getTourForDate(date);
                    const blocked = getBlockedForDate(date);
                    const tourInHour = tours.find(tour => {
                      const startHour = parseInt(tour.startTime.split(':')[0]);
                      const endHour = parseInt(tour.endTime.split(':')[0]);
                      return hour >= startHour && hour < endHour;
                    });

                    return (
                      <div key={dayIndex} className="p-1 border-r border-gray-200 last:border-r-0 relative">
                        {tourInHour && hour === parseInt(tourInHour.startTime.split(':')[0]) && (
                          <div className={`absolute inset-x-1 bg-blue-500 text-white rounded p-2 text-xs z-10 ${
                            getStatusColor(tourInHour.status)
                          }`}
                          style={{
                            height: `${(parseInt(tourInHour.endTime.split(':')[0]) - parseInt(tourInHour.startTime.split(':')[0])) * 4}rem`,
                            background: tourInHour.status === 'confirmed' ? '#3B82F6' : 
                                       tourInHour.status === 'pending' ? '#F59E0B' : '#EF4444'
                          }}>
                            <div className="font-medium truncate">{tourInHour.package}</div>
                            <div className="truncate">{tourInHour.tourist}</div>
                            <div className="flex items-center mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{tourInHour.groupSize}</span>
                            </div>
                          </div>
                        )}
                        {blocked.length > 0 && !tourInHour && (
                          <div className="absolute inset-x-1 bg-red-200 text-red-800 rounded p-1 text-xs">
                            Blocked
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Month View
          <div>
            <div className="grid grid-cols-7 border-b border-gray-200">
              {days.map(day => (
                <div key={day} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                  <span className="text-sm font-medium text-gray-600">{day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {monthDates.map((date, index) => {
                const tours = getTourForDate(date);
                const blocked = getBlockedForDate(date);
                const isCurrentMonth = isSameMonth(date);

                return (
                  <div key={index} className={`min-h-32 p-2 border-r border-b border-gray-200 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                  } ${isToday(date) ? 'bg-blue-50' : ''}`}>
                    <div className={`text-sm font-medium mb-2 ${
                      isToday(date) ? 'text-blue-600' : 
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    {!isAvailable(date) && isCurrentMonth && (
                      <div className="text-xs text-red-600 mb-1">Unavailable</div>
                    )}

                    <div className="space-y-1">
                      {tours.map(tour => (
                        <div key={tour.id} className={`text-xs p-1 rounded border ${getStatusColor(tour.status)}`}>
                          <div className="font-medium truncate">{tour.startTime}</div>
                          <div className="truncate">{tour.package}</div>
                        </div>
                      ))}
                      
                      {blocked.map(block => (
                        <div key={block.id} className="text-xs p-1 rounded bg-red-100 text-red-800 border border-red-200">
                          <div className="truncate">Blocked</div>
                          <div className="truncate">{block.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Tours */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Tours</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {scheduledTours.slice(0, 5).map(tour => (
              <div key={tour.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(tour.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500">{tour.startTime}</div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{tour.package}</h4>
                    <div className="text-sm text-gray-600 flex items-center space-x-4">
                      <span>{tour.tourist}</span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {tour.groupSize} people
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {tour.location}
                      </span>
                    </div>
                    {tour.notes && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {tour.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tour.status)}`}>
                    {tour.status}
                  </span>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-red-600 transition-colors duration-200">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Settings Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Weekly Availability</h2>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {Object.entries(availability).map(([day, settings]) => (
                  <div key={day} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => updateAvailability(day, 'available', !settings.available)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          settings.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {settings.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <span className="font-medium text-gray-900 capitalize w-20">{day}</span>
                    </div>

                    {settings.available && (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">From:</span>
                          <input
                            type="time"
                            value={settings.start}
                            onChange={(e) => updateAvailability(day, 'start', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">To:</span>
                          <input
                            type="time"
                            value={settings.end}
                            onChange={(e) => updateAvailability(day, 'end', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {!settings.available && (
                      <span className="text-sm text-gray-500">Unavailable</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideSchedule;

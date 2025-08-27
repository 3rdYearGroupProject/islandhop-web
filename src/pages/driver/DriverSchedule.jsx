import React, { useState, useEffect } from 'react';
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
import { useSchedule } from '../../hooks/useSchedule';
import userDataManager from '../../utils/userStorage';

const DriverSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, month, day
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  
  // Get user data
  const userData = userDataManager.getUserData();
  const userEmail = userData?.email || 'driver@example.com'; // Fallback for testing
  
  // Use the schedule hook
  const {
    schedule,
    loading,
    error,
    getSchedule,
    markUnavailable,
    markAvailable,
    lockDays,
    setError
  } = useSchedule('driver', userEmail);

  // Load schedule data when component mounts or month changes
  useEffect(() => {
    if (userEmail) {
      getSchedule(currentMonth);
    }
  }, [currentMonth, userEmail, getSchedule]);

  // Handle date selection for bulk operations
  const handleDateSelect = (date) => {
    setSelectedDates(prev =>
      prev.includes(date) 
        ? prev.filter(d => d !== date) 
        : [...prev, date]
    );
  };

  // Handle marking days as unavailable
  const handleMarkUnavailable = async () => {
    if (selectedDates.length === 0) return;

    try {
      await markUnavailable(selectedDates);
      await getSchedule(currentMonth); // Refresh data
      setSelectedDates([]);
      alert('Days marked as unavailable successfully!');
    } catch (error) {
      alert('Failed to mark days unavailable: ' + error.message);
    }
  };

  // Handle marking days as available
  const handleMarkAvailable = async () => {
    if (selectedDates.length === 0) return;

    try {
      await markAvailable(selectedDates);
      await getSchedule(currentMonth); // Refresh data
      setSelectedDates([]);
      alert('Days marked as available successfully!');
    } catch (error) {
      alert('Failed to mark days available: ' + error.message);
    }
  };

  // Handle locking days
  const handleLockDays = async () => {
    if (selectedDates.length === 0) return;

    const tripId = prompt('Enter Trip ID (optional):');

    try {
      await lockDays(selectedDates, tripId || null);
      await getSchedule(currentMonth); // Refresh data
      setSelectedDates([]);
      alert('Days locked successfully!');
    } catch (error) {
      alert('Failed to lock days: ' + error.message);
    }
  };

  // Handle form submission for setting schedule
  const handleSetSchedule = async (formData) => {
    try {
      if (formData.status === 'available') {
        await markAvailable([formData.date]);
      } else {
        await markUnavailable([formData.date]);
      }
      await getSchedule(currentMonth); // Refresh data
      setShowAddModal(false);
      alert('Schedule updated successfully!');
    } catch (error) {
      alert('Failed to update schedule: ' + error.message);
    }
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
    if (!schedule || !schedule.schedule) return { availability: null, trips: [] };
    
    const daySchedule = schedule.schedule.find(s => s.date === dateStr);
    return { 
      availability: daySchedule ? {
        status: daySchedule.status,
        date: daySchedule.date,
        tripId: daySchedule.tripId
      } : null, 
      trips: [] // Trips will be fetched separately or included in the schedule response
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'locked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Schedule
            </button>
          </div>
        </div>

        {/* Bulk Operations */}
        {selectedDates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleMarkAvailable}
                  disabled={loading}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  Mark Available
                </button>
                <button
                  onClick={handleMarkUnavailable}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                >
                  Mark Unavailable
                </button>
                <button
                  onClick={handleLockDays}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  Lock Days
                </button>
                <button
                  onClick={() => setSelectedDates([])}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
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
            const { availability } = getScheduleForDate(day);
            const isToday = formatDate(day) === formatDate(today);
            const isPast = day < today;
            const dateStr = formatDate(day);
            const isSelected = selectedDates.includes(dateStr);

            return (
              <div 
                key={index}
                className={`border-r border-gray-200 last:border-r-0 min-h-[280px] cursor-pointer transition-colors ${
                  isPast ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                } ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                onClick={() => handleDateSelect(dateStr)}
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
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {availability.status === 'available' ? 'Available' : 
                         availability.status === 'unavailable' ? 'Unavailable' :
                         availability.status === 'locked' ? 'Locked' : availability.status}
                      </div>
                      {availability.tripId && (
                        <div className="text-xs opacity-75 mt-1">
                          Trip: {availability.tripId}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empty State */}
                  {!availability && (
                    <div className="text-center text-gray-400 text-xs py-4">
                      Click to set schedule
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedule?.summary?.available || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locked Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedule?.summary?.locked || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Trips</h2>
        </div>

        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
          <p className="text-gray-600">Trip information will be integrated with the booking system.</p>
        </div>
      </div>

      {/* Add Availability Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Set Schedule</h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const date = formData.get('date');
              
              try {
                if (availabilityStatus === 'available') {
                  await markAvailable([date]);
                } else {
                  await markUnavailable([date]);
                }
                await getSchedule(currentMonth);
                setShowAddModal(false);
                setAvailabilityStatus('available');
                alert('Schedule updated successfully!');
              } catch (error) {
                alert('Failed to update schedule: ' + error.message);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
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
                
                {availabilityStatus === 'unavailable' && (
                  <div>
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      You are setting yourself as unavailable for this date. No trip requests will be accepted.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setAvailabilityStatus('available');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverSchedule;

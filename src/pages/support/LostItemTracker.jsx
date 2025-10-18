import React, { useState, useEffect } from "react";
import {
  ArchiveBoxXMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  UserIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  UserCircleIcon,
  MapIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { useToast } from '../../components/ToastProvider';

const LostItemTracker = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});
  const toast = useToast();

  // useEffect hook to fetch lost items from database
  useEffect(() => {
    const fetchLostItems = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Fetching lost items from database...');
        
        const response = await fetch('http://localhost:8062/lost-items/getLostItems', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Lost items fetched successfully:', data);

        // Check if data has the expected structure
        if (data && data.data) {
          // Set the reports from the data array
          setReports(data.data);
          if (data.dashboardStats) {
              setDashboardStats(data.dashboardStats);
            }
          
        } else if (Array.isArray(data)) {
          // If data is directly an array
          setReports(data);
        } else {
          console.warn('⚠️ Unexpected data structure:', data);
          setReports([]);
        }

      } catch (err) {
        console.error('❌ Error fetching lost items:', err);
        setError(err.message);
        
        // Keep mock data for development/fallback
        setReports([
          {
            id: "LI-20250621-001",
            date: "2025-06-21",
            time: "14:30",
            item: "Black Backpack",
            desc: "Left in the back seat of the vehicle after trip from Colombo to Kandy.",
            priority: "High",
            location: "Colombo to Kandy Route",
            tourist: {
              name: "Ayesha Fernando",
              avatar: "https://randomuser.me/api/portraits/women/68.jpg",
              email: "ayesha.fernando@email.com",
              phone: "+94 77 123 4567",
            },
            driver: {
              name: "Nuwan Perera",
              avatar: "https://randomuser.me/api/portraits/men/45.jpg",
              email: "nuwan.perera@email.com",
              phone: "+94 76 987 6543",
            },
            status: "Ongoing",
            update: "",
          },
          // Add other mock items as fallback...
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLostItems();
  }, []); // Empty dependency array means it runs once on mount

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statusOptions = ["Ongoing", "Resolved", "Unresolved"];

  //Filter reports based on search and status
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tripId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const handleStatusChange = async (idx, newStatus) => {
    const report = reports[idx];
    const previousStatus = report.status;
    
    // Optimistically update the UI
    setReports(
      reports.map((report, index) =>
        index === idx ? { ...report, status: newStatus } : report
      )
    );

    try {
      console.log(`🔄 Updating status for item ${report.id || report._id} to ${newStatus}...`);
      
      const response = await fetch(`http://localhost:8062/lost-items/updateStatus/${report.id || report._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Status updated successfully:', result);

      // Show success message
      toast.success(`Status updated to "${newStatus}" successfully!`);
      
    } catch (error) {
      console.error('❌ Error updating status:', error);
      
      // Revert the optimistic update
      setReports(
        reports.map((report, index) =>
          index === idx ? { ...report, status: previousStatus } : report
        )
      );
      
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const handleContact = (type, person) => {
    if (type === "email") {
      window.location.href = `mailto:${person.email}`;
    } else if (type === "phone") {
      window.location.href = `tel:${person.phone}`;
    }
  };

  const handleUpdate = (idx, value) => {
    setReports(
      reports.map((report, index) =>
        index === idx ? { ...report, update: value } : report
      )
    );
  };

  const handleSaveUpdate = async (idx) => {
    const report = reports[idx];
    const updateNotes = report.update;
    
    if (!updateNotes || updateNotes.trim() === '') {
      toast.warning('Please enter progress notes before saving.');
      return;
    }

    // Debug logging
    // console.log('🔍 Debug Info:', {
    //   reportId: report.id || report._id,
    //   updateNotes: updateNotes,
    //   reportObject: report
    // });

    try {
      console.log(`🔄 Saving progress notes for item ${report.id || report._id}...`);
      
      const requestUrl = `http://localhost:8062/lost-items/updateProgressNotes/${report.id || report._id}`;
      const requestBody = {
        progressNotes: updateNotes
        // Remove the extra fields that backend doesn't expect
      };
      
      console.log('🔍 Request details:', {
        url: requestUrl,
        method: 'PUT',
        body: requestBody
      });
      
      const response = await fetch(requestUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Progress notes saved successfully:', result);

      // Update the local state with the response data if available
      if (result.data) {
        setReports(
          reports.map((report, index) =>
            index === idx ? { ...report, ...result.data } : report
          )
        );
      }

      toast.success('Progress notes saved successfully!');
      
    } catch (error) {
      console.error('❌ Error saving progress notes:', error);
      
      // More detailed error information
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error: Unable to connect to the server. Please check if the backend is running on port 8062.');
      } else if (error.message.includes('HTTP error')) {
        toast.error(`Server error: ${error.message}`);
      } else {
        toast.error(`Failed to save progress notes: ${error.message}`);
      }
    }
  };

  // Combined function to update both status and progress notes
  // const handleSaveStatusAndNotes = async (idx, newStatus = null) => {
  //   const report = reports[idx];
  //   const currentStatus = newStatus || report.status;
  //   const updateNotes = report.update;
    
  //   if (!updateNotes || updateNotes.trim() === '') {
  //     alert('Please enter progress notes before saving.');
  //     return;
  //   }

  //   try {
  //     console.log(`🔄 Updating status and notes for item ${report.id || report._id}...`);
      
  //     const response = await fetch(`http://localhost:8062/lost-items/updateItemDetails/${report.id || report._id}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         status: currentStatus,
  //         progressNotes: updateNotes,
  //         lastUpdatedBy: 'Support Agent',
  //         updatedAt: new Date().toISOString()
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     console.log('✅ Status and notes updated successfully:', result);

  //     // Update the local state
  //     setReports(
  //       reports.map((report, index) =>
  //         index === idx ? { 
  //           ...report, 
  //           status: currentStatus,
  //           update: updateNotes,
  //           lastUpdatedBy: 'Support Agent',
  //           updatedAt: new Date().toISOString()
  //         } : report
  //       )
  //     );

  //     alert(`Status updated to "${currentStatus}" and progress notes saved successfully!`);
      
  //   } catch (error) {
  //     console.error('❌ Error updating status and notes:', error);
  //     alert(`Failed to update: ${error.message}`);
  //   }
  // };

  // Function to mark item as resolved with resolution notes
  const handleResolveItem = async (idx) => {
    const report = reports[idx];
    const resolutionNotes = report.update;
    
    if (!resolutionNotes || resolutionNotes.trim() === '') {
      toast.warning('Please provide resolution details before marking as resolved.');
      return;
    }

    try {
      console.log(`🔄 Resolving item ${report.id || report._id}...`);
      
      const response = await fetch(`http://localhost:8062/lost-items/resolve-item/${report.id || report._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolutionNotes: resolutionNotes,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Item resolved successfully:', result);

      // Update the local state
      setReports(
        reports.map((report, index) =>
          index === idx ? { 
            ...report, 
            status: 'Resolved',
            update: resolutionNotes,
            resolvedBy: 'Support Agent',
            resolvedAt: new Date().toISOString()
          } : report
        )
      );

      toast.success('Item marked as resolved successfully!');
      
    } catch (error) {
      console.error('❌ Error resolving item:', error);
      toast.error(`Failed to resolve item: ${error.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ongoing":
        return <ClockIcon className="h-4 w-4" />;
      case "Resolved":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "Unresolved":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Ongoing":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300";
      case "Resolved":
        return "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300";
      case "Unresolved":
        return "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading lost items...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <XCircleIcon className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading lost items
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {error}. Showing sample data instead.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading */}
      {!isLoading && (
        <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Lost Item Tracker
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive tracking and management of lost item reports
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Reports
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.totalCases ? dashboardStats.totalCases : 0}
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <ArchiveBoxXMarkIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          

          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Resolved
                </p>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {dashboardStats.foundCases ? dashboardStats.foundCases : 0}
                </p>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900/20 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Unresolved
                </p>
                <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                  {dashboardStats.notFoundCases ? dashboardStats.notFoundCases : 0}
                </p>
              </div>
              <div className="p-3 bg-danger-100 dark:bg-danger-900/20 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-danger-600 dark:text-danger-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by item, ID, or tourist name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700">
            <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Reports Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No lost item reports match your current search criteria.
            </p>
          </div>
        ) : (
          filteredReports.map((report, idx) => (
            <div
              key={report.id}
              className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-secondary-700 border-b border-gray-200 dark:border-secondary-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <ArchiveBoxXMarkIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        ITEM-{String(idx + 1).padStart(3, '0')}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    {report.priority && (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityClasses(
                          report.priority
                        )}`}
                      >
                        {report.priority} Priority
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{report.date}</span>
                      {report.time && <span>at {report.time}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column - Item Details and Management */}
                  <div className="space-y-3">
                    {/* Item Details */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {report.item}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {report.desc}
                      </p>
                      {report.location && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <TruckIcon className="h-4 w-4" />
                          <span>Location: {report.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Report Details */}
                    <div className="bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-600 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <DocumentTextIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                          Report Details
                        </h5>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Message:</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-secondary-700 rounded-md p-2">
                            {report.description || "No message provided"}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Date Lost:</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {report.lostDate ? new Date(report.lostDate).toLocaleDateString() : "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Reported:</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="bg-gray-50 dark:bg-secondary-700 rounded-lg p-3">
                      

                      {/* Update Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Progress Notes
                        </label>
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <textarea
                              value={report.update }
                              onChange={(e) => handleUpdate(idx, e.target.value)}
                              placeholder={report.progressNotes ? report.progressNotes : "Add update about the lost item status..."}
                              rows={3}
                              className="flex-1 rounded-md border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-2 py-1 text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleSaveUpdate(idx)}
                              disabled={!report.update || report.update.trim() === ''}
                              className="px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                              Save Notes
                            </button>
                           
                              <button
                                onClick={() => handleResolveItem(idx)}
                                disabled={!report.update || report.update.trim() === ''}
                                className="px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-success-600 hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition-colors"
                              >
                                Mark Resolved
                              </button>
                            
                          </div>
                        </div>
                        {report.status === "Resolved" && report.update && (
                          <div className="mt-2 p-2 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-md">
                            <p className="text-xs text-success-800 dark:text-success-300">
                              <strong>Resolution:</strong> {report.update}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Contact Information */}
                  <div className="space-y-3">
                    {/* Tourist Contact */}
                    <div className="bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-600 rounded-lg p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        {/* <UserIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" /> */}
                        <h5 className="font-medium text-gray-900 dark:text-white text-xs">
                          Tourist
                        </h5>
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 border border-gray-200 dark:border-secondary-600">
                            <UserCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-xs truncate">
                              {report.touristDetails?.first_name && report.touristDetails?.last_name 
                                ? `${report.touristDetails.first_name} ${report.touristDetails.last_name}`
                                : "Unknown Tourist"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate">
                              {report.touristDetails?.email || report.email || "No email provided"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleContact("email", report.touristDetails || {})}
                          disabled={!report.touristDetails?.email && !report.email}
                          className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        >
                          <EnvelopeIcon className="h-3 w-3 mr-1" />
                          Email
                        </button>
                      </div>
                    </div>

                   

                    {/* Driver Contact */}
                    <div className="bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-600 rounded-lg p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        {/* <TruckIcon className="h-3 w-3 text-warning-600 dark:text-warning-400" /> */}
                        <h5 className="font-medium text-gray-900 dark:text-white text-xs">
                          Driver
                        </h5>
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-warning-100 dark:bg-warning-900/20 border border-gray-200 dark:border-secondary-600">
                            <TruckIcon className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-xs truncate">
                              {report.tripDetails?.driver?.first_name && report.tripDetails?.driver?.last_name 
                                ? `${report.tripDetails.driver.first_name} ${report.tripDetails.driver.last_name}`
                                : "No Driver Assigned"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate">
                              {report.tripDetails?.driver?.email || "No email provided"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate">
                              {report.tripDetails?.driver?.emergency_contact_number || "No phone provided"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleContact("email", report.tripDetails?.driver || {})}
                          disabled={!report.tripDetails?.driver?.email}
                          className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        >
                          <EnvelopeIcon className="h-3 w-3 mr-1" />
                          Email
                        </button>
                      </div>
                    </div>

                    {/* Guide Contact */}
                    <div className="bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-600 rounded-lg p-2">
                      <div className="flex items-center space-x-1 mb-1">
                        {/* <UserIcon className="h-3 w-3 text-primary-600 dark:text-primary-400" /> */}
                        <h5 className="font-medium text-gray-900 dark:text-white text-xs">
                          Guide
                        </h5>
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20 border border-gray-200 dark:border-secondary-600">
                            <MapIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-xs truncate">
                              {report.tripDetails?.guide?.first_name && report.tripDetails?.guide?.last_name 
                                ? `${report.tripDetails.guide.first_name} ${report.tripDetails.guide.last_name}`
                                : "No Guide Assigned"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate">
                              {report.tripDetails?.guide?.email || "No email provided"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate">
                              {report.tripDetails?.guide?.emergency_contact_number || "No phone provided"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleContact("email", report.tripDetails?.guide || {})}
                          disabled={!report.tripDetails?.guide?.email}
                          className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        >
                          <EnvelopeIcon className="h-3 w-3 mr-1" />
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default LostItemTracker;

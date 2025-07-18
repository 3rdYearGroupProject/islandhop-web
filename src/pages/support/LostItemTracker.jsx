import React, { useState } from "react";
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
} from "@heroicons/react/24/outline";

const LostItemTracker = () => {
  const [reports, setReports] = useState([
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
    {
      id: "LI-20250620-002",
      date: "2025-06-20",
      time: "16:45",
      item: "iPhone 13",
      desc: "Tourist lost phone during city tour. Suspected left in the van.",
      priority: "High",
      location: "Colombo City Tour",
      tourist: {
        name: "Ruwan Silva",
        avatar: "https://randomuser.me/api/portraits/men/23.jpg",
        email: "ruwan.silva@email.com",
        phone: "+94 76 987 6543",
      },
      driver: {
        name: "Saman Jayasuriya",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        email: "saman.j@email.com",
        phone: "+94 77 555 1234",
      },
      status: "Unresolved",
      update: "",
    },
    {
      id: "LI-20250619-003",
      date: "2025-06-19",
      time: "12:15",
      item: "Blue Suitcase",
      desc: "Forgotten in hotel lobby, guide last seen with item.",
      priority: "Medium",
      location: "Grand Hotel Colombo",
      tourist: {
        name: "Ishara Perera",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        email: "ishara.p@email.com",
        phone: "+94 71 222 3344",
      },
      driver: null,
      guide: {
        name: "Dilani Fernando",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
        email: "dilani.f@email.com",
        phone: "+94 77 888 9999",
      },
      status: "Resolved",
      update: "Suitcase returned to tourist on 2025-06-20.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statusOptions = ["Ongoing", "Resolved", "Unresolved"];
  const filterOptions = ["All", "Ongoing", "Resolved", "Unresolved"];

  // Filter reports based on search and status
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tourist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get statistics
  const stats = {
    total: reports.length,
    ongoing: reports.filter((r) => r.status === "Ongoing").length,
    resolved: reports.filter((r) => r.status === "Resolved").length,
    unresolved: reports.filter((r) => r.status === "Unresolved").length,
  };

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

  const handleStatusChange = (idx, newStatus) => {
    setReports(
      reports.map((report, index) =>
        index === idx ? { ...report, status: newStatus } : report
      )
    );
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

  const handleSaveUpdate = (idx) => {
    alert("Update saved successfully!");
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
                  {stats.total}
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
                  Ongoing
                </p>
                <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                  {stats.ongoing}
                </p>
              </div>
              <div className="p-3 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
                <ClockIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
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
                  {stats.resolved}
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
                  {stats.unresolved}
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
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
                        {report.id}
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

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Item Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {report.item}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {report.desc}
                      </p>
                      {report.location && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <TruckIcon className="h-4 w-4" />
                          <span>Location: {report.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Management */}
                    <div className="bg-gray-50 dark:bg-secondary-700 rounded-lg p-4">
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Update Status:
                        </label>
                        <select
                          value={report.status}
                          onChange={(e) =>
                            handleStatusChange(idx, e.target.value)
                          }
                          className="px-3 py-1 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Update Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Progress Notes
                        </label>
                        <div className="flex space-x-3">
                          <textarea
                            value={report.update}
                            onChange={(e) => handleUpdate(idx, e.target.value)}
                            placeholder="Add update about the lost item status..."
                            rows={3}
                            className="flex-1 rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
                          />
                          <button
                            onClick={() => handleSaveUpdate(idx)}
                            disabled={!report.update.trim()}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                          >
                            Save Update
                          </button>
                        </div>
                        {report.status === "Resolved" && report.update && (
                          <div className="mt-3 p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
                            <p className="text-sm text-success-800 dark:text-success-300">
                              <strong>Resolution:</strong> {report.update}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    {/* Tourist Contact */}
                    <div className="bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-600 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <UserIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          Tourist
                        </h5>
                      </div>
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={report.tourist.avatar}
                          alt={report.tourist.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {report.tourist.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {report.tourist.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {report.tourist.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleContact("phone", report.tourist)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                        >
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          Call
                        </button>
                        <button
                          onClick={() => handleContact("email", report.tourist)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <EnvelopeIcon className="h-3 w-3 mr-1" />
                          Email
                        </button>
                      </div>
                    </div>

                    {/* Driver/Guide Contact */}
                    {(report.driver || report.guide) && (
                      <div className="bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-600 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <TruckIcon className="h-4 w-4 text-warning-600 dark:text-warning-400" />
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {report.driver ? "Driver" : "Guide"}
                          </h5>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={(report.driver || report.guide).avatar}
                            alt={(report.driver || report.guide).name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {(report.driver || report.guide).name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(report.driver || report.guide).email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(report.driver || report.guide).phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleContact(
                                "phone",
                                report.driver || report.guide
                              )
                            }
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-warning-600 hover:bg-warning-700 transition-colors"
                          >
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            Call
                          </button>
                          <button
                            onClick={() =>
                              handleContact(
                                "email",
                                report.driver || report.guide
                              )
                            }
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg border border-warning-600 text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-colors"
                          >
                            <EnvelopeIcon className="h-3 w-3 mr-1" />
                            Email
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LostItemTracker;

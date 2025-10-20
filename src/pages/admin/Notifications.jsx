import React, { useState, useEffect } from "react";
import {
  BellIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ServerIcon,
  ShieldExclamationIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    priority: "all",
    search: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // Simulate API call - no notifications available
    setTimeout(() => {
      setNotifications([]);
      setFilteredNotifications([]);
      setLoading(false);
    }, 800);
  }, []);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications.filter((notification) => {
      const matchesSearch =
        notification.title
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        notification.message
          .toLowerCase()
          .includes(filters.search.toLowerCase());
      const matchesType =
        filters.type === "all" || notification.type === filters.type;
      const matchesStatus =
        filters.status === "all" || notification.status === filters.status;
      const matchesPriority =
        filters.priority === "all" ||
        notification.priority === filters.priority;

      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredNotifications(filtered);
  }, [notifications, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const getNotificationIcon = (type, priority) => {
    const iconClass = `h-6 w-6 ${
      priority === "critical"
        ? "text-danger-600"
        : priority === "high"
        ? "text-warning-600"
        : priority === "medium"
        ? "text-info-600"
        : "text-success-600"
    }`;

    switch (type) {
      case "security":
        return <ShieldExclamationIcon className={iconClass} />;
      case "performance":
        return <ExclamationTriangleIcon className={iconClass} />;
      case "system":
        return <InformationCircleIcon className={iconClass} />;
      case "maintenance":
        return <ClockIcon className={iconClass} />;
      case "backup":
        return <ServerIcon className={iconClass} />;
      case "integration":
        return <ExclamationTriangleIcon className={iconClass} />;
      case "update":
        return <CheckCircleIcon className={iconClass} />;
      default:
        return <BellIcon className={iconClass} />;
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical:
        "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300",
      high: "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300",
      medium:
        "bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300",
      low: "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
    };
    return badges[priority] || badges.low;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active:
        "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300",
      resolved:
        "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
      investigating:
        "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300",
      scheduled:
        "bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300",
      mitigated:
        "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300",
      completed:
        "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
    };
    return badges[status] || badges.active;
  };

  const getTypeBadge = (type) => {
    const badges = {
      system:
        "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300",
      maintenance:
        "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300",
      performance:
        "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300",
      security:
        "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300",
      integration:
        "bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300",
      backup:
        "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
      update:
        "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300",
    };
    return badges[type] || badges.system;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-secondary-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-secondary-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 dark:bg-secondary-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                System Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor system alerts, maintenance notices, and important
                updates
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Alerts
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter((n) => n.status === "active").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900">
                {
                  notifications.filter(
                    (n) => n.priority === "critical" || n.priority === "high"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                High Priority
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter((n) => n.status === "resolved").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Resolved
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="system">System</option>
              <option value="security">Security</option>
              <option value="performance">Performance</option>
              <option value="maintenance">Maintenance</option>
              <option value="backup">Backup</option>
              <option value="integration">Integration</option>
              <option value="update">Update</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="scheduled">Scheduled</option>
              <option value="mitigated">Mitigated</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredNotifications.length} of {notifications.length}{" "}
            notifications
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-12 text-center">
              <BellIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                There are no system notifications at this time. Check back later
                for updates.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 transition-all hover:shadow-md ${
                  notification.priority === "critical"
                    ? "border-l-4 border-l-danger-500"
                    : notification.priority === "high"
                    ? "border-l-4 border-l-warning-500"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-secondary-700">
                    {getNotificationIcon(
                      notification.type,
                      notification.priority
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {notification.message}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                            notification.priority
                          )}`}
                        >
                          {notification.priority}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            notification.status
                          )}`}
                        >
                          {notification.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(
                            notification.type
                          )}`}
                        >
                          {notification.type}
                        </span>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Affected: {notification.affectedServices.join(", ")}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        <button
                          onClick={() => handleViewDetails(notification)}
                          className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Modal */}
        {showModal && selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-secondary-700">
                    {getNotificationIcon(
                      selectedNotification.type,
                      selectedNotification.priority
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {selectedNotification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                          selectedNotification.priority
                        )}`}
                      >
                        {selectedNotification.priority}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          selectedNotification.status
                        )}`}
                      >
                        {selectedNotification.status}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(
                          selectedNotification.type
                        )}`}
                      >
                        {selectedNotification.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Message
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedNotification.message}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Details
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedNotification.details}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Affected Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotification.affectedServices.map(
                      (service, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 text-sm rounded"
                        >
                          {service}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Timestamp
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedNotification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

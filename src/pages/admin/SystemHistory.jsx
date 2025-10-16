import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebase";
import {
  ClockIcon,
  UserIcon,
  CogIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const SystemHistory = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments");
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [auditTrails, setAuditTrails] = useState([]);
  const [changeHistory, setChangeHistory] = useState([]);
  const [systemEvents, setSystemEvents] = useState([]);
  const [authToken, setAuthToken] = useState("");
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: "7days",
    severity: "all",
    category: "all",
    user: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for payment logs
  const mockPaymentLogs = [
    {
      id: 1,
      timestamp: "2024-06-25T16:45:00Z",
      transactionId: "TXN_2024062516450001",
      user: "john.doe@islandhop.com",
      amount: 299.99,
      currency: "USD",
      paymentMethod: "Credit Card",
      cardLast4: "4532",
      status: "completed",
      type: "Trip Booking",
      tripId: "TRIP_123456",
      gatewayResponse: "APPROVED",
      processingFee: 8.99,
    },
    {
      id: 2,
      timestamp: "2024-06-25T16:30:00Z",
      transactionId: "TXN_2024062516300002",
      user: "sarah.wilson@islandhop.com",
      amount: 150.0,
      currency: "USD",
      paymentMethod: "PayPal",
      cardLast4: null,
      status: "completed",
      type: "Pool Contribution",
      tripId: "POOL_789012",
      gatewayResponse: "SUCCESS",
      processingFee: 4.5,
    },
    {
      id: 3,
      timestamp: "2024-06-25T16:15:00Z",
      transactionId: "TXN_2024062516150003",
      user: "mike.johnson@islandhop.com",
      amount: 450.0,
      currency: "USD",
      paymentMethod: "Credit Card",
      cardLast4: "8765",
      status: "failed",
      type: "Trip Booking",
      tripId: "TRIP_654321",
      gatewayResponse: "DECLINED - Insufficient Funds",
      processingFee: 0.0,
    },
    {
      id: 4,
      timestamp: "2024-06-25T15:45:00Z",
      transactionId: "TXN_2024062515450004",
      user: "emma.davis@islandhop.com",
      amount: 75.0,
      currency: "USD",
      paymentMethod: "Credit Card",
      cardLast4: "9876",
      status: "refunded",
      type: "Cancellation Refund",
      tripId: "TRIP_112233",
      gatewayResponse: "REFUND PROCESSED",
      processingFee: -2.25,
    },
    {
      id: 5,
      timestamp: "2024-06-25T15:20:00Z",
      transactionId: "TXN_2024062515200005",
      user: "alex.brown@islandhop.com",
      amount: 199.99,
      currency: "USD",
      paymentMethod: "Debit Card",
      cardLast4: "1234",
      status: "pending",
      type: "Trip Booking",
      tripId: "TRIP_445566",
      gatewayResponse: "PENDING VERIFICATION",
      processingFee: 5.99,
    },
  ];

  // Mock data for audit trails
  const mockAuditTrails = [
    {
      id: 1,
      timestamp: "2024-06-25T14:30:00Z",
      user: "admin@islandhop.com",
      resource: "User Account",
      action: "Modified",
      resourceId: "user_123",
      changes: [
        { field: "status", oldValue: "inactive", newValue: "active" },
        { field: "role", oldValue: "user", newValue: "guide" },
      ],
    },
    {
      id: 2,
      timestamp: "2024-06-25T14:15:00Z",
      user: "admin@islandhop.com",
      resource: "System Settings",
      action: "Updated",
      resourceId: "settings_general",
      changes: [
        { field: "maxUsers", oldValue: "500", newValue: "1000" },
        { field: "sessionTimeout", oldValue: "60", newValue: "120" },
      ],
    },
    {
      id: 3,
      timestamp: "2024-06-25T13:45:00Z",
      user: "support@islandhop.com",
      resource: "Review",
      action: "Deleted",
      resourceId: "review_456",
      changes: [{ field: "status", oldValue: "reported", newValue: "deleted" }],
    },
  ];

  // Mock data for change history
  const mockChangeHistory = [
    {
      id: 1,
      timestamp: "2024-06-25T12:00:00Z",
      version: "v2.1.4",
      deployedBy: "deploy-bot",
      changes: "Bug fixes and performance improvements",
      rollbackAvailable: true,
      deploymentTime: "5 minutes",
      status: "completed",
    },
    {
      id: 2,
      timestamp: "2024-06-24T18:30:00Z",
      version: "v2.1.3",
      deployedBy: "admin@islandhop.com",
      changes: "New user authentication features",
      rollbackAvailable: true,
      deploymentTime: "12 minutes",
      status: "completed",
    },
    {
      id: 3,
      timestamp: "2024-06-23T16:15:00Z",
      version: "v2.1.2",
      deployedBy: "deploy-bot",
      changes: "Security patches and UI updates",
      rollbackAvailable: false,
      deploymentTime: "8 minutes",
      status: "completed",
    },
  ];

  // Mock data for system events
  const mockSystemEvents = [
    {
      id: 1,
      timestamp: "2024-06-25T15:45:00Z",
      type: "error",
      severity: "high",
      module: "Authentication Service",
      message: "Database connection timeout",
      details: "Connection to primary database timed out after 30 seconds",
      status: "resolved",
    },
    {
      id: 2,
      timestamp: "2024-06-25T14:20:00Z",
      type: "warning",
      severity: "medium",
      module: "Payment Gateway",
      message: "High transaction volume detected",
      details: "Transaction volume exceeded 150% of normal levels",
      status: "info",
    },
    {
      id: 3,
      timestamp: "2024-06-25T13:10:00Z",
      type: "info",
      severity: "low",
      module: "Backup Service",
      message: "Scheduled backup completed",
      details: "Daily backup completed successfully in 45 minutes",
      status: "completed",
    },
  ];

  // Get Firebase auth token
  useEffect(() => {
    const getToken = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setAuthToken(token);
        } catch (err) {
          console.error("Error getting auth token:", err);
          setError("Failed to get authentication token");
          setAuthToken("");
        }
      } else {
        setError("No authenticated user found");
        setLoading(false);
      }
    };
    getToken();
  }, []);

  // Fetch payment logs from backend
  const fetchPaymentLogs = async () => {
    if (!authToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "http://localhost:8070/api/admin/logs/all",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment logs response:", response.data);

      if (response.data && response.data.data) {
        // Transform backend data to match frontend format
        const transformedLogs = response.data.data.map((log, index) => ({
          id: log.id || index + 1,
          timestamp: log.timestamp || log.createdAt || new Date().toISOString(),
          transactionId:
            log.transactionId || log.transaction_id || `TXN_${log.id}`,
          user: log.user || log.userEmail || "Unknown User",
          amount: log.amount || 0,
          currency: log.currency || "USD",
          paymentMethod: log.paymentMethod || log.payment_method || "Unknown",
          cardLast4: log.cardLast4 || log.card_last4 || null,
          status: log.status || "unknown",
          type: log.type || log.transactionType || "Payment",
          tripId: log.tripId || log.trip_id || "N/A",
          gatewayResponse: log.gatewayResponse || log.gateway_response || "N/A",
          processingFee: log.processingFee || log.processing_fee || 0,
        }));

        setPaymentLogs(transformedLogs);
      } else {
        // If no data, use mock data as fallback
        console.warn("No payment logs data received, using mock data");
        setPaymentLogs(mockPaymentLogs);
      }
    } catch (error) {
      console.error("Error fetching payment logs:", error);
      setError("Failed to fetch payment logs. Using sample data.");
      // Use mock data as fallback on error
      setPaymentLogs(mockPaymentLogs);
    } finally {
      setLoading(false);
    }
  };

  // Load mock data for other sections (audit trails, change history, system events)
  const loadMockData = () => {
    setAuditTrails(mockAuditTrails);
    setChangeHistory(mockChangeHistory);
    setSystemEvents(mockSystemEvents);
  };

  // Fetch data when auth token is available
  useEffect(() => {
    if (authToken) {
      fetchPaymentLogs();
      loadMockData();
    }
  }, [authToken]);

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

  const getStatusBadge = (status) => {
    const badges = {
      success:
        "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
      failed:
        "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300",
      warning:
        "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300",
      info: "bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300",
      resolved:
        "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
      completed:
        "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
    };
    return badges[status] || badges.info;
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      critical:
        "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300",
      high: "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300",
      medium:
        "bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300",
      low: "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
    };
    return badges[severity] || badges.low;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
                  className="h-20 bg-gray-200 dark:bg-secondary-700 rounded"
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
                System History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View system activity logs
              </p>
              {error && (
                <p className="text-warning-600 dark:text-warning-400 text-sm mt-2">
                  ⚠️ {error}
                </p>
              )}
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Export History
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search history..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            >
              <option value="1day">Last 24 hours</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.severity}
              onChange={(e) => handleFilterChange("severity", e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="authentication">Authentication</option>
              <option value="user_management">User Management</option>
              <option value="system">System</option>
              <option value="security">Security</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.user}
              onChange={(e) => handleFilterChange("user", e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="admin">Admin</option>
              <option value="system">System</option>
              <option value="support">Support</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "payments", label: "Payment Logs", icon: CreditCardIcon },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "payments" && (
            <div className="space-y-4">
              {paymentLogs.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-info-100 dark:bg-info-900/20 rounded-lg">
                        <CreditCardIcon className="h-5 w-5 text-info-600 dark:text-info-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {payment.type}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${payment.amount.toFixed(2)} {payment.currency}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          Transaction ID: {payment.transactionId}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong>User:</strong> {payment.user}
                            </div>
                            <div>
                              <strong>Payment Method:</strong>{" "}
                              {payment.paymentMethod}
                            </div>
                            {payment.cardLast4 && (
                              <div>
                                <strong>Card:</strong> •••• {payment.cardLast4}
                              </div>
                            )}
                            <div>
                              <strong>Processing Fee:</strong> $
                              {Math.abs(payment.processingFee).toFixed(2)}
                            </div>
                            <div>
                              <strong>Trip/Pool ID:</strong> {payment.tripId}
                            </div>
                            <div>
                              <strong>Gateway Response:</strong>{" "}
                              {payment.gatewayResponse}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(payment.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4">
              {auditTrails.map((audit) => (
                <div
                  key={audit.id}
                  className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
                        <DocumentTextIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {audit.action} {audit.resource}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span>
                            <strong>User:</strong> {audit.user}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            <strong>Resource ID:</strong> {audit.resourceId}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Changes:
                          </h4>
                          {audit.changes.map((change, index) => (
                            <div
                              key={index}
                              className="pl-4 border-l-2 border-gray-200 dark:border-secondary-600"
                            >
                              <div className="text-sm">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {change.field}:
                                </span>
                                <span className="text-danger-600 dark:text-danger-400 mx-1">
                                  "{change.oldValue}"
                                </span>
                                →
                                <span className="text-success-600 dark:text-success-400 mx-1">
                                  "{change.newValue}"
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(audit.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "changes" && (
            <div className="space-y-4">
              {changeHistory.map((change) => (
                <div
                  key={change.id}
                  className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-success-100 dark:bg-success-900/20 rounded-lg">
                        <ArrowPathIcon className="h-5 w-5 text-success-600 dark:text-success-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {change.version}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              change.status
                            )}`}
                          >
                            {change.status}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              change.rollbackAvailable
                                ? "bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300"
                                : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                            }`}
                          >
                            {change.rollbackAvailable
                              ? "Rollback Available"
                              : "No Rollback"}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {change.changes}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4">
                          <span>
                            <strong>Deployed by:</strong> {change.deployedBy}
                          </span>
                          <span>
                            <strong>Duration:</strong> {change.deploymentTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(change.timestamp)}
                      </span>
                      {change.rollbackAvailable && (
                        <button className="px-3 py-1 bg-warning-600 text-white text-sm rounded hover:bg-warning-700 transition-colors">
                          Rollback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-4">
              {systemEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-danger-100 dark:bg-danger-900/20 rounded-lg">
                        <ExclamationTriangleIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {event.message}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityBadge(
                              event.severity
                            )}`}
                          >
                            {event.severity}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {event.details}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            <strong>Module:</strong> {event.module}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            <strong>Type:</strong> {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(event.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemHistory;

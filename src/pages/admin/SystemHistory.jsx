import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ClockIcon,
  UserIcon,
  CogIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const SystemHistory = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments");
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [auditTrails, setAuditTrails] = useState([]);
  const [changeHistory, setChangeHistory] = useState([]);
  const [systemEvents, setSystemEvents] = useState([]);
  const [authToken, setAuthToken] = useState("");
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: "all",
    status: "all",
    logType: "all",
    minAmount: "",
    maxAmount: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

      console.log("Payment logs response:", response.data.data.logs);

      if (response.data && response.data.data.logs) {
        // Transform backend data to match frontend format
        const transformedLogs = response.data.data.logs.map((log, index) => ({
          id: log.id || index + 1,
          timestamp: log.timestamp || log.createdAt || new Date().toISOString(),
          transactionId: log._id || log.transaction_id || `TXN_${log.id}`,
          user: log.user || log.driverEmail || "Unknown User",
          amount: log.cost || 0,
          currency: log.currency || "LKR",
          paymentMethod: log.paymentMethod || log.payment_method || "Online",
          cardLast4: log.cardLast4 || log.card_last4 || null,
          status: log.status || " Card",
          logType: log.logType || log.transactionType || "Payment",
          tripId: log.tripId || log.trip_id || "N/A",
          gatewayResponse: log.gatewayResponse || log.gateway_response || "N/A",
          processingFee: log.processingFee || log.processing_fee || 0,
          updatedAt: log.updatedAt || "date error",
        }));

        setPaymentLogs(transformedLogs);
      } else {
        // If no data, use mock data as fallback
        console.warn("No payment logs data received, using mock data");
        setPaymentLogs(mockPaymentLogs);
      }
    } catch (error) {
      console.error("Error fetching payment logs:", error);
      console.log("tharushga");
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

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...paymentLogs];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.transactionId?.toLowerCase().includes(query) ||
          log.user?.toLowerCase().includes(query) ||
          log.tripId?.toLowerCase().includes(query) ||
          log.logType?.toLowerCase().includes(query) ||
          log.status?.toLowerCase().includes(query)
      );
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const ranges = {
        "1day": 1,
        "7days": 7,
        "30days": 30,
        "90days": 90,
      };
      const days = ranges[filters.dateRange];
      if (days) {
        const cutoffDate = new Date(now.setDate(now.getDate() - days));
        filtered = filtered.filter(
          (log) => new Date(log.timestamp) >= cutoffDate
        );
      }
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((log) => log.status === filters.status);
    }

    // Apply log type filter
    if (filters.logType !== "all") {
      filtered = filtered.filter((log) => log.logType === filters.logType);
    }

    // Apply amount range filters
    if (filters.minAmount !== "") {
      const minAmount = parseFloat(filters.minAmount);
      if (!isNaN(minAmount)) {
        filtered = filtered.filter((log) => log.amount >= minAmount);
      }
    }

    if (filters.maxAmount !== "") {
      const maxAmount = parseFloat(filters.maxAmount);
      if (!isNaN(maxAmount)) {
        filtered = filtered.filter((log) => log.amount <= maxAmount);
      }
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [paymentLogs, searchQuery, filters]);

  // Get unique values for filter dropdowns
  const uniqueStatuses = [
    ...new Set(paymentLogs.map((log) => log.status).filter(Boolean)),
  ];
  const uniqueLogTypes = [
    ...new Set(paymentLogs.map((log) => log.logType).filter(Boolean)),
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Export payment logs to PDF
  const exportToPDF = () => {
    try {
      // Use filtered logs for export
      const logsToExport = filteredLogs.length > 0 ? filteredLogs : paymentLogs;
      
      // Create new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("IslandHop Payment History Report", 14, 22);

      // Add generation date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      // Add filter information if filters are applied
      if (filteredLogs.length < paymentLogs.length) {
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(
          `Filtered Results (${filteredLogs.length} of ${paymentLogs.length} total records)`,
          14,
          36
        );
      }

      // Add summary statistics
      const totalTransactions = logsToExport.length;
      const completedTransactions = logsToExport.filter(
        (log) => log.status === "completed"
      ).length;
      const totalAmount = logsToExport.reduce((sum, log) => sum + log.amount, 0);

      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text("Summary Statistics:", 14, filteredLogs.length < paymentLogs.length ? 44 : 40);
      doc.setFontSize(10);
      doc.text(`Total Transactions: ${totalTransactions}`, 14, filteredLogs.length < paymentLogs.length ? 51 : 47);
      doc.text(`Completed Transactions: ${completedTransactions}`, 14, filteredLogs.length < paymentLogs.length ? 56 : 52);
      doc.text(
        `Total Amount: LKR ${totalAmount.toLocaleString()}`,
        14,
        filteredLogs.length < paymentLogs.length ? 61 : 57
      );

      // Prepare table data
      const tableData = logsToExport.map((log) => [
        new Date(log.timestamp).toLocaleDateString(),
        log.transactionId.substring(0, 20) + "...",
        log.user.substring(0, 25) + "...",
        log.logType || "N/A",
        `${log.currency} ${log.amount.toLocaleString()}`,
        log.status,
        log.tripId,
      ]);

      // Add table
      autoTable(doc, {
        startY: filteredLogs.length < paymentLogs.length ? 69 : 65,
        head: [
          [
            "Date",
            "Transaction ID",
            "User",
            "Type",
            "Amount",
            "Status",
            "Trip ID",
          ],
        ],
        body: tableData,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [59, 130, 246], // Primary blue color
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 },
        },
      });

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
        doc.text(
          "IslandHop - Confidential",
          14,
          doc.internal.pageSize.getHeight() - 10
        );
      }

      // Save the PDF
      doc.save(
        `IslandHop_Payment_History_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      console.log("PDF export successful");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
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
            <button
              onClick={exportToPDF}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              title={`Export ${filteredLogs.length} ${filteredLogs.length === 1 ? 'record' : 'records'}`}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export {filteredLogs.length > 0 && `(${filteredLogs.length})`}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, users, trip IDs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Date Range Filter */}
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="1day">Last 24 hours</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* Log Type Filter */}
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.logType}
              onChange={(e) => handleFilterChange("logType", e.target.value)}
            >
              <option value="all">All Types</option>
              {uniqueLogTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setFilters({
                  dateRange: "all",
                  status: "all",
                  logType: "all",
                  minAmount: "",
                  maxAmount: "",
                });
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Amount Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Amount
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange("minAmount", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Amount
              </label>
              <input
                type="number"
                placeholder="999999"
                className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-secondary-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{currentLogs.length}</span> of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{filteredLogs.length}</span> results
              {filteredLogs.length !== paymentLogs.length && (
                <span className="text-primary-600 dark:text-primary-400">
                  {" "}(filtered from {paymentLogs.length} total)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Search and Filters - OLD VERSION REMOVED */}
        {/* <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 mb-6">
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
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Statuses</option>
            </select>
          </div>
        </div> */}

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
              {currentLogs.length > 0 ? (
                <>
                  {currentLogs.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div
                          className={`p-2 rounded-lg ${
                            payment.status === "completed"
                              ? "bg-success-100 dark:bg-success-900/20"
                              : "bg-warning-100 dark:bg-warning-900/20"
                          }`}
                        >
                          <CreditCardIcon
                            className={`h-5 w-5 ${
                              payment.status === "completed"
                                ? "text-success-600 dark:text-success-400"
                                : "text-warning-600 dark:text-warning-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
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
                              {payment.currency}{" "}
                              {payment.amount.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                            Transaction ID:{" "}
                            <span className="font-mono">
                              {payment.transactionId}
                            </span>
                          </p>
                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-start">
                                <strong className="min-w-[120px]">
                                  User Email:
                                </strong>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {payment.user}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <strong className="min-w-[120px]">
                                  Trip ID:
                                </strong>
                                <span className="text-gray-700 dark:text-gray-300 font-mono">
                                  {payment.tripId}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <strong className="min-w-[120px]">
                                  Log Type:
                                </strong>
                                <span className="text-gray-700 dark:text-gray-300 capitalize">
                                  {payment.logType}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <strong className="min-w-[120px]">
                                  Payment Status:
                                </strong>
                                <span
                                  className={`font-semibold ${
                                    payment.paid === 1
                                      ? "text-success-600 dark:text-success-400"
                                      : "text-warning-600 dark:text-warning-400"
                                  }`}
                                >
                                  {"Paid"}
                                </span>
                              </div>
                              {payment.evidence && (
                                <div className="flex items-start md:col-span-2">
                                  <strong className="min-w-[120px]">
                                    Evidence:
                                  </strong>
                                  <span className="text-primary-600 dark:text-primary-400 font-mono">
                                    {payment.evidence}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-start">
                                <strong className="min-w-[120px]">
                                  Created:
                                </strong>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {new Date(payment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <strong className="min-w-[120px]">
                                  Updated:
                                </strong>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {new Date(payment.updatedAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                          {formatTimeAgo(payment.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {filteredLogs.length > itemsPerPage && (
                  <div className="mt-6 flex items-center justify-between bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredLogs.length)} of{" "}
                      {filteredLogs.length} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-secondary-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            // Show first page, last page, current page, and pages around current
                            return (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            );
                          })
                          .map((page, index, array) => {
                            // Add ellipsis
                            const prevPage = array[index - 1];
                            const showEllipsis = prevPage && page - prevPage > 1;
                            
                            return (
                              <React.Fragment key={page}>
                                {showEllipsis && (
                                  <span className="px-3 py-1 text-gray-500">...</span>
                                )}
                                <button
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === page
                                      ? "bg-primary-600 text-white"
                                      : "border border-gray-300 dark:border-secondary-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700"
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            );
                          })}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-secondary-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
              ) : (
                <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-12 text-center">
                  <CreditCardIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Payment Logs Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    There are no payment logs to display at this time.
                  </p>
                </div>
              )}
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

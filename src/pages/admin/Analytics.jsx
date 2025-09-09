import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  GlobeAltIcon,
  TruckIcon,
  UserIcon,
  BuildingOfficeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [selectedUser, setSelectedUser] = useState("user1");
  const [leftMetric, setLeftMetric] = useState("bookings");
  const [rightMetric, setRightMetric] = useState("users");
  const [authToken, setAuthToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    conversionRate: 0,
    monthlyRevenue: [],
    serviceProviders: [],
  });

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
          setAuthToken("");
        }
      }
    };
    getToken();
  }, []);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    if (!authToken) return;

    setLoading(true);
    try {
      // Fetch total user count
      const userCountResponse = await axios.get(
        "http://localhost:8070/api/admin/analytics/users/count",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch monthly revenue data (which includes bookings, revenue, conversion rate)
      const revenueResponse = await axios.get(
        "http://localhost:8070/api/admin/analytics/revenue/monthly",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User count response:", userCountResponse.data);
      console.log("Revenue response:", revenueResponse.data);
      console.log(
        "Service providers response:",
        userCountResponse.data.data.breakdown
      );

      // Update API data state
      setApiData({
        totalUsers:
          userCountResponse.data.data.totalUsers || userCountResponse.data || 0,
        totalBookings:
          revenueResponse.data.data.yearlyTotal.totalPaidTrips || 0,
        totalRevenue: revenueResponse.data.data.yearlyTotal.totalRevenue || 0,
        conversionRate:
          revenueResponse.data.data.yearlyTotal.conversionRate || 0,
        monthlyRevenue:
          revenueResponse.data.data.yearlyTotal.averageAmount || [],
        serviceProviders:
          userCountResponse.data.data.breakdown || userCountResponse.data || [],
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      // Keep mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when auth token is available
  useEffect(() => {
    if (authToken) {
      fetchAnalyticsData();
    }
  }, [authToken]);

  // Mock data for different users
  const userData = {
    user1: {
      bookings: [65, 78, 90, 105, 128, 142, 168, 185, 201, 225, 248, 270],
      users: [45, 52, 68, 73, 89, 95, 112, 128, 145, 162, 178, 195],
      revenue: [
        12000, 15600, 18900, 22300, 27800, 31200, 36800, 42100, 47300, 53200,
        58900, 64500,
      ],
      conversion: [2.1, 2.3, 2.5, 2.8, 3.1, 3.4, 3.7, 4.0, 4.2, 4.5, 4.8, 5.1],
    },
    user2: {
      bookings: [45, 62, 78, 95, 112, 138, 155, 172, 189, 205, 228, 245],
      users: [35, 48, 58, 68, 82, 98, 115, 132, 148, 165, 182, 200],
      revenue: [
        9800, 13200, 16800, 20400, 24600, 29200, 33800, 38400, 42900, 47600,
        52800, 57200,
      ],
      conversion: [1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.2, 3.5, 3.8, 4.0, 4.3, 4.6],
    },
    user3: {
      bookings: [85, 95, 110, 125, 142, 158, 175, 192, 210, 235, 258, 280],
      users: [55, 65, 78, 88, 102, 118, 135, 152, 170, 188, 205, 225],
      revenue: [
        15200, 18400, 22100, 26300, 31800, 36400, 42200, 47800, 53600, 59800,
        66200, 72800,
      ],
      conversion: [2.8, 3.0, 3.3, 3.6, 3.9, 4.2, 4.5, 4.8, 5.1, 5.4, 5.7, 6.0],
    },
  };

  // Metric labels and colors
  const metricConfig = {
    bookings: {
      label: "Total Bookings",
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    users: {
      label: "Active Users",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    revenue: {
      label: "Revenue ($)",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    conversion: {
      label: "Conversion Rate (%)",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: metricConfig[leftMetric].label,
        data: userData[selectedUser][leftMetric],
        borderColor: metricConfig[leftMetric].color,
        backgroundColor: metricConfig[leftMetric].bgColor,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y",
      },
      {
        label: metricConfig[rightMetric].label,
        data: userData[selectedUser][rightMetric],
        borderColor: metricConfig[rightMetric].color,
        backgroundColor: metricConfig[rightMetric].bgColor,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          color: "#374151",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };

  // Key metrics for the selected user - now using API data when available
  const currentData = userData[selectedUser];
  const keyMetrics = [
    {
      title: "Total Bookings",
      value: loading
        ? "Loading..."
        : apiData.totalBookings ||
          currentData.bookings[currentData.bookings.length - 1],
      change: "+12.5%",
      changeType: "positive",
      icon: ChartBarIcon,
      color: "primary",
    },
    {
      title: "Active Users",
      value: loading
        ? "Loading..."
        : apiData.totalUsers || currentData.users[currentData.users.length - 1],
      change: "+8.3%",
      changeType: "positive",
      icon: UsersIcon,
      color: "primary",
    },
    {
      title: "Revenue",
      value: loading
        ? "Loading..."
        : apiData.totalRevenue
        ? `$${(apiData.totalRevenue / 1000).toFixed(1)}k`
        : `$${(
            currentData.revenue[currentData.revenue.length - 1] / 1000
          ).toFixed(1)}k`,
      change: "+15.2%",
      changeType: "positive",
      icon: CurrencyDollarIcon,
      color: "primary",
    },
    {
      title: "Conversion Rate",
      value: loading
        ? "Loading..."
        : apiData.conversionRate
        ? `${apiData.conversionRate}%`
        : `${currentData.conversion[currentData.conversion.length - 1]}%`,
      change: "+2.1%",
      changeType: "positive",
      icon: ArrowTrendingUpIcon,
      color: "info",
    },
  ];

  const topDestinations = [
    { name: "Colombo", bookings: 245, percentage: 32 },
    { name: "Kandy", bookings: 189, percentage: 24 },
    { name: "Galle", bookings: 156, percentage: 20 },
    { name: "Nuwara Eliya", bookings: 123, percentage: 16 },
    { name: "Sigiriya", bookings: 98, percentage: 13 },
  ];

  const serviceProviders = loading
    ? [
        { type: "Loading...", count: "...", icon: TruckIcon, trend: "..." },
        { type: "Loading...", count: "...", icon: UserIcon, trend: "..." },
      ]
    : apiData.serviceProviders &&
      typeof apiData.serviceProviders === "object" &&
      !Array.isArray(apiData.serviceProviders)
    ? Object.entries(apiData.serviceProviders)
        .filter(([key]) =>
          ["driver", "guide", "admin", "support"].includes(key.toLowerCase())
        ) // Filter out tourist
        .map(([key, value]) => ({
          type: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
          count: value.count || 0,
          percentage: value.percentage || 0,
          icon: key.toLowerCase().includes("driver")
            ? TruckIcon
            : key.toLowerCase().includes("guide")
            ? UserIcon
            : key.toLowerCase().includes("admin")
            ? BuildingOfficeIcon
            : key.toLowerCase().includes("support")
            ? SparklesIcon
            : UserIcon,
          trend: value.percentage ? `${value.percentage.toFixed(1)}%` : "+0%", // Use percentage as trend
        }))
    : apiData.serviceProviders &&
      Array.isArray(apiData.serviceProviders) &&
      apiData.serviceProviders.length > 0
    ? apiData.serviceProviders.map((provider) => ({
        type: provider.type || provider.name || "Unknown",
        count: provider.count || provider.total || 0,
        icon:
          provider.type === "Drivers" || provider.name === "Drivers"
            ? TruckIcon
            : UserIcon,
        trend: provider.trend || `+${provider.growth || 0}`,
      }))
    : [
        { type: "Drivers", count: 156, icon: TruckIcon, trend: "+5" },
        { type: "Guides", count: 89, icon: UserIcon, trend: "+3" },
      ];

  const getMetricCardColor = (color) => {
    const colors = {
      primary:
        "border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700",
      success:
        "border-success-200 bg-success-50 dark:bg-success-900/20 dark:border-success-700",
      warning:
        "border-warning-200 bg-warning-50 dark:bg-warning-900/20 dark:border-warning-700",
      info: "border-info-200 bg-info-50 dark:bg-info-900/20 dark:border-info-700",
    };
    return colors[color] || colors.primary;
  };

  const getIconColor = (color) => {
    const colors = {
      primary: "text-primary-600 dark:text-primary-400",
      success: "text-success-600 dark:text-success-400",
      warning: "text-warning-600 dark:text-warning-400",
      info: "text-info-600 dark:text-info-400",
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor platform performance and user engagement
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
          {/* Main Chart - 4 columns wide */}
          <div className="lg:col-span-4 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Performance Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Track key metrics over time
                </p>
              </div>

              {/* User Selector */}
              <div className="flex space-x-2">
                {["user1", "user2", "user3"].map((user) => (
                  <button
                    key={user}
                    onClick={() => setSelectedUser(user)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedUser === user
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-secondary-600"
                    }`}
                  >
                    {user === "user1"
                      ? "Overall"
                      : user === "user2"
                      ? "Travelers"
                      : "Providers"}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Selectors */}
            <div className="flex space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Left Axis:
                </label>
                <select
                  value={leftMetric}
                  onChange={(e) => setLeftMetric(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-secondary-600 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                >
                  {Object.entries(metricConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Right Axis:
                </label>
                <select
                  value={rightMetric}
                  onChange={(e) => setRightMetric(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-secondary-600 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                >
                  {Object.entries(metricConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Loading analytics data...
                    </p>
                  </div>
                </div>
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Key Metrics - 2 columns wide */}
          <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Key Metrics
              </h3>
              <button
                onClick={fetchAnalyticsData}
                disabled={loading || !authToken}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {keyMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getMetricCardColor(
                      metric.color
                    )} transition-all hover:scale-105`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {metric.title}
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {metric.value}
                        </p>
                        <div className="flex items-center mt-1">
                          {metric.changeType === "positive" ? (
                            <ArrowTrendingUpIcon className="h-3 w-3 text-success-600 mr-1" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-3 w-3 text-danger-600 mr-1" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              metric.changeType === "positive"
                                ? "text-success-600 dark:text-success-400"
                                : "text-danger-600 dark:text-danger-400"
                            }`}
                          >
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-secondary-700">
                        <IconComponent
                          className={`h-5 w-5 ${getIconColor(metric.color)}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Destinations - 2 columns wide */}
          <div className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Top Destinations
            </h3>
            <div className="space-y-3">
              {topDestinations.map((destination, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {destination.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {destination.bookings}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-secondary-600 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${destination.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Providers - 2 columns wide */}
          <div className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Service Providers
            </h3>
            <div className="space-y-3">
              {serviceProviders.map((provider, index) => {
                const IconComponent = provider.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-secondary-600 rounded-lg">
                        <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.type}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {provider.count} registered
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-success-600 dark:text-success-400">
                      {provider.trend}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

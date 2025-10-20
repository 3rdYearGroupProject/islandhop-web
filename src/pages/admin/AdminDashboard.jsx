import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  PresentationChartBarIcon,
  ServerIcon,
  BellIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = ({ onPageChange }) => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState("Loading...");
  const [activeBookings, setActiveBookings] = useState("Loading...");
  const [revenue, setRevenue] = useState("Loading...");
  const [authToken, setAuthToken] = useState("");

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

  // Fetch total user count
  const fetchTotalUserCount = async () => {
    if (!authToken) return;

    try {
      const response = await fetch(
        "http://localhost:8070/api/admin/analytics/users/count",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Total user count response:", data);
        setTotalUsers(data.data.totalUsers.toString()); // Convert to string for display
      } else {
        console.error("Failed to fetch total user count:", response.status);
        setTotalUsers("N/A");
      }
    } catch (error) {
      console.error("Error fetching total user count:", error);
      setTotalUsers("Error");
    }
  };

  // Fetch revenue and bookings data
  const fetchRevenueAndBookings = async () => {
    if (!authToken) return;

    try {
      const response = await fetch(
        "http://localhost:8070/api/admin/analytics/revenue/monthly",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Revenue and bookings response:", data);

        // Extract active bookings and total revenue
        const totalBookings = data.data?.yearlyTotal?.totalTrips || 0;
        const totalRevenue = data.data?.yearlyTotal?.totalRevenue || 0;

        setActiveBookings(totalBookings.toLocaleString()); // Format with commas
        setRevenue(`LKR ${totalRevenue.toLocaleString()}`); // Format with currency
      } else {
        console.error("Failed to fetch revenue and bookings:", response.status);
        setActiveBookings("N/A");
        setRevenue("N/A");
      }
    } catch (error) {
      console.error("Error fetching revenue and bookings:", error);
      setActiveBookings("Error");
      setRevenue("Error");
    }
  };

  // Fetch user count when auth token is available
  useEffect(() => {
    if (authToken) {
      fetchTotalUserCount();
      fetchRevenueAndBookings(); // Also fetch revenue and bookings
    }
  }, [authToken]);

  // Dashboard stats data
  const dashboardStats = [
    {
      title: "Total Users",
      value: totalUsers,
      change: "+12%",
      changeType: "positive",
      icon: UsersIcon,
      color: "neutral",
    },
    {
      title: "Active Bookings",
      value: activeBookings,
      change: "+8%",
      changeType: "positive",
      icon: PresentationChartBarIcon,
      color: "neutral",
    },
    {
      title: "Total Transactions",
      value: revenue,
      change: "+15%",
      changeType: "positive",
      icon: ChartBarIcon,
      color: "neutral",
    },
  ];

  const quickActions = [
    {
      title: "User Accounts",
      description: "Manage user accounts and permissions",
      icon: UserGroupIcon,
      color: "primary",
      action: () => navigate("/admin/accounts"),
    },
    {
      title: "Analytics",
      description: "View detailed system analytics",
      icon: ChartBarIcon,
      color: "primary",
      action: () => navigate("/admin/analytics"),
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: CogIcon,
      color: "primary",
      action: () => navigate("/admin/settings"),
    },
    {
      title: "System Data",
      description: "View and manage system data",
      icon: ServerIcon,
      color: "primary",
      action: () => navigate("/admin/system-data"),
    },
    {
      title: "Notifications",
      description: "System notifications and alerts",
      icon: BellIcon,
      color: "primary",
      action: () => navigate("/admin/notifications"),
    },
    {
      title: "System History",
      description: "View audit logs and history",
      icon: ClockIcon,
      color: "primary",
      action: () => navigate("/admin/history"),
    },
  ];

  const getStatColor = (color) => {
    const colors = {
      primary:
        "border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700",
      success:
        "border-success-200 bg-success-50 dark:bg-success-900/20 dark:border-success-700",
      warning:
        "border-warning-200 bg-warning-50 dark:bg-warning-900/20 dark:border-warning-700",
      info: "border-info-200 bg-info-50 dark:bg-info-900/20 dark:border-info-700",
      danger:
        "border-danger-200 bg-danger-50 dark:bg-danger-900/20 dark:border-danger-700",
      neutral:
        "border-neutral-200 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700",
    };
    return colors[color] || colors.neutral;
  };

  const getIconColor = (color) => {
    const colors = {
      primary: "text-primary-600 dark:text-primary-400",
      success: "text-success-600 dark:text-success-400",
      warning: "text-warning-600 dark:text-warning-400",
      info: "text-info-600 dark:text-info-400",
      danger: "text-danger-600 dark:text-danger-400",
      neutral: "text-neutral-600 dark:text-neutral-400",
    };
    return colors[color] || colors.neutral;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with IslandHop today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl border ${getStatColor(
                  stat.color
                )} transition-all hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        stat.changeType === "positive"
                          ? "text-success-600 dark:text-success-400"
                          : "text-danger-600 dark:text-danger-400"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full bg-white dark:bg-secondary-700`}
                  >
                    <IconComponent
                      className={`h-6 w-6 ${getIconColor(stat.color)}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-4 rounded-lg border border-gray-200 dark:border-secondary-600 hover:border-${action.color}-300 dark:hover:border-${action.color}-600 transition-all group hover:scale-105 hover:shadow-md`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20 group-hover:bg-${action.color}-200 dark:group-hover:bg-${action.color}-800/30 transition-colors`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${getIconColor(action.color)}`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

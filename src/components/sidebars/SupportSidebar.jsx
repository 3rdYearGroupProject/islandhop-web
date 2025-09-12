import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  TicketIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ArchiveBoxXMarkIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { clearUserData } from "../../utils/userStorage";
import islandHopIcon from "../../assets/islandHopIcon.png";
import islandHopLogo from "../../assets/IslandHop.png";

const SupportSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userPermission, setUserPermission] = useState(null);
  const [isLoadingPermission, setIsLoadingPermission] = useState(true);

  // Fetch user permission on component mount
  useEffect(() => {
    const fetchUserPermission = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`http://localhost:8061/permission/${currentUser.email}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                setUserPermission(data.permission);
              }
            } else {
              console.error('Failed to fetch user permission');
            }
          } catch (error) {
            console.error('Error fetching user permission:', error);
          }
        }
        setIsLoadingPermission(false);
      });

      return () => unsubscribe();
    };

    fetchUserPermission();
  }, []);

  // Check if user has access to a specific menu item
  const hasAccess = (requiredPermissions) => {
    if (userPermission === 4) return true; // All permissions
    if (userPermission === null) return false; // No permission loaded
    return requiredPermissions.includes(userPermission);
  };

  const supportMenuItems = [
    {
      name: "Dashboard",
      path: "/support/dashboard",
      icon: HomeIcon,
      description: "Overview & Stats",
      permissions: [1, 2, 3, 4], // All users can access dashboard
    },
    // {
    //   name: "View Tickets",
    //   path: "/support/tickets",
    //   icon: TicketIcon,
    //   description: "Manage Support Tickets",
    //   permissions: [1, 2, 3, 4], // All users can view tickets
    // },
    {
      name: "Reviews",
      path: "/support/reviews",
      icon: StarIcon,
      description: "Customer Reviews",
      permissions: [2, 4], // Only Reviews and All permissions
    },
    {
      name: "Chat & Email",
      path: "/support/chat-email",
      icon: ChatBubbleLeftRightIcon,
      description: "Live Support",
      permissions: [1, 2, 3, 4], // All users can access chat
    },
    {
      name: "Communications",
      path: "/support/communications",
      icon: ChatBubbleLeftRightIcon,
      description: "Chat with System Admin & Support Agents",
      permissions: [1, 2, 3, 4], // All users can access communications
    },
    {
      name: "Resolve Complaints",
      path: "/support/resolve-complaint",
      icon: ExclamationTriangleIcon,
      description: "Handle Complaints",
      permissions: [3, 4], // Only Complaints and All permissions
    },
    {
      name: "Verifications",
      path: "/support/verifications",
      icon: DocumentTextIcon,
      description: "Manage Verifications",
      permissions: [1, 4], // Only Verification and All permissions
    },
    {
      name: "Lost Items",
      path: "/support/lost-item-tracker",
      icon: ArchiveBoxXMarkIcon,
      description: "Track Lost Items",
      permissions: [1, 2, 3, 4], // All users can access lost items
    },
    {
      name: "Panic Alerts",
      path: "/support/panic-alerts",
      icon: ShieldExclamationIcon,
      description: "Emergency Response",
      permissions: [1, 2, 3, 4], // All users can access panic alerts
    },
  ];

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      clearUserData();
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-secondary-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 border-r border-gray-200 dark:border-secondary-700`}
    >
      <div className="flex flex-col h-full">
        {/* IslandHop Header (Mobile) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-secondary-700 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <img
                src={islandHopIcon}
                alt="IslandHop Icon"
                className="h-6 w-6 object-contain"
              />
            </div>
            <div>
              <img
                src={islandHopLogo}
                alt="IslandHop Logo"
                className="h-6 object-contain"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Support Center
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors duration-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* IslandHop Header (Desktop) */}
        <div className="hidden lg:flex flex-col items-start px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
          <div className="flex items-center mb-1 ml-3">
            <img
              src={islandHopIcon}
              alt="IslandHop Icon"
              className="h-8 w-8 mr-2"
            />
            <img
              src={islandHopLogo}
              alt="IslandHop Logo"
              className="h-6"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-[51px]">
            Support Center
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {isLoadingPermission ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            supportMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const hasPermission = hasAccess(item.permissions);

              if (!hasPermission) {
                return (
                  <div
                    key={item.name}
                    className="group flex items-center px-3 py-3 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-3 bg-gray-100 dark:bg-secondary-700">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-400">
                        {item.name}
                      </div>
                      <div className="text-xs mt-0.5 text-gray-400">
                        Access Restricted
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border-l-4 border-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors duration-200 ${
                      isActive
                        ? "bg-white/20"
                        : "bg-gray-100 dark:bg-secondary-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-semibold ${isActive ? "text-white" : ""}`}
                    >
                      {item.name}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isActive
                          ? "text-white/80"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-secondary-700">
          {/* Support Agent Profile */}
          <Link
            to="/support/profile"
            onClick={onClose}
            className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-3 ${
              location.pathname === "/support/profile"
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border-l-4 border-primary-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors duration-200 ${
                location.pathname === "/support/profile"
                  ? "bg-white/20"
                  : "bg-gray-100 dark:bg-secondary-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20"
              }`}
            >
              <UserIcon
                className={`h-5 w-5 ${
                  location.pathname === "/support/profile"
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`font-semibold ${location.pathname === "/support/profile" ? "text-white" : ""}`}
              >
                Profile
              </div>
              <div
                className={`text-xs mt-0.5 ${
                  location.pathname === "/support/profile"
                    ? "text-white/80"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400"
                }`}
              >
                Agent Profile
              </div>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="py-4 border-t border-gray-200 dark:border-secondary-700">
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-secondary-800 hover:bg-gray-200 dark:hover:bg-secondary-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors duration-200">
                <BellIcon className="h-4 w-4 mr-2" />
                Notifications
              </button>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4 py-2 mb-2 bg-danger-100 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 rounded-lg font-semibold text-sm hover:bg-danger-200 dark:hover:bg-danger-800 transition-colors duration-200"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            Sign Out
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            © 2025 IslandHop Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportSidebar;

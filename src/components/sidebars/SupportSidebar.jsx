import React, { useState } from "react";
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
} from "@heroicons/react/24/outline";
import { auth } from "../../firebase";
import { clearUserData } from "../../utils/userStorage";
import islandHopIcon from "../../assets/islandHopIcon.png";
import islandHopLogo from "../../assets/IslandHop.png";

const SupportSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewProfile = () => {
    setIsDropdownOpen(false);
    navigate("/support/profile");
  };

  const supportMenuItems = [
    {
      name: "Dashboard",
      path: "/support/dashboard",
      icon: HomeIcon,
      description: "Overview & Stats",
    },
    {
      name: "View Tickets",
      path: "/support/tickets",
      icon: TicketIcon,
      description: "Manage Support Tickets",
    },
    {
      name: "Reviews",
      path: "/support/reviews",
      icon: StarIcon,
      description: "Customer Reviews",
    },
    {
      name: "Chat & Email",
      path: "/support/chat-email",
      icon: ChatBubbleLeftRightIcon,
      description: "Live Support",
    },
    {
      name: "Communications",
      path: "/support/communications",
      icon: ChatBubbleLeftRightIcon,
      description: "Chat with System Admin & Support Agents",
    },
    {
      name: "Resolve Complaints",
      path: "/support/resolve-complaint",
      icon: ExclamationTriangleIcon,
      description: "Handle Complaints",
    },
    {
      name: "Escalate Issues",
      path: "/support/escalate-issue",
      icon: ShieldExclamationIcon,
      description: "Priority Escalation",
    },
    {
      name: "Lost Items",
      path: "/support/lost-item-tracker",
      icon: ArchiveBoxXMarkIcon,
      description: "Track Lost Items",
    },
    {
      name: "Panic Alerts",
      path: "/support/panic-alerts",
      icon: ShieldExclamationIcon,
      description: "Emergency Response",
    },
    {
      name: "Reports",
      path: "/support/reports",
      icon: ChartBarIcon,
      description: "Support Analytics",
    },
    {
      name: "Profile",
      path: "/support/profile",
      icon: UserIcon,
      description: "Agent Profile",
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
        <div className="hidden lg:flex items-center px-6 py-4 border-b border-gray-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-lg">
              <img
                src={islandHopIcon}
                alt="IslandHop Icon"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <img
                src={islandHopLogo}
                alt="IslandHop Logo"
                className="h-6 object-contain"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Support Center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {supportMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

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
                {/* {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                )} */}
              </Link>
            );
          })}
        </nav>

        {/* Support Status */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-secondary-700">
          <div className="bg-gray-50 dark:bg-secondary-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Support Status
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-success-600 dark:text-success-400 font-medium">
                  Available
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-600 dark:text-gray-400">
                <span className="block font-medium">Active Tickets</span>
                <span className="text-warning-600 dark:text-warning-400">
                  24
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <span className="block font-medium">Response Time</span>
                <span className="text-success-600 dark:text-success-400">
                  &lt; 5min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-secondary-700">
          {/* Support Agent Profile Dropdown */}
          <div className="relative mb-3">
            <button
              onClick={toggleDropdown}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">S</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Support Agent
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Customer Support
                </p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-gray-200 dark:border-secondary-700 z-10">
                <div className="py-1">
                  <button
                    onClick={handleViewProfile}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            )}
          </div>

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
            © 2024 IslandHop Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportSidebar;

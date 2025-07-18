import React, { useState } from "react";
import {
  ShieldExclamationIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const PanicAlerts = () => {
  const [alert] = useState({
    id: "ALERT-20250622-001",
    time: "2025-06-22 14:37",
    location: "Colombo Fort Railway Station",
    lat: 6.9344,
    lng: 79.8428,
    user: {
      name: "Ayesha Fernando",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      phone: "+94 77 123 4567",
      email: "ayesha.fernando@email.com",
      role: "Tourist",
    },
    status: "Active",
  });
  const [resolution, setResolution] = useState("");
  const [handled, setHandled] = useState(false);

  const handleContact = (type) => {
    if (type === "phone") {
      window.location.href = `tel:${alert.user.phone}`;
    } else if (type === "email") {
      window.location.href = `mailto:${alert.user.email}`;
    }
  };

  const handleMarkHandled = () => {
    if (!resolution.trim()) {
      alert("Please provide resolution details");
      return;
    }
    setHandled(true);
    alert("Panic alert has been marked as handled!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panic Alerts
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Handle emergency panic button alerts from users
        </p>
      </div>

      {handled && (
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <ShieldExclamationIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
            <div>
              <h3 className="text-sm font-medium text-success-800 dark:text-success-300">
                Panic Alert Resolved
              </h3>
              <p className="text-sm text-success-700 dark:text-success-400 mt-1">
                The panic alert has been successfully handled and resolved.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Main Alert Details */}
        <div className="space-y-6">
          {/* Alert Card */}
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`flex items-center space-x-2 ${
                    handled
                      ? "text-success-600 dark:text-success-400"
                      : "text-danger-600 dark:text-danger-400"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      handled ? "bg-success-500" : "bg-danger-500 animate-pulse"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    {handled ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  handled
                    ? "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300"
                    : "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300"
                }`}
              >
                {handled ? "Resolved" : "Emergency"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <ShieldExclamationIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Panic Alert - {alert.id}
                </h2>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <ClockIcon className="h-4 w-4" />
                <span>Alert Time: {alert.time}</span>
              </div>

              <div className="flex items-center space-x-3 text-sm text-primary-600 dark:text-primary-400">
                <MapPinIcon className="h-4 w-4" />
                <span className="font-medium">{alert.location}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg border border-gray-200 dark:border-secondary-600">
              <div className="flex items-center space-x-4">
                <img
                  src={alert.user.avatar}
                  alt={alert.user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-secondary-600"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {alert.user.name}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({alert.user.role})
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {alert.user.phone}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {alert.user.email}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleContact("phone")}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 transition-colors duration-200"
                  >
                    <PhoneIcon className="h-3 w-3 mr-1" />
                    Emergency Call
                  </button>
                  <button
                    onClick={() => handleContact("email")}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info-500 transition-colors duration-200"
                  >
                    <EnvelopeIcon className="h-3 w-3 mr-1" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Section */}
          {!handled && (
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resolution Details
              </h3>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe the resolution steps taken and outcome..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleMarkHandled}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition-colors duration-200"
                >
                  Mark as Handled
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanicAlerts;

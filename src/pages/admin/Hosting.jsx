import React, { useState, useEffect } from "react";
import {
  ServerIcon,
  CpuChipIcon,
  CloudIcon,
  RocketLaunchIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Hosting = () => {
  const [servers, setServers] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [infrastructureMetrics, setInfrastructureMetrics] = useState({});
  const [databaseStatus, setDatabaseStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("servers");

  // Mock deployment data
  const mockDeployments = [
    {
      id: 1,
      name: "Frontend v2.1.4",
      status: "completed",
      startTime: "2024-06-25T14:30:00Z",
      endTime: "2024-06-25T14:35:00Z",
      duration: "5 minutes",
      branch: "main",
      commit: "a1b2c3d",
      environment: "production",
    },
    {
      id: 2,
      name: "API v2.1.3",
      status: "progress",
      startTime: "2024-06-25T15:00:00Z",
      endTime: null,
      duration: "2 minutes",
      branch: "release",
      commit: "e4f5g6h",
      environment: "production",
    },
    {
      id: 3,
      name: "Database Migration",
      status: "failed",
      startTime: "2024-06-25T13:15:00Z",
      endTime: "2024-06-25T13:20:00Z",
      duration: "5 minutes",
      branch: "main",
      commit: "i7j8k9l",
      environment: "staging",
    },
  ];

  useEffect(() => {
    // Fetch database status from backend
    const fetchDatabaseStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:8090/api/v1/admin/status"
        );
        if (response.ok) {
          const statusData = await response.json();
          setDatabaseStatus(statusData);
        } else {
          console.error("Failed to fetch database status");
          // Set default status if API fails
          setDatabaseStatus({
            redis: "DOWN",
            firebase: "DOWN",
            mongodb: "DOWN",
          });
        }
      } catch (error) {
        console.error("Error fetching database status:", error);
        // Set default status if API fails
        setDatabaseStatus({
          redis: "DOWN",
          firebase: "DOWN",
          mongodb: "DOWN",
        });
      }
    };

    fetchDatabaseStatus();
  }, []);

  useEffect(() => {
    // Update servers and other data after database status is fetched
    if (Object.keys(databaseStatus).length > 0) {
      const updatedServers = [
        {
          id: 1,
          name: "Web Server 1",
          type: "web",
          status: "running",
          ip: "192.168.1.10",
          location: "US East",
          cpu: 45,
          memory: 68,
          disk: 32,
          uptime: "15 days, 4 hours",
          lastRestart: "2024-06-10T08:30:00Z",
          version: "v2.1.3",
        },
        {
          id: 2,
          name: "Database Server (MongoDB)",
          type: "database",
          status: databaseStatus.mongodb === "UP" ? "running" : "stopped",
          ip: "192.168.1.20",
          location: "US East",
          cpu: databaseStatus.mongodb === "UP" ? 78 : 0,
          memory: databaseStatus.mongodb === "UP" ? 85 : 0,
          disk: 56,
          uptime:
            databaseStatus.mongodb === "UP" ? "23 days, 12 hours" : "0 minutes",
          lastRestart: "2024-06-02T14:15:00Z",
          version: "MongoDB",
        },
        {
          id: 3,
          name: "API Server 1",
          type: "api",
          status: "warning",
          ip: "192.168.1.30",
          location: "US West",
          cpu: 92,
          memory: 76,
          disk: 41,
          uptime: "8 days, 2 hours",
          lastRestart: "2024-06-17T10:20:00Z",
          version: "v2.1.3",
        },
        {
          id: 4,
          name: "Load Balancer",
          type: "loadbalancer",
          status: "running",
          ip: "192.168.1.5",
          location: "US Central",
          cpu: 23,
          memory: 34,
          disk: 15,
          uptime: "45 days, 8 hours",
          lastRestart: "2024-05-11T16:45:00Z",
          version: "Nginx 1.20",
        },
        {
          id: 5,
          name: "Redis Cache Server",
          type: "cache",
          status: databaseStatus.redis === "UP" ? "running" : "stopped",
          ip: "192.168.1.40",
          location: "US East",
          cpu: databaseStatus.redis === "UP" ? 34 : 0,
          memory: databaseStatus.redis === "UP" ? 45 : 0,
          disk: 28,
          uptime:
            databaseStatus.redis === "UP" ? "12 days, 6 hours" : "0 minutes",
          lastRestart: "2024-06-25T09:00:00Z",
          version: "Redis",
        },
        {
          id: 6,
          name: "Firebase Server",
          type: "firebase",
          status: databaseStatus.firebase === "UP" ? "running" : "stopped",
          ip: "Cloud Service",
          location: "Global",
          cpu: databaseStatus.firebase === "UP" ? 25 : 0,
          memory: databaseStatus.firebase === "UP" ? 30 : 0,
          disk: databaseStatus.firebase === "UP" ? 15 : 0,
          uptime:
            databaseStatus.firebase === "UP" ? "Cloud Service" : "0 minutes",
          lastRestart: "N/A",
          version: "Firebase",
        },
      ];

      setServers(updatedServers);
      setDeployments(mockDeployments);
      setInfrastructureMetrics({
        totalServers: updatedServers.length,
        runningServers: updatedServers.filter((s) => s.status === "running")
          .length,
        avgCpuUsage: Math.round(
          updatedServers.reduce((acc, s) => acc + s.cpu, 0) /
            updatedServers.length
        ),
        avgMemoryUsage: Math.round(
          updatedServers.reduce((acc, s) => acc + s.memory, 0) /
            updatedServers.length
        ),
      });
      setLoading(false);
    }
  }, [databaseStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case "running":
      case "completed":
        return "text-success-600 bg-success-100";
      case "warning":
      case "progress":
        return "text-warning-600 bg-warning-100";
      case "stopped":
      case "failed":
        return "text-danger-600 bg-danger-100";
      default:
        return "text-neutral-600 bg-neutral-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
      case "completed":
        return CheckCircleIcon;
      case "warning":
      case "progress":
        return ExclamationTriangleIcon;
      case "stopped":
      case "failed":
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const getResourceBarColor = (usage) => {
    if (usage >= 90) return "bg-danger-500";
    if (usage >= 70) return "bg-warning-500";
    return "bg-success-500";
  };

  const handleServerAction = (serverId, action) => {
    console.log(`${action} server ${serverId}`);
    // Implement server actions here
  };

  const refreshStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8090/api/v1/admin/status");
      if (response.ok) {
        const statusData = await response.json();
        setDatabaseStatus(statusData);
      }
    } catch (error) {
      console.error("Error refreshing status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Hosting & Infrastructure
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Monitor and manage server infrastructure and deployments
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshStatus}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-secondary-800 border border-neutral-300 dark:border-secondary-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-secondary-700 transition-colors"
          >
            Refresh Status
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2">
            <RocketLaunchIcon className="h-4 w-4" />
            Deploy
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            Total Servers
          </h4>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {infrastructureMetrics.totalServers}
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            Running Servers
          </h4>
          <div className="text-2xl font-bold text-success-600">
            {infrastructureMetrics.runningServers}
          </div>

        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            Avg CPU Usage
          </h4>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {infrastructureMetrics.avgCpuUsage}%
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            Avg Memory Usage
          </h4>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {infrastructureMetrics.avgMemoryUsage}%
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 dark:border-secondary-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "servers", name: "Servers", icon: ServerIcon },
            { id: "deployments", name: "Deployments", icon: RocketLaunchIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-secondary-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "servers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {servers.map((server) => {
              const StatusIcon = getStatusIcon(server.status);
              return (
                <div
                  key={server.id}
                  className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-100 dark:bg-secondary-700 rounded-lg">
                        <ServerIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {server.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {server.ip} • {server.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        server.status
                      )}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {server.status}
                    </span>
                  </div>

                  {/* Resource Usage */}
                  <div className="space-y-3 mb-4">
                    {[
                      { label: "CPU", value: server.cpu },
                      { label: "Memory", value: server.memory },
                      { label: "Disk", value: server.disk },
                    ].map((resource) => (
                      <div key={resource.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {resource.label}
                          </span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {resource.value}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-secondary-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getResourceBarColor(
                              resource.value
                            )}`}
                            style={{ width: `${resource.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Server Details */}
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    <p>
                      <strong>Uptime:</strong> {server.uptime}
                    </p>
                    <p>
                      <strong>Version:</strong> {server.version}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {server.status === "stopped" ? (
                      <button
                        onClick={() => handleServerAction(server.id, "start")}
                        className="px-3 py-1.5 text-sm font-medium text-success-700 bg-success-100 hover:bg-success-200 rounded-lg transition-colors"
                      >
                        Start
                      </button>
                    ) : (
                      <button
                        onClick={() => handleServerAction(server.id, "stop")}
                        className="px-3 py-1.5 text-sm font-medium text-danger-700 bg-danger-100 hover:bg-danger-200 rounded-lg transition-colors"
                      >
                        Stop
                      </button>
                    )}
                    <button
                      onClick={() => handleServerAction(server.id, "restart")}
                      className="px-3 py-1.5 text-sm font-medium text-warning-700 bg-warning-100 hover:bg-warning-200 rounded-lg transition-colors"
                    >
                      Restart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "deployments" && (
        <div className="space-y-4">
          {deployments.map((deployment) => {
            const StatusIcon = getStatusIcon(deployment.status);
            return (
              <div
                key={deployment.id}
                className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      {deployment.name}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {deployment.environment} • {deployment.branch} •{" "}
                      {deployment.commit}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      deployment.status
                    )}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {deployment.status}
                  </span>
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  <p>
                    <strong>Started:</strong>{" "}
                    {new Date(deployment.startTime).toLocaleString()}
                  </p>
                  {deployment.endTime && (
                    <p>
                      <strong>Completed:</strong>{" "}
                      {new Date(deployment.endTime).toLocaleString()}
                    </p>
                  )}
                  <p>
                    <strong>Duration:</strong> {deployment.duration}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
};

export default Hosting;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebase";
import {
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon,
  ServerIcon,
  CpuChipIcon,
  CloudIcon,
  RocketLaunchIcon,
  CircleStackIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

const SystemSettings = () => {
  const [servers, setServers] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [infrastructureMetrics, setInfrastructureMetrics] = useState({});
  const [databaseStatus, setDatabaseStatus] = useState({});
  const [hostingLoading, setHostingLoading] = useState(true);
  const [activeHostingTab, setActiveHostingTab] = useState("servers");
  const [authToken, setAuthToken] = useState("");
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    systemName: "IslandHop Platform",
    darkMode: false,
    notifications: true,
    autoBackup: true,
    cacheSize: 75,
    maxConcurrentUsers: 1000,
    apiTimeout: 30,
    twoFactorAuth: true,
    sessionTimeout: 120,
    passwordComplexity: true,
    loginAttempts: 5,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    logLevel: "info",
    betaFeatures: false,
    analytics: true,
    errorReporting: true,
    // AI Settings
    recommendationModel: "advanced",
    routeOptimization: true,
    priceOptimization: true,
    demandPrediction: true,
    trainingFrequency: "weekly",
    learningRate: 0.001,
    batchSize: 32,
    epochs: 100,
    dataRetention: "6months",
    smartMatching: true,
    predictiveAnalytics: true,
    autoResponseSystem: false,
    fraudDetection: true,
    sentimentAnalysis: true,
    chatbotAssistant: false,
    dynamicPricing: true,
    trafficPrediction: true,
    aiApiResponseTime: 500,
    confidenceThreshold: 0.8,
    fallbackEnabled: true,
    debugMode: false,
  });

  const [modelStatus, setModelStatus] = useState({
    recommendation: "active",
    routing: "training",
    pricing: "active",
    fraud: "active",
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSliderChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: parseInt(value),
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        icon: CheckCircleIcon,
        color: "text-success-600",
        bg: "bg-success-100",
        text: "Active",
      },
      training: {
        icon: ArrowPathIcon,
        color: "text-warning-600",
        bg: "bg-warning-100",
        text: "Training",
      },
      inactive: {
        icon: XCircleIcon,
        color: "text-neutral-600",
        bg: "bg-neutral-100",
        text: "Inactive",
      },
      error: {
        icon: ExclamationTriangleIcon,
        color: "text-danger-600",
        bg: "bg-danger-100",
        text: "Error",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
      >
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

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

  // Hosting helper functions
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
        setHostingLoading(false);
      }
    };
    getToken();
  }, []);

  // Fetch database status using axios
  useEffect(() => {
    const fetchDatabaseStatus = async () => {
      if (!authToken) return;

      try {
        const response = await axios.get(
          "http://localhost:8070/api/admin/database/status",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Database status response:", response.data);

        if (response.data && response.data.success && response.data.data) {
          const dbData = response.data.data.databases;

          // Transform the API response to match our expected format
          const transformedStatus = {
            overall: response.data.data.overall,
            timestamp: response.data.data.timestamp,
            mongodb: {
              status: dbData.mongodb?.status || "unhealthy",
              type: dbData.mongodb?.type || "MongoDB",
              message: dbData.mongodb?.message || "No data",
              details: dbData.mongodb?.details || {},
            },
            supabase: {
              status: dbData.supabase?.status || "unhealthy",
              type: dbData.supabase?.type || "Supabase/PostgreSQL",
              message: dbData.supabase?.message || "No data",
              details: dbData.supabase?.details || {},
            },
          };

          setDatabaseStatus(transformedStatus);
          setError(null);
        } else {
          console.error("Invalid response format");
          setError("Invalid database status response");
          setDatabaseStatus({
            overall: "unhealthy",
            mongodb: { status: "unhealthy" },
            supabase: { status: "unhealthy" },
          });
        }
      } catch (error) {
        console.error("Error fetching database status:", error);
        setError("Failed to fetch database status");
        setDatabaseStatus({
          overall: "unhealthy",
          mongodb: { status: "unhealthy" },
          supabase: { status: "unhealthy" },
        });
      }
    };

    fetchDatabaseStatus();
  }, [authToken]);

  // Update servers and other data after database status is fetched
  useEffect(() => {
    if (Object.keys(databaseStatus).length > 0) {
      const updatedServers = [
        {
          id: 2,
          name: "Database Server (MongoDB)",
          type: "database",
          status:
            databaseStatus.mongodb?.status === "healthy"
              ? "running"
              : "stopped",
          ip: databaseStatus.mongodb?.details?.host || "N/A",
          location: "Cloud",
          cpu: databaseStatus.mongodb?.status === "healthy" ? 78 : 0,
          memory: databaseStatus.mongodb?.status === "healthy" ? 85 : 0,
          disk: 56,
          uptime:
            databaseStatus.mongodb?.status === "healthy"
              ? "Cloud Service"
              : "0 minutes",
          lastRestart: "N/A",
          version: databaseStatus.mongodb?.type || "MongoDB",
          responseTime: databaseStatus.mongodb?.details?.responseTime || "N/A",
          message: databaseStatus.mongodb?.message || "No data",
        },
        {
          id: 3,
          name: "Database Server (Supabase)",
          type: "database",
          status:
            databaseStatus.supabase?.status === "healthy"
              ? "running"
              : "stopped",
          ip: databaseStatus.supabase?.details?.url || "N/A",
          location: "Cloud",
          cpu: databaseStatus.supabase?.status === "healthy" ? 65 : 0,
          memory: databaseStatus.supabase?.status === "healthy" ? 72 : 0,
          disk: 48,
          uptime:
            databaseStatus.supabase?.status === "healthy"
              ? "Cloud Service"
              : "0 minutes",
          lastRestart: "N/A",
          version: databaseStatus.supabase?.type || "Supabase/PostgreSQL",
          responseTime: databaseStatus.supabase?.details?.responseTime || "N/A",
          message: databaseStatus.supabase?.message || "No data",
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
        overallHealth: databaseStatus.overall || "unknown",
      });
      setHostingLoading(false);
    }
  }, [databaseStatus]);

  const handleServerAction = (serverId, action) => {
    console.log(`${action} server ${serverId}`);
    // Implement server actions here
  };

  const refreshStatus = async () => {
    if (!authToken) {
      console.error("No auth token available");
      return;
    }

    setHostingLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:8070/api/admin/database/status",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success && response.data.data) {
        const dbData = response.data.data.databases;

        const transformedStatus = {
          overall: response.data.data.overall,
          timestamp: response.data.data.timestamp,
          mongodb: {
            status: dbData.mongodb?.status || "unhealthy",
            type: dbData.mongodb?.type || "MongoDB",
            message: dbData.mongodb?.message || "No data",
            details: dbData.mongodb?.details || {},
          },
          supabase: {
            status: dbData.supabase?.status || "unhealthy",
            type: dbData.supabase?.type || "Supabase/PostgreSQL",
            message: dbData.supabase?.message || "No data",
            details: dbData.supabase?.details || {},
          },
        };

        setDatabaseStatus(transformedStatus);
      }
    } catch (error) {
      console.error("Error refreshing status:", error);
      setError("Failed to refresh database status");
    } finally {
      setHostingLoading(false);
    }
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={enabled}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 dark:bg-secondary-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
    </label>
  );

  const SliderInput = ({ label, value, min, max, onChange, description }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-secondary-600 rounded-lg appearance-none cursor-pointer slider"
      />
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage server infrastructure and deployments
          </p>
        </div>

        {/* Hosting & Infrastructure Section */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Hosting & Infrastructure
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and manage server infrastructure and deployments
            </p>
          </div>

          {/* Infrastructure Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-secondary-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Overall Health
              </h4>
              <div
                className={`text-2xl font-bold ${
                  infrastructureMetrics.overallHealth === "healthy"
                    ? "text-success-600"
                    : "text-danger-600"
                }`}
              >
                {infrastructureMetrics.overallHealth === "healthy"
                  ? "✓ Healthy"
                  : "✗ Unhealthy"}
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-secondary-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total Servers
              </h4>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {infrastructureMetrics.totalServers || 0}
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-secondary-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Running Servers
              </h4>
              <div className="text-2xl font-bold text-success-600">
                {infrastructureMetrics.runningServers || 0}
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-secondary-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Avg CPU Usage
              </h4>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {infrastructureMetrics.avgCpuUsage || 0}%
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-secondary-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Avg Memory Usage
              </h4>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {infrastructureMetrics.avgMemoryUsage || 0}%
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-danger-800 dark:text-danger-300 text-sm">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Hosting Tab Navigation */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 mb-6">
            <div className="border-b border-gray-200 dark:border-secondary-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveHostingTab("servers")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeHostingTab === "servers"
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ServerIcon className="h-5 w-5" />
                    <span>Servers</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveHostingTab("deployments")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeHostingTab === "deployments"
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <RocketLaunchIcon className="h-5 w-5" />
                    <span>Deployments</span>
                  </div>
                </button>
              </nav>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {activeHostingTab === "servers"
                    ? "Server Management"
                    : "Deployment History"}
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={refreshStatus}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-secondary-700 hover:bg-gray-200 dark:hover:bg-secondary-600 rounded-lg transition-colors"
                  >
                    Refresh Status
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2">
                    <RocketLaunchIcon className="h-4 w-4" />
                    Deploy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hosting Tab Content */}
          {hostingLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Servers Tab */}
              {activeHostingTab === "servers" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {servers.map((server) => {
                    const StatusIcon = getStatusIcon(server.status);
                    const isDatabaseServer = server.type === "database";
                    const isMongoDb = server.name.includes("MongoDB");
                    const isSupabase = server.name.includes("Supabase");

                    return (
                      <div
                        key={server.id}
                        className="bg-white dark:bg-secondary-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-secondary-700 hover:shadow-md transition-shadow"
                      >
                        {isDatabaseServer ? (
                          /* Database Server Cards with Large Icons */
                          <div className="space-y-6">
                            {/* Large Icon and Status */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {isMongoDb ? (
                                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl">
                                    <CircleStackIcon className="h-16 w-16 text-green-600 dark:text-green-400" />
                                  </div>
                                ) : isSupabase ? (
                                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl">
                                    <CommandLineIcon className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                ) : (
                                  <div className="p-4 bg-gray-100 dark:bg-secondary-700 rounded-2xl">
                                    <ServerIcon className="h-16 w-16 text-gray-600 dark:text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {isMongoDb
                                      ? "MongoDB"
                                      : isSupabase
                                      ? "Supabase"
                                      : server.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {server.version}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center justify-center py-4">
                              <span
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold ${getStatusColor(
                                  server.status
                                )}`}
                              >
                                <StatusIcon className="h-5 w-5" />
                                {server.status === "running"
                                  ? "Connected & Healthy"
                                  : "Disconnected"}
                              </span>
                            </div>

                            {/* Database Details */}
                            <div className="bg-gray-50 dark:bg-secondary-900 rounded-lg p-6 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Status Message
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {server.message || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Response Time
                                </span>
                                <span
                                  className={`text-sm font-semibold ${
                                    server.responseTime &&
                                    parseInt(server.responseTime) < 500
                                      ? "text-success-600 dark:text-success-400"
                                      : "text-warning-600 dark:text-warning-400"
                                  }`}
                                >
                                  {server.responseTime || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Location
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {server.location}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Connection
                                </span>
                                <span
                                  className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px]"
                                  title={server.ip}
                                >
                                  {server.ip}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Regular Server Cards */
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-secondary-700 rounded-lg">
                                  <ServerIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {server.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
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

                            {/* Resource Usage for non-database servers */}
                            <div className="space-y-3 mb-4">
                              {[
                                { label: "CPU", value: server.cpu },
                                { label: "Memory", value: server.memory },
                                { label: "Disk", value: server.disk },
                              ].map((resource) => (
                                <div key={resource.label}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {resource.label}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {resource.value}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
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
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
                                  onClick={() =>
                                    handleServerAction(server.id, "start")
                                  }
                                  className="px-3 py-1.5 text-sm font-medium text-success-700 bg-success-100 hover:bg-success-200 rounded-lg transition-colors"
                                >
                                  Start
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleServerAction(server.id, "stop")
                                  }
                                  className="px-3 py-1.5 text-sm font-medium text-danger-700 bg-danger-100 hover:bg-danger-200 rounded-lg transition-colors"
                                >
                                  Stop
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleServerAction(server.id, "restart")
                                }
                                className="px-3 py-1.5 text-sm font-medium text-warning-700 bg-warning-100 hover:bg-warning-200 rounded-lg transition-colors"
                              >
                                Restart
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Deployments Tab */}
              {activeHostingTab === "deployments" && (
                <div className="space-y-4">
                  {deployments.map((deployment) => {
                    const StatusIcon = getStatusIcon(deployment.status);
                    return (
                      <div
                        key={deployment.id}
                        className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-secondary-700"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {deployment.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
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
                        <div className="text-sm text-gray-600 dark:text-gray-400">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;

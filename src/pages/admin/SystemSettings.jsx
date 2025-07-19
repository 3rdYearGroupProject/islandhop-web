import React, { useState, useEffect } from "react";
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
} from "@heroicons/react/24/outline";

const SystemSettings = () => {
  const [servers, setServers] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [infrastructureMetrics, setInfrastructureMetrics] = useState({});
  const [databaseStatus, setDatabaseStatus] = useState({});
  const [hostingLoading, setHostingLoading] = useState(true);
  const [activeHostingTab, setActiveHostingTab] = useState("servers");
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

  // Fetch database status
  useEffect(() => {
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
          setDatabaseStatus({
            redis: "DOWN",
            firebase: "DOWN",
            mongodb: "DOWN",
          });
        }
      } catch (error) {
        console.error("Error fetching database status:", error);
        setDatabaseStatus({
          redis: "DOWN",
          firebase: "DOWN",
          mongodb: "DOWN",
        });
      }
    };

    fetchDatabaseStatus();
  }, []);

  // Update servers and other data after database status is fetched
  useEffect(() => {
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
      setHostingLoading(false);
    }
  }, [databaseStatus]);

  const handleServerAction = (serverId, action) => {
    console.log(`${action} server ${serverId}`);
    // Implement server actions here
  };

  const refreshStatus = async () => {
    setHostingLoading(true);
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
            Configure platform preferences and security settings
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* AI Model Status - 3 columns wide */}
          <div className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Model Status
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {Object.entries(modelStatus).map(([key, status]) => (
                <div
                  key={key}
                  className="bg-gray-50 dark:bg-secondary-900 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">
                    {key.replace(/([A-Z])/g, " $1").trim()} Model
                  </h4>
                  {getStatusBadge(status)}
                </div>
              ))}
            </div>
          </div>

          {/* AI Features - 3 columns wide */}
          <div className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <WrenchScrewdriverIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Features
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  key: "routeOptimization",
                  label: "Route Optimization",
                  description: "AI-powered route planning",
                },
                {
                  key: "priceOptimization",
                  label: "Price Optimization",
                  description: "Dynamic pricing based on demand",
                },
                {
                  key: "demandPrediction",
                  label: "Demand Prediction",
                  description: "Predict travel demand patterns",
                },
                {
                  key: "smartMatching",
                  label: "Smart Matching",
                  description: "AI-powered user matching",
                },
                {
                  key: "fraudDetection",
                  label: "Fraud Detection",
                  description: "AI-powered fraud prevention",
                },
                {
                  key: "sentimentAnalysis",
                  label: "Sentiment Analysis",
                  description: "Analyze user sentiment",
                },
              ].map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-secondary-900 rounded-lg"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {feature.label}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings[feature.key]}
                    onChange={() => handleToggle(feature.key)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AI Configuration - 3 columns wide */}
          <div className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <CogIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Configuration
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recommendation Model
                </label>
                <select
                  value={settings.recommendationModel}
                  onChange={(e) =>
                    handleSelectChange("recommendationModel", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Training Frequency
                </label>
                <select
                  value={settings.trainingFrequency}
                  onChange={(e) =>
                    handleSelectChange("trainingFrequency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <SliderInput
                label="Confidence Threshold"
                value={Math.round(settings.confidenceThreshold * 10)}
                min={1}
                max={10}
                onChange={(value) =>
                  handleSliderChange("confidenceThreshold", value / 10)
                }
                description="AI model confidence threshold"
              />

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Debug Mode
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enable AI debugging
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.debugMode}
                  onChange={() => handleToggle("debugMode")}
                />
              </div>
            </div>
          </div>

          {/* AI Advanced Settings - 3 columns wide */}
          <div className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Advanced AI Settings
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800 rounded-lg">
                <h4 className="text-sm font-medium text-warning-800 dark:text-warning-300 mb-2">
                  ⚠️ Advanced AI Settings
                </h4>
                <p className="text-xs text-warning-700 dark:text-warning-400">
                  These settings affect AI model performance. Change with
                  caution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Learning Rate
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={settings.learningRate}
                    onChange={(e) =>
                      handleInputChange(
                        "learningRate",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    value={settings.batchSize}
                    onChange={(e) =>
                      handleInputChange("batchSize", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Epochs
                  </label>
                  <input
                    type="number"
                    value={settings.epochs}
                    onChange={(e) =>
                      handleInputChange("epochs", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings - 2 columns wide */}
          <div className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-warning-900/20 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-primary-600 dark:text-warning-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Security
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password Complexity
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enforce strong passwords
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.passwordComplexity}
                  onChange={() => handleToggle("passwordComplexity")}
                />
              </div>

              <SliderInput
                label="Session Timeout (minutes)"
                value={settings.sessionTimeout}
                min={30}
                max={480}
                onChange={(value) =>
                  handleSliderChange("sessionTimeout", value)
                }
                description="Auto-logout after inactivity"
              />

              <SliderInput
                label="Max Login Attempts"
                value={settings.loginAttempts}
                min={3}
                max={10}
                onChange={(value) => handleSliderChange("loginAttempts", value)}
                description="Before account lockout"
              />
            </div>
          </div>

          {/* Advanced Settings - 2 columns wide (bottom row) */}
          <div className="lg:col-span-3 bg-white dark:bg-secondary-800 rounded-xl border border-gray-200 dark:border-secondary-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-danger-900/20 rounded-lg">
                <ClockIcon className="h-6 w-6 text-primary-600 dark:text-danger-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Advanced
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800 rounded-lg">
                <h4 className="text-sm font-medium text-warning-800 dark:text-warning-300 mb-2">
                  ⚠️ Advanced Settings
                </h4>
                <p className="text-xs text-warning-700 dark:text-warning-400">
                  These settings can affect system performance and security.
                  Change with caution.
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-lg border border-gray-200 dark:border-secondary-600 transition-colors">
                  Clear System Cache
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-lg border border-gray-200 dark:border-secondary-600 transition-colors">
                  Rebuild Search Index
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-lg border border-gray-200 dark:border-secondary-600 transition-colors">
                  Export System Logs
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/10 rounded-lg border border-danger-200 dark:border-danger-800 transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hosting & Infrastructure Section */}
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Hosting & Infrastructure
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and manage server infrastructure and deployments
            </p>
          </div>

          {/* Infrastructure Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    return (
                      <div
                        key={server.id}
                        className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-secondary-700 hover:shadow-md transition-shadow"
                      >
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

                        {/* Resource Usage */}
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

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;

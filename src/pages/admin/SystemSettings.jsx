import React, { useState } from "react";
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
} from "@heroicons/react/24/outline";

const SystemSettings = () => {
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

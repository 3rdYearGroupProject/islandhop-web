// Global error logger utility
class ErrorLogger {
  constructor() {
    this.initializeGlobalErrorHandlers();
  }

  initializeGlobalErrorHandlers() {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        reason: event.reason,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Log when page visibility changes (helps identify when users leave due to errors)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.logInfo('page_hidden', { timestamp: new Date().toISOString() });
      } else {
        this.logInfo('page_visible', { timestamp: new Date().toISOString() });
      }
    });

    console.log('🔧 Error Logger initialized');
  }

  logError(errorData) {
    // Add common fields
    const enrichedError = {
      ...errorData,
      id: this.generateErrorId(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      buildVersion: process.env.REACT_APP_VERSION || 'unknown',
      environment: process.env.NODE_ENV || 'unknown'
    };

    // Console logging with styling
    console.group(`🚨 ERROR [${enrichedError.type}]`);
    console.error('Message:', enrichedError.message);
    console.error('Timestamp:', enrichedError.timestamp);
    console.error('URL:', enrichedError.url);
    console.error('User ID:', enrichedError.userId);
    console.error('Session ID:', enrichedError.sessionId);
    if (enrichedError.stack) {
      console.error('Stack:', enrichedError.stack);
    }
    console.error('Full Error Data:', enrichedError);
    console.groupEnd();

    // Store in localStorage
    this.storeErrorInStorage(enrichedError);

    // Send to external service if configured
    this.sendToLoggingService(enrichedError);
  }

  logWarning(message, data = {}) {
    const warningData = {
      type: 'warning',
      message,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };

    console.warn('⚠️ WARNING:', message, data);
    this.storeErrorInStorage(warningData);
  }

  logInfo(message, data = {}) {
    const infoData = {
      type: 'info',
      message,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };

    console.info('ℹ️ INFO:', message, data);
    
    // Only store important info logs to avoid clutter
    if (message.includes('error') || message.includes('fail') || message.includes('warning')) {
      this.storeErrorInStorage(infoData);
    }
  }

  // Log API errors with more context
  logApiError(url, method, status, responseData, requestData = null) {
    this.logError({
      type: 'api_error',
      message: `API ${method} ${url} failed with status ${status}`,
      api: {
        url,
        method,
        status,
        responseData,
        requestData
      },
      timestamp: new Date().toISOString()
    });
  }

  // Log routing errors
  logRouteError(route, error) {
    this.logError({
      type: 'route_error',
      message: `Route error on ${route}`,
      route,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  // Log authentication errors
  logAuthError(action, error) {
    this.logError({
      type: 'auth_error',
      message: `Authentication error during ${action}`,
      action,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }

  storeErrorInStorage(errorData) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorData);
      
      // Keep only last 100 logs to prevent storage overflow
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
      localStorage.setItem('lastErrorTime', new Date().toISOString());
    } catch (e) {
      console.error('Failed to store error in localStorage:', e);
    }
  }

  sendToLoggingService(errorData) {
    // Only send in production or if explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true') {
      // Uncomment and configure your logging service
      // fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // }).catch(err => console.error('Failed to send error to logging service:', err));
    }
  }

  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getUserId() {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.uid || 'unknown';
      }
    } catch (e) {
      // Ignore errors
    }
    return 'anonymous';
  }

  getSessionId() {
    try {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch (e) {
      return 'unknown_session';
    }
  }

  // Get all stored error logs
  getErrorLogs() {
    try {
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    } catch (e) {
      console.error('Failed to retrieve error logs:', e);
      return [];
    }
  }

  // Clear error logs
  clearErrorLogs() {
    try {
      localStorage.removeItem('errorLogs');
      localStorage.removeItem('lastErrorTime');
      console.log('✅ Error logs cleared');
    } catch (e) {
      console.error('Failed to clear error logs:', e);
    }
  }

  // Export error logs as downloadable file
  exportErrorLogs() {
    try {
      const logs = this.getErrorLogs();
      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `islandhop_error_logs_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('📥 Error logs exported');
    } catch (e) {
      console.error('Failed to export error logs:', e);
    }
  }

  // Get error summary
  getErrorSummary() {
    const logs = this.getErrorLogs();
    const summary = {
      total: logs.length,
      byType: {},
      recentErrors: logs.slice(-10),
      lastErrorTime: localStorage.getItem('lastErrorTime')
    };

    logs.forEach(log => {
      summary.byType[log.type] = (summary.byType[log.type] || 0) + 1;
    });

    return summary;
  }
}

// Check for common environment variable issues
const checkEnvironmentVariables = () => {
  const requiredEnvVars = [
    'REACT_APP_API_BASE_URL_USER_SERVICES',
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const error = new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    error.name = 'EnvironmentConfigError';
    logError(error, { missingVars });
  }
  
  return missingVars.length === 0;
};

// Initialize environment check
checkEnvironmentVariables();

// Create global instance
const errorLogger = new ErrorLogger();

// Add helper functions to window for debugging
window.errorLogger = errorLogger;
window.getErrorLogs = () => errorLogger.getErrorLogs();
window.clearErrorLogs = () => errorLogger.clearErrorLogs();
window.exportErrorLogs = () => errorLogger.exportErrorLogs();
window.getErrorSummary = () => errorLogger.getErrorSummary();
window.checkEnvironmentVariables = checkEnvironmentVariables;

export default errorLogger;
export { checkEnvironmentVariables };

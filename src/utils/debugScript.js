// IslandHop Debug Script
// Run this in the browser console to check for common issues

console.log('🔍 Running IslandHop Debug Script...');

const debugInfo = {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  url: window.location.href,
  environment: {
    nodeEnv: process.env.NODE_ENV,
    reactVersion: React?.version || 'Not found',
    hasRouter: !!window.React?.Router || !!window.ReactRouter,
  },
  domElements: {
    rootElement: !!document.getElementById('root'),
    rootContent: document.getElementById('root')?.innerHTML?.length || 0,
  },
  localStorage: {
    hasUserData: !!localStorage.getItem('userData'),
    hasErrorLogs: !!localStorage.getItem('errorLogs'),
    errorLogCount: JSON.parse(localStorage.getItem('errorLogs') || '[]').length,
  },
  networkStatus: navigator.onLine,
  errors: []
};

// Check for React
if (!window.React) {
  debugInfo.errors.push('React not found on window object');
}

// Check for root element content
const rootElement = document.getElementById('root');
if (!rootElement) {
  debugInfo.errors.push('Root element not found');
} else if (rootElement.innerHTML.trim() === '') {
  debugInfo.errors.push('Root element is empty - this likely causes white page');
} else if (rootElement.innerHTML.includes('error') || rootElement.innerHTML.includes('Error')) {
  debugInfo.errors.push('Root element contains error content');
}

// Check for common environment variables
const envVars = ['REACT_APP_GOOGLE_CLIENT_ID', 'REACT_APP_API_BASE_URL_USER_SERVICES'];
envVars.forEach(envVar => {
  if (!process.env[envVar]) {
    debugInfo.errors.push(`Missing environment variable: ${envVar}`);
  }
});

// Check for console errors in the last few seconds
const consoleErrors = window.errorLogger?.getErrorLogs().filter(log => 
  new Date(log.timestamp) > new Date(Date.now() - 10000) // Last 10 seconds
) || [];

if (consoleErrors.length > 0) {
  debugInfo.errors.push(`Found ${consoleErrors.length} recent errors in error log`);
}

// Display results
console.group('🔍 ISLANDHOP DEBUG REPORT');
console.log('📊 Debug Info:', debugInfo);

if (debugInfo.errors.length > 0) {
  console.group('❌ ISSUES FOUND');
  debugInfo.errors.forEach((error, index) => {
    console.error(`${index + 1}. ${error}`);
  });
  console.groupEnd();
} else {
  console.log('✅ No obvious issues found');
}

// Show recent error logs
if (window.errorLogger) {
  const recentErrors = window.errorLogger.getErrorLogs().slice(-5);
  if (recentErrors.length > 0) {
    console.group('📋 RECENT ERROR LOGS');
    recentErrors.forEach(error => {
      console.error(`[${error.type}] ${error.message}`, error);
    });
    console.groupEnd();
  }
}

// Provide helpful commands
console.group('🛠️ HELPFUL COMMANDS');
console.log('window.errorLogger.getErrorSummary() - Get error summary');
console.log('window.errorLogger.exportErrorLogs() - Download error logs');
console.log('window.errorLogger.clearErrorLogs() - Clear all error logs');
console.log('localStorage.clear() - Clear all local storage');
console.log('location.reload() - Reload the page');
console.groupEnd();

console.groupEnd();

// Return the debug info for further inspection
return debugInfo;

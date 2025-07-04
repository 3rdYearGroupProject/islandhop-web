import axios from 'axios';
import errorLogger from '../utils/errorLogger';

// Debug environment variables
console.log('🔧 Environment Debug:', {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL_USER_SERVICES,
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
  ALL_ENV_VARS: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
});

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL_USER_SERVICES || 'http://localhost:8083/api/v1',
  withCredentials: true, 
});

// Request interceptor to log outgoing requests
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('📤❌ API Request Error:', error);
    errorLogger.logError({
      type: 'api_request_error',
      message: 'Failed to send API request',
      error: error.message,
      stack: error.stack,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Response interceptor to log responses and errors
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    const { config, response, request } = error;
    
    if (response) {
      // Server responded with error status
      console.error(`📥❌ API Error Response: ${config?.method?.toUpperCase()} ${config?.url}`, {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      errorLogger.logApiError(
        config?.url || 'unknown',
        config?.method?.toUpperCase() || 'unknown',
        response.status,
        response.data,
        config?.data
      );
    } else if (request) {
      // Network error or no response
      console.error(`📥❌ API Network Error: ${config?.method?.toUpperCase()} ${config?.url}`, {
        message: error.message,
        code: error.code
      });
      
      errorLogger.logError({
        type: 'api_network_error',
        message: `Network error for ${config?.method?.toUpperCase()} ${config?.url}`,
        error: error.message,
        code: error.code,
        url: config?.url,
        method: config?.method
      });
    } else {
      // Something else happened
      console.error('📥❌ API Unknown Error:', error.message);
      
      errorLogger.logError({
        type: 'api_unknown_error',
        message: error.message,
        stack: error.stack
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
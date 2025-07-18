// Debug script to test axios configuration
import { poolingServicesApi } from './axios';

export const debugAxiosConfig = () => {
  console.log('🔧 Debug Axios Configuration:');
  console.log('poolingServicesApi.defaults.baseURL:', poolingServicesApi.defaults.baseURL);
  console.log('Environment variable REACT_APP_API_BASE_URL_POOLING_SERVICE:', process.env.REACT_APP_API_BASE_URL_POOLING_SERVICE);
  
  // Test a simple request to see the full URL
  console.log('Testing a sample request...');
  poolingServicesApi.interceptors.request.use((config) => {
    console.log('🔍 Full request URL would be:', `${config.baseURL}${config.url}`);
    // Don't actually send the request
    return Promise.reject(new Error('Debug request - not actually sent'));
  });
  
  // Try to make a test request (it will be intercepted and logged)
  poolingServicesApi.get('/test').catch(() => {
    console.log('Debug request intercepted as expected');
  });
};

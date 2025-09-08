import React, { useState } from 'react';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

const BASE_URL = 'http://localhost:3001';

const RouteApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (endpoint, label) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: data,
        coordinateCount: data.coordinates?.length || 0,
        routeType: data.routeType || 'unknown'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        coordinateCount: 0
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    const results = {};

    // Test health endpoint
    results.health = await testEndpoint('/health', 'Health Check');

    // Test route coordinates
    results.coordinates = await testEndpoint('/trips/test-trip/route-coordinates', 'Route Coordinates');

    // Test optimized route
    results.optimizedRoute = await testEndpoint('/trips/test-trip/optimized-route', 'Optimized Route');

    setTestResults(results);
    setTesting(false);
  };

  const ResultItem = ({ label, result }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        {result?.success ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-sm text-gray-600">
        {result?.success ? (
          <div className="text-right">
            <div>Status: {result.status}</div>
            {result.coordinateCount > 0 && (
              <div>Coordinates: {result.coordinateCount}</div>
            )}
            {result.routeType && (
              <div>Type: {result.routeType}</div>
            )}
          </div>
        ) : (
          <span className="text-red-600">
            {result?.error || `Error ${result?.status}`}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Route API Connection Test</h3>
      
      <button
        onClick={runTests}
        disabled={testing}
        className="w-full mb-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {testing && <Loader className="h-4 w-4 animate-spin" />}
        {testing ? 'Testing...' : 'Test API Connection'}
      </button>

      <div className="space-y-2">
        <ResultItem label="Backend Health" result={testResults.health} />
        <ResultItem label="Route Coordinates" result={testResults.coordinates} />
        <ResultItem label="Optimized Route" result={testResults.optimizedRoute} />
      </div>

      {testResults.coordinates?.success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Backend integration ready! 
            {testResults.coordinates.coordinateCount > 100 && (
              <span> Detailed route with {testResults.coordinates.coordinateCount} waypoints detected.</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteApiTest;

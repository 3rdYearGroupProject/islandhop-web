import React, { useState } from 'react';
import { Loader, CheckCircle, XCircle, Navigation } from 'lucide-react';

const BASE_URL = 'http://localhost:3001';

const DirectionsApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testDirectionsEndpoint = async () => {
    try {
      const response = await fetch(`${BASE_URL}/trips/test-trip/directions-request`);
      const data = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: data,
        hasDirectionsRequest: !!data.directionsRequest,
        origin: data.directionsRequest?.origin,
        destination: data.directionsRequest?.destination,
        waypointCount: data.directionsRequest?.waypoints?.length || 0,
        travelMode: data.directionsRequest?.travelMode
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const runDirectionsTest = async () => {
    setTesting(true);
    const result = await testDirectionsEndpoint();
    setTestResults({ directions: result });
    setTesting(false);
  };

  const ResultItem = ({ result }) => (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        {result?.success ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className="font-medium">DirectionsService Integration Test</span>
      </div>
      
      {result?.success ? (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Status:</span> {result.status}
            </div>
            <div>
              <span className="font-medium">Travel Mode:</span> {result.travelMode}
            </div>
          </div>
          
          {result.origin && (
            <div>
              <span className="font-medium">Origin:</span> {result.origin.lat}, {result.origin.lng}
            </div>
          )}
          
          {result.destination && (
            <div>
              <span className="font-medium">Destination:</span> {result.destination.lat}, {result.destination.lng}
            </div>
          )}
          
          <div>
            <span className="font-medium">Waypoints:</span> {result.waypointCount} stops
          </div>
          
          {result.hasDirectionsRequest && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                ✅ DirectionsRequest object ready for Google Maps DirectionsService
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-red-600">
          <p>Error: {result?.error || `HTTP ${result?.status}`}</p>
          <p className="mt-1 text-xs text-gray-500">
            Expected endpoint: /trips/test-trip/directions-request
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 max-w-lg">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold">DirectionsService API Test</h3>
      </div>
      
      <button
        onClick={runDirectionsTest}
        disabled={testing}
        className="w-full mb-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {testing && <Loader className="h-4 w-4 animate-spin" />}
        {testing ? 'Testing DirectionsService...' : 'Test Directions API'}
      </button>

      {testResults.directions && <ResultItem result={testResults.directions} />}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Expected Result:</strong> This should return a DirectionsRequest object with origin, destination, waypoints, and travelMode='DRIVING' for authentic Google Maps routing.
        </p>
      </div>
    </div>
  );
};

export default DirectionsApiTest;

import React, { useState, useEffect } from 'react';
import errorLogger from '../utils/errorLogger';

const DebugConsole = ({ showByDefault = false }) => {
  const [isVisible, setIsVisible] = useState(showByDefault);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    refreshLogs();
  }, []);

  const refreshLogs = () => {
    const allLogs = errorLogger.getErrorLogs();
    const errorSummary = errorLogger.getErrorSummary();
    setLogs(allLogs);
    setSummary(errorSummary);
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'javascript_error':
      case 'api_error':
      case 'auth_error':
      case 'route_error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-red-700 transition"
          title="Show Debug Console"
        >
          🐛 Debug ({logs.length})
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col max-h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-800">Debug Console</h3>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="all">All ({logs.length})</option>
            <option value="javascript_error">JS Errors</option>
            <option value="api_error">API Errors</option>
            <option value="auth_error">Auth Errors</option>
            <option value="warning">Warnings</option>
            <option value="info">Info</option>
          </select>
          <button
            onClick={refreshLogs}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={() => errorLogger.clearErrorLogs()}
            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Clear
          </button>
          <button
            onClick={() => errorLogger.exportErrorLogs()}
            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            Export
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="p-3 border-b bg-gray-50 text-xs">
          <div className="grid grid-cols-4 gap-4">
            <div>Total: {summary.total}</div>
            <div className="text-red-600">Errors: {(summary.byType.javascript_error || 0) + (summary.byType.api_error || 0) + (summary.byType.auth_error || 0)}</div>
            <div className="text-yellow-600">Warnings: {summary.byType.warning || 0}</div>
            <div className="text-blue-600">Info: {summary.byType.info || 0}</div>
          </div>
          {summary.lastErrorTime && (
            <div className="mt-1 text-gray-500">
              Last error: {new Date(summary.lastErrorTime).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Logs */}
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {filter === 'all' ? 'No logs found' : `No ${filter} logs found`}
          </div>
        ) : (
          filteredLogs.slice(-20).reverse().map((log, index) => (
            <div key={index} className={`p-2 rounded border ${getLogTypeColor(log.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{log.message}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(log.timestamp).toLocaleString()} • {log.type}
                    {log.userId && log.userId !== 'anonymous' && ` • User: ${log.userId}`}
                  </div>
                </div>
                <button
                  onClick={() => console.log('Full log details:', log)}
                  className="text-xs opacity-50 hover:opacity-100 ml-2"
                  title="Log full details to console"
                >
                  📋
                </button>
              </div>
              
              {/* Show additional details for errors */}
              {(log.stack || log.api || log.error) && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer opacity-75 hover:opacity-100">
                    Show details
                  </summary>
                  <div className="mt-1 text-xs font-mono bg-white bg-opacity-50 p-2 rounded overflow-auto max-h-20">
                    {log.stack && <div><strong>Stack:</strong> {log.stack}</div>}
                    {log.api && (
                      <div>
                        <strong>API:</strong> {log.api.method} {log.api.url} - Status: {log.api.status}
                      </div>
                    )}
                    {log.error && <div><strong>Error:</strong> {log.error}</div>}
                  </div>
                </details>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t bg-gray-50 text-xs text-gray-500 rounded-b-lg">
        💡 Tip: Use browser console for more details. Check Network tab for API issues.
      </div>
    </div>
  );
};

export default DebugConsole;

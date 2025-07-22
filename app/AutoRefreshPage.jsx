"use client"
import React, { useState, useEffect } from 'react';

const AutoRefreshPage = () => {
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [refreshCount, setRefreshCount] = useState(0);
  // Check URL parameters and start auto-refresh if needed
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const autoRefresh = urlParams.get('autoRefresh');
    const startTime = urlParams.get('startTime');
    if (autoRefresh === 'true') {
      setIsAutoRefresh(true);
      // Calculate refresh count based on start time
      if (startTime) {
        const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        setRefreshCount(elapsed);
      }
    }
  }, []);
  // Auto-refresh logic
  useEffect(() => {
    let refreshTimer;
    let countdownTimer;
    if (isAutoRefresh) {
      // Set up the actual refresh timer
      refreshTimer = setTimeout(() => {
        // Add parameters to URL to persist auto-refresh state
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('autoRefresh', 'true');
        if (!currentUrl.searchParams.has('startTime')) {
          currentUrl.searchParams.set('startTime', Date.now().toString());
        }
        // Navigate to the same page with parameters (causes refresh)
        window.location.href = currentUrl.toString();
      }, 1000);
      // Set up countdown display
      let count = 1;
      countdownTimer = setInterval(() => {
        setCountdown(count);
        count--;
        if (count < 0) count = 1;
      }, 100);
    }
    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [isAutoRefresh]);
  const startAutoRefresh = () => {
    setIsAutoRefresh(true);
    setRefreshCount(0);
  };
  const stopAutoRefresh = () => {
    setIsAutoRefresh(false);
    // Remove URL parameters to stop auto-refresh
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.delete('autoRefresh');
    currentUrl.searchParams.delete('startTime');
    // Update URL without refresh
    window.history.replaceState({}, '', currentUrl.toString());
  };
  const handleManualRefresh = () => {
    window.location.reload();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 p-8">
      <div className="max-w-lg mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          :arrows_counterclockwise: React Auto Refresh
        </h1>
        <div className="space-y-6">
          {/* Status Display */}
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-yellow-300 mb-2">
              {isAutoRefresh ? countdown.toFixed(1) : '•••'}
            </div>
            <div className="text-sm text-gray-200">
              {isAutoRefresh ? 'seconds until refresh' : 'auto-refresh stopped'}
            </div>
          </div>
          {/* Control Buttons */}
          <div className="flex gap-3">
            {!isAutoRefresh ? (
              <button
                onClick={startAutoRefresh}
                className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                :arrow_forward: Start Auto Refresh
              </button>
            ) : (
              <button
                onClick={stopAutoRefresh}
                className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 animate-pulse"
              >
                :black_square_for_stop: Stop Auto Refresh
              </button>
            )}
            <button
              onClick={handleManualRefresh}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              :arrows_counterclockwise: Refresh Now
            </button>
          </div>
          {/* Status Info */}
          <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-lg">
            <div className="text-sm text-gray-200 space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-semibold ${isAutoRefresh ? 'text-green-300' : 'text-red-300'}`}>
                  {isAutoRefresh ? ':large_green_circle: Active' : ':red_circle: Stopped'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Refresh Count:</span>
                <span className="font-semibold text-blue-300">{refreshCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Time:</span>
                <span className="font-semibold text-purple-300">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Page Loaded:</span>
                <span className="font-semibold text-yellow-300">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
          {/* Instructions */}
          <div className="bg-blue-500 bg-opacity-20 border border-blue-400 p-4 rounded-lg">
            <div className="text-sm text-blue-100">
              <div className="font-semibold mb-2">:bulb: How it works:</div>
              <ul className="space-y-1 text-xs">
                <li>• Uses URL parameters to persist refresh state</li>
                <li>• Auto-refresh survives page reloads</li>
                <li>• Click "Stop" to disable before next refresh</li>
                <li>• Refresh count tracks total refreshes</li>
              </ul>
            </div>
          </div>
          {/* Alternative Methods */}
          <div className="bg-yellow-600 bg-opacity-20 border border-yellow-400 p-4 rounded-lg">
            <div className="text-sm text-yellow-100">
              <div className="font-semibold mb-2">:wrench: Alternative Methods:</div>
              <div className="text-xs space-y-1">
                <div><strong>Browser Console:</strong></div>
                <code className="bg-black bg-opacity-30 px-2 py-1 rounded text-xs block mt-1">
                  setInterval(() =&gt; location.reload(), 1000)
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AutoRefreshPage; 

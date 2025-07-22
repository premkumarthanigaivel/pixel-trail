"use client"
import React, { useState, useEffect } from 'react';

const AutoRefreshPage = () => {
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [refreshCount, setRefreshCount] = useState(0);

  // Check URL parameters and start auto-refresh if needed
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const autoRefresh = urlParams.get('autoRefresh');
    const interval = urlParams.get('interval');
    const startTime = urlParams.get('startTime');

    if (autoRefresh === 'true' && interval) {
      const intervalSeconds = parseInt(interval);
      setRefreshInterval(intervalSeconds);
      setIsAutoRefresh(true);

      // Calculate how much time has passed and remaining time
      if (startTime) {
        const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        const completed = Math.floor(elapsed / intervalSeconds);
        const remaining = intervalSeconds - (elapsed % intervalSeconds);

        setRefreshCount(completed);
        setCountdown(remaining);
      }
    }
  }, []);

  // Auto-refresh logic
  useEffect(() => {
    let refreshTimer;
    let countdownTimer;

    if (isAutoRefresh) {
      // Set up countdown display (updates every second)
      countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Time to refresh - navigate with updated parameters
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('autoRefresh', 'true');
            currentUrl.searchParams.set('interval', refreshInterval.toString());

            if (!currentUrl.searchParams.has('startTime')) {
              currentUrl.searchParams.set('startTime', Date.now().toString());
            }

            // Use setTimeout to avoid multiple refreshes
            setTimeout(() => {
              window.location.href = currentUrl.toString();
            }, 100);

            return refreshInterval; // Reset countdown
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [isAutoRefresh, refreshInterval]);

  const startAutoRefresh = () => {
    setIsAutoRefresh(true);
    setRefreshCount(0);
    setCountdown(refreshInterval);
  };

  const stopAutoRefresh = () => {
    setIsAutoRefresh(false);
    setCountdown(refreshInterval);

    // Remove URL parameters to stop auto-refresh
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.delete('autoRefresh');
    currentUrl.searchParams.delete('interval');
    currentUrl.searchParams.delete('startTime');

    // Update URL without refresh
    window.history.replaceState({}, '', currentUrl.toString());
  };

  const handleIntervalChange = newInterval => {
    setRefreshInterval(newInterval);
    if (!isAutoRefresh) {
      setCountdown(newInterval);
    }
  };

  const handleManualRefresh = () => {
    window.location.reload();
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const presetIntervals = [5, 10, 15, 30, 60, 120, 300];

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 p-8'>
      <div className='max-w-lg mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8'>
        <h1 className='text-3xl font-bold text-white mb-8 text-center'>
          ⏰ Configurable Auto Refresh
        </h1>

        <div className='space-y-6'>
          {/* Interval Configuration */}
          <div className='bg-white bg-opacity-10 backdrop-blur p-4 rounded-lg'>
            <h3 className='text-white font-semibold mb-3'>
              🔧 Refresh Interval
            </h3>

            {/* Custom Interval Input */}
            <div className='mb-3'>
              <label className='block text-sm text-gray-200 mb-2'>
                Custom Interval (seconds):
              </label>
              <input
                type='number'
                min='1'
                max='3600'
                value={refreshInterval}
                onChange={e =>
                  handleIntervalChange(
                    Math.max(1, parseInt(e.target.value) || 30)
                  )
                }
                disabled={isAutoRefresh}
                className='w-full px-3 py-2 bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 rounded-lg focus:outline-none focus:border-blue-400 disabled:opacity-50'
              />
            </div>

            {/* Preset Buttons */}
            <div className='grid grid-cols-4 gap-2'>
              {presetIntervals.map(interval => (
                <button
                  key={interval}
                  onClick={() => handleIntervalChange(interval)}
                  disabled={isAutoRefresh}
                  className={`px-2 py-1 text-xs rounded transition-all ${
                    refreshInterval === interval
                      ? 'bg-blue-500 text-white'
                      : 'bg-white bg-opacity-20 text-gray-200 hover:bg-opacity-30'
                  } disabled:opacity-50`}
                >
                  {formatTime(interval)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Display */}
          <div className='text-center'>
            <div className='text-5xl font-mono font-bold text-yellow-300 mb-2'>
              {formatTime(countdown)}
            </div>
            <div className='text-sm text-gray-200'>
              {isAutoRefresh
                ? 'until next refresh'
                : `refresh every ${formatTime(refreshInterval)}`}
            </div>
          </div>

          {/* Control Buttons */}
          <div className='flex gap-3'>
            {!isAutoRefresh ? (
              <button
                onClick={startAutoRefresh}
                className='flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105'
              >
                ▶️ Start Auto Refresh
              </button>
            ) : (
              <button
                onClick={stopAutoRefresh}
                className='flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 animate-pulse'
              >
                ⏹️ Stop Auto Refresh
              </button>
            )}

            <button
              onClick={handleManualRefresh}
              className='px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105'
            >
              🔄 Refresh Now
            </button>
          </div>

          {/* Status Info */}
          <div className='bg-white bg-opacity-10 backdrop-blur p-4 rounded-lg'>
            <div className='text-sm text-gray-200 space-y-2'>
              <div className='flex justify-between'>
                <span>Status:</span>
                <span
                  className={`font-semibold ${
                    isAutoRefresh ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {isAutoRefresh ? '🟢 Active' : '🔴 Stopped'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Refresh Interval:</span>
                <span className='font-semibold text-blue-300'>
                  {formatTime(refreshInterval)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Total Refreshes:</span>
                <span className='font-semibold text-purple-300'>
                  {refreshCount}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Current Time:</span>
                <span className='font-semibold text-yellow-300'>
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Page Loaded:</span>
                <span className='font-semibold text-pink-300'>
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className='bg-blue-500 bg-opacity-20 border border-blue-400 p-4 rounded-lg'>
            <div className='text-sm text-blue-100'>
              <div className='font-semibold mb-2'>💡 How to use:</div>
              <ul className='space-y-1 text-xs'>
                <li>• Set your desired refresh interval (5s to 60m)</li>
                <li>• Click "Start" to begin auto-refresh</li>
                <li>• Countdown shows time until next refresh</li>
                <li>• Auto-refresh persists across page reloads</li>
                <li>• Click "Stop" to disable before next refresh</li>
              </ul>
            </div>
          </div>

          {/* Quick Console Alternative */}
          <div className='bg-yellow-600 bg-opacity-20 border border-yellow-400 p-4 rounded-lg'>
            <div className='text-sm text-yellow-100'>
              <div className='font-semibold mb-2'>
                🔧 Browser Console Alternative:
              </div>
              <code className='bg-black bg-opacity-30 px-2 py-1 rounded text-xs block mt-1'>
                setInterval(() =&gt; location.reload(), {refreshInterval * 1000}
                )
              </code>
              <div className='text-xs mt-2 opacity-80'>
                (Paste in browser console for {formatTime(refreshInterval)}{' '}
                refresh)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoRefreshPage;

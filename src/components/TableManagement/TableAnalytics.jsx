import React, { useState, useEffect } from 'react';
import { tableApi } from '../../api/tableApi';
import { toast } from 'react-toastify';
import socket from '../../socket';

const TableAnalytics = ({ isVisible, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (isVisible) {
      fetchAnalytics();
    }
  }, [isVisible, dateRange]);

  useEffect(() => {
    // Socket event listeners for real-time analytics updates
    const handleTableChange = () => {
      if (isVisible) {
        fetchAnalytics();
      }
    };

    socket.on('tableCreated', handleTableChange);
    socket.on('tableUpdated', handleTableChange);
    socket.on('tableDeleted', handleTableChange);
    socket.on('tablesUpdated', handleTableChange);
    socket.on('tablesDeleted', handleTableChange);

    return () => {
      socket.off('tableCreated', handleTableChange);
      socket.off('tableUpdated', handleTableChange);
      socket.off('tableDeleted', handleTableChange);
      socket.off('tablesUpdated', handleTableChange);
      socket.off('tablesDeleted', handleTableChange);
    };
  }, [isVisible]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await tableApi.getAnalytics(dateRange.startDate, dateRange.endDate);
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Table Analytics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6 flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Total Tables</h3>
                <p className="text-2xl font-bold text-blue-900">{analytics.overview.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Available</h3>
                <p className="text-2xl font-bold text-green-900">{analytics.overview.available}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800">Reserved</h3>
                <p className="text-2xl font-bold text-yellow-900">{analytics.overview.reserved}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-800">Occupied</h3>
                <p className="text-2xl font-bold text-red-900">{analytics.overview.occupied}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">Utilization</h3>
                <p className="text-2xl font-bold text-purple-900">{analytics.overview.utilizationRate}%</p>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.sectionBreakdown.map((section) => (
                  <div key={section._id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 capitalize">{section._id || 'Unassigned'}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium">{section.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Available:</span>
                        <span className="font-medium">{section.available}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-600">Reserved:</span>
                        <span className="font-medium">{section.reserved}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Occupied:</span>
                        <span className="font-medium">{section.occupied}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tables
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilization
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.capacityDistribution.map((capacity) => {
                      const utilization = capacity.available > 0 ?
                        ((capacity.count - capacity.available) / capacity.count * 100).toFixed(1) : 0;
                      return (
                        <tr key={capacity._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {capacity._id} seats
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {capacity.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {utilization}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Utilization Trends */}
            {analytics.utilizationTrends && analytics.utilizationTrends.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Trends</h3>
                <div className="space-y-2">
                  {analytics.utilizationTrends.slice(0, 10).map((trend, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(trend.date).toLocaleDateString()}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {trend.total} tables
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {trend.utilizationRate}% utilization
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableAnalytics;

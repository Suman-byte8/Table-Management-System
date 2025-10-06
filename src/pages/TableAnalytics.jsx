import React, { useState, useEffect } from 'react';
import { tableApi } from '../api/tableApi';
import socket from '../socket';

const TableAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();

    // Socket listeners for real-time updates
    socket.on('tableUpdated', () => {
      fetchAnalytics();
    });

    socket.on('tableCreated', () => {
      fetchAnalytics();
    });

    socket.on('tableDeleted', () => {
      fetchAnalytics();
    });

    // Global event listener for refreshTableData
    const handleRefreshTableData = () => {
      console.log('Refreshing table analytics data...');
      fetchAnalytics();
    };

    window.addEventListener('refreshTableData', handleRefreshTableData);

    return () => {
      socket.off('tableUpdated');
      socket.off('tableCreated');
      socket.off('tableDeleted');
      window.removeEventListener('refreshTableData', handleRefreshTableData);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await tableApi.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      setError('Error fetching analytics');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-6">Loading analytics...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Table Analytics</h1>

      {analytics && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-semibold">Total Tables</h3>
              <p className="text-2xl font-bold">{analytics.overview.total}</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-semibold">Available</h3>
              <p className="text-2xl font-bold">{analytics.overview.available}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <h3 className="font-semibold">Reserved</h3>
              <p className="text-2xl font-bold">{analytics.overview.reserved}</p>
            </div>
            <div className="bg-red-100 p-4 rounded">
              <h3 className="font-semibold">Occupied</h3>
              <p className="text-2xl font-bold">{analytics.overview.occupied}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section Breakdown */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Section Breakdown</h2>
              <div className="space-y-2">
                {analytics.sectionBreakdown.map(section => (
                  <div key={section._id} className="flex justify-between p-2 border rounded">
                    <span>{section._id}</span>
                    <span>{section.count} tables</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity Breakdown */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Capacity Breakdown</h2>
              <div className="space-y-2">
                {analytics.capacityBreakdown.map(capacity => (
                  <div key={capacity._id} className="flex justify-between p-2 border rounded">
                    <span>{capacity._id} seats</span>
                    <span>{capacity.count} tables</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Utilization Rate */}
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Overall Utilization Rate</h2>
            <p className="text-3xl font-bold">{analytics.overview.utilizationRate}%</p>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity (Last 30 Days)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentActivity.map(activity => (
                    <tr key={`${activity._id.date}-${activity._id.status}`}>
                      <td className="border px-4 py-2">{activity._id.date}</td>
                      <td className="border px-4 py-2">{activity._id.status}</td>
                      <td className="border px-4 py-2">{activity.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableAnalytics;

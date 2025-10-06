import React, { useState, useEffect } from 'react';
import { tableApi } from '../../api/tableApi';
import { toast } from 'react-toastify';

const MaintenanceManager = ({ isVisible, onClose }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState({
    schedule: 'as_needed',
    notes: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (isVisible) {
      fetchMaintenanceRequiredTables();
    }

    // Global event listener for refreshTableData
    const handleRefreshTableData = () => {
      console.log('Refreshing maintenance manager data...');
      if (isVisible) {
        fetchMaintenanceRequiredTables();
      }
    };

    window.addEventListener('refreshTableData', handleRefreshTableData);

    return () => {
      window.removeEventListener('refreshTableData', handleRefreshTableData);
    };
  }, [isVisible]);

  const fetchMaintenanceRequiredTables = async () => {
    setLoading(true);
    try {
      const response = await tableApi.getMaintenanceRequired();
      setTables(response.data);
    } catch (error) {
      toast.error('Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMaintenance = async (tableId) => {
    try {
      const response = await tableApi.scheduleMaintenance(tableId, {
        ...maintenanceData,
        scheduledDate: new Date().toISOString()
      });
      toast.success('Maintenance scheduled successfully');
      fetchMaintenanceRequiredTables();
      setSelectedTable(null);
    } catch (error) {
      toast.error('Failed to schedule maintenance');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'reserved': return 'text-yellow-600';
      case 'occupied': return 'text-red-600';
      case 'maintenance': return 'text-blue-600';
      case 'out_of_service': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getMaintenanceScheduleColor = (schedule) => {
    switch (schedule) {
      case 'daily': return 'bg-red-100 text-red-800';
      case 'weekly': return 'bg-orange-100 text-orange-800';
      case 'monthly': return 'bg-yellow-100 text-yellow-800';
      case 'as_needed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Maintenance Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading maintenance data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Maintenance Required Tables */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tables Requiring Maintenance
              </h3>

              {tables.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tables require maintenance at this time.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tables.map((table) => (
                    <div key={table._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Table {table.tableNumber}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {table.section} • {table.capacity} seats
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getMaintenanceScheduleColor(table.maintenanceSchedule)}`}>
                          {table.maintenanceSchedule}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${getStatusColor(table.status)}`}>
                            {table.status}
                          </span>
                        </div>
                        {table.daysSinceMaintenance && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Days since maintenance:</span>
                            <span className="font-medium text-red-600">
                              {table.daysSinceMaintenance} days
                            </span>
                          </div>
                        )}
                        {table.nextMaintenanceDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Next maintenance:</span>
                            <span className="font-medium">
                              {new Date(table.nextMaintenanceDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedTable(table)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Schedule
                        </button>
                        <button
                          onClick={() => handleScheduleMaintenance(table._id)}
                          className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Quick Fix
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Maintenance Scheduling Form */}
            {selectedTable && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Schedule Maintenance for Table {selectedTable.tableNumber}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance Schedule
                    </label>
                    <select
                      value={maintenanceData.schedule}
                      onChange={(e) => setMaintenanceData(prev => ({ ...prev, schedule: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="as_needed">As Needed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={maintenanceData.priority}
                      onChange={(e) => setMaintenanceData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={maintenanceData.notes}
                    onChange={(e) => setMaintenanceData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter maintenance notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleScheduleMaintenance(selectedTable._id)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Schedule Maintenance
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceManager;

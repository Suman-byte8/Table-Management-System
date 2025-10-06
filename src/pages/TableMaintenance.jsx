import React, { useState, useEffect } from 'react';
import { tableApi } from '../api/tableApi';
import socket from '../socket';

const TableMaintenance = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [maintenanceData, setMaintenanceData] = useState({
    type: 'regular',
    notes: '',
    scheduledDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTables();

    // Socket listeners
    socket.on('tableUpdated', (table) => {
      setTables(prev => prev.map(t => t._id === table._id ? table : t));
    });

    // Global event listener for refreshTableData
    const handleRefreshTableData = () => {
      console.log('Refreshing table maintenance data...');
      fetchTables();
    };

    window.addEventListener('refreshTableData', handleRefreshTableData);

    return () => {
      socket.off('tableUpdated');
      window.removeEventListener('refreshTableData', handleRefreshTableData);
    };
  }, []);

  const fetchTables = async () => {
    try {
      const response = await tableApi.getAll();
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault();
    if (!selectedTable || !maintenanceData.scheduledDate) {
      setMessage('Please select a table and date');
      return;
    }

    setLoading(true);
    try {
      await tableApi.scheduleMaintenance(selectedTable, maintenanceData);
      setMessage('Maintenance scheduled successfully');
      setMaintenanceData({ type: 'regular', notes: '', scheduledDate: '' });
      setSelectedTable('');
      fetchTables(); // Refresh tables
    } catch (error) {
      setMessage('Error scheduling maintenance');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setMaintenanceData({
      ...maintenanceData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Table Maintenance Scheduling</h1>

      {message && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Schedule Maintenance</h2>
          <form onSubmit={handleScheduleMaintenance} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Table</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Choose a table</option>
                {tables.map(table => (
                  <option key={table._id} value={table._id}>
                    {table.tableNumber} - {table.section} (Status: {table.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Maintenance Type</label>
              <select
                name="type"
                value={maintenanceData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="regular">Regular</option>
                <option value="deep">Deep Clean</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Scheduled Date</label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={maintenanceData.scheduledDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={maintenanceData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Maintenance'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Tables Requiring Maintenance</h2>
          <div className="space-y-2">
            {tables.filter(table => table.status === 'maintenance' || table.nextMaintenanceDate).map(table => (
              <div key={table._id} className="p-4 border rounded">
                <h3 className="font-semibold">{table.tableNumber}</h3>
                <p>Section: {table.section}</p>
                <p>Status: {table.status}</p>
                {table.nextMaintenanceDate && (
                  <p>Next Maintenance: {new Date(table.nextMaintenanceDate).toLocaleString()}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableMaintenance;

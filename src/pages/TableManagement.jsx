import React, { useState, useEffect, useMemo } from 'react';
import { tableApi } from '../api/tableApi';
import { toast } from 'react-toastify';
import TableGrid from '../components/TableManagement/TableGrid';
import TableCard from '../components/TableManagement/TableCard';
import TableDetails from './TableDetails';
import BulkOperations from '../components/TableManagement/BulkOperations';
import TableAnalytics from '../components/TableManagement/TableAnalytics';
import MaintenanceManager from '../components/TableManagement/MaintenanceManager';
import ExportManager from '../components/TableManagement/ExportManager';
import socket from '../socket';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [filters, setFilters] = useState({
    section: '',
    status: '',
    capacity: '',
    search: '',
    priority: '',
    features: []
  });
  const [sortKey, setSortKey] = useState('tableNumber');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchTables();

    // Socket event listeners for real-time updates
    socket.on('tableCreated', (newTable) => {
      setTables((prevTables) => [...prevTables, newTable]);
      toast.info(`New table created: ${newTable.tableNumber}`);
    });

    socket.on('tableUpdated', (updatedTable) => {
      setTables((prevTables) =>
        prevTables.map((table) =>
          table._id === updatedTable._id ? updatedTable : table
        )
      );
      toast.info(`Table updated: ${updatedTable.tableNumber}`);
    });

    socket.on('tableDeleted', ({ id }) => {
      setTables((prevTables) => prevTables.filter((table) => table._id !== id));
      toast.info('Table deleted');
    });

    socket.on('tablesUpdated', ({ tableIds, updates }) => {
      setTables((prevTables) =>
        prevTables.map((table) =>
          tableIds.includes(table._id) ? { ...table, ...updates } : table
        )
      );
      toast.info(`${tableIds.length} tables updated`);
    });

    socket.on('tablesDeleted', ({ tableIds }) => {
      setTables((prevTables) =>
        prevTables.filter((table) => !tableIds.includes(table._id))
      );
      toast.info(`${tableIds.length} tables deleted`);
    });

    // Global event listener for refreshTableData
    const handleRefreshTableData = () => {
      console.log('Refreshing table data...');
      fetchTables();
    };

    window.addEventListener('refreshTableData', handleRefreshTableData);

    return () => {
      socket.off('tableCreated');
      socket.off('tableUpdated');
      socket.off('tableDeleted');
      socket.off('tablesUpdated');
      socket.off('tablesDeleted');
      window.removeEventListener('refreshTableData', handleRefreshTableData);
    };
  }, []);

  useEffect(() => {
    fetchTables();
  }, [filters]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await tableApi.getAll(filters);
      setTables(response.data);
    } catch (error) {
      toast.error('Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  const sortedTables = useMemo(() => {
    return [...tables].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [tables, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleTableUpdate = async (id, updateData) => {
    // If child has already performed the update (local-only), don't PUT again
    if (updateData && updateData.__localOnly) {
      setTables(prev => prev.map(t => (t._id === id ? { ...t, ...updateData, __localOnly: undefined } : t)));
      setSelectedTable(null);
      return;
    }
    try {
      await tableApi.update(id, updateData);
      fetchTables();
      setSelectedTable(null);
    } catch (error) {
      // Surface server message if present
      const msg = error?.response?.data?.message || 'Failed to update table';
      toast.error(msg);
    }
  };

  const handleTableDelete = async (id) => {
    try {
      await tableApi.delete(id);
      toast.success('Table deleted successfully');
      fetchTables();
    } catch (error) {
      toast.error('Failed to delete table');
    }
  };

  const handleCreateTable = async (tableData) => {
    try {
      const response = await tableApi.create(tableData);
      toast.success('Table created successfully');
      fetchTables();
    } catch (error) {
      toast.error('Failed to create table');
    }
  };

  const clearFilters = () => {
    setFilters({
      section: '',
      status: '',
      capacity: '',
      search: '',
      priority: '',
      features: []
    });
  };

  const handleTableSelect = (tableId, isSelected) => {
    if (isSelected) {
      setSelectedTables(prev => [...prev, tableId]);
    } else {
      setSelectedTables(prev => prev.filter(id => id !== tableId));
    }
  };

  const clearSelection = () => {
    setSelectedTables([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAnalytics(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>

            <button
              onClick={() => setShowMaintenance(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Maintenance
            </button>

            <button
              onClick={() => setShowExport(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search tables..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.section}
              onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
              <option value="restaurant">Restaurant</option>
              <option value="bar">Bar</option>
              <option value="outdoor">Outdoor</option>
              <option value="private">Private</option>
              <option value="patio">Patio</option>
              <option value="rooftop">Rooftop</option>
              <option value="vip">VIP</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="occupied">Occupied</option>
              <option value="dirty">Dirty</option>
              <option value="maintenance">Maintenance</option>
              <option value="out_of_service">Out of Service</option>
            </select>

            <input
              type="number"
              placeholder="Min Capacity"
              value={filters.capacity}
              onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
            />

            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Operations */}
      <BulkOperations
        selectedTables={selectedTables}
        onClearSelection={clearSelection}
        onRefresh={fetchTables}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tables...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTables.map(table => (
              <TableCard
                key={table._id}
                table={table}
                onTableSelect={handleTableSelect}
                onTableSelectSingle={setSelectedTable}
                onTableUpdate={handleTableUpdate}
                onTableDelete={handleTableDelete}
                onAssignReservation={(reservationId) => {
                  // Refresh tables and reservations after assignment
                  fetchTables();
                  // You might want to emit a socket event or refresh reservation queue here
                }}
              />
            ))}
          </div>

          {selectedTable && (
            <TableDetails
              table={selectedTable}
              onClose={() => setSelectedTable(null)}
              onUpdate={handleTableUpdate}
            />
          )}
        </>
      )}

      {/* Modals */}
      <TableAnalytics
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <MaintenanceManager
        isVisible={showMaintenance}
        onClose={() => setShowMaintenance(false)}
      />

      <ExportManager
        isVisible={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
};

export default TableManagement;

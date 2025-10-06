import React, { useState, useEffect } from "react";
import { tableApi } from "../../api/tableApi";
import { toast } from "react-toastify";
import socket from "../../socket";

const TableInfo = ({ table, onTableUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'reserved':
        return 'text-yellow-600';
      case 'occupied':
        return 'text-red-600';
      case 'dirty':
        return 'text-gray-600';
      case 'maintenance':
        return 'text-blue-600';
      case 'out_of_service':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const updateData = {
        status: newStatus,
        lastStatusChange: new Date().toISOString()
      };

      await tableApi.update(table._id, updateData);
      onTableUpdate(table._id, { ...table, status: newStatus });
      toast.success(`Table status updated to ${newStatus.replace('_', ' ')}`);
      setShowStatusMenu(false);
    } catch (error) {
      toast.error('Failed to update table status');
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceSchedule = async (maintenanceData) => {
    try {
      setLoading(true);
      const updateData = {
        ...maintenanceData,
        lastMaintenanceDate: new Date().toISOString()
      };

      await tableApi.update(table._id, updateData);
      onTableUpdate(table._id, { ...table, ...updateData });
      toast.success('Maintenance scheduled successfully');
      setShowMaintenanceModal(false);
    } catch (error) {
      toast.error('Failed to schedule maintenance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      available: "✓",
      reserved: "🟡",
      occupied: "👥",
      dirty: "🧹",
      maintenance: "🔧",
      out_of_service: "❌"
    };
    return icons[status] || "✓";
  };

  useEffect(() => {
    // Set up socket listeners for real-time updates
    socket.on('tableUpdated', (updatedTable) => {
      console.log('Table updated:', updatedTable);
      if (updatedTable._id === table._id) {
        onTableUpdate && onTableUpdate(table._id, updatedTable);
        toast.info('Table updated');
      }
    });

    socket.on('tableDeleted', ({ id }) => {
      console.log('Table deleted:', id);
      if (id === table._id) {
        toast.warning('This table has been deleted');
        // Force a refresh of the parent component
        window.dispatchEvent(new CustomEvent('refreshTableDetails', { detail: { _id: table._id } }));
      }
    });

    // Global event listener for refreshTableData
    const handleRefreshTableData = () => {
      console.log('Refreshing table data...');
      // This will trigger a re-render of the parent component
    };

    window.addEventListener('refreshTableData', handleRefreshTableData);

    // Cleanup socket listeners on unmount
    return () => {
      socket.off('tableUpdated');
      socket.off('tableDeleted');
      window.removeEventListener('refreshTableData', handleRefreshTableData);
    };
  }, [table._id, onTableUpdate]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Table Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Table Number */}
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M17 7h.01M7 12h.01M17 12h.01M7 17h.01M17 17h.01M7 22h.01M17 22h.01" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Table Number</p>
            <p className="text-lg font-bold text-gray-800">{table.tableNumber || table._id}</p>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 11.049a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Capacity</p>
            <p className="text-lg font-bold text-gray-800">{table.capacity}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className={`text-lg font-bold ${getStatusColor(table.status)}`}>
              {table.status ? table.status.charAt(0).toUpperCase() + table.status.slice(1) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Section */}
        {table.section && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Section</p>
              <p className="text-lg font-bold text-gray-800 capitalize">{table.section}</p>
            </div>
          </div>
        )}

        {/* Location */}
        {table.locationDescription && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-lg font-bold text-gray-800">{table.locationDescription}</p>
            </div>
          </div>
        )}

        {/* Features */}
        {table.features && table.features.length > 0 && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Features</p>
              <p className="text-lg font-bold text-gray-800">{table.features.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Priority */}
        {table.priority && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Priority</p>
              <p className="text-lg font-bold text-gray-800">{table.priority}/10</p>
            </div>
          </div>
        )}

        {/* Last Maintenance */}
        {table.lastMaintenanceDate && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Maintenance</p>
              <p className="text-lg font-bold text-gray-800">{new Date(table.lastMaintenanceDate).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {/* Next Maintenance */}
        {table.nextMaintenanceDate && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Next Maintenance</p>
              <p className="text-lg font-bold text-gray-800">{new Date(table.nextMaintenanceDate).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {/* Total Reservations */}
        {table.totalReservations !== undefined && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reservations</p>
              <p className="text-lg font-bold text-gray-800">{table.totalReservations}</p>
            </div>
          </div>
        )}

        {/* Utilization Rate */}
        {table.utilizationRate !== undefined && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Utilization Rate</p>
              <p className="text-lg font-bold text-gray-800">{table.utilizationRate.toFixed(2)}%</p>
            </div>
          </div>
        )}

        {/* Special Notes */}
        {table.specialNotes && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Special Notes</p>
              <p className="text-lg font-bold text-gray-800">{table.specialNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableInfo;
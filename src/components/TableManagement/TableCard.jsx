import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tableApi } from "../../api/tableApi";
import { reservationApi } from "../../api/reservationsApi";
import { toast } from "react-toastify";
import socket from "../../socket";

const TableCard = ({ table, onTableUpdate, onAssignReservation }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Status → Color mapping
  const statusColors = {
    available: "bg-green-100 text-green-800 border-l-4 border-green-500",
    reserved: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
    occupied: "bg-red-100 text-red-800 border-l-4 border-red-500",
    dirty: "bg-gray-100 text-gray-800 border-l-4 border-gray-500",
    maintenance: "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
    out_of_service: "bg-purple-100 text-purple-800 border-l-4 border-purple-500",
  };

  // Get status color or default to available
  const cardClass = statusColors[table.status] || statusColors.available;

  // Format status for display
  const displayStatus = table.status
    ? table.status.charAt(0).toUpperCase() + table.status.slice(1).replace('_', ' ')
    : 'Available';

  // ✅ USE _id FOR ROUTING (MongoDB ObjectId)
  const tableId = table._id || table.id;

  if (!tableId) {
    console.warn("⚠️ Table has no ID:", table);
    return null;
  }

  useEffect(() => {
    // Set up socket listeners for real-time updates
    socket.on('tableUpdated', (updatedTable) => {
      console.log('Table updated:', updatedTable);
      if (updatedTable._id === tableId) {
        onTableUpdate && onTableUpdate(tableId, updatedTable);
        toast.info('Table updated');
      }
    });

    socket.on('tableDeleted', ({ id }) => {
      console.log('Table deleted:', id);
      if (id === tableId) {
        toast.warning('This table has been deleted');
        // Force a refresh of the parent component
        window.dispatchEvent(new CustomEvent('refreshTableData'));
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
  }, [tableId, onTableUpdate]);

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const updateData = {
        status: newStatus,
        lastStatusChange: new Date().toISOString()
      };

      await tableApi.update(tableId, updateData);
      onTableUpdate(tableId, { ...table, status: newStatus });
      toast.success(`Table ${table.tableNumber} status updated to ${newStatus.replace('_', ' ')}`);
      setShowStatusMenu(false);
    } catch (error) {
      toast.error('Failed to update table status');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = async () => {
    try {
      setLoading(true);
      const response = await reservationApi.getAll({
        type: "restaurant",
        status: "pending"
      });
      const reservations = Array.isArray(response) ? response : response?.data || [];
      setPendingReservations(reservations);
      setShowAssignModal(true);
    } catch (error) {
      toast.error('Failed to fetch pending reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleReservationAssign = async (reservationId) => {
    try {
      // Update reservation status
      await reservationApi.update(reservationId, {
        status: 'confirmed',
        assignedTable: tableId
      });

      // Update table status
      await handleStatusChange('reserved');

      toast.success('Reservation assigned successfully');
      setShowAssignModal(false);
      onAssignReservation && onAssignReservation(reservationId);
    } catch (error) {
      toast.error('Failed to assign reservation');
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

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:bg-gray-100 ${cardClass}`}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-gray-900">
            {table.tableNumber || `Table ${tableId}`}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(table.status)}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cardClass.split(' ')[0]}`}>
              {displayStatus}
            </span>
          </div>
        </div>

        <p className="text-gray-600 flex items-center mt-1">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.336 0" />
          </svg>
          Capacity: {table.capacity}
        </p>

        {table.section && (
          <p className="text-gray-500 text-sm mt-1 capitalize">
            {table.section} Section
          </p>
        )}

        {table.locationDescription && (
          <p className="text-gray-500 text-sm mt-1">
            {table.locationDescription}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={handleAssignClick}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Assign
          </button>

          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={loading}
              className="px-3 py-2 bg-gray-600 text-white text-sm font-semibold rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Status
            </button>

            {showStatusMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusChange('available')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ✓ Available
                  </button>
                  <button
                    onClick={() => handleStatusChange('reserved')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🟡 Reserved
                  </button>
                  <button
                    onClick={() => handleStatusChange('occupied')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    👥 Occupied
                  </button>
                  <button
                    onClick={() => handleStatusChange('dirty')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🧹 Dirty
                  </button>
                  <button
                    onClick={() => handleStatusChange('maintenance')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🔧 Maintenance
                  </button>
                  <button
                    onClick={() => handleStatusChange('out_of_service')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ❌ Out of Service
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Link to={`/table-details/${tableId}`} className="w-full">
          <button className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
            View Details
          </button>
        </Link>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assign Reservation</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {pendingReservations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending reservations available</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pendingReservations.slice(0, 5).map((reservation) => (
                  <div key={reservation._id} className="border border-gray-200 rounded p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{reservation.guestInfo?.name || 'Unknown Guest'}</p>
                        <p className="text-sm text-gray-500">Party of {reservation.noOfDiners}</p>
                        <p className="text-sm text-gray-500">{reservation.timeSlot}</p>
                      </div>
                      <button
                        onClick={() => handleReservationAssign(reservation._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close status menu */}
      {showStatusMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowStatusMenu(false)}
        />
      )}
    </div>
  );
};

export default TableCard;

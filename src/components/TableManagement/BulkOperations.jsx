import React, { useState } from 'react';
import { tableApi } from '../../api/tableApi';
import { toast } from 'react-toastify';

const BulkOperations = ({ selectedTables, onClearSelection, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [operationType, setOperationType] = useState('');
  const [operationData, setOperationData] = useState({});

  const handleBulkUpdate = async (updates) => {
    if (selectedTables.length === 0) {
      toast.error('No tables selected');
      return;
    }

    setIsLoading(true);
    try {
      const response = await tableApi.bulkUpdate(selectedTables, updates);
      toast.success(response.message);
      onClearSelection();
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTables.length === 0) {
      toast.error('No tables selected');
      return;
    }

    setIsLoading(true);
    try {
      const response = await tableApi.bulkDelete(selectedTables);
      toast.success(response.message);
      onClearSelection();
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk delete failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (status) => {
    handleBulkUpdate({ status });
  };

  const handleSectionUpdate = (section) => {
    handleBulkUpdate({ section });
  };

  const handleMaintenanceSchedule = (schedule) => {
    handleBulkUpdate({ maintenanceSchedule: schedule });
  };

  const confirmOperation = (type, data = {}) => {
    setOperationType(type);
    setOperationData(data);
    setShowConfirmDialog(true);
  };

  const executeConfirmedOperation = () => {
    switch (operationType) {
      case 'delete':
        handleBulkDelete();
        break;
      case 'status':
        handleStatusUpdate(operationData.status);
        break;
      case 'section':
        handleSectionUpdate(operationData.section);
        break;
      case 'maintenance':
        handleMaintenanceSchedule(operationData.schedule);
        break;
      default:
        break;
    }
    setShowConfirmDialog(false);
  };

  if (selectedTables.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-800">
              {selectedTables.length} table{selectedTables.length !== 1 ? 's' : ''} selected
            </span>

            {/* Quick Status Updates */}
            <div className="flex space-x-2">
              <button
                onClick={() => confirmOperation('status', { status: 'available' })}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50"
              >
                Mark Available
              </button>
              <button
                onClick={() => confirmOperation('status', { status: 'maintenance' })}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50"
              >
                Mark Maintenance
              </button>
              <button
                onClick={() => confirmOperation('status', { status: 'out_of_service' })}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Out of Service
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => confirmOperation('delete')}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Delete Selected
            </button>
            <button
              onClick={onClearSelection}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Operation
            </h3>
            <p className="text-gray-600 mb-6">
              {operationType === 'delete' && `Are you sure you want to delete ${selectedTables.length} table(s)? This action cannot be undone.`}
              {operationType === 'status' && `Are you sure you want to update the status of ${selectedTables.length} table(s)?`}
              {operationType === 'section' && `Are you sure you want to update the section of ${selectedTables.length} table(s)?`}
              {operationType === 'maintenance' && `Are you sure you want to update the maintenance schedule of ${selectedTables.length} table(s)?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedOperation}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkOperations;

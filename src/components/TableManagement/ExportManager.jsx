import React, { useState } from 'react';
import { tableApi } from '../../api/tableApi';
import { toast } from 'react-toastify';

const ExportManager = ({ isVisible, onClose }) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    section: '',
    status: '',
    includeInactive: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filters = {};
      if (exportOptions.section) filters.section = exportOptions.section;
      if (exportOptions.status) filters.status = exportOptions.status;

      await tableApi.exportTables(exportOptions.format, filters);
      toast.success(`Export completed successfully!`);
      onClose();
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptionChange = (field, value) => {
    setExportOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Export Tables Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={exportOptions.format}
              onChange={(e) => handleOptionChange('format', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section (Optional)
            </label>
            <select
              value={exportOptions.section}
              onChange={(e) => handleOptionChange('section', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status (Optional)
            </label>
            <select
              value={exportOptions.status}
              onChange={(e) => handleOptionChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="occupied">Occupied</option>
              <option value="dirty">Dirty</option>
              <option value="maintenance">Maintenance</option>
              <option value="out_of_service">Out of Service</option>
            </select>
          </div>

          {/* Include Inactive Tables */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeInactive"
              checked={exportOptions.includeInactive}
              onChange={(e) => handleOptionChange('includeInactive', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeInactive" className="ml-2 block text-sm text-gray-700">
              Include inactive tables
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportManager;

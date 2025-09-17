import React from "react";

const TableFilters = ({ filters, onFilterChange, onResetFilters, totalTables, filteredCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Tables</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Section Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section
          </label>
          <select
            value={filters.section}
            onChange={(e) => onFilterChange('section', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sections</option>
            <option value="restaurant">Restaurant</option>
            <option value="bar">Bar</option>
            <option value="outdoor">Outdoor</option>
            <option value="private">Private Room</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="occupied">Occupied</option>
            <option value="dirty">Dirty</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Min Capacity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Capacity
          </label>
          <input
            type="number"
            min="1"
            value={filters.minCapacity}
            onChange={(e) => onFilterChange('minCapacity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min"
          />
        </div>

        {/* Max Capacity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Capacity
          </label>
          <input
            type="number"
            min="1"
            value={filters.maxCapacity}
            onChange={(e) => onFilterChange('maxCapacity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max"
          />
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={onResetFilters}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalTables}</span> tables
        </p>
      </div>
    </div>
  );
};

export default TableFilters;
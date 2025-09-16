import React from "react";

const TableInfo = ({ table }) => {
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
      default:
        return 'text-gray-600';
    }
  };

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
      </div>
    </div>
  );
};

export default TableInfo;
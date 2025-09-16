import React from "react";

const TableInfo = ({ table }) => {
  const statusColor = table.status === "available" ? "text-green-600" : "text-red-600";

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Table Information</h2>
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
            <p className="text-lg font-bold text-gray-800">{table.id}</p>
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
            <p className={`text-lg font-bold ${statusColor}`}>{table.status.charAt(0).toUpperCase() + table.status.slice(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableInfo;
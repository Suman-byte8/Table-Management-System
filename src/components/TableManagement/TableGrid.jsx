import React from 'react';

const TableGrid = ({ tables, onSort, sortKey, sortOrder }) => {
  const renderSortArrow = (key) => {
    if (sortKey === key) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow overflow-hidden">
      {/* Header Row */}
      <div className="grid grid-cols-4 gap-6 px-6 py-3 border-b-2 border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onSort('tableNumber')}
        >
          Table Number{renderSortArrow('tableNumber')}
        </div>
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onSort('section')}
        >
          Section{renderSortArrow('section')}
        </div>
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onSort('capacity')}
        >
          Capacity{renderSortArrow('capacity')}
        </div>
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onSort('status')}
        >
          Status{renderSortArrow('status')}
        </div>
      </div>

      {/* Data Rows */}
      <div className="divide-y divide-gray-200">
        {tables.length > 0 ? (
          tables.map((table) => (
            <div
              key={table._id}
              className="grid grid-cols-4 gap-6 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="whitespace-nowrap">{table.tableNumber}</div>
              <div className="whitespace-nowrap">{table.section}</div>
              <div className="whitespace-nowrap">{table.capacity}</div>
              <div className="whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    table.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : table.status === 'occupied'
                      ? 'bg-red-100 text-red-800'
                      : table.status === 'reserved'
                      ? 'bg-yellow-100 text-yellow-800'
                      : table.status === 'dirty'
                      ? 'bg-gray-100 text-gray-800'
                      : table.status === 'maintenance'
                      ? 'bg-blue-100 text-blue-800'
                      : table.status === 'out_of_service'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {table.status ? table.status.charAt(0).toUpperCase() + table.status.slice(1).replace('_', ' ') : 'Unknown'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-gray-500 italic">
            No tables available.
          </div>
        )}
      </div>
    </div>
  );
};

export default TableGrid;
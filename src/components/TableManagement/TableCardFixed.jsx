import React from "react";
import { Link } from "react-router-dom";

const TableCard = ({
  table,
  isSelected = false,
  onSelect = null,
  onEdit = null,
  onDelete = null
}) => {
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
  const cardClass = statusColors[table?.status] || statusColors.available;

  // Format status for display
  const displayStatus = table?.status
    ? table.status.charAt(0).toUpperCase() + table.status.slice(1).replace('_', ' ')
    : 'Available';

  // ✅ USE _id FOR ROUTING (MongoDB ObjectId)
  const tableId = table?._id || table?.id;

  if (!tableId || !table) {
    console.warn("⚠️ Table has no ID or is undefined:", table);
    return null; // or show error state
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${cardClass} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-gray-900">
            {table.tableNumber || `Table ${tableId}`}
          </h3>
          <div className="flex items-center space-x-2">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(tableId, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            )}
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
        {table.priority && (
          <p className="text-gray-500 text-sm mt-1">
            Priority: {table.priority}/10
          </p>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        <Link to={`/table-details/${tableId}`} className="flex-1">
          <button className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
            View Details
          </button>
        </Link>
        {onEdit && (
          <button
            onClick={() => onEdit(table)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(tableId)}
            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TableCard;

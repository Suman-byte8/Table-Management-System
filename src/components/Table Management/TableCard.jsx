import React from "react";

const TableCard = ({ table }) => {
  // Status → Color mapping
  const statusColors = {
    free: "bg-green-100 text-green-800 border-l-4 border-green-500",
    reserved: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
    occupied: "bg-red-100 text-red-800 border-l-4 border-red-500",
  };

  const cardClass = statusColors[table.status] || statusColors.free;

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${cardClass}`}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-gray-900">Table {table.id}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cardClass.split(' ')[0]}`}>
            {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 flex items-center mt-1">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.336 0" />
          </svg>
          Capacity: {table.capacity}
        </p>
      </div>
      <button className="w-full mt-4 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
        Actions
      </button>
    </div>
  );
};

export default TableCard;
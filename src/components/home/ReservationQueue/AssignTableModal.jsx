// src/components/ReservationQueue/AssignTableModal.jsx
import React from "react";
import { FaTimes } from "react-icons/fa";

const AssignTableModal = ({ reservation, availableTables = [], onAssign, onClose }) => {
  // Optional: Add a defensive check/filter if needed, though it should be pre-filtered
  // const filteredTables = availableTables.filter(table => table.status === 'available');

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h3 className="text-lg font-bold mb-4">
          Assign Table to {reservation?.guestName || "Guest"}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Party of {reservation?.partySize || "N/A"} • {reservation?.time || "N/A"}
        </p>

        {/* Available Tables */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {availableTables && availableTables.length > 0 ? (
            availableTables.map((table) => {
              const isReserved = table.status === 'reserved';
              const isAvailable = table.status === 'available' && table._id;
              return (
                <div
                  key={table.id} // Assuming table.id is unique and reliable
                  onClick={() => {
                    if (isAvailable) {
                      onAssign(table.id); // Pass the id used for identification in the list
                    }
                  }}
                  className={`p-3 border rounded-md transition-colors flex justify-between items-center ${
                    isAvailable
                      ? "border-gray-200 hover:bg-gray-50 cursor-pointer"
                      : "border-gray-300 bg-gray-100 cursor-not-allowed"
                  }`}
                  title={isAvailable ? "Click to assign" : isReserved ? "Table is reserved" : "Table data incomplete"}
                >
                  <div>
                    {/* Display tableNumber if available, otherwise fall back to id */}
                    <p className="font-semibold">{table.tableNumber || table.id}</p>
                    <p className="text-sm text-gray-500">
                      {table.capacity} seats • {table.section}
                    </p>
                    {/* Optional: Show _id for debugging (remove in production) */}
                    {/* <p className="text-xs text-gray-400">ID: {table._id}</p> */}
                  </div>
                  {isReserved ? (
                    <span className="text-red-600 text-sm font-medium">Reserved</span>
                  ) : isAvailable ? (
                    <span className="text-green-600 text-sm font-medium">Assign</span>
                  ) : (
                    <span className="text-red-500 text-xs">Error</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center bg-gray-50 rounded-md">
              <p className="text-gray-600">No suitable tables available right now.</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting filters or check back later.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          {/* Show "Assign First Available" only if there are available tables */}
          {availableTables && availableTables.length > 0 && availableTables.some(t => t.status === 'available' && t._id) && (
            <button
              onClick={() => {
                const firstAvailableTable = availableTables.find(t => t.status === 'available' && t._id);
                if (firstAvailableTable) {
                  onAssign(firstAvailableTable.id);
                }
              }}
              className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Assign First Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTableModal;

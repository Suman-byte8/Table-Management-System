import React from "react";
import { FaTimes } from "react-icons/fa";

const AssignTableModal = ({ reservation, availableTables, onAssign, onClose }) => {
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
          Assign Table to {reservation.guestName}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Party of {reservation.partySize} • {reservation.time}
        </p>

        {/* Available Tables */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {availableTables.length > 0 ? (
            availableTables.map((table) => (
              <div
                key={table.id}
                onClick={() => onAssign(table.id)}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{table.id}</p>
                  <p className="text-sm text-gray-500">
                    {table.capacity} seats • {table.section}
                  </p>
                </div>
                <span className="text-green-600 text-sm font-medium">Assign</span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center bg-gray-50 rounded-md">
              <p className="text-gray-600">No suitable tables available right now.</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting party size or check back later.
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
          {availableTables.length > 0 && (
            <button
              onClick={() => onAssign(availableTables[0].id)}
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
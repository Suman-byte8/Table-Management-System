import React from "react";
import { FaUtensils, FaGlassMartiniAlt, FaUsers, FaChair } from "react-icons/fa";

// Sample table data
const tables = [
  { id: "T1", occupied: 4, capacity: 4, status: "booked" },
  { id: "T2", occupied: 0, capacity: 2, status: "empty" },
  { id: "T3", occupied: 5, capacity: 6, status: "booked" },
  { id: "T4", occupied: 0, capacity: 4, status: "empty" },
  { id: "T5", occupied: 0, capacity: 8, status: "empty" },
  { id: "T6", occupied: 2, capacity: 2, status: "booked" },
  { id: "T7", occupied: 0, capacity: 4, status: "empty" },
  { id: "T8", occupied: 0, capacity: 6, status: "empty" },
  { id: "T9", occupied: 3, capacity: 4, status: "booked" },
  { id: "T10", occupied: 0, capacity: 2, status: "empty" },
];

const FloorPlanView = () => {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Floor Plan</h1>
          <p className="text-gray-500 text-base mt-2">
            A simplified view of your restaurant's floor plan. Tables are
            color-coded for quick status checks.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex px-4 -mb-px">
              <button className="flex items-center py-4 px-1 border-b-2 border-orange-500 text-orange-500 font-semibold text-sm">
                <FaUtensils className="mr-2" /> Restaurant
              </button>
              <button className="flex items-center py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-orange-500 ml-8 text-sm font-medium">
                <FaGlassMartiniAlt className="mr-2" /> Bar
              </button>
            </nav>
          </div>

          {/* Floor Plan Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {tables.map((table) => {
                const isBooked = table.status === "booked";
                return (
                  <div
                    key={table.id}
                    className={`rounded-md p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 shadow-sm ${
                      isBooked
                        ? "bg-orange-100 text-orange-700 border border-orange-400"
                        : "bg-teal-100 text-teal-700 border border-teal-400"
                    }`}
                  >
                    <p className="font-bold text-lg">{table.id}</p>
                    <div className="flex items-center mt-2">
                      {isBooked ? (
                        <FaUsers className="mr-1 text-sm" />
                      ) : (
                        <FaChair className="mr-1 text-sm" />
                      )}
                      <p className="text-sm font-medium">
                        {table.occupied} / {table.capacity}
                      </p>
                    </div>
                    <p className="text-xs mt-1 uppercase font-semibold tracking-wider">
                      {isBooked ? "Booked" : "Empty"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanView;

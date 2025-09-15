import React from "react";

// sample tables data
const tables = [
  { id: "T1", seats: 4, status: "available" },
  { id: "T2", seats: 2, status: "reserved" },
  { id: "T3", seats: 6, status: "occupied" },
  { id: "T4", seats: 8, status: "available" },
  { id: "T5", seats: 4, status: "reserved" },
];

// status → color mapping
const statusColors = {
  available: "bg-green-500",
  reserved: "bg-yellow-500",
  occupied: "bg-red-500",
};

const FloorPlan = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Floor Plan</h2>
      <div className="grid grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition cursor-pointer"
          >
            {/* table circle */}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-lg font-semibold ${statusColors[table.status]}`}
            >
              {table.id}
            </div>
            {/* seats info */}
            <p className="mt-3 text-gray-700 text-sm">
              {table.seats} seats
            </p>
            {/* status badge */}
            <span
              className={`mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                table.status === "available"
                  ? "bg-green-100 text-green-700"
                  : table.status === "reserved"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {table.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPlan;

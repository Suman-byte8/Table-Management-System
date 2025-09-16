import React from "react";

const StatsGrid = () => {
  const stats = [
    { value: "32", label: "Reservations", color: "text-gray-900" },
    { value: "18", label: "Seated", color: "text-gray-900" },
    { value: "12", label: "Available Tables", color: "text-gray-900" },
    { value: "2", label: "No-shows", color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-md border border-gray-200 text-center"
        >
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
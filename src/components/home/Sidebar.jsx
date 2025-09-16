import React from "react";
import { FaPlus, FaListUl, FaDownload } from "react-icons/fa";

const Sidebar = () => {
  // ✅ Filter Config — Define all filters as objects
  const filters = [
    {
      label: "Section",
      key: "section",
      options: [
        { value: "", label: "All Sections" },
        { value: "restaurant", label: "Restaurant" },
        { value: "bar", label: "Bar" },
      ],
    },
    {
      label: "Status",
      key: "status",
      options: [
        { value: "", label: "All Statuses" },
        { value: "available", label: "Available" },
        { value: "reserved", label: "Reserved" },
        { value: "occupied", label: "Occupied" },
      ],
    },
    {
      label: "Party Size",
      key: "partySize",
      options: [
        { value: "", label: "Any Size" },
        { value: "1-2", label: "1-2 Guests" },
        { value: "3-4", label: "3-4 Guests" },
        { value: "5-6", label: "5-6 Guests" },
        { value: "7+", label: "7+ Guests" },
      ],
    },
    {
      label: "Time Slot",
      key: "timeSlot",
      options: [
        { value: "", label: "All Times" },
        { value: "breakfast", label: "Breakfast (8AM-11AM)" },
        { value: "lunch", label: "Lunch (11AM-3PM)" },
        { value: "dinner", label: "Dinner (5PM-10PM)" },
        { value: "late", label: "Late Night (10PM-2AM)" },
      ],
    },
    {
      label: "Assigned Staff",
      key: "staff",
      options: [
        { value: "", label: "All Staff" },
        { value: "server-1", label: "Ethan Carter" },
        { value: "server-2", label: "Olivia Bennett" },
        { value: "server-3", label: "Noah Thompson" },
        { value: "server-4", label: "Ava Harper" },
        { value: "unassigned", label: "Unassigned" },
      ],
    },
  ];

  // ✅ Quick Actions Config
  const quickActions = [
    {
      label: "Add Walk-in",
      icon: <FaPlus />,
      color: "green",
      hoverBg: "hover:bg-green-100",
      border: "border-green-200",
      text: "text-green-800",
      bg: "bg-green-50",
    },
    {
      label: "Open Waitlist",
      icon: <FaListUl />,
      color: "blue",
      hoverBg: "hover:bg-blue-100",
      border: "border-blue-200",
      text: "text-blue-800",
      bg: "bg-blue-50",
    },
    {
      label: "Export CSV",
      icon: <FaDownload />,
      color: "gray",
      hoverBg: "hover:bg-gray-100",
      border: "border-gray-200",
      text: "text-gray-800",
      bg: "bg-gray-50",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col">
      {/* Logo */}
      <h1 className="text-lg font-bold flex items-center gap-2 mb-6">
        <span className="text-green-600">▮</span> TableMaster
      </h1>

      {/* Filters Section */}
      <h2 className="font-semibold mb-3 text-gray-800">FILTERS</h2>
      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.key}>
            <label className="block text-sm text-gray-600 mb-1">
              {filter.label}
            </label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
              defaultValue=""
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="font-semibold mt-8 mb-3 text-gray-800">QUICK ACTIONS</h2>
      <div className="flex flex-col gap-2">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${action.bg} ${action.border} ${action.text} ${action.hoverBg}`}
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 text-xs text-gray-400">Last synced: Just now</div>
    </aside>
  );
};

export default Sidebar;
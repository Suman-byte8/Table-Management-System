import React from "react";

import {
    FaCalendarAlt,
    FaBell,
    FaUserCircle,
    FaMapMarkerAlt,
    FaPlus,
    FaListUl,
    FaDownload,
    FaSearchMinus,
    FaSearchPlus,
    FaExpand,
  } from "react-icons/fa";

const Sidebar = () => {
  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col">
        <h1 className="text-lg font-bold flex items-center gap-2 mb-6">
          <span className="text-green-600">▮</span> TableMaster
        </h1>

        <h2 className="font-semibold mb-3">FILTERS</h2>
        <div className="space-y-4">
          {["Status", "Party Size", "Division", "Staff"].map((label, idx) => (
            <div key={idx}>
              <label className="block text-sm text-gray-600 mb-1">
                {label}
              </label>
              <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                <option>All</option>
              </select>
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Time Range
            </label>
            <input
              type="time"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <h2 className="font-semibold mt-6 mb-3">QUICK ACTIONS</h2>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-2 rounded-md text-sm">
            <FaPlus className="text-gray-800" /> Add Walk-in
          </button>
          <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-2 rounded-md text-sm">
            <FaListUl className="text-gray-800" /> Open Waitlist
          </button>
          <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-2 rounded-md text-sm">
            <FaDownload className="text-gray-800" /> Export CSV
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

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

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt /> <span>05/15/2024</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FaMapMarkerAlt /> <span>Main Restaurant</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <FaBell className="text-xl text-gray-500" />
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl text-gray-500" />
          <div>
            <p className="text-sm font-semibold">Alex Turner</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

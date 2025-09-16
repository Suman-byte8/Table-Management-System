import React from "react";
import { FaUtensils, FaGlassMartiniAlt } from "react-icons/fa";

const SectionTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex px-4 -mb-px">
        <button
          onClick={() => onTabChange("restaurant")}
          className={`flex items-center py-4 px-1 font-semibold text-sm transition-colors ${
            activeTab === "restaurant"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "border-b-2 border-transparent text-gray-500 hover:text-orange-500"
          }`}
        >
          <FaUtensils className="mr-2" /> Restaurant
        </button>
        <button
          onClick={() => onTabChange("bar")}
          className={`flex items-center py-4 px-1 ml-8 font-semibold text-sm transition-colors ${
            activeTab === "bar"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "border-b-2 border-transparent text-gray-500 hover:text-blue-500"
          }`}
        >
          <FaGlassMartiniAlt className="mr-2" /> Bar
        </button>
      </nav>
    </div>
  );
};

export default SectionTabs;
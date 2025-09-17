// src/components/Sidebar.jsx (or your Sidebar component path)
import React, { useState } from "react";
import { FaPlus, FaListUl, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NewReservationModal from "../Reservations/NewReservationModal"; // Adjust path if needed
import { exportReservationsToExcel } from "../../utils/exportUtils"; // Adjust path if needed
import { reservationApi } from "../../api/reservationsApi"; // Adjust path if needed

const Sidebar = ({ onFilterChange }) => {
  // ✅ Filter Config
  const filters = [
    {
      label: "Section",
      key: "section", // Maps to 'typeOfReservation' in API data
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
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "seated", label: "Seated" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "no-show", label: "No Show" },
      ],
    },
    {
      label: "Party Size",
      key: "partySize",
      options: [
        { value: "", label: "Any Size" },
        { value: "1", label: "1 Guest" },
        { value: "2", label: "2 Guests" },
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
        { value: "Breakfast", label: "Breakfast" },
        { value: "Lunch", label: "Lunch" },
        { value: "Dinner", label: "Dinner" },
      ],
    },
  ];

  // State for filters
  const [filterValues, setFilterValues] = useState({
    section: "",
    status: "",
    partySize: "",
    timeSlot: "",
  });

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Handle filter change and notify parent
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    // Notify parent component about filter change
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Handle quick actions
  const handleQuickAction = (label) => {
    if (label === "Add Walk-in") {
      setIsModalOpen(true);
    } else if (label === "Open Waitlist" || label === "Open Reservations") {
      navigate("/reservations");
    } else if (label === "Export Excel") {
      exportReservationsToExcel(reservationApi.getAll);
    }
  };

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
      label: "Open Reservations",
      icon: <FaListUl />,
      color: "blue",
      hoverBg: "hover:bg-blue-100",
      border: "border-blue-200",
      text: "text-blue-800",
      bg: "bg-blue-50",
    },
    {
      label: "Export Excel",
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
              value={filterValues[filter.key]}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
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
            onClick={() => handleQuickAction(action.label)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${action.bg} ${action.border} ${action.text} ${action.hoverBg}`}
            type="button"
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 text-xs text-gray-400">Last synced: Just now</div>

      {/* New Reservation Modal */}
      <NewReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          console.log("New reservation data:", data);
          setIsModalOpen(false);
          // TODO: Call API to save reservation, potentially refresh data elsewhere
        }}
      />
    </aside>
  );
};

export default Sidebar;

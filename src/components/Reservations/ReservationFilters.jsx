import React from "react";
import { FiSearch } from "react-icons/fi";

const ReservationFilters = ({ searchTerm, onSearch, filters, onFilterChange }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          className="form-input outline-none w-full rounded-md border-zinc-300 bg-white pl-10 text-base text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
          placeholder="Search by name, table, or notes..."
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-md border border-zinc-300 bg-white px-4 text-zinc-700 hover:bg-zinc-50"
        >
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="arrived">Arrived</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filters.area}
          onChange={(e) => onFilterChange("area", e.target.value)}
          className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-md border border-zinc-300 bg-white px-4 text-zinc-700 hover:bg-zinc-50"
        >
          <option value="">All Areas</option>
          <option value="Main Dining">Main Dining</option>
          <option value="Bar Area">Bar Area</option>
          <option value="Private Room">Private Room</option>
        </select>
      </div>
    </div>
  );
};

export default ReservationFilters;
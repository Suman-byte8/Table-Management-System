import React from "react";
import {
  FiBell,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

const Reservations = () => {
  const reservations = [
    {
      name: "Ava Harper",
      size: 4,
      time: "7:00 PM",
      area: "Main Dining / T12",
      notes: "-",
      status: "Confirmed",
      color: "green",
    },
    {
      name: "Liam Carter",
      size: 2,
      time: "7:30 PM",
      area: "Bar Area / T2",
      notes: "Vegetarian",
      status: "Arrived",
      color: "blue",
    },
    {
      name: "Olivia Bennett",
      size: 6,
      time: "8:00 PM",
      area: "Private Room",
      notes: "Birthday",
      status: "Pending",
      color: "yellow",
    },
    {
      name: "Noah Foster",
      size: 3,
      time: "8:15 PM",
      area: "Main Dining / T15",
      notes: "-",
      status: "Confirmed",
      color: "green",
    },
    {
      name: "Isabella Hayes",
      size: 2,
      time: "8:30 PM",
      area: "Bar Area / T5",
      notes: "Gluten-Free",
      status: "Canceled",
      color: "red",
    },
    {
      name: "Ethan Parker",
      size: 5,
      time: "9:00 PM",
      area: "Main Dining / T20",
      notes: "Anniversary",
      status: "Confirmed",
      color: "green",
    },
    {
      name: "Sophia Reed",
      size: 4,
      time: "9:15 PM",
      area: "Bar Area / T8",
      notes: "-",
      status: "No Show",
      color: "gray",
    },
  ];

  const getStatusClasses = (color) => {
    const colors = {
      green: "bg-green-100 text-green-800",
      blue: "bg-blue-100 text-blue-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
      gray: "bg-gray-100 text-gray-800",
    };
    return colors[color] || "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col"
      style={{ fontFamily: "Work Sans, Noto Sans, sans-serif" }}
    >
      <div className="flex h-full grow flex-col">

        {/* Main */}
        <main className="flex-1 px-10 py-8">
          <div className="mx-auto max-w-7xl">
            {/* Top Section */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800">
                All Reservations
              </h1>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md h-10 px-4 bg-[var(--primary-500)] text-white text-base font-bold leading-normal transition-colors duration-200 hover:bg-[var(--primary-600)]">
                <FiPlus />
                <span className="truncate">New Reservation</span>
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  className="form-input w-full rounded-md border-zinc-300 bg-white pl-10 text-base text-zinc-800 placeholder:text-zinc-400 focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                  placeholder="Search by name, phone, or email..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-3">
                {["Date", "Status", "Area"].map((item) => (
                  <button
                    key={item}
                    className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-md border border-zinc-300 bg-white px-4 text-zinc-700 hover:bg-zinc-50"
                  >
                    <p className="text-base font-medium leading-normal">
                      {item}
                    </p>
                    <FiChevronDown className="text-xl" />
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50">
                    <tr>
                      {[
                        "Guest",
                        "Party Size",
                        "Time",
                        "Area / Table",
                        "Notes",
                        "Status",
                        "Actions",
                      ].map((th) => (
                        <th
                          key={th}
                          className="px-6 py-4 text-left text-base font-semibold text-zinc-600"
                        >
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {reservations.map((res) => (
                      <tr key={res.name} className="hover:bg-zinc-50">
                        <td className="whitespace-nowrap px-6 py-4 text-base font-medium text-zinc-800">
                          {res.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
                          {res.size}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
                          {res.time}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
                          {res.area}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
                          {res.notes}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${getStatusClasses(
                              res.color
                            )}`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-zinc-500 hover:text-[var(--primary-500)]">
                              <FiEye />
                            </button>
                            <button className="p-2 text-zinc-500 hover:text-[var(--primary-500)]">
                              <FiEdit />
                            </button>
                            <button className="p-2 text-zinc-500 hover:text-red-500">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
                <p className="text-base text-zinc-600">
                  Showing 1 to 7 of 25 results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
                    disabled
                  >
                    <FiChevronLeft />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50">
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Needed for React Icons ChevronDown
const FiChevronDown = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default Reservations;

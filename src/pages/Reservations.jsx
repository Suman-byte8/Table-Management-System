import React, { useState } from "react";
import ReservationFilters from "../components/Reservations/ReservationFilters";
import ReservationTable from "../components/Reservations/ReservationTable";
import Pagination from "../components/Reservations/Pagination";
import NewReservationModal from "../components/Reservations/NewReservationModal";


const Reservations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    area: "",
  });

  // ✅ Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data (unchanged)
  const reservations = [
    {
      id: 1,
      name: "Ava Harper",
      size: 4,
      time: "7:00 PM",
      area: "Main Dining / T12",
      notes: "-",
      status: "confirmed",
    },
    {
      id: 2,
      name: "Liam Carter",
      size: 2,
      time: "7:30 PM",
      area: "Bar Area / T2",
      notes: "Vegetarian",
      status: "arrived",
    },
    {
      id: 3,
      name: "Olivia Bennett",
      size: 6,
      time: "8:00 PM",
      area: "Private Room",
      notes: "Birthday",
      status: "pending",
    },
    {
      id: 4,
      name: "Noah Foster",
      size: 3,
      time: "8:15 PM",
      area: "Main Dining / T15",
      notes: "-",
      status: "confirmed",
    },
    {
      id: 5,
      name: "Isabella Hayes",
      size: 2,
      time: "8:30 PM",
      area: "Bar Area / T5",
      notes: "Gluten-Free",
      status: "cancelled",
    },
    {
      id: 6,
      name: "Ethan Parker",
      size: 5,
      time: "9:00 PM",
      area: "Main Dining / T20",
      notes: "Anniversary",
      status: "confirmed",
    },
    {
      id: 7,
      name: "Sophia Reed",
      size: 4,
      time: "9:15 PM",
      area: "Bar Area / T8",
      notes: "-",
      status: "no-show",
    },
  ];

  // Filter logic (unchanged)
  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status ? res.status === filters.status : true;
    const matchesArea = filters.area ? res.area.includes(filters.area) : true;
    return matchesSearch && matchesStatus && matchesArea;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // ✅ Modal Handlers
  const handleSaveReservation = (data) => {
    console.log("New reservation created:", data);
    // In real app: POST to API, then refresh list
    alert("Reservation created successfully!");
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col"
      style={{ fontFamily: "Work Sans, Noto Sans, sans-serif" }}
    >
      <div className="flex h-full grow flex-col">
        <main className="flex-1 px-10 py-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800">
                All Reservations
              </h1>
              <button
                onClick={() => setIsModalOpen(true)} // ← OPEN MODAL
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md h-10 px-4 bg-emerald-600 text-white text-base font-bold leading-normal transition-colors duration-200 hover:bg-emerald-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="truncate">New Reservation</span>
              </button>
            </div>

            {/* Filters */}
            <ReservationFilters
              searchTerm={searchTerm}
              onSearch={handleSearch}
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Table */}
            <ReservationTable reservations={paginatedReservations} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalResults={filteredReservations.length}
              showingFrom={startIndex + 1}
              showingTo={Math.min(startIndex + itemsPerPage, filteredReservations.length)}
            />
          </div>
        </main>
      </div>

      {/* ✅ New Reservation Modal */}
      <NewReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReservation}
      />
    </div>
  );
};

export default Reservations;
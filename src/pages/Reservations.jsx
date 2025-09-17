import React, { useState, useEffect } from "react";
import ReservationFilters from "../components/Reservations/ReservationFilters";
import ReservationTable from "../components/Reservations/ReservationTable";
import Pagination from "../components/Reservations/Pagination";
import NewReservationModal from "../components/Reservations/NewReservationModal";
import { reservationApi } from "../api/reservations";
import { toast } from "react-toastify";

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

  // API data
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const rawData = await reservationApi.getAll();
      const transformedData = (
        Array.isArray(rawData) ? rawData : rawData?.data || []
      ).map((res) => ({
        id: res._id,
        name: res.guestInfo?.name || "Unknown",
        size: res.noOfDiners || 0,
        time: res.timeSlot || "N/A",
        area: res.typeOfReservation
          ? `${
              res.typeOfReservation.charAt(0).toUpperCase() +
              res.typeOfReservation.slice(1)
            } Section`
          : "N/A",
        notes: res.specialRequests || res.additionalDetails || "-",
        status: res.status || "pending",
        original: res,
      }));
      setReservations(transformedData);
      console.log("Transformed reservations:", transformedData);
    } catch (err) {
      setError("Failed to load reservations");
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reservations on mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter logic
  const filteredReservations = (reservations || []).filter((res) => {
    const matchesSearch =
      res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status ? res.status === filters.status : true;
    const matchesArea = filters.area ? res.area?.includes(filters.area) : true;

    return matchesSearch && matchesStatus && matchesArea;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = filteredReservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // ✅ Modal Handlers
  const handleSaveReservation = async (data) => {
    try {
      await reservationApi.create(data);
      // Refresh the reservations list
      const rawData = await reservationApi.getAll();
      const transformedData = (
        Array.isArray(rawData) ? rawData : rawData?.data || []
      ).map((res) => ({
        id: res._id,
        name: res.guestInfo?.name || "Unknown",
        size: res.noOfDiners || 0,
        time: res.timeSlot || "N/A",
        area: res.typeOfReservation
          ? `${
              res.typeOfReservation.charAt(0).toUpperCase() +
              res.typeOfReservation.slice(1)
            } Section`
          : "N/A",
        notes: res.specialRequests || res.additionalDetails || "-",
        status: res.status || "pending",
        original: res,
      }));
      setReservations(transformedData);
      toast.success("Reservation created successfully!");
    } catch (err) {
      console.error("Error creating reservation:", err);
      toast.error("Failed to create reservation");
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      await reservationApi.delete(id);
      // Refresh the reservations list
      const rawData = await reservationApi.getAll();
      const transformedData = (
        Array.isArray(rawData) ? rawData : rawData?.data || []
      ).map((res) => ({
        id: res._id,
        name: res.guestInfo?.name || "Unknown",
        size: res.noOfDiners || 0,
        time: res.timeSlot || "N/A",
        area: res.typeOfReservation
          ? `${
              res.typeOfReservation.charAt(0).toUpperCase() +
              res.typeOfReservation.slice(1)
            } Section`
          : "N/A",
        notes: res.specialRequests || res.additionalDetails || "-",
        status: res.status || "pending",
        original: res,
      }));
      setReservations(transformedData);
      toast.success("Reservation deleted successfully!");
    } catch (err) {
      console.error("Error deleting reservation:", err);
      toast.error("Failed to delete reservation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

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
                onClick={() => setIsModalOpen(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md h-10 px-4 bg-emerald-600 text-white text-base font-bold leading-normal transition-colors duration-200 hover:bg-emerald-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
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
            <ReservationTable
              reservations={paginatedReservations}
              onDelete={handleDeleteReservation}
              onReservationUpdated={fetchReservations}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalResults={filteredReservations.length}
              showingFrom={startIndex + 1}
              showingTo={Math.min(
                startIndex + itemsPerPage,
                filteredReservations.length
              )}
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

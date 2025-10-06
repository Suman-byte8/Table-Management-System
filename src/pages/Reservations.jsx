import React, { useState, useEffect } from "react";
import ReservationFilters from "../components/Reservations/ReservationFilters";
import ReservationTable from "../components/Reservations/ReservationTable";
import Pagination from "../components/Reservations/Pagination";
import NewReservationModal from "../components/Reservations/NewReservationModal";
import { reservationApi } from "../api/reservationsApi";
import socket from "../socket";
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
      setError(null);
      const rawData = await reservationApi.getAll();
      console.log("Raw reservation data:", rawData);

      // Handle different response structures
      const reservationsArray = Array.isArray(rawData) ? rawData : rawData?.items || rawData?.data || [];

      if (reservationsArray.length === 0) {
        setReservations([]);
        return;
      }

      const transformedData = reservationsArray.map((res) => ({
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
      console.error("Error fetching reservations:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required to view reservations.");
      } else if (err.response?.status === 401) {
        setError("Authentication required. Please log in.");
      } else {
        setError("Failed to load reservations. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch reservations on mount
  useEffect(() => {
    fetchReservations();

    // Set up socket listeners for real-time updates
    socket.on('reservationCreated', (newReservation) => {
      console.log('New reservation created:', newReservation);
      fetchReservations(); // Refresh the list
      toast.success('New reservation created!');
    });

    socket.on('reservationStatusChanged', (data) => {
      console.log('Reservation status changed:', data);
      fetchReservations(); // Refresh the list
      toast.info('Reservation status updated');
    });

    socket.on('reservationDeleted', (deletedReservation) => {
      console.log('Reservation deleted:', deletedReservation);
      fetchReservations(); // Refresh the list
      toast.success('Reservation deleted');
    });

    // Global event listener for refreshReservationData
    const handleRefreshReservationData = () => {
      console.log('Refreshing reservation data...');
      fetchReservations();
    };

    window.addEventListener('refreshReservationData', handleRefreshReservationData);

    // Cleanup socket listeners on unmount
    return () => {
      socket.off('reservationCreated');
      socket.off('reservationStatusChanged');
      socket.off('reservationDeleted');
      window.removeEventListener('refreshReservationData', handleRefreshReservationData);
    };
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
      // Use the typeOfReservation from the form data
      const type = data.typeOfReservation;
      // Ensure typeOfReservation is included in the data sent to the API
      const reservationDataWithTyp = { ...data, typeOfReservation: type };
      await reservationApi.create(type, reservationDataWithTyp);
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
      // toast.success("Reservation created successfully!"); // Removed duplicate toast
    } catch (err) {
      console.error("Error creating reservation:", err);
      toast.error("Failed to create reservation");
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      // Find the reservation in the current state to get its type
      const reservationToDelete = reservations.find(res => res.id === id);
      console.log("Reservation to delete:", reservationToDelete);
      if (!reservationToDelete || !reservationToDelete.original?.typeOfReservation) {
        console.error("Error: Could not find reservation type for deletion.");
        toast.error("Failed to delete reservation: Type not found.");
        return;
      }
      const type = reservationToDelete.original.typeOfReservation;
      // If the type is 'bar', treat it as 'restaurant' for backend API calls
      const apiType = (type === 'bar') ? 'restaurant' : type;
      console.log("API Type for deletion:", apiType);
      await reservationApi.delete(apiType, id);
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

            {/* Table or No Data Message */}
            {paginatedReservations.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                <p className="text-gray-500">
                  {searchTerm || filters.status || filters.area
                    ? "Try adjusting your search or filter criteria."
                    : "No reservations have been created yet."}
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}
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

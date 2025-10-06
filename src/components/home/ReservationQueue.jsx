// src/components/ReservationQueue.jsx
import React, { useState, useEffect } from "react";
import ReservationCard from "./ReservationQueue/ReservationCard";
import AssignTableModal from "./ReservationQueue/AssignTableModal";
import StatsGrid from "./ReservationQueue/StatsGrid";
import { Link } from "react-router-dom";
import { reservationApi } from "../../api/reservationsApi";
import { tableApi } from "../../api/tableApi";
import { toast } from "react-toastify";
import socket from "../../socket";

const ReservationQueue = ({ filters }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = {
          type: "restaurant" // Required parameter for the API
        };

        // Only filter by status if explicitly set in filters
        if (filters && filters.status && filters.status !== "") {
          queryParams.status = filters.status;
        }

        if (filters) {
          if (filters.section && filters.section !== "") {
            queryParams.typeOfReservation = filters.section;
          }
          if (filters.timeSlot && filters.timeSlot !== "") {
            queryParams.timeSlot = filters.timeSlot;
          }
        }

        const rawData = await reservationApi.getAll(queryParams);
        let fetchedReservations = Array.isArray(rawData) ? rawData : rawData?.data || [];

        if (filters?.partySize && filters.partySize !== "") {
          const sizeFilter = filters.partySize;
          if (sizeFilter === "1") {
            fetchedReservations = fetchedReservations.filter((res) => res.noOfDiners == 1);
          } else if (sizeFilter === "2") {
            fetchedReservations = fetchedReservations.filter((res) => res.noOfDiners == 2);
          } else if (sizeFilter === "3-4") {
            fetchedReservations = fetchedReservations.filter(
              (res) => res.noOfDiners >= 3 && res.noOfDiners <= 4
            );
          } else if (sizeFilter === "5-6") {
            fetchedReservations = fetchedReservations.filter(
              (res) => res.noOfDiners >= 5 && res.noOfDiners <= 6
            );
          } else if (sizeFilter === "7+") {
            fetchedReservations = fetchedReservations.filter((res) => res.noOfDiners >= 7);
          }
        }

        const limitedReservations = fetchedReservations
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((res) => ({
            id: res._id.toString(),
            guestName: res.guestInfo?.name || "Unknown Guest",
            partySize: res.noOfDiners || 0,
            time: res.timeSlot || "N/A",
            status: res.status || "unknown",
            preferences: res.specialRequests || "",
            notes: res.additionalDetails || "",
          }));

        setReservations(limitedReservations);
      } catch (err) {
        console.error("ReservationQueue: Error fetching:", err);
        setError("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();

    // Set up socket listeners for real-time updates
    socket.on('reservationCreated', (newReservation) => {
      console.log('New reservation created:', newReservation);
      fetchReservations(); // Refresh the queue
      toast.info('New reservation added to queue');
    });

    socket.on('reservationStatusChanged', (data) => {
      console.log('Reservation status changed:', data);
      fetchReservations(); // Refresh the queue
      toast.info('Reservation status updated');
    });

    socket.on('reservationDeleted', (deletedReservation) => {
      console.log('Reservation deleted:', deletedReservation);
      fetchReservations(); // Refresh the queue
      toast.info('Reservation removed from queue');
    });

    // Global event listener for refreshReservationData
    const handleRefreshReservationData = () => {
      console.log('Refreshing reservation queue data...');
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
  }, [filters]);

  const handleAssignClick = async (reservation) => {
    setSelectedReservation(reservation);

    try {
      // --- FETCH ONLY AVAILABLE TABLES WITH SUFFICIENT CAPACITY ---
      const tableResponse = await tableApi.getAll({
        status: 'available', // Backend filter for status
        // Consider adding capacity filter if your API supports it directly
        // e.g., capacity: { $gte: reservation.partySize }
      });

      let fetchedTables = Array.isArray(tableResponse) ? tableResponse : tableResponse?.data || [];

      // --- CLIENT-SIDE FILTERING ---
      // Ensure tableNumber is present and not empty, and meets capacity
      fetchedTables = fetchedTables.filter(
        table =>
          table.capacity >= reservation.partySize &&
          table.tableNumber &&
          table.tableNumber.trim() !== '' &&
          table._id
      );
      // --- END FILTERING ---

      // --- TRANSFORM TABLES FOR MODAL ---
      const transformedTables = fetchedTables.map(table => ({
        // Robust ID mapping to prevent empty strings
        id: table.tableNumber || table._id?.toString() || `temp_${table._id}`,
        capacity: table.capacity,
        section: table.section,
        status: table.status,
        _id: table._id,
        tableNumber: table.tableNumber // Explicitly include for clarity/display
      }));
      // --- END TRANSFORM ---

      console.log("🔍 [FRONTEND DEBUG] Fetched and transformed available tables:", transformedTables);
      setAvailableTables(transformedTables);
      setIsAssignModalOpen(true);
    } catch (err) {
      console.error("Error fetching available tables:", err);
      toast.error("Failed to fetch available tables.");
      setAvailableTables([]);
      setIsAssignModalOpen(true);
    }
  };

  const handleAssignTable = async (tableChoice) => {
    const tableId = tableChoice && (tableChoice.id || tableChoice._id || tableChoice);
    const tableNumberForToast = tableChoice && tableChoice.tableNumber ? tableChoice.tableNumber : tableId;
    if (!selectedReservation || !tableId) {
      console.error("Cannot assign: Missing reservation or table ID");
      toast.error("Error: Missing reservation or table information.");
      return;
    }

    console.log(`Assigning Table ${tableId} to Reservation ${selectedReservation.id}`);

    try {
      // --- UPDATE RESERVATION ---
      const updatedReservationData = {
        status: 'confirmed',
        assignedTable: tableId, // Or table._id if preferred by backend
        confirmedAt: new Date().toISOString(),
      };
      const reservationUpdateResponse = await reservationApi.update("restaurant", selectedReservation.id, updatedReservationData);
      console.log("Reservation updated successfully:", reservationUpdateResponse.data);

      // --- UPDATE TABLE ---
      const tableToUpdate = availableTables.find(t => t._id === tableId);
      const updatedTableData = {
        status: 'reserved',
        lastAssignedAt: new Date().toISOString(),
        // currentReservation: selectedReservation.id, // Uncomment if backend schema/logic uses this
      };
      const tableUpdateResponse = await tableApi.update(tableId, updatedTableData);
      console.log("Table updated successfully:", tableUpdateResponse.data);

      // --- OPTIMISTICALLY REMOVE FROM QUEUE ---
      setReservations(prevReservations =>
        prevReservations.filter(res => res.id !== selectedReservation.id)
      );
      console.log(`✅ Optimistically removed reservation ${selectedReservation.id} from queue.`);

      // --- CLOSE MODAL ---
      handleCloseAssignModal();

      toast.success(`Table ${tableNumberForToast} assigned to ${selectedReservation.guestName} successfully!`);

    } catch (err) {
      console.error("Error assigning table:", err);

      // --- HANDLE SPECIFIC BACKEND ERRORS ---
      if (err.response?.status === 409) {
        // 409 Conflict - Table likely taken
        const errorMessage = err.response.data?.message || "Table is no longer available.";
        toast.error(errorMessage);
        console.warn("⚠️ Table assignment conflict:", errorMessage);
        handleCloseAssignModal(); // Close modal on conflict

      } else if (err.response?.status === 400 || err.response?.status === 404) {
        toast.error("Assignment failed. Please check details or try again.");
        console.error("❌ Assignment request error:", err.response.data);

      } else {
        toast.error("Failed to assign table. Please try again.");
        console.error("❌ Unexpected error during assignment:", err);
      }
      // --- END ERROR HANDLING ---
    }
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedReservation(null);
    setAvailableTables([]);
  };

  if (loading) {
    return (
      <section className="w-1/2 border-r border-gray-200 flex flex-col h-[110vh]">
        <div className="p-6 pb-2">
          <h2 className="text-lg font-semibold">Reservation Queue</h2>
          <p className="text-sm text-gray-500">
            Drag a reservation to a table to assign.
          </p>
        </div>
        <div className="px-6">
          <StatsGrid />
        </div>
        <Link
          to="/reservations"
          className="pb-2 px-6 text-gray-500 hover:text-gray-700 hover:underline w-fit"
        >
          View All Reservations
        </Link>
        <div className="flex-1 overflow-y-auto px-6 pb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">
              Loading reservations...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-1/2 border-r border-gray-200 flex flex-col h-[110vh]">
        <div className="p-6 pb-2">
          <h2 className="text-lg font-semibold">Reservation Queue</h2>
          <p className="text-sm text-gray-500">
            Drag a reservation to a table to assign.
          </p>
        </div>
        <div className="px-6">
          <StatsGrid />
        </div>
        <Link
          to="/reservations"
          className="pb-2 px-6 text-gray-500 hover:text-gray-700 hover:underline w-fit"
        >
          View All Reservations
        </Link>
        <div className="flex-1 overflow-y-auto px-6 pb-6 flex items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-1/2 border-r border-gray-200 flex flex-col h-[110vh]">
      <div className="p-6 pb-2">
        <h2 className="text-lg font-semibold">Reservation Queue</h2>
        <p className="text-sm text-gray-500">
          Drag a reservation to a table to assign.
        </p>
      </div>

      <div className="px-6">
        <StatsGrid />
      </div>

      <Link
        to="/reservations"
        className="pb-2 px-6 text-gray-500 hover:text-gray-700 hover:underline w-fit"
      >
        View All Reservations
      </Link>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {reservations.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              {Object.values(filters || {}).some((v) => v !== "")
                ? "No reservations match your current filters."
                : "No reservations found."}
            </p>
            {filters && Object.values(filters).some((v) => v !== "") && (
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your filters.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onAssignClick={() => handleAssignClick(reservation)}
              />
            ))}
          </div>
        )}
      </div>

      {isAssignModalOpen && selectedReservation && (
        <AssignTableModal
          reservation={selectedReservation}
          availableTables={availableTables}
          onAssign={handleAssignTable}
          onClose={handleCloseAssignModal}
        />
      )}
    </section>
  );
};

export default ReservationQueue;

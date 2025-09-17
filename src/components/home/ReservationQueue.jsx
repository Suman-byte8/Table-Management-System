import React, { useState, useEffect } from "react";
import ReservationCard from "./ReservationQueue/ReservationCard";
import AssignTableModal from "./ReservationQueue/AssignTableModal";
import StatsGrid from "./ReservationQueue/StatsGrid";
import { Link } from "react-router-dom";
import { reservationApi } from "../../api/reservations";
import { tableApi } from "../../api/tableApi";

const ReservationQueue = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const rawData = await reservationApi.getAll();
      const pendingReservations = (
        Array.isArray(rawData) ? rawData : rawData?.data || []
      )
        .filter((res) => res.status === "pending")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((res) => ({
          id: res._id,
          guestName: res.guestInfo?.name || "Unknown",
          partySize: res.noOfDiners || 0,
          time: res.timeSlot || "N/A",
          status: res.status || "pending",
          preferences: res.specialRequests || "",
          notes: res.additionalDetails || "",
        }));
      setReservations(pendingReservations);
    } catch (err) {
      setError("Failed to load reservations");
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Modal State
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  const assignTable = async (tableId) => {
    try {
      // Update reservation status to confirmed
      await reservationApi.update(selectedReservation.id, {
        status: 'confirmed',
        assignedTable: tableId
      });

      // Update table status to reserved
      await tableApi.update(tableId, {
        status: 'reserved'
      });

      // Refresh reservations and stats
      fetchReservations();

      // Show success message
      alert(`Assigned Table ${tableId} to ${selectedReservation.guestName}`);
      closeModal();
    } catch (error) {
      console.error("Error assigning table:", error);
      alert("Failed to assign table. Please try again.");
    }
  };

  // Mock available tables function (you'll replace this with real API call)
  // const getAvailableTables = (partySize) => {
    
  //   // In a real app, you'd fetch available tables from API
  //   return [
  //     { id: "T1", capacity: 4, section: "restaurant", status: "available" },
  //     { id: "T2", capacity: 2, section: "restaurant", status: "available" },
  //     { id: "B1", capacity: 1, section: "bar", status: "available" },
  //     { id: "B2", capacity: 2, section: "bar", status: "available" },
  //   ].filter(table => table.capacity >= partySize);
  // };

  return (
    <section className="w-1/2 border-r border-gray-200 flex flex-col h-[130vh]">
      {/* Header */}
      <div className="p-6 pb-2">
        <h2 className="text-lg font-semibold">Reservation Queue</h2>
        <p className="text-sm text-gray-500">
          Drag a reservation to a table to assign.
        </p>
      </div>

      {/* Stats Grid — Fixed at top */}
      <div className="px-6">
        <StatsGrid />
      </div>
      
      {/* View All Reservations Link */}
      <Link
        to="/reservations"
        className="pb-2 px-6 text-gray-500 hover:text-gray-700 hover:underline w-fit"
      >
        View All Reservations
      </Link>

      {/* Scrollable Reservation List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">
                Loading reservations...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={fetchReservations}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Retry
            </button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No pending reservations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onAssignClick={() => openModal(reservation)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal (outside scroll container) */}
      {isModalOpen && selectedReservation && (
        <AssignTableModal
          reservation={selectedReservation}
          availableTables={getAvailableTables(selectedReservation.partySize)}
          onAssign={assignTable}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default ReservationQueue;
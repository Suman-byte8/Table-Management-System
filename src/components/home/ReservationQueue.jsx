import React, { useState, useEffect } from "react";
import ReservationCard from "./ReservationQueue/ReservationCard";
import AssignTableModal from "./ReservationQueue/AssignTableModal";
import StatsGrid from "./ReservationQueue/StatsGrid";
import { Link } from "react-router-dom";
import { reservationApi } from "../../api/reservations";

const ReservationQueue = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingReservations = async () => {
      try {
        setLoading(true);
        const rawData = await reservationApi.getAll();
        const pendingReservations = (Array.isArray(rawData) ? rawData : rawData?.data || [])
          .filter(res => res.status === 'pending')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(res => ({
            id: res._id,
            guestName: res.guestInfo?.name || 'Unknown',
            partySize: res.noOfDiners || 0,
            time: res.timeSlot || 'N/A',
            status: res.status || 'pending',
            preferences: res.specialRequests || '',
            notes: res.additionalDetails || '',
          }));
        setReservations(pendingReservations);
      } catch (err) {
        setError('Failed to load reservations');
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingReservations();
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

  const assignTable = (tableId) => {
    alert(`Assigned Table ${tableId} to ${selectedReservation.guestName}`);
    closeModal();
  };

  // Mock Available Tables
  const getAvailableTables = (partySize) => {
    const allTables = [
      { id: "T1", capacity: 4, section: "restaurant", status: "available" },
      { id: "T2", capacity: 2, section: "restaurant", status: "available" },
      { id: "T3", capacity: 6, section: "restaurant", status: "available" },
      { id: "T4", capacity: 4, section: "bar", status: "available" },
      { id: "T5", capacity: 2, section: "bar", status: "available" },
      { id: "T6", capacity: 8, section: "private", status: "available" },
    ];
    return allTables.filter((table) => table.capacity >= partySize && table.status === "available");
  };

  return (
    <section className="w-1/2 border-r border-gray-200 flex flex-col h-[110vh]">
      {/* Header */}
      <div className="p-6 pb-2">
        <h2 className="text-lg font-semibold">Reservation Queue</h2>
        <p className="text-sm text-gray-500">Drag a reservation to a table to assign.</p>
      </div>

      {/* Stats Grid — Fixed at top */}
      <div className="px-6 ">
        <StatsGrid />
      </div>
<Link to="/reservations" className="pb-2 px-6 text-gray-500 hover:text-gray-700 hover:underline w-fit">View All Reservations</Link>
      {/* Scrollable Reservation List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading reservations...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8">
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
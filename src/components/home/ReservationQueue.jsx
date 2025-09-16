import React, { useState } from "react";
import ReservationCard from "./ReservationQueue/ReservationCard";
import AssignTableModal from "./ReservationQueue/AssignTableModal";
import StatsGrid from "./ReservationQueue/StatsGrid";
import { Link } from "react-router-dom";

const ReservationQueue = () => {
  // Mock Reservations Data
  const [reservations] = useState([
    {
      id: 1,
      guestName: "Sophia Carter",
      partySize: 4,
      time: "7:00 PM",
      status: "confirmed",
      preferences: "Window seat",
      notes: "Birthday celebration",
    },
    {
      id: 2,
      guestName: "Ethan Bennett",
      partySize: 2,
      time: "7:30 PM",
      status: "confirmed",
      preferences: "Bar area",
      notes: "",
    },
    {
      id: 3,
      guestName: "Olivia Taylor",
      partySize: 6,
      time: "8:00 PM",
      status: "confirmed",
      preferences: "Private booth",
      notes: "Anniversary dinner",
    },
    {
      id: 4,
      guestName: "Liam Johnson",
      partySize: 3,
      time: "6:45 PM",
      status: "confirmed",
      preferences: "",
      notes: "High chair needed",
    },
    {
      id: 5,
      guestName: "Emma Davis",
      partySize: 4,
      time: "7:15 PM",
      status: "confirmed",
      preferences: "Near fireplace",
      notes: "",
    },
    {
      id: 6,
      guestName: "Noah Wilson",
      partySize: 2,
      time: "8:30 PM",
      status: "confirmed",
      preferences: "",
      notes: "Vegetarian menu",
    },
    {
      id: 7,
      guestName: "Ava Martinez",
      partySize: 5,
      time: "6:30 PM",
      status: "confirmed",
      preferences: "Outdoor patio",
      notes: "Allergy: nuts",
    },
    {
      id: 8,
      guestName: "Lucas Garcia",
      partySize: 4,
      time: "9:00 PM",
      status: "confirmed",
      preferences: "",
      notes: "",
    },
  ]);

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
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onAssignClick={() => openModal(reservation)}
            />
          ))}
        </div>
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
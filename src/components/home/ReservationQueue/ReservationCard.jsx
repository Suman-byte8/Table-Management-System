import React from "react";

const ReservationCard = ({ reservation, onAssignClick }) => {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">
          {reservation.guestName} ({reservation.partySize})
        </h3>
        <span className="text-green-600 text-xs font-bold uppercase">
          {reservation.status}
        </span>
      </div>
      <p className="text-sm text-gray-600">{reservation.time}</p>
      {reservation.preferences && (
        <p className="text-sm">
          <span className="font-semibold">Preferences:</span> {reservation.preferences}
        </p>
      )}
      {reservation.notes && (
        <p className="text-sm">
          <span className="font-semibold">Notes:</span> {reservation.notes}
        </p>
      )}
      <button
        onClick={onAssignClick}
        className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-colors"
      >
        Assign Table
      </button>
    </div>
  );
};

export default ReservationCard;
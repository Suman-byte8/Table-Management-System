import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const ReservationActions = ({ reservationId }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/reservations/${reservationId}`);
  };

  const handleEdit = () => console.log("Edit reservation", reservationId);
  const handleDelete = () => console.log("Delete reservation", reservationId);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleView}
        className="p-2 text-zinc-500 hover:text-emerald-500 transition-colors"
        title="View Details"
      >
        <FiEye className="w-4 h-4" />
      </button>
      <button
        onClick={handleEdit}
        className="p-2 text-zinc-500 hover:text-blue-500 transition-colors"
        title="Edit Reservation"
      >
        <FiEdit className="w-4 h-4" />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
        title="Delete Reservation"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ReservationActions;
import React from "react";
import { useNavigate } from "react-router-dom";
import ReservationStatusBadge from "./ReservationStatusBadge";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const ReservationTableRow = ({ reservation }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/reservations/${reservation.id}`);
  };

  const handleEdit = () => console.log("Edit reservation", reservation.id);
  const handleDelete = () => console.log("Delete reservation", reservation.id);

  return (
    <tr key={reservation.id} className="hover:bg-zinc-50">
      <td className="whitespace-nowrap px-6 py-4 text-base font-medium text-zinc-800">
        {reservation.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
        {reservation.size}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
        {reservation.time}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
        {reservation.area}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-base text-zinc-600">
        {reservation.notes}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <ReservationStatusBadge status={reservation.status} />
      </td>
      <td className="whitespace-nowrap px-6 py-4">
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
      </td>
    </tr>
  );
};

export default ReservationTableRow;
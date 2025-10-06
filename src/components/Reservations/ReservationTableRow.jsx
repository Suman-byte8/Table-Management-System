import React from "react";
import ReservationStatusBadge from "./ReservationStatusBadge";
import ReservationActions from "./ReservationActions";

const ReservationTableRow = ({ reservation, onDelete, onReservationUpdated }) => {
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
        <ReservationActions
          reservationId={reservation.id}
          reservationType={reservation.original?.typeOfReservation || ''}
          onDelete={onDelete}
          onReservationUpdated={onReservationUpdated}
        />
      </td>
    </tr>
  );
};

export default ReservationTableRow;

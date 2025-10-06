import React from "react";
import ReservationTableRow from "./ReservationTableRow";

const ReservationTable = ({ reservations, onDelete, onReservationUpdated }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-50">
            <tr>
              {[
                "Guest",
                "Party Size",
                "Time",
                "Area / Table",
                "Notes",
                "Status",
                "Actions",
              ].map((th) => (
                <th
                  key={th}
                  className="px-6 py-4 text-left text-base font-semibold text-zinc-600"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {reservations.length > 0 ? (
              reservations.map((res) => (
                <ReservationTableRow
                  key={res.id}
                  reservation={res}
                  onDelete={onDelete}
                  onReservationUpdated={onReservationUpdated}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">
                  No reservations found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;

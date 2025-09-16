import React from "react";

const ReservationStatusBadge = ({ status }) => {
  const statusConfig = {
    confirmed: { label: "Confirmed", bg: "bg-green-100", text: "text-green-800" },
    arrived: { label: "Arrived", bg: "bg-blue-100", text: "text-blue-800" },
    pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-800" },
    cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-800" },
    "no-show": { label: "No Show", bg: "bg-gray-100", text: "text-gray-800" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default ReservationStatusBadge;
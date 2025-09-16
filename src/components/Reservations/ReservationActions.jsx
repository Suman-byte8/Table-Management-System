import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const ReservationActions = ({ reservationId, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleView = () => {
    navigate(`/reservations/${reservationId}`);
  };

  const handleEdit = () => console.log("Edit reservation", reservationId);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(reservationId);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
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
          onClick={handleDeleteClick}
          className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
          title="Delete Reservation"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-xs backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Reservation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this reservation? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  isDeleting ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReservationActions;

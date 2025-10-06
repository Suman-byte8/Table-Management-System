import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { reservationApi } from "../../api/reservationsApi";
import { toast } from "react-toastify";

const ReservationActions = ({ reservationId, reservationType, onReservationUpdated }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Disable all actions when deleting
  const isDisabled = isDeleting;

  const handleView = () => {
    navigate(`/reservations/${reservationId}`);
  };

  const handleEdit = () => {
    navigate(`/reservations/${reservationId}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await reservationApi.delete(reservationType, reservationId);
      toast.success("Reservation deleted successfully!");
      
      // Notify parent component to refresh data
      if (onReservationUpdated) {
        onReservationUpdated();
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error(error.response?.data?.message || "Failed to delete reservation");
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
          disabled={isDisabled}
          className={`p-2 transition-colors ${
            isDisabled
              ? "text-zinc-300 cursor-not-allowed"
              : "text-zinc-500 hover:text-emerald-500 cursor-pointer"
          }`}
          title="View Details"
        >
          <FiEye className="w-4 h-4" />
        </button>
        <button
          onClick={handleEdit}
          disabled={isDisabled}
          className={`p-2 transition-colors ${
            isDisabled
              ? "text-zinc-300 cursor-not-allowed"
              : "text-zinc-500 hover:text-blue-500 cursor-pointer"
          }`}
          title="Edit Reservation"
        >
          <FiEdit className="w-4 h-4" />
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDisabled}
          className={`p-2 transition-colors ${
            isDisabled
              ? "text-zinc-300 cursor-not-allowed"
              : "text-zinc-500 hover:text-red-500 cursor-pointer"
          }`}
          title="Delete Reservation"
        >
          {isDeleting ? (
            <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
          ) : (
            <FiTrash2 className="w-4 h-4" />
          )}
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
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className={`px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDeleting ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReservationActions;
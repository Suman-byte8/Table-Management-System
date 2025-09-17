import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { reservationApi } from "../../api/reservationsApi";
import { toast } from "react-toastify";

const ReservationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const response = await reservationApi.getById(id);
        setReservation(response.data);
      } catch (error) {
        console.error("Error fetching reservation:", error);
        setError("Failed to load reservation");
        toast.error("Failed to load reservation");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("guestInfo.")) {
      const key = name.split(".")[1];
      setReservation(prev => ({
        ...prev,
        guestInfo: {
          ...prev.guestInfo,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setReservation(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Prepare update data (exclude _id, createdAt, updatedAt)
      const updateData = {
        typeOfReservation: reservation.typeOfReservation,
        noOfDiners: reservation.noOfDiners,
        date: reservation.date,
        timeSlot: reservation.timeSlot,
        specialRequests: reservation.specialRequests,
        additionalDetails: reservation.additionalDetails,
        guestInfo: reservation.guestInfo,
        agreeToTnC: reservation.agreeToTnC,
        status: reservation.status,
      };

      await reservationApi.update(id, updateData);
      toast.success("Reservation updated successfully!");
      navigate(`/reservations/${id}`);
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error(error.response?.data?.message || "Failed to update reservation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reservation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Reservation Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Reservation Details
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Reservation</h1>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reservation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reservation Type
            </label>
            <select
              name="typeOfReservation"
              value={reservation.typeOfReservation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="restaurant">Restaurant</option>
              <option value="bar">Bar</option>
              <option value="outdoor">Outdoor</option>
              <option value="private">Private Room</option>
            </select>
          </div>

          {/* Number of Diners */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Diners
            </label>
            <input
              type="number"
              name="noOfDiners"
              min="1"
              value={reservation.noOfDiners}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={reservation.date ? new Date(reservation.date).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Slot
            </label>
            <select
              name="timeSlot"
              value={reservation.timeSlot}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          {/* Special Requests */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={reservation.specialRequests || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Window seat, high chair, birthday..."
            />
          </div>

          {/* Additional Details */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              name="additionalDetails"
              value={reservation.additionalDetails || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any other information..."
            />
          </div>

          {/* Guest Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="guestInfo.name"
                  value={reservation.guestInfo?.name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="guestInfo.phoneNumber"
                  value={reservation.guestInfo?.phoneNumber || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="guestInfo.email"
                  value={reservation.guestInfo?.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={reservation.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="seated">Seated</option>
              <option value="no-show">No Show</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* T&C */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToTnC"
              checked={reservation.agreeToTnC}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              I agree to the Terms and Conditions
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationEdit;
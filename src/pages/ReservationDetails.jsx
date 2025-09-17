import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock, FiUsers, FiPhone, FiMail, FiMapPin, FiInfo } from "react-icons/fi";
import { reservationApi } from "../api/reservations";

const ReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const data = await reservationApi.getById(id);
        setReservation(data.data);
        // Debug: Check what we actually received
        console.log("Fetched reservation:", data);
        console.log("typeOfReservation:", data.data?.typeOfReservation, typeof data.data?.typeOfReservation);
      } catch (err) {
        setError("Failed to load reservation details");
        console.error("Error fetching reservation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reservation details...</p>
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

  // Safe capitalize function
  const safeCapitalize = (str) => {
    if (typeof str !== 'string' || str.length === 0) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Reservations
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Reservation Details
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {safeCapitalize(reservation.status)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Guest Info & Reservation Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUsers className="w-5 h-5" />
              Guest Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{reservation.guestInfo?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Full Name</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiPhone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{reservation.guestInfo?.phoneNumber || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Phone Number</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{reservation.guestInfo?.email || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Email Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar className="w-5 h-5" />
              Reservation Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Reservation Type</label>
                <p className="text-gray-900 font-medium">
                  {safeCapitalize(reservation.typeOfReservation)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Number of Diners</label>
                <p className="text-gray-900 font-medium">{reservation.noOfDiners || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                <p className="text-gray-900 font-medium">{formatDate(reservation.date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Time Slot</label>
                <p className="text-gray-900 font-medium">{reservation.timeSlot || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Reservation ID</label>
                <p className="text-gray-900 font-mono text-sm">{reservation._id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Agreed to T&C</label>
                <p className="text-gray-900 font-medium">{reservation.agreeToTnC ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Special Requests & Additional Details */}
          {(reservation.specialRequests || reservation.additionalDetails) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiInfo className="w-5 h-5" />
                Special Requests & Details
              </h2>
              {reservation.specialRequests && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Special Requests</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {reservation.specialRequests.trim() === '' ? 'None' : reservation.specialRequests}
                  </p>
                </div>
              )}
              {reservation.additionalDetails && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Additional Details</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {reservation.additionalDetails.trim() === '' ? 'None' : reservation.additionalDetails}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium">
                Edit Reservation
              </button>
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                Assign Table
              </button>
              <button className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium">
                Cancel Reservation
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-xs text-gray-500">
                    {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
              {reservation.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reservation.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {reservation.status === 'confirmed' && reservation.updatedAt && reservation.createdAt !== reservation.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Confirmed</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reservation.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Created At</p>
                <p className="font-medium text-gray-900">{formatDate(reservation.createdAt)} {formatTime(reservation.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">{formatDate(reservation.updatedAt)} {formatTime(reservation.updatedAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Version</p>
                <p className="font-medium text-gray-900">v{reservation.__v || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
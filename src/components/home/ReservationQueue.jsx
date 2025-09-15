import React from "react";
import {
    FaCalendarAlt,
    FaBell,
    FaUserCircle,
    FaMapMarkerAlt,
    FaPlus,
    FaListUl,
    FaDownload,
    FaSearchMinus,
    FaSearchPlus,
    FaExpand,
  } from "react-icons/fa";

const ReservationQueue = () => {
  return (
    <section className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-1">Reservation Queue</h2>
      <p className="text-sm text-gray-500 mb-4">
        Drag a reservation to a table to assign.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-md border border-gray-200 text-center">
          <p className="text-2xl font-bold">32</p>
          <p className="text-sm text-gray-500">Reservations</p>
        </div>
        <div className="bg-white p-4 rounded-md border border-gray-200 text-center">
          <p className="text-2xl font-bold">18</p>
          <p className="text-sm text-gray-500">Seated</p>
        </div>
        <div className="bg-white p-4 rounded-md border border-gray-200 text-center">
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Available Tables</p>
        </div>
        <div className="bg-white p-4 rounded-md border border-gray-200 text-center">
          <p className="text-2xl font-bold text-red-500">2</p>
          <p className="text-sm text-gray-500">No-shows</p>
        </div>
      </div>

      {/* Reservation Cards */}
      <div className="space-y-4">
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Sophia Carter (4)</h3>
            <span className="text-green-600 text-xs font-bold">CONFIRMED</span>
          </div>
          <p className="text-sm text-gray-600">7:00 PM</p>
          <p className="text-sm">
            <span className="font-semibold">Preferences:</span> Window seat
          </p>
          <p className="text-sm">
            <span className="font-semibold">Notes:</span> Birthday celebration
          </p>
          <button className="mt-3 w-full bg-green-500 text-white py-2 rounded-md">
            Assign Table
          </button>
        </div>

        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Ethan Bennett (2)</h3>
            <span className="text-green-600 text-xs font-bold">CONFIRMED</span>
          </div>
          <p className="text-sm text-gray-600">7:30 PM</p>
          <p className="text-sm">
            <span className="font-semibold">Preferences:</span> Bar area
          </p>
          <button className="mt-3 w-full bg-green-500 text-white py-2 rounded-md">
            Assign Table
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReservationQueue;

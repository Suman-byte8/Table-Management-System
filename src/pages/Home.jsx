import React from "react";
import FloorPlan from "../components/home/FloorPlan";
import Sidebar from "../components/home/Sidebar";
import ReservationQueue from "../components/home/ReservationQueue";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar — Fixed */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Reservation Queue — Scrollable */}
        <ReservationQueue />

        {/* Floor Plan — Fixed, no scroll */}
        <div className="flex-1 bg-gray-50">
          <FloorPlan />
        </div>
      </main>
    </div>
  );
};

export default Home;
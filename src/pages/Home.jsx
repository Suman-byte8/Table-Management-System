// src/pages/Home.jsx or src/components/Home.jsx (your main layout file)
import React, { useState } from "react";
import Sidebar from "../components/home/Sidebar";
import ReservationQueue from "../components/home/ReservationQueue";
import FloorPlan from "../components/home/FloorPlan";


const Home = () => {
  // State to hold the current filter values, shared between components
  const [appliedFilters, setAppliedFilters] = useState({
    section: "",
    status: "",
    partySize: "",
    timeSlot: "",
  });

  // Function to handle filter changes from the Sidebar
  const handleSidebarFilterChange = (newFilters) => {
    setAppliedFilters(newFilters);
    // You can also trigger other updates here if needed
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar - Pass the filter change handler */}
      <Sidebar onFilterChange={handleSidebarFilterChange} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Reservation Queue - Pass the filters */}
          <ReservationQueue filters={appliedFilters} />

          {/* Floor Plan - Pass the filters */}
          <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
            <FloorPlan filters={appliedFilters} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

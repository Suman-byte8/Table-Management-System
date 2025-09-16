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

import FloorPlan from "../components/home/FloorPlan";
import Sidebar from "../components/home/Sidebar";
import ReservationQueue from "../components/home/ReservationQueue";


const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        {/* <Header /> */}
        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Reservation Queue */}
          <ReservationQueue />
          {/* Floor Plan */}
          <FloorPlan />
        </div>
      </main>
    </div>
  );
};

export default Home;

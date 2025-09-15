import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/Authentication/AdminLogin";
import Home from "./pages/Authentication/Home";
import SideNavbar from "./components/shared/SideNavbar";
import FloorPlanView from "./pages/FloorPlanView";
import Settings from "./pages/Settings";
import Reservations from "./pages/Reservations";

const App = () => {
  return (
    <>
      <SideNavbar />
      <div className="ml-16">
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={<Home />} />
          <Route path="/floor-plan-view" element={<FloorPlanView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

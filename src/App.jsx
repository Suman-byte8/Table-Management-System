import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/Authentication/AdminLogin";
import Home from "./pages/Home";
import SideNavbar from "./components/shared/SideNavbar";
import TableManagement from "./pages/TableManagement";
import Settings from "./pages/Settings";
import Reservations from "./pages/Reservations";
import HeaderBar from "./components/shared/HeaderBar";

const App = () => {
  return (
    <>
      <SideNavbar />
      <div className="ml-16">
        <HeaderBar />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={<Home />} />
          <Route path="/table-management" element={<TableManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

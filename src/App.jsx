import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/Authentication/AdminLogin";
import Home from "./pages/Home";
import SideNavbar from "./components/shared/SideNavbar";
import TableManagement from "./pages/TableManagement";
import Settings from "./pages/Settings";
import Reservations from "./pages/Reservations";
import HeaderBar from "./components/shared/HeaderBar";
import TableDetails from "./pages/TableDetails";
import ReservationDetails from "./components/Reservations/ReservationDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <Route path="/reservations/:id" element={<ReservationDetails />} />
          <Route path="/table-management/:tableId" element={<TableDetails />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default App;

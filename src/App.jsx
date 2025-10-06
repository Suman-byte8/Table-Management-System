import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/Authentication/AdminLogin";
import Home from "./pages/Home";
import SideNavbar from "./components/shared/SideNavbar";
import TableManagement from "./pages/TableManagement";
import Settings from "./pages/Settings";
import Reservations from "./pages/Reservations";
import HeaderBar from "./components/shared/HeaderBar";
import TableDetails from "./pages/TableDetails";
import ReservationDetails from "./pages/ReservationDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProfile from "./pages/Authentication/AdminProfile";
import ReservationEdit from "./components/Reservations/ReservationEdit";
import socket, { socketUtils } from "./socket";

  const showBrowserNotification = (title, message, type = 'info') => {
    console.log("showBrowserNotification called with:", { title, message, type });
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: message,
        icon: '/logo.png', // Assuming logo.png is available in public folder
        tag: type,
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      console.log("Browser notification sent successfully");
    } else {
      console.log("Browser notifications not supported or not permitted. Using toast fallback.");
      // Fallback to toast notification
      import('react-toastify').then(({ toast }) => {
        toast.info(`${title}: ${message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      try {
        const permission = await Notification.requestPermission();
        console.log("Notification permission:", permission);
        if (permission === "granted") {
          console.log("✅ Browser notifications enabled!");
        } else {
          console.log("❌ Browser notifications denied");
        }
      } catch (error) {
        console.log("Error requesting notification permission:", error);
      }
    } else if (Notification.permission === "denied") {
      console.log("Notification permission was denied. Please enable it in browser settings.");
    }
  };

  const App = () => {
    useEffect(() => {
      // Request notification permission on app load
      requestNotificationPermission();

    // Initialize socket connection and set up global event handlers
    console.log("Initializing socket connection...");

    // Global event handlers for real-time updates
    const handleTableCreated = (event) => {
      console.log("Global: Table created", event.detail);
      // Refresh table data if on table management page
      if (window.location.pathname.includes("/table-management")) {
        window.dispatchEvent(new CustomEvent("refreshTableData"));
      }
    };

    const handleTableUpdated = (event) => {
      console.log("Global: Table updated", event.detail);
      // Update specific table if on table details page
      if (window.location.pathname.includes("/table-details")) {
        const currentTableId = window.location.pathname.split("/").pop();
        if (currentTableId === event.detail._id) {
          window.dispatchEvent(
            new CustomEvent("refreshTableDetails", { detail: event.detail })
          );
        }
      }
    };

    const handleTableDeleted = (event) => {
      console.log("Global: Table deleted", event.detail);
      // Navigate away if on deleted table's details page
      if (window.location.pathname.includes("/table-details")) {
        const currentTableId = window.location.pathname.split("/").pop();
        if (currentTableId === event.detail.id) {
          window.location.href = "/table-management";
        }
      }
    };

    const handleReservationCreated = (event) => {
      console.log("Global: Reservation created", event.detail);
      // Refresh reservation data if on reservations page
      if (window.location.pathname.includes("/reservations")) {
        window.dispatchEvent(new CustomEvent("refreshReservationData"));
      }
    };

    const handleReservationStatusChanged = (event) => {
      console.log("Global: Reservation status changed", event.detail);
      // Update reservation if on reservation details page
      if (window.location.pathname.includes("/reservations/")) {
        const currentReservationId = window.location.pathname.split("/")[2];
        if (currentReservationId === event.detail.id) {
          window.dispatchEvent(
            new CustomEvent("refreshReservationDetails", {
              detail: event.detail,
            })
          );
        }
      }
    };

    // Add event listeners
    window.addEventListener("tableCreated", handleTableCreated);
    window.addEventListener("tableUpdated", handleTableUpdated);
    window.addEventListener("tableDeleted", handleTableDeleted);
    window.addEventListener("reservationCreated", handleReservationCreated);
    window.addEventListener(
      "reservationStatusChanged",
      handleReservationStatusChanged
    );

    // Cleanup function
    return () => {
      window.removeEventListener("tableCreated", handleTableCreated);
      window.removeEventListener("tableUpdated", handleTableUpdated);
      window.removeEventListener("tableDeleted", handleTableDeleted);
      window.removeEventListener(
        "reservationCreated",
        handleReservationCreated
      );
      window.removeEventListener(
        "reservationStatusChanged",
        handleReservationStatusChanged
      );
    };
  }, []);

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
          <Route path="/table-details/:id" element={<TableDetails />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/reservations/:id/edit" element={<ReservationEdit />} />
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

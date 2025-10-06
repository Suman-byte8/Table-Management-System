import React, { useState, useEffect } from "react";
import TableInfo from "../components/TableDetails/TableInfo";
import CurrentAssignee from "../components/TableDetails/CurrentAssignee";
import AssignmentHistory from "../components/TableDetails/AssignmentHistory";
import { useParams } from "react-router-dom";
import { tableApi } from "../api/tableApi";
import { toast } from "react-toastify";
import socket from "../socket";

const TableDetails = () => {
  const { id } = useParams();
  console.log("🔍 useParams() ID:", id);

  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Current assignee and history data from API
  const [currentAssignee, setCurrentAssignee] = useState(null);
  const [assignmentHistory, setAssignmentHistory] = useState([]);

  useEffect(() => {
    console.log("🔍 useParams() ID:", id);

    if (!id) {
      console.log("❌ No ID provided - ID value:", id);
      setError("No table ID provided");
      setLoading(false);
      return;
    }

    const fetchTableDetails = async () => {
      try {
        console.log("🚀 Fetching table details for ID:", id);

        // Validate ID format (MongoDB ObjectId is 24 hex chars)
        if (!id || id.length !== 24 || !/^[a-f0-9]+$/i.test(id)) {
          console.log("❌ Invalid ID format:", id);
          setError("Invalid table ID");
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await tableApi.getById(id);
        console.log("✅ API Response:", response);

        if (!response?.data) {
          console.log("❌ No data in response");
          setError("Table not found");
          setLoading(false);
          return;
        }

        setTable(response.data);
        // Update currentAssignee and assignmentHistory from response data
        if (response.data.currentGuest) {
          setCurrentAssignee({
            name: response.data.currentGuest,
            role: "Guest",
            assignedAt: response.data.lastAssignedAt
              ? new Date(response.data.lastAssignedAt).toLocaleTimeString()
              : "N/A",
            avatar: "/default-avatar.png", // Default avatar
          });
        } else {
          setCurrentAssignee(null);
        }

        if (
          response.data.assignmentHistory &&
          Array.isArray(response.data.assignmentHistory)
        ) {
          const history = response.data.assignmentHistory.map((item) => ({
            name: item.guestName || item.assignedBy || "Unknown",
            role: "Guest",
            assignedAt: item.assignedAt
              ? new Date(item.assignedAt).toLocaleTimeString()
              : "N/A",
            unassignedAt: item.freedAt
              ? new Date(item.freedAt).toLocaleTimeString()
              : "N/A",
            avatar: "/default-avatar.png", // Default avatar
          }));
          setAssignmentHistory(history);
        } else {
          setAssignmentHistory([]);
        }
      } catch (error) {
        console.error("❌ Error fetching table details:", error);
        console.error("❌ Error response:", error.response);
        setError("Failed to load table details");
        toast.error("Failed to load table details");
      } finally {
        console.log("✅ Finally block executed");
        setLoading(false);
      }
    };

    if (id) {
      fetchTableDetails(id);
    } else {
      console.log("❌ No ID provided");
      setError("No table ID provided");
      setLoading(false);
    }

    // Set up socket listeners for real-time updates
    socket.on("tableUpdated", (updatedTable) => {
      console.log("Table updated:", updatedTable);
      if (updatedTable._id === id) {
        setTable(updatedTable);
        toast.info("Table updated");
      }
    });

    socket.on("tableDeleted", ({ id: deletedId }) => {
      console.log("Table deleted:", deletedId);
      if (deletedId === id) {
        toast.warning("This table has been deleted");
        window.location.href = "/table-management";
      }
    });

    // Global event listener for refreshTableDetails
    const handleRefreshTableDetails = (event) => {
      console.log("Refreshing table details...", event.detail);
      if (event.detail && event.detail._id === id) {
        setTable(event.detail);
      } else {
        fetchTableDetails();
      }
    };

    window.addEventListener("refreshTableDetails", handleRefreshTableDetails);

    // Cleanup socket listeners on unmount
    return () => {
      socket.off("tableUpdated");
      socket.off("tableDeleted");
      window.removeEventListener(
        "refreshTableDetails",
        handleRefreshTableDetails
      );
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading table details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Table
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Table Not Found
          </h3>
          <p className="text-gray-500">
            The table you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      {/* Back Button */}
      <div className="">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 mb-6 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          &larr; Back to Table Management
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Table {table.tableNumber || table._id}
        </h1>
        <p className="text-gray-500">Details and assignment history</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Table Info Card */}
        <div className="lg:col-span-2">
          <TableInfo
            table={table}
            onTableUpdate={(id, updatedTable) => {
              setTable(updatedTable);
              toast.success("Table updated successfully");
            }}
          />
        </div>

        {/* Current Assignee */}
        <div className="lg:col-span-1">
          <CurrentAssignee assignee={currentAssignee} />
        </div>

        {/* Assignment History */}
        <div className="lg:col-span-3">
          <AssignmentHistory history={assignmentHistory} />
        </div>
      </div>
    </div>
  );
};

export default TableDetails;

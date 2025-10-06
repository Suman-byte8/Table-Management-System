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

  // Mock data for current assignee and history (you'll replace with real API later)
  const [currentAssignee, setCurrentAssignee] = useState({
    name: "Ethan Carter",
    role: "Server",
    assignedAt: "6:00 PM",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0ooHRv6v3hS0YlKDCJhb6XgHrswBbAro6yn8-Ni8hZH-q_Ni9hXiNe0szQB0EhW80Hgjid15-gOfUwLIQ4OsWKz_2kaq9FOUY5AFf0O6DeNDXdyYcGYGKD3kff9kdAZBKR94G5sQHm6RIGYCptoO4sOS94_2a6wz-LrBbM2fDq_6AWzQfR_YUDEpiaN237vC1J2BhV3MCbVGc74x8lHrUQVEld1GoPZZupdpikzTYzsH6hT2iIbDow76Yt9zKAoXJUTtETWncDYQ",
  });

  const [assignmentHistory, setAssignmentHistory] = useState([
    {
      name: "Olivia Bennett",
      role: "Server",
      assignedAt: "5:00 PM",
      unassignedAt: "6:00 PM",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzTHd2kheNUthuTp97jIiqxSzm49GVudT0Kavq6GBqWo29pMA0OrAXz43kxWioHCNtoovIUYYgt0NULlIobQEgdDKSMRUep4kSlox9Lk1SSp7msMUlvRSjwzJINNDFnaHedi7uwK20bXaqNnWjrxwFsiakYGEi1Ug3JY5wEcZ6CNUMBuO7DSZisKyOFHcfb-eq3wqiYQfNJIyY304j-Zc_o4UTau9UEJZ2tEjHpqHlP1XB1cRVa-RigeoiLmBubNvQ55qgWqflnB4",
    },
    {
      name: "Noah Thompson",
      role: "Server",
      assignedAt: "4:00 PM",
      unassignedAt: "5:00 PM",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp1N16uGRalqdL5vgre2IbDgVahMhcRKEyvQ-R7hsUD9h6Cxh2gJEmz1jG8GwP4au_CH55w0v4hs5BM-LHLbhEEqA_gvKdsKXAKCpcVPRHyK53qwomjQV-ZFu64BgP8JNhb8Z5d2KVqEzCDR5MYDan20_hlNFavcsBQzYnYbhgrBUzNdwAxyjT7dWkvtEbBA5OXOyOFvazwE_0QOdzXczYL0-szzGvA5EaJT4IPJadLk2mC63ejz0arbG6MOejt5zr-IUmYTbrcv0",
    },
    {
      name: "Ava Harper",
      role: "Server",
      assignedAt: "3:00 PM",
      unassignedAt: "4:00 PM",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdJOw--MP_T1oDaHZ0hqKoj_LBkZ8olFzD0yvw289xlHjsFomROsazMvGMZEtuAsEkSlAO3ATVqIySfih05qXZ9eXWNHUZW5DtvqbpuFutUPm4EUZdnz9wtiofvtxU-Nw3Z-Ta7RjKGl1svdKsZidpB9oW8e-JArf9NOoGd5kI5T-z74p8wT5083gw_OkNdKJL6-EorrlWQLR28b0Oms-wbIgyJFZUeVf2reXFTypZQv44lmXNqb3spKr1ebShAgeO1PQGNJm9-mk",
    },
  ]);

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
    socket.on('tableUpdated', (updatedTable) => {
      console.log('Table updated:', updatedTable);
      if (updatedTable._id === id) {
        setTable(updatedTable);
        toast.info('Table updated');
      }
    });

    socket.on('tableDeleted', ({ id: deletedId }) => {
      console.log('Table deleted:', deletedId);
      if (deletedId === id) {
        toast.warning('This table has been deleted');
        window.location.href = '/table-management';
      }
    });

    // Global event listener for refreshTableDetails
    const handleRefreshTableDetails = (event) => {
      console.log('Refreshing table details...', event.detail);
      if (event.detail && event.detail._id === id) {
        setTable(event.detail);
      } else {
        fetchTableDetails();
      }
    };

    window.addEventListener('refreshTableDetails', handleRefreshTableDetails);

    // Cleanup socket listeners on unmount
    return () => {
      socket.off('tableUpdated');
      socket.off('tableDeleted');
      window.removeEventListener('refreshTableDetails', handleRefreshTableDetails);
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
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Table</h3>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Table Not Found</h3>
          <p className="text-gray-500">The table you're looking for doesn't exist.</p>
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
          <TableInfo table={table} onTableUpdate={(id, updatedTable) => {
            setTable(updatedTable);
            toast.success('Table updated successfully');
          }} />
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
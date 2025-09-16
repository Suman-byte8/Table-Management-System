import React, { useState, useEffect } from "react";
import TableGrid from "../components/TableManagement/TableGrid";
import { tableApi } from "../api/tableApi"; // Import your table API
import { toast } from "react-toastify";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tables from API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await tableApi.getAll();
        
 // In TableManagement.jsx, after fetching data:
const transformedTables = (response.data || []).map(table => ({
  _id: table._id, // ✅ Make sure this exists
  id: table._id, // ✅ Fallback
  tableNumber: table.tableNumber,
  capacity: table.capacity,
  status: table.status,
  section: table.section,
  locationDescription: table.locationDescription,
}));
        
        setTables(transformedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
        setError("Failed to load tables");
        toast.error("Failed to load tables. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tables...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tables</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        {tables.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No tables found</h3>
            <p className="text-gray-500">Create your first table in Settings.</p>
          </div>
        ) : (
          <TableGrid tables={tables} />
        )}
      </main>
    </div>
  );
};

export default TableManagement;
import React, { useState, useEffect } from "react";
import { tableApi } from "../../api/tableApi";

// status → color mapping
const statusColors = {
  available: "bg-green-500",
  reserved: "bg-yellow-500",
  occupied: "bg-red-500",
  dirty: "bg-gray-500",
  maintenance: "bg-blue-500",
};

// status badge colors
const statusBadgeColors = {
  available: "bg-green-100 text-green-700",
  reserved: "bg-yellow-100 text-yellow-700",
  occupied: "bg-red-100 text-red-700",
  dirty: "bg-gray-100 text-gray-700",
  maintenance: "bg-blue-100 text-blue-700",
};

const FloorPlan = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch only available tables from API
  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        setLoading(true);
        // Filter for available tables only
        const response = await tableApi.getAll({
          status: 'available'
        });
        
        // Transform API data to match your UI component structure
        const transformedTables = (response.data || []).map(table => ({
          id: table.tableNumber || table._id,
          seats: table.capacity,
          status: table.status, // should be 'available'
          _id: table._id,
          section: table.section,
          locationDescription: table.locationDescription,
        }));
        
        // ✅ Take only first 6 tables
        const firstSixTables = transformedTables.slice(0, 6);
        setTables(firstSixTables);
      } catch (error) {
        console.error("Error fetching available tables:", error);
        setError("Failed to load available tables");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTables();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Available Tables</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading available tables...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Available Tables</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tables</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md fixed">
      <h2 className="text-xl font-bold mb-4">Available Tables</h2>
      {tables.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No tables currently available</p>
          <p className="text-gray-400 text-sm mt-2">All tables are either reserved or occupied</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div
              key={table._id || table.id}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition cursor-pointer hover:bg-gray-50"
            >
              {/* table circle */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-lg font-semibold ${
                  statusColors[table.status] || statusColors.available
                }`}
              >
                {table.id}
              </div>
              {/* seats info */}
              <p className="mt-3 text-gray-700 text-sm">
                {table.seats} seats
              </p>
              {/* status badge */}
              <span
                className={`mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  statusBadgeColors[table.status] || statusBadgeColors.available
                }`}
              >
                {table.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloorPlan;
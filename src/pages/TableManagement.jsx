import React, { useState, useEffect } from "react";
import TableGrid from "../components/TableManagement/TableGrid";
import { tableApi } from "../api/tableApi";
import { toast } from "react-toastify";
import TableFilters from "../components/TableManagement/TableFilters";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    section: "all",
    status: "all",
    minCapacity: "",
    maxCapacity: "",
  });

  // Fetch tables from API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await tableApi.getAll();

        const transformedTables = (response.data || []).map((table) => ({
          _id: table._id,
          id: table._id,
          tableNumber: table.tableNumber,
          capacity: table.capacity,
          status: table.status,
          section: table.section,
          locationDescription: table.locationDescription,
        }));

        setTables(transformedTables);
        setFilteredTables(transformedTables);
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

  // Apply filters whenever filters or tables change
  useEffect(() => {
    let filtered = [...tables];

    // Filter by section
    if (filters.section !== "all") {
      filtered = filtered.filter((table) => table.section === filters.section);
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((table) => table.status === filters.status);
    }

    // Filter by capacity
    if (filters.minCapacity) {
      filtered = filtered.filter(
        (table) => table.capacity >= parseInt(filters.minCapacity)
      );
    }
    if (filters.maxCapacity) {
      filtered = filtered.filter(
        (table) => table.capacity <= parseInt(filters.maxCapacity)
      );
    }

    setFilteredTables(filtered);
  }, [filters, tables]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      section: "all",
      status: "all",
      minCapacity: "",
      maxCapacity: "",
    });
  };

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
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Tables
            </h3>
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
      <main className="flex-1 p-6">
        {/* Filters Section */}
        <TableFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          totalTables={tables.length}
          filteredCount={filteredTables.length}
        />

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredTables.length} of {tables.length} tables
          </p>
        </div>

        {/* Table Grid */}
        {filteredTables.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No tables match your filters
            </h3>
            <p className="text-gray-500">Try adjusting your filter criteria.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <TableGrid tables={filteredTables} />
        )}
      </main>
    </div>
  );
};

export default TableManagement;

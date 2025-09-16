import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { tableApi } from "../api/tableApi";
import { toast } from "react-toastify";

const Settings = () => {
  const [table, setTable] = useState({
    tableNumber: "",
    capacity: "",
    locationDescription: "",
    section: "restaurant",
    status: "available",
    features: [],
  });

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Load existing tables on mount
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setFetching(true);
      const response = await tableApi.getAll();
      setTables(response.data || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to load tables");
    } finally {
      setFetching(false);
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();

    if (!table.tableNumber || !table.capacity) {
      toast.error("Table number and capacity are required");
      return;
    }

    setLoading(true);
    try {
      const tableData = {
        tableNumber: table.tableNumber,
        capacity: parseInt(table.capacity),
        section: table.section,
        status: table.status,
        locationDescription: table.locationDescription,
        features: table.features,
      };

      const response = await tableApi.create(tableData);

      toast.success("Table created successfully!");
      setTables((prev) => [...prev, response.data]);

      // Reset form
      setTable({
        tableNumber: "",
        capacity: "",
        locationDescription: "",
        section: "restaurant",
        status: "available",
        features: [],
      });
    } catch (error) {
      console.error("Error creating table:", error);
      toast.error(error.response?.data?.message || "Failed to create table");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm("Are you sure you want to delete this table?")) {
      return;
    }

    try {
      await tableApi.delete(tableId);
      toast.success("Table deleted successfully!");
      setTables((prev) => prev.filter((t) => t._id !== tableId));
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Failed to delete table");
    }
  };

  return (
    <main className="flex-1 p-8 bg-[#f7f9f8] min-h-screen">
      <div className="max-w-full ">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Table Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create, manage, and configure your restaurant tables.
          </p>
        </header>

        <div className="space-y-12">
          {/* Create Table Form */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">
              Create New Table
            </h2>
            <form onSubmit={handleCreateTable}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700 pb-2">
                    Table Number *
                  </p>
                  <input
                    className="form-input rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                    placeholder="e.g. T1, Bar-5"
                    value={table.tableNumber}
                    onChange={(e) =>
                      setTable({ ...table, tableNumber: e.target.value })
                    }
                    required
                  />
                </label>
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700 pb-2">
                    Capacity *
                  </p>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="form-input rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                    placeholder="e.g. 4"
                    value={table.capacity}
                    onChange={(e) =>
                      setTable({ ...table, capacity: e.target.value })
                    }
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700 pb-2">
                    Section
                  </p>
                  <select
                    className="form-select rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                    value={table.section}
                    onChange={(e) =>
                      setTable({ ...table, section: e.target.value })
                    }
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="bar">Bar</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700 pb-2">
                    Status
                  </p>
                  <select
                    className="form-select rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                    value={table.status}
                    onChange={(e) =>
                      setTable({ ...table, status: e.target.value })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="occupied">Occupied</option>
                    <option value="dirty">Dirty</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </label>

                <label className="flex flex-col md:col-span-2">
                  <p className="text-sm font-medium text-gray-700 pb-2">
                    Location Description
                  </p>
                  <input
                    className="form-input rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                    placeholder="e.g. Near window, Corner table"
                    value={table.locationDescription}
                    onChange={(e) =>
                      setTable({
                        ...table,
                        locationDescription: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md h-10 px-4 bg-green-500 text-white text-sm font-bold hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Table
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Existing Tables List */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">
              Existing Tables ({tables.length})
            </h2>
            {fetching ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : tables.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tables created yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Section
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tables.map((tbl) => (
                      <tr key={tbl._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tbl.tableNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {tbl.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tbl.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              tbl.status === "available"
                                ? "bg-green-100 text-green-800"
                                : tbl.status === "reserved"
                                ? "bg-yellow-100 text-yellow-800"
                                : tbl.status === "occupied"
                                ? "bg-red-100 text-red-800"
                                : tbl.status === "dirty"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {tbl.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tbl.locationDescription || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteTable(tbl._id)}
                            className="text-red-600 hover:text-red-900 ml-4"
                            title="Delete Table"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;

import React from "react";
import TableGrid from "../components/TableManagement/TableGrid";

// Sample table data
const tables = [
  { id: 1, capacity: 4, status: "free" },
  { id: 2, capacity: 2, status: "reserved" },
  { id: 3, capacity: 6, status: "occupied" },
  { id: 4, capacity: 4, status: "free" },
  { id: 5, capacity: 8, status: "free" },
  { id: 6, capacity: 4, status: "occupied" },
  { id: 7, capacity: 6, status: "reserved" },
  { id: 8, capacity: 2, status: "free" },
  { id: 9, capacity: 4, status: "occupied" },
  { id: 10, capacity: 6, status: "free" },
  { id: 11, capacity: 2, status: "reserved" },
  { id: 12, capacity: 8, status: "free" },
];

const TableManagement = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        <TableGrid tables={tables} />
      </main>
    </div>
  );
};

export default TableManagement;
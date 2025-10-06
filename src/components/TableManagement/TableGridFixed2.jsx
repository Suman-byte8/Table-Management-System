import React from "react";
import TableCard from "./TableCardFixed2";

const TableGrid = ({ tables }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map((table) => (
        <TableCard key={table._id || table.id} table={table} />
      ))}
    </div>
  );
};

export default TableGrid;

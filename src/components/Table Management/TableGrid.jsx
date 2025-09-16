import React from "react";
import TableCard from "./TableCard";

const TableGrid = ({ tables }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  );
};

export default TableGrid;
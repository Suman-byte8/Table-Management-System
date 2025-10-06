import React from "react";
import TableCard from "./TableCardFixed";

const TableGrid = ({
  tables,
  selectedTables = [],
  onTableSelect = null,
  onTableSelectSingle = null,
  onTableUpdate = null,
  onTableDelete = null
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map((table) => (
        <TableCard
          key={table._id || table.id}
          table={table}
          isSelected={selectedTables.includes(table._id || table.id)}
          onSelect={onTableSelect}
          onEdit={onTableSelectSingle}
          onDelete={onTableDelete}
        />
      ))}
    </div>
  );
};

export default TableGrid;

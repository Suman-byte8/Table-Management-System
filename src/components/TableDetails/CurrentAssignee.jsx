import React from "react";

const CurrentAssignee = ({ assignee }) => {
  return (
    <div className="rounded-lg border border-gray-200  bg-white shadow-sm p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Current Assignee</h2>
      <div className="flex items-center gap-4">
        <img
          src={assignee.avatar}
          alt={assignee.name}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{assignee.name}</p>
          <p className="text-sm text-gray-500">Assigned at {assignee.assignedAt}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentAssignee;
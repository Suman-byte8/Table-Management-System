import React from "react";

const AssignmentHistory = ({ history }) => {
  return (
    <div className="rounded-lg border border-gray-200  bg-white shadow-sm p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Assignment History</h2>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-4">
            <div className="flex items-center gap-4">
              <img
                src={item.avatar}
                alt={item.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Assigned at {item.assignedAt} - Unassigned at {item.unassignedAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentHistory;
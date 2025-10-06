import React from "react";

const CurrentAssignee = ({ assignee }) => {
  return (
    <div className="rounded-lg border border-gray-200  bg-white shadow-sm p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Current Assignee</h2>
      {assignee ? (
        <div className="flex items-center gap-4">
          {assignee.avatar && assignee.avatar !== '/default-avatar.png' ? (
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-lg">
                {assignee.name ? assignee.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{assignee.name}</p>
            <p className="text-sm text-gray-500">Assigned at {assignee.assignedAt}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 font-semibold text-lg">N/A</span>
          </div>
          <p className="text-gray-500">No current assignee</p>
        </div>
      )}
    </div>
  );
};

export default CurrentAssignee;
import React from "react";

const EmptyState = ({ section }) => {
  return (
    <div className="text-center py-10 text-gray-500">
      No {section} tables available.
    </div>
  );
};

export default EmptyState;
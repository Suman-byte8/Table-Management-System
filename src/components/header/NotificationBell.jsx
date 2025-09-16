import React from "react";

const NotificationBell = ({ count }) => {
  return (
    <button className="relative text-gray-600 hover:text-gray-800">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h4l-4 4v-4zM10 17h4v-4h-4v4zm-4 0H5a2 2 0 01-2-2V9.4a2 2 0 012-2h3v4h-3v8h4v-4z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
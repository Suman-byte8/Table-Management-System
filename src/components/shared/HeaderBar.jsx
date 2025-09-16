import React from "react";
import NotificationBell from "../header/NotificationBell";
import UserProfile from "../header/UserProfile";

const HeaderBar = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Table Manager</h1>
      <div className="flex items-center gap-4">
        <NotificationBell count={3} />
        <UserProfile />
      </div>
    </header>
  );
};

export default HeaderBar;
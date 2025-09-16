import React, { useState } from "react";

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleChangePassword = () => {
    // Will integrate with backend later
    console.log("Change password clicked");
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-6 text-xl font-semibold text-gray-700">Security Settings</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Change Password</span>
          <button 
            onClick={handleChangePassword}
            className="rounded-md bg-[#3d84f5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            Change
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Two-Factor Authentication</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              checked={twoFactorEnabled}
              onChange={toggleTwoFactor}
              className="peer sr-only"
              type="checkbox"
            />
            <div 
              className={`peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#3d84f5] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300`}
            ></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;

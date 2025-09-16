import React from "react";

const RolePermissions = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-6 text-xl font-semibold text-gray-700">Role and Permissions</h3>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="role">
            Role
          </label>
          <input
            className="mt-1 p-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
            id="role"
            type="text"
            value="Administrator"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="permissions">
            Permissions
          </label>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-500">- Full access to all system features.</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RolePermissions;

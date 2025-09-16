import React from "react";
import PersonalInfo from "../../components/adminProfile/PersonalInfo";
import RolePermissions from "../../components/adminProfile/RolePermissions";
import SecuritySettings from "../../components/adminProfile/SecuritySettings";


const AdminProfile = () => {
  const handleSaveChanges = () => {
    // Will integrate with backend later
    console.log("Save changes clicked");
  };

  return (
    <main className="flex-1 p-8 bg-gray-100">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">Admin Profile</h2>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Personal Info & Role */}
        <div className="col-span-1 space-y-8 lg:col-span-2">
          <PersonalInfo />
          <RolePermissions />
        </div>
        
        {/* Right Column - Security Settings */}
        <div className="col-span-1 space-y-8">
          <SecuritySettings />
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSaveChanges}
          className="rounded-md bg-[#3d84f5] px-6 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
};

export default AdminProfile;
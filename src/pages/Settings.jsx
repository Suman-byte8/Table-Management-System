import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Settings = () => {
  const [table, setTable] = useState({ name: "", capacity: "", coords: "", division: "Restaurant" });
  const [division, setDivision] = useState("");
  const [general, setGeneral] = useState({ holdTime: 15, cutoff: "" });
  const [sms, setSms] = useState({ provider: "Twilio", apiKey: "" });

  const handleSave = () => {
    console.log("Settings saved", { table, division, general, sms });
  };

  return (
    <main className="flex-1 p-8 bg-[#f7f9f8] min-h-screen">
      <div className="max-w-full ">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your restaurant's settings and preferences.</p>
        </header>

        <div className="space-y-12">
          {/* Table Management */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Table Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <p className="text-sm font-medium text-gray-700 pb-2">Table Name</p>
                <input
                  className="form-input rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                  placeholder="e.g. Table 1"
                  value={table.name}
                  onChange={(e) => setTable({ ...table, name: e.target.value })}
                />
              </label>
              <label className="flex flex-col">
                <p className="text-sm font-medium text-gray-700 pb-2">Capacity</p>
                <input
                  type="number"
                  className="form-input rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                  placeholder="e.g. 4"
                  value={table.capacity}
                  onChange={(e) => setTable({ ...table, capacity: e.target.value })}
                />
              </label>

              <label className="flex flex-col">
                <p className="text-sm font-medium text-gray-700 pb-2">Division</p>
                <select
                  className="form-select rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                  value={table.division}
                  onChange={(e) => setTable({ ...table, division: e.target.value })}
                >
                  <option>Restaurant</option>
                  <option>Bar</option>
                </select>
              </label>
            </div>
            <div className="mt-6">
              <button className="flex items-center gap-2 rounded-md h-10 px-4 bg-green-500 text-white text-sm font-bold hover:bg-green-600">
                <FaPlus /> Add Table
              </button>
            </div>
          </section>

          {/* Division Management */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Division Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <p className="text-sm font-medium text-gray-700 pb-2">Division Name</p>
                <input
                  className="form-input rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                  placeholder="e.g. Patio"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                />
              </label>
            </div>
            <div className="mt-6">
              <button className="flex items-center gap-2 rounded-md h-10 px-4 bg-green-500 text-white text-sm font-bold hover:bg-green-600">
                <FaPlus /> Add Division
              </button>
            </div>
          </section>


          {/* SMS Provider */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">SMS Provider</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <p className="text-sm font-medium text-gray-700 pb-2">Provider</p>
                <select
                  className="form-select rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                  value={sms.provider}
                  onChange={(e) => setSms({ ...sms, provider: e.target.value })}
                >
                  <option>Twilio</option>
                  <option>Vonage</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="flex flex-col">
                <p className="text-sm font-medium text-gray-700 pb-2">API Key</p>
                <input
                  type="password"
                  className="form-input rounded-md border-gray-300 outline-0 border-1 p-2 focus:border-green-500 focus:ring-green-500"
                  placeholder="••••••••••••••••"
                  value={sms.apiKey}
                  onChange={(e) => setSms({ ...sms, apiKey: e.target.value })}
                />
              </label>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end mt-12 border-t border-gray-200 pt-6">
          <button className="rounded-md h-10 px-6 bg-gray-200 text-gray-700 text-sm font-bold mr-4 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md h-10 px-6 bg-green-500 text-white text-sm font-bold hover:bg-green-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </main>
  );
};

export default Settings;

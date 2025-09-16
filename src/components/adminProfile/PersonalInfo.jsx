import React, { useState } from "react";

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    contact: "+1 234 567 890"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-6 text-xl font-semibold text-gray-700">Personal Information</h3>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="name">
            Name
          </label>
          <input
            name="name"
            className="outline-none p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="email">
            Email Address
          </label>
          <input
            name="email"
            className="outline-none p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600" htmlFor="contact">
            Contact Number
          </label>
          <input
            name="contact"
            className="outline-none p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            id="contact"
            type="text"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";

const AdminLogin = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    twofa: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", form);
    // TODO: call backend API
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdpsQH5qAr-ib9xT-TBGcIc9TSq9CRvkTpU9yvIQzC8DTyQ-BqbuwfeCdakK6FbeLdOsuzLxkjbBf-M0XSf8NP03li8jZ6r_85EVgp4VuqzveYYf_LMd-n3OK4Bu5ID5-J0nudjvxMGHq3YsvG-DN6ZYLKifzmlek7tpXxcHvEcQ_cSS73wkINAfVkZePrIKbJzABy06S3psieO7iZ70mpY2exO80GVxtagUOwdHJhFoXxz-CXbJtw7uOMmc2y8PAB6cwwIGOeCXA')",
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3 text-3xl font-bold text-[var(--text-dark)]">
              <svg
                className="h-8 w-8 text-[var(--text-dark)]"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
              TableMaster
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-dark)]">
              Admin Login
            </h2>
            <p className="text-[var(--text-light)] text-xs">
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Username */}
              <div className="relative">
                <label className="sr-only" htmlFor="username">
                  Username
                </label>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]">
                <FaUserCheck/>
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className="form-input flex w-full resize-none overflow-hidden rounded-lg pl-10 h-12 p-4 text-base font-normal"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]">
                <FaLock />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input flex w-full resize-none overflow-hidden rounded-lg pl-10 h-12 p-4 text-base font-normal"
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex items-center justify-end">
              <a
                // href=""
                className="text-sm font-medium text-[var(--text-dark)] hover:text-[var(--primary-color)] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="bg-black text-white flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 text-base font-bold tracking-wide"
            >
              Log in
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

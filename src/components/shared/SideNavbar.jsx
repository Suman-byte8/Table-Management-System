import React, { useRef } from "react";
import { FaHome, FaChair, FaCalendarAlt, FaCog } from "react-icons/fa";
import gsap from "gsap";
import { Link } from "react-router-dom";

const SideNavbar = () => {
  const labelRefs = useRef([]);

  const items = [
    { name: "Home", icon: FaHome, path: "/" },
    { name: "Tables", icon: FaChair, path: "/floor-plan-view" },
    { name: "Reservations", icon: FaCalendarAlt, path: "/reservations" },
    { name: "Settings", icon: FaCog, path: "/settings" },
    { name: "Logout", icon: null }
  ];

  const handleHover = (index, enter) => {
    gsap.to(labelRefs.current[index], {
      opacity: enter ? 1 : 0,
      x: enter ? 10 : 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-12 rounded-r-xl bg-gray-100  text-black flex flex-col items-center py-6 px-6 space-y-6 shadow-lg z-50">
      {/* Logo / top icon */}
      <div className="text-2xl font-bold text-blue-400">🍽️</div>

      {/* Nav icons */}
    <nav className="flex flex-col gap-8 mt-8">
        {items.slice(0, 4).map(({ icon: Icon, name }, index) => (
          <Link to={items[index].path} key={index} className="relative flex items-center">
            <button
              className="hover:text-gray-400"
              onMouseEnter={() => handleHover(index, true)}
              onMouseLeave={() => handleHover(index, false)}
            >
              <Icon size={18} />
            </button>
            <span
              ref={(el) => (labelRefs.current[index] = el)}
              className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 pointer-events-none whitespace-nowrap"
            >
              {name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Bottom icon */}
      <div className="mt-auto mb-4 relative flex items-center">
        <button
          className="hover:text-red-400"
          onMouseEnter={() => handleHover(4, true)}
          onMouseLeave={() => handleHover(4, false)}
        >
          <span className="text-lg">⏻</span>
        </button>
        <span
          ref={(el) => (labelRefs.current[4] = el)}
          className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 pointer-events-none whitespace-nowrap"
        >
          {items[4].name}
        </span>
      </div>
    </div>
  );
};

export default SideNavbar;

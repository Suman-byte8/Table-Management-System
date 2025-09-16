import React, { useState, useEffect } from "react";
import { reservationApi } from "../../../api/reservations";

const StatsGrid = () => {
  const [stats, setStats] = useState([
    { value: "0", label: "Reservations Today", color: "text-gray-900" },
    { value: "0", label: "Confirmed", color: "text-gray-900" },
    { value: "0", label: "Seated", color: "text-gray-900" },
    { value: "12", label: "Available Tables", color: "text-gray-900" },
    { value: "0", label: "No-shows", color: "text-red-500" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const rawData = await reservationApi.getAll();
        const reservations = Array.isArray(rawData) ? rawData : rawData?.data || [];

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter reservations for today
        const todayReservations = reservations.filter(res => {
          const resDate = new Date(res.date).toISOString().split('T')[0];
          return resDate === today;
        });

        const totalToday = todayReservations.length;
        const confirmedToday = todayReservations.filter(res => res.status === 'confirmed').length;

        // For now, seated and no-shows are 0
        const seated = 0;
        const noShows = 0;

        // Available tables: assuming total tables is 20, subtract confirmed reservations (assuming each confirmed takes a table)
        // This is a simplification; in reality, you'd need table assignments
        const totalTables = 20;
        const availableTables = Math.max(0, totalTables - confirmedToday);

        setStats([
          { value: totalToday.toString(), label: "Reservations Today", color: "text-gray-900" },
          { value: confirmedToday.toString(), label: "Confirmed", color: "text-gray-900" },
          { value: seated.toString(), label: "Seated", color: "text-gray-900" },
          { value: availableTables.toString(), label: "Available Tables", color: "text-gray-900" },
          { value: noShows.toString(), label: "No-shows", color: "text-red-500" },
        ]);
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Keep default values on error
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-md border border-gray-200 text-center"
        >
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
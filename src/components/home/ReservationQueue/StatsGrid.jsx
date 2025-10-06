import React, { useState, useEffect } from "react";
import { reservationApi } from "../../../api/reservationsApi";
import { tableApi } from "../../../api/tableApi";

const StatsGrid = () => {
  
  const [stats, setStats] = useState([
    { value: "0", label: "Reservations Today", color: "text-gray-900" },
    { value: "0", label: "Confirmed", color: "text-gray-900" },
    { value: "0", label: "Seated", color: "text-gray-900" },
    { value: "0", label: "Available Tables", color: "text-gray-900" },
    { value: "0", label: "No-shows", color: "text-red-500" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch reservations
        const reservationResponse = await reservationApi.getAll();
        const reservations = Array.isArray(reservationResponse) ? reservationResponse : reservationResponse?.data || [];

        // Fetch tables
        const tableResponse = await tableApi.getAll();
        const tables = Array.isArray(tableResponse) ? tableResponse : tableResponse?.data || [];

        // Get today's date range (start and end of today)
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Filter reservations for today
        const todayReservations = reservations.filter(res => {
          const resDate = new Date(res.date);
          return resDate >= startOfDay && resDate <= endOfDay;
        });

        // Calculate statistics
        const totalToday = todayReservations.length;
        const confirmedToday = todayReservations.filter(res => res.status === 'confirmed').length;
        const seatedToday = todayReservations.filter(res => res.status === 'seated').length;
        const noShows = todayReservations.filter(res => res.status === 'no-show').length;

        // Calculate available tables
        const availableTables = tables.filter(table => table.status === 'available').length;

        setStats([
          { value: totalToday.toString(), label: "Reservations Today", color: "text-gray-900" },
          { value: confirmedToday.toString(), label: "Confirmed", color: "text-green-600" },
          { value: seatedToday.toString(), label: "Seated", color: "text-blue-600" },
          { value: availableTables.toString(), label: "Available Tables", color: "text-gray-900" },
          { value: noShows.toString(), label: "No-shows", color: "text-red-500" },
        ]);
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Keep default values on error
      }
    };

    fetchStats();

    // Global event listener for refreshReservationData
    const handleRefreshReservationData = () => {
      console.log('Refreshing stats grid data...');
      fetchStats();
    };

    window.addEventListener('refreshReservationData', handleRefreshReservationData);

    return () => {
      window.removeEventListener('refreshReservationData', handleRefreshReservationData);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-md border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow"
        >
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
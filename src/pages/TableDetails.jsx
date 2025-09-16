import React from "react";
import TableInfo from "../components/TableDetails/TableInfo";
import CurrentAssignee from "../components/TableDetails/CurrentAssignee";
import AssignmentHistory from "../components/TableDetails/AssignmentHistory";


const TableDetails = () => {
  // Mock data for table #7
  const table = {
    id: 7,
    capacity: 4,
    status: "available",
  };

  const currentAssignee = {
    name: "Ethan Carter",
    role: "Server",
    assignedAt: "6:00 PM",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0ooHRv6v3hS0YlKDCJhb6XgHrswBbAro6yn8-Ni8hZH-q_Ni9hXiNe0szQB0EhW80Hgjid15-gOfUwLIQ4OsWKz_2kaq9FOUY5AFf0O6DeNDXdyYcGYGKD3kff9kdAZBKR94G5sQHm6RIGYCptoO4sOS94_2a6wz-LrBbM2fDq_6AWzQfR_YUDEpiaN237vC1J2BhV3MCbVGc74x8lHrUQVEld1GoPZZupdpikzTYzsH6hT2iIbDow76Yt9zKAoXJUTtETWncDYQ",
  };

  const assignmentHistory = [
    {
      name: "Olivia Bennett",
      role: "Server",
      assignedAt: "5:00 PM",
      unassignedAt: "6:00 PM",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzTHd2kheNUthuTp97jIiqxSzm49GVudT0Kavq6GBqWo29pMA0OrAXz43kxWioHCNtoovIUYYgt0NULlIobQEgdDKSMRUep4kSlox9Lk1SSp7msMUlvRSjwzJINNDFnaHedi7uwK20bXaqNnWjrxwFsiakYGEi1Ug3JY5wEcZ6CNUMBuO7DSZisKyOFHcfb-eq3wqiYQfNJIyY304j-Zc_o4UTau9UEJZ2tEjHpqHlP1XB1cRVa-RigeoiLmBubNvQ55qgWqflnB4",
    },
    {
      name: "Noah Thompson",
      role: "Server",
      assignedAt: "4:00 PM",
      unassignedAt: "5:00 PM",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp1N16uGRalqdL5vgre2IbDgVahMhcRKEyvQ-R7hsUD9h6Cxh2gJEmz1jG8GwP4au_CH55w0v4hs5BM-LHLbhEEqA_gvKdsKXAKCpcVPRHyK53qwomjQV-ZFu64BgP8JNhb8Z5d2KVqEzCDR5MYDan20_hlNFavcsBQzYnYbhgrBUzNdwAxyjT7dWkvtEbBA5OXOyOFvazwE_0QOdzXczYL0-szzGvA5EaJT4IPJadLk2mC63ejz0arbG6MOejt5zr-IUmYTbrcv0",
    },
    {
      name: "Ava Harper",
      role: "Server",
      assignedAt: "3:00 PM",
      unassignedAt: "4:00 PM",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdJOw--MP_T1oDaHZ0hqKoj_LBkZ8olFzD0yvw289xlHjsFomROsazMvGMZEtuAsEkSlAO3ATVqIySfih05qXZ9eXWNHUZW5DtvqbpuFutUPm4EUZdnz9wtiofvtxU-Nw3Z-Ta7RjKGl1svdKsZidpB9oW8e-JArf9NOoGd5kI5T-z74p8wT5083gw_OkNdKJL6-EorrlWQLR28b0Oms-wbIgyJFZUeVf2reXFTypZQv44lmXNqb3spKr1ebShAgeO1PQGNJm9-mk",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Table {table.id}</h1>
        <p className="text-gray-500">Details and assignment history</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Table Info Card */}
        <div className="lg:col-span-2">
          <TableInfo table={table} />
        </div>

        {/* Current Assignee */}
        <div className="lg:col-span-1">
          <CurrentAssignee assignee={currentAssignee} />
        </div>

        {/* Assignment History */}
        <div className="lg:col-span-3">
          <AssignmentHistory history={assignmentHistory} />
        </div>
      </div>
    </div>
  );
};

export default TableDetails;
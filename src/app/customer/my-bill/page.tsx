import React from "react";
import MyBillsTable, { Bill } from "@/modules/customer/my-bill/MyBillsTable";

// TODO: Replace with real API call
const mockBills: Bill[] = [
  {
    id: "1",
    name: "School Fees",
    description: "2024/2025 Academic Session",
    code: "SCH-2024-01",
    startDate: "2024-06-01",
    endDate: "2024-07-01",
    createdAt: "2024-05-20 10:00:00",
  },
  {
    id: "2",
    name: "Hostel Fees",
    description: "Hostel accommodation for 2024/2025",
    code: "HST-2024-01",
    startDate: "2024-06-10",
    endDate: "2024-07-10",
    createdAt: "2024-05-22 14:30:00",
  },
];

const MyBillPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-ajo_offWhite">My Bills</h1>
      <MyBillsTable bills={mockBills} />
    </div>
  );
};

export default MyBillPage; 
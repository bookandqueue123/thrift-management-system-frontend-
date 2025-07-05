import React from "react";
import Link from "next/link";

export interface Bill {
  id: string;
  name: string;
  description: string;
  code: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface MyBillsTableProps {
  bills: Bill[];
}

const MyBillsTable: React.FC<MyBillsTableProps> = ({ bills }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill&apos;s name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill start date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill end date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date and time of creation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bills.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                No bills assigned.
              </td>
            </tr>
          ) : (
            bills.map((bill, idx) => (
              <tr key={bill.id}>
                <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bill.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bill.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bill.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bill.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bill.endDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bill.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/customer/current-bill?id=${bill.id}`} className="text-blue-600 hover:underline">
                    View details
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyBillsTable; 
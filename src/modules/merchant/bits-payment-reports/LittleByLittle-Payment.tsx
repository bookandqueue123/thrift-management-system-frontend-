"use client"
import React, { useState } from 'react';
import TransactionsTable from '@/components/Tables';

// Mock data for demonstration
const mockPayments = [
  {
    customer: 'John Doe',
    customerId: 'CUST001',
    product: 'Smartphone',
    productDescription: 'Samsung Galaxy S21',
    productId: 'PROD123',
    orderId: 'ORD456',
    totalAmount: 36000,
    maxRepaymentPeriod: '3 months',
    minDeposit: 12000,
    totalPaid: 12000,
    totalBalance: 24000,
    paymentStartDate: '2025-06-01',
    paymentEndDate: '2025-08-31',
  },
  {
    customer: 'Jane Smith',
    customerId: 'CUST002',
    product: 'Laptop',
    productDescription: 'Dell XPS 13',
    productId: 'PROD456',
    orderId: 'ORD789',
    totalAmount: 150000,
    maxRepaymentPeriod: '6 months',
    minDeposit: 30000,
    totalPaid: 60000,
    totalBalance: 90000,
    paymentStartDate: '2025-01-15',
    paymentEndDate: '2025-07-15',
  },
];

const headers = [
  'S/N',
  'Customer',
  'Customer ID',
  'Product',
  "Product's Description",
  'Product ID',
  'Order ID',
  'Total Little-by-Little Payment Amount',
  'Maximum Repayment Period',
  'Minimum Deposit',
  'Total Amount Paid So Far',
  'Total Balance',
  'Payment Start Date',
  'Payment End Date',
  'View Breakdown',
];

const LittleByLittlePayment = () => {
  const [search, setSearch] = useState('');

  // Filter payments based on search query (case-insensitive, any field)
  const filteredPayments = mockPayments.filter(row => {
    const searchStr = search.toLowerCase();
    return (
      row.customer.toLowerCase().includes(searchStr) ||
      row.customerId.toLowerCase().includes(searchStr) ||
      row.product.toLowerCase().includes(searchStr) ||
      row.productDescription.toLowerCase().includes(searchStr) ||
      row.productId.toLowerCase().includes(searchStr) ||
      row.orderId.toLowerCase().includes(searchStr) ||
      row.maxRepaymentPeriod.toLowerCase().includes(searchStr) ||
      row.paymentStartDate.toLowerCase().includes(searchStr) ||
      row.paymentEndDate.toLowerCase().includes(searchStr)
    );
  });

  return (
    <div className="max-w-full mx-auto  rounded-lg shadow p-6 mt-8 text-white">
      <h2 className="text-xl font-bold mb-4">Little-by-Little Payment Report</h2>
      {/* Filter/Search section */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input type="date" className="rounded border px-3 py-2 text-black" />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input type="date" className="rounded border px-3 py-2 text-black" />
        </div>
        <div>
          <label className="block text-sm mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by customer, product, etc."
            className="rounded border px-3 py-2 text-black"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

      </div>
      <TransactionsTable
        headers={headers}
        content={
          <>
            {filteredPayments.map((row, idx) => (
              <tr key={row.orderId} className="border-b border-gray-700 hover:bg-[#23263a]">
                <td className="px-6 py-3 whitespace-nowrap">{idx + 1}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.customer}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.customerId}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.product}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.productDescription}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.productId}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.orderId}</td>
                <td className="px-6 py-3 whitespace-nowrap font-bold">₦{row.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.maxRepaymentPeriod}</td>
                <td className="px-6 py-3 whitespace-nowrap">₦{row.minDeposit.toLocaleString()}</td>
                <td className="px-6 py-3 whitespace-nowrap">₦{row.totalPaid.toLocaleString()}</td>
                <td className="px-6 py-3 whitespace-nowrap">₦{row.totalBalance.toLocaleString()}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.paymentStartDate}</td>
                <td className="px-6 py-3 whitespace-nowrap">{row.paymentEndDate}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">View Breakdown</button>
                </td>
              </tr>
            ))}
          </>
        }
      />
    </div>
  );
};

export default LittleByLittlePayment;
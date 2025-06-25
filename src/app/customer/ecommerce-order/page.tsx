'use client';
import React, { useState } from 'react'
import TransactionsTable from '@/components/Tables'
import { StatusIndicator } from '@/components/StatusIndicator'

const headers = [
  'S/N',
  'Product',
  'Description',
  'Quantity',
  'Amount',
  'Product ID',
  'Order ID',
  'Date & Time Ordered',
  'Completeness of Payment',
  'Mode of Delivery',
  'Delivery Status',
  'Delivery Cost',
  'Total Cost',
  'Action',
];

const sampleRows = [
  {
    sn: 1,
    product: 'Laptop',
    description: 'HP EliteBook',
    quantity: 1,
    amount: '₦500,000',
    productId: 'P123',
    orderId: 'O456',
    dateTime: '2024-06-23 10:00',
    payment: 'Full',
    mode: 'Door delivery',
    status: 'Delivered',
    deliveryCost: '₦2,000',
    totalCost: '₦502,000',
  },
  {
    sn: 2,
    product: 'Phone',
    description: 'Samsung Galaxy',
    quantity: 2,
    amount: '₦300,000',
    productId: 'P124',
    orderId: 'O457',
    dateTime: '2024-06-22 15:30',
    payment: 'Little-by-little',
    mode: 'Pickup centre',
    status: 'In-transit',
    deliveryCost: '₦1,000',
    totalCost: '₦301,000',
  },
  {
    sn: 3,
    product: 'Shoes',
    description: 'Nike Air',
    quantity: 1,
    amount: '₦50,000',
    productId: 'P125',
    orderId: 'O458',
    dateTime: '2024-06-21 12:00',
    payment: 'Full',
    mode: 'Door delivery',
    status: 'Returned',
    deliveryCost: '₦1,500',
    totalCost: '₦51,500',
  },
];

const OrderReport = () => {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number>(0);

  // Filter logic (for demo, just filter by product or description)
  const filteredRows = sampleRows.filter(row =>
    row.product.toLowerCase().includes(search.toLowerCase()) ||
    row.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  return (
    <div className="text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Customer&apos;s Orders Report</h2>
      {/* Search and Date Range Controls */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form className="flex items-center rounded-lg bg-[rgba(255,255,255,0.1)] p-3 w-full md:w-1/3">
          <input
            type="search"
            placeholder="Search by product or description"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
          />
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <circle
              cx="8.60996"
              cy="8.10312"
              r="7.10312"
              stroke="#EAEAFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.4121 13.4121L16.9997 16.9997"
              stroke="#EAEAFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </form>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="fromDate" className="text-sm font-semibold text-white mr-2">Range:</label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="rounded-lg bg-[rgba(255,255,255,0.1)] p-2 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
          />
          <span className="mx-2 text-white">to</span>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="rounded-lg bg-[rgba(255,255,255,0.1)] p-2 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
          />
        </div>
      </div>
      <TransactionsTable
        headers={headers}
        content={filteredRows.map((row, idx) => (
          <tr key={row.orderId} className="border-b border-ajo_offWhite/10">
            <td className="px-6 py-3 whitespace-nowrap">{row.sn}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.product}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.description}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.quantity}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.amount}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.productId}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.orderId}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.dateTime}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.payment}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.mode}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.status}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.deliveryCost}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.totalCost}</td>
            <td className="px-6 py-3 whitespace-nowrap">
              <StatusIndicator
                label="Actions"
                clickHandler={() => handleDropdown(idx + 1)}
                dropdownEnabled
                dropdownContents={{
                  labels: [
                    'View',
                    'Edit',
                  ],
                  actions: [
                    () => alert(`View ${row.product}`),
                    () => alert(`Edit ${row.product}`),
                  ],
                }}
                openDropdown={openDropdown}
                toggleDropdown={handleDropdown}
                currentIndex={idx + 1}
              />
            </td>
          </tr>
        ))}
      />
    </div>
  )
}

export default OrderReport
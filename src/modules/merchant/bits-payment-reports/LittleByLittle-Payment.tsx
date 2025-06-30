
"use client"
import React, { useState } from 'react';
import TransactionsTable from '@/components/Tables';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';

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

// Define types for the order data structure
interface Customer {
  name: string;
  id: string;
}

interface Product {
  name: string;
  description: string;
  id: string;
}

interface PaymentPlan {
  period: string;
  minDeposit: number;
  endDate: string;
}

interface Order {
  id: string;
  customer: Customer;
  product: Product;
  totalAmount: number;
  paymentPlan: PaymentPlan;
  totalPaid: number;
  createdAt: string;
}

const LittleByLittlePayment = () => {
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { client } = useAuth();
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await client.get('/api/order/admin/all?page=1&limit=10&paymentMode="Pay In Bits"');
      return res.data?.data?.orders || [];
    },
   
  });

  // Filter orders based on search query (case-insensitive, any field)
  const filteredOrders = orders.filter((order: Order) => {
    const searchStr = search.toLowerCase();
    return (
      order.customer?.name?.toLowerCase().includes(searchStr) ||
      order.customer?.id?.toLowerCase().includes(searchStr) ||
      order.product?.name?.toLowerCase().includes(searchStr) ||
      order.product?.description?.toLowerCase().includes(searchStr) ||
      order.product?.id?.toLowerCase().includes(searchStr) ||
      order.id?.toLowerCase().includes(searchStr) ||
      order.paymentPlan?.period?.toLowerCase().includes(searchStr) ||
      order.createdAt?.toLowerCase().includes(searchStr) ||
      order.paymentPlan?.endDate?.toLowerCase().includes(searchStr)
    );
  });

  // Format date for display
  const formatDate = (dateString: string | number | Date): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate total balance
  const calculateBalance = (totalAmount: number, totalPaid: number): number => {
    return (totalAmount || 0) - (totalPaid || 0);
  };

  if (isLoading) {
    return (
      <div className="max-w-full mx-auto rounded-lg shadow p-6 mt-8 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading payment data...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-full mx-auto rounded-lg shadow p-6 mt-8 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-400">
            Error loading data: {error?.message || 'Something went wrong'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto rounded-lg shadow p-6 mt-8 text-white">
      <h2 className="text-xl font-bold mb-4">Little-by-Little Payment Report</h2>
      
      {/* Filter/Search section */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input 
            type="date" 
            className="rounded border px-3 py-2 text-black"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input 
            type="date" 
            className="rounded border px-3 py-2 text-black"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-400">
                  No payment records found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: { id: React.Key | null | undefined; customer: { name: any; id: any; }; product: { name: any; description: any; id: any; }; totalAmount: number; paymentPlan: { period: any; minDeposit: any; endDate: string | number | Date; }; totalPaid: number; createdAt: string | number | Date; }, idx: number) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-[#23263a]">
                  <td className="px-6 py-3 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.customer?.name || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.customer?.id || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.product?.name || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.product?.description || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.product?.id || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.id || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-bold">
                    ₦{(order.totalAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.paymentPlan?.period || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    ₦{(order.paymentPlan?.minDeposit || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    ₦{(order.totalPaid || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    ₦{calculateBalance(order.totalAmount, order.totalPaid).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatDate(order.paymentPlan?.endDate)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                      View Breakdown
                    </button>
                  </td>
                </tr>
              ))
            )}
          </>
        }
      />
    </div>
  );
};

export default LittleByLittlePayment;
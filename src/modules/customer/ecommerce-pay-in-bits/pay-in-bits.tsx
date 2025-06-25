"use client"
import React from 'react';
import TransactionsTable from '@/components/Tables';

const mockOrder = {
  product: 'Phone',
  description: 'Samsung Galaxy S21',
  id: 'P123',
  orderId: 'O456',
  price: 36000,
};

const mockRepayments = [
  { date: '23/06/2025', amount: 12000, status: 'Paid' },
  { date: '23/07/2025', amount: 12000, status: 'Pending' },
  { date: '23/08/2025', amount: 12000, status: 'Pending' },
];

const totalAmount = 36000;
const maxPeriod = '3 months';
const minDeposit = 12000;

const PayInBits = () => {
  const totalRepayment = mockRepayments.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Little-by-Little Payment Report</h2>
      <div className="mb-4 text-gray-700">
        <strong>Selected Ordered Item:</strong> {mockOrder.product} - {mockOrder.description} (ID: {mockOrder.id}, Order ID: {mockOrder.orderId}, Price: ₦{mockOrder.price.toLocaleString()})
      </div>
      <div className="mb-2 text-gray-700">Total amount for little-by-little payment: <strong>₦{totalAmount.toLocaleString()}</strong></div>
      <div className="mb-2 text-gray-700">Maximum repayment period: <strong>{maxPeriod}</strong></div>
      <div className="mb-4 text-gray-700">Minimum deposit (i.e. down payment): <strong>₦{minDeposit.toLocaleString()}</strong></div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Breakdown</h3>
      <TransactionsTable
        headers={["Repayment Date", "Amount (₦)", "Status"]}
        content={
          <>
            {mockRepayments.map((repay, idx) => (
              <tr key={idx} className="border-b border-gray-100 text-gray-700">
                <td className="px-6 py-3 whitespace-nowrap">{repay.date}</td>
                <td className="px-6 py-3 whitespace-nowrap">{repay.amount.toLocaleString()}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${repay.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{repay.status}</span>
                </td>
              </tr>
            ))}
          </>
        }
      />
      <div className="mt-4 flex flex-col gap-1 text-gray-800">
        <span><strong>Total repayment:</strong> ₦{totalRepayment.toLocaleString()}</span>
        <span><strong>Grand total repayment:</strong> ₦{totalRepayment.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PayInBits;
import React from 'react'
import TransactionsTable from '@/components/Tables'

const deliveryHeaders = [
  'S/N',
  'Product',
  'Description',
  'Product ID',
  'Order ID',
  'Date/Time Ordered',
  "Confirm Rider's Arrival Time",
  "Take Product's Picture",
  "Take Rider's Picture",
  'Confirm Receipt of Product in Good Condition',
];

const mockDeliveries = [
  {
    sn: 1,
    product: 'Phone',
    description: 'Samsung Galaxy S21',
    productId: 'P123',
    orderId: 'O456',
    dateOrdered: '2023-06-23 10:00',
  },
  // Add more mock deliveries as needed
];

const Delivery = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-ajo_offWhite">Confirm Delivery</h1>
      <TransactionsTable
        headers={deliveryHeaders}
        content={mockDeliveries.map((item, idx) => (
          <tr key={item.orderId} className="border-b mb-10 border-ajo_offWhite/10">
            <td className="px-6 py-3 whitespace-nowrap">{item.sn}</td>
            <td className="px-6 py-3 whitespace-nowrap">{item.product}</td>
            <td className="px-6 py-3 whitespace-nowrap">{item.description}</td>
            <td className="px-6 py-3 whitespace-nowrap">{item.productId}</td>
            <td className="px-6 py-3 whitespace-nowrap">{item.orderId}</td>
            <td className="px-6 py-3 whitespace-nowrap">{item.dateOrdered}</td>
            <td className="px-6 py-3 whitespace-nowrap"><button className="bg-blue-500 text-white px-3 py-1 rounded">Check</button></td>
            <td className="px-6 py-3 whitespace-nowrap"><input type="file" accept="image/*" className="block" /></td>
            <td className="px-6 py-3 whitespace-nowrap"><input type="file" accept="image/*" className="block" /></td>
            <td className="px-6 py-3 whitespace-nowrap"><button className="bg-blue-500 text-white px-3 py-1 rounded">Check</button></td>
          </tr>
        ))}
      />
    </div>
  )
}

export default Delivery
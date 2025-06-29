// 'use client';
// import React, { useState } from 'react'
// import TransactionsTable from '@/components/Tables'
// import { StatusIndicator } from '@/components/StatusIndicator'
// import { useAuth } from '@/api/hooks/useAuth'
// import { useQuery } from '@tanstack/react-query';

// const headers = [
//   'S/N',
//   'Product',
//   'Description',
//   'Quantity',
//   'Amount',
//   'Product ID',
//   'Order ID',
//   'Date & Time Ordered',
//   'Completeness of Payment',
//   'Mode of Delivery',
//   'Delivery Status',
//   'Delivery Cost',
//   'Total Cost',
//   'Action',
// ];

// // Define types for order and order item
// interface OrderItem {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     category?: string;
//     productId?: string;
//   };
//   name: string;
//   quantity: number;
//   price: number;
// }

// interface Order {
//   _id: string;
//   orderItems: OrderItem[];
//   createdAt: string;
//   paymentMode?: string;
//   pickupStation?: any;
//   isDelivered?: boolean;
//   orderStatus?: string;
//   productPaymentTerms?: any;
//   totalPrice?: number;
// }

// const OrderReport = () => {
//   const { client } = useAuth();
//   const [search, setSearch] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [openDropdown, setOpenDropdown] = useState<number>(0);

//   const { data: orders = [], isLoading, isError, error } = useQuery({
//     queryKey: ['orders'],
//     queryFn: async () => {
//       const res = await client.get('/api/order/user/all?page=1&limit=10');
//       return res.data?.data?.orders || [];
//     },
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });

//   // Filter logic: by product, description, and date range
//   const filteredRows = orders.filter((order: Order) => {
//     // Each order may have multiple orderItems
//     const matchesSearch = order.orderItems.some((item: OrderItem) =>
//       item.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
//       item.product?.category?.toLowerCase().includes(search.toLowerCase())
//     );
//     let matchesDate = true;
//     if (fromDate) {
//       matchesDate = new Date(order.createdAt) >= new Date(fromDate);
//     }
//     if (toDate && matchesDate) {
//       matchesDate = new Date(order.createdAt) <= new Date(toDate);
//     }
//     return matchesSearch && matchesDate;
//   });

//   const handleDropdown = (val: number) => {
//     if (openDropdown === val) {
//       setOpenDropdown(0);
//     } else {
//       setOpenDropdown(val);
//     }
//   };

//   return (
//     <div className="text-white p-4">
//       <h2 className="text-2xl font-bold mb-4">Customer&apos;s Orders Report</h2>
//       {/* Search and Date Range Controls */}
//       <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <form className="flex items-center rounded-lg bg-[rgba(255,255,255,0.1)] p-3 w-full md:w-1/3">
//           <input
//             type="search"
//             placeholder="Search by product or description"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
//           />
//           <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
//             <circle
//               cx="8.60996"
//               cy="8.10312"
//               r="7.10312"
//               stroke="#EAEAFF"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M13.4121 13.4121L16.9997 16.9997"
//               stroke="#EAEAFF"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </form>
//         <div className="flex items-center gap-2 w-full md:w-auto">
//           <label htmlFor="fromDate" className="text-sm font-semibold text-white mr-2">Range:</label>
//           <input
//             id="fromDate"
//             type="date"
//             value={fromDate}
//             onChange={e => setFromDate(e.target.value)}
//             className="rounded-lg bg-[rgba(255,255,255,0.1)] p-2 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
//           />
//           <span className="mx-2 text-white">to</span>
//           <input
//             id="toDate"
//             type="date"
//             value={toDate}
//             onChange={e => setToDate(e.target.value)}
//             className="rounded-lg bg-[rgba(255,255,255,0.1)] p-2 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
//           />
//         </div>
//       </div>
//       {isLoading ? (
//         <div className="text-center py-10">Loading...</div>
//       ) : isError ? (
//         <div className="text-center text-red-500 py-10">{(error as any)?.message || 'Failed to fetch orders.'}</div>
//       ) : (
//         <TransactionsTable
//           headers={headers}
//           content={filteredRows.length === 0 ? (
//             <tr><td colSpan={headers.length} className="text-center py-6">No orders found.</td></tr>
//           ) : filteredRows.flatMap((order: Order, orderIdx: number) =>
//             order.orderItems.map((item: OrderItem, idx: number) => (
//               <tr key={item._id} className="border-b border-ajo_offWhite/10">
//                 <td className="px-6 py-3 whitespace-nowrap">{orderIdx + 1}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">{item.product?.name || item.name}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">{item.product?.category || '-'}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">{item.quantity}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">₦{item.price?.toLocaleString()}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">{item.product?.productId || item.product?._id || '-'}</td>
//                 {/* <td className="px-6 py-3 whitespace-nowrap">{order.orderId}</td> */}
//                 {/* <td className="px-6 py-3 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">{order.paymentMode}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">{order.pickupStation ? 'Pickup centre' : 'Door delivery'}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">{order.isDelivered ? 'Delivered' : order.orderStatus}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">₦{order.productPaymentTerms?.platformFee?.toLocaleString() || '-'}</td>
//                 <td className="px-6 py-3 whitespace-nowrap">₦{order.totalPrice?.toLocaleString()}</td> */}
//                 <td className="px-6 py-3 whitespace-nowrap">
//                   <StatusIndicator
//                     label="Actions"
//                     clickHandler={() => handleDropdown(orderIdx * 100 + idx + 1)}
//                     dropdownEnabled
//                     dropdownContents={{
//                       labels: [
//                         'View',
//                         'Edit',
//                       ],
//                       actions: [
//                         () => alert(`View ${item.product?.name || item.name}`),
//                         () => alert(`Edit ${item.product?.name || item.name}`),
//                       ],
//                     }}
//                     openDropdown={openDropdown}
//                     toggleDropdown={handleDropdown}
//                     currentIndex={orderIdx * 100 + idx + 1}
//                   />
//                 </td>
//               </tr>
//             ))
//           )}
//         />
//       )}
//     </div>
//   )
// }

// export default OrderReport



'use client';
import React, { useState } from 'react'
import TransactionsTable from '@/components/Tables'
import { StatusIndicator } from '@/components/StatusIndicator'
import { useAuth } from '@/api/hooks/useAuth'
import { useQuery } from '@tanstack/react-query';

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

// Define types for order and order item
interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    category?: string;
    productId?: string;
  };
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  orderItems: OrderItem[];
  createdAt: string;
  paymentMode?: string;
  pickupStation?: any;
  isDelivered?: boolean;
  orderStatus?: string;
  productPaymentTerms?: {
    platformFee?: number;
  };
  totalPrice?: number;
  paymentStatus?: string;
  isPaid?: boolean;
}

const OrderReport = () => {
  const { client } = useAuth();
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number>(0);

  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await client.get('/api/order/user/all?page=1&limit=10');
      return res.data?.data?.orders || [];
    },
   
  });

  // Filter logic: by product, description, and date range
  const filteredRows = orders.filter((order: Order) => {
    // Each order may have multiple orderItems
    const matchesSearch = order.orderItems.some((item: OrderItem) =>
      item.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.product?.category?.toLowerCase().includes(search.toLowerCase())
    );
    let matchesDate = true;
    if (fromDate) {
      matchesDate = new Date(order.createdAt) >= new Date(fromDate);
    }
    if (toDate && matchesDate) {
      matchesDate = new Date(order.createdAt) <= new Date(toDate);
    }
    return matchesSearch && matchesDate;
  });

  const handleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  // Create a flat array of items with proper indexing
  const flattenedItems = filteredRows.flatMap((order: Order, orderIdx: number) =>
    order.orderItems.map((item: OrderItem, itemIdx: number) => ({
      ...item,
      order,
      globalIndex: orderIdx * 100 + itemIdx + 1
    }))
  );

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
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : isError ? (
        <div className="text-center text-red-500 py-10">{(error as any)?.message || 'Failed to fetch orders.'}</div>
      ) : (
        <TransactionsTable
          headers={headers}
          content={filteredRows.length === 0 ? (
            <tr><td colSpan={headers.length} className="text-center py-6">No orders found.</td></tr>
          ) : flattenedItems.map((item: { _id: React.Key | null | undefined; product: { name: any; category: any; productId: any; _id: any; }; name: any; quantity: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; price: { toLocaleString: () => string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }; order: { orderId: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; createdAt: string | number | Date; isPaid: any; paymentStatus: any; pickupStation: any; isDelivered: any; orderStatus: any; productPaymentTerms: { platformFee: { toLocaleString: () => any; }; }; totalPrice: { toLocaleString: () => any; }; }; globalIndex: number | undefined; }, idx: number) => (
            <tr key={item._id} className="border-b border-ajo_offWhite/10">
              {/* S/N */}
              <td className="px-6 py-3 whitespace-nowrap">{idx + 1}</td>
              
              {/* Product */}
              <td className="px-6 py-3 whitespace-nowrap">{item.product?.name || item.name}</td>
              
              {/* Description */}
              <td className="px-6 py-3 whitespace-nowrap">{item.product?.category || '-'}</td>
              
              {/* Quantity */}
              <td className="px-6 py-3 whitespace-nowrap">{item.quantity}</td>
              
              {/* Amount */}
              <td className="px-6 py-3 whitespace-nowrap">₦{item.price?.toLocaleString()}</td>
              
              {/* Product ID */}
              <td className="px-6 py-3 whitespace-nowrap">{item.product?.productId || item.product?._id || '-'}</td>
              
              {/* Order ID */}
              <td className="px-6 py-3 whitespace-nowrap">{item.order.orderId}</td>
              
              {/* Date & Time Ordered */}
              <td className="px-6 py-3 whitespace-nowrap">{new Date(item.order.createdAt).toLocaleString()}</td>
              
              {/* Completeness of Payment */}
              <td className="px-6 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.order.isPaid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.order.isPaid ? 'Paid' : item.order.paymentStatus || 'Unpaid'}
                </span>
              </td>
              
              {/* Mode of Delivery */}
              <td className="px-6 py-3 whitespace-nowrap">
                {item.order.pickupStation ? 'Pickup Centre' : 'Door Delivery'}
              </td>
              
              {/* Delivery Status */}
              <td className="px-6 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.order.isDelivered 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.order.isDelivered ? 'Delivered' : item.order.orderStatus || 'Pending'}
                </span>
              </td>
              
              {/* Delivery Cost */}
              <td className="px-6 py-3 whitespace-nowrap">
                ₦{item.order.productPaymentTerms?.platformFee?.toLocaleString() || '0'}
              </td>
              
              {/* Total Cost */}
              <td className="px-6 py-3 whitespace-nowrap">₦{item.order.totalPrice?.toLocaleString() || '0'}</td>
              
              {/* Action */}
            
              </tr>
          ))}
        />
      )}
    </div>
  )
}

export default OrderReport
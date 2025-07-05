
// "use client"
// import React, { useState } from 'react';
// import TransactionsTable from '@/components/Tables';
// import { useQuery } from '@tanstack/react-query';
// import { useAuth } from '@/api/hooks/useAuth';

// const headers = [
//   'S/N',
//   'Customer',
//   'Customer ID',
//   'Product',
//   "Product's Description",
//   'Product ID',
//   'Order ID',
//   'Total Little-by-Little Payment Amount',
//   'Maximum Repayment Period',
//   'Minimum Deposit',
//   'Total Amount Paid So Far',
//   'Total Balance',
//   'Payment Start Date',
//   'Payment End Date',
//   'View Breakdown',
// ];

// // Define types for the order data structure
// interface Customer {
//   name: string;
//   id: string;
// }

// interface Product {
//   name: string;
//   description: string;
//   id: string;
// }

// interface PaymentPlan {
//   period: string;
//   minDeposit: number;
//   endDate: string;
// }

// interface Order {
//   id: string;
//   customer: Customer;
//   product: Product;
//   totalAmount: number;
//   paymentPlan: PaymentPlan;
//   totalPaid: number;
//   createdAt: string;
// }

// const LittleByLittlePayment = () => {
//   const [search, setSearch] = useState<string>('');
//   const [startDate, setStartDate] = useState<string>('');
//   const [endDate, setEndDate] = useState<string>('');

//   const { client } = useAuth();
//   const { data: orders = [], isLoading, isError, error } = useQuery({
//     queryKey: ['orders'],
//     queryFn: async () => {
//       const res = await client.get('/api/order/admin/all');
//       return res.data?.data?.orders;
//     },
   
//   });

//   // Filter orders based on search query (case-insensitive, any field)
//   const filteredOrders = orders.filter((order: Order) => {
//     const searchStr = search.toLowerCase();
//     return (
//       order.customer?.name?.toLowerCase().includes(searchStr) ||
//       order.customer?.id?.toLowerCase().includes(searchStr) ||
//       order.product?.name?.toLowerCase().includes(searchStr) ||
//       order.product?.description?.toLowerCase().includes(searchStr) ||
//       order.product?.id?.toLowerCase().includes(searchStr) ||
//       order.id?.toLowerCase().includes(searchStr) ||
//       order.paymentPlan?.period?.toLowerCase().includes(searchStr) ||
//       order.createdAt?.toLowerCase().includes(searchStr) ||
//       order.paymentPlan?.endDate?.toLowerCase().includes(searchStr)
//     );
//   });

//   // Format date for display
//   const formatDate = (dateString: string | number | Date): string => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString();
//   };

//   // Calculate total balance
//   const calculateBalance = (totalAmount: number, totalPaid: number): number => {
//     return (totalAmount || 0) - (totalPaid || 0);
//   };

//   if (isLoading) {
//     return (
//       <div className="max-w-full mx-auto rounded-lg shadow p-6 mt-8 text-white">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg">Loading payment data...</div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="max-w-full mx-auto rounded-lg shadow p-6 mt-8 text-white">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg text-red-400">
//             Error loading data: {error?.message || 'Something went wrong'}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-full mx-auto rounded-lg shadow p-6 mt-8 text-white">
//       <h2 className="text-xl font-bold mb-4">Little-by-Little Payment Report</h2>
      
//       {/* Filter/Search section */}
//       <div className="flex flex-wrap gap-4 mb-6 items-end">
//         <div>
//           <label className="block text-sm mb-1">Start Date</label>
//           <input 
//             type="date" 
//             className="rounded border px-3 py-2 text-black"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-sm mb-1">End Date</label>
//           <input 
//             type="date" 
//             className="rounded border px-3 py-2 text-black"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-sm mb-1">Search</label>
//           <input
//             type="text"
//             placeholder="Search by customer, product, etc."
//             className="rounded border px-3 py-2 text-black"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <TransactionsTable
//         headers={headers}
//         content={
//           <>
//             {filteredOrders.length === 0 ? (
//               <tr>
//                 <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-400">
//                   No payment records found
//                 </td>
//               </tr>
//             ) : (
//               filteredOrders.map((order: { id: React.Key | null | undefined; customer: { name: any; id: any; }; product: { name: any; description: any; id: any; }; totalAmount: number; paymentPlan: { period: any; minDeposit: any; endDate: string | number | Date; }; totalPaid: number; createdAt: string | number | Date; }, idx: number) => (
//                 <tr key={order.id} className="border-b border-gray-700 hover:bg-[#23263a]">
//                   <td className="px-6 py-3 whitespace-nowrap">{idx + 1}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">{order.customer?.name || 'N/A'}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">{order.customer?.id || 'N/A'}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">{order.product?.name || 'N/A'}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">{order.product?.description || 'N/A'}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">{order.product?.id || 'N/A'}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">{order.id || 'N/A'}</td>
//                   <td className="px-6 py-3 whitespace-nowrap font-bold">
//                     ₦{(order.totalAmount || 0).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap">{order.paymentPlan?.period || 'N/A'}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     ₦{(order.paymentPlan?.minDeposit || 0).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     ₦{(order.totalPaid || 0).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     ₦{calculateBalance(order.totalAmount, order.totalPaid).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap">{formatDate(order.createdAt)}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">{formatDate(order.paymentPlan?.endDate)}</td>
//                   <td className="px-6 py-3 whitespace-nowrap">
//                     <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
//                       View Breakdown
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </>
//         }
//       />
//     </div>
//   );
// };

// export default LittleByLittlePayment;
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

// Updated interfaces to match the actual API response structure
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Product {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string[];
}

interface OrderItem {
  product: Product | null;
  name: string;
  quantity: number;
  price: number;
  _id: string;
}

interface PaymentPlanItem {
  paymentNumber: number;
  dueDate: string;
  totalPayment: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  isPaid: boolean;
  actualAmountPaid: number;
  isOverdue: boolean;
  daysOverdue: number;
  lateFees: number;
  additionalInterest: number;
  isPartialPayment: boolean;
  isUnscheduledPayment: boolean;
  isEarlyPayment: boolean;
  _id: string;
}

interface ProductPaymentTerms {
  repaymentPeriodInMonths: number;
  mininumRepaymentAmount: number;
  mininumDepositPercentage: number;
  interestRatePercentage: number;
  platformFee: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  orderId: string;
  user: User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  productPaymentTerms: ProductPaymentTerms;
  paymentMethod: string;
  paymentMode: string;
  totalPrice: number;
  amountPaid: number;
  remainingBalance: number;
  paymentPlan: PaymentPlanItem[];
  isPaid: boolean;
  paidAt: string | null;
  isDelivered: boolean;
  orderStatus: string;
  paymentStatus: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
}

const LittleByLittlePayment = () => {
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const { client } = useAuth();
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await client.get('/api/order/admin/all');
      return res.data?.data?.orders || [];
    },
  });

  // Filter orders based on search query and date range
  const filteredOrders = orders.filter((order: Order) => {
    const searchStr = search.toLowerCase();
    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    // Date filtering
    if (start && orderDate < start) return false;
    if (end && orderDate > end) return false;
    
    // Search filtering
    if (!search) return true;
    
    const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase();
    const customerEmail = order.user?.email?.toLowerCase() || '';
    const productNames = order.orderItems?.map(item => item.name?.toLowerCase()).join(' ') || '';
    const productIds = order.orderItems?.map(item => item.product?.productId?.toLowerCase()).join(' ') || '';
    
    return (
      customerName.includes(searchStr) ||
      customerEmail.includes(searchStr) ||
      order.user?._id?.toLowerCase().includes(searchStr) ||
      productNames.includes(searchStr) ||
      productIds.includes(searchStr) ||
      order.orderId?.toLowerCase().includes(searchStr) ||
      order.paymentStatus?.toLowerCase().includes(searchStr) ||
      order.orderStatus?.toLowerCase().includes(searchStr)
    );
  });

  // Filter only "Pay In Bits" orders (installment payments)
  const payInBitsOrders = filteredOrders.filter((order: Order) => 
    order.paymentMode === "Pay In Bits"
  );

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get customer full name
  const getCustomerName = (user: User): string => {
    if (!user) return 'N/A';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
  };

  // Get primary product name
  const getPrimaryProduct = (orderItems: OrderItem[]): string => {
    if (!orderItems || orderItems.length === 0) return 'N/A';
    return orderItems[0]?.name || 'N/A';
  };

  // Get product description (using product name + quantity info)
  const getProductDescription = (orderItems: OrderItem[]): string => {
    if (!orderItems || orderItems.length === 0) return 'N/A';
    
    if (orderItems.length === 1) {
      const item = orderItems[0];
      return `${item.name} (Qty: ${item.quantity})`;
    }
    
    return `${orderItems.length} items - ${orderItems.map(item => 
      `${item.name} (${item.quantity})`
    ).join(', ')}`;
  };

  // Get primary product ID
  const getPrimaryProductId = (orderItems: OrderItem[]): string => {
    if (!orderItems || orderItems.length === 0) return 'N/A';
    return orderItems[0]?.product?.productId || orderItems[0]?.product?._id || 'N/A';
  };

  // Calculate minimum deposit based on percentage
  const calculateMinimumDeposit = (totalPrice: number, percentage: number): number => {
    return (totalPrice * percentage) / 100;
  };

  // Get payment end date from payment plan
  const getPaymentEndDate = (paymentPlan: PaymentPlanItem[]): string => {
    if (!paymentPlan || paymentPlan.length === 0) return 'N/A';
    const lastPayment = paymentPlan[paymentPlan.length - 1];
    return formatDate(lastPayment?.dueDate);
  };

  // Handle view breakdown
  const handleViewBreakdown = (order: Order) => {
    setSelectedOrder(order);
    setShowBreakdown(true);
  };

  // Close breakdown modal
  const closeBreakdown = () => {
    setShowBreakdown(false);
    setSelectedOrder(null);
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
            placeholder="Search by customer, product, order ID, etc."
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
            {payInBitsOrders.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-400">
                  No little-by-little payment records found
                </td>
              </tr>
            ) : (
              payInBitsOrders.map((order: Order, idx: number) => (
                <tr key={order._id} className="border-b border-gray-700 hover:bg-[#23263a]">
                  <td className="px-6 py-3 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{getCustomerName(order.user)}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs">{order.user?._id || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{getPrimaryProduct(order.orderItems)}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs max-w-xs truncate" title={getProductDescription(order.orderItems)}>
                    {getProductDescription(order.orderItems)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs">{getPrimaryProductId(order.orderItems)}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-mono text-xs">{order.orderId}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-bold text-green-400">
                    ₦{(order.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {order.productPaymentTerms?.repaymentPeriodInMonths || 'N/A'} months
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-blue-400">
                    ₦{calculateMinimumDeposit(
                      order.totalPrice || 0, 
                      order.productPaymentTerms?.mininumDepositPercentage || 0
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-green-400">
                    ₦{(order.amountPaid || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-orange-400">
                    ₦{(order.remainingBalance || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{getPaymentEndDate(order.paymentPlan)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                      onClick={() => handleViewBreakdown(order)}
                    >
                      View Breakdown
                    </button>
                  </td>
                </tr>
              ))
            )}
          </>
        }
      />

      {/* Payment Breakdown Modal */}
      {showBreakdown && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1d29] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Payment Breakdown - Order {selectedOrder.orderId}</h3>
              <button 
                onClick={closeBreakdown}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Order Summary */}
            <div className="bg-[#23263a] rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Order Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300"><span className="font-medium">Customer:</span> {getCustomerName(selectedOrder.user)}</p>
                  <p className="text-gray-300"><span className="font-medium">Product:</span> {getPrimaryProduct(selectedOrder.orderItems)}</p>
                  <p className="text-gray-300"><span className="font-medium">Total Price:</span> ₦{selectedOrder.totalPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-300"><span className="font-medium">Amount Paid:</span> ₦{selectedOrder.amountPaid?.toLocaleString()}</p>
                  <p className="text-gray-300"><span className="font-medium">Remaining Balance:</span> ₦{selectedOrder.remainingBalance?.toLocaleString()}</p>
                  <p className="text-gray-300"><span className="font-medium">Payment Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedOrder.paymentStatus === 'current' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {selectedOrder.paymentStatus?.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            <div className="bg-[#23263a] rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Payment Schedule</h4>
              {selectedOrder.paymentPlan && selectedOrder.paymentPlan.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 px-3 text-gray-300">Payment #</th>
                        <th className="text-left py-2 px-3 text-gray-300">Due Date</th>
                        <th className="text-left py-2 px-3 text-gray-300">Total Payment</th>
                        <th className="text-left py-2 px-3 text-gray-300">Principal</th>
                        <th className="text-left py-2 px-3 text-gray-300">Interest</th>
                        <th className="text-left py-2 px-3 text-gray-300">Balance After</th>
                        <th className="text-left py-2 px-3 text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.paymentPlan.map((payment, index) => (
                        <tr key={payment._id} className="border-b border-gray-700">
                          <td className="py-2 px-3 text-white">{payment.paymentNumber}</td>
                          <td className="py-2 px-3 text-white">{formatDate(payment.dueDate)}</td>
                          <td className="py-2 px-3 text-green-400 font-medium">₦{payment.totalPayment?.toLocaleString()}</td>
                          <td className="py-2 px-3 text-white">₦{payment.principalAmount?.toLocaleString()}</td>
                          <td className="py-2 px-3 text-orange-400">₦{payment.interestAmount?.toLocaleString()}</td>
                          <td className="py-2 px-3 text-white">₦{payment.remainingBalance?.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              payment.isPaid ? 'bg-green-600 text-white' : 
                              payment.isOverdue ? 'bg-red-600 text-white' : 
                              'bg-yellow-600 text-white'
                            }`}>
                              {payment.isPaid ? 'PAID' : payment.isOverdue ? 'OVERDUE' : 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No payment schedule available</p>
              )}
            </div>

            {/* Payment Terms */}
            <div className="bg-[#23263a] rounded-lg p-4 mt-4">
              <h4 className="text-lg font-semibold text-white mb-3">Payment Terms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300"><span className="font-medium">Repayment Period:</span> {selectedOrder.productPaymentTerms?.repaymentPeriodInMonths} months</p>
                  <p className="text-gray-300"><span className="font-medium">Interest Rate:</span> {selectedOrder.productPaymentTerms?.interestRatePercentage}%</p>
                </div>
                <div>
                  <p className="text-gray-300"><span className="font-medium">Minimum Deposit:</span> {selectedOrder.productPaymentTerms?.mininumDepositPercentage}%</p>
                  <p className="text-gray-300"><span className="font-medium">Platform Fee:</span> ₦{selectedOrder.productPaymentTerms?.platformFee?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LittleByLittlePayment;
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
  'Pay My Debts',
  'View Breakdown',
  'Payment Start Date',
  'Payment End Date',
];

// Define types for the order data structure based on API response
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
  organisationId: string;
}

interface OrderItem {
  product: Product | null;
  name: string;
  quantity: number;
  price: number;
  _id: string;
  imageUrl?: string[];
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
  transactionReference?: string;
  transactionDate?: string;
}

interface ProductPaymentTerms {
  repaymentPeriodInMonths: number;
  mininumRepaymentAmount: number;
  mininumDepositPercentage: number;
  interestRatePercentage: number;
  platformFee: number;
}

interface Order {
  _id: string;
  orderId: string;
  user: User;
  orderItems: OrderItem[];
  paymentMethod: string;
  paymentMode: string;
  totalPrice: number;
  amountPaid: number;
  remainingBalance: number;
  paymentPlan: PaymentPlanItem[];
  productPaymentTerms: ProductPaymentTerms;
  isPaid: boolean;
  paidAt: string | null;
  isDelivered: boolean;
  orderStatus: string;
  paymentStatus: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
}

interface PaymentBreakdownModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentBreakdownModal: React.FC<PaymentBreakdownModalProps> = ({ order, isOpen, onClose }) => {
  const { client } = useAuth();
   const [processingPayments, setProcessingPayments] = useState<Set<string>>(new Set());
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString()}`;
  };
  
    const startPaymentProcessing = (paymentId: string) => {
    setProcessingPayments(prev => new Set(prev).add(paymentId));
    setPaymentErrors(prev => ({ ...prev, [paymentId]: '' }));
  };

  // Remove payment from processing set
  const stopPaymentProcessing = (paymentId: string) => {
    setProcessingPayments(prev => {
      const newSet = new Set(prev);
      newSet.delete(paymentId);
      return newSet;
    });
  };

  // const handleMakePayment = async () => {
  //   setPaying(true);
  //   setPayError(null);
  //   try {
      
  //     const billItems = order.orderItems.map(item => ({
  //       billItemId: item._id,
  //       amountToPay: item.price * item.quantity 
  //     }));
  //     const res = await client.post('/api/payments/bills', {
  //       billId: order._id,
  //       billItems,
  //       paymentMethod: 'card',
  //       notes: 'Little by little payment',
  //     });
  //     const link = res?.data?.data?.data?.link;
  //     if (link) {


  //       window.location.href = link;
  //       return;
  //     }
  //   } catch (e: any) {
  //     setPayError(e.message || 'Payment failed');
  //   } finally {
  //     setPaying(false);
  //   }
  // };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Payment Breakdown - Order {order.orderId}</h3>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-6 bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Order Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="font-medium text-white">Customer:</span> {order.user.firstName} {order.user.lastName}
            </div>
            <div>
              <span className="font-medium text-white">Email:</span> {order.user.email}
            </div>
            <div>
              <span className="font-medium text-white">Total Price:</span> {formatCurrency(order.totalPrice)}
            </div>
            <div>
              <span className="font-medium text-white">Amount Paid:</span> {formatCurrency(order.amountPaid)}
            </div>
            <div>
              <span className="font-medium text-white">Remaining Balance:</span> {formatCurrency(order.remainingBalance)}
            </div>
            <div>
              <span className="font-medium text-white">Payment Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                order.isPaid ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
              }`}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mb-6 bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Payment Terms</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="font-medium text-white">Repayment Period:</span> {order.productPaymentTerms.repaymentPeriodInMonths} months
            </div>
           
          </div>
        </div>

        {/* Payment Schedule */}
        {order.paymentPlan.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-white mb-2">Payment Schedule</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-600">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Payment #</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Due Date</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Total Payment</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Principal</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Interest</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Remaining Balance</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Transaction Reference</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Date & Time of Transaction</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Pay My Debts</th>
                    <th className="border border-gray-600 px-3 py-2 text-left text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.paymentPlan.map((payment) => {
                    // For each payment row:
                    const orderItem = order.orderItems[0];
                    const productId = orderItem?.product?._id;
                    const quantity = orderItem?.quantity || 1;
                    const months = order.productPaymentTerms.repaymentPeriodInMonths;
                    const validMonths = months >= 1 && months <= 60 ? months : 1;
                    return (
                      <tr key={payment._id} className="hover:bg-gray-800">
                        <td className="border border-gray-600 px-3 py-2 text-gray-300">{payment.paymentNumber}</td>
                        <td className="border border-gray-600 px-3 py-2 text-gray-300">{formatDate(payment.dueDate)}</td>
                        <td className="border border-gray-600 px-3 py-2 text-gray-300">{formatCurrency(payment.totalPayment)}</td>
                        <td className="border border-gray-600 px-3 py-2 text-gray-300">{formatCurrency(payment.principalAmount)}</td>
                        <td className="border border-gray-600 px-3 py-2 text-gray-300">{formatCurrency(payment.interestAmount)}</td>
                        <td className="border border-gray-600 px-3 py-2 text-gray-300">{formatCurrency(payment.remainingBalance)}</td>
                        {/* Transaction Reference column */}
                        <td className="border border-gray-600 px-3 py-2 text-gray-300">{payment.transactionReference || 'N/A'}</td>
                        {/* Date & Time of Transaction column */}
                        <td className="border border-gray-600 px-3 py-2 text-gray-300">{payment.transactionDate ? new Date(payment.transactionDate).toLocaleString() : 'N/A'}</td>
                        {/* Pay My Debts button for each payment row */}
                        
                        {/* <td className="border border-gray-600 px-3 py-2 text-gray-300">
                          {!payment.isPaid && payment.remainingBalance > 0 && (
                            <button
                              className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors ${!productId ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={async () => {
                                setPaying(true);
                                setPayError(null);
                                try {
                                  const res = await client.post(
                                    '/api/payments/bits',
                                    {
                                      orderId: order._id,
                                      amount: payment.totalPayment
                                    }
                                  );
                                  const link = res?.data?.data?.data?.link;
                                  if (link) {
                                    window.location.href = link;
                                    return;
                                  }
                                } catch (e: any) {
                                  setPayError(e.message || 'Payment failed');
                                } finally {
                                  setPaying(false);
                                }
                              }}
                              disabled={paying || !productId}
                              title={!productId ? 'Product not found for this payment row' : ''}
                            >
                              {paying ? 'Processing...' : !productId ? 'Product not found' : 'Pay My Debts'}
                            </button>
                          )}
                        </td>
                         */}
                           
                           <td className="border border-gray-600 px-3 py-2 text-gray-300">
  {!payment.isPaid && (
    <>
      <button
        className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors ${
          !productId || processingPayments.has(payment._id) 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
        }`}
        onClick={async () => {
          if (!productId || processingPayments.has(payment._id)) return;
          
          startPaymentProcessing(payment._id);
          try {
            const res = await client.post(
              '/api/payments/bits',
              {
                orderId: order._id,
                amount: payment.totalPayment
              }
            );
            const link = res?.data?.data?.data?.link;
            if (link) {
              window.location.href = link;
            }
          } catch (e: any) {
            setPaymentErrors(prev => ({
              ...prev,
              [payment._id]: e.message || 'Payment failed'
            }));
          } finally {
            stopPaymentProcessing(payment._id);
          }
        }}
        disabled={processingPayments.has(payment._id) || !productId}
        title={!productId ? 'Product not found for this payment row' : ''}
      >
        {processingPayments.has(payment._id)
          ? 'Processing...' 
          : !productId 
            ? 'Product not found' 
            : 'Pay My Debts'}
      </button>
      
      {paymentErrors[payment._id] && (
        <div className="text-red-400 text-xs mt-1">
          {paymentErrors[payment._id]}
        </div>
      )}
    </>
  )}
</td>
                       
                        <td className="border border-gray-600 px-3 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.isPaid 
                              ? 'bg-green-600 text-white' 
                              : payment.isOverdue 
                              ? 'bg-red-600 text-white' 
                              : 'bg-yellow-600 text-white'
                          }`}>
                            {payment.isPaid ? 'Paid' : payment.isOverdue ? 'Overdue' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h4 className="font-semibold text-white mb-2">Order Items</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 px-3 py-2 text-left text-white">Image</th>
                  <th className="border border-gray-600 px-3 py-2 text-left text-white">Product</th>
                  <th className="border border-gray-600 px-3 py-2 text-left text-white">Quantity</th>
                  <th className="border border-gray-600 px-3 py-2 text-left text-white">Price</th>
                  <th className="border border-gray-600 px-3 py-2 text-left text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-800">
                    <td className="border border-gray-600 px-3 py-2 text-gray-300">
                      {item.imageUrl && item.imageUrl[0] ? (
                        <img
                          src={item.imageUrl[0]}
                          alt={item.name}
                          className="h-12 w-12 object-contain rounded"
                        />
                      ) : item.product?.imageUrl && item.product.imageUrl[0] ? (
                        <img
                          src={item.product.imageUrl[0]}
                          alt={item.name}
                          className="h-12 w-12 object-contain rounded"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="border border-gray-600 px-3 py-2 text-gray-300">{item.name}</td>
                    <td className="border border-gray-600 px-3 py-2 text-gray-300">{item.quantity}</td>
                    <td className="border border-gray-600 px-3 py-2 text-gray-300">{formatCurrency(item.price)}</td>
                    <td className="border border-gray-600 px-3 py-2 text-gray-300">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remove the Make Payment button section at the bottom of the modal */}
        {/* <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

const LittleByLittlePayment = () => {
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { client } = useAuth();
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await client.get('/api/order/user/all');
      return res.data.data.orders;
    },
  });

  // Filter orders to only show "Pay In Bits" orders
  const payInBitsOrders = orders.filter((order: Order) => order.paymentMode === 'Pay In Bits');

  // Filter orders based on search query and date range
  const filteredOrders = payInBitsOrders.filter((order: Order) => {
    const searchStr = search.toLowerCase();
    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Date filtering
    if (start && orderDate < start) return false;
    if (end && orderDate > end) return false;

    // Search filtering
    if (search && !searchStr) return true;
    
    const productName = order.orderItems[0]?.name?.toLowerCase() || '';
    const productId = order.orderItems[0]?.product?.productId?.toLowerCase() || '';
    const orderId = order.orderId?.toLowerCase() || '';
    const customerName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase();
    const customerEmail = order.user.email?.toLowerCase() || '';

    return (
      productName.includes(searchStr) ||
      productId.includes(searchStr) ||
      orderId.includes(searchStr) ||
      customerName.includes(searchStr) ||
      customerEmail.includes(searchStr)
    );
  });

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get the last payment due date
  const getPaymentEndDate = (paymentPlan: PaymentPlanItem[]): string => {
    if (!paymentPlan || paymentPlan.length === 0) return 'N/A';
    const lastPayment = paymentPlan[paymentPlan.length - 1];
    return formatDate(lastPayment.dueDate);
  };

  // Calculate minimum deposit amount
  const calculateMinimumDeposit = (totalPrice: number, depositPercentage: number): number => {
    return (totalPrice * depositPercentage) / 100;
  };

  const handleViewBreakdown = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-400">
                  No little-by-little payment records found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: Order, idx: number) => (
                <tr key={order._id} className="border-b border-gray-700 hover:bg-[#23263a]">
                  <td className="px-6 py-3 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.user.firstName} {order.user.lastName}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs">{order.user._id || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{order.orderItems[0]?.name || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs max-w-xs truncate" title={order.orderItems[0]?.name || 'N/A'}>
                    {order.orderItems[0]?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs">{order.orderItems[0]?.product?.productId || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-mono text-xs">{order.orderId || 'N/A'}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-bold text-white">
                    ₦{(order.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-white">
                    {order.productPaymentTerms?.repaymentPeriodInMonths || 'N/A'} months
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-white">
                    ₦{calculateMinimumDeposit(
                      order.totalPrice || 0, 
                      order.productPaymentTerms?.mininumDepositPercentage || 0
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-white">
                    ₦{(order.amountPaid || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-white">
                    ₦{(order.remainingBalance || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <button 
                      className="bg-blue-600 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                      onClick={() => handleViewBreakdown(order)}
                    >
                      Pay My Debts
                    </button>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <button 
                      className="bg-blue-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
                      onClick={() => handleViewBreakdown(order)}
                    >
                      View Breakdown
                    </button>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{getPaymentEndDate(order.paymentPlan)}</td>
                </tr>
              ))
            )}
          </>
        }
      />

      <PaymentBreakdownModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default LittleByLittlePayment;
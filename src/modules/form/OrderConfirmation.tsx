"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  _id: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentPlan {
  paymentNumber?: number;
  dueDate: string;
  totalPayment?: number;
  principalAmount?: number;
  interestAmount?: number;
  remainingBalance?: number;
  isPaid: boolean;
  actualAmountPaid?: number;
  isOverdue?: boolean;
  daysOverdue?: number;
  lateFees?: number;
  additionalInterest?: number;
  isPartialPayment?: boolean;
  isUnscheduledPayment?: boolean;
  isEarlyPayment?: boolean;
  _id: string;
  paidAt?: string;
}

interface Order {
  _id: string;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
  paymentMethod: string;
  paymentMode: string;
  totalPrice: number;
  amountPaid: number;
  remainingBalance: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  orderStatus: string;
  paymentStatus: string;
  paymentPlan?: PaymentPlan[];
  createdAt: string;
  updatedAt: string;
}

const OrderConfirmation: React.FC<{ paymentMode: 'full' | 'bits' }> = ({ paymentMode }) => {
  const router = useRouter();
  const { client } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await client.get('/api/order/myorders/all');
        setOrders(res.data || []);
      } catch (e: any) {
        setError('Failed to fetch orders.');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleProceedToPayment = () => {
    if (!orders.length) return;
    
    // Save order details to localStorage for payment page
    const orderDetails = {
      order: orders[0],
      total: orders[0].totalPrice,
      remainingBalance: orders[0].remainingBalance,
    };
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    router.push('/payment');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!orders.length) {
    return <div className="min-h-screen flex items-center justify-center">No orders found.</div>;
  }

  // Show the most recent order (first in array)
  const order = orders[0];
  const { shippingAddress, orderItems, paymentMode: orderPaymentMode, totalPrice, amountPaid, remainingBalance, paymentPlan } = order;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left side: Customer and Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-green-600 font-semibold">
                  <span className="mr-2">1. SHIPPING ADDRESS</span>
                </div>
              </div>
              <div>
                <p className="font-bold">{shippingAddress.address}, {shippingAddress.city}</p>
                <p className="text-gray-600 text-sm">{shippingAddress.postalCode}, {shippingAddress.country}</p>
              </div>
            </div>

            {/* Delivery & Payment Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-green-600 font-semibold">
                  <span className="mr-2">2. PAYMENT & DELIVERY</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold capitalize">{orderPaymentMode}</p>
                <span className="text-orange-500 font-bold">{order.orderStatus}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Payment status: {order.paymentStatus} | Paid: {order.isPaid ? 'Yes' : 'No'}</p>
              <p className="text-gray-600 text-sm mb-4">Amount Paid: ₦{amountPaid.toLocaleString()} | Remaining: ₦{remainingBalance.toLocaleString()}</p>
            </div>

            {/* Products Ordered */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-bold mb-4">Products Ordered</h3>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      {/* No image in orderItems, so use a placeholder */}
                      <Image src={'/market/Image8.png'} alt={item.name} width={64} height={64} className="rounded-md object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₦{item.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Subtotal: ₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Plan (if present) */}
            {paymentPlan && paymentPlan.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-bold mb-4">Payment Plan</h3>
                <div className="space-y-2">
                  {paymentPlan.map((plan, idx) => (
                    <div key={plan._id || idx} className="flex justify-between text-sm border-b pb-2 last:border-b-0">
                      <span>Due: {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString() : ''}</span>
                      {/* <span>Amount: ₦{plan.amount?.toLocaleString() || plan.totalPayment?.toLocaleString() || 0}</span> */}
                      <span>Status: {plan.isPaid ? 'Paid' : 'Pending'}</span>
                      {plan.paidAt && <span>Paid at: {new Date(plan.paidAt).toLocaleDateString()}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right side: Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border lg:sticky lg:top-8">
            <h2 className="text-xl font-bold mb-4">Order summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price</span>
                <span>₦ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span>₦ {amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span>₦ {remainingBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Status</span>
                <span>{order.orderStatus}</span>
              </div>
              {orderPaymentMode === 'Pay In Bits' && (
                <div className="flex justify-between text-sm">
                  <span>Payment Mode:</span>
                  <span className="font-semibold">Pay little-by-little</span>
                </div>
              )}
            </div>
            {/* Add back payment functionality */}
            <div className="mt-6">
              <button 
                onClick={handleProceedToPayment}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-md mt-4 hover:bg-orange-600"
              >
                {order.isPaid ? 'Make Payment' : 'Proceed to Payment'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              By proceeding, you are automatically accepting the <a href="#" className="text-blue-600">Terms & Conditions</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

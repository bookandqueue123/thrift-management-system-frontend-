// "use client"

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { Truck } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/api/hooks/useAuth';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import Navbar from "@/modules/HomePage/NavBar";
// import Footer from "@/modules/HomePage/Footer";

// interface CartItem {
//   _id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   imageUrl?: string;
//   size?: string;
//   product: {
//     _id: string;
//   };
// }

// interface OrderItem {
//   product: string;
//   name: string;
//   quantity: number;
//   price: number;
//   _id: string;
// }

// interface ShippingAddress {
//   address: string;
//   city: string;
//   postalCode: string;
//   country: string;
// }

// interface PaymentPlan {
//   paymentNumber?: number;
//   dueDate: string;
//   totalPayment?: number;
//   principalAmount?: number;
//   interestAmount?: number;
//   remainingBalance?: number;
//   isPaid: boolean;
//   actualAmountPaid?: number;
//   isOverdue?: boolean;
//   daysOverdue?: number;
//   lateFees?: number;
//   additionalInterest?: number;
//   isPartialPayment?: boolean;
//   isUnscheduledPayment?: boolean;
//   isEarlyPayment?: boolean;
//   _id: string;
//   paidAt?: string;
// }

// interface Order {
//   _id: string;
//   shippingAddress: ShippingAddress;
//   orderItems: OrderItem[];
//   paymentMethod: string;
//   paymentMode: string;
//   totalPrice: number;
//   amountPaid: number;
//   remainingBalance: number;
//   isPaid: boolean;
//   paidAt?: string;
//   isDelivered: boolean;
//   orderStatus: string;
//   paymentStatus: string;
//   paymentPlan?: PaymentPlan[];
//   createdAt: string;
//   updatedAt: string;
// }

// const OrderConfirmation: React.FC<{ paymentMode: 'full' | 'bits' }> = ({ paymentMode }) => {
//   const router = useRouter();
//   const { client } = useAuth();
//   const queryClient = useQueryClient();
//   const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

//   // Fetch cart items from API instead of relying on localStorage
//   const { 
//     data: cartData, 
//     isLoading: cartLoading, 
//     error: cartError,
//     refetch: refetchCart
//   } = useQuery({
//     queryKey: ['cart'],
//     queryFn: async () => {
//       const res = await client.get('/api/cart');
//       return res.data;
//     },
//   });

//   // Extract cart items from the response
//   const cartDetails: CartItem[] = cartData?.items || [];

//   // Fetch orders using useQuery instead of useEffect
//   const { data: orderQuery, isLoading: orderLoading, isError: orderError, error: orderErrorData } = useQuery({
//     queryKey: ['userOrders'],
//     queryFn: async () => {
//       return client
//         .get('/api/order/user/all?page=1&limit=10')
//         .then((response) => response.data?.data?.orders || [])
//         .catch((error) => {
//           throw error;
//         });
//     },
//   });

//   useEffect(() => {
//     // Only load delivery info from localStorage
//     const deliveryRaw = typeof window !== 'undefined' ? localStorage.getItem('deliveryInfo') : null;
//     if (deliveryRaw) {
//       setDeliveryInfo(JSON.parse(deliveryRaw));
//     }
//   }, []);

//   const handleProceedToPayment = () => {
//     if (cartDetails && cartDetails.length > 0) {
//       // Save cart details for payment page
//       localStorage.setItem('orderDetails', JSON.stringify({ 
//         cartItems: cartDetails, 
//         deliveryInfo, 
//         total: cartDetails.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0) 
//       }));
//       router.push('/payment');
//       return;
//     }
//     if (!orderQuery || !orderQuery.length) return;
//     // Save order details to localStorage for payment page
//     const orderDetails = {
//       order: orderQuery[0],
//       total: orderQuery[0].totalPrice,
//       remainingBalance: orderQuery[0].remainingBalance,
//     };
//     localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
//     router.push('/payment');
//   };

//   const isLoading = cartLoading || orderLoading;
//   const isError = cartError || orderError;
//   const error = cartError || orderErrorData;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex items-center justify-center h-64">
//           <div className="text-lg text-gray-600">Loading...</div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex items-center justify-center h-64">
//           <div className="text-lg text-red-600">{(error as any)?.message || 'Failed to fetch data.'}</div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // If cart details exist, show cart confirmation
//   if (cartDetails && Array.isArray(cartDetails) && cartDetails.length > 0) {
//     const total = cartDetails.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="max-w-6xl mx-auto py-8 px-4">
//           {/* Mode of Delivery at the top */}
//           <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
//             <div className="flex items-center text-green-600 font-semibold mb-2">
//               <span className="mr-2">Mode of Delivery</span>
//             </div>
//             {deliveryInfo ? (
//               <div>
//                 <p className="font-bold">{deliveryInfo.deliveryMode === 'pickup' ? `Pickup Station: ${deliveryInfo.pickupStation}` : `${deliveryInfo.city}, ${deliveryInfo.state}`}</p>
//                 <p className="text-gray-600 text-sm">Mode: {deliveryInfo.deliveryMode}</p>
//               </div>
//             ) : (
//               <p className="text-gray-600 text-sm">No delivery info found.</p>
//             )}
//           </div>
//           {/* Main content: Cart and Summary */}
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Cart Section */}
//             <div className="flex-1 bg-white rounded-lg shadow-sm border p-6">
//               <h2 className="text-2xl font-bold mb-6">Order Items <span className="text-lg font-semibold">({cartDetails.length})</span></h2>
//               {cartDetails.map((item: CartItem) => (
//                 <div key={item._id} className="flex items-center gap-6 border-b pb-6 last:border-b-0 last:pb-0 mb-6 last:mb-0">
//                   {/* Product Image */}
//                   <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
//                     <Image src={item.imageUrl || '/market/Image8.png'} alt={item.name} width={96} height={96} className="object-contain w-full h-full" />
//                   </div>
//                   {/* Product Details */}
//                   <div className="flex-1">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
//                       <div>
//                         <div className="text-lg font-semibold text-gray-900 mb-1">{item.name}</div>
//                         <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
//                         <div className="text-xs text-gray-500">In Stock</div>
//                       </div>
//                       <div className="text-2xl font-bold text-gray-900 mt-2 md:mt-0">₦ {item.price.toLocaleString()}</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* Cart Summary Sidebar */}
//             <div className="w-full lg:w-80 flex-shrink-0">
//               <div className="bg-white rounded-lg shadow-md border p-6 sticky top-24">
//                 <h3 className="text-lg font-bold mb-4 text-gray-800">ORDER SUMMARY</h3>
//                 <div className="flex justify-between items-center mb-6">
//                   <span className="text-gray-600 text-lg">Subtotal</span>
//                   <span className="text-2xl font-bold text-gray-900">₦ {total.toLocaleString()}</span>
//                 </div>
//                 <button
//                   onClick={handleProceedToPayment}
//                   className="w-full bg-orange-500 text-white font-bold py-4 rounded-lg text-lg hover:bg-orange-600 transition"
//                 >
//                   Make Payment (₦ {total.toLocaleString()})
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // Fallback: Show most recent order as before
//   if (!orderQuery || !orderQuery.length) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex items-center justify-center h-64">
//           <div className="text-lg text-gray-600">No orders found.</div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // Show the most recent order (first in array)
//   const order = orderQuery[0];
//   const { shippingAddress, orderItems, paymentMode: orderPaymentMode, totalPrice, amountPaid, remainingBalance, paymentPlan } = order;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="max-w-6xl mx-auto py-8 px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           {/* Left side: Customer and Delivery Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Shipping Address */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center text-green-600 font-semibold">
//                   <span className="mr-2">1. SHIPPING ADDRESS</span>
//                 </div>
//               </div>
//               <div>
//                 <p className="font-bold">{shippingAddress.address}, {shippingAddress.city}</p>
//                 <p className="text-gray-600 text-sm">{shippingAddress.postalCode}, {shippingAddress.country}</p>
//               </div>
//             </div>

//             {/* Delivery & Payment Details */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center text-green-600 font-semibold">
//                   <span className="mr-2">2. PAYMENT & DELIVERY</span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="font-bold capitalize">{orderPaymentMode}</p>
//                 <span className="text-orange-500 font-bold">{order.orderStatus}</span>
//               </div>
//               <p className="text-gray-600 text-sm mb-4">Payment status: {order.paymentStatus} | Paid: {order.isPaid ? 'Yes' : 'No'}</p>
//               <p className="text-gray-600 text-sm mb-4">Amount Paid: ₦{amountPaid.toLocaleString()} | Remaining: ₦{remainingBalance.toLocaleString()}</p>
//             </div>

//             {/* Products Ordered */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border">
//               <h3 className="font-bold mb-4">Products Ordered</h3>
//               <div className="space-y-4">
//                 {orderItems.map((item) => (
//                   <div key={item._id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
//                     <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
//                       {/* No image in orderItems, so use a placeholder */}
//                       <Image src={'/market/Image8.png'} alt={item.name} width={64} height={64} className="rounded-md object-contain" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-semibold text-sm">{item.name}</p>
//                       <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-bold">₦{item.price.toLocaleString()}</p>
//                       <p className="text-xs text-gray-500">Subtotal: ₦{(item.price * item.quantity).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Payment Plan (if present) */}
//             {paymentPlan && paymentPlan.length > 0 && (
//               <div className="bg-white p-6 rounded-lg shadow-sm border">
//                 <h3 className="font-bold mb-4">Payment Plan</h3>
//                 <div className="space-y-2">
//                   {(paymentPlan as any[]).map((plan: any, idx: number) => (
//                     <div key={plan._id || idx} className="flex justify-between text-sm border-b pb-2 last:border-b-0">
//                       <span>Due: {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString() : ''}</span>
//                       {/* <span>Amount: ₦{plan.amount?.toLocaleString() || plan.totalPayment?.toLocaleString() || 0}</span> */}
//                       <span>Status: {plan.isPaid ? 'Paid' : 'Pending'}</span>
//                       {plan.paidAt && <span>Paid at: {new Date(plan.paidAt).toLocaleDateString()}</span>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right side: Order Summary */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border lg:sticky lg:top-8">
//             <h2 className="text-xl font-bold mb-4">Order summary</h2>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Total Price</span>
//                 <span>₦ {totalPrice.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Amount Paid</span>
//                 <span>₦ {amountPaid.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Remaining</span>
//                 <span>₦ {remainingBalance.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg border-t pt-3">
//                 <span>Status</span>
//                 <span>{order.orderStatus}</span>
//               </div>
//               {orderPaymentMode === 'Pay In Bits' && (
//                 <div className="flex justify-between text-sm">
//                   <span>Payment Mode:</span>
//                   <span className="font-semibold">Pay little-by-little</span>
//                 </div>
//               )}
//             </div>
//             {/* Add back payment functionality */}
//             <div className="mt-6">
//               <button 
//                 onClick={handleProceedToPayment}
//                 className="w-full bg-orange-500 text-white font-bold py-3 rounded-md mt-4 hover:bg-orange-600"
//               >
//                 {order.isPaid ? 'Make Payment' : 'Proceed to Payment'}
//               </button>
//             </div>
//             <p className="text-xs text-gray-500 mt-4 text-center">
//               By proceeding, you are automatically accepting the <a href="#" className="text-blue-600">Terms & Conditions</a>
//             </p>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default OrderConfirmation;
"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from "@/modules/HomePage/NavBar";
import Footer from "@/modules/HomePage/Footer";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
  product: {
    _id: string;
  };
}

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
  const queryClient = useQueryClient();
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  // Fetch cart items from API instead of relying on localStorage
  const { 
    data: cartData, 
    isLoading: cartLoading, 
    error: cartError,
    refetch: refetchCart
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await client.get('/api/cart');
      return res.data;
    },
  });

  // Extract cart items from the response
  const cartDetails: CartItem[] = cartData?.items || [];

  // Fetch orders using useQuery instead of useEffect
  const { data: orderQuery, isLoading: orderLoading, isError: orderError, error: orderErrorData } = useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      return client
        .get('/api/order/user/all?page=1&limit=10')
        .then((response) => response.data?.data?.orders || [])
        .catch((error) => {
          throw error;
        });
    },
  });

  useEffect(() => {
    // Only load delivery info from localStorage
    const deliveryRaw = typeof window !== 'undefined' ? localStorage.getItem('deliveryInfo') : null;
    if (deliveryRaw) {
      setDeliveryInfo(JSON.parse(deliveryRaw));
    }
  }, []);

  const handleProceedToPayment = () => {
    if (cartDetails && cartDetails.length > 0) {
      // Save cart details for payment page
      localStorage.setItem('orderDetails', JSON.stringify({ 
        cartItems: cartDetails, 
        deliveryInfo, 
        total: cartDetails.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0) 
      }));
      router.push('/payment');
      return;
    }
    if (!orderQuery || !orderQuery.length) return;
    // Save order details to localStorage for payment page
    const orderDetails = {
      order: orderQuery[0],
      total: orderQuery[0].totalPrice,
      remainingBalance: orderQuery[0].remainingBalance,
    };
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    router.push('/payment');
  };

  const isLoading = cartLoading || orderLoading;
  const isError = cartError || orderError;
  const error = cartError || orderErrorData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{(error as any)?.message || 'Failed to fetch data.'}</div>
        </div>
        <Footer />
      </div>
    );
  }

  // If cart details exist, show cart confirmation
  if (cartDetails && Array.isArray(cartDetails) && cartDetails.length > 0) {
    const total = cartDetails.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Mode of Delivery at the top */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center text-green-600 font-semibold mb-2">
              <span className="mr-2">Mode of Delivery</span>
            </div>
            {deliveryInfo ? (
              <div>
                <p className="font-bold">{deliveryInfo.deliveryMode === 'pickup' ? `Pickup Station: ${deliveryInfo.pickupStation}` : `${deliveryInfo.city}, ${deliveryInfo.state}`}</p>
                <p className="text-gray-600 text-sm">Mode: {deliveryInfo.deliveryMode}</p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No delivery info found.</p>
            )}
          </div>
          {/* Main content: Cart and Summary */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Section */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold mb-6">Order Items <span className="text-lg font-semibold">({cartDetails.length})</span></h2>
              {cartDetails.map((item: CartItem) => (
                <div key={item._id} className="flex items-center gap-6 border-b pb-6 last:border-b-0 last:pb-0 mb-6 last:mb-0">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                    <Image src={item.imageUrl || '/market/Image8.png'} alt={item.name} width={96} height={96} className="object-contain w-full h-full" />
                  </div>
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 mb-1">{item.name}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                        <div className="text-xs text-gray-500">In Stock</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-2 md:mt-0">₦ {item.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Cart Summary Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md border p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4 text-gray-800">ORDER SUMMARY</h3>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 text-lg">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">₦ {total.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-orange-500 text-white font-bold py-4 rounded-lg text-lg hover:bg-orange-600 transition"
                >
                  Make Payment (₦ {total.toLocaleString()})
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Fallback: Show most recent order as before
  if (!orderQuery || !orderQuery.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">No orders found.</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show the most recent order (first in array)
  const order = orderQuery[0];
  const { shippingAddress, orderItems, paymentMode: orderPaymentMode, totalPrice, amountPaid, remainingBalance, paymentPlan } = order;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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
                {orderItems.map((item: OrderItem) => (
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
                  {paymentPlan.map((plan: PaymentPlan, idx: number) => (
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
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
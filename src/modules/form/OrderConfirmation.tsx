"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';

interface CartItemFromAPI {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface DeliveryInfo {
  state: string;
  city: string;
  deliveryMode: string;
  pickupStation?: string | null;
}

const OrderConfirmation: React.FC<{ paymentMode: 'full' | 'bits' }> = ({ paymentMode }) => {
  const router = useRouter();
  const { client } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemFromAPI[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await client.get('/api/cart');
        setCartItems(res.data.items || []);
      } catch (e) {
        setCartItems([]);
      }
    };
    fetchCart();
    // Fetch delivery info
    const info = localStorage.getItem('deliveryInfo');
    if (info) setDeliveryInfo(JSON.parse(info));
    setIsLoading(false);
  }, []);

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Example delivery fee logic
  const deliveryFees = deliveryInfo?.deliveryMode === 'pickup' ? 1500 : 3800;
  const total = itemsTotal + deliveryFees;

  const handleConfirmOrder = () => {
    // Save order details to localStorage
    const orderDetails = {
      cartItems,
      deliveryInfo,
      total,
      itemsTotal,
      deliveryFees,
    };
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    router.push('/payment');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left side: Customer and Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-green-600 font-semibold">
                  <span className="mr-2">1. DELIVERY ADDRESS</span>
                </div>
                <button className="text-blue-600 hover:underline text-sm font-semibold" onClick={() => router.push('/cart/delivery')}>Change</button>
              </div>
              <div>
                <p className="font-bold">{deliveryInfo?.state}, {deliveryInfo?.city}</p>
                {deliveryInfo?.deliveryMode === 'pickup' && deliveryInfo?.pickupStation && (
                  <p className="text-gray-600 text-sm">Pickup: {deliveryInfo.pickupStation}</p>
                )}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-green-600 font-semibold">
                  <span className="mr-2">2. DELIVERY MODE</span>
                </div>
                <button className="text-blue-600 hover:underline text-sm font-semibold" onClick={() => router.push('/cart/delivery')}>Change</button>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold capitalize">{deliveryInfo?.deliveryMode === 'pickup' ? 'Pick Up' : 'Door Delivery'}</p>
                <Truck className="text-orange-500" />
              </div>
              <p className="text-gray-600 text-sm mb-4">Delivery fees: ₦{deliveryFees.toLocaleString()}</p>
            </div>

            {/* Products Ordered */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-bold mb-4">Products Ordered</h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <Image src={item.imageUrl || item.product.imageUrl || '/market/Image8.png'} alt={item.name} width={64} height={64} className="rounded-md object-contain" />
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
          </div>

          {/* Right side: Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border lg:sticky lg:top-8">
            <h2 className="text-xl font-bold mb-4">Order summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Item&apos;s total ({cartItems.length})</span>
                <span>₦ {itemsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery fees</span>
                <span>₦ {deliveryFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span>₦ {total.toLocaleString()}</span>
              </div>
              {paymentMode === 'bits' && (
                <div className="flex justify-between text-sm">
                  <span>Payment Mode:</span>
                  <span className="font-semibold">Pay little-by-little</span>
                </div>
              )}
            </div>
            <div className="mt-6">
              <button 
                onClick={handleConfirmOrder}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-md mt-4 hover:bg-orange-600"
              >
                Confirm order
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

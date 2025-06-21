"use client"
import React from 'react';
import Image from 'next/image';
import { ChevronRight, Home, Truck } from 'lucide-react';

// Mock data - replace with actual props
const customerAddress = {
  name: 'Favour Mbata',
  address: 'Sabo yaba | Rivers - PORTHARCOURT-RUMUODUMAYA | +234 8104427559',
};

const orderSummary = {
  itemsTotal: 11000,
  deliveryFees: 3800,
  total: 14800,
};

const shipment = {
  store: 'oluwashidara store',
  items: [
    {
      name: 'White Luxury Turtle Neck Long Sleeve - Pin Down',
      image: '/market/Image2.png', 
    },
  ],
};

const shipment2 = {
  store: 'Qualitinz Place',
  items: [
    {
      name: 'Fidget Spinner',
      image: '/market/Image3.png',
    },
  ],
};

const OrderConfirmation = () => {
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
                  <span className="mr-2">1. CUSTOMER ADDRESS</span>
                </div>
                <button className="text-blue-600 hover:underline text-sm font-semibold">Change</button>
              </div>
              <div>
                <p className="font-bold">{customerAddress.name}</p>
                <p className="text-gray-600 text-sm">{customerAddress.address}</p>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-green-600 font-semibold">
                  <span className="mr-2">2. DELIVERY DETAILS</span>
                </div>
                <button className="text-blue-600 hover:underline text-sm font-semibold">Change</button>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold">Door Delivery</p>
                <Truck className="text-orange-500" />
              </div>
              <p className="text-gray-600 text-sm mb-4">Delivery between 01 July and 03 July.</p>

              {/* Pickup station option */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-600 font-bold text-sm">SAVE UP TO ₦ 2,300</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Switch to a pickup station starting from ₦ 1,500</p>
                    <p className="text-gray-600 text-sm">Delivery between 01 July and 03 July.</p>
                  </div>
                  <button className="text-blue-600 hover:underline text-sm font-semibold flex items-center">
                    Change <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Shipments */}
              <div className="mt-6 space-y-4">
                <h3 className="font-bold">Shipment 1/2</h3>
                <div className="border p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Fulfilled by {shipment.store}</p>
                  <div className="flex items-center space-x-4">
                    <Image src={shipment.items[0].image} alt={shipment.items[0].name} width={64} height={64} className="rounded-md" />
                    <div>
                      <p className="font-semibold text-sm">{shipment.items[0].name}</p>
                      <p className="text-xs text-gray-500">Door Delivery</p>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold">Shipment 2/2</h3>
                <div className="border p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Fulfilled by {shipment2.store}</p>
                  <div className="flex items-center space-x-4">
                    <Image src={shipment2.items[0].image} alt={shipment2.items[0].name} width={64} height={64} className="rounded-md" />
                    <div>
                      <p className="font-semibold text-sm">{shipment2.items[0].name}</p>
                      <p className="text-xs text-gray-500">Door Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border lg:sticky lg:top-8">
            <h2 className="text-xl font-bold mb-4">Order summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Item&apos;s total (2)</span>
                <span>₦ {orderSummary.itemsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery fees</span>
                <span>₦ {orderSummary.deliveryFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span>₦ {orderSummary.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex">
                <input type="text" placeholder="Enter code" className="flex-grow border rounded-l-md p-2 text-sm" />
                <button className="bg-gray-200 text-gray-600 rounded-r-md px-4 text-sm font-semibold">APPLY</button>
              </div>
              <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-md mt-4 hover:bg-orange-600">
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
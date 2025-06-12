
"use client"

import React, { useState } from "react"
import { X, CheckCircle, User, ShoppingCart } from "lucide-react"
import Footer from "../HomePage/Footer"
import Image from "next/image"
interface PayInBitsFormProps {
  isOpen: boolean
  onClose: () => void
  selectedItem?: {
    name: string
    price: number
    quantity: number
    image: string
  }
}

interface OrderConfirmationProps {
  orderNumber?: string
  date?: string
  email?: string
  total?: number
  firstInstallment?: number
  secondInstallment?: number
  onClose: () => void
}

// Order Confirmation Component
export default function OrderConfirmation({
  orderNumber = "113",
  date = "28th of February, 2025",
  email = "clerewujumali.com",
  total = 400,
  firstInstallment = 29.00,
  secondInstallment = 29.00,
  onClose
}: OrderConfirmationProps) {
  const subtotal = 0;
  const totalDue = firstInstallment + secondInstallment;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <p className="text-xl font-semibold text-ajo_orange pb-4">
                                  <Image
                              
                                  src="/Logo.svg"
                                  width={100}
                                  height={100}
                                  alt="logo"
                                  />
                              </p>
             
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {/* <User className="w-5 h-5 text-gray-600" /> */}
                <Image src={'/market/Group.png'} alt="" width={25} height={25}/>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 sm:p-6 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">
                Order received
              </h2>
              <p className="text-sm sm:text-base text-green-700">
                Thank you. Your order has been placed, an agent would contact you shortly.
              </p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Order Information */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Information
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-sm font-medium text-gray-600">Order No:</span>
                  <span className="text-sm text-gray-900 font-medium">{orderNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <span className="text-sm text-gray-900">{date}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <span className="text-sm text-gray-900">{email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-sm font-medium text-gray-600">Payment Mode:</span>
                  <span className="text-sm text-blue-600 font-medium">Pay in Bit</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">TOTAL:</span>
                  <span className="text-lg font-bold text-gray-900">${total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">SUB TOTAL:</span>
                  <span className="text-sm text-gray-900">${subtotal}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Payment Breakdown</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">First Installment</span>
                      <span className="text-sm font-medium text-gray-900">${firstInstallment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Second Installment</span>
                      <span className="text-sm font-medium text-gray-900">${secondInstallment.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Due</span>
                        <span className="text-sm font-bold text-gray-900">${totalDue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
}

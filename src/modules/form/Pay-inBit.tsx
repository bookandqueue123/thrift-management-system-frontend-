"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import OrderConfirmation from "./OrderConfirmation"

// Define CartItem interface to match the cart page
interface CartItem {
  _id: string;
  productId: string;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    imageUrl?: string;
    stock: number;
    rating?: number;
    reviews?: number;
    badge?: string | null;
    subcategory?: string;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface PayInBitsFormProps {
  isOpen: boolean
  onClose: () => void
  selectedItem?: CartItem
  previewData?: any
  previewLoading?: boolean
  previewError?: string
}

export default function PayInBitsForm({ isOpen, onClose, selectedItem, previewData, previewLoading, previewError }: PayInBitsFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    bvn: "",
    nin: "",
    guarantorA: {
      name: "",
      phone: "",
    },
    guarantorB: {
      name: "",
      phone: "",
    },
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("guarantorA.")) {
      const subField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        guarantorA: { ...prev.guarantorA, [subField]: value },
      }))
    } else if (field.startsWith("guarantorB.")) {
      const subField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        guarantorB: { ...prev.guarantorB, [subField]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewData) return;
    const paymentPayload = {
      orderItems: [
        {
          product: selectedItem?.productId,
          name: selectedItem?.product.name,
          quantity: selectedItem?.quantity,
          price: selectedItem?.product.price,
        },
      ],
      shippingAddress: {
        fullName: formData.accountName,
        address: 'User address', // Replace with actual input
        city: 'User city', // Replace with actual input
        postalCode: 'User postal', // Replace with actual input
        country: 'Nigeria',
      },
      paymentMethod: 'Card',
      paymentMode: 'Pay In Bits',
      totalPrice: previewData.totalCost,
      initialPaymentAmount: previewData.firstPayment,
      paymentSchedule: previewData.paymentSchedule,
    };
    // TODO: POST paymentPayload to /api/payments
    // For now, just log it
    console.log('Submitting payment:', paymentPayload);
    onClose();
    router.push('/cart/delivery');
  };

  if (!isOpen) return null;

  if (previewLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center justify-center p-8">
          <span className="text-lg font-semibold">Loading payment preview...</span>
        </div>
      </div>
    );
  }
  if (previewError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center justify-center p-8">
          <span className="text-lg font-semibold text-red-600">{previewError}</span>
        </div>
      </div>
    );
  }

  // Default item if none provided
  const item = selectedItem || {
    _id: "default",
    productId: "default",
    product: {
      _id: "default",
      name: "Samsung Electronics Samsung Galaxy S21 5G",
      description: "Default product",
      price: 38.0,
      category: "Electronics",
      brand: "Samsung",
      imageUrl: "/placeholder.svg?height=80&width=80",
      stock: 1,
    },
    quantity: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pay little-by-little</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Item Details */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Item Details</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity.toString().padStart(2, "0")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    {previewData && (
                      <div className="flex justify-between text-sm">
                        <span>Deposit Amount:</span>
                        <span className="font-semibold">₦{previewData.depositAmount?.toLocaleString()}</span>
                      </div>
                    )}
                    {previewData && (
                      <div className="flex justify-between text-sm">
                        <span>Repayment Timeline:</span>
                        <span className="font-semibold">{previewData.repaymentMonths} Months</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Bank Details</h3>
                  <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-md font-medium">
                    Bank Details
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
                      Account Name
                    </label>
                    <input
                      id="accountName"
                      type="text"
                      placeholder="Input Text"
                      value={formData.accountName}
                      onChange={(e) => handleInputChange("accountName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      type="text"
                      placeholder="Input Text"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      id="bankName"
                      type="text"
                      placeholder="Input Text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bvn" className="block text-sm font-medium text-gray-700">
                      Bank Verification Number (BVN)
                    </label>
                    <input
                      id="bvn"
                      type="text"
                      placeholder="Input Text"
                      value={formData.bvn}
                      onChange={(e) => handleInputChange("bvn", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="nin" className="block text-sm font-medium text-gray-700">
                      National Identity Number (NIN)
                    </label>
                    <input
                      id="nin"
                      type="text"
                      placeholder="Input Text"
                      value={formData.nin}
                      onChange={(e) => handleInputChange("nin", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantor Details */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Guarantor Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Guarantor A */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Guarantor A</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="guarantorAName" className="block text-sm font-medium text-gray-700">
                          Guarantor Name
                        </label>
                        <input
                          id="guarantorAName"
                          type="text"
                          placeholder="Input Text"
                          value={formData.guarantorA.name}
                          onChange={(e) => handleInputChange("guarantorA.name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="guarantorAPhone" className="block text-sm font-medium text-gray-700">
                          Guarantor Telephone Number
                        </label>
                        <input
                          id="guarantorAPhone"
                          type="tel"
                          placeholder="Input Text"
                          value={formData.guarantorA.phone}
                          onChange={(e) => handleInputChange("guarantorA.phone", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guarantor B */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Guarantor B</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="guarantorBName" className="block text-sm font-medium text-gray-700">
                          Guarantor Name
                        </label>
                        <input
                          id="guarantorBName"
                          type="text"
                          placeholder="Input Text"
                          value={formData.guarantorB.name}
                          onChange={(e) => handleInputChange("guarantorB.name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="guarantorBPhone" className="block text-sm font-medium text-gray-700">
                          Guarantor Telephone Number
                        </label>
                        <input
                          id="guarantorBPhone"
                          type="tel"
                          placeholder="Input Text"
                          value={formData.guarantorB.phone}
                          onChange={(e) => handleInputChange("guarantorB.phone", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Schedule Table */}
          {previewData && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Payment Schedule</h3>
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Total Payment</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Principal</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Interest</th>
                    <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.paymentSchedule?.map((schedule: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-2 py-1 text-center">{schedule.paymentNumber}</td>
                      <td className="px-2 py-1 text-center">{new Date(schedule.dueDate).toLocaleDateString()}</td>
                      <td className="px-2 py-1 text-center">₦{schedule.totalPayment.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center">₦{schedule.principalAmount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center">₦{schedule.interestAmount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center">₦{schedule.remainingBalance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex flex-col gap-2">
                <span><b>Initial Payment:</b> ₦{previewData.firstPayment?.toLocaleString()}</span>
                <span><b>Total Cost:</b> ₦{previewData.totalCost?.toLocaleString()}</span>
                <span><b>Monthly Payment:</b> ₦{previewData.monthlyPayment?.toLocaleString()}</span>
                <span><b>Repayment Months:</b> {previewData.repaymentMonths}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="mt-6">
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-orange-700 transition"
              >
                Confirm & Pay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
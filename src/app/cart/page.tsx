"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/api/hooks/useAuth";
import Navbar from "@/modules/HomePage/NavBar";
import Footer from "@/modules/HomePage/Footer";
import PayInBitsForm from "@/modules/form/Pay-inBit";
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux';
import { selectToken } from '@/slices/OrganizationIdSlice';

// Define a type for a cart item from the backend
interface CartItemFromAPI {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  };
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

// Define the cart response structure from the backend
interface CartResponse {
  _id: string;
  user: string;
  items: CartItemFromAPI[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the CartItem type that PayInBitsForm expects
interface CartItemForForm {
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

export default function CartPage() {
  const router = useRouter();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [paymentMode, setPaymentMode] = useState<"full" | "bits">("full");
  const [showPayInBitsForm, setShowPayInBitsForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItemForForm | null>(null);
  const token = useSelector(selectToken);
  // Promo code state
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");
  // Add state for preview data
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState(2); // default to 2

  // Redirect to /signin if no token
  // useEffect(() => {
  //   if (!token) {
  //     router.push('/signin');
  //   }
  // }, [token, router]);

  // Fetch cart items from backend
  const { 
    data: cartData, 
    isLoading, 
    error 
  } = useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await client.get('/api/cart');
      return res.data;
    },
  });

  // Extract cart items from the response
  const cartItems = cartData?.items || [];

  // Helper function to convert CartItemFromAPI to CartItemForForm
  const convertToFormItem = (item: CartItemFromAPI): CartItemForForm => {
    return {
      _id: item._id,
      productId: item.product._id,
      product: {
        _id: item.product._id,
        name: item.name,
        description: item.name, // Using name as description since we don't have description
        price: item.price,
        category: "General", // Default category
        brand: "Unknown", // Default brand
        imageUrl: item.imageUrl,
        stock: item.quantity, // Using quantity as stock
        rating: 0,
        reviews: 0,
        badge: null,
        subcategory: undefined,
      },
      quantity: item.quantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Update cart item quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const res = await client.put(`/api/cart/${productId}`, {
        quantity
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error updating quantity:', error);
    }
  });

  // Increase quantity mutation
  const increaseQuantityMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await client.patch(`/api/cart/${productId}/increase`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error increasing quantity:', error);
    }
  });

  // Decrease quantity mutation
  const decreaseQuantityMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await client.patch(`/api/cart/${productId}/decrease`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error decreasing quantity:', error);
    }
  });

  // Remove item from cart mutation
  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await client.delete(`/api/cart/${productId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error removing item:', error);
    }
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const res = await client.delete('/api/cart/clear/all');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error clearing cart:', error);
    }
  });

  // Calculate subtotal for an item
  const calculateItemSubtotal = (item: CartItemFromAPI) => {
    return item.price * item.quantity;
  };

  // Calculate total for all items
  const calculateTotal = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return 0;
    }
    
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + calculateItemSubtotal(item),
      0
    );
    return itemsTotal;
  };

  // Calculate minimum deposit (20% of total)
  const calculateMinimumDeposit = () => {
    const twentyPercent = calculateTotal() * 0.2;
    return twentyPercent < 400 ? 400 : twentyPercent;
  };

  // Format minimum deposit display
  const getMinimumDepositDisplay = () => {
    const twentyPercent = calculateTotal() * 0.2;
    if (twentyPercent < 400) {
      return `${calculateMinimumDeposit().toFixed(2)} (minimum of ₦400)`;
    }
    return `${calculateMinimumDeposit().toFixed(2)}`;
  };

  // Handlers for quantity changes
  const handleQuantityChange = (productId: string, delta: number) => {
    if (!Array.isArray(cartItems)) return;
    
    const currentItem = cartItems.find(item => item.product._id === productId);
    if (!currentItem) return;

    const newQuantity = currentItem.quantity + delta;
    
    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0 or negative
      removeItemMutation.mutate(productId);
    } else {
      // Update quantity
      updateQuantityMutation.mutate({ productId, quantity: newQuantity });
    }
  };

  // Handler to increase quantity
  const handleIncreaseQuantity = (productId: string) => {
    increaseQuantityMutation.mutate(productId);
  };

  // Handler to decrease quantity
  const handleDecreaseQuantity = (productId: string) => {
    decreaseQuantityMutation.mutate(productId);
  };

  // Handler to remove an item
  const handleRemoveItem = (productId: string) => {
    removeItemMutation.mutate(productId);
  };

  // Handler to clear entire cart
  const handleClearCart = () => {
    clearCartMutation.mutate();
  };
   
  const handlePayInBitsPreview = async (selectedItem: CartItemForForm) => {
    setPreviewLoading(true);
    setPreviewError("");
    setPreviewData(null);
    try {
      const res = await client.get(
        `/api/payments/payment-preview?productId=${selectedItem.productId}&repaymentMonths=${repaymentMonths}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreviewData(res.data);
      setShowPayInBitsForm(true);
    } catch (err: any) {
      setPreviewError("Failed to fetch payment preview.");
      setShowPayInBitsForm(true);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePaymentModeChange = (mode: "full" | "bits") => {
    setPaymentMode(mode);
    if (mode === "bits") {
      const item = Array.isArray(cartItems) && cartItems.length > 0 ? convertToFormItem(cartItems[0]) : null;
      setSelectedItem(item);
      if (item) handlePayInBitsPreview(item);
    }
  };

  // Handler for checkout
  const handleCheckout = () => {
    // Save the selected payment mode to localStorage for the confirmation page
    localStorage.setItem(
      "orderDetails",
      JSON.stringify({
        paymentMode: paymentMode === "bits" ? "Pay In Bits" : "100% Full Payment",
        // You can add other details here if needed, e.g. cart items, total, etc.
      })
    );

    if (paymentMode === "bits") {
      const item = Array.isArray(cartItems) && cartItems.length > 0 ? convertToFormItem(cartItems[0]) : null;
      setSelectedItem(item);
      if (item) handlePayInBitsPreview(item);
    } else {
      router.push('/cart/delivery');
    }
  };

  // Handler for applying promo code
  const handleApplyPromo = () => {
    if (!promoCode) {
      setPromoError("Please enter a promo code.");
      return;
    }
    setAppliedPromo(promoCode);
    setPromoError("");
    // Add logic for validating/applying promo code here
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center  items-center h-64">
            <div className="text-lg text-gray-600">Loading cart...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">Error loading cart. Please try again.</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Ensure cartItems is always an array
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Cart</h1>
          {safeCartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={clearCartMutation.isPending}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
            >
              {clearCartMutation.isPending ? "Clearing..." : "Clear Cart"}
            </button>
          )}
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Delivery Details and Payment Mode */}
            <div className="lg:col-span-1 space-y-6">
              {/* Payment Mode */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Mode
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="full"
                      checked={paymentMode === "full"}
                      onChange={() => handlePaymentModeChange("full")}
                      className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      100% Full Payment
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="bits"
                      checked={paymentMode === "bits"}
                      onChange={() => handlePaymentModeChange("bits")}
                      className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <div className="ml-2 flex items-center">
                      <span className="text-sm text-gray-700">Pay little-by-little</span>
                      <div className="ml-2 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">?</span>
                      </div>
                    </div>
                  </label>
                </div>
              {/* Promo Code Section (inside payment mode, before total) */}
              <div className="mt-6 mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded font-semibold hover:bg-orange-600 disabled:bg-orange-300"
                    onClick={handleApplyPromo}
                    disabled={!promoCode}
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <span className="ml-2 text-green-600 font-semibold">Applied: {appliedPromo}</span>
                )}
                {promoError && (
                  <span className="ml-2 text-red-600 text-sm">{promoError}</span>
                )}
              </div>
                {/* Show payment details when "Pay in Bits" is selected */}
                {paymentMode === "bits" && (
                  <>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border w-full">
                    <div className="space-y-3 w-full">
                      {previewLoading ? (
                        <div className="text-sm text-gray-600">Loading payment details...</div>
                      ) : previewData ? (
                        <>
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm text-gray-600">
                              {previewData.depositAmount === 400 ? "Minimum Deposit Amount:" : "Deposit Amount:"}
                            </span>
                            <span className="text-sm font-semibold text-gray-800">
                              ₦{previewData.depositAmount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm text-gray-600 pr-2">
                              {previewData.repaymentMonths === 3 ? "Maximum Repayment Timeline:" : "Repayment Timeline:"}
                            </span>
                            <span className="text-sm font-semibold text-gray-800 text-right">
                              {previewData.repaymentMonths} Months
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {/* Repayment Period only visible for 'bits' mode */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repayment Period
                    </label>
                    <select
                      value={repaymentMonths}
                      onChange={e => setRepaymentMonths(Number(e.target.value))}
                      className="border rounded p-2 w-full"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>{month} Month{month > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  </>
                )}
                 <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">
                        Total
                      </span>
                      <span className="text-2xl font-extrabold text-gray-800">
                        ₦{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                {paymentMode === "bits" ? "Proceed to Checkout" : "Checkout"}
              </button>
            </div>

            {/* Right Column: Product List */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product ID
                    </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (₦)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal (₦)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {safeCartItems.map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-16 w-16 object-contain"
                                src={item.imageUrl || "/market/Image8.png"}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                            </div>
                            </div>
                          </div>
                        </td>
                     <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
  {item.product && item.product._id ? item.product._id : "N/A"}
</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center border border-gray-300 rounded w-24">
                            <button
                              onClick={() => handleDecreaseQuantity(item.product._id)}
                              disabled={decreaseQuantityMutation.isPending}
                              className="px-2 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                            >
                              −
                            </button>
                            <span className="flex-1 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item.product._id)}
                              disabled={increaseQuantityMutation.isPending}
                              className="px-2 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ₦{calculateItemSubtotal(item).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveItem(item.product._id)}
                            disabled={removeItemMutation.isPending}
                            className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                          >
                            ✕ Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
      <PayInBitsForm
        isOpen={showPayInBitsForm}
        onClose={() => setShowPayInBitsForm(false)}
        cartItems={safeCartItems}
        previewData={previewData}
        previewLoading={previewLoading}
        previewError={previewError}
      />
      <Footer />
    </div>
  );
} 


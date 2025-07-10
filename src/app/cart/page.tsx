"use client";
import { useAuth } from "@/api/hooks/useAuth";
import Footer from "@/modules/HomePage/Footer";
import Navbar from "@/modules/HomePage/NavBar";
import PayInBitsForm from "@/modules/form/Pay-inBit";
import { selectToken } from "@/slices/OrganizationIdSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

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

interface CartResponse {
  _id: string;
  user: string;
  items: CartItemFromAPI[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  const [selectedItem, setSelectedItem] = useState<CartItemForForm | null>(
    null,
  );
  const token = useSelector(selectToken);

  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");

  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState<number | null>(null);

  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("/api/cart");
      return res.data;
    },
  });

  const cartItems = cartData?.items || [];

  const convertToFormItem = (item: CartItemFromAPI): CartItemForForm => {
    return {
      _id: item._id,
      productId: item.product._id,
      product: {
        _id: item.product._id,
        name: item.name,
        description: item.name,
        price: item.price,
        category: "General",
        brand: "Unknown",
        imageUrl: item.imageUrl,
        stock: item.quantity,
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

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const res = await client.put(`/api/cart/${productId}`, {
        quantity,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error updating quantity:", error);
    },
  });

  const increaseQuantityMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await client.patch(`/api/cart/${productId}/increase`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error increasing quantity:", error);
    },
  });

  const decreaseQuantityMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await client.patch(`/api/cart/${productId}/decrease`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error decreasing quantity:", error);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await client.delete(`/api/cart/${productId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error removing item:", error);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const res = await client.delete("/api/cart/clear/all");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
    },
  });

  const calculateItemSubtotal = (item: CartItemFromAPI) => {
    return item.price * item.quantity;
  };

  const calculateTotal = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return 0;
    }

    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + calculateItemSubtotal(item),
      0,
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

    const currentItem = cartItems.find(
      (item) => item.product._id === productId,
    );
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

 
  const handleRemoveItem = (productId: string) => {
    removeItemMutation.mutate(productId);
  };


  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  const handlePayInBitsPreview = async (
    selectedItem: CartItemForForm,
    months: number,
  ) => {
    setPreviewLoading(true);
    setPreviewError("");
    setPreviewData(null);
    try {
      console.log(selectedItem);
      const res = await client.get(
        `/api/payments/payment-preview?productId=${selectedItem.productId}&repaymentMonths=${months}&quantity=${selectedItem.quantity}`,
        { headers: { Authorization: `Bearer ${token}` } },
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
      setRepaymentMonths(null); // Reset repayment period
      const item =
        Array.isArray(cartItems) && cartItems.length > 0
          ? convertToFormItem(cartItems[0])
          : null;
      console.log(item);
      setSelectedItem(item);
      setPreviewData(null);
      setShowPayInBitsForm(false);
    }
  };


  const handleRepaymentMonthsChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const months = Number(e.target.value);
    setRepaymentMonths(months);
    if (selectedItem && months) {
      handlePayInBitsPreview(selectedItem, months);
    }
  };

  // Handler for checkout
  const handleCheckout = () => {
    // Save the selected payment mode to localStorage for the confirmation page
    localStorage.setItem(
      "orderDetails",
      JSON.stringify({
        paymentMode:
          paymentMode === "bits" ? "Pay In Bits" : "100% Full Payment",
        
      }),
    );

    if (paymentMode === "bits") {
      if (!repaymentMonths || !selectedItem) return; // Prevent if not selected
      handlePayInBitsPreview(selectedItem, repaymentMonths);
    } else {
      router.push("/cart/delivery");
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
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex h-64  items-center justify-center">
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
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-lg text-red-600">
              Error loading cart. Please try again.
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Cart</h1>
          {safeCartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={clearCartMutation.isPending}
              className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {clearCartMutation.isPending ? "Clearing..." : "Clear Cart"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Delivery Details and Payment Mode */}
          <div className="space-y-6 lg:col-span-1">
            {/* Payment Mode */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Payment Mode
              </h2>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="full"
                    checked={paymentMode === "full"}
                    onChange={() => handlePaymentModeChange("full")}
                    className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    100% Full Payment
                  </span>
                </label>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="bits"
                    checked={paymentMode === "bits"}
                    onChange={() => handlePaymentModeChange("bits")}
                    className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-2 flex items-center">
                    <span className="text-sm text-gray-700">
                      Pay little-by-little
                    </span>
                    <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-300">
                      <span className="text-xs font-bold text-white">?</span>
                    </div>
                  </div>
                </label>
              </div>
              {/* Promo Code Section (inside payment mode, before total) */}
              <div className="mb-2 mt-6">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full rounded border p-2"
                  />
                  <button
                    className="rounded bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300"
                    onClick={handleApplyPromo}
                    disabled={!promoCode}
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <span className="ml-2 font-semibold text-green-600">
                    Applied: {appliedPromo}
                  </span>
                )}
                {promoError && (
                  <span className="ml-2 text-sm text-red-600">
                    {promoError}
                  </span>
                )}
              </div>
              {/* Show payment details when "Pay in Bits" is selected */}
              {paymentMode === "bits" && (
                <>
                  <div className="mt-4 w-full rounded-lg border bg-gray-50 p-4">
                    <div className="w-full space-y-3">
                      {previewLoading ? (
                        <div className="text-sm text-gray-600">
                          Loading payment details...
                        </div>
                      ) : previewData ? (
                        <>
                          <div className="flex w-full items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {previewData.depositAmount === 400
                                ? "Minimum Deposit Amount:"
                                : "Deposit Amount:"}
                            </span>
                            <span className="text-sm font-semibold text-gray-800">
                              ₦{previewData.depositAmount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex w-full items-center justify-between">
                            <span className="pr-2 text-sm text-gray-600">
                              {previewData.repaymentMonths === 3
                                ? "Maximum Repayment Timeline:"
                                : "Repayment Timeline:"}
                            </span>
                            <span className="text-right text-sm font-semibold text-gray-800">
                              {previewData.repaymentMonths} Months
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {/* Repayment Period only visible for 'bits' mode */}
                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Repayment Period
                    </label>
                    <select
                      value={repaymentMonths ?? ""}
                      onChange={handleRepaymentMonthsChange}
                      className="w-full rounded border p-2"
                    >
                      <option value="" disabled>
                        Select repayment period
                      </option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => (
                          <option key={month} value={month}>
                            {month} Month{month > 1 ? "s" : ""}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </>
              )}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-extrabold text-gray-800">
                    ₦{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
              disabled={paymentMode === "bits" && !repaymentMonths}
            >
              {paymentMode === "bits" ? "Proceed to Checkout" : "Checkout"}
            </button>
          </div>

          {/* Right Column: Product List */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Product ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Price (₦)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Subtotal (₦)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {safeCartItems.map((item) => (
                    <tr key={item._id}>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0">
                            {item.imageUrl && item.imageUrl.length > 0 && (
                              <img
                                className="h-16 w-16 object-contain"
                                src={item.imageUrl}
                                alt={item.name}
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-500">
                        {item.product && item.product._id
                          ? item.product._id
                          : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex w-24 items-center rounded border border-gray-300">
                          <button
                            onClick={() =>
                              handleDecreaseQuantity(item.product._id)
                            }
                            disabled={decreaseQuantityMutation.isPending}
                            className="px-2 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="flex-1 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleIncreaseQuantity(item.product._id)
                            }
                            disabled={increaseQuantityMutation.isPending}
                            className="px-2 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                        ₦{item.price.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900">
                        ₦{calculateItemSubtotal(item).toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
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

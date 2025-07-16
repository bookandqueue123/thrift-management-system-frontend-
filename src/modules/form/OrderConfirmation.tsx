"use client";
import { useAuth } from "@/api/hooks/useAuth";
import Footer from "@/modules/HomePage/Footer";
import Navbar from "@/modules/HomePage/NavBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | string[];
  size?: string;
  product: {
    _id: string;
    price?: number;
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
  initialPaymentAmount?: number;
  firstPayment?: number;
}

const OrderConfirmation: React.FC<{
  paymentMode: "full" | "bits" | "100% Full Payment" | "Pay In Bits";
}> = ({ paymentMode }) => {
  const router = useRouter();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  const [initialDepositInfo, setInitialDepositInfo] = useState<any>(null);

  // Fetch cart items from API instead of relying on localStorage
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("/api/cart");
      return res.data;
    },
  });

  // Extract cart items from the response
  const cartDetails: CartItem[] = cartData?.items || [];

  // Fetch orders using useQuery instead of useEffect
  const {
    data: orderQuery,
    isLoading: orderLoading,
    isError: orderError,
    error: orderErrorData,
  } = useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      return client
        .get("/api/order/user/all?page=1&limit=10")
        .then((response) => response.data?.data?.orders || [])
        .catch((error) => {
          throw error;
        });
    },
  });

  useEffect(() => {
    // Load delivery info and initial deposit info from localStorage
    const deliveryRaw =
      typeof window !== "undefined"
        ? localStorage.getItem("deliveryInfo")
        : null;
    if (deliveryRaw) {
      setDeliveryInfo(JSON.parse(deliveryRaw));
    }

    const depositRaw =
      typeof window !== "undefined"
        ? localStorage.getItem("initialDeposit")
        : null;
    if (depositRaw) {
      try {
        setInitialDepositInfo(JSON.parse(depositRaw));
      } catch (e) {
        console.error("Error parsing initial deposit info:", e);
      }
    }
  }, []);

  // After loading deliveryInfo from localStorage:
  const pickupStationAmount = deliveryInfo?.pickupStationAmount;
  const pickupFee = pickupStationAmount?.value || 0;
  const pickupCurrency = pickupStationAmount?.currency || "₦";

  // Determine the effective payment mode from localStorage/prop ONLY
  let effectivePaymentMode = paymentMode;

  if (typeof window !== "undefined") {
    const storedOrderDetails = localStorage.getItem("orderDetails");
    if (storedOrderDetails) {
      const parsed = JSON.parse(storedOrderDetails);
      if (parsed.paymentMode) {
        effectivePaymentMode = parsed.paymentMode;
      }
    }
  }

  // Do NOT override with API value!
  // const isPayInBits = effectivePaymentMode === "Pay In Bits" || effectivePaymentMode === "bits";
  // const isFullPayment = effectivePaymentMode === "100% Full Payment" || effectivePaymentMode === "full";

  const isPayInBits =
    effectivePaymentMode === "Pay In Bits" || effectivePaymentMode === "bits";
  const isFullPayment =
    effectivePaymentMode === "100% Full Payment" ||
    effectivePaymentMode === "full";

  // Debug log
  console.log(
    "OrderConfirmation: effectivePaymentMode =",
    effectivePaymentMode,
  );
  console.log("isPayInBits:", isPayInBits, "isFullPayment:", isFullPayment);

  // Helper function to get image URL
  const getImageUrl = (imageUrl?: string | string[]) => {
    if (!imageUrl) return "/placeholder.svg";
    if (Array.isArray(imageUrl)) {
      return imageUrl[0] || "/placeholder.svg";
    }
    return imageUrl;
  };

  const handleProceedToPayment = () => {
    if (cartDetails && cartDetails.length > 0) {
      // Calculate actual total from cart items
      const actualTotal = cartDetails.reduce((sum: number, item: CartItem) => {
        return sum + item.price * item.quantity;
      }, 0);
      const totalWithPickup = actualTotal + pickupFee;

      // Determine amount based on payment mode
      let amountToPay: number;
      let paymentModeForStorage: string;

      if (isFullPayment) {
        // FULL PAYMENT MODE
        amountToPay = totalWithPickup;
        paymentModeForStorage = "100% Full Payment";
      } else {
        // PAY IN BITS MODE
        amountToPay =
          initialDepositInfo?.initialDeposit || Math.floor(actualTotal * 0.5);
        paymentModeForStorage = "Pay In Bits";
      }

      // Save cart details for payment page
      // Store totalAmountToPay and pickupFee in localStorage for payment page
      const totalAmountToPay = isFullPayment
        ? totalWithPickup
        : (initialDepositInfo?.initialDeposit ||
            Math.floor(actualTotal * 0.5)) + pickupFee;
      localStorage.setItem(
        "totalAmountToPay",
        JSON.stringify(totalAmountToPay),
      );
      localStorage.setItem("pickupFee", JSON.stringify(pickupFee));
      localStorage.setItem(
        "orderDetails",
        JSON.stringify({
          cartItems: cartDetails,
          deliveryInfo,
          total: actualTotal,
          amountToPay: amountToPay,
          paymentMode: paymentModeForStorage,
          initialDeposit: isPayInBits ? amountToPay : undefined,
        }),
      );
      router.push("/payment");
      return;
    }

    if (!orderQuery || !orderQuery.length) return;

    // For existing orders
    const order = orderQuery[0];
    const actualTotal = order.orderItems.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0,
    );
    const totalWithPickup = actualTotal + pickupFee;

    // Determine amount based on payment mode
    let amountToPay: number;
    let paymentModeForStorage: string;

    if (isFullPayment) {
      // FULL PAYMENT MODE
      amountToPay = totalWithPickup;
      paymentModeForStorage = "100% Full Payment";
    } else {
      // PAY IN BITS MODE
      const depositAmount =
        initialDepositInfo?.initialDeposit ||
        order.firstPayment ||
        order.initialPaymentAmount ||
        Math.floor(actualTotal * 0.5);
      amountToPay = depositAmount;
      paymentModeForStorage = "Pay In Bits";
    }

    // Save order details to localStorage for payment page
    const orderDetails = {
      order: order,
      total: actualTotal,
      remainingBalance: order.remainingBalance,
      amountToPay: amountToPay,
      paymentMode: paymentModeForStorage,
      initialDeposit: isPayInBits ? amountToPay : undefined,
    };
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    router.push("/payment");
  };

  const isLoading = cartLoading || orderLoading;
  const isError = cartError || orderError;
  const error = cartError || orderErrorData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-64 items-center justify-center">
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
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg text-red-600">
            {(error as any)?.message || "Failed to fetch data."}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If cart details exist, show cart confirmation
  if (cartDetails && Array.isArray(cartDetails) && cartDetails.length > 0) {
    // Calculate actual total from cart items
    const actualTotal = cartDetails.reduce((sum: number, item: CartItem) => {
      return sum + item.price * item.quantity;
    }, 0);
    const totalWithPickup = actualTotal + pickupFee;

    // Determine display amount based on payment mode
    const displayAmount = isFullPayment
      ? totalWithPickup
      : (initialDepositInfo?.initialDeposit || Math.floor(actualTotal * 0.5)) +
        pickupFee;

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Mode of Delivery at the top */}
          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center font-semibold text-green-600">
              <span className="mr-2">Mode of Delivery</span>
            </div>
            {deliveryInfo ? (
              <div>
                <p className="font-bold">
                  Mode:{" "}
                  {deliveryInfo.deliveryMode === "pickup"
                    ? "Pickup"
                    : "Door Delivery"}
                </p>
                {/* Show state, city, and address below the mode */}
                <div className="mt-1 text-sm text-gray-700">
                  <div>State: {deliveryInfo.state}</div>
                  <div>City/LGA: {deliveryInfo.city}</div>
                  {deliveryInfo.deliveryMode === "pickup" &&
                    deliveryInfo.pickupStation && (
                      <div>Pickup Station: {deliveryInfo.pickupStation}</div>
                    )}
                  {deliveryInfo.deliveryMode === "door" &&
                    deliveryInfo.deliveryAddress && (
                      <div>
                        Delivery Address: {deliveryInfo.deliveryAddress}
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No delivery info found.</p>
            )}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Cart Items Display */}
            <div className="flex-1">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  CART ITEMS
                </h3>
                <div className="space-y-4">
                  {cartDetails.map((item: CartItem) => {
                    const itemTotal = item.price * item.quantity;

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
                          <Image
                            src={
                              getImageUrl(item.imageUrl) || "/placeholder.svg"
                            }
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-md object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          {/* Show initial deposit info ONLY if in Pay In Bits mode */}
                          {isPayInBits && (
                            <p className="text-xs font-semibold text-blue-600">
                              Initial Deposit: ₦{displayAmount.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {isPayInBits ? (
                            <>
                              <p className="font-bold text-blue-600">
                                ₦{displayAmount.toLocaleString()}{" "}
                                <span className="text-xs">
                                  (Initial Deposit)
                                </span>
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                ₦{item.price.toLocaleString()}{" "}
                                <span className="text-xs">(Full Price)</span>
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-bold">
                                ₦{item.price.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Subtotal: ₦{itemTotal.toLocaleString()}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full flex-shrink-0 lg:w-80">
              <div className="sticky top-24 rounded-lg border bg-white p-6 shadow-md">
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  ORDER SUMMARY
                </h3>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ₦ {actualTotal.toLocaleString()}
                    </span>
                  </div>
                  {pickupFee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Pickup Station Fee</span>
                      <span className="font-semibold">
                        {pickupFee.toLocaleString()} {pickupCurrency}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-lg font-semibold text-gray-600">
                      Amount to Pay
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {displayAmount.toLocaleString()} {pickupCurrency}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full rounded-lg bg-orange-500 py-4 text-lg font-bold text-white transition hover:bg-orange-600"
                >
                  {isPayInBits
                    ? `Pay Initial Deposit (₦ ${displayAmount.toLocaleString()})`
                    : `Make Full Payment (₦ ${totalWithPickup.toLocaleString()})`}
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
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg text-gray-600">No orders found.</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show the most recent order (first in array)
  const order = orderQuery[0];
  const {
    shippingAddress,
    orderItems,
    totalPrice,
    amountPaid,
    remainingBalance,
    paymentPlan,
    initialPaymentAmount,
    firstPayment,
  } = order;

  // Calculate actual total from order items
  const actualTotal = orderItems.reduce(
    (sum: number, item: OrderItem) => sum + item.price * item.quantity,
    0,
  );
  const totalWithPickup = actualTotal + pickupFee;

  // Determine amount based on payment mode
  const depositAmount =
    initialDepositInfo?.initialDeposit ||
    firstPayment ||
    initialPaymentAmount ||
    Math.floor(actualTotal * 0.5);
  const amountToPay = isFullPayment ? totalWithPickup : depositAmount;

  // Determine display amount based on payment mode
  const displayAmount = isFullPayment
    ? totalWithPickup
    : (initialDepositInfo?.initialDeposit || Math.floor(actualTotal * 0.5)) +
      pickupFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Left side: Customer and Delivery Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping Address */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center font-semibold text-green-600">
                  <span className="mr-2">1. SHIPPING ADDRESS</span>
                </div>
              </div>
              <div>
                {deliveryInfo &&
                deliveryInfo.deliveryMode === "door" &&
                deliveryInfo.deliveryAddress ? (
                  <>
                    <p className="font-bold">{deliveryInfo.deliveryAddress}</p>
                    <p className="text-sm text-gray-600">
                      {deliveryInfo.city}, {deliveryInfo.state}
                    </p>
                  </>
                ) : deliveryInfo &&
                  deliveryInfo.deliveryMode === "pickup" &&
                  deliveryInfo.pickupStation ? (
                  <>
                    <p className="font-bold">{deliveryInfo.pickupStation}</p>
                    <p className="text-sm text-gray-600">
                      {deliveryInfo.city}, {deliveryInfo.state}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold">
                      {shippingAddress.address}, {shippingAddress.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {shippingAddress.postalCode}, {shippingAddress.country}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Delivery & Payment Details */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center font-semibold text-green-600">
                  <span className="mr-2">2. PAYMENT & DELIVERY</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold capitalize">
                  {isPayInBits ? "Pay In Bits" : "Full Payment"}
                </p>
                <span className="font-bold text-orange-500">
                  {order.orderStatus}
                </span>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Payment status: {order.paymentStatus} | Paid:{" "}
                {order.isPaid ? "Yes" : "No"}
              </p>
              <p className="mb-4 text-sm text-gray-600">
                Amount Paid: ₦{amountPaid.toLocaleString()} | Remaining: ₦
                {remainingBalance.toLocaleString()}
              </p>
              {isPayInBits && (
                <p className="text-sm font-semibold text-blue-600">
                  Initial Deposit Required: ₦{depositAmount.toLocaleString()}
                </p>
              )}
            </div>

            {/* Products Ordered */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold">Products Ordered</h3>
              <div className="space-y-4">
                {orderItems.map((item: OrderItem) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
                      <Image
                        src={"/market/Image8.png"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      {isPayInBits && (
                        <p className="text-xs font-semibold text-blue-600">
                          Initial Deposit: ₦{depositAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {isPayInBits ? (
                        <>
                          <p className="font-bold text-blue-600">
                            ₦{depositAmount.toLocaleString()}{" "}
                            <span className="text-xs">(Initial Deposit)</span>
                          </p>
                          <p className="text-xs text-gray-400 line-through">
                            ₦{item.price.toLocaleString()}{" "}
                            <span className="text-xs">(Full Price)</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold">
                            ₦{item.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Subtotal: ₦
                            {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Plan (if present and in Pay In Bits mode) */}
            {isPayInBits && paymentPlan && paymentPlan.length > 0 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold">Payment Plan</h3>
                <div className="space-y-2">
                  {paymentPlan.map((plan: PaymentPlan, idx: number) => (
                    <div
                      key={plan._id || idx}
                      className="flex justify-between border-b pb-2 text-sm last:border-b-0"
                    >
                      <span>
                        Due:{" "}
                        {plan.dueDate
                          ? new Date(plan.dueDate).toLocaleDateString()
                          : ""}
                      </span>
                      <span>
                        Amount: ₦{plan.totalPayment?.toLocaleString() || 0}
                      </span>
                      <span>Status: {plan.isPaid ? "Paid" : "Pending"}</span>
                      {plan.paidAt && (
                        <span>
                          Paid at: {new Date(plan.paidAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right side: Order Summary */}
          <div className="rounded-lg border bg-white p-6 shadow-sm lg:sticky lg:top-8">
            <h2 className="mb-4 text-xl font-bold">Order summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price</span>
                <span>₦ {actualTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span>₦ {amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span>₦ {remainingBalance.toLocaleString()}</span>
              </div>

              {isPayInBits ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Mode</span>
                    <span className="font-semibold text-blue-600">
                      Pay In Bits
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount to Pay</span>
                    <span className="font-bold text-blue-600">
                      ₦{depositAmount.toLocaleString()}{" "}
                      <span className="text-xs">(Initial Deposit)</span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Mode</span>
                    <span className="font-semibold text-green-600">
                      Full Payment
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount to Pay</span>
                    <span className="font-bold text-gray-900">
                      ₦{totalWithPickup.toLocaleString()}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Status</span>
                <span>{order.orderStatus}</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-6">
              <button
                onClick={handleProceedToPayment}
                className="mt-4 w-full rounded-md bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
              >
                {isPayInBits ? (
                  <>Make Initial Deposit (₦{depositAmount.toLocaleString()})</>
                ) : (
                  <>Make Full Payment (₦{totalWithPickup.toLocaleString()})</>
                )}
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              By proceeding, you are automatically accepting the{" "}
              <a href="#" className="text-blue-600">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;

"use client"
import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/api/hooks/useAuth"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Navbar from "@/modules/HomePage/NavBar"
import Footer from "@/modules/HomePage/Footer"

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string | string[]
  size?: string
  product: {
    _id: string
    price?: number
  }
}

interface OrderItem {
  product: string
  name: string
  quantity: number
  price: number
  _id: string
}

interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

interface PaymentPlan {
  paymentNumber?: number
  dueDate: string
  totalPayment?: number
  principalAmount?: number
  interestAmount?: number
  remainingBalance?: number
  isPaid: boolean
  actualAmountPaid?: number
  isOverdue?: boolean
  daysOverdue?: number
  lateFees?: number
  additionalInterest?: number
  isPartialPayment?: boolean
  isUnscheduledPayment?: boolean
  isEarlyPayment?: boolean
  _id: string
  paidAt?: string
}

interface Order {
  _id: string
  shippingAddress: ShippingAddress
  orderItems: OrderItem[]
  paymentMethod: string
  paymentMode: string
  totalPrice: number
  amountPaid: number
  remainingBalance: number
  isPaid: boolean
  paidAt?: string
  isDelivered: boolean
  orderStatus: string
  paymentStatus: string
  paymentPlan?: PaymentPlan[]
  createdAt: string
  updatedAt: string
  initialPaymentAmount?: number
  firstPayment?: number
}

const OrderConfirmation: React.FC<{ paymentMode: "full" | "bits" | "100% Full Payment" | "Pay In Bits" }> = ({ paymentMode }) => {
  const router = useRouter()
  const { client } = useAuth()
  const queryClient = useQueryClient()
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null)
  const [initialDepositInfo, setInitialDepositInfo] = useState<any>(null)

  // Fetch cart items from API instead of relying on localStorage
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("/api/cart")
      return res.data
    },
  })

  // Extract cart items from the response
  const cartDetails: CartItem[] = cartData?.items || []

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
          throw error
        })
    },
  })

  useEffect(() => {
    // Load delivery info and initial deposit info from localStorage
    const deliveryRaw = typeof window !== "undefined" ? localStorage.getItem("deliveryInfo") : null
    if (deliveryRaw) {
      setDeliveryInfo(JSON.parse(deliveryRaw))
    }

    const depositRaw = typeof window !== "undefined" ? localStorage.getItem("initialDeposit") : null
    if (depositRaw) {
      try {
        setInitialDepositInfo(JSON.parse(depositRaw))
      } catch (e) {
        console.error("Error parsing initial deposit info:", e)
      }
    }
  }, [])

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

  const isPayInBits = effectivePaymentMode === "Pay In Bits" || effectivePaymentMode === "bits";
  const isFullPayment = effectivePaymentMode === "100% Full Payment" || effectivePaymentMode === "full";

  // Debug log
  console.log("OrderConfirmation: effectivePaymentMode =", effectivePaymentMode);
  console.log("isPayInBits:", isPayInBits, "isFullPayment:", isFullPayment);

  // Helper function to get image URL
  const getImageUrl = (imageUrl?: string | string[]) => {
    if (!imageUrl) return "/placeholder.svg"
    if (Array.isArray(imageUrl)) {
      return imageUrl[0] || "/placeholder.svg"
    }
    return imageUrl
  }

  const handleProceedToPayment = () => {
    if (cartDetails && cartDetails.length > 0) {
      // Calculate actual total from cart items
      const actualTotal = cartDetails.reduce((sum: number, item: CartItem) => {
        return sum + item.price * item.quantity
      }, 0)

      // Determine amount based on payment mode
      let amountToPay: number
      let paymentModeForStorage: string

      if (isFullPayment) {
        // FULL PAYMENT MODE
        amountToPay = actualTotal
        paymentModeForStorage = "100% Full Payment"
      } else {
        // PAY IN BITS MODE
        amountToPay = initialDepositInfo?.initialDeposit || Math.floor(actualTotal * 0.5)
        paymentModeForStorage = "Pay In Bits"
      }

      // Save cart details for payment page
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
      )
      router.push("/payment")
      return
    }

    if (!orderQuery || !orderQuery.length) return

    // For existing orders
    const order = orderQuery[0]
    const actualTotal = order.orderItems.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0)

    // Determine amount based on payment mode
    let amountToPay: number
    let paymentModeForStorage: string

    if (isFullPayment) {
      // FULL PAYMENT MODE
      amountToPay = actualTotal
      paymentModeForStorage = "100% Full Payment"
    } else {
      // PAY IN BITS MODE
      const depositAmount =
        initialDepositInfo?.initialDeposit ||
        order.firstPayment ||
        order.initialPaymentAmount ||
        Math.floor(actualTotal * 0.5)
      amountToPay = depositAmount
      paymentModeForStorage = "Pay In Bits"
    }

    // Save order details to localStorage for payment page
    const orderDetails = {
      order: order,
      total: actualTotal,
      remainingBalance: order.remainingBalance,
      amountToPay: amountToPay,
      paymentMode: paymentModeForStorage,
      initialDeposit: isPayInBits ? amountToPay : undefined,
    }
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails))
    router.push("/payment")
  }

  const isLoading = cartLoading || orderLoading
  const isError = cartError || orderError
  const error = cartError || orderErrorData

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{(error as any)?.message || "Failed to fetch data."}</div>
        </div>
        <Footer />
      </div>
    )
  }

  // If cart details exist, show cart confirmation
  if (cartDetails && Array.isArray(cartDetails) && cartDetails.length > 0) {
    // Calculate actual total from cart items
    const actualTotal = cartDetails.reduce((sum: number, item: CartItem) => {
      return sum + item.price * item.quantity
    }, 0)

    // Determine display amount based on payment mode
    const displayAmount = isFullPayment
      ? actualTotal
      : initialDepositInfo?.initialDeposit || Math.floor(actualTotal * 0.5)

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
                <p className="font-bold">
                  {deliveryInfo.deliveryMode === "pickup"
                    ? `Pickup Station: ${deliveryInfo.pickupStation}`
                    : `${deliveryInfo.city}, ${deliveryInfo.state}`}
                </p>
                <p className="text-gray-600 text-sm">Mode: {deliveryInfo.deliveryMode}</p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No delivery info found.</p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Display */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">CART ITEMS</h3>
                <div className="space-y-4">
                  {cartDetails.map((item: CartItem) => {
                    const itemTotal = item.price * item.quantity

                    return (
                      <div key={item._id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                          <Image
                            src={getImageUrl(item.imageUrl) || "/placeholder.svg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-md object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          {/* Show initial deposit info ONLY if in Pay In Bits mode */}
                          {isPayInBits && (
                            <p className="text-xs text-blue-600 font-semibold">
                              Initial Deposit: ₦{displayAmount.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {isPayInBits ? (
                            <>
                              <p className="font-bold text-blue-600">
                                ₦{displayAmount.toLocaleString()} <span className="text-xs">(Initial Deposit)</span>
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                ₦{item.price.toLocaleString()} <span className="text-xs">(Full Price)</span>
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-bold">₦{item.price.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">Subtotal: ₦{itemTotal.toLocaleString()}</p>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md border p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4 text-gray-800">ORDER SUMMARY</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₦ {actualTotal.toLocaleString()}</span>
                  </div>

                  {isPayInBits ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Mode</span>
                        <span className="text-blue-600 font-semibold">Pay In Bits</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Initial Deposit</span>
                        <span className="text-blue-600 font-bold">₦ {displayAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-gray-600 text-lg font-semibold">Amount to Pay</span>
                        <span className="text-2xl font-bold text-blue-600">₦ {displayAmount.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Mode</span>
                        <span className="text-green-600 font-semibold">Full Payment</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-gray-600 text-lg font-semibold">Amount to Pay</span>
                        <span className="text-2xl font-bold text-gray-900">₦ {actualTotal.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-orange-500 text-white font-bold py-4 rounded-lg text-lg hover:bg-orange-600 transition"
                >
                  {isPayInBits
                    ? `Pay Initial Deposit (₦ ${displayAmount.toLocaleString()})`
                    : `Make Full Payment (₦ ${actualTotal.toLocaleString()})`}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
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
    )
  }

  // Show the most recent order (first in array)
  const order = orderQuery[0]
  const {
    shippingAddress,
    orderItems,
    totalPrice,
    amountPaid,
    remainingBalance,
    paymentPlan,
    initialPaymentAmount,
    firstPayment,
  } = order

  // Calculate actual total from order items
  const actualTotal = orderItems.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0)

  // Determine amount based on payment mode
  const depositAmount =
    initialDepositInfo?.initialDeposit || firstPayment || initialPaymentAmount || Math.floor(actualTotal * 0.5)
  const amountToPay = isFullPayment ? actualTotal : depositAmount

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
                <p className="font-bold">
                  {shippingAddress.address}, {shippingAddress.city}
                </p>
                <p className="text-gray-600 text-sm">
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
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
                <p className="font-bold capitalize">{isPayInBits ? "Pay In Bits" : "Full Payment"}</p>
                <span className="text-orange-500 font-bold">{order.orderStatus}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Payment status: {order.paymentStatus} | Paid: {order.isPaid ? "Yes" : "No"}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Amount Paid: ₦{amountPaid.toLocaleString()} | Remaining: ₦{remainingBalance.toLocaleString()}
              </p>
              {isPayInBits && (
                <p className="text-blue-600 text-sm font-semibold">
                  Initial Deposit Required: ₦{depositAmount.toLocaleString()}
                </p>
              )}
            </div>

            {/* Products Ordered */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-bold mb-4">Products Ordered</h3>
              <div className="space-y-4">
                {orderItems.map((item: OrderItem) => (
                  <div key={item._id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <Image
                        src={"/market/Image8.png"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      {isPayInBits && (
                        <p className="text-xs text-blue-600 font-semibold">
                          Initial Deposit: ₦{depositAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {isPayInBits ? (
                        <>
                          <p className="font-bold text-blue-600">
                            ₦{depositAmount.toLocaleString()} <span className="text-xs">(Initial Deposit)</span>
                          </p>
                          <p className="text-xs text-gray-400 line-through">
                            ₦{item.price.toLocaleString()} <span className="text-xs">(Full Price)</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold">₦{item.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            Subtotal: ₦{(item.price * item.quantity).toLocaleString()}
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
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-bold mb-4">Payment Plan</h3>
                <div className="space-y-2">
                  {paymentPlan.map((plan: PaymentPlan, idx: number) => (
                    <div key={plan._id || idx} className="flex justify-between text-sm border-b pb-2 last:border-b-0">
                      <span>Due: {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString() : ""}</span>
                      <span>Amount: ₦{plan.totalPayment?.toLocaleString() || 0}</span>
                      <span>Status: {plan.isPaid ? "Paid" : "Pending"}</span>
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
                    <span className="text-blue-600 font-semibold">Pay In Bits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount to Pay</span>
                    <span className="text-blue-600 font-bold">
                      ₦{depositAmount.toLocaleString()} <span className="text-xs">(Initial Deposit)</span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Mode</span>
                    <span className="text-green-600 font-semibold">Full Payment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount to Pay</span>
                    <span className="text-gray-900 font-bold">₦{actualTotal.toLocaleString()}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Status</span>
                <span>{order.orderStatus}</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-6">
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-md mt-4 hover:bg-orange-600"
              >
                {isPayInBits ? (
                  <>Make Initial Deposit (₦{depositAmount.toLocaleString()})</>
                ) : (
                  <>Make Full Payment (₦{actualTotal.toLocaleString()})</>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
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
  )
}

export default OrderConfirmation



















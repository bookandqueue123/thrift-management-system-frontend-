"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/api/hooks/useAuth"
import { useRouter } from "next/navigation"
import SuccessToaster, { ErrorToaster } from "@/components/toast"
import { useSelector } from "react-redux"
import { selectToken } from "@/slices/OrganizationIdSlice"

// Define interfaces for payment data based on your API examples
interface PaymentScheduleItem {
  paymentNumber: number
  dueDate: string
  totalPayment: number
  principalAmount: number
  interestAmount: number
  remainingBalance: number
  isPaid: boolean
  paidAt: string | null
  actualAmountPaid: number
  lateFees: number
  additionalInterest: number
  isOverdue: boolean
}

interface OrderItem {
  product: string
  name: string
  quantity: number
  price: number // This should be the actual product price
}

interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
  fullName?: string
}

// Full Payment Data Structure (matches your commented example)
interface FullPaymentData {
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  amountPaid: number // Should equal totalPrice for full payment
  paymentMethod: string
  paymentMode: "100% Full Payment"
  totalPrice: number
}

// Pay In Bits Payment Data Structure (matches your API example)
interface PayInBitsPaymentData {
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentMode: "Pay In Bits"
  totalPrice: number
  initialPaymentAmount: number // The initial deposit amount
  paymentSchedule: PaymentScheduleItem[]
}

type PaymentData = FullPaymentData | PayInBitsPaymentData

const PaymentPage = () => {
  const { client } = useAuth()
  const token = useSelector(selectToken)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const orderDetailsRaw = localStorage.getItem("orderDetails")
    if (!orderDetailsRaw) {
      setErrorMessage("Order details not found. Please try again.")
      setIsLoading(false)
      return
    }

    const orderDetails = JSON.parse(orderDetailsRaw)

    // Always get paymentMode from localStorage (orderDetails)
    let effectivePaymentMode = "100% Full Payment";
    if (orderDetails && orderDetails.paymentMode) {
      effectivePaymentMode = orderDetails.paymentMode;
    }
    const isPayInBits = effectivePaymentMode === "Pay In Bits" || effectivePaymentMode === "bits";
    const isFullPayment = effectivePaymentMode === "100% Full Payment" || effectivePaymentMode === "full";

    // Get Pay In Bits data if available (only for Pay In Bits payments)
    const payInBitsDataRaw = localStorage.getItem("payInBitsData")
    const payInBitsData = payInBitsDataRaw ? JSON.parse(payInBitsDataRaw) : null

    console.log("Order Details:", orderDetails) // Debug log
    console.log("Pay In Bits Data:", payInBitsData) // Debug log
    console.log("Token available:", !!token) // Debug log
    console.log("Effective Payment Mode:", effectivePaymentMode) // Debug log

    // Check if we have the new order structure or old cart structure
    let paymentData: PaymentData

    if (orderDetails.order) {
      // New order structure from OrderConfirmation
      const { order, amountToPay, initialDeposit } = orderDetails

      // Base order items - use actual product prices
      const orderItems: OrderItem[] = order.orderItems.map((item: any) => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price, // Use the actual product price from the order
      }))

      // Calculate actual total from product prices
      const actualTotalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Base shipping address
      const shippingAddress: ShippingAddress = {
        ...order.shippingAddress,
        fullName: order.shippingAddress.fullName || order.shippingAddress.address,
      }

      if (isPayInBits) {
        // Pay In Bits payment structure
        const initialPaymentAmount =
          amountToPay ||
          initialDeposit ||
          payInBitsData?.initialDeposit ||
          order.firstPayment ||
          order.initialPaymentAmount ||
          Math.floor(actualTotalPrice * 0.5) // 50% of actual total as fallback

        paymentData = {
          orderItems,
          shippingAddress,
          paymentMethod: order.paymentMethod || "Card",
          paymentMode: "Pay In Bits",
          totalPrice: payInBitsData?.totalCost || actualTotalPrice,
          initialPaymentAmount,
          paymentSchedule: payInBitsData?.paymentSchedule || order.paymentPlan || [],
        } as PayInBitsPaymentData
      } else {
        // Full payment structure - use actual total price
        paymentData = {
          orderItems,
          shippingAddress,
          amountPaid: actualTotalPrice, // Use actual calculated total for full payment
          paymentMethod: order.paymentMethod || "Credit Card",
          paymentMode: "100% Full Payment",
          totalPrice: actualTotalPrice, // Use actual calculated total
        } as FullPaymentData
      }
    } else {
      // Old cart structure (fallback)
      const { cartItems, deliveryInfo, total, amountToPay, initialDeposit } = orderDetails

      // Base order items from cart - use actual product prices
      const orderItems: OrderItem[] = cartItems.map((item: any) => ({
        product: item.product?._id || item.productId,
        name: item.name || item.product?.name,
        quantity: item.quantity,
        price: item.product?.price || item.price, // Use actual product price
      }))

      // Calculate actual total from cart item prices
      const actualTotalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Base shipping address from delivery info
      const shippingAddress: ShippingAddress = {
        address: deliveryInfo?.pickupStation || `${deliveryInfo?.city}, ${deliveryInfo?.state}`,
        city: deliveryInfo?.city || "Lagos",
        postalCode: deliveryInfo?.postalCode || "100001",
        country: "Nigeria",
        fullName: deliveryInfo?.fullName || "Customer Name",
      }

      if (isPayInBits) {
        // Pay In Bits payment structure
        const initialPaymentAmount =
          amountToPay || initialDeposit || payInBitsData?.initialDeposit || Math.floor(actualTotalPrice * 0.5) // 50% of actual total as fallback

        paymentData = {
          orderItems,
          shippingAddress,
          paymentMethod: "Card",
          paymentMode: "Pay In Bits",
          totalPrice: payInBitsData?.totalCost || actualTotalPrice,
          initialPaymentAmount,
          paymentSchedule: payInBitsData?.paymentSchedule || [],
        } as PayInBitsPaymentData
      } else {
        // Full payment structure - use actual total price
        paymentData = {
          orderItems,
          shippingAddress,
          amountPaid: actualTotalPrice, // Use actual calculated total for full payment
          paymentMethod: "Credit Card",
          paymentMode: "100% Full Payment",
          totalPrice: actualTotalPrice, // Use actual calculated total
        } as FullPaymentData
      }
    }

    console.log("Payment Data:", paymentData) // Debug log
    console.log("Payment Mode:", paymentData.paymentMode) // Debug log

    // Validate payment data before sending
    if (paymentData.paymentMode === "Pay In Bits") {
      const payInBitsData = paymentData as PayInBitsPaymentData
      if (!payInBitsData.paymentSchedule || payInBitsData.paymentSchedule.length === 0) {
        setErrorMessage("Payment schedule is required for Pay In Bits mode")
        setIsLoading(false)
        return
      }
      if (!payInBitsData.initialPaymentAmount || payInBitsData.initialPaymentAmount <= 0) {
        setErrorMessage("Initial payment amount is required for Pay In Bits mode")
        setIsLoading(false)
        return
      }
    } else {
      const fullPaymentData = paymentData as FullPaymentData
      if (!fullPaymentData.amountPaid || fullPaymentData.amountPaid <= 0) {
        setErrorMessage("Payment amount is required")
        setIsLoading(false)
        return
      }

      // Validate that amountPaid equals totalPrice for full payment
      if (fullPaymentData.amountPaid !== fullPaymentData.totalPrice) {
        console.warn("Amount paid does not equal total price for full payment")
      }
    }

    // Trigger payment
    const makePayment = async () => {
      setIsLoading(true)
      setSuccessMessage("")
      setErrorMessage("")

      try {
        console.log("Sending payment data:", JSON.stringify(paymentData, null, 2)) // Debug log
        console.log("Using token:", token ? "Present" : "Missing") // Debug log

        // Use the client from useAuth hook which should handle authentication
        const response = await client.post("/api/payments", paymentData)

        console.log("Payment response:", response.data) // Debug log
        setSuccessMessage("Payment successful!")

        if (response.data?.data?.data?.link) {
          window.location.href = response.data.data.data.link
        } else if (response.data?.data?.link) {
          window.location.href = response.data.data.link
        } else {
          router.push("/user")
        }
      } catch (error: any) {
        console.error("Payment Error:", error) // Debug log
        console.error("Error response:", error.response?.data) // Debug log

        if (error.response?.status === 401) {
          setErrorMessage("Authentication failed. Please log in again.")
          setTimeout(() => router.push("/signin"), 2000)
        } else if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message)
        } else if (error.message) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage("Payment failed. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    makePayment()
  }, [token, router, client])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {successMessage && <SuccessToaster message={successMessage} />}
      {errorMessage && <ErrorToaster message={errorMessage} />}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Processing</h1>
        <p className="text-center text-gray-600">
          {isLoading ? "Processing your payment, please wait..." : errorMessage ? errorMessage : successMessage}
        </p>
        {errorMessage && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.back()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentPage

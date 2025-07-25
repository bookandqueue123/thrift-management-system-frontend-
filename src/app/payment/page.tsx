"use client";
import { useAuth } from "@/api/hooks/useAuth";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { selectToken } from "@/slices/OrganizationIdSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

// Define interfaces for payment data based on your API examples
interface PaymentScheduleItem {
  paymentNumber: number;
  dueDate: string;
  totalPayment: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  isPaid: boolean;
  paidAt: string | null;
  actualAmountPaid: number;
  lateFees: number;
  additionalInterest: number;
  isOverdue: boolean;
}

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number; // This should be the actual product price
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  fullName?: string;
}

// Full Payment Data Structure (matches your commented example)
interface FullPaymentData {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  amountPaid: number; // Should equal totalPrice for full payment
  paymentMethod: string;
  paymentMode: "100% Full Payment";
  totalPrice: number;
  pickupFee: number;
}

// Pay In Bits Payment Data Structure (matches your API example)
interface PayInBitsPaymentData {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentMode: "Pay In Bits";
  totalPrice: number;
  initialPaymentAmount: number;
  amountPaid: number;
  pickupFee: number;

  paymentSchedule: PaymentScheduleItem[];
}

type PaymentData = FullPaymentData | PayInBitsPaymentData;

const PaymentPage = () => {
  const { client } = useAuth();
  const token = useSelector(selectToken);
  const searchParams = useSearchParams();
  const pickupFeeParama = searchParams.get("pickupFee");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalAmountToPay, setTotalAmountToPay] = useState<number | null>(null);
  const [pickupFee, setPickupFee] = useState<number | null>(null);

  const paymentAttempted = useRef(false);
  useEffect(() => {
    // Prevent multiple payment attempts
    if (paymentAttempted.current) {
      return;
    }

    const orderDetailsRaw = localStorage.getItem("orderDetails");
    const totalAmountToPayRaw = localStorage.getItem("totalAmountToPay");
    const pickupFeeRaw = localStorage.getItem("pickupFee");
    const totalAmountToPay = totalAmountToPayRaw
      ? JSON.parse(totalAmountToPayRaw)
      : null;
    setTotalAmountToPay(totalAmountToPay);
    setPickupFee(pickupFeeRaw ? JSON.parse(pickupFeeRaw) : null);

    if (!orderDetailsRaw) {
      setErrorMessage("Order details not found. Please try again.");
      setIsLoading(false);
      return;
    }

    // Mark that we're attempting payment
    paymentAttempted.current = true;

    const orderDetails = JSON.parse(orderDetailsRaw);

    // Always get paymentMode from localStorage (orderDetails)
    let effectivePaymentMode = "100% Full Payment";
    if (orderDetails && orderDetails.paymentMode) {
      effectivePaymentMode = orderDetails.paymentMode;
    }
    const isPayInBits =
      effectivePaymentMode === "Pay In Bits" || effectivePaymentMode === "bits";
    const isFullPayment =
      effectivePaymentMode === "100% Full Payment" ||
      effectivePaymentMode === "full";

    // Get Pay In Bits data if available (only for Pay In Bits payments)
    const payInBitsDataRaw = localStorage.getItem("payInBitsData");
    const payInBitsData = payInBitsDataRaw
      ? JSON.parse(payInBitsDataRaw)
      : null;

    console.log("Order Detailss:", orderDetails); // Debug log
    console.log("Pay In Bits Data:", payInBitsData); // Debug log
    console.log("Token available:", !!token); // Debug log
    console.log("Effective Payment Mode:", effectivePaymentMode); // Debug log

    // Check if we have the new order structure or old cart structure
    let paymentData: PaymentData;

    if (orderDetails.order) {
      // New order structure from OrderConfirmation
      const { order } = orderDetails;
      const orderItems: OrderItem[] = order.orderItems.map((item: any) => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));
      const shippingAddress: ShippingAddress = {
        ...order.shippingAddress,
        fullName:
          order.shippingAddress.fullName || order.shippingAddress.address,
      };
      if (isPayInBits) {
        paymentData = {
          orderItems,
          shippingAddress,
          paymentMethod: order.paymentMethod || "Card",
          paymentMode: "Pay In Bits",
          totalPrice: totalAmountToPay, // Use totalAmountToPay from localStorage
          initialPaymentAmount: totalAmountToPay, // Use totalAmountToPay for initial deposit
          paymentSchedule:
            payInBitsData?.paymentSchedule || order.paymentPlan || [],
        } as PayInBitsPaymentData;
      } else {
        paymentData = {
          orderItems,
          shippingAddress,
          pickupFee,
          amountPaid: totalAmountToPay, // Use totalAmountToPay from localStorage
          paymentMethod: order.paymentMethod || "Credit Card",
          paymentMode: "100% Full Payment",
          totalPrice: totalAmountToPay, // Use totalAmountToPay from localStorage
        } as FullPaymentData;
      }
    } else {
      // Old cart structure (fallback)
      const { cartItems, deliveryInfo } = orderDetails;
      const orderItems: OrderItem[] = cartItems.map((item: any) => ({
        product: item.product?._id || item.productId,
        name: item.name || item.product?.name,
        quantity: item.quantity,
        price: item.product?.price || item.price,
      }));
      const shippingAddress: ShippingAddress = {
        address:
          deliveryInfo?.pickupStation ||
          `${deliveryInfo?.city}, ${deliveryInfo?.state}`,
        city: deliveryInfo?.city || "Lagos",
        postalCode: deliveryInfo?.postalCode || "100001",
        country: "Nigeria",
        fullName: deliveryInfo?.fullName || "Customer Name",
      };
      if (isPayInBits) {
        paymentData = {
          orderItems,
          shippingAddress,
          pickupFee,
          paymentMethod: "Card",
          paymentMode: "Pay In Bits",
          totalPrice: totalAmountToPay, // Use totalAmountToPay from localStorage
          initialPaymentAmount: totalAmountToPay, // Use totalAmountToPay for initial deposit
          paymentSchedule: payInBitsData?.paymentSchedule || [],
        } as PayInBitsPaymentData;
      } else {
        paymentData = {
          orderItems,
          shippingAddress,
          pickupFee,
          amountPaid: totalAmountToPay, // Use totalAmountToPay from localStorage
          paymentMethod: "Credit Card",
          paymentMode: "100% Full Payment",
          totalPrice: totalAmountToPay, // Use totalAmountToPay from localStorage
        } as FullPaymentData;
      }
    }

    console.log("Payment DataA:", paymentData); // Debug log
    console.log("Payment Mode:", paymentData.paymentMode); // Debug log

    // Validate payment data before sending
    if (paymentData.paymentMode === "Pay In Bits") {
      const payInBitsData = paymentData as PayInBitsPaymentData;
      if (
        !payInBitsData.paymentSchedule ||
        payInBitsData.paymentSchedule.length === 0
      ) {
        setErrorMessage("Payment schedule is required for Pay In Bits mode");
        setIsLoading(false);
        return;
      }
      if (
        !payInBitsData.initialPaymentAmount ||
        payInBitsData.initialPaymentAmount <= 0
      ) {
        setErrorMessage(
          "Initial payment amount is required for Pay In Bits mode",
        );
        setIsLoading(false);
        return;
      }
    } else {
      const fullPaymentData = paymentData as FullPaymentData;
      if (!fullPaymentData.amountPaid || fullPaymentData.amountPaid <= 0) {
        setErrorMessage("Payment amount is required");
        setIsLoading(false);
        return;
      }

      // Validate that amountPaid equals totalPrice for full payment

      if (fullPaymentData.amountPaid !== fullPaymentData.totalPrice) {
        console.warn("Amount paid does not equal total price for full payment");
      }
    }

    // Trigger payment
    const makePayment = async () => {
      setIsLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      try {
        console.log(
          "Sending payment data:",
          JSON.stringify(paymentData, null, 2),
        );
        // Add pickupFee from pickupFeeParama to paymentData before sending
        if (pickupFeeParama) {
          paymentData = {
            ...paymentData,
            pickupFee: JSON.parse(pickupFeeParama),
          };
        }
        const response = await client.post("/api/payments", paymentData);

        console.log("Payment response:", response.data);
        setSuccessMessage("Payment successful!");

        if (response.data?.data?.data?.link) {
          window.location.href = response.data.data.data.link;
        } else if (response.data?.data?.link) {
          window.location.href = response.data.data.link;
        } else {
          router.push("/user");
        }
      } catch (error: any) {
        console.error("Payment Error:", error);
        // Reset the flag on error so user can retry
        paymentAttempted.current = false;

        if (error.response?.status === 401) {
          setErrorMessage("Authentication failed. Please log in again.");
          setTimeout(() => router.push("/signin"), 2000);
        } else if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Payment failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    makePayment();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {successMessage && <SuccessToaster message={successMessage} />}
      {errorMessage && <ErrorToaster message={errorMessage} />}
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Payment Processing
        </h1>
        <p className="text-center text-gray-600">
          {isLoading
            ? "Processing your payment, please wait..."
            : errorMessage
              ? errorMessage
              : successMessage}
        </p>
        {/* Show total amount to pay and pickup fee if available */}
        {!isLoading && !errorMessage && (
          <div className="mt-6 text-center">
            {totalAmountToPay !== null && (
              <div className="mb-2 text-lg font-semibold">
                Total Amount to Pay: ₦{totalAmountToPay.toLocaleString()}
              </div>
            )}
            {pickupFee !== null && (
              <div className="mb-2 text-base">
                Pickup Station Fee: ₦{pickupFee.toLocaleString()}
              </div>
            )}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.back()}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;

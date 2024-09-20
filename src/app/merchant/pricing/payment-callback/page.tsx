"use client";

import { apiUrl } from "@/api/hooks/useAuth"; // Adjust import as necessary
import { selectToken } from "@/slices/OrganizationIdSlice";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const PaymentCallback = () => {
  const router = useRouter();
  const token = useSelector(selectToken);
  const searchParams = useSearchParams();
  const transaction_id = searchParams.get("transaction_id");
  const [processing, setProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const hasFetched = useRef(false); // Track if the effect has already run

  useEffect(() => {
    if (transaction_id && !hasFetched.current) {
      verifyPayment();
      hasFetched.current = true; // Mark the effect as having run
    }
  }, [transaction_id]);

  const verifyPayment = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}api/pay/flw/verify-subscription-payment?transaction_id=${transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setPaymentStatus("success");
        setTimeout(() => {
          router.push("/customer/savings-purpose");
        }, 2000);
      } else {
        setPaymentStatus("failure");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setPaymentStatus("failure");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {processing ? (
        <div className="h-20 w-20 animate-spin rounded-full border-b-4 border-gray-900"></div> // Tailwind CSS spinner
      ) : paymentStatus === "success" ? (
        <h1 className="text-4xl font-bold text-white">Payment Successful!</h1>
      ) : (
        <h1 className="text-4xl font-bold text-red-600">
          Payment Failed. Please try again.
        </h1>
      )}
    </div>
  );
};

export default function CallbackPayment() {
  return (
    <Suspense>
      <PaymentCallback />
    </Suspense>
  );
}

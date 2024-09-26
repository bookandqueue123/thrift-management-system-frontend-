"use client";

import { apiUrl } from "@/api/hooks/useAuth"; // Adjust import as necessary
import { selectToken, selectUser } from "@/slices/OrganizationIdSlice";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const PaymentCallback = () => {
  const router = useRouter();
  const token = useSelector(selectToken);
  const searchParams = useSearchParams();
  const transaction_id = searchParams.get("transaction_id");
  const clientRole = searchParams.get("role");

  const [processing, setProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const hasFetched = useRef(false); // Track if the effect has already run
  const user = useSelector(selectUser);
  const userRole = user?.role || "";

  const [host, setHost] = useState("");
  const [environmentName, setEnvironmentName] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      setHost(url.host);
    }

    if (host === "www.finkia.com.ng") {
      setEnvironmentName("production");
    } else if (host === "www.staging.finkia.com.ng") {
      setEnvironmentName("staging");
    } else {
      setEnvironmentName("localhost");
    }
  }, [host]);

  useEffect(() => {
    if (transaction_id && !hasFetched.current) {
      verifyPayment();
      hasFetched.current = true; // Mark the effect as having run
    }
  }, [transaction_id]);

  let verificationUrl = "";
  if (environmentName === "production") {
    verificationUrl = `${apiUrl}api/pay/flw/verify-prod-payment?transaction_id=${transaction_id}`;
  } else {
    verificationUrl = `${apiUrl}api/pay/flw/verify-subscription-payment?transaction_id=${transaction_id}`;
  }

  const verifyPayment = async () => {
    try {
      const response = await axios.get(verificationUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setPaymentStatus("success");
        console.log(user);
        setTimeout(() => {
          if (clientRole === "organisation") {
            router.replace("/merchant");
          } else {
            router.replace("/customer");
          }
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
    <div className="min-h-screen w-full bg-ajo_darkBlue  px-4 py-12 md:px-16">
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

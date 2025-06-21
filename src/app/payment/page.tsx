"use client";
import React, { useState } from 'react';
import { useAuth } from '@/api/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/api/hooks/useAuth';
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { useSelector } from 'react-redux';
import { selectToken } from '@/slices/OrganizationIdSlice';

const PaymentPage = () => {
  const { client } = useAuth();
  const token = useSelector(selectToken);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePayment = async () => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const paymentData = {
      orderItems: [
        {
          product: "6851787c4e7febb4ebdd1ccd",
          name: "WIRED OVER-EAR GAMING HEADPHONES WITH USB",
          quantity: 1,
          price: 200.00
        },
        {
          product: "685185404e7febb4ebdd2773",
          name: "Headphones",
          quantity: 2,
          price: 300.00
        }
      ],
      shippingAddress: {
        address: "123 Main Street",
        city: "Ikeja",
        postalCode: "100001",
        country: "Nigeria"
      },
      amountPaid: 800.00,
      paymentMethod: "Credit Card",
      paymentMode: "100% Full Payment",
      totalPrice: 800.00
    };

    try {
        const response = await fetch(
          `${apiUrl}api/payments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          setSuccessMessage("Payment successful!");
          
          if(responseData.data?.data?.link) {
            window.location.href = responseData.data.data.link;
          } else {
             router.push('/');
          }
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Something went wrong");
        }
    } catch (error) {
       console.error("Request error:", error);
       setErrorMessage("Network error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {successMessage && <SuccessToaster message={successMessage} />}
      {errorMessage && <ErrorToaster message={errorMessage} />}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Processing</h1>
        <p className="text-center text-gray-600">
          Please confirm your payment to complete the order.
        </p>
        <div className="mt-8 text-center">
            <button 
              onClick={handlePayment}
              disabled={isLoading}
              className="bg-orange-500 text-white font-bold py-3 px-8 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 
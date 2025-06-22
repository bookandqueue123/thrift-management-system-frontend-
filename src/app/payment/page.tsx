"use client";
import React, { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Read order details from localStorage
    const orderDetailsRaw = localStorage.getItem('orderDetails');
    if (!orderDetailsRaw) {
      setErrorMessage('Order details not found. Please try again.');
      setIsLoading(false);
      return;
    }
    const orderDetails = JSON.parse(orderDetailsRaw);
    const { cartItems, deliveryInfo, total } = orderDetails;
    // Build paymentData from orderDetails
    const paymentData = {
      orderItems: cartItems.map((item: any) => ({
        product: item.product._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        address: deliveryInfo?.pickupStation || `${deliveryInfo?.city}, ${deliveryInfo?.state}`,
        city: deliveryInfo?.city,
        postalCode: '',
        country: 'Nigeria'
      },
      amountPaid: total,
      paymentMethod: 'Credit Card',
      paymentMode: '100% Full Payment',
      totalPrice: total
    };
    // Trigger payment
    const makePayment = async () => {
      setIsLoading(true);
      setSuccessMessage("");
      setErrorMessage("");
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
            router.push('/user');
          }
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Something went wrong");
        }
      } catch (error) {
        setErrorMessage("Network error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    makePayment();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {successMessage && <SuccessToaster message={successMessage} />}
      {errorMessage && <ErrorToaster message={errorMessage} />}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Processing</h1>
        <p className="text-center text-gray-600">
          {isLoading ? 'Processing your payment, please wait...' : errorMessage ? errorMessage : successMessage}
        </p>
      </div>
    </div>
  );
};

export default PaymentPage; 
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const PaymentInstruction = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountNumber = searchParams.get("accountNumber");
  const bankName = searchParams.get("bankName");
  const amount = searchParams.get("amount");
  //   const { accountNumber, bankName, amount } = router.query; // Extract query params from the URL

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Perform necessary API call or actions here to confirm the payment
      // For example:
      // await fetch('/api/confirm-payment', { method: 'POST', body: JSON.stringify({ accountNumber }) });

      alert("Payment confirmed successfully!");

      // Redirect to a success or dashboard page after confirmation
      router.push("/success");
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("There was an error confirming the payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h1>Payment Instructions</h1>

      <p>Please make a payment to the following account details:</p>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <p>
          <strong>Bank Name:</strong> {bankName || "Example Bank"}
        </p>
        <p>
          <strong>Account Number:</strong> {accountNumber || "1234567890"}
        </p>
        <p>
          <strong>Amount:</strong> {amount || "1000.00"} USD
        </p>
      </div>

      <p>Once the payment has been made, click the button below to confirm.</p>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          backgroundColor: isSubmitting ? "#ccc" : "#0070f3",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Submitting..." : "Confirm Payment"}
      </button>
    </div>
  );
};

export default function PaymentInstructionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentInstruction />
    </Suspense>
  );
}

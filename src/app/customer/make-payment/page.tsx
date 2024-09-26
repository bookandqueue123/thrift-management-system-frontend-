"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import MakePayment from "@/modules/customer/makePayment.";

export default function Page() {
  return (
    <div>
      <ProtectedRoute requireSavings>
        <MakePayment />
      </ProtectedRoute>
    </div>
  );
}

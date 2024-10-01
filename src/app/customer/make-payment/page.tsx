"use client";
import useRedirect from "@/api/hooks/useRedirect";
import ProtectedRoute from "@/components/ProtectedRoute";
import MakePayment from "@/modules/customer/makePayment.";
export default function Page() {
  useRedirect();
  return (
    <div>
      <ProtectedRoute requireSavings>
        <MakePayment />
      </ProtectedRoute>
    </div>
  );
}

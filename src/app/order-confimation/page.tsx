"use client";

import OrderConfirmation from "@/modules/form/OrderConfirmation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Orderpage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  return (
    <div>
      <OrderConfirmation paymentMode={mode || "full"} />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <Orderpage />
    </Suspense>
  );
}

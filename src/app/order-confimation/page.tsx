"use client";

import OrderConfirmation from "@/modules/form/OrderConfirmation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Orderpage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  return (
    <Suspense>
      <div>
        <OrderConfirmation paymentMode={mode || "full"} />
      </div>
    </Suspense>
  );
}

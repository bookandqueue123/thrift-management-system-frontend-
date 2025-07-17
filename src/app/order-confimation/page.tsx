"use client";

import OrderConfirmation from "@/modules/form/OrderConfirmation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const page = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  return (
    <Suspense>
      <div>
        <OrderConfirmation paymentMode={mode || "full"} />
      </div>
    </Suspense>
  );
};

export default page;

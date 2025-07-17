"use client";

import OrderConfirmation from "@/modules/form/OrderConfirmation";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  return (
    <div>
      <OrderConfirmation paymentMode={mode || "full"} />
    </div>
  );
};

export default page;

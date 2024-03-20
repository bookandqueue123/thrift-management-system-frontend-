"use client";
import ChangePassword from "@/modules/ResetPassword/ChangePassword";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <ChangePassword/>
    </Suspense>
  );
}

"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import WithDrawalReportSettings from "@/modules/settings/withdrawal/WithdrawalReport";

export default function Page() {
  return (
    <>
      <ProtectedRoute requireSavings>
        <WithDrawalReportSettings />
      </ProtectedRoute>
    </>
  );
}

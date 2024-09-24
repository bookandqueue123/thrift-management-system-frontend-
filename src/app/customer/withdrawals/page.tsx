"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import WithdrawalForm from "@/modules/Withdrawal/Withdrawal";
import WithdrawalReport from "@/modules/Withdrawal/WithdrawalReport";
import { useRouter } from "next/navigation";

const Withdrawal = () => {
  const router = useRouter();
  return (
    <ProtectedRoute requireSavings>
      <div className="mx-16 ">
        <div className="mt-8">
          {/* <Alert
          content="Dear Customer your account will be credited within 24 hours after initiation of withdrawal"
          endpoint={``}
          buttonLabel=""
          // variant={hasKyc ? "success" : "error"}
          // variant="error"
          variant="success"
        /> */}
        </div>

        <p className="mb-1 mt-4 text-white">Withdrawal</p>
        <p className="mb-6 text-ajo_orange">
          Withdraw Funds, Kindly fill in the details below:
        </p>

        <WithdrawalForm />
        <WithdrawalReport />
      </div>
    </ProtectedRoute>
  );
};

export default Withdrawal;

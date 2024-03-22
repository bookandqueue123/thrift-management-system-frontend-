"use client";
import Alert from "@/components/Alert";
import WithdrawalForm from "@/modules/Withdrawal/Withdrawal";
import WithdrawalReport from "@/modules/Withdrawal/WithdrawalReport";
import { useRouter } from "next/navigation";

const Withdrawal = () => {
  const router = useRouter()
  return (
    <div className="mx-16 " >
      <div className="mt-8">
        <Alert
          content="Dear Customer your account will be created within 24 hours after initiation of withdrawal"
          endpoint={``}
          buttonLabel=""
          // variant={hasKyc ? "success" : "error"}
          variant="error"
        />
      </div>
       
      
      <p className="text-white mt-4 mb-1">Withdrawal</p>
      <p className="text-ajo_orange mb-6">
        Withdraw Funds, Kindly fill in the details below:
      </p>

    
      <WithdrawalForm />
      <WithdrawalReport/>
    </div>
  );
};

export default Withdrawal;

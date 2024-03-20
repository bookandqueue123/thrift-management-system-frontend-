"use client";
import WithdrawalForm from "@/modules/Withdrawal/Withdrawal";
import WithdrawalReport from "@/modules/Withdrawal/WithdrawalReport";
import { useRouter } from "next/navigation";

const Withdrawal = () => {
  const router = useRouter()
  return (
    <div className="mx-16 " >
      <button onClick={() => router.push('/signup/customer/kyc?id=65ecace5c48c4be6acb63381')}> kyc</button>
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

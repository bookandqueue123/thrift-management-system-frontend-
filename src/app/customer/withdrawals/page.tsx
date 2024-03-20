"use client";
import WithdrawalForm from "@/modules/customer/Withdrawal";

const Withdrawal = () => {
  return (
    <div className="mx-16">
      <p className="text-white">Withdrawal</p>
      <p className="text-ajo_orange">
        Withdraw Funds, Kindly fill in the details below:
      </p>

      <WithdrawalForm />
    </div>
  );
};

export default Withdrawal;

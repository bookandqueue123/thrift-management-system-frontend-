import CustomerNavbar from "@/components/Navbar";
import Image from "next/image";

import React from "react";

const CustomerDashboard = () => {
  const user = {
    firstName: "Dare",
    lastName: "Olanrewaju",
    acctBalance: 203935,
    nextWithdrawalDate: new Date("2024-02-12"),
  };
  return (
    <div className="container px-4 py-2 md:px-16 md:py-8">
      <div className="mb-4 space-y-2">
        <h6 className="text-base font-bold text-ajo_offWhite opacity-60">
          Dashboard
        </h6>
        <p className="text-sm text-ajo_offWhite">
          Welcome,{" "}
          <span className="font-bold">
            {user.firstName + " " + user.lastName}
          </span>
        </p>
      </div>
      <section className="mt-6 gap-y-4 flex flex-col mb-12 md:flex-row md:items-stretch md:gap-x-4 md:gap-y-0">
        <div className="flex items-center justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] pl-5">
          <div className="space-y-6">
            <div className="inline-block">
              <div className="flex items-center justify-start gap-x-1 rounded-lg bg-[rgba(255,255,255,0.1)] px-2 py-1">
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 14 11"
                  fill="none"
                  className="mb-[.15rem]"
                >
                  <path
                    d="M6.79637 2.71897C8.47199 2.71897 9.83192 3.84675 9.83192 5.23633C9.83192 5.56359 9.753 5.8707 9.61336 6.15768L11.3861 7.62782C12.3029 6.99345 13.0253 6.17279 13.4685 5.23633C12.4182 3.02609 9.82585 1.46029 6.7903 1.46029C5.94035 1.46029 5.12682 1.58615 4.374 1.81272L5.68536 2.90022C6.03141 2.78442 6.40175 2.71897 6.79637 2.71897ZM0.725274 1.34449L2.10948 2.4924L2.38875 2.724C1.38095 3.37348 0.59171 4.23945 0.118164 5.23633C1.16846 7.44657 3.76082 9.01237 6.79637 9.01237C7.73739 9.01237 8.63591 8.86133 9.45551 8.58945L9.7105 8.80091L11.4893 10.2711L12.2604 9.63164L1.4963 0.705078L0.725274 1.34449ZM4.08259 4.12869L5.02361 4.90907C4.99326 5.0148 4.97504 5.12556 4.97504 5.23633C4.97504 6.07209 5.78857 6.74675 6.79637 6.74675C6.92993 6.74675 7.0635 6.73164 7.19099 6.70647L8.13201 7.48685C7.72525 7.653 7.27599 7.75369 6.79637 7.75369C5.12075 7.75369 3.76082 6.62591 3.76082 5.23633C3.76082 4.83859 3.88224 4.46602 4.08259 4.12869ZM6.69923 3.73598L8.61163 5.32192L8.62377 5.24136C8.62377 4.4056 7.81024 3.73095 6.80244 3.73095L6.69923 3.73598Z"
                    fill="white"
                  />
                </svg>
                <p className="text-[10px] text-ajo_offWhite">Hide Balance</p>
              </div>
            </div>
            <div className="">
              <p className="text-xs font-semibold text-ajo_offWhite">
                Current Savings Balance
              </p>
              <p className="text-3xl font-extrabold text-white">
                N{user.acctBalance}
              </p>
            </div>
          </div>
          <Image
            src="/stars.svg"
            alt="stars"
            width={150}
            height={145}
            className=""
          />
        </div>
        <div className="flex items-center justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] pl-5">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-ajo_offWhite">
              Next Withdrawal Date
            </p>
            <div className="">
              <p className="text-xs font-medium text-ajo_offWhite">
                {user.nextWithdrawalDate.toDateString()}
              </p>
              <p className="text-3xl font-extrabold text-white">
                {user.nextWithdrawalDate.toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>
          <Image
            src="/calendar.svg"
            alt="stars"
            width={150}
            height={145}
            className=""
          />
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;

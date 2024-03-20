"use client";
import DummyTransactions from "@/api/dummyTransactions.json";
import { useAuth } from "@/api/hooks/useAuth";
import Alert from "@/components/Alert";
import { FilterDropdown } from "@/components/Buttons";
import { DashboardCard } from "@/components/Cards";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import { useQuery } from "@tanstack/react-query";
import { Session } from "inspector";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
const CustomerDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { client } = useAuth();
  console.log(id);
  if (!id) {
    router.push("/signin");
  }
  const {
    data: LoggedInUser,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["user", id],

    queryFn: async () => {
      return client
        .get(`/api/user/${id}`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  });
  console.log(LoggedInUser);

  const user = {
    firstName: "Dare",
    lastName: "Olanrewaju",
    acctBalance: 203935,
    nextWithdrawalDate: new Date("2024-02-12"),
    hasKyc: true,
  };

  console.log(user);

  if (!id) {
    // If id is not available yet, display loading indicator
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
      {LoggedInUser && !LoggedInUser.kycVerified && (
        <Alert
          content="Please upload your KYC documents to ensure uninterrupted service. Thank you."
          endpoint={`signup/customer/kyc?id=${id}`}
          buttonLabel="upload Kyc Details"
          // variant={hasKyc ? "success" : "error"}
          variant="error"
        />
      )}

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
      <section className="mb-12 mt-6 flex flex-col gap-y-4 md:flex-row md:items-stretch md:gap-x-4 md:gap-y-0">
        <DashboardCard
          illustrationName="stars"
          topValue={
            <div className="inline-block">
              <button className="flex items-center justify-start gap-x-1 rounded-lg bg-[rgba(255,255,255,0.1)] px-2 py-1 hover:bg-[rgba(255,255,255,0.2)] focus:bg-[rgba(255,255,255,0.2)]">
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
              </button>
            </div>
          }
          bottomValueTopText="Current Savings Balance"
          bottomValueBottomText={`N${AmountFormatter(user.acctBalance)}`}
        />
        <DashboardCard
          illustrationName="calendar"
          topValue={
            <p className="text-sm font-semibold text-ajo_offWhite">
              Next Withdrawal Date
            </p>
          }
          bottomValueTopText={user.nextWithdrawalDate.toDateString()}
          bottomValueBottomText={user.nextWithdrawalDate.toLocaleDateString(
            "en-GB",
          )}
        />
      </section>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="min-w-16 truncate text-sm font-semibold text-ajo_offWhite">
            Recent Transactions
          </p>
          <span className="flex items-center gap-3">
            <SearchInput />
            <FilterDropdown
              options={[
                "Timestamp",
                "Name",
                "Email",
                "Phone",
                "Channel",
                "Amount",
                "Status",
              ]}
            />
          </span>
        </div>

        <div>
          <p className="pl-2 text-xs text-ajo_offWhite">
            *Please Scroll sideways to view all content
          </p>
          <TransactionsTable
            headers={["Date", "Reference", "Channel", "Amount", "Status"]}
            content={DummyTransactions.map((transaction, index) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.transactionDate}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.reference}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.channel}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {AmountFormatter(Number(transaction.amount))} NGN
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator label={transaction.transactionStatus} />
                </td>
              </tr>
            ))}
          />
          <PaginationBar apiResponse={DummyTransactions} />
        </div>
      </section>
    </div>
  );
};

export default function Customer(){
  return(
    <div>
       <Suspense>
          <CustomerDashboard/>
    </Suspense>
    </div>
   

  )
}
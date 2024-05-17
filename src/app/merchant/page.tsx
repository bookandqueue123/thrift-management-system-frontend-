"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { FilterDropdown } from "@/components/Buttons";
import { DashboardCard } from "@/components/Cards";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";

import AmountFormatter from "@/utils/AmountFormatter";

import { useQuery } from "@tanstack/react-query";

import { SavingsInterface, savings } from "@/types";
import { extractDate, extractTime } from "@/utils/TimeStampFormatter";
import { ChangeEvent, SetStateAction, useState } from "react";
import { CiExport } from "react-icons/ci";

import { AxiosError, AxiosResponse } from "axios";

import { usePermissions } from "@/api/hooks/usePermissions";
import Alert from "@/components/Alert";
import PaginationBar from "@/components/Pagination";
import { useSelector } from "react-redux";
import Image from "next/image";

const MerchantDashboard = () => {
  const PAGE_SIZE = 5;
  const { client } = useAuth();
  const { userPermissions, permissionsLoading, permissionsMap } =
    usePermissions();
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState<savings[]>(
    [],
  );
  const organizationId = useSelector(selectOrganizationId);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [permissionError, setPermissionError] = useState("")

  // const token = useSelector(selectToken)
  const user = useSelector(selectUser);
  // console.log(user);

  //   console.log(organizationId)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (allTransactions) {
      const filtered = allTransactions.filter((item: savings) =>
        String(item.user.accountNumber).includes(String(e.target.value)),
      );
      setFilteredTransactions(filtered);
    }
  };

  const handleDateFilter = () => {
    // Filter the data based on the date range
    if (allTransactions) {
      const filtered = allTransactions.filter(
        (item: { createdAt: string | number | Date }) => {
          const itemDate = new Date(item.createdAt); // Convert item date to Date object
          const startDateObj = new Date(fromDate);
          const endDateObj = new Date(toDate);

          return itemDate >= startDateObj && itemDate <= endDateObj;
        },
      );

      // Update the filtered data state
      setFilteredTransactions(filtered);
    }
  };

  const [totalAmtCollected, setTotalAmtCollected] = useState(0);

  const { data: allTransactions, isLoading: isLoadingAllTransactions } =
    useQuery({
      queryKey: ["allTransactions"],
      staleTime: 5000,
      queryFn: async () => {
        return client
          .get(`/api/saving/get-savings?organisation=${organizationId}`)
          .then((response: AxiosResponse<SavingsInterface, any>) => {
            // console.log(response.data);
            if (user?.role === "staff") {
              let assignedUsersSavings = response.data.savings.filter(
                (saving) =>
                  user.assignedUser.find(
                    (assignee) => assignee._id === saving.user._id,
                  ),
              );
              setFilteredTransactions(assignedUsersSavings);
            } else {
              setFilteredTransactions(response.data.savings);
            }
            setTotalAmtCollected(response?.data?.totalAmountCollected);
            return response.data.savings;
          })
          .catch((error: AxiosError<any, any>) => {
            if (error.response?.data.message.includes('unauthorized')) {
              setPermissionError(error.response?.data.message);
            }
            throw error;
          });
      },
    });
  // console.log(allTransactions);

  let totalPages = 0;
  if (allTransactions) {
    totalPages = Math.ceil(allTransactions.length / PAGE_SIZE);
  }

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (allTransactions) {
    totalPages = Math.ceil(allTransactions.length / PAGE_SIZE);
  }

  const handleFromDateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setToDate(event.target.value);

    handleDateFilter();
  };

  // console.log("paginatedTransactions" + paginatedTransactions);
  const organization = {
    Name: user?.organisationName ?? user?.firstName + " " + user?.lastName,
    accountNumber: user?.accountNumber,
    totalAmtCollected: totalAmtCollected ?? 0,
    totalCustomers: user?.totalCustomer ?? 0,
    pendingPayout: user?.pendingPayout ?? 0,
    kycVerified: user?.kycVerified,
  };

  if (permissionsLoading) {
    return (
      <div className="flex min-h-[100vh] justify-center bg-ajo_darkBlue pt-[10%]">
        <Image
          src="/loadingSpinner.svg"
          alt="loading spinner"
          width={80}
          height={80}
        />
      </div>
    );
  } else {
    return (
      <>
        {!organization.kycVerified && (
          <Alert
            variant="error"
            buttonLabel="Get Verified"
            content="Attention: Your custom portal link will show a “Page Not Found” error to your customers unless you are verified. Please complete the verification process to ensure uninterrupted access to your services."
            endpoint="/welcome"
          />
        )}
        <div className="mb-4 space-y-2">
          <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
            Dashboard
          </p>
          <p className="text-sm capitalize text-ajo_offWhite">
            Welcome, <span className="font-bold">{organization.Name}</span>
            <p className="mt-0 text-sm font-bold text-ajo_orange ">
              {organization.accountNumber}
            </p>
          </p>
        </div>

        {user?.role !== "staff" && (
          <section className="mb-12 mt-6 flex flex-col gap-y-4 md:flex-row md:items-stretch md:gap-x-4 md:gap-y-0">
            <DashboardCard
              illustrationName="stars"
              topValue={
                <div className="inline-block">
                  <button
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                    className="flex items-center justify-start gap-x-1 rounded-lg bg-[rgba(255,255,255,0.1)] px-2 py-1 hover:bg-[rgba(255,255,255,0.2)] focus:bg-[rgba(255,255,255,0.2)]"
                  >
                    {isBalanceVisible ? (
                      <svg
                        width="14"
                        height="12"
                        viewBox="0 0 32 12"
                        fill="none"
                        className="mb-[.3rem]"
                      >
                        <path
                          d="M30.583 9.99999C30.583 9.99999 24.063 18.333 16 18.333C7.93799 18.333 1.41699 9.99999 1.41699 9.99999C1.41699 9.99999 7.93699 1.66699 16 1.66699C24.063 1.66699 30.583 9.99999 30.583 9.99999ZM16 5.83299C14.8948 5.83299 13.8349 6.27201 13.0535 7.05348C12.272 7.83494 11.833 8.89484 11.833 9.99999C11.833 11.1051 12.272 12.165 13.0535 12.9465C13.8349 13.728 14.8948 14.167 16 14.167C17.1051 14.167 18.165 13.728 18.9465 12.9465C19.728 12.165 20.167 11.1051 20.167 9.99999C20.167 8.89484 19.728 7.83494 18.9465 7.05348C18.165 6.27201 17.1051 5.83299 16 5.83299Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
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
                    )}
                    <p className="text-[10px] text-ajo_offWhite">
                      {isBalanceVisible ? "Hide Balance" : "Show Balance"}
                    </p>
                  </button>
                </div>
              }
              bottomValueTopText="Total Amount Collected"
              bottomValueBottomText={
                isBalanceVisible
                  ? `₦${AmountFormatter(organization.totalAmtCollected)}`
                  : "*********"
              }
            />
            <DashboardCard
              illustrationName="cards"
              topValue={
                <p className="text-sm font-semibold text-ajo_offWhite">
                  Pending Payouts
                </p>
              }
              bottomValueBottomText={organization.pendingPayout?.toString()}
            />
            <DashboardCard
              illustrationName="user"
              topValue={
                <p className="text-sm font-semibold text-ajo_offWhite">
                  Total Customers
                </p>
              }
              bottomValueBottomText={organization.totalCustomers?.toString()}
            />
          </section>
        )}

        <section>
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="min-w-16 truncate text-sm font-semibold text-ajo_offWhite">
              Recent Transactions
            </p>
            <span className="flex items-center gap-3">
              <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
                <input
                  onChange={handleSearch}
                  type="search"
                  placeholder="Search"
                  className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
                />
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <circle
                    cx="8.60996"
                    cy="8.10312"
                    r="7.10312"
                    stroke="#EAEAFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.4121 13.4121L16.9997 16.9997"
                    stroke="#EAEAFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </form>
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

          <div className="">
            <label
              htmlFor="fromDate"
              className="mb-2 text-sm font-semibold text-white"
            >
              Select range from:
            </label>
            <div className="justify-between space-y-2 md:flex">
              <div className="flex items-center">
                <input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
                />

                <label htmlFor="toDate" className="mx-2 text-white">
                  to
                </label>
                <input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={handleToDateChange}
                  className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
                />
              </div>
              {(user?.role === "organisation" ||
                (user?.role === "staff" &&
                  userPermissions.includes(
                    permissionsMap["export-saving"],
                  ))) && (
                <div className="mt-4 flex">
                  <button className="mr-4 flex rounded border border-ajo_offWhite bg-transparent px-4 py-2 font-medium text-ajo_offWhite hover:border-transparent hover:bg-blue-500 hover:text-ajo_offWhite">
                    Export as CSV{" "}
                    <span className="ml-2 mt-1">
                      <CiExport />
                    </span>
                  </button>
                  <button className="relative rounded-md border-none bg-transparent px-4 py-2 text-white">
                    <u>Export as Excel</u>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="mt-8 pl-2 text-xs text-ajo_offWhite">
              *Please Scroll sideways to view all content
            </p>
            <TransactionsTable
              headers={[
                "TransactionDate",
                "Reference",
                "Customer Name",
                "Email Address",
                "Phone Number",
                "Channel",
                "Amount",
                "Status",
              ]}
              content={
                filteredTransactions?.length === 0 ? (
                  <tr>
                    <p className="relative left-[80%] text-center text-sm font-semibold text-ajo_offWhite md:left-[250%] ">
                      {!permissionError
                        ? "No Transactions yet"
                        : permissionError +
                          ", contact your admin for permissions"}
                    </p>
                  </tr>
                ) : (
                  paginatedTransactions.map((transaction, index) => (
                    <tr className="" key={index}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {extractDate(transaction.createdAt)}{" "}
                        {extractTime(transaction.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {transaction._id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {transaction.user.firstName} {transaction.user.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {transaction.user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {transaction.user.phoneNumber}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        Channel
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {AmountFormatter(Number(transaction.amount))} NGN
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {transaction.isPaid}
                      </td>
                    </tr>
                  ))
                )
              }
            />
            <PaginationBar
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </section>
      </>
    );
  }
};

export default MerchantDashboard;

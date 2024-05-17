"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { SavingsInterface, allSavingsResponse, savings } from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { CiExport } from "react-icons/ci";
import { useSelector } from "react-redux";

interface monthOptionsProps {
  name: string;
  value: number;
}

export default function Analytics() {
  const {
    userPermissions,

    permissionsMap,
    assignedCustomers
  } = usePermissions();
  const monthOptions: monthOptionsProps[] = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];
  const yearsOption: monthOptionsProps[] = [
    { name: "2022", value: 2022 },
    { name: "2023", value: 2023 },
    { name: "2024", value: 2024 },
    { name: "2025", value: 2025 },
    { name: "2026", value: 2026 },
    { name: "2027", value: 2027 },
  ];
  const PAGE_SIZE = 5;

  const organizationId = useSelector(selectOrganizationId);
  const user = useSelector(selectUser);

  const { client } = useAuth();
  const [selectedYear, setSelectedYear] = useState<{
    name: string;
    value: number;
  }>(yearsOption[2]);
  const [selectedMonth, setSelectedMonth] = useState<{
    name: string;
    value: number;
  }>(monthOptions[3]);
  // const [searchResult, setSearchResult] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<savings[]>(
    [],
  );
  const [permissionError, setPermissionError] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const days = Array(31)
    .fill(null)
    .map((_, day) => day + 1);

  const handleMonthChange = (event: { target: { value: any } }) => {
    const selectedValue = event.target.value;
    const selected = monthOptions.find(
      (option) => option.value.toString() === selectedValue,
    );
    if (selected) {
      setSelectedMonth(selected);
    }
  };

  const handleYearChange = (event: { target: { value: any } }) => {
    const selectedValue = event.target.value;
    const selected = yearsOption.find(
      (option) => option.value.toString() === selectedValue,
    );
    if (selected) {
      setSelectedYear(selected);
    }
  };

  const { data: allTransactions } = useQuery({
    queryKey: ["allTransactions"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get(`/api/saving/get-savings?organisation=${organizationId}`)
        .then((response: AxiosResponse<SavingsInterface, any>) => {
          if (user?.role === "staff") {
            let assignedUsersSavings = response.data.savings.filter((saving) =>
              assignedCustomers.find(
                (assignee) => assignee._id === saving.user._id,
              ),
            );
            setFilteredTransactions(assignedUsersSavings);
          } else {
            setFilteredTransactions(response.data.savings);
          }
          return response.data.savings;
        })
        .catch((error: AxiosError<any, any>) => {
          if (error.response?.data.message.includes("unauthorized")) {
            setPermissionError(error.response?.data.message);
          }
          throw error;
        });
    },
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (allTransactions) {
      const filtered = allTransactions.filter((item: savings) =>
        String(item.user.accountNumber).includes(String(e.target.value)),
      );
      setFilteredTransactions(filtered);
    }
  };

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

  const paginatedTransactions = filteredTransactions?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  console.log(paginatedTransactions);

  // useEffect(() => {
  //   // Filter dates for April (target month: 4)
  //   const aprilDates = filteredDates(paginatedTransactions.map(tra), 4);
  //   setFilteredDates(aprilDates);
  // }, []);

  let totalPages = 0;
  if (filteredTransactions) {
    totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  }

  // const goToPreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const goToNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  const month = "January";
  const daysInMonth = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  // Generate headers including the month and its days
  const headers = [
    "Transaction ID",
    ...daysInMonth.map((day) => `${month} ${day}`),
    "Date",
  ];

  // function filterDatesWithMonthAndDay(
  //   dates: any[],
  //   year: number,
  //   month: number,
  //   day: number,
  // ) {
  //   return dates.some((dateString) => {
  //     const date = new Date(dateString);
  //     return (
  //       date.getFullYear() === year &&
  //       date.getMonth() + 1 === month &&
  //       date.getDate() === day
  //     );
  //   });
  // }

  return (
    <div>
      <div className="mb-4 space-y-2">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          General Report
        </p>
      </div>

      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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

        <div className="my-8 justify-between md:flex">
          <div className="items-center md:flex">
            <div className="mb-2 flex items-center">
              <p className="font-lg mr-2 text-white">Select Year:</p>
              <select
                title="select a year"
                className="w-48 appearance-none rounded-md border-0 border-gray-300 bg-[#F3F4F6] bg-dropdown-icon bg-[position:92%_center] bg-no-repeat px-4 py-2 focus:border-blue-500 focus:outline-none"
                id="yearSelect"
                value={selectedYear.value}
                onChange={handleYearChange}
              >
                {yearsOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2 flex items-center md:ml-2">
              <p className="font-lg mr-2 text-white">Select Month:</p>
              <select
                title="select a month"
                className="w-48 appearance-none rounded-md border-0 border-gray-300 bg-[#F3F4F6] bg-dropdown-icon bg-[position:92%_center] bg-no-repeat px-4 py-2 focus:border-blue-500 focus:outline-none"
                id="monthSelect"
                value={selectedMonth.value}
                onChange={handleMonthChange}
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(user?.role === "organisation" ||
            (user?.role === "staff" &&
              userPermissions.includes(permissionsMap["export-saving"]))) && (
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

        {/* <div className="mb-4">
          <p className="text-xl text-white"></p>
        </div> */}

        <TransactionsTable
          headers={[
            "S/N",
            "Name",
            "Account No",
            "General %",
            "General Fee",
            "Applied %",
            "Admin Fee",
            "Service Charge",
            "Applied Service Charge %",

            ...Array.from({ length: 31 }, (_, i) => i + 1).map(
              (day) => `${selectedMonth.name} ${day}`,
            ),
            "Total",
            "Total Amount Payable",
            "Margin",
            "Action",
          ]}
          content={
            filteredTransactions?.length === 0 ? (
              <tr>
                <p className="relative left-[80%] text-center text-sm font-semibold text-ajo_offWhite md:left-[700%] ">
                  {!permissionError
                    ? "No Transactions yet"
                    : permissionError + ", contact your admin for permissions"}
                </p>
              </tr>
            ) : (
              paginatedTransactions.map((transaction, index) => (
                <tr className="" key={index}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {index + 1}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {transaction.user.firstName} {transaction.user.lastName}{" "}
                    {transaction.user.groupName}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {transaction.user.accountNumber || "---"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    General %
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    General fee
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {transaction.appliedPercentage}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {AmountFormatter(transaction.adminFee)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {AmountFormatter(transaction.serviceCharge)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {transaction.appliedServiceCharge}
                  </td>

                  {days.map((day) => (
                    <td
                      key={day}
                      className="whitespace-nowrap px-6 py-4 text-sm"
                    >
                      {transaction.calculatedPaidDays.some(
                        (paidDay: { datePaid: string | number | Date }) => {
                          const date = new Date(paidDay.datePaid);
                          return (
                            date.getFullYear() === selectedYear.value &&
                            date.getMonth() + 1 === selectedMonth.value &&
                            date.getDate() === day
                          );
                        },
                      )
                        ? AmountFormatter(
                            transaction?.calculatedPaidDays?.find(
                              (paidDay: {
                                datePaid: string | number | Date;
                              }) => {
                                const date = new Date(paidDay.datePaid);
                                return (
                                  date.getFullYear() === selectedYear.value &&
                                  date.getMonth() + 1 === selectedMonth.value &&
                                  date.getDate() === day
                                );
                              },
                            )?.amountPerDay ?? 0,
                          )
                        : "---"}
                    </td>
                  ))}

                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {transaction.totalAmountSaved}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {transaction.amountPayable}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {transaction.adminMargin}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    Action
                  </td>
                </tr>
              ))
            )
          }
        />

        <div className="flex justify-center">
          <PaginationBar
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </section>
    </div>
  );
}

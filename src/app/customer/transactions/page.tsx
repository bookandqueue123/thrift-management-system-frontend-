"use client";
import { FilterDropdown } from "@/components/Buttons";

import { useAuth } from "@/api/hooks/useAuth";
import TransactionsTable from "@/components/Tables";
import { selectUserId } from "@/slices/OrganizationIdSlice";
import { allSavingsResponse } from "@/types";
import { extractDate, extractTime } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { CiExport } from "react-icons/ci";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
const Transactions = () => {
  const { client } = useAuth();
  const PAGE_SIZE = 5;
  const [customerSavings, setCustomerSavings] = useState<allSavingsResponse[]>(
    [],
  );
  const [filteredSavings, setFilteredSavings] = useState<allSavingsResponse[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const id = useSelector(selectUserId);

  const { data: allSavings, isLoading: isLoadingAllSavings } = useQuery({
    queryKey: ["allSavings"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get(`/api/saving/get-savings`)
        .then((response) => {
          // setFilteredSavings(response.data.savings)
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });


  const { data: allTransactions, isLoading: isLoadingAllTransactions } = useQuery({
    queryKey: ["allTransactions"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get(`/api/transactions`)
        .then((response) => {
          // setFilteredSavings(response.data.savings)
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });
 
  useEffect(() => {
    if (allTransactions) {
      // Check if Savings?.savings is not undefined or null
      const filtered = allTransactions?.filter(
        (item: { customerId: string; }) => item?.customerId === id,
      );
      setCustomerSavings(filtered);
      setFilteredSavings(filtered);
    }
  }, [allTransactions, id ]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // setSearchResult(e.target.value);

    if (filteredSavings) {
      const filtered = filteredSavings.filter((item) =>
        String(item.user.accountNumber).includes(String(e.target.value)),
      );
      // Update the filtered data state
      setFilteredSavings(filtered);
    }
  };

  const paginatedSavings = filteredSavings?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  let totalPages = 0;
  if (customerSavings) {
    totalPages = Math.ceil(customerSavings.length / PAGE_SIZE);
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!id) {
    // If id is not available yet, display loading indicator
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="min-w-16 truncate text-sm font-semibold text-ajo_offWhite">
            Recent Transactions
          </p>
          <span className="flex items-center gap-3">
            {/* <SearchInput onSearch={() => ("")}/> */}
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

        <div className="justify-between md:flex">
          <div className="flex items-center">
            <p className="font-lg mr-2 text-white">Select range from:</p>
            <input
              type="date"
              // value={fromDate}
              //  onChange={handleFromDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />

            <p className="mx-2 text-white">to</p>
            <input
              type="date"
              // value={toDate}
              // onChange={handleToDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mt-4 flex">
            <button className="mr-4 flex rounded border border-white bg-transparent px-4 py-2 font-medium text-white hover:border-transparent hover:bg-blue-500 hover:text-white">
              Export as CSV{" "}
              <span className="ml-2 mt-1">
                <CiExport />
              </span>
            </button>
            <button className="relative rounded-md border-none bg-transparent px-4 py-2 text-white">
              <u>Export as Excel</u>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="pl-2 text-xs text-ajo_offWhite">
            *Please Scroll sideways to view all content
          </p>
          <TransactionsTable
            headers={[
              "",
              "Transaction Date",
              "Account Number",
              "Purpose",
              // "Reference",
              "Customer Name",
              "email",
              "Phone Number",
              "Channel",
              "Amount",
              "Status",
              "Transaction",
            ]}
            content={paginatedSavings.map((savings, index) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {extractDate(savings.updatedAt || "-----")}{" "}
                  {extractTime(savings.updatedAt || "-----")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.accountNumber || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.purposeName || "-----"}
                </td>
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings._id || "-----"}
                </td> */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.customerName ||"----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.phoneNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.typeOfPosting}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {/* {AmountFormatter(Number(transaction.amount))}  */}
                  {savings.amount} NGN
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.status || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="bg-white"></button>
                </td>
              </tr>
            ))}
          />
          <div className="flex items-center justify-center  space-x-2">
            <button
              className="rounded-md border border-blue-500 p-2 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={goToPreviousPage}
            >
              <MdKeyboardArrowLeft />
            </button>

            <button
              className="cursor-pointer  rounded-md p-2 text-blue-500 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={() => setCurrentPage(currentPage)}
            >
              {currentPage}
            </button>

            <button
              className="cursor-pointer  rounded-md p-2 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {currentPage + 1}
            </button>
            <button
              className="cursor-pointer  rounded-md p-2 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={() => setCurrentPage(currentPage + 2)}
            >
              {currentPage + 2}
            </button>

            <button
              className="rounded-md border border-blue-500 p-2 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={goToNextPage}
            >
              <MdKeyboardArrowRight />
            </button>

            {/* <button
                className="p-2 bg-white rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
                onClick={() => dispatch(setCurrentPage(currentPage + 6))}
              >
                {currentPage + 6}
              </button> */}
          </div>
          {/* <PaginationBar apiResponse={DummyTransactions} /> */}
        </div>
      </section>
    </div>
  );
};

export default Transactions;

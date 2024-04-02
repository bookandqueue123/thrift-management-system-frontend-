'use client'
import DummyTransactions from "@/api/dummyTransactions.json";
import { FilterDropdown } from "@/components/Buttons";

import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import { extractDate, extractTime } from "@/utils/TimeStampFormatter";
import { AxiosError } from "axios";
import { useAuth } from "@/api/hooks/useAuth";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md"
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "@/slices/OrganizationIdSlice";
import { allSavingsResponse } from "@/types";
const Transactions = () => {
  const { client } = useAuth();
  const PAGE_SIZE = 5;
  const [customerSavings, setCustomerSavings] = useState<allSavingsResponse[]>([])
  const [filteredSavings, setFilteredSavings] = useState<allSavingsResponse[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const id = useSelector(selectUserId)

  const { data: allSavings, isLoading: isLoadingAllSavings } = useQuery({
    queryKey: ["allSavings"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get(`/api/saving/get-savings`)
        .then((response) => {
          console.log("allSavingsSuccess: ", response.data);
          // setFilteredSavings(response.data.savings)
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error.response);
          throw error;
        });
    },
  });

  useEffect(() => {
    console.log(allSavings)
    if (allSavings?.savings) {
      // Check if Savings?.savings is not undefined or null
      const filtered = allSavings.savings.filter(
        (item: { user: { _id: string; }; }) => item.user._id === id,
      );
      setCustomerSavings(filtered);
      setFilteredSavings(filtered)
    } 
  }, [allSavings, id])
 
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // setSearchResult(e.target.value);
    console.log(filteredSavings)
    if(filteredSavings){
      const filtered = filteredSavings.filter((item) =>
        String(item.user.accountNumber).includes(String(e.target.value))
    );
    // Update the filtered data state
    setFilteredSavings(filtered);
    }
    
  };

  const paginatedSavings = filteredSavings?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  
  let totalPages = 0
  if(customerSavings){
     totalPages = Math.ceil(customerSavings.length / PAGE_SIZE);
  }
  
  const goToPreviousPage = () => {
    
    if (currentPage > 1) {
      (setCurrentPage(currentPage - 1));
    }
  };

  const goToNextPage = () => {
 
    if (currentPage < totalPages) {
     (setCurrentPage(currentPage + 1));
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

        <div>
          <p className="pl-2 text-xs text-ajo_offWhite">
            *Please Scroll sideways to view all content
          </p>
          <TransactionsTable
          headers={["", "Transaction Date", "Account Number", "Purpose", "Reference", "Customer Name", "email", "Phone Number", "Channel", "Amount", "Status", "Transaction"]}
          content={paginatedSavings.map((savings, index) => (
            <tr className="" key={index}>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
        <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out" />
      </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
              {extractDate(savings.updatedAt || "-----")} {extractTime(savings.updatedAt || "-----")}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
              {savings.user.accountNumber || "----"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
              {savings.purposeName || "-----"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
              {savings._id || "-----"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
              {savings.user.firstName + " " + savings.user.lastName ||
                    "----"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
              {savings.user.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
              {savings.user.phoneNumber}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {/* {transaction.channel} */}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {/* {AmountFormatter(Number(transaction.amount))}  */}
                {savings.amount} NGN
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
              {savings.isPaid || "----"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <button className="bg-white">

                </button>
              </td>
            </tr>
          ))}
        />
        <div className="flex justify-center items-center  space-x-2">
            <button
              className="p-2 border border-blue-500 rounded-md hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={goToPreviousPage}
            >
              <MdKeyboardArrowLeft />
            </button>

            <button
              className="p-2  text-blue-500 rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() => setCurrentPage(currentPage)}
            >
              {currentPage}
            </button>

            <button
              className="p-2  rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() =>(setCurrentPage(currentPage + 1))}
            >
              {currentPage + 1}
            </button>
            <button
              className="p-2  rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() =>(setCurrentPage(currentPage + 2))}
            >
              {currentPage + 2}
            </button>

            <button
              className="p-2 border border-blue-500 rounded-md hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
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

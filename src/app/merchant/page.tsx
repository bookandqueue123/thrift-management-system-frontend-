'use client'
import DummyTransactions from "@/api/dummyTransactions.json";
import { FilterDropdown } from "@/components/Buttons";
import { DashboardCard } from "@/components/Cards";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import { StatusIndicator } from "@/components/StatusIndicator";
import { useDispatch, useSelector } from "react-redux";
import { selectOrganizationId, selectToken, selectUser } from '@/slices/OrganizationIdSlice';
import { useAuth } from "@/api/hooks/useAuth";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { allSavingsResponse, customer, savings } from "@/types";
import { ChangeEvent, SetStateAction, useState } from "react";
import { extractDate, extractTime, formatToDateAndTime } from "@/utils/TimeStampFormatter";
import { Badge } from "@/components/StatusBadge";
import { CiExport } from "react-icons/ci";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md"
const MerchantDashboard = () => {
  const PAGE_SIZE = 2;
  const { client } = useAuth();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredTransactions, setFilteredTransactions] = useState<savings[]>([])
const organizationId = useSelector(selectOrganizationId)
// const token = useSelector(selectToken)
// const user = useSelector(selectUser)
// console.log(user)
  
//   console.log(organizationId)

const { data: allTransactions, isLoading: isLoadingallTransactions } = useQuery({
  queryKey: ["allTransactions"],
  staleTime: 5000,
  queryFn: async () => {
    return client
      .get(`/api/saving/get-savings?organisation=${organizationId}`)
      .then((response) => {
        console.log( response);
        setFilteredTransactions(response.data.savings)
        return response.data;
      })
      .catch((error: AxiosError<any, any>) => {
        console.log(error.response);
        throw error;
      });
  },
});

const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  // setSearchResult(e.target.value);
  console.log(e.target.value)

  console.log(allTransactions.savings)
  if(allTransactions){
    const filtered = allTransactions.savings.filter((item: {
      [x: string]: any; accountNumber: any; 
}) =>
      String(item.user.accountNumber).includes(String(e.target.value))
  );
  // Update the filtered data state
  setFilteredTransactions(filtered);
  }
  
};

const handleDateFilter = () => {
  // Filter the data based on the date range
  if(allTransactions){
  const filtered = allTransactions.savings.filter((item: { createdAt: string | number | Date; }) => {
    const itemDate = new Date(item.createdAt); // Convert item date to Date object
    const startDateObj = new Date(fromDate);
    const endDateObj = new Date(toDate);

    return itemDate >= startDateObj && itemDate <= endDateObj;
  });

  // Update the filtered data state
  setFilteredTransactions(filtered);
}
};

console.log(filteredTransactions)
const paginatedTransactions = filteredTransactions.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
);
// let paginatedTransactions: any[];
// if (Array.isArray(filteredTransactions)) {
//   paginatedTransactions = filteredTransactions.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );
// } else {
//   // Handle the case where filteredTransactions is not an array
//   // For example, assign an empty array to paginatedTransactions
//   paginatedTransactions = [];
// }

let totalPages = 0
if(allTransactions){
   totalPages = Math.ceil(allTransactions.savings.length / PAGE_SIZE);
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
const handleFromDateChange = (event: { target: { value: SetStateAction<string>; }; }) => {
  setFromDate(event.target.value);
  
};

const handleToDateChange = (event: { target: { value: SetStateAction<string>; }; }) => {
  setToDate(event.target.value);
  
  handleDateFilter()
};


console.log(paginatedTransactions)
  const organization = {
    Name: "First Savers Cooperative",
    totalAmtCollected: 203935,
    totalCustomers: 500,
    pendingPayout: 250,
  };
  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Dashboard
        </p>
        <p className="text-sm text-ajo_offWhite">
          Welcome, <span className="font-bold">{organization.Name}</span>
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
          bottomValueTopText="Total Amount Collected"
          bottomValueBottomText={`N${AmountFormatter(organization.totalAmtCollected)}`}
        />
        <DashboardCard
          illustrationName="cards"
          topValue={
            <p className="text-sm font-semibold text-ajo_offWhite">
              Pending Payouts
            </p>
          }
          bottomValueBottomText={organization.pendingPayout.toString()}
        />
        <DashboardCard
          illustrationName="user"
          topValue={
            <p className="text-sm font-semibold text-ajo_offWhite">
              Total Customers
            </p>
          }
          bottomValueBottomText={organization.totalCustomers.toString()}
        />
      </section>
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

        <div className="flex items-center">
                <p className="mr-2 font-lg text-white">Select range from:</p>
                <input
                  type="date"
                  value={fromDate}
                   onChange={handleFromDateChange}
                  className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />


                <p className="mx-2 text-white">to</p>
                <input
                  type="date"
                  value={toDate}
                  onChange={handleToDateChange}
                  className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex mt-4">
                <button className="mr-4 bg-transparent hover:bg-blue-500 text-white font-medium hover:text-white py-2 px-4 border border-white hover:border-transparent rounded flex">Export as CSV <span className="ml-2 mt-1"><CiExport /></span></button>
                <button className="px-4 py-2 text-white rounded-md border-none bg-transparent relative">
                  
                  <u>Export as Excel</u>
                </button>
              </div>

        <div>
          <p className="pl-2 text-xs text-ajo_offWhite">
            *Please Scroll sideways to view all content
          </p>
          <TransactionsTable
            headers={["TransactionDate", 
                      "Reference", 
                      "Customer Name", 
                      "Account Number",
                      "Purpose",
                      "Time",
                      "Payment Mode",
                      
                      "Email Address", 
                      "Phone Number",
                      "Channel",
                       "Amount", "Status"]}
            content={paginatedTransactions.map((transaction, index) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {extractDate(transaction.createdAt)} {extractTime(transaction.createdAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction._id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.user.firstName} {transaction.user.lastName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.user.accountNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.purposeName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {extractTime(transaction.updatedAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                 Payment Mode
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
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator label={transaction.transactionStatus} />
                </td> */}
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
    </>
  );
};

export default MerchantDashboard;

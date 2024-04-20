"use client";
import DummyTransactions from "@/api/dummyTransactions.json";
import { useAuth } from "@/api/hooks/useAuth";
import Alert from "@/components/Alert";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { DashboardCard } from "@/components/Cards";
import { SearchInput } from "@/components/Forms";
import Modal from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import { useQuery } from "@tanstack/react-query";
import { Session } from "inspector";
import Link from "next/link";
import { useRouter,  } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "@/slices/OrganizationIdSlice";
import { allSavingsResponse } from "@/types";
import { AxiosError } from "axios";
import { extractDate, extractTime } from "@/utils/TimeStampFormatter";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md"
import { CiExport } from "react-icons/ci";


const CustomerDashboard = () => {
  const PAGE_SIZE = 5;
  const [modalState, setModalState] = useState(true);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [customerSavings, setCustomerSavings] = useState<allSavingsResponse[]>([])
  const [filteredSavings, setFilteredSavings] = useState<allSavingsResponse[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter();
  
   const id = useSelector(selectUserId)
  
  const { client } = useAuth();
  
 
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
         
          throw error;
        });
    },
  });
  
  

  const user = {
    firstName: "Dare",
    lastName: "Olanrewaju",
    acctBalance: 203935,
    nextWithdrawalDate: new Date("2024-02-12"),
    hasKyc: true,
  };

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

  useEffect(() => {

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

  // console.slog(paginatedSavings)

  if (!id) {
    // If id is not available yet, display loading indicator
    return <div>Loading...</div>;
  }

  
  // const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  //   setSearchResult(e.target.value);
  //   console.log(e.target.value)

  //   if(allCustomers){
  //     const filtered = allCustomers.filter(item =>
  //       String(item.accountNumber).includes(String(e.target.value))
  //   );
  //   // Update the filtered data state
  //   setFilteredCustomer(filtered);
  //   }
    
  // };

  const ProfileSetupComplete = () => {
    
    return (
      <div className="flex flex-col justify-center items-center text-white mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Profile Setup Incomplete
        </h1>
        <p className="text-lg text-gray-400 mb-8 text-center">
          Ensure Uninterrupted Service by Uploading Your KYC
        </p>

        
        <CustomButton
            type="button"
            label="Upload KYC document"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
             onButtonClick={() => router.push(`signup/customer/kyc?id=${id}`)}
          />
       
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
      {LoggedInUser && !LoggedInUser.kycVerified && (
        <>
        {/* <Alert
          content="Complete your registration."
          endpoint={`signup/customer/kyc?id=${id}`}
          buttonLabel="upload Kyc Details"
          // variant={hasKyc ? "success" : "error"}
          variant="error"
        /> */}
        {modalState && (
          <Modal
          setModalState={setModalState}
          
        >
          <ProfileSetupComplete
          
          />
        </Modal>
        )}
        
        </>
        
      )}

        {LoggedInUser && (
          <>
            <div className="mb-4 space-y-2">
      
      <h6 className="text-base font-bold text-ajo_offWhite opacity-60">
        Dashboard
      </h6>
      <p className="text-sm text-ajo_offWhite">
        Welcome,{" "}
        <span className="font-bold capitalize">
          {LoggedInUser.firstName + " " + LoggedInUser.lastName}
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
      {/* <DashboardCard
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
      /> */}
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

      <div className="md:flex justify-between">
        <div className="flex items-center">
                <p className="mr-2 font-lg text-white">Select range from:</p>
                <input
                  type="date"
                  // value={fromDate}
                  //  onChange={handleFromDateChange}
                  className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />


                <p className="mx-2 text-white">to</p>
                <input
                  type="date"
                  // value={toDate}
                  // onChange={handleToDateChange}
                  className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex mt-4">
                <button className="mr-4 bg-transparent hover:bg-blue-500 text-white font-medium hover:text-white py-2 px-4 border border-white hover:border-transparent rounded flex">Export as CSV <span className="ml-2 mt-1"><CiExport /></span></button>
                <button className="px-4 py-2 text-white rounded-md border-none bg-transparent relative">
                  
                  <u>Export as Excel</u>
                </button>
              </div>
        </div>

      <div>
        <p className="pl-2 text-xs text-ajo_offWhite mt-8">
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
          </>
        )}
          
    </div>
  );
};

function CustomerFallBack(){
  return <>Loading...</>
}
export default function Customer(){
  return(
    <div>
       <Suspense fallback={<CustomerFallBack/>}>
          <CustomerDashboard/>
    </Suspense>
    </div>
   

  )
}
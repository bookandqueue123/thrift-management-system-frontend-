'use client'
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal from "@/components/Modal";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import CreateCommissionForm from "@/modules/superAdmin/CreateCommission";
import ViewCommission from "@/modules/superAdmin/ViewCommission";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { allSavingsResponse } from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { CiExport } from "react-icons/ci";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";


const mockData = [
    {
      "organisation": "ABC Corporation",
      "organisationIdNo": "123456",
      "Appliedlowest": 1000,
      "AdminFeeLowest": 50,
      "Apliedhigest": 5000,
      "AdminFeeHiest": 100,
      "AppliedServiceCharge": 0.5,
      "serviceCharge": 20,
      "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "action": "View"
    },
    {
      "organisation": "XYZ Corp",
      "organisationIdNo": "789012",
      "Appliedlowest": 2000,
      "AdminFeeLowest": 70,
      "Apliedhigest": 6000,
      "AdminFeeHiest": 120,
      "AppliedServiceCharge": 0.7,
      "serviceCharge": 25,
      "comment": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "action": "Edit"
    },
    {
      "organisation": "Example Corp",
      "organisationIdNo": "345678",
      "Appliedlowest": 1500,
      "AdminFeeLowest": 60,
      "Apliedhigest": 5500,
      "AdminFeeHiest": 110,
      "AppliedServiceCharge": 0.6,
      "serviceCharge": 22,
      "comment": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "action": "Delete"
    }
  ]

  
interface monthOptionsProps{
   name: string;
    value: number; 
}
  
export default function Analytics(){
  const monthOptions: monthOptionsProps[]  = [
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
    { name: "December", value: 12 }
  ];
  const yearsOption: monthOptionsProps[]  = [
    { name: "2022", value: 2022 },
    { name: "2023", value: 2023 },
    { name: "2024", value: 2024 },
    { name: "2025", value: 2025 },
    { name: "2026", value: 2026 },
    { name: "2027", value: 2027 },
    
  ];
  const PAGE_SIZE = 5;
  
  const organizationId = useSelector(selectOrganizationId)
  // const organizationId = useSelector(selectOrganizationId)

  const { client } = useAuth();
  const [selectedYear, setSelectedYear] = useState<{ name: string; value: number }>(yearsOption[2]);
  const [selectedMonth, setSelectedMonth] = useState<{ name: string; value: number }>(monthOptions[3]);
  const [searchResult, setSearchResult] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<allSavingsResponse[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<number>(0);
    
    const [filteredDates, setFilteredDates] = useState([]);
   
    const days = Array(31).fill(null).map((_, day) => day + 1); 
  const toggleDropdown = (val: number) => {
      if (openDropdown === val) {
        setOpenDropdown(0);
      } else {
        setOpenDropdown(val);
      }
    };

    const handleMonthChange = (event: { target: { value: any; }; }) => {
      const selectedValue = event.target.value;
      const selected = monthOptions.find(option => option.value.toString() === selectedValue);
      if (selected) {
        setSelectedMonth(selected);
        
      }
    };

    const handleYearChange = (event: { target: { value: any; }; }) => {
      const selectedValue = event.target.value;
      const selected = yearsOption.find(option => option.value.toString() === selectedValue);
      if (selected) {
        setSelectedYear(selected);
        
      }
    };
    
    const { data: allTransactions, isLoading: isLoadingAllTransactions } =
    useQuery({
      queryKey: ["allTransactions"],
      staleTime: 5000,
      queryFn: async () => {
        return client
          .get(`/api/saving/get-savings?organisation=${organizationId}`)
          .then((response) => {
         
            setFilteredTransactions(response.data.savings)
            
            return response.data.savings;
          })
          .catch((error: AxiosError<any, any>) => {
       
            throw error;
          });
      },
    });

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchResult(e.target.value);

  
      if (allTransactions) {
        const filtered = allTransactions.filter((item: {
          user: any; accountNumber: any; 
}) =>
          String(item.user.accountNumber).includes(String(e.target.value)),
        );
  
        // Update the filtered data state
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
        const filtered = allTransactions.filter((item: { createdAt: string | number | Date; }) => {
          const itemDate = new Date(item.createdAt); // Convert item date to Date object
          const startDateObj = new Date(fromDate);
          const endDateObj = new Date(toDate);
  
          return itemDate >= startDateObj && itemDate <= endDateObj;
        });
  
        // Update the filtered data state
        setFilteredTransactions(filtered);
       
      }
    };
    
    const paginatedTransactions = filteredTransactions?.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    );
    console.log(paginatedTransactions)


    // useEffect(() => {
    //   // Filter dates for April (target month: 4)
    //   const aprilDates = filteredDates(paginatedTransactions.map(tra), 4);
    //   setFilteredDates(aprilDates);
    // }, []);
  
    let totalPages = 0;
    if (filteredTransactions) {
      totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
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
  
  

    const month = "January";
    const daysInMonth = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  
    // Generate headers including the month and its days
    const headers = ["Transaction ID", ...daysInMonth.map(day => `${month} ${day}`), "Date"];
  
  
    
    
    function filterDatesWithMonthAndDay(dates: any[], year: number, month: number, day: number) {
      return dates.some(dateString => {
          const date = new Date(dateString);
          return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
      });
   }
  
  
    return(
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

        <div className="md:flex justify-between my-8">
          <div className="md:flex items-center">
          <div className="flex items-center mb-2">
              <p className="mr-2 font-lg text-white">Select Year:</p>
              <select className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" id="monthSelect" value={selectedYear.value} onChange={handleYearChange}>
              {yearsOption.map(option => (
                <option key={option.value} value={option.value}>{option.name}</option>
              ))} 
              </select>
            </div>
          
            {/* <p className="mr-2 font-lg text-white">Select range from:</p>
            <input
              type="date"
              value={fromDate}
                onChange={handleFromDateChange}
              className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            /> */}


            {/* <p className="mx-2 text-white">to</p> */}
            
            <div className="flex items-center mb-2 md:ml-2">
              <p className="mr-2 font-lg text-white">Select Month:</p>
              <select className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" id="monthSelect" value={selectedMonth.value} onChange={handleMonthChange}>
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>{option.name}</option>
              ))} 
              </select>
            </div>
            {/* <input
              type="date"
              value={toDate}
               onChange={handleToDateChange}
              className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            /> */}
            </div>
              <div className="flex mt-4">
                <button className="mr-4 bg-transparent hover:bg-blue-500 text-white font-medium hover:text-white py-2 px-4 border border-white hover:border-transparent rounded flex">Export as CSV <span className="ml-2 mt-1"><CiExport /></span></button>
                <button className="px-4 py-2 text-white rounded-md border-none bg-transparent relative">
                  
                  <u>Export as Excel</u>
                </button>
              </div>
          </div>
          
        

          <div className="mb-4">
        <p className="text-white text-xl"></p>
      </div>

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
        
        ...Array.from({ length: 31 }, (_, i) => i + 1).map(day => `${selectedMonth.name} ${day}`),
        "Total",
        "Total Amount Payable",
        "Margin",
        "Action"
        ]}

        content={paginatedTransactions.map((transaction, index) => (
          
          
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  
                  {index + 1}
                 
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                 
                  {transaction.user.firstName} {transaction.user.lastName} {transaction.user.groupName}
                 
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
                  <td key={day} className="whitespace-nowrap px-6 py-4 text-sm">
                  {filterDatesWithMonthAndDay(transaction.savedDates, selectedYear.value, selectedMonth.value, day)
                      ? AmountFormatter(transaction.amount)
                      : '---'}
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
           
        ))}
      />

      < div className="flex justify-center items-center  space-x-2">
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
      </section>

     
        </div>
    )
}



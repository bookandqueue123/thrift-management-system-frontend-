'use client'
import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import CustomerAction from "@/components/CustomerAction";
import Modal, { ModalConfirmation } from "@/components/Modal";
import TransactionsTable from "@/components/Tables";
import { CreateCustomer } from "@/modules/merchant/customer/CustomerPage";
import { selectToken } from "@/slices/OrganizationIdSlice";
import { customer } from "@/types";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { CiExport } from "react-icons/ci";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";


const mockData = [
    {
      "Customer_Name": "John Doe",
      "Account_Created_on": "2023-08-15",
      "Email_Address": "john@example.com",
      "Phone_Number": "+1234567890",
      "State": "California",
      "LGA": "Los Angeles",
      "Organisation": "ABC Corporation",
      "Action": "View Details"
    },
    {
      "Customer_Name": "Jane Smith",
      "Account_Created_on": "2023-12-10",
      "Email_Address": "jane@example.com",
      "Phone_Number": "+1987654321",
      "State": "Texas",
      "LGA": "Houston",
      "Organisation": "XYZ Corp",
      "Action": "View Details"
    },
    {
      "Customer_Name": "Alice Johnson",
      "Account_Created_on": "2024-02-25",
      "Email_Address": "alice@example.com",
      "Phone_Number": "+1122334455",
      "State": "New York",
      "LGA": "New York City",
      "Organisation": "Example Corp",
      "Action": "View Details"
    }
  ];
export default function SuperAdminCustomer(){
  const { client } = useAuth();
  const token = useSelector(selectToken);
   const PAGE_SIZE = 5;
   const [searchResult, setSearchResult] = useState("");
   const [fromDate, setFromDate] = useState("");
   const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCustomers, setFilteredCustomer] = useState<customer[]>([]);
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [modalToShow, setModalToShow] = useState<
    "view" | "savings" | "edit" | "create-customer" | ""
  >("");
  const [isCustomerCreated, setIsCustomerCreated] = useState(false);
  const [error, setError] = useState("");
  const [mutationResponse, setMutationResponse] = useState("");
  const { data: allCustomers, isLoading: isLoadingAllCustomers, refetch } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&userType=individual`,
          {},
        ) //populate this based onthee org
        .then((response: AxiosResponse<customer[], any>) => {
        
          setFilteredCustomer(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
         
          throw error;
        });
    },
  });
  

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.trim().toLowerCase();
    setSearchResult(searchQuery);
  
    if (allCustomers) {
      const filtered = allCustomers.filter((item) =>
        item.firstName.toLowerCase().includes(searchQuery) ||
        item.lastName.toLowerCase().includes(searchQuery)
      );
      // Update the filtered data state
      setFilteredCustomer(filtered);
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
    if (allCustomers) {
      const startDateObj = new Date(fromDate);
      let endDateObj = new Date(toDate);
      
      // Adjust the endDateObj to the end of the day
      endDateObj.setHours(23, 59, 59, 999);
  
     
  
      if (isNaN(startDateObj.getTime())) {
        console.error('Invalid fromDate:', fromDate);
        return;
      }
  
      if (isNaN(endDateObj.getTime())) {
        console.error('Invalid toDate:', toDate);
        return;
      }
  
      const filtered = allCustomers.filter((item: { createdAt: string | number | Date; }) => {
        const itemDate = new Date(item.createdAt); // Convert item date to Date object
        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
  
      setFilteredCustomer(filtered);
    }
  };
  
  useEffect(() => {
    if (fromDate && toDate) {
      handleDateFilter();
    }
  }, [fromDate, toDate]);

  console.log(filteredCustomers)
  const paginatedCustomers = filteredCustomers?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allCustomers) {
    totalPages = Math.ceil(allCustomers.length / PAGE_SIZE);
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

  useEffect(() => {
    // Calling refetch to rerun the allRoles query
    refetch();
  }, [isCustomerCreated, refetch]);

  const handleExport = async () => {
  
    try {
      // const organisation = organisationId; 
      const response = await fetch(`${apiUrl}api/user/export-superadmin-customer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to export users:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while exporting users:', error);
    }
  };

  const handleExcelExport = async () => {
    try {
      // const organisation = organisationId; // Replace with actual organisation ID or obtain it dynamically
      const response = await fetch(`${apiUrl}api/user/export-superadmin-excel-customer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to export users:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while exporting users:', error);
    }
  };

 
    return(
        <div>
           <div className="mb-4 space-y-2">
                <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
                 Customers
                </p>
            </div>

            <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
          <CustomButton
            type="button"
            label="Create new customers"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
              setModalState(true);
              setModalToShow("create-customer");
              setModalContent("form");
            }}
          />
         
        </div>

        <div className="md:flex justify-between my-8">
          <div className="flex items-center">
            <p className="mr-2 font-lg text-white">Select range from:</p>
            <input
              type="date"
              value={fromDate}
                onChange={handleFromDateChange}
              className="px-4  py-2  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />


            <p className="mx-2 text-white ">to</p>
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="px-4 py-2  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            </div>
              <div className="flex mt-4">
                <button onClick={handleExport} className="mr-4 bg-transparent hover:bg-blue-500 text-white font-medium hover:text-white py-2 px-4 border border-white hover:border-transparent rounded flex">Export as CSV <span className="ml-2 mt-1"><CiExport /></span></button>
                <button onClick={handleExcelExport} className="px-4 py-2 text-white rounded-md border-none bg-transparent relative">
                  
                  <u>Export as Excel</u>
                </button>
              </div>
          </div>

          <div className="mb-4">
        <p className="text-white text-xl">Customer List</p>
      </div>

      <TransactionsTable
        headers={[
        "Customer Name",
        "Account Number",
        
        "Customer ID",
        "Account Created on",
        "Email Address",
        "Phone Number",
        "State",
        "LGA",
        "Organisation",
        "Action"
        ]}

        content={paginatedCustomers.map((customer, index) => (
          <tr className="" key={index}>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                {customer.firstName} {customer.lastName}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.accountNumber}
              </td>
              
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer._id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {extractDate(customer.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.phoneNumber} 
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.state}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.lga}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.organisationName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <CustomerAction
                  index={index}
                  customerId={customer._id}
                />
              </td>
          </tr>
      ))}
      />

{modalState && (
            <Modal
              setModalState={setModalState}
              title={
                modalContent === "confirmation"
                  ? ""
                  : modalToShow === "view"
                    ? "View Customer"
                    : modalToShow === "edit"
                      ? "Edit Customer"
                      : modalToShow === "savings"
                        ? "Savings Set Up"
                        : modalToShow === "create-customer"
                          ? "Create Customer"
                          : ""
              }
            >
              {modalToShow === "view" ? (
                ""
                // <ViewCustomer
                //   customerId={customerToBeEdited}
                //   setContent={setModalContent}
                //   content={
                //     modalContent === "confirmation" ? "confirmation" : "form"
                //   }
                //   closeModal={setModalState}
                // />
              ) : modalToShow === "savings" ? (""
                // <SavingsSettings
                //   customerId={customerToBeEdited}
                //   setContent={setModalContent}
                //   content={
                //     modalContent === "confirmation" ? "confirmation" : "form"
                //   }
                //   closeModal={setModalState}
                // />
              ) : modalToShow === "edit" ? (""
                // <EditCustomer
                //   customerId={customerToBeEdited}
                //   setContent={setModalContent}
                //   content={
                //     modalContent === "confirmation" ? "confirmation" : "form"
                //   }
                //   closeModal={setModalState}
                // />
              ) : modalToShow === "create-customer" ? (
                <>
                  {modalContent === "form" ? (
                    <div className="px-[10%]">
                      <CreateCustomer
                        setCloseModal={setModalState}
                        setCustomerCreated={setIsCustomerCreated}
                        setModalContent={setModalContent}
                        setError={setError}
                        setMutationResponse={setMutationResponse}
                      />
                    </div>
                  ) : (
                    <ModalConfirmation
                      successTitle="Customer creation successful"
                      errorTitle="Customer Creation Failed"
                      status={isCustomerCreated ? "success" : "failed"}
                      responseMessage={mutationResponse}
                    />
                  )}
                </>
              ) : (
                ""
              )}
            </Modal>
          )}

        <div className="flex justify-center">
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
                <MdKeyboardArrowRight/>
              </button>

              {/* <button
                className="p-2 bg-white rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
                onClick={() => dispatch(setCurrentPage(currentPage + 6))}
              >
                {currentPage + 6}
              </button> */}
            </div>
            </div>
      </section>
        </div>
    )
}
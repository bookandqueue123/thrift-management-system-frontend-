'use client'
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import CustomerAction from "@/components/CustomerAction";
import TransactionsTable from "@/components/Tables";
import { getOrganizationProps } from "@/types";
import { extractDate, extractTime, formatToDateAndTime } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, SetStateAction, useState } from "react";
import { CiExport } from "react-icons/ci";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";


const mockData = [
    {
      "organisation_name": "ABC Corporation",
      "organization_id": "123456",
      "total_customers": 500,
      "registration_day": "2024-03-28"
    },
    {
      "organisation_name": "XYZ Corp",
      "organization_id": "789012",
      "total_customers": 1000,
      "registration_day": "2023-10-15"
    },
    {
      "organisation_name": "Example Corp",
      "organization_id": "345678",
      "total_customers": 300,
      "registration_day": "2024-01-10"
    }
  ];
  
export default function SuperAdminOrganisation(){
  const PAGE_SIZE = 5;
  const { client } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [filteredOrganisations, setFilteredOrganisations] = useState<getOrganizationProps[]>([])
  const {
    data: organizations,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganizations"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=organisation`, {})
        .then((response) => {
          setFilteredOrganisations(response.data)
          return response.data;
          
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  });

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
    if (organizations) {
      const filtered = organizations.filter((item: { createdAt: string | number | Date; }) => {
        const itemDate = new Date(item.createdAt); // Convert item date to Date object
        const startDateObj = new Date(fromDate);
        const endDateObj = new Date(toDate);

        return itemDate >= startDateObj && itemDate <= endDateObj;
      });

      // Update the filtered data state
      setFilteredOrganisations(filtered);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.target.value);
    console.log(e.target.value);

    if (organizations) {
      const filtered = organizations.filter((item: { accountNumber: any; }) =>
        String(item.accountNumber).includes(String(e.target.value)),
      );
      // Update the filtered data state
      setFilteredOrganisations(filtered);
    }
  };
  
  const paginatedCustomers = filteredOrganisations?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (organizations) {
    totalPages = Math.ceil(organizations.length / PAGE_SIZE);
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


    return(
        <div>
           <div className="mb-4 space-y-2">
                <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
                 Organisation
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
            label="Create an Organisation"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
            //   setModalState(true);
            //   setModalContent("form");
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
          </div>

          <div className="mb-4">
        <p className="text-white text-xl">Organisation List</p>
      </div>

      <TransactionsTable
        headers={[
        "S/N",
        "Organisation Name",
        "Account Number",
        "email",
        
        "Total Number of Customers",
        "Registration Date",
        "Action"
        ]}

        content={paginatedCustomers.map((organisation, index) => (
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {index}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.organisationName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.accountNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.email}
                </td>
                
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    --- customers
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {extractDate(organisation.createdAt)} 
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                <CustomerAction
                  index={index}
                  customerId={organisation._id}
                  />
                </td>
            </tr>
        ))}
      />

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
                <MdKeyboardArrowRight />
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
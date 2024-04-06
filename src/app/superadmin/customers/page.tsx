'use client'
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import TransactionsTable from "@/components/Tables";
import { CiExport } from "react-icons/ci";


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
            // onChange={handleSearch}
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
            //   value={fromDate}
            //     onChange={handleFromDateChange}
              className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />


            <p className="mx-2 text-white">to</p>
            <input
              type="date"
            //   value={toDate}
            //   onChange={handleToDateChange}
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
        <p className="text-white text-xl">Customer List</p>
      </div>

      <TransactionsTable
        headers={[
        "Customer Name",
        "Account Created on",
        "Email Address",
        "Phone Number",
        "State",
        "LGA",
        "Organisation",
        "Action"
        ]}

        content={mockData.map((organisation, index) => (
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.Customer_Name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.Account_Created_on}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.Email_Address}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.Phone_Number} customers
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.State}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.LGA}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.Organisation}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    
                </td>
            </tr>
        ))}
      />
      </section>
        </div>
    )
}
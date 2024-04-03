'use client'
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import TransactionsTable from "@/components/Tables";
import { CiExport } from "react-icons/ci";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";

const mockData = [
    {
      "group_name": "Group A",
      "account_name": "John Doe",
      "account_number": "1234567890",
      "bank_name": "ABC Bank",
      "group_type": "Type X",
      "total_group_number": 10
    },
    {
      "group_name": "Group B",
      "account_name": "Jane Smith",
      "account_number": "0987654321",
      "bank_name": "XYZ Bank",
      "group_type": "Type Y",
      "total_group_number": 5
    },
    {
      "group_name": "Group C",
      "account_name": "Alice Johnson",
      "account_number": "1122334455",
      "bank_name": "Example Bank",
      "group_type": "Type Z",
      "total_group_number": 15
    }
  ];
export default function SuperAdminCustomer(){
    return(
        <div>
           <div className="mb-4 space-y-2">
                <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
                 Groups
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
            label="Create Group"
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
        <p className="text-white text-xl">Existing Group List</p>
      </div>

      <TransactionsTable
        headers={[
        "Group Name",
        "Account Name",
        "Account Number",
        "Bank Name,",
        "Group Type", 
        "Total Group Number",
        "Action"
        ]}

        content={mockData.map((group, index) => (
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.group_name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.account_name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.account_number}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.bank_name} customers
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.group_type}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.total_group_number}
                </td>
               
                <td className="whitespace-nowrap flex px-6 py-4 text-sm">
                    <div className="">
                        <MdModeEditOutline />
                    </div>
                    <div className="mx-6">
                        <MdDelete />
                    </div>
                    <div className="">
                        <FaFileDownload />
                    </div>
                </td>
            </tr>
        ))}
      />
      </section>
        </div>
    )
}
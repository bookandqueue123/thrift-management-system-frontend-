'use client'
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal from "@/components/Modal";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import CreateCommissionForm from "@/modules/superAdmin/CreateCommission";
import ViewCommission from "@/modules/superAdmin/ViewCommission";
import Link from "next/link";
import { useState } from "react";
import { CiExport } from "react-icons/ci";


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

  
  
export default function SuperAdminCustomer(){
    const [showModal, setShowModal] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<number>(0);
    
    const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [modalToShow, setModalToShow] = useState<
    "view" | "savings" | "edit" | "create-customer" | ""
  >("");
  const [customerToBeEdited, setCustomerToBeEdited] = useState({});
    const toggleDropdown = (val: number) => {
      if (openDropdown === val) {
        setOpenDropdown(0);
      } else {
        setOpenDropdown(val);
      }
    };
    return(
        <div>
        

            {showModal ? (
            <Modal
              setModalState={setShowModal}
              title="Commission">
           
             
              <CreateCommissionForm/>
            </Modal>
          ) : ""}
           <div className="mb-4 space-y-2">
                <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
                 Commisssion
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
            label="Create Commission"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
                setShowModal(true)
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
        <p className="text-white text-xl">Commission List</p>
      </div>

      <TransactionsTable
        headers={[
        "S/N",
        "Organisation",
        "Organisation ID No",
        "Applied % (lowest range)",
        "Admin Fee (Lowest range)",
        "Applied %(Highest range)",
        "Admin Fee (Highest range)",
        "Applied Service Charge %",
        "Service Charge",
        "Comment",
        "Action"
        ]}

        content={mockData.map((organisation, index) => (
          <Link href={`/superadmin/commission/${organisation.organisation}`} key={index}>
          
            <tr className="" >
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {index + 1}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.organisation}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.organisationIdNo}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.Appliedlowest}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.AdminFeeLowest} 
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.Apliedhigest}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.AdminFeeHiest}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.AppliedServiceCharge}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.serviceCharge}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.comment}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                

                  
                </td>

               
            </tr>
            </Link>
        ))}
      />
      </section>
        </div>
    )
}
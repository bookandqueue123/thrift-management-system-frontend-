'use client'
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { DashboardCard } from "@/components/Cards";
import TransactionsTable from "@/components/Tables";
import Link from "next/link";
import { CiExport } from "react-icons/ci";


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

  const customerMockData = [
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
export default function SuperAdminDashboard(){
    return(
        <div>
           <div className="mb-4 space-y-2">
              <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
                Dashboard
              </p>
              <p className="text-white">Welcome, Raoatech Technologies</p>
            </div>

            <section className="mb-12 mt-6 flex flex-col gap-y-4 md:flex-row md:items-stretch md:gap-x-4 md:gap-y-0">
       
            <DashboardCard
          illustrationName="user"
          topValue={
            <p className="text-sm font-semibold text-ajo_offWhite">
              Total Organisations
            </p>
          }
           bottomValueBottomText={"24"}
        />
        <DashboardCard
          illustrationName="user"
          topValue={
            <p className="text-sm font-semibold text-ajo_offWhite">
              Total Customers
            </p>
          }
           bottomValueBottomText={"2"}
        />
      </section>

            <section>
        

          <div className="">
            <p className="text-white text-xl">Organisation List</p>
          </div>
          <div className="mb-4 flex justify-end">
            <Link href={"/superadmin/organisation"}>
             <button className="text-[#EAAB40] text-sm"><u>See more</u></button>
            </Link>
          </div>

      <TransactionsTable
        headers={[
        "S/N",
        "Organisation Name",
        "Organisation ID",
        "Total Number of Customers",
        "Registration Date",
        "Action"
        ]}

        content={mockData.map((organisation, index) => (
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {index}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.organisation_name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.organization_id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.total_customers} customers
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.registration_day}
                </td>
                <td className="mb-8 whitespace-nowrap px-6 py-4 text-sm">
                    
                </td>
            </tr>
        ))}
      />

      <div className="pb-12">
      <div className="mt-12">
            <p className="text-white text-xl">Customer List</p>
          </div>
          <div className="mb-4 flex justify-end">
            <Link href={"/superadmin/customers"}>
             <button className="text-[#EAAB40] text-sm"><u>See more</u></button>
            </Link>
           
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

        content={customerMockData.map((customer, index) => (
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.Customer_Name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.Account_Created_on}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.Email_Address}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.Phone_Number} customers
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.State}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.LGA}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.Organisation}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    
                </td>
            </tr>
        ))}
        />
      </div>
      </section>
        </div>
    )
}
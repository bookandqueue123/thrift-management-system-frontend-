'use client'
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { DashboardCard } from "@/components/Cards";
import TransactionsTable from "@/components/Tables";
import { customer, getOrganizationProps } from "@/types";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3;
  const { client } = useAuth();
  const [filteredOrganisations, setFilteredOrganisations] = useState<getOrganizationProps[]>([])
  const [filteredCustomers, setFilteredCustomer] = useState<customer[]>([]);
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
  const paginatedOrganisations = filteredOrganisations?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  
 
  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
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
          console.log(error);
          throw error;
        });
    },
  });
  
  const paginatedCustomers = filteredCustomers?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allCustomers) {
    totalPages = Math.ceil(allCustomers.length / PAGE_SIZE);
  }


  

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
            "Account Number",
            "email",
            "Organisation ID",
            "Total Number of Customers",
            "Registration Date",
            "Action"
            ]}

        content={paginatedOrganisations.map((organisation, index) => (
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
                    {organisation._id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    --- customers
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {extractDate(organisation.createdAt)} 
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    
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

        content={paginatedCustomers.map((customer, index) => (
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.firstName} {customer.lastName}
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
                    {customer.organisation}
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
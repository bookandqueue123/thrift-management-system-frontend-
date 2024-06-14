'use client'
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { DashboardCard } from "@/components/Cards";
import CustomerAction from "@/components/CustomerAction";
import TransactionsTable from "@/components/Tables";
import OrganisationAction from "@/modules/merchant/OrganisationAction";
import { customer, getOrganizationProps } from "@/types";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useState } from "react";
import { CiExport } from "react-icons/ci";



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
           bottomValueBottomText={organizations ? organizations.length: 0}
        />
        <DashboardCard
          illustrationName="user"
          topValue={
            <p className="text-sm font-semibold text-ajo_offWhite">
              Total Customers
            </p>
          }
           bottomValueBottomText={allCustomers ? String(allCustomers.length) : String(0)}
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
            // "Organisation ID",
            // "Total Number of Customers",
            "Registration Date",
            "Action"
            ]}

        content={paginatedOrganisations.map((organisation, index) => (
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {index}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.organisationName || "---"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.accountNumber || "---"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.email || "---"}
                </td>
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation._id}
                </td> */}
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                    --- customers
                </td> */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {extractDate(organisation.createdAt) || "---"} 
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                <OrganisationAction
                  index={index}
                  organisationId={organisation._id}
                  />
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
                    {customer.firstName || '---'} {customer.lastName || "---"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {extractDate(customer.createdAt) || "---"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.email || "---"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.phoneNumber || "---"} 
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.state || "---"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.lga || "---"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.organisation || "---"}
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
      </div>
      </section>
        </div>
    )
}
"use client";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
// import DummyCustomers from "@/api/dummyCustomers.json";
import { client } from "@/api/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { customer } from "@/types";
import { AxiosError, AxiosResponse } from "axios";
import { formatToDateAndTime } from "@/utils/TimeStampFormatter";
import { StatusIndicator } from "@/components/StatusIndicator";
import { SetStateAction, useState } from "react";

const Customers = () => {
  const [openDropdown, setOpenDropdown] = useState<number>(0);

  const toggleDropdown = (val: number) => {
    console.log("value: ", val);
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  console.log("openDropdown: ", openDropdown);
  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get("/api/user?role=customer", {})
        .then((response: AxiosResponse<customer[], any>) => {
          console.log(response);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error);
        });
    },
  });

  const AddCustomer = () => {};
  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Customers
        </p>
      </div>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <SearchInput />
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
            label="Create New Customer"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={AddCustomer}
          />
        </div>

        <div>
          <TransactionsTable
            headers={[
              "Customer Name",
              "Account Created On",
              "Email Address",
              "Phone Number",
              "State",
              "Local Govt Area",
              "Action",
            ]}
            content={allCustomers?.map((customer, index) => (
              <tr className="" key={index + 1}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.firstName + " " + customer.lastName || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {formatToDateAndTime(customer.createdAt) || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.email || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.phoneNumber || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.state || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.lga || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator
                    label={`Actions`}
                    clickHandler={() => {
                      setOpenDropdown(index + 1);
                      if (index + 1 === openDropdown) {
                        toggleDropdown(openDropdown);
                      } else {
                        toggleDropdown(index + 1);
                      }
                    }}
                    dropdownEnabled
                    dropdownContents={{
                      labels: [
                        "View Customer",
                        "Edit Customer",
                        "Savings Settings",
                        "Disable/Enable",
                      ],
                      actions: [
                        () => {
                          console.log("View Customer");
                        },
                        () => {
                          console.log("Edit Customer");
                        },
                        () => {
                          console.log("Savings Settings");
                        },
                        () => {
                          console.log("Disable/Enable");
                        },
                      ],
                    }}
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    currentIndex={index + 1}
                  />
                </td>
              </tr>
            ))}
          />
          {/* <PaginationBar apiResponse={allCustomers !== undefined && allCustom} /> */}
        </div>
      </section>
    </>
  );
};

export default Customers;

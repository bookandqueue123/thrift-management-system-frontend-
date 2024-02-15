"use client"
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import DummyCustomers from "@/api/dummyCustomers.json";

const Customers = () => {
  const AddCustomer = () => {
    
  }
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
            ]}
            content={DummyCustomers.map((customer, index) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.created_At}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.phone}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.state}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.local_govt}
                </td>
              </tr>
            ))}
          />
          <PaginationBar apiResponse={DummyCustomers} />
        </div>
      </section>
    </>
  );
};

export default Customers;

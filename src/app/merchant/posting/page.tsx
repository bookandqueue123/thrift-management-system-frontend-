"use client";
import { FilterDropdown, CustomButton } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { StatusIndicator } from "@/app/customer/page";
import DummyCustomers from "@/api/dummyCustomers.json";
import Modal from "@/components/Modal";
import { useState } from "react";

const Posting = () => {
  const [modalState, setModalState] = useState(false);
  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Posting
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
            label="Post Payment"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => setModalState(true)}
          />
          {modalState && (
            <Modal setModalState={setModalState} title="Post Payment">
              <PostingForm />
            </Modal>
          )}
        </div>

        <div>
          <TransactionsTable
            headers={[
              "Customer Name",
              "Transaction ID",
              "Email Address",
              "Phone Number",
              "State",
              "Local Govt Area",
              "Action",
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
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator label={"Add Details"} />
                </td>
              </tr>
            ))}
          />
          {/* <PaginationBar apiResponse={DummyCustomers} /> */}
        </div>
      </section>
    </>
  );
};

export default Posting;

const PostingForm = () => {
  return (
    <form className="mx-auto h-full w-[75%] space-y-3">
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="acc-number"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Account Number:
        </label>
        <input
          id="acc-number"
          name="acc-number"
          type="text"
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
        />
      </div>
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="amount"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Amount:
        </label>
        <input
          id="amount"
          name="amount"
          type="text"
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
        />
      </div>
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="purpose"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Purpose:
        </label>
        <select
          id="purpose"
          name="purpose"
          className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] "
          defaultValue={"Select a category"}
        >
          <option disabled defaultValue={"Filter"} className="hidden">
            Select a category
          </option>
          <option>Education</option>
          <option>Business</option>
          <option>Emergency</option>
          <option>Medical</option>
        </select>
      </div>
      <div className="items-center gap-6  md:flex">
        <label
          htmlFor="check-group"
          className="m-0 w-[16%] text-xs font-medium text-white"
        >
          Is this payment for today?
        </label>
        <div id="check-group" className="flex items-center w-[80%] gap-8 my-3 justify-start">
          <span className="flex items-center gap-2">
            <input
              id="yes"
              name="payment"
              type="radio"
              className="border-1 h-4 w-4 border-ajo_offWhite bg-transparent cursor-pointer"
            />
            <label
              htmlFor="yes"
              className="m-0 whitespace-nowrap text-sm font-medium text-ajo_offWhite cursor-pointer"
            >
              Yes
            </label>
          </span>
          <span className="flex items-center gap-2">
            <input
              id="no"
              name="payment"
              type="radio"
              className="border-1 h-4 w-4 border-ajo_offWhite bg-transparent cursor-pointer"
            />
            <label
              htmlFor="no"
              className="m-0 whitespace-nowrap text-sm font-medium text-ajo_offWhite cursor-pointer"
            >
              No
            </label>
          </span>
        </div>
      </div>
      <p className="text-sm text-ajo_offWhite text-opacity-60">
        Payment Coverage Tenure (Kindly select the date range this payment is to
        cover)
      </p>
      <div className="flex w-full items-center justify-between gap-x-8">
        <div className="w-[50%] items-center gap-6 md:flex md:w-[60%]">
          <label
            htmlFor="start-date"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white md:w-[40%]"
          >
            Start Date:
          </label>
          <input
            id="start-date"
            name="start-date"
            type="date"
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
        </div>
        <div className="w-[50%] items-center gap-6 md:flex md:w-[40%]">
          <label
            htmlFor="end-date"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
          >
            End Date:
          </label>
          <input
            id="end-date"
            name="end-date"
            type="date"
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
        </div>
      </div>
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="payment-mode"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Payment Mode:
        </label>
        <select
          id="payment-mode"
          name="payment-mode"
          className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] "
          defaultValue={"Select a category"}
        >
          <option disabled defaultValue={"Filter"} className="hidden">
            Select a category
          </option>
          <option>Online</option>
          <option>Cash</option>
        </select>
      </div>
      <div className="items-center gap-6 md:flex pb-4">
        <label
          htmlFor="narration"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Narration:
        </label>
        <textarea
          id="narration"
          name="narration"
          rows={3}
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-sm text-[#7D7D7D]"
        ></textarea>
      </div>
      <div className="flex items-center">
        <span className="invisible w-[20%]">Submit</span>
        <div className="flex md:w-[80%] justify-center">
          <CustomButton
            type="button"
            label="Submit"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
            onButtonClick={() => {}}
          />
        </div>
      </div>
    </form>
  );
};

"use client";
import { FilterDropdown, CustomButton } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { StatusIndicator } from "@/components/StatusIndicator";
// import DummyCustomers from "@/api/dummyCustomers.json";
import Modal from "@/components/Modal";
import { Dispatch, SetStateAction, useState } from "react";

const Posting = () => {
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [postDetails, setPostDetails] = useState({
    name: "Ayoleyi Lurogho",
    transaction_id: "RTUU653167F  ",
    email: "ayolurogho@gamil.com",
    phone: "08102914133",
    state: "Ogun State",
    local_govt: "Abeokuta",
  });

  const DummyCustomers: (typeof postDetails)[] = [];

  DummyCustomers.push(postDetails);
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
            onButtonClick={() => {
              setModalState(true);
              setModalContent("form");
            }}
          />
          {modalState && (
            <Modal
              setModalState={setModalState}
              title={modalContent === "confirmation" ? "" : "Post Payment"}
            >
              {modalContent === "confirmation" ? (
                <PostConfirmation />
              ) : (
                <PostingForm
                  onSubmit={setModalContent}
                  formState={postDetails}
                  updateFormState={setPostDetails}
                />
              )}
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
                  {customer.transaction_id}
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
                  <StatusIndicator label={"View Details"} />
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

const PostingForm = ({
  onSubmit,
  formState,
  updateFormState,
}: {
  onSubmit: Dispatch<SetStateAction<"form" | "confirmation">>;
  formState: Object;
  updateFormState: Dispatch<
    SetStateAction<{
      name: string;
      transaction_id: string;
      email: string;
      phone: string;
      state: string;
      local_govt: string;
    }>
  >;
}) => {
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    updateFormState((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = () => {
    console.log(formState);
    onSubmit("confirmation");
  };
  return (
    <form className="mx-auto w-[75%] space-y-3" onSubmit={onSubmitHandler}>
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
        <div
          id="check-group"
          className="my-3 flex w-[80%] items-center justify-start gap-8"
        >
          <span className="flex items-center gap-2">
            <input
              id="yes"
              name="payment"
              type="radio"
              className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
              onChange={handleChange}
            />
            <label
              htmlFor="yes"
              className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium text-ajo_offWhite"
            >
              Yes
            </label>
          </span>
          <span className="flex items-center gap-2">
            <input
              id="no"
              name="payment"
              type="radio"
              className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
              onChange={handleChange}
            />
            <label
              htmlFor="no"
              className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium text-ajo_offWhite"
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
            onChange={handleChange}
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
            onChange={handleChange}
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
      <div className="items-center gap-6 pb-4 md:flex">
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
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="flex items-center">
        <span className="invisible w-[20%]">Submit</span>
        <div className="flex justify-center md:w-[80%]">
          <CustomButton
            type="button"
            label="Submit"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
            onButtonClick={onSubmitHandler}
          />
        </div>
      </div>
    </form>
  );
};

const PostConfirmation = () => {
  const accountNumber = "0230533122";
  const amount = "5000 NGN";
  const time = "09:09:27 PM";
  const purpose = "Daily Savings";
  const payment = "Payment is for today";
  const startDate = "12/04/2023";
  const endDate = "12/04/2023";
  const paymentMode = "Cash";
  const narration = "Upkeep Money";
  const status = "Payment Successful";

  return (
    <div className="mx-auto h-full w-[75%] bg-ajo_offWhite py-8">
      <p className="mb-8 text-center text-3xl font-bold text-black">Posting</p>
      <div className="space-y-4">
        {" "}
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Account Number:
          </p>
          <p className="text-sm text-[#7D7D7D]">{accountNumber}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Amount:</p>
          <p className="text-sm text-[#7D7D7D]">{amount}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Time:</p>
          <p className="text-sm text-[#7D7D7D]">{time}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Purpose:</p>
          <p className="text-sm text-[#7D7D7D]">{purpose}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Payment:</p>
          <p className="text-sm text-[#7D7D7D]">{payment}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Start Date:</p>
          <p className="text-sm text-[#7D7D7D]">{startDate}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">End Date:</p>
          <p className="text-sm text-[#7D7D7D]">{endDate}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Payment Mode:</p>
          <p className="text-sm text-[#7D7D7D]">{paymentMode}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Narration:</p>
          <p className="text-sm text-[#7D7D7D]">{narration}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Status:</p>
          <p className="text-sm font-semibold text-successText">{status}</p>
        </div>
      </div>
      <div className="mx-auto my-8 flex items-center justify-center gap-x-8 px-8 md:w-[50%]">
        <CustomButton
          type="button"
          label="Download"
          style="rounded-md bg-ajo_offWhite border border-ajo_blue py-3 px-9 text-sm text-ajo_blue hover:text-ajo_offWhite focus:text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 w-1/2"
          // onButtonClick={() => onSubmit("confirmation")}
        />
        <CustomButton
          type="button"
          label="Share"
          style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 w-1/2"
          // onButtonClick={() => onSubmit("confirmation")}
        />
      </div>
      <div className="bg-ajo_orange px-8 py-4">
        <p className="text-center text-xs font-medium text-ajo_offWhite">
          For further enquiries and assistance kindly send a mail
          ajo@raoatech.com or call +23497019767
        </p>
      </div>
    </div>
  );
};

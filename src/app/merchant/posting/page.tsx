"use client";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
// import DummyCustomers from "@/api/dummyCustomers.json";
import { client } from "@/api/hooks/useAuth";
import Modal from "@/components/Modal";
import { customer, postSavingsResponse, setSavingsResponse } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useState } from "react";

const Posting = () => {
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [postingResponse, setPostingResponse] = useState<postSavingsResponse>();
  // console.log("postingResponse: ",postingResponse);

  // const DummyCustomers: (typeof postDetails)[] = [];

  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
    queryKey: ["allCustomers"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get("/api/user?role=customer", {})
        .then((response: AxiosResponse<customer[], any>) => {
          console.log("allCustomersSuccess: ", response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error.response);
        });
    },
  });

  // allCustomers.push(postDetails);
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
                <PostConfirmation postingResponse={postingResponse} />
              ) : (
                <PostingForm
                  onSubmit={setModalContent}
                  Customers={allCustomers}
                  setPostingResponse={setPostingResponse}
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
            content={allCustomers?.map((customer, index) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.firstName + " " + customer.lastName || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {/* {customer.transaction_id || "----"} */}
                  {customer._id || "-----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.phoneNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.state || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.lga || "----"}
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
  Customers,
  setPostingResponse,
}: {
  onSubmit: Dispatch<SetStateAction<"form" | "confirmation">>;
  Customers: void | customer[] | undefined;
  setPostingResponse: Dispatch<SetStateAction<postSavingsResponse | undefined>>;
}) => {
  // TODO remove the organization ID later
  const organizationID = "65d06c2886b396b76ebb736d";
  const [postDetails, setPostDetails] = useState({
    customerId: "",
    purposeName: "",
    amount: 15000,
    startDate: "",
    endDate: "",
    collectionDate: "",
    organisation: "",
    frequency: "daily",
    savingId: "",
    paymentMode: "",
    narrative: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setPostDetails((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: setSavings, isPending: isSettingSavings } = useMutation({
    mutationFn: async () => {
      return client.post(
        `/api/saving/${postDetails.customerId?.split(":")[1]?.trim()}`,
        {
          purposeName: postDetails.purposeName,
          amount: Number(postDetails.amount),
          startDate: postDetails.startDate,
          endDate: postDetails.endDate,
          collectionDate: postDetails.collectionDate,
          organisation: postDetails.organisation || organizationID,
          frequency: postDetails.frequency,
        },
      );
    },
    onSuccess(response: AxiosResponse<setSavingsResponse, any>) {
      setPostDetails((prev) => ({ ...prev, savingId: response.data.id }));
      console.log(response.data);
    },
    onError(error: AxiosError<any, any>) {
      console.log(error.response);
    },
  });

  const { mutate: postSavings } = useMutation({
    mutationFn: async () => {
      return client.post(
        `/api/saving/${postDetails.customerId?.split(":")[1]?.trim()}/${postDetails.savingId}`,
        {
          paidDays: {
            dates: [postDetails.startDate, postDetails.endDate],
            amount: postDetails.amount,
          },
          paymentMode: postDetails.paymentMode,
          narrative: postDetails.narrative,
          purposeName: postDetails.purposeName,
          amount: Number(postDetails.amount),
          startDate: postDetails.startDate,
          endDate: postDetails.endDate,
        },
      );
    },
    onSuccess(response: AxiosResponse<postSavingsResponse, any>) {
      setPostingResponse(response.data);
      console.log(response.data);
    },
    onError(error: AxiosError<any, any>) {
      console.log(error.response);
    },
  });

  const onSubmitHandler = () => {
    console.log(postDetails);
    setSavings();
    !isSettingSavings && postSavings();
    onSubmit("confirmation");
  };
  return (
    <form className="mx-auto w-[85%] space-y-3" onSubmit={onSubmitHandler}>
      {/* <div className="items-center gap-6 md:flex">
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
      </div> */}
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="customerId"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Customer ID:
        </label>
        <select
          id="customerId"
          name="customerId"
          className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
          // defaultValue={"Select a user"}
          onChange={handleChange}
          required
        >
          <option defaultValue={"Select a user"} className="hidden">
            Select a user
          </option>
          {Customers?.map((customer: customer) => {
            return (
              <>
                <option key={customer._id} className="capitalize">
                  {customer.firstName +
                    " " +
                    customer.lastName +
                    ":  " +
                    customer._id}
                </option>
              </>
            );
          })}
        </select>
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
          required
        />
      </div>
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="purposeName"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Purpose:
        </label>
        <select
          id="purposeName"
          name="purposeName"
          className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] "
          defaultValue={"Select a category"}
          onChange={handleChange}
          required
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
              name="todayPayment"
              type="radio"
              className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
              onChange={handleChange}
              required
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
              name="todayPayment"
              type="radio"
              className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
              onChange={handleChange}
              required
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
            htmlFor="startDate"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white md:w-[40%]"
          >
            Start Date:
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-[50%] items-center gap-6 md:flex md:w-[40%]">
          <label
            htmlFor="endDate"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
          >
            End Date:
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="paymentMode"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Payment Mode:
        </label>
        <select
          id="paymentMode"
          name="paymentMode"
          className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 capitalize text-[#7D7D7D]"
          defaultValue={"Select a category"}
          onChange={handleChange}
          required
        >
          <option disabled defaultValue={"Filter"} className="hidden">
            Select a category
          </option>
          <option className="capitalize">online</option>
          <option className="capitalize">cash</option>
        </select>
      </div>
      <div className="items-center gap-6 pb-4 md:flex">
        <label
          htmlFor="narrative"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Narration:
        </label>
        <textarea
          id="narrative"
          name="narrative"
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

const PostConfirmation = ({
  postingResponse,
}: {
  postingResponse: postSavingsResponse | undefined;
}) => {
  const postingCreation: string | undefined = Date();
  const formattedPostingDate = new Date(postingCreation);
  const timeOfPosting = formattedPostingDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format
    timeZone: "UTC",
  });

  const postingStartDate: string | undefined = Date();
  const formattedPostingStartDate = new Date(postingStartDate);
  const formattedStartDate = formattedPostingStartDate.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  );

  const postingEndDate: string | undefined = Date();
  const formattedPostingEndDate = new Date(postingEndDate);
  const formattedEndDate = formattedPostingEndDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (
    <div className="mx-auto h-full w-[75%] bg-ajo_offWhite py-8">
      <p className="mb-8 text-center text-3xl font-bold text-black">Posting</p>
      <div className="space-y-4">
        {" "}
        {/* <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Account Number:
          </p>
          <p className="text-sm text-[#7D7D7D]">{postingResponse.}</p>
        </div> */}
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Amount:</p>
          <p className="text-sm text-[#7D7D7D]">
            {postingResponse?.amount} NGN
          </p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Time:</p>
          <p className="text-sm text-[#7D7D7D]">{timeOfPosting}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Purpose:</p>
          <p className="text-sm capitalize text-[#7D7D7D]">
            {postingResponse?.purposeName}
          </p>
        </div>
        {/* <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Payment:</p>
          <p className="text-sm text-[#7D7D7D]">{postingResponse.}</p>
        </div> */}
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Start Date:</p>
          <p className="text-sm text-[#7D7D7D]">{formattedStartDate}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">End Date:</p>
          <p className="text-sm text-[#7D7D7D]">{formattedEndDate}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Payment Mode:</p>
          <p className="text-sm text-[#7D7D7D]">
            {postingResponse?.paymentMode}
          </p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Narration:</p>
          <p className="text-sm text-[#7D7D7D]">{postingResponse?.narrative}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Status:</p>
          <p className="text-sm font-semibold text-successText">
            Payment Successful
          </p>
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

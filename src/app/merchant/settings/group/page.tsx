"use client";
import { CustomButton } from "@/components/Buttons";
import Modal from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DummyGroups from "@/api/dummyGroups.json";
import Image from "next/image";
import { MultiSelectDropdown } from "@/components/Dropdowns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/api/hooks/useAuth";
import { customer, postSavingsResponse } from "@/types";
import { AxiosError, AxiosResponse } from "axios";

const GroupSettings = () => {
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [postingResponse, setPostingResponse] = useState<postSavingsResponse>();
  const [postingMessage, setPostingMessage] = useState()
  return (
    <>
      <div className="">
        <div className="mb-4 space-y-2 ">
          <p className="text-2xl font-bold text-ajo_offWhite text-opacity-60">
            Settings
          </p>
          <p className="text-sm font-bold text-ajo_offWhite">Group settings</p>
        </div>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <CustomButton
            type="button"
            label="Create group"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
              setModalState(true);
              setModalContent("form");
            }}
          />
          {modalState && (
            <Modal 
            setModalState={setModalState} 
            title={modalContent === "confirmation" ? "" : "Create a Group"}>
              {modalContent === "confirmation" ? (
                <PostConfirmation
                postingMessage={postingMessage}
                postingResponse={postingResponse}
                status={postingResponse?.status}
              />
              ): (
                <CreateGroupForm 
                postingMessage={setPostingMessage}
                onSubmit={setModalContent}
                setPostingResponse={setPostingResponse}
                />
              )}
              
            </Modal>
          )}
        </div>
        <section>
          <div>
            <p className="mb-3 pl-2 text-base font-semibold text-ajo_offWhite">
              Existing Group List
            </p>
            <TransactionsTable
              headers={[
                "Group Name",
                "Account Name",
                "Account Number",
                "Bank Name",
                "Group Type",
                "Total Group Number",
                "Action",
              ]}
              content={DummyGroups.groups.map((group, index) => (
                <tr className="" key={index}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.groupName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.accountName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.accountNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.bankName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.groupType}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {group.totalMembers}
                  </td>
                  <td className="flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                    <Image
                      src="/pencil.svg"
                      alt="pencil"
                      width={20}
                      height={20}
                      onClick={() => {}}
                      className="cursor-pointer"
                    />
                    <Image
                      src="/trash.svg"
                      alt="pencil"
                      width={20}
                      height={20}
                      onClick={() => {}}
                      className="cursor-pointer"
                    />
                    <Image
                      src="/archive.svg"
                      alt="pencil"
                      width={20}
                      height={20}
                      onClick={() => {}}
                      className="cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            />
            <PaginationBar apiResponse={DummyGroups.groups} />
          </div>
        </section>
      </div>
    </>
  );
};

export default GroupSettings;

interface iCreateGroupProps{
  onSubmit: Dispatch<SetStateAction<"form" | "confirmation">>;
  postingMessage: any;
  setPostingResponse: Dispatch<SetStateAction<postSavingsResponse | undefined>>;
}
const CreateGroupForm = ({
  onSubmit, 
  postingMessage,
  setPostingResponse,
}: iCreateGroupProps) => {
  
  const [selectedOptions, setSelectedOptions] = useState<customer[]>([]);
  const handleOptionChange = (e:React.ChangeEvent<HTMLSelectElement> ) => {
    const selectedId = e.target.value;
    const selectedOption = users?.find(option => option._id === selectedId);
    if (!selectedOptions.some(option => option._id === selectedOption?._id)) {
      setSelectedOptions([...selectedOptions, selectedOption!]);
    }
  };
  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions.splice(index, 1);
    setSelectedOptions(updatedOptions);
  };
  

  const [createGroup, setCreateGroup] = useState({
    groupType: "named group",
    purposeName: "",
    amount: "",
    startDate: "",
    endDate: "",
    collectionDate: "",
    frequency: "",
    groupName: ""
  });

  const {data: users, isLoading: isUserLoading, isError} = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      return client
        .get(`/api/user?organisation=65ca01a52c8fabbc92aed513&userType=individual`, {})
        .then((response: AxiosResponse<customer[], any>) => {
          console.log(response.data)
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
    }
  })
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    console.log(value);
    setCreateGroup((prev) => ({ ...prev, [name]: value }));
  };


  const selectedIds = selectedOptions.map(option => option._id);
    // console.log('Selected IDs:', selectedIds);

  const {mutate: createGroups, isPending: isCreatingGroup, isError: createGroupError} = useMutation({
    mutationKey: ["create Group"],
    mutationFn: async () => {
      return client.post(`/api/user/create-group`, {
        groupName: createGroup.groupName,
        groupMember: selectedIds,
        organisation: "65ca01a52c8fabbc92aed513"
      })
    },

    onSuccess(response) {
      console.log(response);
      
      setPostingResponse(response.data)
      setPostingResponse(
        (prev) =>
          ({
            ...prev,
            ["status"]: "success",
          }) as postSavingsResponse,
      );
      console.log("yes")
      return response.data;
    },
    onError(error: any) {
      setPostingResponse(error.response.data!)
      
      setPostingResponse(
        (prev) =>
          ({
            ...prev,
            ["status"]: "failed",
          }) as postSavingsResponse,
      );
      console.log(error);
      throw error;
    },
  })
  const onSubmitHandler = () => {
    
    console.log(createGroup);
    createGroups()
    // postSavings();
    onSubmit("confirmation");
  };

  useEffect(() => {
    if (isError) {
      // Handle error
      console.error('Error fetching users');
    }
  }, [isError]);
  return (
    <form
      className="mx-auto mt-12 w-[90%] space-y-3 md:w-[60%]"
      onSubmit={onSubmitHandler}
    >
      {/* <div className="items-center gap-6  md:flex">
        <label
          htmlFor="check-group"
          className="m-0 w-[16%] text-xs font-medium text-white"
        >
          Group Type
        </label>
        <div
          id="check-group"
          className="my-3 flex w-[80%] items-center justify-start gap-8"
        >
          <span className="flex items-center gap-2">
            <input
              id="named group"
              name="groupType"
              type="radio"
              className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
              onChange={() => {
                setCreateGroup((prev) => ({
                  ...prev,
                  ["groupType"]: "named group",
                }));
              }}
              checked={createGroup.groupType === "named group"}
              required
            />
            <label
              htmlFor="named group"
              className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
            >
              named group
            </label>
          </span>
          <span className="flex items-center gap-2">
            <input
              id="nameless group"
              name="groupType"
              type="radio"
              className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
              onChange={() => {
                setCreateGroup((prev) => ({
                  ...prev,
                  ["groupType"]: "nameless group",
                }));
              }}
              required
              checked={createGroup.groupType === "nameless group"}
            />
            <label
              htmlFor="nameless group"
              className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
            >
              unnamed group
            </label>
          </span>
        </div>
      </div> */}
      {createGroup.groupType === "named group" && (
        <>
          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="groupName"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Group Name:
            </label>
            <input
              id="groupName"
              name="groupName"
              type="text"
              placeholder="E.g 1million Goal"
              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              onChange={handleChange}
              required
            />
          </div>
          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="groupDescription"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Group description:
            </label>
            <input
              id="groupDescription"
              name="groupDescription"
              type="text"
              placeholder="Describe..."
              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              onChange={handleChange}
              required
            />
          </div>
          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="savingsPurpose"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Savings Purpose:
            </label>
            <input
              id="savingsPurpose"
              name="savingsPurpose"
              type="text"
              placeholder="Purpose...."
              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}
      {/* <MultiSelectDropdown
        options={users || []}
        label="Add Customers: "
        placeholder="Choose customers"
      /> */}

      <div className="items-center gap-6 md:flex">

        <label
          htmlFor="addCustomers"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Add Customers
        </label>

        <div className="w-full">
          <select
            className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
            onChange={handleOptionChange}
          >
            <option value="">Select an option</option>
            {users?.map((option) => (
              <option key={option._id} value={option._id}>{option.firstName} {option.lastName}</option>
            ))}
          </select>

          
          
          <div className="space-x-1 space-y-2">
            {selectedOptions.map((option, index) => (
              <div key={index} className="inline-block mr-2 mb-2">
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm"
                >
                  {option.firstName} {option.lastName}
                  <svg
                    className="ml-1 h-3 w-3 text-gray-700 cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="flex items-center justify-center pb-12 pt-4">
        <span className="hidden w-[20%] md:block">Submit</span>
        <div className="md:flex md:w-[80%] md:justify-center">
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
  status,
  postingMessage
}: {
  postingResponse: postSavingsResponse | undefined;
  status: "success" | "failed" | undefined;
  postingMessage: any;
}) => {
  const postingCreation: string | undefined = Date();
  const formattedPostingDate = new Date(postingCreation);
  const timeOfPosting = formattedPostingDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format
    timeZone: "UTC",
  });
console.log(postingResponse)
console.log(postingMessage)
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
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Transaction Id:
          </p>
          <p className="text-sm text-[#7D7D7D]">{postingResponse?._id}</p>
        </div>
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
          <p className="text-sm text-[#7D7D7D]">{postingResponse?.message}</p>
        </div>
        <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Status:</p>
          <p
            className={`text-sm font-bold ${status === "success" ? "text-successText" : "text-errorText"}`}
          >
            {status === "success" ? "Posting Successful" : "Posting Failed"}
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


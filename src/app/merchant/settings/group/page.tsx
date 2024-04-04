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
import { useAuth } from "@/api/hooks/useAuth";
import { customer, postSavingsResponse } from "@/types";
import { AxiosError, AxiosResponse } from "axios";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";

const GroupSettings = () => {
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [postingResponse, setPostingResponse] = useState<postSavingsResponse>();
  const [postingMessage, setPostingMessage] = useState();

  const { client } = useAuth();

  const organizationId = useSelector(selectOrganizationId);

  const { data: allGroups, isLoading: isGettingAllGroups } = useQuery({
    queryKey: ["allgroups"],
    queryFn: async () => {
      return client
        .get(`/api/user?organisation=${organizationId}&userType=group`, {})
        .then((response) => {
          console.log("allGroups " + response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  });
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
              title={modalContent === "confirmation" ? "" : "Create a Group"}
            >
              {modalContent === "confirmation" ? (
                <PostConfirmation
                  postingMessage={postingMessage}
                  postingResponse={postingResponse}
                  status={postingResponse?.status}
                />
              ) : (
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
              content={
                isGettingAllGroups ? (
                  <p className="font-semibold text-sm text-ajo_offWhite">Loading...</p>
                ) : (
                  allGroups.map((group: any, index: any) => (
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
                  ))
                )
              }
            />
            <PaginationBar apiResponse={DummyGroups.groups} />
          </div>
        </section>
      </div>
    </>
  );
};

export default GroupSettings;

interface iCreateGroupProps {
  onSubmit: Dispatch<SetStateAction<"form" | "confirmation">>;
  postingMessage: any;
  setPostingResponse: Dispatch<SetStateAction<postSavingsResponse | undefined>>;
}

const CreateGroupForm = ({
  onSubmit,
  postingMessage,
  setPostingResponse,
}: iCreateGroupProps) => {
  const organizationId = useSelector(selectOrganizationId);
  console.log(organizationId);
  const { client } = useAuth();
  const [selectedOptions, setSelectedOptions] = useState<customer[]>([]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedOption = users?.find((option) => option._id === selectedId);
    if (!selectedOptions.some((option) => option._id === selectedOption?._id)) {
      setSelectedOptions([...selectedOptions, selectedOption!]);
    }
  };
  console.log(selectedOptions);

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions.splice(index, 1);
    setSelectedOptions(updatedOptions);
  };

  const {
    data: users,
    isLoading: isUserLoading,
    isError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      return client
        .get(`/api/user?organisation=${organizationId}&userType=individual`, {})
        .then((response: AxiosResponse<customer[], any>) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  const selectedIds = selectedOptions.map((option) => option._id);
  // console.log('Selected IDs:', selectedIds);

  const {
    mutate: createGroups,
    isPending: isCreatingGroup,
    isError: createGroupError,
  } = useMutation({
    mutationKey: ["create Group"],
    mutationFn: async (groupName: string) => {
      return client.post(`/api/user/create-group`, {
        groupName: groupName,
        groupMember: selectedOptions,
        organisation: organizationId,
      });
    },

    onSuccess(response) {
      setPostingResponse(response.data);
      setPostingResponse(
        (prev) =>
          ({
            ...prev,
            ["status"]: "success",
          }) as postSavingsResponse,
      );
      console.log("yes");
      return response.data;
    },
    onError(error: any) {
      setPostingResponse(error.response.data!);

      setPostingResponse(
        (prev) =>
          ({
            ...prev,
            ["status"]: "failed",
          }) as postSavingsResponse,
      );

      throw error;
    },
  });

  useEffect(() => {
    if (isError) {
      // Handle error
      console.error("Error fetching users");
    }
  }, [isError]);
  return (
    <Formik
      initialValues={{
        groupType: "named group",
        groupName: "",
        groupDescription: "",
        savingsPurpose: "",
        selectedCustomer: [],
      }}
      validationSchema={Yup.object({
        groupName: Yup.string().required("Group Name is required"),
        groupDescription: Yup.string().required(
          "Group Description is required",
        ),
        savingsPurpose: Yup.string().required("Savings Purpose is required"),
        selectedCustomers: Yup.array().min(
          1,
          "At least one customer must be selected",
        ),
      })}
      onSubmit={(values: { groupName: string }, { setSubmitting }) => {
        console.log(values);
        setTimeout(() => {
          setSubmitting(false);

          createGroups(values.groupName);

          // postSavings();
          onSubmit("confirmation");
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mx-auto mt-12 w-[90%] space-y-3 md:w-[60%]">
          {/** Group Name Field */}

          <div>
            <div className="items-center gap-6 md:flex">
              <label
                htmlFor="groupName"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                Group Name:
              </label>
              <Field
                id="groupName"
                name="groupName"
                type="text"
                placeholder="E.g 1million Goal"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>
            <div className="items-center gap-6 md:flex">
              <div className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"></div>
              <ErrorMessage
                name="groupName"
                component="div"
                className="w-full text-red-500"
              />
            </div>
          </div>

          {/** Group Description Field */}

          <div className="">
            <div className="items-center gap-6 md:flex">
              <label
                htmlFor="groupDescription"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                Group description:
              </label>

              <Field
                id="groupDescription"
                name="groupDescription"
                type="text"
                placeholder="Describe..."
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>
            <div className="items-center gap-6 md:flex">
              <div className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"></div>
              <ErrorMessage
                name="groupDescription"
                component="div"
                className="w-full text-red-500"
              />
            </div>
          </div>

          {/** Savings Purpose Field */}
          <div>
            <div className="items-center gap-6 md:flex">
              <label
                htmlFor="savingsPurpose"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                Savings Purpose:
              </label>
              <Field
                id="savingsPurpose"
                name="savingsPurpose"
                type="text"
                placeholder="Purpose...."
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>
            <div className="items-center gap-6 md:flex">
              <div className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"></div>
              <ErrorMessage
                name="savingsPurpose"
                component="div"
                className="w-full text-red-500"
              />
            </div>
          </div>

          {/* Add Customers Field */}
          {/* Add Customers Field */}
          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="addCustomers"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Add Customers
            </label>
            <div className="w-full">
              <select
                className="bg-right-20 mt-1 w-full cursor-pointer appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                onChange={handleOptionChange}
              >
                <option value="">Select an option</option>
                {users?.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.firstName} {option.lastName}
                  </option>
                ))}
              </select>

              <div className="space-x-1 space-y-2">
                {selectedOptions.map((option, index) => (
                  <div key={index} className="mb-2 mr-2 inline-block">
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm"
                    >
                      {option.firstName} {option.lastName}
                      <svg
                        className="ml-1 h-3 w-3 cursor-pointer text-gray-700"
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
              <Field
                name="selectedCustomers"
                as="input"
                type="hidden"
                value={selectedOptions.map((option) => option._id)}
              />
              <ErrorMessage
                name="selectedCustomers"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          {/** Submit Button */}
          <div className="flex items-center justify-center pb-12 pt-4">
            <span className="hidden w-[20%] md:block">Submit</span>
            <div className="md:flex md:w-[80%] md:justify-center">
              <button
                type="submit"
                className="rounded-md bg-ajo_blue px-9 py-3 text-sm text-ajo_offWhite hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const PostConfirmation = ({
  postingResponse,
  status,
  postingMessage,
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
    // <div className="mx-auto h-full w-[75%] bg-ajo_offWhite py-8">
    //   <p className="mb-8 text-center text-3xl font-bold text-black">{status === 'failed'  ? "Couldn't create group" : "Group Created Successfully"}</p>
    //   <div className="space-y-4">
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">
    //         Transaction Id:
    //       </p>
    //       <p className="text-sm text-[#7D7D7D]">{postingResponse?._id}</p>
    //     </div>
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">Amount:</p>
    //       <p className="text-sm text-[#7D7D7D]">
    //         {postingResponse?.amount} NGN
    //       </p>
    //     </div>
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">Time:</p>
    //       <p className="text-sm text-[#7D7D7D]">{timeOfPosting}</p>
    //     </div>
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">Purpose:</p>
    //       <p className="text-sm capitalize text-[#7D7D7D]">
    //         {postingResponse?.purposeName}
    //       </p>
    //     </div>
    //     {/* <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">Payment:</p>
    //       <p className="text-sm text-[#7D7D7D]">{postingResponse.}</p>
    //     </div> */}
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">Start Date:</p>
    //       <p className="text-sm text-[#7D7D7D]">{formattedStartDate}</p>
    //     </div>
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">End Date:</p>
    //       <p className="text-sm text-[#7D7D7D]">{formattedEndDate}</p>
    //     </div>
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">Payment Mode:</p>
    //       <p className="text-sm text-[#7D7D7D]">
    //         {postingResponse?.paymentMode}
    //       </p>
    //     </div>
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">Narration:</p>
    //       <p className="text-sm text-[#7D7D7D]">{postingResponse?.message}</p>
    //     </div>
    //     <div className="mx-auto flex items-center justify-between md:w-[40%]">
    //       <p className="text-sm font-semibold text-[#7D7D7D]">Status:</p>
    //       <p
    //         className={`text-sm font-bold ${status === "success" ? "text-successText" : "text-errorText"}`}
    //       >
    //         {status === "success" ? "Posting Successful" : "Posting Failed"}
    //       </p>
    //     </div>
    //   </div>
    //   <div className="mx-auto my-8 flex items-center justify-center gap-x-8 px-8 md:w-[50%]">
    //     <CustomButton
    //       type="button"
    //       label="Download"
    //       style="rounded-md bg-ajo_offWhite border border-ajo_blue py-3 px-9 text-sm text-ajo_blue hover:text-ajo_offWhite focus:text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 w-1/2"
    //       // onButtonClick={() => onSubmit("confirmation")}
    //     />
    //     <CustomButton
    //       type="button"
    //       label="Share"
    //       style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 w-1/2"
    //       // onButtonClick={() => onSubmit("confirmation")}
    //     />
    //   </div>
    //   <div className="bg-ajo_orange px-8 py-4">
    //     <p className="text-center text-xs font-medium text-ajo_offWhite">
    //       For further enquiries and assistance kindly send a mail
    //       ajo@raoatech.com or call +23497019767
    //     </p>
    //   </div>
    // </div>

    // /failed-icon-7.jpg
    // "/check-circle.svg"
    <div className="mx-auto mt-[10%] flex h-full w-1/2 flex-col items-center justify-center space-y-8">
      <h1 className="text-white">
        {" "}
        {status === "success"
          ? " Group Successfully Created"
          : "Unable to Create Group"}{" "}
      </h1>
      <Image
        src={status === "success" ? "/check-circle.svg" : "/failed-icon-7.jpg"}
        alt="check-circle"
        width={162}
        height={162}
        className="w-[6rem] md:w-[10rem]"
      />
      <p className="whitespace-nowrap text-ajo_offWhite">
        {postingResponse?.message}

        {/* {status === 'success' ? " Group Successfully Created" : 'Unable to Create Group'} */}
      </p>
      {/* <CustomButton
            type="button"
            label="Close"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[40%]"
            // onButtonClick={() => closeModal(false)}
          /> */}
    </div>
  );
};

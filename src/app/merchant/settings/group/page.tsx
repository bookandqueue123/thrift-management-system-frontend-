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
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { QueryObserverResult, RefetchOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/api/hooks/useAuth";
import { customer, postSavingsResponse } from "@/types";
import { AxiosError, AxiosResponse } from "axios";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { usePathname, useRouter } from "next/navigation";

const GroupSettings = () => {
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [postingResponse, setPostingResponse] = useState<postSavingsResponse>();
  const [postingMessage, setPostingMessage] = useState();

  const { client } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [modalToShow, setModalToShow] = useState<"edit" | "create" | "">("");
  const [groupToBeEdited, setGroupToBeEdited] = useState("");
  const [groupToBeEditedName, setGroupToBeEditedName] = useState("");
  const [groupToBeEditedMembers, setGroupToBeEditedMembers] = useState<
    string[]
  >([]);

  const organizationId = useSelector(selectOrganizationId);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: allGroups,
    isLoading: isGettingAllGroups,
    refetch: refetchAllGroups,
  } = useQuery({
    queryKey: ["allGroups"],
    queryFn: async () => {
      return client
        .get(`/api/user?organisation=${organizationId}&userType=group`, {})
        .then((response) => {
          // console.log("allGroups " + JSON.stringify(response.data));
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
    staleTime: 5000,
  });

  const { mutate: deleteGroup, isPending: isDeletingGroup } = useMutation({
    mutationKey: ["deleteGroup"],
    mutationFn: async (groupId: string) => {
      console.log("ID: ", groupId);
      return client.delete(`/api/user/${groupId}`);
    },
    onSuccess(response: AxiosResponse<any, any>) {
      setIsDeleted(true);
      setShowSuccessToast(true);
      setSuccessMessage(
        `${response.data.deletedUser.groupName} group has been deleted`,
      );
    },
    onError(error: AxiosError<any, any>) {
      setIsDeleted(false);
      console.error(error.response?.data.message ?? error.message);
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message);
    },
  });

  useEffect(() => {
    refetchAllGroups();
  }, [isDeleted, refetchAllGroups]);

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
              setModalToShow("create");
            }}
          />
          {modalState && (
            <Modal
              setModalState={setModalState}
              title={
                modalContent === "confirmation"
                  ? ""
                  : modalToShow === "create"
                    ? "Create a Group"
                    : "Edit Group"
              }
            >
              {modalContent === "confirmation" ? (
                <PostConfirmation
                  postingMessage={postingMessage}
                  postingResponse={postingResponse}
                  status={postingResponse?.status}
                />
              ) : (
                <CreateGroupForm
                  onSubmit={setModalContent}
                  setPostingResponse={setPostingResponse}
                  actionToTake={modalToShow}
                  groupToBeEdited={groupToBeEdited}
                  groupToBeEditedName={groupToBeEditedName}
                    groupToBeEditedMembers={groupToBeEditedMembers}
                    refetchAllGroups={refetchAllGroups}
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
              headers={["Group Name", "Total Group Number", "Action"]}
              content={
                isGettingAllGroups ? (
                  <p className="text-sm font-semibold text-ajo_offWhite">
                    Loading...
                  </p>
                ) : (
                  allGroups.map((group: any, index: any) => (
                    <tr className="" key={index}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {group.groupName || "----"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {group.groupMember.length || "----"}
                      </td>
                      <td className="flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                        <Image
                          src="/pencil.svg"
                          alt="pencil"
                          width={20}
                          height={20}
                          onClick={() => {
                            setModalToShow("edit");
                            setModalState(true);
                            setModalContent("form");
                            setGroupToBeEdited(group._id);
                            setGroupToBeEditedName(group.groupName);
                            setGroupToBeEditedMembers(group.groupMember);
                          }}
                          className="cursor-pointer"
                        />
                        <Image
                          src="/trash.svg"
                          alt="pencil"
                          width={20}
                          height={20}
                          onClick={() => deleteGroup(group._id)}
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

          {/* <SuccessToaster message="hey" /> */}
          {showSuccessToast && (
            <SuccessToaster
              message={successMessage ?? "Group Deletion Successful!"}
            />
          )}
          {showErrorToast && errorMessage && errorMessage && (
            <ErrorToaster
              message={errorMessage ? errorMessage : "Error Deleting Group"}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default GroupSettings;

interface iCreateGroupProps {
  onSubmit: Dispatch<SetStateAction<"form" | "confirmation">>;
  setPostingResponse: Dispatch<SetStateAction<postSavingsResponse | undefined>>;
  actionToTake: "create" | "edit" | "";
  groupToBeEdited?: string;
  groupToBeEditedName?: string;
  groupToBeEditedMembers?: string[];
  refetchAllGroups: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<any, Error>>;
}

const CreateGroupForm = ({
  onSubmit,
  setPostingResponse,
  actionToTake,
  groupToBeEdited,
  groupToBeEditedName,
  groupToBeEditedMembers,
  refetchAllGroups,
}: iCreateGroupProps) => {
  const organizationId = useSelector(selectOrganizationId);
  const { client } = useAuth();
  const [selectedOptions, setSelectedOptions] = useState<
    (customer | undefined)[]
  >([]);
  const [groupsChanged, setGroupsChanged] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedOption = users?.find((option) => option._id === selectedId);
    if (!selectedOptions.some((option) => option?._id === selectedOption?._id)) {
      setSelectedOptions([...selectedOptions, selectedOption!]);
    }
  };

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
      setGroupsChanged(true);
      console.log(response.data);
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
      setGroupsChanged(true);

      throw error;
    },
  });

  const {
    mutate: editGroups,
    isPending: isEditingGroup,
    isError: editGroupError,
  } = useMutation({
    mutationKey: ["edit Group"],
    mutationFn: async (groupName: string) => {
      return client.put(`/api/user/${groupToBeEdited}`, {
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

  useEffect(() => {
    refetchAllGroups();
  }, [groupsChanged, refetchAllGroups]);

  useEffect(() => {
    if (actionToTake === "edit" && !isTouched) {
      const getUsersFromIds = (userIds: string[]) => {
        return userIds.map((userId: string) =>
          users?.find((user) => user._id === userId),
        );
      };
      const matchedUsers = getUsersFromIds(groupToBeEditedMembers ?? []);
      const updatedSelectedOptions = [...selectedOptions, ...matchedUsers].filter(
        (user, index, self) =>
          self.findIndex((u) => u?._id === user?._id) === index,
      );
      setSelectedOptions(updatedSelectedOptions ?? []);
    }
  },[actionToTake, isTouched, selectedOptions, groupToBeEditedMembers, users])

  return (
    <Formik
      initialValues={{
        groupType: "named group",
        groupName: actionToTake === "edit" ? groupToBeEditedName ?? "" : "",
        groupDescription: "",
        savingsPurpose: "",
        selectedCustomer: actionToTake === "edit" ? groupToBeEditedMembers : [],
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

          actionToTake === "create"
            ? createGroups(values.groupName)
            : editGroups(values.groupName);

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
                {actionToTake === "edit" && "New"} Group Name:
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
                {actionToTake === "edit" && "New"} Group description:
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
                {actionToTake === "edit" && "New"} Savings Purpose:
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
                onFocus={() => {
                  setIsTouched(true);
                }}
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
                      {option?.firstName} {option?.lastName}
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
                value={selectedOptions.map((option) => option?._id)}
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
  return (
    <div className="mx-auto mt-[10%] flex h-full w-1/2 flex-col items-center justify-center space-y-8">
      <h1 className="text-white">
        {status !== undefined
          ? status === "success"
            ? "Group Successfully Created"
            : "Unable to Create Group"
          : "Loading....."}
      </h1>
      {status !== undefined ? (
        <Image
          src={
            status === "success" ? "/check-circle.svg" : "/failed-icon-7.jpg"
          }
          alt="check-circle"
          width={162}
          height={162}
          className="w-[6rem] md:w-[10rem]"
        />
      ) : (
        "Loading...."
      )}
      <p className="whitespace-nowrap text-ajo_offWhite">
        {postingResponse?.message}
      </p>
    </div>
  );
};

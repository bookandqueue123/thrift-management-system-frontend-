"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton } from "@/components/Buttons";
import Modal from "@/components/Modal";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { AssignedUser, FormErrors, FormValues, customer } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";

const Settings = () => {
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );

  return (
    <div className="">
      <div className="mb-4 space-y-2 ">
        <p className="text-2xl font-bold text-ajo_offWhite text-opacity-60">
          Settings
        </p>
        <p className="text-sm font-bold text-ajo_offWhite">Savings settings</p>
      </div>
      <div className="mx-auto mt-[20%] flex h-screen w-[80%] flex-col items-center gap-8 md:mt-[10%] md:w-[40%]">
        <Image
          src="/receive-money.svg"
          alt="hand with coins in it"
          width={120}
          height={120}
          className="w-[5rem] md:w-[7.5rem]"
        />
        <p className="text-center text-sm text-ajo_offWhite">
          Create a savings group make all the necessary edits and changes. Use
          the button below to get started!
        </p>

        {/* <Link href="/merchant/settings/savings"> */}
        <CustomButton
          type="button"
          label="Savings SetUp"
          style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
          onButtonClick={() => setModalState(true)}
        />
        {/* </Link> */}
      </div>
      {modalState && (
        <Modal
          setModalState={setModalState}
          title={modalContent === "confirmation" ? "" : "Set Up Savings"}
        >
          <SetUpSavingsForm
            setContent={setModalContent}
            content={modalContent === "confirmation" ? "confirmation" : "form"}
            closeModal={setModalState}
          />
        </Modal>
      )}
    </div>
  );
};

export default Settings;

interface SetUpSavingsProps {
  setContent: Dispatch<SetStateAction<"form" | "confirmation">>;
  content: "form" | "confirmation";
  closeModal: Dispatch<SetStateAction<boolean>>;
}
const SetUpSavingsForm = ({
  setContent,
  content,
  closeModal,
}: SetUpSavingsProps) => {
  const organizationId = useSelector(selectOrganizationId);
  const user = useSelector(selectUser);
  const { assignedCustomers } = usePermissions();

  const { client } = useAuth();
  const [selectedOptions, setSelectedOptions] = useState<AssignedUser[]>([]);
  const [displayConfirmationModal, setDisplayConfirmationMedal] =
    useState(false);
  const [saveDetails, setSaveDetails] = useState({
    savingsType: "named group",
    purposeName: "",
    amount: "",
    startDate: "",
    endDate: "",
    collectionDate: "",
    frequency: "",
    // group:
  });

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: validateField(
        name,
        value,
        saveDetails.savingsType as "named group" | "nameless group",
      ),
    });

    const selectedId = value;
    const selectedOption = users?.find((option) => option._id === selectedId);
    if (!selectedOptions.some((option) => option._id === selectedOption?._id)) {
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
    queryKey: ["allUsers", saveDetails.savingsType],
    queryFn: async () => {
      const endpoint =
        saveDetails.savingsType === "named group"
          ? `/api/user?organisation=${organizationId}&userType=group`
          : `/api/user?organisation=${organizationId}&userType=individual`;

      return client
        .get(endpoint, {})
        .then((response: AxiosResponse<AssignedUser[], any>) => {
          if (
            user?.role === "staff" &&
            saveDetails.savingsType !== "named group"
          ) {
            return assignedCustomers;
          } else {
            console.log(response.data);
            return response.data;
          }
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  const selectedIds = selectedOptions.map((option) => option._id);
  const groupId = selectedIds[0];

  const { mutate: postNamedGroups } = useMutation({
    mutationFn: async () => {
      const unNamedPayload = {
        purposeName: saveDetails.purposeName,
        amount: saveDetails.amount,
        startDate: saveDetails.startDate,
        endDate: saveDetails.endDate,
        collectionDate: saveDetails.collectionDate,
        organisation: organizationId,
        frequency: saveDetails.frequency,
        users: selectedIds,
      };
      const namedPayload = {
        purposeName: saveDetails.purposeName,
        amount: saveDetails.amount,
        startDate: saveDetails.startDate,
        endDate: saveDetails.endDate,
        collectionDate: saveDetails.collectionDate,
        organisation: organizationId,
        frequency: saveDetails.frequency,
        group: groupId,
      };
      const payload =
        saveDetails.savingsType === "named group"
          ? namedPayload
          : unNamedPayload;
      return client.post(`/api/saving`, payload);
    },
    onSuccess: (response) => {
      // console.log(response);

      setContent("confirmation");
      setDisplayConfirmationMedal(true);
    },
    onError: (error) => {
      // setContent("confirmation")
      // setDisplayConfirmationMedal(true)
      console.error("Error creating user:", error);
      throw error;
    },
  });

  const unnamedInitialValues = {
    purposeName: "",
    amount: "",
    startDate: "",
    endDate: "",
    collectionDate: "",
    frequency: "",
    addCustomers: [],
  };

  const namedInitialValues = {
    purposeName: "",
    amount: "",
    startDate: "",
    endDate: "",
    collectionDate: "",
    frequency: "",
    chosenGroup: "",
  };

  const initialValues =
    saveDetails.savingsType === "named group"
      ? namedInitialValues
      : unnamedInitialValues;

  // Input Validation States
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (
    name: string,
    value: string,
    savingType: "named group" | "nameless group",
  ) => {
    switch (name) {
      case "purposeName":
        if (!value.trim()) return "Savings purpose is required";
        break;
      case "amount":
        if (!value.trim()) return "Amount is required";
        if (isNaN(Number(value))) return "Amount must be a number";
        if (Number(value) <= 0) return "Amount must be greater than zero";
        break;
      case "startDate":
      case "endDate":
      case "collectionDate":
        if (!value.trim()) return "Date is required";
        // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        // if (!dateRegex.test(value))
        //   return "Invalid date format, use YYYY-MM-DD";
        // Additional validation for past dates could be added here
        break;
      case "frequency":
        if (!value.trim()) return "Frequency is required";
        // Add specific frequency validation if needed
        break;
      case "chosenGroup":
        if (savingType === "named group" && !value.trim())
          return "At least one group is required";
        break;
      case "addCustomers":
        if (selectedIds.length === 0) return "At least one user is required";
        break;

      default:
        return "";
    }

    // if (savingType === "named group" && !!formValues.addCustomers === true) {
    //   return "Groups should be empty for individuals";
    // }
    // if (savingType !== "named group" && !!formValues.group === true) {
    //   return "Customers should be empty for groups";
    // }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: validateField(
        name,
        value,
        saveDetails.savingsType as "named group" | "nameless group",
      ),
    });

    // Initialize a variable to hold the processed value (initially, it's the same as the input value)
    let processedValue = value;

    // If the input field is 'amount', remove commas and convert it to a number
    if (name === "amount") {
      // Remove commas from the value using a regular expression
      const unformattedValue = value.replace(/,/g, "");
      // Parse the string to a floating point number
      processedValue = parseFloat(unformattedValue).toString();
    }

    // Update the state 'saveDetails' with the new value, keeping previous state intact
    setSaveDetails((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLElement>) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    setIsTouched({ ...isTouched, [name]: true });
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: validateField(
        name,
        value,
        saveDetails.savingsType as "named group" | "nameless group",
      ),
    });
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    // console.log(saveDetails);
    // console.log(organizationId);
    // console.log(selectedIds);

    e.preventDefault();

    let isValid = true;
    const newErrors: FormErrors = {};

    Object.keys(formValues).forEach((key) => {
      const error = validateField(
        key,
        formValues[key],
        saveDetails.savingsType as "named group" | "nameless group",
      );
      if (error) {
        isValid = false;
        newErrors[key] = error;
      }
    });

    setFormErrors((prevErrors) => {
      return newErrors;
    });

    if (isValid) {
      console.log("Form is valid, submitting...");
      postNamedGroups();
    } else {
      console.log("Form is invalid, showing errors...");
    }

    // onSubmit("confirmation");
  };
  return (
    <div>
      {displayConfirmationModal ? (
        <div className="mx-auto mt-[10%] flex h-full w-1/2 flex-col items-center justify-center space-y-8">
          <Image
            src="/check-circle.svg"
            alt="check-circle"
            width={162}
            height={162}
            className="w-[6rem] md:w-[10rem]"
          />
          <p className="whitespace-nowrap text-ajo_offWhite">
            Savings Set Up Successful
          </p>
          <CustomButton
            type="button"
            label="Close"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[40%]"
            onButtonClick={() => closeModal(false)}
          />
        </div>
      ) : (
        <form
          className="mx-auto mt-12 w-[90%] space-y-3 md:w-[60%]"
          onSubmit={onSubmitHandler}
        >
          <div className="items-center gap-6  md:flex">
            <label
              htmlFor="check-group"
              className="m-0 w-[16%] text-xs font-medium text-white"
            >
              Savings Type
            </label>
            <div
              id="check-group"
              className="my-3 flex w-[80%] items-center justify-start gap-8"
            >
              <span className="flex items-center gap-2">
                <input
                  id="named group"
                  name="savingsType"
                  type="radio"
                  className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
                  onChange={() => {
                    setSaveDetails((prev) => ({
                      ...prev,
                      ["savingsType"]: "named group",
                    }));

                  }}
                  checked={saveDetails.savingsType === "named group"}
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
                  name="savingsType"
                  type="radio"
                  className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
                  onChange={() => {
                    setSaveDetails((prev) => ({
                      ...prev,
                      ["savingsType"]: "nameless group",
                    }));
                  }}
                  required
                  checked={saveDetails.savingsType === "nameless group"}
                />
                <label
                  htmlFor="nameless group"
                  className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
                >
                  unnamed group
                </label>
              </span>
            </div>
          </div>

          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="purposeName"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Purpose:
            </label>
            <span className="w-full">
              <input
                id="purposeName"
                name="purposeName"
                type="text"
                placeholder="state reason"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              />
              {(isTouched.purposeName || formErrors.purposeName) && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {formErrors.purposeName}
                </p>
              )}
            </span>
          </div>
          {saveDetails.savingsType === "named group" && (
            <div className="items-center gap-6 md:flex">
              <label
                htmlFor="chosenGroup"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                Group:
              </label>
              <span className="w-full">
                <select
                  id="chosenGroup"
                  name="chosenGroup"
                  className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                  onChange={handleOptionChange}
                  onFocus={handleInputFocus}
                  required
                >
                  <option className="hidden lowercase text-opacity-10">
                    Select a group
                  </option>
                  {users?.map((option: AssignedUser) => (
                    <option key={option._id} value={option._id} className="">
                      {option.groupName}
                    </option>
                  ))}
                </select>
                {(isTouched.chosenGroup || formErrors.chosenGroup) && (
                  <p className="mt-2 text-sm font-semibold text-red-600">
                    {formErrors.chosenGroup}
                  </p>
                )}
              </span>
            </div>
          )}

          {saveDetails.savingsType === "nameless group" && (
            <div className="items-center gap-6 md:flex">
              <label
                htmlFor="addCustomers"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                Add Customers
              </label>

              <div className="w-full">
                <span className="w-full">
                  <select
                    id="addCustomers"
                    name="addCustomers"
                    className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                    onChange={handleOptionChange}
                    onFocus={handleInputFocus}
                  >
                    <option className="hidden lowercase text-opacity-10">
                      Select an option
                    </option>
                    {users?.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}{" "}
                      </option>
                    ))}
                  </select>

                  {(isTouched.addCustomers || formErrors.addCustomers) &&
                    selectedIds.length === 0 && (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {formErrors.addCustomers}
                      </p>
                    )}
                </span>

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
              </div>
            </div>
          )}

          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="amount"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Savings Amount:
            </label>
            <span className="w-full">
              <input
                id="amount"
                name="amount"
                placeholder="0000.00 NGN"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                onChange={(event) => {
                  const { name, value } = event.target;
                  setFormValues({ ...formValues, [name]: value });
                  setFormErrors({
                    ...formErrors,
                    [name]: validateField(
                      name,
                      value,
                      saveDetails.savingsType as
                        | "named group"
                        | "nameless group",
                    ),
                  });
                  const input = event.target.value.replace(/\D/g, "");
                  const formatted = Number(input).toLocaleString();
                  setSaveDetails((prev) => ({
                    ...prev,
                    ["amount"]: input,
                  }));
                }}
                onFocus={handleInputFocus}
                required
              />
              {(isTouched.amount || formErrors.amount) && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {formErrors.amount}
                </p>
              )}
            </span>
          </div>
          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="frequency"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Savings Frequency:
            </label>
            <span className="w-full">
              <select
                id="frequency"
                name="frequency"
                className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 capitalize text-[#7D7D7D]"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              >
                <option className="hidden">Select frequency</option>

                <option className="capitalize">daily</option>
                <option className="capitalize">weekly</option>
                <option className="capitalize">monthly</option>
                <option className="capitalize">quarterly</option>
              </select>
              {(isTouched.frequency || formErrors.frequency) && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {formErrors.frequency}
                </p>
              )}
            </span>
          </div>
          <p className="mt-6 text-sm text-ajo_offWhite text-opacity-60">
            Savings Duration (Kindly select the range this savings is to last)
          </p>
          <div className="flex w-full items-center justify-between gap-x-8">
            <div className="w-[50%] items-center gap-6 md:flex md:w-[60%]">
              <label
                htmlFor="startDate"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white md:w-[43%]"
              >
                Start Date:
              </label>
              <span className="w-full">
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  required
                />
                {(isTouched.startDate || formErrors.startDate) && (
                  <p className="mt-2 text-sm font-semibold text-red-600">
                    {formErrors.startDate}
                  </p>
                )}
              </span>
            </div>
            <div className="w-[50%] items-center gap-6 md:flex md:w-[40%]">
              <label
                htmlFor="endDate"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                End Date:
              </label>
              <span className="w-full">
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  required
                />
                {(isTouched.endDate || formErrors.endDate) && (
                  <p className="mt-2 text-sm font-semibold text-red-600">
                    {formErrors.endDate}
                  </p>
                )}
              </span>
            </div>
          </div>
          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="collectionDate"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Collection Date:
            </label>
            <span className="w-full">
              <input
                id="collectionDate"
                name="collectionDate"
                type="date"
                className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              />
              {(isTouched.collectionDate || formErrors.collectionDate) && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {formErrors.collectionDate}
                </p>
              )}
            </span>
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
      )}
    </div>
  );
};

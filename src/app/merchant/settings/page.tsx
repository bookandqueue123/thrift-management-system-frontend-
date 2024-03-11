"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton } from "@/components/Buttons";
import { MultiSelectDropdown } from "@/components/Dropdowns";
import Modal from "@/components/Modal";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { customer } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Axios, AxiosResponse } from "axios";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
        <Modal setModalState={setModalState}
        title={modalContent === "confirmation" ? "" : "Set Up Savings"}>
          
          <SetUpSavingsForm 
          setContent={setModalContent}
          content={
            modalContent === "confirmation" ? "confirmation" : "form"
          }
          closeModal={setModalState}
          />
        </Modal>
      )}
    </div>
  );
};

export default Settings;

interface SetUpSavingsProps{
  setContent: Dispatch<SetStateAction<"form" | "confirmation">>;
  content: "form" | "confirmation";
  closeModal: Dispatch<SetStateAction<boolean>>;
}
const SetUpSavingsForm = ({setContent, content, closeModal}: SetUpSavingsProps) => {
  const organizationId = useSelector(selectOrganizationId)
  console.log(organizationId)
  const { client } = useAuth();
  const [selectedOptions, setSelectedOptions] = useState<customer[]>([]);
  const [displayConfirmationModal, setDisplayConfirmationMedal] = useState(false)
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
  const handleChange = (event: { target: { name: any; value: any } }) => {
    // Destructure the 'name' and 'value' from the event target
    const { name, value } = event.target;
    
    // Initialize a variable to hold the processed value (initially, it's the same as the input value)
    let processedValue = value;
  
    // If the input field is 'amount', remove commas and convert it to a number
    if (name === "amount") {
      // Remove commas from the value using a regular expression
      const unformattedValue = value.replace(/,/g, "");
      // Parse the string to a floating point number
      processedValue = parseFloat(unformattedValue);
    }
  
    // Update the state 'saveDetails' with the new value, keeping previous state intact
    setSaveDetails((prev) => ({ ...prev, [name]: processedValue }));
  };
  

 
    const {data: users, isLoading: isUserLoading, isError} = useQuery({
      queryKey: ["allUsers", saveDetails.savingsType],
      queryFn: async () => {
  
        const endpoint = saveDetails.savingsType === "named group" 
      ? `/api/user?organisation=${organizationId}&userType=group`
      : `/api/user?organisation=${organizationId}&userType=individual`;
  
      
        return client
          .get(endpoint, {})
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
 
   
  
  const selectedIds = selectedOptions.map(option => option._id);
 const groupId = (selectedIds[0])
  console.log(selectedIds)
  const {mutate: postNamedGroups} = useMutation({
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
 
      }
      const namedPayload = {
       
        purposeName: saveDetails.purposeName,
        amount: saveDetails.amount,
        startDate: saveDetails.startDate,
        endDate: saveDetails.endDate,
        collectionDate: saveDetails.collectionDate,
        organisation: organizationId,
        frequency: saveDetails.frequency,
       
         groups: "65eeb08ec48c4be6acb633b8"

     
      }
      const payload = saveDetails.savingsType === "named group"? namedPayload : unNamedPayload
      return client.post(
        `/api/saving`, payload
      )
    },
    onSuccess: (response) => {
      console.log(response)
      console.log('User created successfully');
      setContent("confirmation")
      setDisplayConfirmationMedal(true)
      console.log(displayConfirmationModal)
      console.log(response)
      
    },
    onError: (error) => {
      console.log(saveDetails.amount)
      // setContent("confirmation")
      // setDisplayConfirmationMedal(true)
      console.error('Error creating user:', error);
      throw error
    },

  })


  const onSubmitHandler = () => {
   console.log(saveDetails)
   console.log(organizationId)
   console.log(selectedIds)
   postNamedGroups();
    
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
        <input
          id="purposeName"
          name="purposeName"
          type="text"
          placeholder="state reason"
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
          onChange={handleChange}
          required
        />
      </div>
      {saveDetails.savingsType === "named group" && (
        <div className="items-center gap-6 md:flex">
          <label
            htmlFor="chosenGroup"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
          >
            Group:
          </label>
          <select
            id="chosenGroup"
            name="chosenGroup"
            className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
            onChange={handleOptionChange}
            required
          >
            <option className="hidden lowercase text-opacity-10">
              Select a group
            </option>
            {users?.map((option: customer) => (
              <option key={option._id} value={option._id}>{option.groupName}</option>
            ))}
          </select>
        </div>
      )}

    {saveDetails.savingsType === "nameless group" && (
      // <MultiSelectDropdown
      //         options={["Option 1", "Option 2", "Option 3"]}
      //         label="Add Customers: "
      //         placeholder="Choose customers"
      //       />


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
              <option key={option._id} value={option._id}>{option.firstName} {option.lastName} </option>
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
    )}
      

      <div className="items-center gap-6 md:flex">
        <label
           htmlFor="amount"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Savings Amount:
        </label>
        <input
          id="amount"
          name="amount"
          placeholder="0000.00 NGN"
          type="text"
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
          onChange={(event) => {
           
            const input = event.target.value.replace(/\D/g, "");
            const formatted = Number(input).toLocaleString();
            setSaveDetails((prev) => ({
              ...prev,
              ["amount"]: input,
            }));
          }}
          required
        />
      </div>
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="frequency"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Savings Frequency:
        </label>
        <select
          id="frequency"
          name="frequency"
          className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 capitalize text-[#7D7D7D]"
          defaultValue={"Select a category"}
          onChange={handleChange}
          required
        >
          <option  className="hidden">
            Select frequency
          </option>
          
          <option className="capitalize">daily</option>
          <option className="capitalize">weekly</option>
          <option className="capitalize">monthly</option>
          <option className="capitalize">quarterly</option>
        </select>
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
          <input
            id="startDate"
            name="startDate"
            type="date"
            className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
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
            className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="collectionDate"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Collection Date:
        </label>
        <input
          id="collectionDate"
          name="collectionDate"
          type="date"
          className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          onChange={handleChange}
          required
        />
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

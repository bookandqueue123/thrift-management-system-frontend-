"use client";
import { CustomButton } from "@/components/Buttons";
import { MultiSelectDropdown } from "@/components/Dropdowns";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, { useState } from "react";

const Settings = () => {
  const [modalState, setModalState] = useState(false);

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
        <Modal setModalState={setModalState} title="Set Up Savings">
          <SetUpSavingsForm />
        </Modal>
      )}
    </div>
  );
};

export default Settings;

const SetUpSavingsForm = () => {
  const [saveDetails, setSaveDetails] = useState({
    savingsType: "named group",
    purposeName: "",
    amount: "",
    startDate: "",
    endDate: "",
    collectionDate: "",
    frequency: "",
  });
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    console.log(value)
    setSaveDetails((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmitHandler = () => {
    console.log(saveDetails);
    // postSavings();
    // onSubmit("confirmation");
  };
  return (
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
      {/* <div className="items-center gap-6 md:flex">
        <label
          htmlFor="savingsName"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Savings Name:
        </label>
        <input
          id="savingsName"
          name="savingsName"
          type="text"
          placeholder="state name"
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
          onChange={handleChange}
          required
        />
      </div> */}
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
            onChange={handleChange}
            required
          >
            <option className="hidden lowercase text-opacity-10">
              Select a group
            </option>
            <option className="capitalize">Group 1</option>
            <option className="capitalize">Group 2</option>
            <option className="capitalize">Group 3</option>
            <option className="capitalize">Group 4</option>
          </select>
        </div>
      )}
      <MultiSelectDropdown
        options={["Option 1", "Option 2", "Option 3"]}
        label="Add Customers: "
        placeholder="Choose customers"
      />

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
              ["amount"]: formatted,
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
          <option disabled className="hidden">
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
  );
};

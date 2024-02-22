"use client";
import { CustomButton } from "@/components/Buttons";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, { useState } from "react";

const GroupSettings = () => {
  const [modalState, setModalState] = useState(false);

  return (
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
            // setModalContent("form");
          }}
        />
        {modalState && (
          <Modal setModalState={setModalState} title="Create a Group">
            <CreateGroupForm />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default GroupSettings;

const CreateGroupForm = () => {
  const [createGroup, setCreateGroup] = useState({
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
    console.log(value);
    setCreateGroup((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmitHandler = () => {
    console.log(createGroup);
    // postSavings();
    // onSubmit("confirmation");
  };
  return (
    <form
      className="mx-auto mt-12 w-[90%] space-y-3 md:w-[60%]"
      onSubmit={onSubmitHandler}
    >
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
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="addCustomers"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Add Customers:
        </label>
        <input
          id="addCustomers"
          name="addCustomers"
          type="text"
          placeholder="Choose customers"
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
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

"use client";
import { CustomButton } from "@/components/Buttons";
import Modal from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import React, { useState } from "react";
import DummyGroups from "@/api/dummyGroups.json";
import Image from "next/image";
import { MultiSelectDropdown } from "@/components/Dropdowns";

const GroupSettings = () => {
  const [modalState, setModalState] = useState(false);

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
              // setModalContent("form");
            }}
          />
          {modalState && (
            <Modal setModalState={setModalState} title="Create a Group">
              <CreateGroupForm />
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

const CreateGroupForm = () => {
  const [createGroup, setCreateGroup] = useState({
    groupType: "named group",
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
      <div className="items-center gap-6  md:flex">
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
      </div>
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
      <MultiSelectDropdown
        options={["Option 1", "Option 2", "Option 3"]}
        label="Add Customers: "
        placeholder="Choose customers"
      />

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

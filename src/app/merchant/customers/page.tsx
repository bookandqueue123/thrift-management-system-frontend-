"use client";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
// import DummyCustomers from "@/api/dummyCustomers.json";
import { client } from "@/api/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { customer, setSavingsResponse } from "@/types";
import { AxiosError, AxiosResponse } from "axios";
import { formatToDateAndTime } from "@/utils/TimeStampFormatter";
import { StatusIndicator } from "@/components/StatusIndicator";
import { SetStateAction, useState } from "react";
import Modal from "@/components/Modal";

const Customers = () => {
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [customerToBeEdited, setCustomerToBeEdited] = useState("");

  const [openDropdown, setOpenDropdown] = useState<number>(0);
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get("/api/user?role=customer", {})
        .then((response: AxiosResponse<customer[], any>) => {
          console.log(response);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error);
        });
    },
  });

  const AddCustomer = () => {};
  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Customers
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
            label="Create New Customer"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={AddCustomer}
          />
        </div>

        <div>
          <TransactionsTable
            headers={[
              "Customer Name",
              "Account Created On",
              "Email Address",
              "Phone Number",
              "State",
              "Local Govt Area",
              "Action",
            ]}
            content={allCustomers?.map((customer, index) => (
              <tr className="" key={index + 1}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.firstName + " " + customer.lastName || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {formatToDateAndTime(customer.createdAt) || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.email || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.phoneNumber || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.state || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {customer.lga || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator
                    label={`Actions`}
                    clickHandler={() => {
                      setOpenDropdown(index + 1);
                      if (index + 1 === openDropdown) {
                        toggleDropdown(openDropdown);
                      } else {
                        toggleDropdown(index + 1);
                      }
                    }}
                    dropdownEnabled
                    dropdownContents={{
                      labels: [
                        "View Customer",
                        "Edit Customer",
                        "Savings Settings",
                        "Disable/Enable",
                      ],
                      actions: [
                        () => {
                          console.log("View Customer");
                        },
                        () => {
                          console.log("Edit Customer");
                        },
                        () => {
                          setModalState(true);
                          setModalContent("form");
                          setCustomerToBeEdited(customer._id);
                        },
                        () => {
                          console.log("Disable/Enable");
                        },
                      ],
                    }}
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    currentIndex={index + 1}
                  />
                </td>
              </tr>
            ))}
          />
          {modalState && (
            <Modal
              setModalState={setModalState}
              title={modalContent === "confirmation" ? "" : "Savings Settings"}
            >
              <SavingsSettings customerId={customerToBeEdited} />
            </Modal>
          )}
          {/* <PaginationBar apiResponse={allCustomers !== undefined && allCustom} /> */}
        </div>
      </section>
    </>
  );
};

export default Customers;

const SavingsSettings = ({ customerId }: { customerId: string }) => {
  const { data: customerInfo, isLoading: isLoadingCustomerInfo } = useQuery({
    queryKey: ["customerInfo"],
    queryFn: async () => {
      return client
        .get(`/api/user/${customerId}`)
        .then((response: AxiosResponse<customer, any>) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error.response ?? error.message);
          throw error;
        });
    },
  });

  const [saveDetails, setSaveDetails] = useState({
    purposeName: "",
    amount: "",
    startDate: "",
    endDate: "",
    collectionDate: "",
    organisation: "",
    frequency: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setSaveDetails((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: setSavings, isPending: isSettingSavings } = useMutation({
    mutationKey: ["set Savings"],
    mutationFn: async () => {
      return client.post(`/api/saving/${customerId}`, {
        purposeName: saveDetails.purposeName,
        amount: Number(saveDetails.amount),
        startDate: saveDetails.startDate,
        endDate: saveDetails.endDate,
        collectionDate: saveDetails.collectionDate,
        organisation: customerInfo?.organisation,
        frequency: saveDetails.frequency,
      });
    },
    onSuccess(response: AxiosResponse<setSavingsResponse, any>) {
      setSaveDetails((prev) => ({ ...prev, savingId: response.data.id }));
      console.log(response.data);
    },
    onError(error: AxiosError<any, any>) {
      console.log(error.response);
    },
  });

  const onSubmitHandler = () => {
    console.log(saveDetails);
    setSavings();
    // !isSettingSavings && postSavings();
    // onSubmit("confirmation");
  };
  return (
    <div>
      <div className="mx-auto w-[90%] rounded bg-ajo_orange p-4 md:w-[60%]">
        <h4 className="mb-4 text-lg font-semibold text-ajo_offWhite md:text-xl">
          Customer Details
        </h4>
        <div className="items-center justify-between gap-y-4 md:flex">
          <span className="space-y-2">
            <p className="overflow-hidden text-nowrap text-sm font-semibold text-ajo_offWhite md:text-base">
              Customer name:{" "}
              <span className="font-normal">
                {customerInfo?.firstName + " " + customerInfo?.lastName}
              </span>
            </p>
            <p className="overflow-hidden text-nowrap text-sm font-semibold text-ajo_offWhite md:text-base">
              Country:{" "}
              <span className="font-normal">{customerInfo?.country}</span>
            </p>
            <p className="overflow-hidden text-nowrap text-sm font-semibold text-ajo_offWhite md:text-base">
              Phone number:{" "}
              <span className="font-normal">{customerInfo?.phoneNumber}</span>
            </p>
          </span>
          <span className="space-y-2">
            <p className="overflow-hidden text-nowrap pt-2 text-sm font-semibold text-ajo_offWhite md:pt-0 md:text-base">
              Email address:{" "}
              <span className="font-normal">{customerInfo?.email}</span>
            </p>
            <p className="overflow-hidden text-nowrap text-sm font-semibold text-ajo_offWhite md:text-base">
              State: <span className="font-normal">{customerInfo?.state}</span>
            </p>
            <p className="overflow-hidden text-nowrap text-sm font-semibold text-ajo_offWhite md:text-base">
              LGA: <span className="font-normal">{customerInfo?.lga}</span>
            </p>
          </span>
        </div>
      </div>
      <form
        className="mx-auto mt-12 w-[90%] space-y-3 md:w-[60%]"
        onSubmit={onSubmitHandler}
      >
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
            onChange={handleChange}
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
            htmlFor="collectionDate"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
          >
            Collection Date:
          </label>
          <input
            id="collectionDate"
            name="collectionDate"
            type="date"
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center pb-12 pt-4 ">
          <span className="hidden w-[20%] md:block">Submit</span>
          <div className="md:flex md:justify-center md:w-[80%]">
            <CustomButton
              type="button"
              label="Submit"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
              onButtonClick={onSubmitHandler}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

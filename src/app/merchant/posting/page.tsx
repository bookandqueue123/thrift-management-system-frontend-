"use client";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
// import DummyCustomers from "@/api/dummyCustomers.json";
import { client } from "@/api/hooks/useAuth";
import Modal from "@/components/Modal";
import {
  allSavingsResponse,
  customer,
  postSavingsResponse,
  savingsFilteredById,
  setSavingsResponse,
} from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { formatToDateAndTime } from "@/utils/TimeStampFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { group } from "console";

const Posting = () => {
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [postingResponse, setPostingResponse] = useState<postSavingsResponse>();

  interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    startDate: string;
    endDate: string;
  }

  const config: CustomAxiosRequestConfig = {
    startDate: "",
    endDate: "",
  };
  const { data: allSavings, isLoading: isLoadingAllSavings } = useQuery({
    queryKey: ["allSavings"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get("/api/saving/get-savings?organisation=65ca01a52c8fabbc92aed513", config)
        .then((response: AxiosResponse<allSavingsResponse, any>) => {
          console.log("allSavingsSuccess: ", response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error.response);
          throw error;
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
                <PostConfirmation
                  postingResponse={postingResponse}
                  status={postingResponse?.status}
                />
              ) : (
                <PostingForm
                  onSubmit={setModalContent}
                  Savings={allSavings}
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
            content={allSavings?.savings?.map((savings, index) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.firstName + " " + savings.user.lastName ||
                    "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {/* {customer.transaction_id || "----"} */}
                  {savings._id || "-----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.phoneNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.state || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.lga || "----"}
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
  Savings,
  setPostingResponse,
}: {
  onSubmit: Dispatch<SetStateAction<"form" | "confirmation">>;
  Savings: void | allSavingsResponse | undefined;
  setPostingResponse: Dispatch<SetStateAction<postSavingsResponse | undefined>>;
}) => {
  console.log(Savings)
  const [filteredSavingIds, setFilteredSavingIds] =
    useState<savingsFilteredById[]>();
  const [groupId, setGroupId] = useState()
    const [postDetails, setPostDetails] = useState({
    postingType: "individual",
    customerId: "",
    purposeName: "",
    amount: "",
    startDate: "",
    endDate: "",
    savingId: "",
    paymentMode: "",
    narrative: "",
    todayPayment: "no",
    // status: "",
  });
  const [filteredArray, setFilteredArray] = useState<savingsFilteredById[]>([]);

  useEffect(() => {
    // Define a function to filter the array based on postDetails.customerId
    const filterArray = () => {
      if (Savings?.savings) { // Check if Savings?.savings is not undefined or null
        const filtered = Savings.savings.filter(item => item.user._id === postDetails.customerId);
        setFilteredArray(filtered);
      } else {
        // Handle case where Savings?.savings is undefined or null
        setFilteredArray([]); // Set filteredArray to an empty array
      }
    };
  
    filterArray(); // Call the filterArray function
  }, [Savings, postDetails.customerId]); // Add dependencies to useEffect

  console.log(filteredArray)

  console.log(postDetails.customerId)
  useEffect(() => {
    console.log(postDetails.customerId + "1")
    if (postDetails.customerId) {
      let savingsIds =
        Savings?.savings?.filter(
          (s) => s.user?._id === postDetails.customerId?.split(":")[1]?.trim(),
        ) ?? [];
      setFilteredSavingIds(savingsIds ?? undefined);
    }
  }, [postDetails.customerId]);

  console.log(filteredSavingIds)
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setPostDetails((prev) => ({ ...prev, [name]: value }));

  };
  const handleGroupChange = (e: any ) =>{
    setGroupId(e.target.value)
  }

  useEffect(() => {
    if (postDetails.todayPayment === "yes") {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();

      console.log(`${day}/${month + 1}/${year}`);
      setPostDetails((prev) => ({
        ...prev,
        ["startDate"]: `${day}/${month + 1}/${year}`,
      }));
      setPostDetails((prev) => ({
        ...prev,
        ["endDate"]: `${day}/${month + 1}/${year}`,
      }));
    }
  }, [postDetails.todayPayment]);


  const {data: groups, isLoading: isUserLoading, isError} = useQuery({
    queryKey: ["allgroups", postDetails.postingType],
    queryFn: async () => {
      return client
        .get(`/api/user?organisation=65ca01a52c8fabbc92aed513&userType=${postDetails.postingType}`, {})
        .then((response) => {
          console.log(response.data)
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
    }
  })

 



 
  const { mutate: postSavings } = useMutation({
    mutationFn: async () => {
      console.log(postDetails)
      console.log(postDetails.postingType)
      console.log(postDetails.customerId)
      const endpoint = postDetails.postingType === "individual" 
    ? `/api/saving/post-savings?userId=${postDetails.customerId}&savingId=${postDetails.savingId}`
    : `/api/saving/post-savings?userId=${groupId}`;
      return client.post(
      
        endpoint,
        {
          paidDays: {
            dates: [postDetails.startDate, postDetails.endDate],
            amount: Number(postDetails.amount.replace(",", "")),
          },
          paymentMode: postDetails.paymentMode,
          narrative: postDetails.narrative,
          // purposeName: postDetails.purposeName,
          // startDate: postDetails.startDate,
          // endDate: postDetails.endDate,
        },
      );
    },
    onSuccess(response: AxiosResponse<postSavingsResponse, any>) {
      
      setPostingResponse(response.data);
      setPostingResponse(
        (prev) =>
          ({
            ...prev,
            ["status"]: "success",
          }) as postSavingsResponse,
      );
      console.log(response.data);
    },
    onError(error: AxiosError<any, any>) {
      setPostingResponse(error.response?.data)
      setPostingResponse(
        (prev) =>
          ({
            ...prev,
            ["status"]: "failed",
          }) as postSavingsResponse,
      );

      console.log(error?.response?.data);
    },
  });

  const onSubmitHandler = () => {
    console.log(postDetails);
    console.log(postDetails.customerId)
    postSavings();
    onSubmit("confirmation");
  };

  // Filtered the savings array to avoid repeating customer ids
  const customerIds = new Set<string>();
  Savings?.savings.forEach((eachSaving) =>
    customerIds.add(
      eachSaving.user.firstName +
        " " +
        eachSaving.user.lastName +
        ": " +
        eachSaving.user._id,
    ),
  );
  const uniqueCustomerIds = Array.from(customerIds);
  console.log(uniqueCustomerIds)
  return (
    <form className="mx-auto w-[85%] space-y-3" onSubmit={onSubmitHandler}>
      <div className="items-center gap-6  md:flex">
        <label
          htmlFor="postingType"
          className="m-0 w-[16%] text-xs font-medium text-white"
        >
          Posting Type:
        </label>
        <div
          id="postingType"
          className="my-3 flex w-[80%] items-center justify-start gap-8"
        >
          <span className="flex items-center gap-2">
            <input
              id="individual"
              name="postingType"
              type="radio"
              className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
              onChange={() => {
                setPostDetails((prev) => ({
                  ...prev,
                  ["postingType"]: "individual",
                }));
              }}
              checked={postDetails.postingType === "individual"}
              required
            />
            <label
              htmlFor="individual"
              className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
            >
              Individual
            </label>
          </span>
          <span className="flex items-center gap-2">
            <input
              id="group"
              name="postingType"
              type="radio"
              className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
              onChange={() => {
                setPostDetails((prev) => ({
                  ...prev,
                  ["postingType"]: "group",
                }));
              }}
              required
              checked={postDetails.postingType === "group"}
            />
            <label
              htmlFor="group"
              className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
            >
              Group
            </label>
          </span>
        </div>
      </div>
      
      {postDetails.postingType === "individual" ? (
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
            onChange={handleChange}
          >
            <option defaultValue={"Select a user"} className="hidden">
              Select a user
            </option>
            {groups?.map((group: customer) => {
              return (
                <>
                  <option key={group._id} value={group._id} className="capitalize">
                    {group.firstName} {group.lastName}
                  </option>
                </>
              );
            })}
          </select>
        </div>
      ) : (
        // <MultiSelectDropdown
        //   options={uniqueCustomerIds}
        //   label="Add Customers: "
        //   placeholder="Choose customers"
        // />
        <div className="items-center gap-6 md:flex">
          <label
            htmlFor="groupId"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
          >
            Choose Group:
          </label>
          <select
            id="groupId"
            name="groupId"
            className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
            defaultValue={"Select a category"}
            onChange={handleGroupChange}
            required
          >
            <option defaultValue={"Select a user"} className="hidden">
              Select a group
            </option>
            {groups?.map((option: any) => (
              <option key={option._id} value={option._id}>{option.groupName} {option.lastName}</option>
            ))}
            
          </select>
        </div>
      )}

    {postDetails.postingType === "individual" ? (

    
      filteredArray && (
        <div className="items-center gap-6 md:flex">
          <label
            htmlFor="savingId"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
          >
            Purpose:
          </label>
          <select
            id="savingId"
            name="savingId"
            className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
            // defaultValue={"Select a user"}
            onChange={(e) => {
              // handleChange(e);
              const { value } = e.target;
              let firstPart = value.split("|")[0];
              let lastPart = value.split("|")[5];

              let purpose = firstPart.split(":")[1];
              let selectedId = lastPart.split(":")[1];

              setPostDetails((prev) => ({
                ...prev,
                ["purposeName"]: purpose.trim(),
              }));
              setPostDetails((prev) => ({
                ...prev,
                ["savingId"]: selectedId.trim(),
              }));
            }}
          >
            <option defaultValue={"Select a Purpose"} className="hidden">
              Select a Purpose
            </option>
            {filteredArray.map((savingId, index) => {
              return (
                <>
                  <option key={index} className="capitalize">
                    {
                      <span className="flex items-center justify-between">
                        <span>Purpose: {savingId.purposeName + " | "}</span>
                        <span>
                          Amount: {AmountFormatter(savingId.amount) + " | "}
                        </span>
                        <span>Frequency: {savingId.frequency + " | "}</span>
                        <span>
                          Start Date:
                          {formatToDateAndTime(savingId.startDate, "date") +
                            " | "}
                        </span>
                        <span>
                          End Date:
                          {formatToDateAndTime(savingId.endDate, "date") +
                            " | "}
                        </span>
                        <span>
                          Id:
                          {savingId.id}
                        </span>
                      </span>
                    }
                  </option>
                </>
              );
            })}
          </select>
        </div>
      )) : ""}
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
      {/* {postDetails.postingType === "individual" && (
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
      )} */}
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
              onChange={() =>
                setPostDetails((prev) => ({
                  ...prev,
                  ["todayPayment"]: "yes",
                }))
              }
              required
              checked={postDetails.todayPayment === "yes"}
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
              onChange={() =>
                setPostDetails((prev) => ({
                  ...prev,
                  ["todayPayment"]: "no",
                }))
              }
              checked={postDetails.todayPayment === "no"}
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
      {postDetails.todayPayment === "no" && (
        <>
          <p className="text-sm text-ajo_offWhite text-opacity-60">
            Payment Coverage Tenure (Kindly select the date range this payment
            is to cover)
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
        </>
      )}
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
  status,
}: {
  postingResponse: postSavingsResponse | undefined;
  status: "success" | "failed" | undefined;
}) => {
  console.log(postingResponse)
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
            {status === "success" ? "Payment Successful" : "Payment Failed"}
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

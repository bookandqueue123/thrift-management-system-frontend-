"use client";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
// import DummyCustomers from "@/api/dummyCustomers.json";
import { useAuth } from "@/api/hooks/useAuth";
import DateRangeComponent from "@/components/DateArrayFile";
import Modal from "@/components/Modal";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import {
  allSavingsResponse,
  customer,
  postSavingsResponse,
  savingsFilteredById,
} from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { extractDate, formatToDateAndTime } from "@/utils/TimeStampFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Posting = () => {
  const organizationId = useSelector(selectOrganizationId);
  const { client } = useAuth();
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "confirmation",
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
        .get(`/api/saving/get-savings?organisation=${organizationId}`, config)
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
            {/* <SearchInput onSearch={() => ("")}/> */}
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
      <input
      onChange={(e) => console.log(12)}
        type="search"
        placeholder="Search"
        className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
      />
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <circle
          cx="8.60996"
          cy="8.10312"
          r="7.10312"
          stroke="#EAEAFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.4121 13.4121L16.9997 16.9997"
          stroke="#EAEAFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </form>
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
  const organizationId = useSelector(selectOrganizationId);

  const { client } = useAuth();

  const [filteredSavingIds, setFilteredSavingIds] =
    useState<savingsFilteredById[]>();
  const [groupId, setGroupId] = useState("");
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
  console.log(postDetails.savingId);
  const [filteredArray, setFilteredArray] = useState<savingsFilteredById[]>([]);
  const [groupSavings, setGroupSavings] = useState<savingsFilteredById[]>([]);

  useEffect(() => {
    // Define a function to filter the array based on postDetails.customerId
    const filterArray = () => {
      if (Savings?.savings) {
        // Check if Savings?.savings is not undefined or null
        const filtered = Savings.savings.filter(
          (item) => item.user._id === groupId,
        );
        console.log(groupId);
        setGroupSavings(filtered);
      } else {
        // Handle case where Savings?.savings is undefined or null
        setGroupSavings([]); // Set filteredArray to an empty array
      }
    };

    filterArray(); // Call the filterArray function
  }, [Savings, groupId]); // Add dependencies to useEffect

  
  useEffect(() => {
    // Define a function to filter the array based on postDetails.customerId
    const filterArray = () => {
      let filterKey = "";
      if (postDetails.postingType === "individual") {
        filterKey = postDetails.customerId;
      } else {
        filterKey = groupId;
      }
      
      if (Savings?.savings) {
        // Check if Savings?.savings is not undefined or null
        const filtered = Savings.savings.filter(
          (item) => item.user._id === filterKey,
        );
        setFilteredArray(filtered);
      } else {
        // Handle case where Savings?.savings is undefined or null
        setFilteredArray([]); // Set filteredArray to an empty array
      }
    };
    filterArray(); // Call the filterArray function
  }, [Savings, postDetails.customerId, groupId, postDetails.postingType]); // Add dependencies to useEffect

  console.log(filteredArray);

  useEffect(() => {
    if (postDetails.customerId) {
      let savingsIds =
        Savings?.savings?.filter(
          (s) => s.user?._id === postDetails.customerId?.split(":")[1]?.trim(),
        ) ?? [];
      setFilteredSavingIds(savingsIds ?? undefined);
    }
  }, [postDetails.customerId]);

  console.log(filteredSavingIds);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setPostDetails((prev) => ({ ...prev, [name]: value }));
  };
  const handleGroupChange = (e: any) => {
    setGroupId(e.target.value);
  };

  useEffect(() => {
    if (postDetails.todayPayment === "yes") {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();

      
      setPostDetails((prev) => ({
        ...prev,
        ["startDate"]: `${year}-${month + 1}-${day}`,
      }));
      setPostDetails((prev) => ({
        ...prev,
        ["endDate"]: `${year}-${month + 1}-${day}`,
      }));
    }
  }, [postDetails.todayPayment]);

  const {
    data: groups,
    isLoading: isUserLoading,
    isError,
  } = useQuery({
    queryKey: ["allgroups", postDetails.postingType],
    queryFn: async () => {
      return client
        .get(
          `/api/user?organisation=${organizationId}&userType=${postDetails.postingType}`,
          {},
        )
        .then((response) => {
         
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  });

  const { mutate: postSavings } = useMutation({
    mutationFn: async () => {
      const datesInRange = DateRangeComponent({
        startDateString: postDetails.startDate,
        endDateString: postDetails.endDate,
      });

      const singleDay = [postDetails.startDate];

      const dateValue =
        postDetails.todayPayment === "yes"
          ? singleDay
          : datesInRange.length === 0
            ? singleDay
            : datesInRange;

      const endpoint =
        postDetails.postingType === "individual"
          ? `/api/saving/post-savings?userId=${postDetails.customerId}&savingId=${postDetails.savingId}`
          : `/api/saving/post-savings?userId=${groupId}&savingId=${postDetails.savingId}`;
      return client.post(endpoint, {
        paidDays: {
          dates: dateValue,
          amount: Number(postDetails.amount.replace(",", "")),
        },
        paymentMode: postDetails.paymentMode,
        narrative: postDetails.narrative,
        // purposeName: postDetails.purposeName,
        // startDate: postDetails.startDate,
        // endDate: postDetails.endDate,
      });
    },
    onSuccess(response: AxiosResponse<postSavingsResponse, any>) {
      console.log(response)
      setPostingResponse(response.data);
      setPostingResponse(
        (prev) =>
          ({
            ...prev,
            ["status"]: "success",
          }) as postSavingsResponse,
      );
      
    },
    onError(error: AxiosError<any, any>) {
      console.log(error)
      setPostingResponse(error.response?.data);
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
  console.log(uniqueCustomerIds);
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
                  <option
                    key={group._id}
                    value={group._id}
                    className="capitalize"
                  >
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
              //   <span key={option._id} className="flex items-center justify-between">
              //   <span>Purpose: {option.purposeName + " | "}</span>
              //   <span>
              //     Amount: {AmountFormatter(option.amount) + " | "}
              //   </span>
              //   <span>Frequency: {option.frequency + " | "}</span>
              //   <span>
              //     Start Date:
              //     {formatToDateAndTime(option.startDate, "date") +
              //       " | "}
              //   </span>
              //   <span>
              //     End Date:
              //     {formatToDateAndTime(option.endDate, "date") +
              //       " | "}
              //   </span>
              //   <span>
              //     Id:
              //     {option.id}
              //   </span>
              // </span>
              <option key={option._id} value={option._id}>
                {option.groupName} {option.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredArray && (
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
                        {/* <span>
                           last paid:
                           {formatToDateAndTime(savingId.endDate, "date")}

                        </span> */}

                        

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
      )}
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

// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import SuccessToaster, { ErrorToaster } from "@/components/toast";
//  // Assuming you have a CustomButton component

// const PostingForm = (
//   {
//       onSubmit,
//       Savings,
//       setPostingResponse,
//     }: {
//       onSubmit: Dispatch<SetStateAction<"form" | "confirmation">>;
//       Savings: void | allSavingsResponse | undefined;
//       setPostingResponse: Dispatch<SetStateAction<postSavingsResponse | undefined>>;
//     }
// ) => {
//   const organizationId = useSelector(selectOrganizationId);
//   const { client } = useAuth();

//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [showErrorToast, setShowErrorToast] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   // const [filteredArray, setFilteredArray] = useState<savingsFilteredById[]>([]);
//   const initialValues = {
//     postingType: 'individual',
//     customerId: '',
//     purposeName: '',
//     amount: '',
//     startDate: '',
//     endDate: '',
//     savingId: '',
//     paymentMode: '',
//     narrative: '',
//     todayPayment: 'no',
//   };
//   const [filteredArray, setFilteredArray] = useState<savingsFilteredById[]>([]);
//   const [customerId, setCustomerId] = useState<string>(''); // Added state for customerId

//   useEffect(() => {
//     // Compare customerId with Savings.customer_id and filter the array
//     if (customerId && Savings) {
//       const filteredData = Savings.savings.filter(saving => saving.user._id === customerId);
//       setFilteredArray(filteredData);
//     } else {
//       setFilteredArray([]);
//     }
//   }, [customerId, Savings]);

//   //   useEffect(() => {
//   //   // Define a function to filter the array based on postDetails.customerId
//   //   const filterArray = () => {
//   //     if (Savings?.savings) { // Check if Savings?.savings is not undefined or null
//   //       const filtered = Savings.savings.filter(item => item.user._id === postDetails.customerId);
//   //       setFilteredArray(filtered);
//   //     } else {
//   //       // Handle case where Savings?.savings is undefined or null
//   //       setFilteredArray([]); // Set filteredArray to an empty array
//   //     }
//   //   };

//   //    filterArray(); // Call the filterArray function
//   //  }, [Savings, postDetails.customerId]);

//   const validationSchema = Yup.object().shape({
//     customerId: Yup.string().required('Customer ID is required'),
//     amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
//     // startDate: Yup.date().when('todayPayment', {
//     //   is: 'no',
//     //   then: Yup.date().required('Start date is required'),
//     //   otherwise: Yup.date(),
//     // }),
//     // endDate: Yup.date().when('todayPayment', {
//     //   is: 'no',
//     //   then: Yup.date().required('End date is required').min(Yup.ref('startDate'), 'End date must be after start date'),
//     //   otherwise: Yup.date(),
//     // }),
//     paymentMode: Yup.string().required('Payment mode is required'),
//     // narrative: Yup.string().required('Narrative is required'),
//   });

//     const {data: groups, isLoading: isUserLoading, isError} = useQuery({
//     queryKey: ["allgroups", initialValues.postingType],
//     queryFn: async () => {
//       return client
//         .get(`/api/user?organisation=${organizationId}&userType=group`, {})
//         .then((response) => {

//           return response.data;
//         })
//         .catch((error) => {
//           console.log(error);
//           throw error;
//         })
//     }
//   })
//   const {data: users, isLoading: getUserLoading, isError:getUserError} = useQuery({
//     queryKey: ["allUsers",],
//     queryFn: async () => {
//       return client
//         .get(`/api/user?organisation=${organizationId}&userType=individual`, {})
//         .then((response) => {

//           return response.data;
//         })
//         .catch((error) => {
//           console.log(error);
//           throw error;
//         })
//     }
//   })

//     const { mutate: postSavings } = useMutation({
//     mutationFn: async (values) => {

//       const endpoint = values.postingType === "individual"
//     ? `/api/saving/post-savings?userId=${values.customerId}&savingId=${values.savingId}`
//     : `/api/saving/post-savings?userId=${values.customerId}`;
//       return client.post(

//         endpoint,
//         {
//           paidDays: {
//             dates: [values.startDate, values.endDate],
//             amount: Number(values.amount.replace(",", "")),
//           },
//           paymentMode: values.paymentMode,
//           narrative: values.narrative,
//           // purposeName: postDetails.purposeName,
//           // startDate: postDetails.startDate,
//           // endDate: postDetails.endDate,
//         },
//       );
//     },
//     onSuccess(response: AxiosResponse<postSavingsResponse, any>) {

//       setPostingResponse(response.data);
//       setPostingResponse(
//         (prev) =>
//           ({
//             ...prev,
//             ["status"]: "success",
//           }) as postSavingsResponse,
//       );
//       console.log(response.data);
//     },
//     onError(error: AxiosError<any, any>) {
//       setPostingResponse(error.response?.data)
//       setPostingResponse(
//         (prev) =>
//           ({
//             ...prev,
//             ["status"]: "failed",
//           }) as postSavingsResponse,
//       );

//       console.log(error?.response?.data);
//     },
//   });

//   const onSubmitHandler = (values) => {
//     console.log(values);
//     console.log(values.customerId)
//     postSavings(values);
//     onSubmit("confirmation");
//   };

//   return (

//     <Formik initialValues={initialValues}
//     validationSchema={validationSchema}

//     // validateOnBlur={true}
//     onSubmit={(values, { setSubmitting }) => {
//       onSubmitHandler(values)

//      }}
//      >
//       {({ isSubmitting, errors, touched, values, setFieldValue, handleChange, handleSubmit}) => (
//         <Form className="mx-auto w-[85%] space-y-3" onSubmit={handleSubmit}>
//           {/* Posting Type */}

//           <div className="items-center gap-6 md:flex">
//             <label htmlFor="postingType" className="m-0 w-[16%] text-xs font-medium text-white">
//               Posting Type:
//             </label>
//             <div id="postingType" className="my-3 flex w-[80%] items-center justify-start gap-8">
//               <span className="flex items-center gap-2">
//                 <Field

//                   id="individual"
//                   name="postingType"
//                   type="radio"
//                   value="individual"
//                   className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
//                   checked={values.postingType === 'individual'}
//                   onChange={() => setFieldValue('postingType', 'individual')}
//                   required
//                 />
//                 <label
//                   htmlFor="individual"
//                   className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
//                 >
//                   Individual
//                 </label>
//               </span>
//               <span className="flex items-center gap-2">
//                 <Field
//                   id="group"
//                   name="postingType"
//                   type="radio"
//                   value="group"
//                   className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
//                   checked={values.postingType === 'group'}
//                   onChange={() => setFieldValue('postingType', 'group')}
//                   required
//                 />
//                 <label
//                   htmlFor="group"
//                   className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
//                 >
//                   Group
//                 </label>
//               </span>
//             </div>
//           </div>

//           {/* Customer ID */}

//           <div className="items-center w-full gap-6 md:flex">

//             <label htmlFor="customerId" className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
//               {values.postingType === 'individual' ? 'Customer ID:' : 'Choose Group:'}
//             </label>
//              <div className="w-[95%]">
//               <div className="">
//                 <Field
//                   onClick={(e) => {
//                     setCustomerId(e.target.value);
//                     // setFilteredArray(e.target.value); // Assuming setSelectedId is a function in your code
//                   }}
//                   handleChange
//                   name="customerId"
//                   id="customerId"
//                   as="select"
//                   className="w-full  rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
//                 >
//                   <option value="" disabled>Select {values.postingType === 'individual' ? 'a user' : 'a group'}</option>
//                   {values.postingType === 'individual' ?
//                     users?.map((option) => (
//                       <option
//                       // onClick={console.log(option._id)}
//                       key={option._id} value={option._id}>{option.groupName} {option.lastName}</option>
//                     ))
//                     :
//                     groups?.map((option) => (
//                       <option key={option._id} value={option._id}>{option.groupName} {option.lastName}</option>
//                     ))
//                   }
//                 </Field>
//             </div>
//             <ErrorMessage name="customerId" component="div" className="text-red-500 text-xs" />
//             </div>
//         </div>

//           {values.postingType === 'individual' && (
//             <div className="items-center gap-6 md:flex">
//               <label htmlFor="savingId" className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
//                 Purpose:
//               </label>
//               <div className="w-[95%]">
//               <div className="">
//               <Field name="savingId" as="select" className="w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]">
//                 <option value="" disabled>Select a Purpose</option>
//                 {filteredArray.map((savingId, index) => (
//                   <option key={index} value={savingId.id}>
//                     {savingId.purposeName} | Amount: {AmountFormatter(savingId.amount)} | Frequency: {savingId.frequency} | Start Date: {formatToDateAndTime(savingId.startDate, 'date')} | End Date: {formatToDateAndTime(savingId.endDate, 'date')}
//                   </option>
//                 ))}
//               </Field>
//               </div>
//               <ErrorMessage name="savingId" component="div" className="text-red-500 text-xs" />
//               </div>
//             </div>
//           )}

//         <div className="items-center gap-6 md:flex">
//          <label
//           htmlFor="amount"
//           className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//           >
//           Amount:
//           </label>

//           <div className="w-[95%]">
//             <div>
//               <Field
//                 id="amount"
//                 name="amount"
//                 type="text"
//                 className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           <ErrorMessage name="amount" component="div" className="text-red-500 text-xs" />
//         </div>
//       </div>

//       <div className="items-center gap-6 md:flex">
//       <label
//         htmlFor="check-group"
//         className="m-0 w-[16%] text-xs font-medium text-white"
//       >
//         Is this payment for today?
//       </label>
//       <div id="check-group" className="my-3 flex w-[80%] items-center justify-start gap-8">
//         <span className="flex items-center gap-2">
//           <Field
//             component="input" // Use Formik's Field with component set to 'input'
//             type="radio"
//             id="yes"
//             name="todayPayment"
//             value="yes"
//             className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
//             onChange={handleChange} // Use handleChange for form updates
//             checked={values.todayPayment === "yes"}
//             required
//           />
//           <label htmlFor="yes" className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium text-ajo_offWhite">
//             Yes
//           </label>
//         </span>
//         <span className="flex items-center gap-2">
//           <Field
//             component="input" // Use Formik's Field with component set to 'input'
//             type="radio"
//             id="no"
//             name="todayPayment"
//             value="no"
//             className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
//             onChange={handleChange} // Use handleChange for form updates
//             checked={values.todayPayment === "no"}
//             required
//           />
//           <label htmlFor="no" className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium text-ajo_offWhite">
//             No
//           </label>
//         </span>
//       </div>
//     </div>

//            {values.todayPayment === "no" && (
//         <>
//           <p className="text-sm text-ajo_offWhite text-opacity-60">
//             Payment Coverage Tenure (Kindly select the date range this payment
//             is to cover)
//           </p>
//           <div className="flex w-full items-center justify-between gap-x-8">
//             <div className="w-[50%] items-center gap-6 md:flex md:w-[60%]">
//               <label
//                 htmlFor="startDate"
//                 className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white md:w-[40%]"
//               >
//                 Start Date:
//               </label>
//               <input
//                 id="startDate"
//                 name="startDate"
//                 type="date"
//                 className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="w-[50%] items-center gap-6 md:flex md:w-[40%]">
//               <label
//                 htmlFor="endDate"
//                 className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//               >
//                 End Date:
//               </label>
//               <input
//                 id="endDate"
//                 name="endDate"
//                 type="date"
//                 className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>
//         </>
//       )}

//         <div className="items-center gap-6 md:flex">

//          <label
//           htmlFor="paymentMode"
//           className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//         >
//           Payment Mode:
//           </label>
//         <div className="w-[95%]">
//           <div>
//             <Field
//               as="select"
//               id="paymentMode"
//               name="paymentMode"
//               className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 capitalize text-[#7D7D7D]"
//               defaultValue={"Select a category"}
//               onChange={handleChange}
//               // required
//             >
//               <option disabled defaultValue={"Filter"} className="hidden">
//                 Select a category
//               </option>
//               <option className="capitalize">online</option>
//               <option className="capitalize">cash</option>
//             </Field>
//           </div>
//            <ErrorMessage name="paymentMode" component="div" className="text-red-500 text-xs" />
//         </div>

//       </div>
//       <div className="items-center gap-6 pb-4 md:flex">
//         <label
//           htmlFor="narrative"
//           className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//         >
//           Narration:
//         </label>
//         <textarea
//           id="narrative"
//           name="narrative"
//           rows={3}
//           className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-sm text-[#7D7D7D]"
//           onChange={handleChange}
//         ></textarea>
//       </div>

//       <div className="flex items-center">
//          <span className="invisible w-[20%]">Submit</span>
//          <div className="flex justify-center md:w-[80%]">
//          <CustomButton
//             type="submit"
//             label="Submit"
//             style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
//             // disabled={isSubmitting}
//           />

//         </div>
//       </div>

//           {/* Toast Messages */}
//           {showSuccessToast && <SuccessToaster message={successMessage || 'Account Created successfully!'} />}
//           {showErrorToast && <ErrorToaster message={errorMessage || 'Error creating organization'} />}

//         </Form>
//       )}
//     </Formik>
//   );
// };

import html2pdf from 'html2pdf.js'; // Add this line

const PostConfirmation = ({
  postingResponse,
  status,
}: {
  postingResponse: postSavingsResponse | undefined;
  status: "success" | "failed" | undefined;
}) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('html2pdf.js').then((module) => {
        const html2pdf = module.default;
        const element = document.getElementById('postConfirmationContent');
        if (element) {
          html2pdf()
            .from(element)
            .toPdf()
            .output('blob')
            .then((blob: SetStateAction<Blob | null>) => {
              setPdfBlob(blob);
            });
        }
      });
    }
  }, []);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'post_confirmation.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handleShare = async () => {
    handleDownload()
    if (navigator.share && pdfBlob) {
      const file = new File([pdfBlob], 'post_confirmation.pdf', { type: 'application/pdf' });
      const shareData = {
        files: [file],
      };

      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.error('Web Share API not supported or PDF Blob not available');
    }
  };

  if (!postingResponse) {
    return <div className="text-white">Loading...</div>;
  }

  
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
    
    <div id="postConfirmationContent" className="mx-auto h-full w-[75%] bg-ajo_offWhite py-8">
      <p className="mb-8 text-center text-3xl font-bold text-black">Posting</p>
      <div className="space-y-4">
        <div className="mx-8 flex  ">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Organisation Name:
          </p>
          <p className="text-sm ml-4 text-[#7D7D7D]"></p>
        </div>

        <div className="mx-8 flex  ">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Customer Name:
          </p>
          <p className="text-sm ml-4 text-[#7D7D7D]"></p>
        </div>

        <div className="mx-8 flex  ">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Customer Account Number:
          </p>
          <p className="text-sm ml-4 text-[#7D7D7D]"></p>
        </div>

        

        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Amount:</p>
          <p className="text-sm ml-4 text-[#7D7D7D]">
            {postingResponse?.updatedSaving ? postingResponse?.updatedSaving.amount: ""} NGN
          </p>
        </div>


        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Time:</p>
          <p className="text-sm ml-4 text-[#7D7D7D]">{postingResponse.updatedSaving ? formatToDateAndTime(postingResponse.updatedSaving.updatedAt) : ""}</p>
        </div>

        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Posted by:</p>
          <p className="text-sm ml-4 text-[#7D7D7D]">{postingResponse.updatedSaving ? postingResponse.updatedSaving._id : ""}</p>
        </div>

        

        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Purpose:</p>
          <p className="text-sm ml-4 capitalize text-[#7D7D7D]">
            {postingResponse?.updatedSaving ? postingResponse?.updatedSaving.purposeName : ""}
          </p>
        </div>

        


        {/* <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Payment:</p>
          <p className="text-sm text-[#7D7D7D]">{postingResponse.}</p>
        </div> */}
        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Start Date:</p>
          <p className="text-sm ml-4 text-[#7D7D7D]">{postingResponse.updatedSaving ? extractDate(postingResponse.updatedSaving.startDate) : ""}</p>
        </div>

        <div className="mx-8 flex">
          <p className="text-sm font-semibold text-[#7D7D7D]">End Date:</p>
          <p className="text-sm ml-4 text-[#7D7D7D]">{postingResponse.updatedSaving ? extractDate(postingResponse.updatedSaving.endDate) : ""}</p>
        </div>
        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Payment Mode:</p>
          <p className="text-sm ml-4 text-[#7D7D7D]">
          
          </p>
        </div>
        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Narration:</p>
          <p className="text-sm ml-4 text-[#7D7D7D]">{postingResponse?.message}</p>
        </div>
        <div className="mx-8 flex ">
          <p className="text-sm  font-semibold text-[#7D7D7D]">Status:</p>
          <p
            className={`text-sm ml-4 font-bold ${status === "success" ? "text-successText" : "text-errorText"}`}
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
          onButtonClick={() => handleDownload()}
        />
        <CustomButton
          type="button"
          label="Share"
          style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 w-1/2"
         onButtonClick={() => handleShare()}
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

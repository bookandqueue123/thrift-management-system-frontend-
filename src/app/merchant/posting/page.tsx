"use client";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
// import DummyCustomers from "@/api/dummyCustomers.json";
import { useAuth } from "@/api/hooks/useAuth";
import DateRangeComponent from "@/components/DateArrayFile";
import Modal from "@/components/Modal";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import {
  FormErrors,
  FormValues,
  allSavingsResponse,
  customer,
  postSavingsResponse,
  savingsFilteredById,
} from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import {
  extractDate,
  extractTime,
  formatToDateAndTime,
} from "@/utils/TimeStampFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CiExport } from "react-icons/ci";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";

const Posting = () => {
  const PAGE_SIZE = 5;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const organizationId = useSelector(selectOrganizationId);
  const { client } = useAuth();
  const [modalState, setModalState] = useState(false);
  const [filteredSavings, setFilteredSavings] = useState<allSavingsResponse[]>(
    [],
  );
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "confirmation",
  );
  const [currentPage, setCurrentPage] = useState(1);
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
        .then((response) => {
          console.log("allSavingsSuccess: ", response.data);
          setFilteredSavings(response.data.savings);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error.response);
          throw error;
        });
    },
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // setSearchResult(e.target.value);
    console.log(e.target.value);

    console.log(allSavings.savings);
    if (allSavings) {
      const filtered = allSavings.savings.filter(
        (item: { [x: string]: any; accountNumber: any }) =>
          String(item.user.accountNumber).includes(String(e.target.value)),
      );
      // Update the filtered data state
      setFilteredSavings(filtered);
    }
  };

  const handleDateFilter = () => {
    // Filter the data based on the date range
    if (allSavings) {
      const filtered = allSavings.savings.filter(
        (item: { createdAt: string | number | Date }) => {
          const itemDate = new Date(item.createdAt); // Convert item date to Date object
          const startDateObj = new Date(fromDate);
          const endDateObj = new Date(toDate);

          return itemDate >= startDateObj && itemDate <= endDateObj;
        },
      );

      // Update the filtered data state
      setFilteredSavings(filtered);
    }
  };

  const handleFromDateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setToDate(event.target.value);

    handleDateFilter();
  };

  const paginatedSavings = filteredSavings?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allSavings) {
    totalPages = Math.ceil(allSavings.savings.length / PAGE_SIZE);
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  console.log(paginatedSavings);
  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Posting
        </p>
      </div>
      <div className="mb-4">
        <p className="text-xl text-white">Customer List</p>
      </div>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            {/* <SearchInput onSearch={() => ("")}/> */}
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
              <input
                onChange={handleSearch}
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

        <div className="my-8 justify-between md:flex">
          <div className="flex items-center">
            <p className="font-lg mr-2 text-white">Select range from:</p>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />

            <p className="mx-2 text-white">to</p>
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mt-4 flex">
            <button className="mr-4 flex rounded border border-white bg-transparent px-4 py-2 font-medium text-white hover:border-transparent hover:bg-blue-500 hover:text-white">
              Export as CSV{" "}
              <span className="ml-2 mt-1">
                <CiExport />
              </span>
            </button>
            <button className="relative rounded-md border-none bg-transparent px-4 py-2 text-white">
              <u>Export as Excel</u>
            </button>
          </div>
        </div>

        <div>
          <TransactionsTable
            headers={[
              "Customer Name",
              "Account Number",
              "Transaction ID",
              "Purpose",
              "Email Address",
              "Phone Number",
              "Time",
              "State",
              "Local Govt Area",
              "Posted By",
              "Payment Mode",
              "Status",
              "Start Date",
              "End Date",
              "Action",
            ]}
            content={paginatedSavings?.map((savings, index) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.firstName + " " + savings.user.lastName ||
                    "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.accountNumber || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {/* {customer.transaction_id || "----"} */}
                  {savings._id || "-----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.purposeName || "-----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.phoneNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {extractTime(savings.updatedAt || "-----")}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.state || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.user.lga || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  Posted By
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  Payment Mode
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {savings.isPaid || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {extractDate(savings.startDate) || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {extractDate(savings.endDate) || "----"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator label={"View Details"} />
                </td>
              </tr>
            ))}
          />

          <div className="flex items-center justify-center  space-x-2">
            <button
              className="rounded-md border border-blue-500 p-2 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={goToPreviousPage}
            >
              <MdKeyboardArrowLeft />
            </button>

            <button
              className="cursor-pointer  rounded-md p-2 text-blue-500 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={() => setCurrentPage(currentPage)}
            >
              {currentPage}
            </button>

            <button
              className="cursor-pointer  rounded-md p-2 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {currentPage + 1}
            </button>
            <button
              className="cursor-pointer  rounded-md p-2 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={() => setCurrentPage(currentPage + 2)}
            >
              {currentPage + 2}
            </button>

            <button
              className="rounded-md border border-blue-500 p-2 hover:bg-blue-100 focus:border-blue-300 focus:outline-none focus:ring"
              onClick={goToNextPage}
            >
              <MdKeyboardArrowRight />
            </button>

            {/* <button
                className="p-2 bg-white rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
                onClick={() => dispatch(setCurrentPage(currentPage + 6))}
              >
                {currentPage + 6}
              </button> */}
          </div>
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

  const initialValues = {
    customerId: "",
    groupId: "",
    amount: "",
    startDate: "",
    endDate: "",
    savingId: "",
    paymentMode: "",
  };

  // Input Validation States
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (
    name: string,
    value: string,
    formValues: { [key: string]: any },
    postingType: "individual" | "group",
    todayPayment: "yes" | "no",
  ) => {
    switch (name) {
      // case "customerId":
      //   if (!value) return "Customer ID is required";
      //   break;
      // case "groupId":
      //   if (!value) return "Group ID is required";
      //   break;
      case "customerId":
        if (postingType === "individual" && !value)
          return "Customer ID is required";
        if (postingType !== "individual" && value)
          return "Customer ID should not be filled for groups";
        break;
      case "groupId":
        if (postingType !== "individual" && !value)
          return "Group ID is required";
        if (postingType === "individual" && value)
          return "Group ID should not be filled for individuals";
        break;
      case "amount":
        if (!value) return "Amount is required";
        if (isNaN(Number(value))) return "Amount must be a number";
        break;
      case "startDate":
      case "endDate":
        if (todayPayment === "no" && !value) return "Date is required";
        if (todayPayment !== "no" && value)
          return "Date should not be filled for today's payment.";
        break;
      case "savingId":
        if (!value) return "Purpose is required";
        break;
      case "paymentMode":
        if (!value) return "Payment mode is required";
        break;

      default:
        return "";
    }

    if (postingType === "individual" && !!formValues.groupId === true) {
      return "Group ID should be empty for individuals";
    }
    if (postingType !== "individual" && !!formValues.customerId === true) {
      return "Customer ID should be empty for groups";
    }
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
        formValues,
        postDetails.postingType as "individual" | "group",
        postDetails.todayPayment as "no" | "yes",
      ),
    });
    setPostDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: validateField(
        name,
        value,
        formValues,
        postDetails.postingType as "individual" | "group",
        postDetails.todayPayment as "no" | "yes",
      ),
    });
    setGroupId(e.target.value);
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
        formValues,
        postDetails.postingType as "individual" | "group",
        postDetails.todayPayment as "no" | "yes",
      ),
    });
  };

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

  // const handleChange = (e: { target: { name: any; value: any } }) => {
  //   const { name, value } = e.target;
  //   setPostDetails((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleGroupChange = (e: any) => {
  //   setGroupId(e.target.value);
  // };

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

  const { mutate: postSavings, isPending: isPostingSavings } = useMutation({
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
      console.log(response);
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
      console.log(error);
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

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    const newErrors: FormErrors = {};

    Object.keys(formValues).forEach((key) => {
      const error = validateField(
        key,
        formValues[key],
        formValues,
        postDetails.postingType as "individual" | "group",
        postDetails.todayPayment as "no" | "yes",
      );
      if (error) {
        isValid = false;
        newErrors[key] = error;
      }
    });

    setFormErrors((prevErrors) => {
      return newErrors;
    });

    // console.log(formErrors);

    if (isValid) {
      postSavings();
      onSubmit("confirmation");
      console.log("Form is valid, submitting...");
    } else {
      console.log("Form is invalid, showing errors...");
    }
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
        <span className="w-full">
          {" "}
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
                onChange={(e) => {
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
                onChange={(e) => {
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
        </span>
      </div>

      {postDetails.postingType === "individual" ? (
        <div className="items-center gap-6 md:flex">
          <label
            htmlFor="customerId"
            className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
          >
            Customer ID:
          </label>
          <span className="w-full">
            <select
              id="customerId"
              name="customerId"
              className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
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
            {(isTouched.customerId || formErrors.customerId) && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                {formErrors.customerId}
              </p>
            )}
          </span>
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
          <span className="w-full">
            <select
              id="groupId"
              name="groupId"
              className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
              defaultValue={"Select a category"}
              onChange={handleGroupInputChange}
              onFocus={handleInputFocus}
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
            {(isTouched.groupId || formErrors.groupId) && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                {formErrors.groupId}
              </p>
            )}
          </span>
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
          <span className="w-full">
            <select
              id="savingId"
              name="savingId"
              className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
              // defaultValue={"Select a user"}
              onChange={(e) => {
                // handleChange(e);
                const { name, value } = e.target;
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
                setFormValues({ ...formValues, [name]: value });
                setFormErrors({
                  ...formErrors,
                  [name]: validateField(
                    name,
                    value,
                    formValues,
                    postDetails.postingType as "individual" | "group",
                    postDetails.todayPayment as "no" | "yes",
                  ),
                });
              }}
              onFocus={handleInputFocus}
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
            {(isTouched.savingId || formErrors.savingId) && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                {formErrors.savingId}
              </p>
            )}
          </span>
        </div>
      )}
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="amount"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Amount:
        </label>
        <span className="w-full">
          <input
            id="amount"
            name="amount"
            type="text"
            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            onChange={handleInputChange}
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
        <span className="w-full">
          {" "}
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
                onChange={(e) => {
                  setPostDetails((prev) => ({
                    ...prev,
                    ["todayPayment"]: "yes",
                  }));
                }}
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
                onChange={(e) => {
                  setPostDetails((prev) => ({
                    ...prev,
                    ["todayPayment"]: "no",
                  }));
                }}
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
        </span>
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
              <span className="w-full">
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
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
                  className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
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
        </>
      )}
      <div className="items-center gap-6 md:flex">
        <label
          htmlFor="paymentMode"
          className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
        >
          Payment Mode:
        </label>
        <span className="w-full">
          <select
            id="paymentMode"
            name="paymentMode"
            className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 capitalize text-[#7D7D7D]"
            defaultValue={"Select a category"}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            required
          >
            <option disabled defaultValue={"Filter"} className="hidden">
              Select a category
            </option>
            <option className="capitalize">online</option>
            <option className="capitalize">cash</option>
          </select>
          {(isTouched.paymentMode || formErrors.paymentMode) && (
            <p className="mt-2 text-sm font-semibold text-red-600">
              {formErrors.paymentMode}
            </p>
          )}
        </span>
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
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="flex items-center">
        <span className="invisible w-[20%]">Submit</span>
        <div className="flex justify-center md:w-[80%]">
          <CustomButton
            type="button"
            label={isPostingSavings ? "Posting Savings" : "Submit"}
            style={`rounded-md ${isPostingSavings ? "bg-gray-400 hover:bg-gray-400 focus:bg-gray-400" : "bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500"} py-3 px-9 text-sm text-ajo_offWhite md:w-[60%]`}
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
  console.log(postingResponse);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("html2pdf.js").then((module) => {
        const html2pdf = module.default;
        const element = document.getElementById("postConfirmationContent");
        if (element) {
          html2pdf()
            .from(element)
            .toPdf()
            .output("blob")
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
      const a = document.createElement("a");
      a.href = url;
      a.download = "post_confirmation.pdf";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handleShare = async () => {
    handleDownload();
    if (navigator.share && pdfBlob) {
      const file = new File([pdfBlob], "post_confirmation.pdf", {
        type: "application/pdf",
      });
      const shareData = {
        files: [file],
      };

      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.error("Web Share API not supported or PDF Blob not available");
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
    <div
      id="postConfirmationContent"
      className="mx-auto h-full w-[75%] bg-ajo_offWhite py-8"
    >
      <p className="mb-8 text-center text-3xl font-bold text-black">Posting</p>
      <div className="space-y-4">
        <div className="mx-8 flex  ">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Organisation Name:{" "}
            {postingResponse.updatedSaving
              ? postingResponse.updatedSaving.postedBy.organisationName
              : ""}
          </p>
          <p className="ml-4 text-sm text-[#7D7D7D]"></p>
        </div>

        <div className="mx-8 flex  ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Customer Name:</p>
          <p className="ml-4 text-sm text-[#7D7D7D]"></p>
        </div>

        <div className="mx-8 flex  ">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Customer Account Number:{" "}
            {postingResponse.updatedSaving
              ? postingResponse.updatedSaving.postedBy.accountNumber
              : ""}
          </p>
          <p className="ml-4 text-sm text-[#7D7D7D]"></p>
        </div>

        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Amount:</p>
          <p className="ml-4 text-sm text-[#7D7D7D]">
            {postingResponse?.updatedSaving
              ? postingResponse?.updatedSaving.amountPaid
              : ""}{" "}
            NGN
          </p>
        </div>

        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Time:</p>
          <p className="ml-4 text-sm text-[#7D7D7D]">
            {postingResponse.updatedSaving
              ? extractTime(postingResponse.updatedSaving.saving.updatedAt)
              : ""}
          </p>
        </div>

        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Posted by:</p>
          <p className="ml-4 text-sm text-[#7D7D7D]">
            {postingResponse.updatedSaving
              ? postingResponse.updatedSaving.postedBy.organisationName
              : ""}
          </p>
        </div>

        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Purpose:</p>
          <p className="ml-4 text-sm capitalize text-[#7D7D7D]">
            {postingResponse?.updatedSaving
              ? postingResponse?.updatedSaving.saving.purposeName
              : ""}
          </p>
        </div>

        {/* <div className="mx-auto flex items-center justify-between md:w-[40%]">
          <p className="text-sm font-semibold text-[#7D7D7D]">Payment:</p>
          <p className="text-sm text-[#7D7D7D]">{postingResponse.}</p>
        </div> */}
        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Start Date:</p>
          <p className="ml-4 text-sm text-[#7D7D7D]">
            {postingResponse.updatedSaving
              ? extractDate(postingResponse.updatedSaving.saving.startDate)
              : ""}
          </p>
        </div>

        <div className="mx-8 flex">
          <p className="text-sm font-semibold text-[#7D7D7D]">End Date:</p>
          <p className="ml-4 text-sm text-[#7D7D7D]">
            {postingResponse.updatedSaving
              ? extractDate(postingResponse.updatedSaving.saving.endDate)
              : ""}
          </p>
        </div>
        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">
            Payment Mode:{" "}
            {postingResponse.updatedSaving
              ? postingResponse.updatedSaving.paymentMode
              : ""}
          </p>
          <p className="ml-4 text-sm text-[#7D7D7D]"></p>
        </div>
        <div className="mx-8 flex ">
          <p className="text-sm font-semibold text-[#7D7D7D]">Narration:</p>
          <p className="ml-4 text-sm text-[#7D7D7D]">
            {postingResponse?.message}
          </p>
        </div>
        <div className="mx-8 flex ">
          <p className="text-sm  font-semibold text-[#7D7D7D]">Status:</p>
          <p
            className={`ml-4 text-sm font-bold ${status === "success" ? "text-successText" : "text-errorText"}`}
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

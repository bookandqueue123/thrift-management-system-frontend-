"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import StatesAndLGAs from "@/api/statesAndLGAs.json";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import {
  CustomerSignUpProps,
  FormErrors,
  FormValues,
  MyFileList,
  StateProps,
  UpdateKycProps,
  customer,
  getOrganizationProps,
  setSavingsResponse,
} from "@/types";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CiExport } from "react-icons/ci";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import ninslip from "../../../../public/NIN.svg";

const initialValues: CustomerSignUpProps = {
  firstName: "",
  lastName: "",
  otherName: "",
  phoneNumber: "",
  homeAddress: "",
  countryOfResidence: "",
  IdImage: null,
  state: "",
  lga: "",
  city: "",
  email: "",
  nin: "",
  ninslip: null,
  bvn: "",
  password: "",
  confirmPassword: "",
  organization: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phoneNumber: Yup.string()
    .matches(
      /^(?:\+234\d{10}|\d{11})$/,
      "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
    )
    .required("Phone number is required"),
  homeAddress: Yup.string().required("Home Address is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  organization: Yup.string().required("Organization is required"),
});

const Customers = () => {
  const PAGE_SIZE = 5;
  const { userPermissions, permissionsMap } = usePermissions();
    const [permissionError, setPermissionError] = useState("");


  const [isCustomerCreated, setIsCustomerCreated] = useState(false);
  const [searchResult, setSearchResult] = useState("");
  const [filteredCustomers, setFilteredCustomer] = useState<customer[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { client } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [modalToShow, setModalToShow] = useState<
    "view" | "savings" | "edit" | "create-customer" | ""
  >("");
  const [customerToBeEdited, setCustomerToBeEdited] = useState("");
  const organisationId = useSelector(selectOrganizationId);

  const [openDropdown, setOpenDropdown] = useState<number>(0);
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
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  const {
    data: allCustomers,
    isLoading: isLoadingAllCustomers,
    refetch,
  } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&organisation=${organisationId}&userType=individual`,
          {},
        ) //populate this based onthee org
        .then((response: AxiosResponse<customer[], any>) => {
          // console.log(response);
          setFilteredCustomer(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          if (error.response?.data.message.includes("unauthorized")) {
            setPermissionError(error.response?.data.message);
          }
          console.log(error);
          throw error;
        });
    },
    staleTime: 5000,
  });
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.target.value);
    console.log(e.target.value);

    if (allCustomers) {
      const filtered = allCustomers.filter((item) =>
        String(item.accountNumber).includes(String(e.target.value)),
      );
      // Update the filtered data state
      setFilteredCustomer(filtered);
    }
  };
  const handleDateFilter = () => {
    // Filter the data based on the date range
    if (allCustomers) {
      const filtered = allCustomers.filter((item) => {
        const itemDate = new Date(item.createdAt); // Convert item date to Date object
        const startDateObj = new Date(fromDate);
        const endDateObj = new Date(toDate);

        return itemDate >= startDateObj && itemDate <= endDateObj;
      });

      // Update the filtered data state
      setFilteredCustomer(filtered);
    }
  };

  const paginatedCustomers = filteredCustomers?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allCustomers) {
    totalPages = Math.ceil(allCustomers.length / PAGE_SIZE);
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

  useEffect(() => {
    // Calling refetch to rerun the allCustomers query
    refetch();
  }, [isCustomerCreated, refetch]);

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
            <FilterDropdown
              options={[
                "Account Number",
                "Customer Name",
                "Email Address",
                // "Phone",
                // "Channel",
                // "Amount",
                // "Status",
              ]}
            />

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
          </span>
          {userPermissions.includes(permissionsMap["create-customer"]) && (
            <CustomButton
              type="button"
              label="Create New Customer"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-customer");
              }}
            />
          )}
        </div>

        <div className="my-8">
          <label
            htmlFor="fromDate"
            className="mb-2 text-sm font-semibold text-white"
          >
            Select range from:
          </label>
          <div className="justify-between space-y-2 md:flex">
            <div className="flex items-center">
              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
              />

              <label htmlFor="toDate" className="mx-2 text-white">
                to
              </label>
              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={handleToDateChange}
                className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
              />
            </div>
            {userPermissions.includes(permissionsMap["export-saving"]) && (
              <div className="mt-4 flex">
                <button className="mr-4 flex rounded border border-ajo_offWhite bg-transparent px-4 py-2 font-medium text-ajo_offWhite hover:border-transparent hover:bg-blue-500 hover:text-ajo_offWhite">
                  Export as CSV{" "}
                  <span className="ml-2 mt-1">
                    <CiExport />
                  </span>
                </button>
                <button className="relative rounded-md border-none bg-transparent px-4 py-2 text-white">
                  <u>Export as Excel</u>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* <p className="mb-2 text-xl text-white">Customer List</p> */}

        <div>
          <TransactionsTable
            headers={[
              "Customer Name",
              "Account Number",
              "Account Created On",
              "Email Address",
              "Phone Number",
              "Country",
              "State",
              "Local Govt Area",
              "City/Town",
              "Organisation",
              "Action",
            ]}
            content={
              paginatedCustomers?.length === 0 ? (
                <tr>
                  <p className="relative left-[80%] text-center text-sm font-semibold text-ajo_offWhite md:left-[250%] ">
                    {!permissionError ? "No Customers yet" :  permissionError + ", contact your admin for permissions"}
                  </p>
                </tr>
              ) : (
                paginatedCustomers?.map((customer, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.firstName + " " + customer.lastName || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.accountNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {extractDate(customer.createdAt) || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.email || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.phoneNumber || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.country || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.state || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.lga || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.city || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {customer.organisation || "----"}
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
                              setModalState(true);
                              setModalContent("form");
                              setModalToShow("view");
                              setCustomerToBeEdited(customer._id);
                              console.log("View Customer");
                            },
                            () => {
                              setModalToShow("edit");
                              setModalState(true);
                              setModalContent("form");

                              setCustomerToBeEdited(customer._id);
                            },
                            () => {
                              setModalState(true);
                              setModalToShow("savings");
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
                ))
              )
            }
          />
          {modalState && (
            <Modal
              setModalState={setModalState}
              title={
                modalContent === "confirmation"
                  ? ""
                  : modalToShow === "view"
                    ? "View Customer"
                    : modalToShow === "edit"
                      ? "Edit Customer"
                      : modalToShow === "savings"
                        ? "Savings Set Up"
                        : modalToShow === "create-customer"
                          ? "Create Customer"
                          : ""
              }
            >
              {modalToShow === "view" ? (
                <ViewCustomer
                  customerId={customerToBeEdited}
                  setContent={setModalContent}
                  content={
                    modalContent === "confirmation" ? "confirmation" : "form"
                  }
                  closeModal={setModalState}
                />
              ) : modalToShow === "savings" ? (
                <SavingsSettings
                  customerId={customerToBeEdited}
                  setContent={setModalContent}
                  content={
                    modalContent === "confirmation" ? "confirmation" : "form"
                  }
                  closeModal={setModalState}
                />
              ) : modalToShow === "edit" ? (
                <EditCustomer
                  customerId={customerToBeEdited}
                  setContent={setModalContent}
                  content={
                    modalContent === "confirmation" ? "confirmation" : "form"
                  }
                  closeModal={setModalState}
                />
              ) : modalToShow === "create-customer" ? (
                <>
                  {!isCustomerCreated ? (
                    <div className="px-[10%]">
                      <CreateCustomer
                        setCloseModal={setModalState}
                        setCustomerCreated={setIsCustomerCreated}
                      />
                    </div>
                  ) : (
                    <ModalConfirmation
                      successTitle="Customer creation successful"
                      errorTitle="Customer Creation Failed"
                      status={isCustomerCreated ? "success" : "failed"}
                      responseMessage=""
                    />
                  )}
                </>
              ) : (
                ""
              )}
            </Modal>
          )}
          <div className="flex justify-center">
            <PaginationBar
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
            {/* <PaginationBar apiResponse={DummyCustomers} /> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Customers;

interface ShowModalProps {
  customerId: string;
  setContent: Dispatch<SetStateAction<"form" | "confirmation">>;
  content: "form" | "confirmation";
  closeModal: Dispatch<SetStateAction<boolean>>;
}

export const SavingsSettings = ({
  customerId,
  setContent,
  content,
  closeModal,
}: ShowModalProps) => {
  const { client } = useAuth();
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
    frequency: "",
    users: [] as string[],
  });

  const initialValues = {
    purposeName: "",
    amount: "",
    startDate: "",
    endDate: "",
    collectionDate: "",
    frequency: "",
  };

  // Input Validation States
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "purposeName":
        if (!value) return "Savings purpose is required";
        break;
      case "amount":
        if (!value) return "Amount is required";
        if (isNaN(Number(value))) return "Amount must be a number";
        if (Number(value) <= 0) return "Amount must be greater than zero";
        break;
      case "startDate":
      case "endDate":
      case "collectionDate":
        if (!value) return "Date is required";
        // To add additional date validation if necessary
        break;
      case "frequency":
        if (!value) return "Frequency is required";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: validateField(name, value) });
    setSaveDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setIsTouched({ ...isTouched, [name]: true });
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: validateField(name, value) });
  };

  const { mutate: setSavings, isPending: isSettingSavings } = useMutation({
    mutationKey: ["set Savings"],
    mutationFn: async () => {
      return client.post(`/api/saving/`, {
        purposeName: saveDetails.purposeName,
        amount: Number(saveDetails.amount.replace(/\D/g, "")),
        startDate: saveDetails.startDate,
        endDate: saveDetails.endDate,
        collectionDate: saveDetails.collectionDate,
        organisation: customerInfo?.organisation,
        frequency: saveDetails.frequency,
        users: saveDetails.users,
      });
    },
    onSuccess(response: AxiosResponse<setSavingsResponse, any>) {
      console.log(response.data);
      setContent("confirmation");
      return response.data;
    },
    onError(error: AxiosError<any, any>) {
      console.log(error.response);
      throw error;
    },
  });

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    const newErrors: FormErrors = {};

    Object.keys(formValues).forEach((key) => {
      const error = validateField(key, formValues[key]);
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
    } else {
      console.log("Form is invalid, showing errors...");
    }

    if (!saveDetails.users.includes(customerId)) {
      setSaveDetails((prev) => ({
        ...prev,
        users: [...prev.users, customerId],
      }));
    }
    setSavings();
  };

  return (
    <div>
      {content === "confirmation" ? (
        <div className="mx-auto mt-[10%] flex h-full w-1/2 flex-col items-center justify-center space-y-8">
          <Image
            src="/check-circle.svg"
            alt="check-circle"
            width={162}
            height={162}
            className="w-[6rem] md:w-[10rem]"
          />
          <p className="whitespace-nowrap text-ajo_offWhite">
            Savings Settings Successful
          </p>
          <CustomButton
            type="button"
            label="Close"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[40%]"
            onButtonClick={() => closeModal(false)}
          />
        </div>
      ) : (
        <>
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
                  <span className="font-normal">
                    {customerInfo?.phoneNumber}
                  </span>
                </p>
              </span>
              <span className="space-y-2">
                <p className="overflow-hidden text-nowrap pt-2 text-sm font-semibold text-ajo_offWhite md:pt-0 md:text-base">
                  Email address:{" "}
                  <span className="font-normal">{customerInfo?.email}</span>
                </p>
                <p className="overflow-hidden text-nowrap text-sm font-semibold text-ajo_offWhite md:text-base">
                  State:{" "}
                  <span className="font-normal">{customerInfo?.state}</span>
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
              <span className="w-full">
                <input
                  id="purposeName"
                  name="purposeName"
                  type="text"
                  value={formValues.purposeName}
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
                    const input = event.target.value.replace(/\D/g, "");
                    const formatted = Number(input).toLocaleString();
                    setSaveDetails((prev) => ({
                      ...prev,
                      ["amount"]: formatted,
                    }));
                    handleInputChange(event);
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
                  defaultValue={"Select a category"}
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
                  label={isSettingSavings ? "Setting Savings" : "Submit"}
                  style={`rounded-md ${isSettingSavings ? "bg-gray-400 hover:bg-gray-400 focus:bg-gray-400" : "bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500"} py-3 px-9 text-sm text-ajo_offWhite md:w-[60%]`}
                  onButtonClick={onSubmitHandler}
                />
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export const ViewCustomer = ({
  customerId,
  setContent,
  content,
  closeModal,
}: ShowModalProps) => {
  // console.log(customerId);

  const { client } = useAuth();
  const { data: customerInfo, isLoading: isLoadingCustomerInfo } = useQuery({
    queryKey: ["customerInfo"],
    queryFn: async () => {
      return client
        .get(`/api/user/${customerId}`)
        .then((response: AxiosResponse<customer, any>) => {
          // console.log(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error.response ?? error.message);
          throw error;
        });
    },
  });

  return (
    <div>
      <div className="mx-auto mt-8 w-[100%] overflow-hidden rounded-md bg-white p-4 shadow-md">
        {/* Image and First Batch of Details Section */}
        <p className="mb-8 mt-2 text-xl font-bold text-gray-600">
          Customer Details
        </p>
        <div className="rounded-lg md:border">
          <div className="p-6 md:flex ">
            <div className="mr-6 md:w-1/6 ">
              <Image
                src={customerInfo ? customerInfo?.photo : ""}
                alt="Customer"
                width={200}
                height={100}
                className="rounded-md"
              />
            </div>
            <div className="flex w-5/6 flex-wrap md:ml-4">
              <div className="mb-2 mt-2 w-full md:w-1/2">
                <p className="font-semibold text-gray-600">
                  Name:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.firstName : ""}{" "}
                    {customerInfo ? customerInfo.lastName : ""}
                  </span>
                </p>
                {/* <p className="text-gray-900">John Doe</p> */}
              </div>
              <div className="mb-2 w-full md:w-1/2  md:pl-8">
                <p className="font-semibold text-gray-600">
                  Phone Number:{" "}
                  <span className="font-normal md:pl-8">
                    {customerInfo ? customerInfo.phoneNumber : ""}
                  </span>
                </p>
                {/* <p className="text-gray-900">123-456-7890</p> */}
              </div>
              <div className="mb-2 w-full md:w-1/2">
                <p className="font-semibold text-gray-600">
                  Email Address:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.email : ""}
                  </span>
                </p>
                {/* <p className="text-gray-900">johndoe@example.com</p> */}
              </div>
              <div className="mb-2 w-full md:w-1/2 md:pl-8">
                <p className="font-semibold text-gray-600">
                  Country of Residence:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.country : "N/A"}
                  </span>
                </p>
                {/* <p className="text-gray-900">United States</p> */}
              </div>
              <div className="mb-4 w-full">
                <p className="font-semibold text-gray-600">
                  Home Address:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.homeAddress : "N/A"}
                  </span>
                </p>
                {/* <p className="text-gray-900">123 Main St, City</p> */}
              </div>
            </div>
          </div>

          {/* Second Batch of Details Section */}
          <div className="p-6 ">
            <div className="mb-4 flex flex-wrap">
              <div className="w-full sm:w-1/3">
                <p className="font-semibold text-gray-600">
                  State:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.state : "N/A"}
                  </span>
                </p>
                {/* <p className="text-gray-900">California</p> */}
              </div>
              <div className="w-full sm:w-1/3">
                <p className="font-semibold text-gray-600">
                  LGA:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.lga : "N/A"}
                  </span>
                </p>
                {/* <p className="text-gray-900">Local Government Area</p> */}
              </div>
              <div className="w-full sm:w-1/3">
                <p className="font-semibold text-gray-600">
                  City:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.city : "N/A"}
                  </span>
                </p>
                {/* <p className="text-gray-900">City Name</p> */}
              </div>
            </div>
            <div className="mb-4 flex flex-wrap">
              <div className="w-full sm:w-1/3">
                <p className="font-semibold text-gray-600">
                  NIN:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.nin : "N/A"}
                  </span>
                </p>
                {/* <p className="text-gray-900">1234567890</p> */}
              </div>
              <div className="w-full sm:w-1/3">
                <p className="font-semibold text-gray-600">
                  BVN:{" "}
                  <span className="font-normal">
                    {customerInfo ? customerInfo.bvn : "N/A"}
                  </span>
                </p>
                {/* <p className="text-gray-900">1234567890</p> */}
              </div>
            </div>
          </div>
        </div>

        <div className=" mt-8 rounded-lg text-gray-600">
          <div className="md:flex ">
            <div className="w-[60%] rounded-lg p-6 md:border">
              <p className="mb-8 mt-2 text-xl font-bold">Next of Kin Details</p>

              <div>
                <div className="mb-4  w-full ">
                  <p className="font-bold">
                    Name:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.nok : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">John Doe</p> */}
                </div>

                <div className="mb-4  w-full ">
                  <p className=" font-bold">
                    Phone Number:{" "}
                    <span className="pl-8 font-normal">
                      {customerInfo ? customerInfo.nokPhone : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>

                <div className="mb-4  w-full ">
                  <p className=" font-bold">
                    Relationship:{" "}
                    <span className="pl-8 font-normal">
                      {customerInfo ? customerInfo.nokRelationship : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>

                <div className="mb-4  w-full ">
                  <p className=" font-bold">
                    Home Address:{" "}
                    <span className="pl-8 font-normal">{"N/A"}</span>
                  </p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>
              </div>
            </div>

            <div className="border p-6 md:ml-8 md:w-[40%]">
              <p className="mb-8 mt-2 text-xl font-bold">
                Means Of ID: {customerInfo?.meansOfID ?? ""}
              </p>

              <div className="">
                <Image
                  src={customerInfo?.meansOfIDPhoto ?? ninslip}
                  alt="Customer"
                  width={270}
                  height={165}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditCustomer = ({
  customerId,
  setContent,
  content,
  closeModal,
}: ShowModalProps) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLGAArray, setSelectesLGAArray] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStateArray, setselectedStateArray] = useState<StateProps[]>(
    [],
  );
  const [selectedState, setSelectedState] = useState("");

  const { client } = useAuth();
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

  const {
    data: organizations,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganizations"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=organisation`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  });

  const {
    mutate: updateUserInfo,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["user update"],
    mutationFn: async (values: UpdateKycProps) => {
      const formData = new FormData();

      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("otherName", values.otherName);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("email", values.email);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("lga", values.lga);
      formData.append("city", values.city);
      // formData.append("popularMarket", values.popularMarket);
      // formData.append("nok", values.nok);
      // formData.append("nokRelationship", values.nokRelationship);
      // formData.append("nokPhone", values.nokPhone);
      formData.append("homeAddress", values.homeAddress);
      // formData.append("userType", values.userType);
      formData.append("organisation", values.organisation);
      formData.append("nin", values.nin);
      formData.append("bvn", values.bvn);
      // formData.append("meansOfID", values.meansOfID);
      formData.append("bankAcctNo", values.bankAcctNo);
      // Append images
      if (values.photo) {
        formData.append("photo", values.photo[0]); // Assuming photo is an array of File objects
      }
      if (!values.photo) {
        formData.append("photo", customerInfo?.photo); // Assuming photo is an array of File objects
      }

      if (values.meansOfIDPhoto) {
        formData.append("meansOfIDPhoto", values.meansOfIDPhoto[0]);
      }
      if (values.meansOfIDPhoto) {
        formData.append("meansOfIDPhoto", customerInfo?.meansOfIDPhoto);
      }

      return client.put(`/api/user/${customerId}`, formData);
    },
    onSuccess(response) {
      // router.push("/customer");

      setShowSuccessToast(true);

      // Delay the execution of closeModal(false) by 5 seconds
      setTimeout(() => {
        closeModal(false);
      }, 5000); // 5000 milliseconds = 5 seconds
    },

    onError(error: AxiosError<any, any>) {
      console.log(error);
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message);
    },
  });
  const MyEffectComponent = ({ formikValues }: { formikValues: any }) => {
    useEffect(() => {
      // This function will run whenever the value of 'formikValues.myField' changes
      setSelectedCountry(formikValues.country);
      setSelectedState(formikValues.state);
    }, [formikValues]); // Add 'formikValues.myField' as a dependency

    return null; // Since this is a utility component, it doesn't render anything
  };
  useEffect(() => {
    const filteredStates =
      StatesAndLGAs.find((country) => country.country === selectedCountry)
        ?.states || [];

    setselectedStateArray(filteredStates);
  }, [selectedCountry]);

  useEffect(() => {
    // Find the Country object in the dataset
    const CountryObject = StatesAndLGAs.find(
      (countryData) => countryData.country === selectedCountry,
    );
    if (CountryObject) {
      const stateObject = CountryObject.states.find(
        (state) => state.name === selectedState,
      );
      // If state is found, return its LGAs
      if (stateObject) {
        console.log(stateObject.lgas);
        setSelectesLGAArray(stateObject.lgas);
      } else {
        // If state is not found, return an empty array
      }
    }
  }, [selectedCountry, selectedState]);
  return (
    <div className="mx-auto mt-8 w-[100%] overflow-hidden rounded-md bg-white p-4 shadow-md">
      <div>
        {customerInfo && (
          <Formik
            initialValues={{
              firstName: customerInfo?.firstName,
              lastName: customerInfo?.lastName,
              otherName: customerInfo?.otherName,
              phoneNumber: customerInfo?.phoneNumber,
              email: customerInfo?.email,
              homeAddress: customerInfo?.homeAddress,
              country: customerInfo?.country,
              state: customerInfo?.state,
              lga: customerInfo?.lga,
              city: customerInfo?.city,
              organisation: customerInfo?.organisation,
              meansOfIDPhoto: null,
              photo: null,
              nin: customerInfo?.nin,
              bvn: customerInfo?.bvn,
              ninslip: null,
              nok: "",
              nokRelationship: "",
              nokPhone: "",
              popularMarket: "",
              userType: "",
              meansOfID: "",
              bankAcctNo: "",
            }}
            validationSchema={Yup.object({
              firstName: Yup.string().required("Required"),
              lastName: Yup.string().required("Required"),
              otherName: Yup.string().optional(),
              email: Yup.string().required("Required"),
              homeAddress: Yup.string().required("Required"),
              country: Yup.string().required("Required"),
              state: Yup.string().required("Required"),
              lga: Yup.string().required("Required"),
              city: Yup.string().required("Required"),
              organisation: Yup.string().required("Required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              updateUserInfo(values);
              setTimeout(() => {
                setShowSuccessToast(false);
                setShowErrorToast(false);
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              isSubmitting,
              values,
              errors,
              handleChange,
              setFieldValue,
            }) => (
              <Form
                encType="multipart/form-data"
                name="IdImage"
                className="mt-8 w-full"
              >
                {" "}
                <p className="mb-8 mt-2 text-xl font-bold text-gray-600">
                  Edit Customer Details
                </p>
                <div className="p-6 md:flex ">
                  <div className="mr-6 md:w-1/6 ">
                    <div className="">
                      <div className="mb-4 ">
                        {values.photo && values.photo[0] ? (
                          <Image
                            src={URL.createObjectURL(values.photo[0])} // Display placeholder image or actual image URL
                            alt="photo"
                            className="h-auto w-full"
                            style={{ maxWidth: "100%" }}
                            width={500}
                            height={300}
                          />
                        ) : (
                          <Image
                            src={customerInfo.photo} // Display placeholder image or actual image URL
                            alt="photo"
                            className="h-auto w-full"
                            style={{ maxWidth: "100%" }}
                            width={500}
                            height={300}
                          />
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="photo"
                          className="mt-4 cursor-pointer rounded-md bg-gray-300  px-4 py-2 text-white hover:bg-gray-400"
                        >
                          Change
                          <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files;
                              setFieldValue("photo", file); // Store the selected file in state
                            }}
                          />
                        </label>
                        {isSubmitting && (
                          <span className="ml-2">Uploading...</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 w-5/6 flex-wrap md:mx-16">
                    <div className="mb-8">
                      <div className="fl w-full justify-between gap-4 md:items-center">
                        <div className="mb-3 w-full">
                          <label
                            htmlFor="firstName"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                          >
                            First Name{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div>
                            <Field
                              id="firstName"
                              name="firstName"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                            />
                            <ErrorMessage
                              name="firstName"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>
                        <div className="mb-3 w-full">
                          <label
                            htmlFor="lastName"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                          >
                            Last Name{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div>
                            <Field
                              id="lastName"
                              name="lastName"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                            />
                          </div>

                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="otherName"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                        >
                          Other Names
                        </label>
                        <div>
                          <Field
                            id="otherName"
                            name="otherName"
                            type="text"
                            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="phoneNumber"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                        >
                          Phone Number{" "}
                          <span className="font-base font-semibold text-[#FF0000]">
                            *
                          </span>
                        </label>
                        <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                          <Field
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            className="bg-transparent outline-none"
                          />
                        </div>
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="email"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                        >
                          Email address{" "}
                          <span className="font-base font-semibold text-[#FF0000]">
                            *
                          </span>
                        </label>
                        <div></div>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="homeAddress"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                        >
                          Home Address{" "}
                          <span className="font-base font-semibold text-[#FF0000]">
                            *
                          </span>
                        </label>
                        <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                          <Field
                            id="homeAddress"
                            name="homeAddress"
                            type="text"
                            className="bg-transparent outline-none"
                          />
                        </div>
                        <ErrorMessage
                          name="homeAddress"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="mb-3 w-full">
                        <label
                          htmlFor="country"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                        >
                          Country of Residence
                        </label>
                        <div>
                          <Field
                            onChange={handleChange}
                            as="select"
                            isInvalid={!!errors.country}
                            name="country"
                            id="country"
                            // type="text"
                            placeholder="country"
                            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          >
                            <option>Select Country</option>
                            {StatesAndLGAs &&
                              StatesAndLGAs.map((countries) => (
                                <option
                                  key={countries.country}
                                  value={countries.country}
                                >
                                  {countries.country}
                                </option>
                              ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="text-xs text-red-500"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="state"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                        >
                          State
                        </label>
                        <div>
                          <Field
                            as="select"
                            id="state"
                            name="state"
                            // type="text"
                            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          >
                            <option>Select State</option>

                            {selectedStateArray &&
                              selectedStateArray.map((state) => (
                                <option key={state.name} value={state.name}>
                                  {state.name}
                                </option>
                              ))}
                          </Field>{" "}
                        </div>
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-xs text-red-500"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="lga"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                        >
                          Local Government Area (lga)
                        </label>
                        <div>
                          <Field
                            as="select"
                            id="lga"
                            name="lga"
                            // type="text"
                            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          >
                            <option>Select LGA</option>

                            {selectedLGAArray &&
                              selectedLGAArray.map((lga) => (
                                <option key={lga} value={lga}>
                                  {lga}
                                </option>
                              ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="lga"
                          component="div"
                          className="text-xs text-red-500"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="city"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                        >
                          City{" "}
                          <span className="font-base font-semibold text-[#FF0000]">
                            *
                          </span>
                        </label>
                        <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                          <Field
                            id="city"
                            name="city"
                            type="city"
                            className="bg-transparent outline-none"
                          />
                        </div>
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      {/* Organization Search Input */}
                      {
                        <div className="mb-3">
                          <label
                            htmlFor="organisation"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%]"
                          >
                            Select Organisation i.e Thrift Collector
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div>
                            <Field
                              disabled
                              as="select"
                              id="organisation"
                              name="organisation"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                            >
                              <option value="">Select Organization</option>
                              {organizations?.map(
                                (org: getOrganizationProps) => (
                                  <option key={org._id} value={org._id}>
                                    {org.organisationName}
                                  </option>
                                ),
                              )}
                            </Field>
                          </div>
                          <ErrorMessage
                            name="organisation"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                      }
                      <div className="mb-3">
                        <label
                          htmlFor="nin"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%] "
                        >
                          NIN number
                        </label>
                        <div>
                          <Field
                            name="nin"
                            type="text"
                            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          />
                        </div>
                        <ErrorMessage
                          name="nin"
                          component="div"
                          className="text-xs text-red-500"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="bvn"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-gray-600 md:mt-[2%] "
                        >
                          BVN number
                        </label>
                        <div>
                          <Field
                            name="bvn"
                            type="text"
                            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          />
                        </div>
                        <ErrorMessage
                          name="bvn"
                          component="div"
                          className="text-xs text-red-500"
                        />
                      </div>

                      <div className="flex items-center">
                        <div className="mr-4">
                          {values.meansOfIDPhoto && values.meansOfIDPhoto[0] ? (
                            <Image
                              src={URL.createObjectURL(
                                values.meansOfIDPhoto[0],
                              )} // Display placeholder image or actual image URL
                              alt="meansOfIDPhoto"
                              className="max-w-full"
                              style={{ maxWidth: "100%" }}
                              width={300}
                              height={200}
                            />
                          ) : (
                            <Image
                              src={customerInfo.meansOfIDPhoto} // Display placeholder image or actual image URL
                              alt="meansOfIDPhoto"
                              className="max-w-full"
                              style={{ maxWidth: "100%" }}
                              width={300}
                              height={200}
                            />
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="meansOfIDPhoto"
                            className="cursor-pointer rounded-md bg-gray-300  px-4 py-2 text-white hover:bg-gray-400"
                          >
                            Change Doc
                            <input
                              id="meansOfIDPhoto"
                              name="meansOfIDPhoto"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files;
                                setFieldValue("meansOfIDPhoto", file); // Store the selected file in state
                              }}
                            />
                          </label>
                          {isSubmitting && (
                            <span className="ml-2">Uploading...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}

                    <div className="flex justify-center">
                      <CustomButton
                        type="submit"
                        style="w-96  rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
                        label={
                          isSubmitting ? "Saving Changes..." : "Save Changes"
                        }
                      />
                    </div>

                    {/* Toast Messages */}
                    {showSuccessToast && (
                      <SuccessToaster
                        message={successMessage || "User Updated successfully!"}
                      />
                    )}
                    {showErrorToast && (
                      <ErrorToaster
                        message={errorMessage || "Error Updating User"}
                      />
                    )}
                    <MyEffectComponent formikValues={values} />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

const CreateCustomer = ({
  setCustomerCreated,
  setCloseModal,
}: {
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setCustomerCreated: Dispatch<SetStateAction<boolean>>;
}) => {
  const { client } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStateArray, setselectedStateArray] = useState<StateProps[]>(
    [],
  );
  const [selectedState, setSelectedState] = useState("");
  const organizationId = useSelector(selectOrganizationId);
  console.log("ID:  " + organizationId);
  const [selectedLGAArray, setSelectesLGAArray] = useState<string[]>([]);

  const initialValues: UpdateKycProps = {
    firstName: "",
    lastName: "",
    otherName: "",
    phoneNumber: "",
    email: "",
    country: "",
    state: "",
    lga: "",
    city: "",
    popularMarket: "",
    nok: "",
    nokRelationship: "",
    nokPhone: "",
    homeAddress: "",
    photo: null,
    meansOfID: "",
    meansOfIDPhoto: null,
    nin: "",
    bvn: "",
    bankAcctNo: "",
    // bankAcctName: "",
    // bankName: "",
    organisation: "",
    userType: "individual",
  };

  const MyEffectComponent = ({ formikValues }: { formikValues: any }) => {
    useEffect(() => {
      // This function will run whenever the value of 'formikValues.myField' changes
      setSelectedCountry(formikValues.country);
      setSelectedState(formikValues.state);
    }, [formikValues]); // Add 'formikValues.myField' as a dependency

    return null; // Since this is a utility component, it doesn't render anything
  };

  useEffect(() => {
    const filteredStates =
      StatesAndLGAs.find((country) => country.country === selectedCountry)
        ?.states || [];

    setselectedStateArray(filteredStates);
  }, [selectedCountry]);

  useEffect(() => {
    // Find the Country object in the dataset
    const CountryObject = StatesAndLGAs.find(
      (countryData) => countryData.country === selectedCountry,
    );
    if (CountryObject) {
      const stateObject = CountryObject.states.find(
        (state) => state.name === selectedState,
      );
      // If state is found, return its LGAs
      if (stateObject) {
        console.log(stateObject.lgas);
        setSelectesLGAArray(stateObject.lgas);
      } else {
        // If state is not found, return an empty array
      }
    }
  }, [selectedCountry, selectedState]);

  const {
    mutate: createNewCustomer,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["create-customer"],
    mutationFn: async (values: UpdateKycProps) => {
      const formData = new FormData();

      // Append all the fields to the formData
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("otherName", values.otherName);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("email", values.email);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("lga", values.lga);
      formData.append("city", values.city);
      formData.append("popularMarket", values.popularMarket);
      formData.append("nok", values.nok);
      formData.append("nokRelationship", values.nokRelationship);
      formData.append("nokPhone", values.nokPhone);
      formData.append("homeAddress", values.homeAddress);
      formData.append("userType", values.userType);
      formData.append("organisation", organizationId);
      formData.append("nin", values.nin);
      formData.append("bvn", values.bvn);
      formData.append("meansOfID", values.meansOfID);
      formData.append("bankAcctNo", values.bankAcctNo);
      //       formData.append("bankAcctName", values.bankAcctName);
      // formData.append("bankName", values.bankAcctNo);
      // Append images
      if (values.photo) {
        formData.append("photo", values.photo[0]); // Assuming photo is an array of File objects
      }

      if (values.meansOfIDPhoto) {
        formData.append("meansOfIDPhoto", values.meansOfIDPhoto[0]);
      }
      return client.post(`/api/user/create-customer`, formData);
    },

    onSuccess(response) {
      console.log(response);
      console.log("customer created successfully");
      setCustomerCreated(true);
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setCustomerCreated(false);
      if (error.response?.status === 413) {
        console.log("Request Entity Too Large (413 Error)");
        console.log(
          "Custom error message: The file you're trying to upload is too large.",
        );
      } else {
        console.log("Other error occurred:", error);
      }
      console.log(error.response?.data.message);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        phoneNumber: Yup.string()
          .matches(
            /^(?:\+234\d{10}|\d{11})$/,
            "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
          )
          .required("Phone number is required"),
        email: Yup.string().email("Invalid email address").optional(),
        country: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        lga: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        popularMarket: Yup.string().required("Required"),
        nok: Yup.string().required("Required"),
        nokRelationship: Yup.string().required("Required"),
        nokPhone: Yup.string().required("Required"),
        homeAddress: Yup.string().optional(),
        photo: Yup.mixed()
          .required("Required")
          .test(
            "fileSize",
            "File size must be less than 2MB",
            (value: MyFileList) => {
              if (value) {
                return value[0].size <= 2097152;
              }
              return true;
            },
          ),
        meansOfID: Yup.string().required("Required"),
        meansOfIDPhoto: Yup.mixed()
          .required("Means of ID photo is required")
          .test(
            "fileSize",
            "File size must be less than 2MB",
            (value: MyFileList) => {
              if (value) {
                return value[0].size <= 2097152;
              }
              return true;
            },
          ),
        nin: Yup.string().optional(),
        bvn: Yup.string().optional(),
        // bankName: Yup.string()
        //   .required("Required")
        //   .min(2, "Bank name must be at least 2 characters")
        //   .max(50, "Bank name must be less than 50 characters"),
        // bankAcctName: Yup.string()
        //   .required("Required")
        //   .min(2, "Account name must be at least 2 characters")
        //   .max(100, "Account name must be less than 100 characters")
        //   .matches(
        //     /^[a-zA-Z\s]*$/,
        //     "Account name should only contain alphabets and spaces",
        //   ),
        bankAcctNo: Yup.string()
          .optional()
          .length(10, "Account number must be exactly 10 digits")
          .matches(/^\d{10}$/, "Account number should only contain digits"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log("submitting........");
        createNewCustomer(values);
        setTimeout(() => {
          // console.log(values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        isSubmitting,
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldValue,
      }) => (
        <Form
          className="mt-8"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          name="image"
        >
          <div className="flex w-full items-center justify-between gap-4">
            <div className="mb-3 w-1/2">
              <label
                htmlFor="firstName"
                className="m-0 text-xs font-medium text-white"
              >
                First Name{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="firstName"
                name="firstName"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3 w-1/2">
              <label
                htmlFor="lastName"
                className="m-0 text-xs font-medium text-white"
              >
                Last Name{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="lastName"
                name="lastName"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="otherName"
              className="m-0 text-xs font-medium text-white"
            >
              Other Names
            </label>
            <Field
              id="otherName"
              name="otherName"
              type="text"
              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="phoneNumber"
              className="m-0 text-xs font-medium text-white"
            >
              Phone Number{" "}
              <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
              <Field
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="bg-transparent outline-none"
              />
            </div>
            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="text-red-500"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="email"
              className="m-0 text-xs font-medium text-white"
            >
              Email address{" "}
              <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500"
            />
          </div>
          {/* Personal Details Fields */}
          <div className="mb-8">
            <div className="mb-3">
              <label
                htmlFor="country"
                className="m-0 text-xs font-medium text-white"
              >
                Country of Residence
              </label>
              <Field
                onChange={handleChange}
                as="select"
                isInvalid={!!errors.country}
                name="country"
                id="country"
                // type="text"
                placeholder="country"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              >
                <option>Select Country</option>
                {StatesAndLGAs &&
                  StatesAndLGAs.map((countries) => (
                    <option key={countries.country} value={countries.country}>
                      {countries.country}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="country"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Add more fields for personal details */}

            <div className="mb-3">
              <label
                htmlFor="state"
                className="m-0 text-xs font-medium text-white"
              >
                State
              </label>
              <Field
                as="select"
                id="state"
                name="state"
                // type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              >
                <option>Select State</option>

                {selectedStateArray &&
                  selectedStateArray.map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="state"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="lga"
                className="m-0 text-xs font-medium text-white"
              >
                Local Government Area (lga)
              </label>
              <Field
                as="select"
                id="lga"
                name="lga"
                // type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              >
                <option>Select LGA</option>

                {selectedLGAArray &&
                  selectedLGAArray.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                {/* {selectedLGAArray && selectedStateArray.map((lga) => (
                        <option>

                        </option>
                      )) } */}
              </Field>
              <ErrorMessage
                name="lga"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="city"
                className="m-0 text-xs font-medium text-white"
              >
                City/Town
              </label>
              <Field
                name="city"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="popularMarket"
                className="m-0 text-xs font-medium text-white"
              >
                Popular market/bus park/religion centre/event centre/place in
                your locality
              </label>
              <Field
                name="popularMarket"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="popularMarket"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-3">
              <label
                htmlFor="nok"
                className="m-0 text-xs font-medium text-white"
              >
                Next Of Kin
              </label>
              <Field
                name="nok"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="nok"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Add more fields for next of kin details */}
            <div className="mb-3">
              <label
                htmlFor="nokRelationship"
                className="m-0 text-xs font-medium text-white"
              >
                Relationship to Next of Kin
              </label>
              <Field
                name="nokRelationship"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="nokRelationship"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="nokPhoneNumber"
                className="m-0 text-xs font-medium text-white"
              >
                Next of Kin Phone number
              </label>
              <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                <Field
                  name="nokPhone"
                  id="kin-phone"
                  type="tel"
                  className=" bg-transparent outline-none"
                />
              </div>
              <ErrorMessage
                name="nokPhoneNumber"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="homeAddress"
                className="m-0 text-xs font-medium text-white"
              >
                Home address
              </label>
              <Field
                name="homeAddress"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="homeAddress"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="">
              <label
                htmlFor="photoUpload"
                className="text-md block font-medium text-white"
              >
                Photo
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                <input
                  type="file"
                  name="photo"
                  id="photoUpload"
                  className="hidden"
                  onChange={(e) => setFieldValue("photo", e.target.files)}
                  accept="image/*"
                />
                <label htmlFor="photoUpload" className="cursor-pointer">
                  <p className="text-center text-white">
                    Drag n drop an image here, or click to select one
                  </p>
                </label>
                {values.photo && values.photo[0] && (
                  <Image
                    src={URL.createObjectURL(values.photo[0])}
                    alt="Product"
                    className="max-w-full"
                    style={{ maxWidth: "100%" }}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="text-red-500">
                <ErrorMessage name="photo" />
              </div>
            </div>

            <div className="mb-3 mt-4">
              <label
                htmlFor="meansOfID"
                className="m-0 text-xs font-medium text-white"
              >
                Select Identification Document type
              </label>
              <Field
                as="select"
                name="meansOfID"
                className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
              >
                <option className="hidden"></option>
                <option value="International Passport">
                  International Passport
                </option>
                <option value="Utility Bill">Utility Bill</option>
                <option value="NIN">NIN</option>
                <option value="Drivers License">Drivers License</option>
                <option value="Voters Card">Voters Card</option>
                <option value="Association Membership ID">
                  Association Membership ID
                </option>
                <option value="School ID">School ID</option>
              </Field>
              <ErrorMessage
                name="meansOfID"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="image"
                className="text-md block font-medium text-white "
              >
                {!values.meansOfID ? "Means  of Id" : values.meansOfID} Photo
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="hidden"
                  onChange={(e) =>
                    setFieldValue("meansOfIDPhoto", e.target.files)
                  }
                  accept="image/*"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <p className="text-center text-white">
                    Drag n drop an image here, or click to select one
                  </p>
                </label>
                {values.meansOfIDPhoto && values.meansOfIDPhoto[0] && (
                  <Image
                    src={URL.createObjectURL(values.meansOfIDPhoto[0])}
                    alt="Product"
                    className="max-w-full"
                    style={{ maxWidth: "100%" }}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="text-red-500">
                <ErrorMessage name="meansOfIDPhoto" className="text-red-500" />
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="nin"
                className="m-0 text-xs font-medium text-white"
              >
                NIN number
              </label>
              <Field
                name="nin"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="nin"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="bvn"
                className="m-0 text-xs font-medium text-white"
              >
                BVN number
              </label>
              <Field
                name="bvn"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="bvn"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* <div className="mb-3">
                    <label
                      htmlFor="bankName"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Bank Name
                    </label>
                    <Field
                      name="bankName"
                      type="text"
                      className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="bankName"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div> */}
            {/* <div className="mb-3">
                    <label
                      htmlFor="bankAcctName"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Bank Account Name
                    </label>
                    <Field
                      name="bankAcctName"
                      type="text"
                      className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="bankAcctName"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div> */}
            <div className="mb-3">
              <label
                htmlFor="bankAcctNo"
                className="m-0 text-xs font-medium text-white"
              >
                Bank Account Number (All withdrawals will be made into this
                account)
              </label>
              <Field
                name="bankAcctNo"
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="bankAcctNo"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
          </div>

          {/* Submission buttons */}
          <button
            type="submit"
            className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
            disabled={isSubmitting}
          >
            {isSubmitting || isPending ? "Creating Customer......" : "Submit"}
          </button>
          <MyEffectComponent formikValues={values} />
        </Form>
      )}
    </Formik>
  );
};

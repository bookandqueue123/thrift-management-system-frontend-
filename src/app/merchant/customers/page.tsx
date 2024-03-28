"use client";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import TransactionsTable from "@/components/Tables";
// import DummyCustomers from "@/api/dummyCustomers.json";
import { useAuth } from "@/api/hooks/useAuth";
import Modal from "@/components/Modal";
import { StatusIndicator } from "@/components/StatusIndicator";
import { CustomerSignUpProps, customer, setSavingsResponse } from "@/types";
import { extractDate, formatToDateAndTime } from "@/utils/TimeStampFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import DatePicker from 'react-datepicker'
import { CiExport } from "react-icons/ci";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md"
import passport from '../../../../public/passport.svg'
import ninslip from "../../../../public/NIN.svg"
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
// import 'react-datepicker/dist/react-datepicker.css';

const initialValues: CustomerSignUpProps = {
  firstName: "",
  lastName: "",
  otherName: "",
  phoneNumber: "",
  email: "",
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
  const PAGE_SIZE = 2;

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [searchResult, setSearchResult] = useState('');
  const [filteredCustomers, setFilteredCustomer] = useState<customer[]>([])
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  
  const { client } = useAuth();
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [customerToBeEdited, setCustomerToBeEdited] = useState("");
  const organisationId = useSelector(selectOrganizationId)

  const [openDropdown, setOpenDropdown] = useState<number>(0);
  const handleFromDateChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setFromDate(event.target.value);
    
  };

  const handleToDateChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setToDate(event.target.value);
    
    handleDateFilter()
  };
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
        .get(`/api/user?role=customer&organisation=${organisationId}&userType=individual`, {})  //populate this based onthee org
        .then((response: AxiosResponse<customer[], any>) => {
          console.log(response);
          setFilteredCustomer(response.data)
          return response.data;
          
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error);
          throw error;
        });
    },
  });
  const handleSearch = (value: SetStateAction<string>) => {
    setSearchResult(value);
    

    if(allCustomers){
      const filtered = allCustomers.filter(item =>
        String(item.accountNumber).includes(String(value))
    );
    // Update the filtered data state
    setFilteredCustomer(filtered);
    }
    
  };
  const handleDateFilter = () => {
    // Filter the data based on the date range
    if(allCustomers){
    const filtered = allCustomers.filter(item => {
      const itemDate = new Date(item.createdAt); // Convert item date to Date object
      const startDateObj = new Date(fromDate);
      const endDateObj = new Date(toDate);

      return itemDate >= startDateObj && itemDate <= endDateObj;
    });

    // Update the filtered data state
    setFilteredCustomer(filtered);
  }
  };


  console.log(filteredCustomers)
  const paginatedCustomers = filteredCustomers?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  let totalPages = 0
  if(allCustomers){
     totalPages = Math.ceil(allCustomers.length / PAGE_SIZE);
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      (setCurrentPage(currentPage - 1));
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
     (setCurrentPage(currentPage + 1));
    }
  };

  
  const AddCustomer = () => {};
  
  
  return (
    <>

      <div >
     
        <div className="mx-auto w-[100%] mt-8 p-4 bg-white shadow-md rounded-md overflow-hidden">
            {/* Image and First Batch of Details Section */}
            <p className="text-xl mt-2 mb-8 font-bold">Customer Details</p>
            <div className="border rounded-lg">
            <div className="p-6 md:flex ">
              <div className="md:w-1/6 mr-6 ">
                <Image
                  src={passport}
                  alt="Customer"
                  width={200}
                  height={100}
                  className="rounded-md"
                />
              </div>
              <div className="w-5/6 flex flex-wrap ml-4">
                <div className="w-full md:w-1/2 mb-2 ">
                  <p className="text-gray-600 font-semibold">Name: <span className="font-normal">Olanrewaju Adeyanju Oluwagbemilekenibitiapaeniyankoto</span></p>
                  {/* <p className="text-gray-900">John Doe</p> */}
                </div>
                <div className="w-full md:w-1/2 mb-2  pl-8">
                  <p className="text-gray-600 font-semibold">Phone Number: <span className="font-normal pl-8">123-456-7890</span></p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>
                <div className="w-full md:w-1/2 mb-2">
                  <p className="text-gray-600 font-semibold">Email Address: <span className="font-normal">johndoe@example.com</span></p>
                  {/* <p className="text-gray-900">johndoe@example.com</p> */}
                </div>
                <div className="w-full md:w-1/2 mb-2 pl-8">
                  <p className="text-gray-600 font-semibold">Country of Residence: <span className="font-normal">United States</span></p>
                  {/* <p className="text-gray-900">United States</p> */}
                </div>
                <div className="w-full mb-4">
                  <p className="text-gray-600 font-semibold">Home Address: <span className="font-normal">123 Main St, City</span></p>
                  {/* <p className="text-gray-900">123 Main St, City</p> */}
                </div>
              </div>

            </div>

            {/* Second Batch of Details Section */}
            <div className="p-6">
              <div className="flex flex-wrap mb-4">
                <div className="w-full sm:w-1/3">
                  <p className="text-gray-600 font-semibold">State: <span className="font-normal">Califonia</span></p>
                  {/* <p className="text-gray-900">California</p> */}
                </div>
                <div className="w-full sm:w-1/3">
                  <p className="text-gray-600 font-semibold">LGA: <span className="font-normal">Ojodu</span></p>
                  {/* <p className="text-gray-900">Local Government Area</p> */}
                </div>
                <div className="w-full sm:w-1/3">
                  <p className="text-gray-600 font-semibold">City: <span className="font-normal">Ojodu</span></p>
                  {/* <p className="text-gray-900">City Name</p> */}
                </div>
              </div>
              <div className="flex flex-wrap mb-4">
                <div className="w-full sm:w-1/3">
                  <p className="text-gray-600 font-semibold">NIN: <span className="font-normal">12345678</span></p>
                  {/* <p className="text-gray-900">1234567890</p> */}
                </div>
                <div className="w-full sm:w-1/3">
                  <p className="text-gray-600 font-semibold">BVN: <span className="font-normal">1234567</span></p>
                  {/* <p className="text-gray-900">1234567890</p> */}
                </div>
              </div>
            </div>
          </div>
          
          <div className=" mt-8 rounded-lg">
            <div className="md:flex ">
              <div className="w-[60%] border p-6 rounded-lg">
              <p className="text-xl mt-2 mb-8 font-bold">Next of Kin Details</p>

              <div>
                <div className="w-full  mb-4 ">
                  <p className="font-bold">Name: <span className="font-normal">Olanrewaju Adeyanju Oluwagbemilekenibitiapaeniyankoto</span></p>
                  {/* <p className="text-gray-900">John Doe</p> */}
                </div>

                <div className="w-full  mb-4 ">
                  <p className=" font-bold">Phone Number: <span className="font-normal pl-8">123-456-7890</span></p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>

                <div className="w-full  mb-4 ">
                  <p className=" font-bold">Relationship: <span className="font-normal pl-8">123-456-7890</span></p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>

                <div className="w-full  mb-4 ">
                  <p className=" font-bold">Home Address: <span className="font-normal pl-8">123-456-7890</span></p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>
              </div>
              </div>
              
              <div className="w-[40%] border p-6 ml-8">
              <p className="text-xl mt-2 mb-8 font-bold">Next of Kin Details</p>

              <div className="">
                <Image
                  src={ninslip}
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


        <div className="mx-auto w-[100%] mt-8 p-4 bg-white shadow-md rounded-md overflow-hidden">
          <div>
            <div className="p-6 md:flex ">
              <div className="md:w-1/6 mr-6 ">
                <Image
                  src={passport}
                  alt="Customer"
                  width={200}
                  height={100}
                  className="rounded-md"
                />

                <button className="w-full mt-8 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded  items-center">
                  
                  <span>Download</span>
                </button>
              </div>


              <div className="w-5/6 flex flex-wrap ml-4 border">
              <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        
        setTimeout(() => {
          setShowSuccessToast(false);
          setShowErrorToast(false);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="mt-8">
          <div className="mb-8">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="mb-3 w-full">
                <label
                  htmlFor="firstName"
                  className="m-0 text-normal font-bold "
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
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-3 w-full">
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
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
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
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="phoneNumber"
                className="m-0 text-xs font-medium text-white"
              >
                Phone Number{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                {/* <span className="flex h-full select-none items-center gap-2 text-gray-400 sm:text-sm">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-100 f-100"
                >
                  <path
                    d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
                    fill="white"
                  />
                  <path
                    d="M1 2.05C1 1.60817 1.35817 1.25 1.8 1.25H6.29677C6.7386 1.25 7.09677 1.60817 7.09677 2.05V13.95C7.09677 14.3918 6.7386 14.75 6.29677 14.75H1.8C1.35817 14.75 1 14.3918 1 13.95V2.05ZM12.9032 2.05C12.9032 1.60817 13.2614 1.25 13.7032 1.25H18.2C18.6418 1.25 19 1.60817 19 2.05V13.95C19 14.3918 18.6418 14.75 18.2 14.75H13.7032C13.2614 14.75 12.9032 14.3918 12.9032 13.95V2.05Z"
                    fill="#186648"
                  />
                  <path
                    d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
                    stroke="#131313"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                +234
              </span> */}
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
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Organization Search Input */}
            {
              <div className="mb-3">
                <label
                  htmlFor="organization"
                  className="m-0 text-xs font-medium text-white"
                >
                  Organization{" "}
                  <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
                </label>
                <Field
                  as="select"
                  id="organization"
                  name="organization"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                >
                  <option value="">Select Organization</option>
                  
                </Field>
                <ErrorMessage
                  name="organization"
                  component="div"
                  className="text-red-500"
                />
              </div>
            }

            <div className="mb-3">
              <label
                htmlFor="password"
                className="m-0 text-xs font-medium text-white"
              >
                Password{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="confirmPassword"
                className="m-0 text-xs font-medium text-white"
              >
                Confirm Password{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>
          {/* <CustomButton
          type="submit"
          style="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
          label={isSubmitting ? 'Creating account...' : 'Create account'}
        />
        {showSuccessToast && successMessage && <SuccessToaster message={successMessage ? successMessage : "Account Created successfully!"} />}
           {showErrorToast && errorMessage && errorMessage && <ErrorToaster message={errorMessage? errorMessage : "Error creating organization"} />}
 */}

          {/* Submit Button */}
          <CustomButton
            type="submit"
            style="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
            label={isSubmitting ? "Creating account..." : "Create account"}
          />

          {/* Toast Messages */}
          {showSuccessToast && (
            <SuccessToaster
              message={successMessage || "Account Created successfully!"}
            />
          )}
          {showErrorToast && (
            <ErrorToaster
              message={errorMessage || "Error creating organization"}
            />
          )}
        </Form>
      )}
    </Formik>
              </div>
            </div>
          </div>
        </div>
        
     




      <div className="mb-4 space-y-2">
        <p className="text-base text-2xl font-bold text-ajo_offWhite text-opacity-60">
          Customers
        </p>
      </div>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            
            <FilterDropdown
              options={[
                "Account Number",
                // "Timestamp",
                // "Name",
                // "Email",
                // "Phone",
                // "Channel",
                // "Amount",
                // "Status",
              ]}
            />
            <SearchInput onSearch={handleSearch}/>
          </span>
          <CustomButton
            type="button"
            label="Create New Customer"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={AddCustomer}
          />
        </div>

        <div className="">
          <p className="text-white text-xl">Customer List</p>
          
            <div className="md:flex justify-between my-8">
              <div className="flex items-center">
                <p className="mr-2 font-lg text-white">Select range from:</p>
                <input
                  type="date"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />


                <p className="mx-2 text-white">to</p>
                <input
                  type="date"
                  value={toDate}
                  onChange={handleToDateChange}
                  className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex mt-4">
                <button className="mr-4 bg-transparent hover:bg-blue-500 text-white font-medium hover:text-white py-2 px-4 border border-white hover:border-transparent rounded flex">Export as CSV <span className="ml-2 mt-1"><CiExport /></span></button>
                <button className="px-4 py-2 text-white rounded-md border-none bg-transparent relative">
                  
                  <u>Export as Excel</u>
                </button>
              </div>
          </div>
        </div>

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
              "organisation",
              "Action",
            ]}
            content={paginatedCustomers?.map((customer, index) => (
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
              <SavingsSettings
                customerId={customerToBeEdited}
                setContent={setModalContent}
                content={
                  modalContent === "confirmation" ? "confirmation" : "form"
                }
                closeModal={setModalState}
              />
            </Modal>
          )}
          <div className="flex justify-center">
          {/* <div className="flex items-center  space-x-2">
            <button
              className="p-2 border border-blue-500 rounded-md hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={goToPreviousPage}
            >
              <MdKeyboardArrowLeft />
            </button>

            <button
              className="p-2 bg-white text-blue-500 rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() => setCurrentPage(currentPage)}
            >
              {currentPage}
            </button>

            <button
              className="p-2 bg-white rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() =>(setCurrentPage(currentPage + 1))}
            >
              {currentPage + 1}
            </button>
            <button
              className="p-2 bg-white rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() =>(setCurrentPage(currentPage + 2))}
            >
              {currentPage + 2}
            </button>

            <button
              className="p-2 border border-blue-500 rounded-md hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={goToNextPage}
            >
              <MdKeyboardArrowRight />
            </button> */}

              {/* <button
                className="p-2 bg-white rounded-md cursor-pointer hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
                onClick={() => dispatch(setCurrentPage(currentPage + 6))}
              >
                {currentPage + 6}
              </button> */}

            {/* <button
              className="p-2 border border-blue-500 rounded-md hover:bg-blue-100 focus:outline-none focus:ring focus:border-blue-300"
              onClick={goToNextPage}
            >
              <ChevronRightIcon className="w-4 h-4 cursor-pointer" />
            </button>            */}
        {/* </div> */}
          </div>

          {/* <PaginationBar apiResponse={allCustomers !== undefined && allCustom} /> */}
        </div>
      </section>
    </>
  );
};

export default Customers;

const SavingsSettings = ({
  customerId,
  setContent,
  content,
  closeModal,
}: {
  customerId: string;
  setContent: Dispatch<SetStateAction<"form" | "confirmation">>;
  content: "form" | "confirmation";
  closeModal: Dispatch<SetStateAction<boolean>>;
}) => {
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

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setSaveDetails((prev) => ({ ...prev, [name]: value }));
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
  // console.log(saveDetails.users);

  const onSubmitHandler = () => {
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
                <option className="hidden">
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
        </>
      )}
    </div>
  );
};

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
// import 'react-datepicker/dist/react-datepicker.css';

const Customers = () => {
  const PAGE_SIZE = 2;
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

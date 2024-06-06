'use client'
import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import CustomerAction from "@/components/CustomerAction";
import Modal, { ModalConfirmation } from "@/components/Modal";
import TransactionsTable from "@/components/Tables";
import OrganisationAction from "@/modules/merchant/OrganisationAction";
import { selectToken } from "@/slices/OrganizationIdSlice";
import { MerchantSignUpProps, getOrganizationProps } from "@/types";
import { extractDate, extractTime, formatToDateAndTime } from "@/utils/TimeStampFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Formik } from "formik";
import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { CiExport } from "react-icons/ci";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
import * as Yup from "yup";


  
export default function SuperAdminOrganisation(){
  const token = useSelector(selectToken);
  const PAGE_SIZE = 5;
  const { client } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [filteredOrganisations, setFilteredOrganisations] = useState<getOrganizationProps[]>([])
  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-organisation" | "create-organisation" | "view-organisation" | ""
  >("");
  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );
  const [isOrganisationCreated, setIsOrganisationCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const {
    data: organizations,
    isLoading: isUserLoading,
    isError: getGroupError,
    refetch,
  } = useQuery({
    queryKey: ["allOrganizations"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=organisation`, {})
        .then((response) => {
          setFilteredOrganisations(response.data)
          return response.data;
          
        })
        .catch((error) => {
         
          throw error;
        });
    },
  });

  useEffect(() => {
    // Calling refetch to rerun the allRoles query
    refetch();
  }, [isOrganisationCreated, refetch]);


  const handleFromDateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setToDate(event.target.value);

   
      //  handleDateFilter();
    
    
  };




const handleDateFilter = () => {
  if (organizations) {
    const startDateObj = new Date(fromDate);
    let endDateObj = new Date(toDate);
    
    // Adjust the endDateObj to the end of the day
    endDateObj.setHours(23, 59, 59, 999);

   

    if (isNaN(startDateObj.getTime())) {
      console.error('Invalid fromDate:', fromDate);
      return;
    }

    if (isNaN(endDateObj.getTime())) {
      console.error('Invalid toDate:', toDate);
      return;
    }

    const filtered = organizations.filter((item: { createdAt: string | number | Date; }) => {
      const itemDate = new Date(item.createdAt); // Convert item date to Date object
      return itemDate >= startDateObj && itemDate <= endDateObj;
    });

    setFilteredOrganisations(filtered);
  }
};

useEffect(() => {
  if (fromDate && toDate) {
    handleDateFilter();
  }
}, [fromDate, toDate]);


  // console.log(toDate)
  // console.log(fromDate)
  // const handleDateFilter = () => {
  //   // Filter the data based on the date range
  //   if (organizations) {
  //     const filtered = organizations.filter((item: { createdAt: string | number | Date; }) => {
  //       const itemDate = new Date(item.createdAt); // Convert item date to Date object
  //       const startDateObj = new Date(fromDate);
  //       const endDateObj = new Date(toDate);

  //       console.log(startDateObj)
  //       console.log(endDateObj)
  //       return itemDate >= startDateObj && itemDate <= endDateObj;
  //     });

  //     // Update the filtered data state
  //     setFilteredOrganisations(filtered);
  //   }
  // };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.target.value);


    if (organizations) {
      const searchQuery = e.target.value.trim().toLowerCase();
      const filtered = organizations.filter((item: { organisationName: any; }) =>
        (item.organisationName.toLowerCase()).includes(searchQuery),
      );
      // Update the filtered data state
      setFilteredOrganisations(filtered);
    }
  };
  
  const paginatedCustomers = filteredOrganisations?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (organizations) {
    totalPages = Math.ceil(organizations.length / PAGE_SIZE);
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

  const handleExport = async () => {
  
    try {
     
      const response = await fetch(`${apiUrl}api/user/export-organisation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'organisation.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to export users:', response);
      }
    } catch (error) {
      console.error('An error occurred while exporting users:', error);
    }
  };

  const handleExcelExport = async () => {
    try {
      
      const response = await fetch(`${apiUrl}api/user/export-excel-organisation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'organisation.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to export users:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while exporting users:', error);
    }
  };


    return(
        <div>
           <div className="mb-4 space-y-2">
                <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
                 Organisation
                </p>
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
            label="Create an Organisation"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
              setIsOrganisationCreated(false)
              setModalState(true);
              setModalToShow("create-organisation");
              setModalContent("form");
            }}
          />
         
        </div>

        <div className="md:flex justify-between my-8">
          <div className="md:flex items-center">
            <p className="mr-2 font-lg text-white">Select range from:</p>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="px-4 mt-2 md:mt-0 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />


            <p className="mx-2 text-white">to</p>
            <input
              type="date"
              value={toDate}
               onChange={handleToDateChange}
              className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />

            {/* <button 
            
            onClick={handleDateFilter} 
            className="ml-2 px-4 py-2 text-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              Go
              </button> */}
            </div>
              <div className="flex mt-4">
                <button onClick={handleExport} className="mr-4 bg-transparent hover:bg-blue-500 text-white font-medium hover:text-white py-2 px-4 border border-white hover:border-transparent rounded flex">Export as CSV <span className="ml-2 mt-1"><CiExport /></span></button>
                <button onClick={handleExcelExport} className="px-4 py-2 text-white rounded-md border-none bg-transparent relative">
                  
                  <u>Export as Excel</u>
                </button>
              </div>
          </div>

          <div className="mb-4">
        <p className="text-white text-xl">Organisation List</p>
      </div>

      <TransactionsTable
        headers={[
        "S/N",
        "Organisation Name",
        "Account Number",
        "email",
        
        // "Total Number of Customers",
        "Registration Date",
        "Action"
        ]}

        content={paginatedCustomers.map((organisation, index) => (
            <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {index}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.organisationName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.accountNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {organisation.email}
                </td>
                
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                    --- customers
                </td> */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {extractDate(organisation.createdAt)} 
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                <OrganisationAction
                  index={index}
                  organisationId={organisation._id}
                  />
                </td>
            </tr>
        ))}
      />

      {modalState && (
        <Modal
          setModalState={setModalState}
          title={
            modalToShow === "create-organisation"
              ? "Create Organisation"
                  : ""
          }
        >
          {modalContent === "form" ? (
             (
              <div className="px-[10%]">
                <CreateOrganisation
                setIsOrganisationCreated={setIsOrganisationCreated}
                 setCloseModal={setModalState}
                    // setUserMutated={setIsUserMutated}
                    actionToTake={modalToShow}
                    setModalContent={setModalContent}    
                    
                   errorMessage={setErrorMessage} 
                />
                
              </div>
            ) 
          ) : 
          (
            <ModalConfirmation
            successTitle={`Organisation ${modalToShow === "create-organisation" ? "Creation" : "Editing"} Successful`}
            errorTitle={`Organisation ${modalToShow === "create-organisation" ? "Creation" : "Editing"} Failed`}
            status={isOrganisationCreated ? "success" : "failed"}
            responseMessage={errorMessage}
            />
          )
          }  
            
          </Modal>
        )}

      <div className="flex justify-center">
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
            </div>
      </section>
        </div>
    )
}

const CreateOrganisation = ({
  // setUserMutated,
  setCloseModal,
  actionToTake,
  setIsOrganisationCreated,
  setModalContent,
  errorMessage,
}: {
  errorMessage: Dispatch<SetStateAction<string>>;
  setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
  setIsOrganisationCreated: Dispatch<SetStateAction<boolean>>;
  actionToTake: "create-organisation" | "edit-organisation" | "view-organisation" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  // setUserMutated: Dispatch<SetStateAction<boolean>>;
}) => {
  const { client } = useAuth();


  interface valuesProps{
    organisationName: string,
    email: string,
    contactNumber: string,
    prefferedUrl: string,
  }
  const initialValues= {
    organisationName: "",
    email: "",
    contactNumber: "",
    prefferedUrl: "",
    
  };

  const {
    mutate: MerchantSignUp,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["Merchant sign up"],
    mutationFn: async (values: valuesProps) => {
      return client.post(`/api/user/create-merchant`, {
        organisationName: values.organisationName,
        phoneNumber: values.contactNumber,
        email: values.email,
        prefferedUrl: values.prefferedUrl,
        
      });
    },

    onSuccess(response) {
      console.log(response)
      setIsOrganisationCreated(true)
      setModalContent("status");
      errorMessage("")
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },
    onError(error: any) {
      errorMessage(error.response.data.message)
      setModalContent("status");
      setIsOrganisationCreated(false)
      
    },
  });


 

  

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={Yup.object({
        organisationName: Yup.string().required("Required"),
        email: Yup.string().required("Required").email("Invalid email address"),
        contactNumber: Yup.string()
          .matches(
            /^(?:\+234\d{10}|\d{11})$/,
            "contactNumber number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
          )
          .required("Required"),
        prefferedUrl: Yup.string().required("Required"),
      })}
      onSubmit={async(values, { setSubmitting }) => {
       MerchantSignUp(values)
      }}
    >
      {({
        isSubmitting,
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldValue,
        submitForm,
      }) => (
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="mb-10 w-full space-y-10 rounded-md bg-white px-[5%] py-[3%]">
            <section>
              <div className="my-3">
                <label
                  htmlFor="organisationName"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Organisation Name
                </label>
                <Field
                  onChange={handleChange}
                  name="organisationName"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
                <ErrorMessage
                  name="organisationName"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              <div className="my-3 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Email
                  </label>
                  <Field
                    onChange={handleChange}
                    name="email"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="contactNumber"
                    className="text-ajo_darkBluee m-0 text-xs font-medium"
                  >
                    Contact Number
                  </label>
                  <Field
                    name="contactNumber"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
              </div>
              
              <div className="mb-3">
              <label
                htmlFor="prefferedUrl"
                className="m-0 text-xs font-medium text-ajo_darkBlue"
              >
                Preferred Url{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>{" "}
                (e.g: example@finkia.com.ng)
              </label>
              <div className="mt-1 flex w-full rounded-lg border-0 bg-[#F3F4F6]  p-3">
                <Field
                  type="string"
                  name="prefferedUrl"
                  id="prefferedUrl"
                  className="w-full bg-transparent text-[#7D7D7D] outline-none"
                />
                <span className="text-ajo_darkBlue">@finkia.com.ng</span>
              </div>
              <ErrorMessage
                name="prefferedUrl"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

              
              
            </section>
          </div>
          <button
            type="submit"
            className="w-1/2 rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
            // onClick={() => submitForm()}
            // disabled={isSubmitting || isCreatingRole}
          >
            {isSubmitting || isPending ? (
              <Image
                src="/loadingSpinner.svg"
                alt="loading spinner"
                className="relative left-1/2"
                width={25}
                height={25}
              />
            ) : (
              'Submit'
         )} 
          </button>
        </form>
      )}
    </Formik>
  );
};
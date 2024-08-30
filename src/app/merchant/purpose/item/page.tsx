"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import {
  selectOrganizationId,
  selectUser,
  selectUserId,
} from "@/slices/OrganizationIdSlice";
import {
  MyFileList,
  PurposeProps,
  customer,
  mutateUserProps,
  roleResponse,
  staffResponse,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Formik, useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  Dispatch,
  Key,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { nanoid } from 'nanoid';
import { extractDate } from "@/utils/TimeStampFormatter";

const Purpose = () => {
  const PAGE_SIZE = 5;
  const organisationId = useSelector(selectOrganizationId);
  const { userPermissions, permissionsMap } = usePermissions();

  const [isPurposeCreated, setIsPurposeCreated] = useState(false);
  const [isPurposeEdited, setIsPurposeEdited] = useState(false);
  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );
  const [mutationResponse, setMutationResponse] = useState("");
  const [filteredPurpose, setFilteredPurpose] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");

  const { client } = useAuth();
  const user = useSelector(selectUser);

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-purpose" | "create-purpose" | "view-purpose" | ""
  >("");

  const [openDropdown, setOpenDropdown] = useState<number>(0);
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };
  const [purposeToBeEdited, setPurposeToBeEdited] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
  (customer | undefined)[]
>([]);

  const {
    data: allPurpose,
    isLoading: isLoadingAllPurpose,
    refetch,
  } = useQuery({
    queryKey: ["allPurpose"],
    queryFn: async () => {
      return client
        .get(
          `/api/purpose?organisation=${organisationId}`,
          {},
        )
        .then((response: AxiosResponse<customer[], any>) => {
          setFilteredPurpose(response.data);
          
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
     
          throw error;
        });
    },
    staleTime: 5000,
  });


  

  const {
    data: allRoles,
    isLoading: isLoadingAllRoles,
    refetch: refetchAllRoles,
  } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      return client
        .get(`/api/role?organisation=${organisationId}`, {})
        .then((response: AxiosResponse<roleResponse[], any>) => {
         
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {

          throw error;
        });
    },
    staleTime: 5000,
  });

  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&organisation=${organisationId}&userType=individual`,
          {},
        )
        .then((response: AxiosResponse<customer[], any>) => {
          
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // setSearchResult(e.target.value);


    if (allPurpose) {
      const filtered = allPurpose.filter((item) =>
        String(item.firstName || item.lastName).includes(
          String(e.target.value),
        ),
      );
      // Update the filtered data state
      setFilteredPurpose(filtered);
    }
  };
  // const handleDateFilter = () => {
  //   // Filter the data based on the date range
  //   if (allPurpose) {
  //     const filtered = allPurpose.filter((item) => {
  //       const itemDate = new Date(item.createdAt); // Convert item date to Date object
  //       const startDateObj = new Date(fromDate);
  //       const endDateObj = new Date(toDate);

  //       return itemDate >= startDateObj && itemDate <= endDateObj;
  //     });

  //     // Update the filtered data state
  //     setFilteredPurpose(filtered);
  //   }
  // };

  const paginatedRoles = filteredPurpose?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allPurpose) {
    totalPages = Math.ceil(allPurpose.length / PAGE_SIZE);
  }

  useEffect(() => {
    refetch();
    refetchAllRoles();
  }, [isPurposeCreated, isPurposeEdited, modalContent, refetch, refetchAllRoles]);

  const viewUser = user?.role === "organisation" ||   (user?.role === "staff" &&
                      userPermissions.includes(
                        permissionsMap["view-purposes"],
                      ))

  const editPurpose = (user?.role === "organisation" ||
  (user?.role === "staff" &&
    userPermissions.includes(
      permissionsMap["edit-purpose"],
    )))

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedOption = allCustomers?.find(
          (option) => option._id === selectedId,
        );
        if (
          !selectedOptions.some((option) => option?._id === selectedOption?._id)
        ) {
          setSelectedOptions([...selectedOptions, selectedOption!]);
        }
      };
  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Purpose
        </p>
      </div>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <FilterDropdown options={["Account Number"]} />

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
          {(user?.role === "organisation" ||
            (user?.role === "staff" &&
              userPermissions.includes(permissionsMap["create-staff"]))) && (
            <CustomButton
              type="button"
              label="Create Purpose"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-purpose");
                setModalContent("form");
                setIsPurposeCreated(false);
              }}
            />
          )}
          
        </div>
      

        <p className="mb-2 text-base font-medium text-white">
          Existing Purpose List
        </p>

        <div>
          <TransactionsTable
            headers={[
              "Name",
              "Category",
              
            ]}
            content={
              filteredPurpose.length === 0 ? (
                <tr className="h-[3rem]">
                  <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                    No Purpose yet
                  </p>
                </tr>
              ) : (
                paginatedRoles?.map((user, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.purposeName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.category.name}
                    </td>

                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.createdAt || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.email || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.phoneNumber || "----"}
                    </td> */}
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {allRoles
                        ?.filter((role) =>
                          user?.roles?.some(
                            (eachRole: string) => eachRole === role._id,
                          ),
                        )
                        .map((filteredRole) => (
                          <ul key={filteredRole._id}>
                            <li className="my-1 list-disc marker:text-ajo_offWhite">
                              {filteredRole.name}
                            </li>
                          </ul>
                        )) || "----"}
                    </td> */}
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {allCustomers
                        ?.filter((customer) =>
                          user?.assignedUser?.some(
                            (eachUser: string) => eachUser === customer._id,
                          ),
                        )
                        .map((filteredUser) => (
                          <ul key={filteredUser._id}>
                            <li className="my-1 list-disc marker:text-ajo_offWhite">
                              {filteredUser.firstName +
                                " " +
                                filteredUser.lastName}
                            </li>
                          </ul>
                        )) || "----"}
                    </td> */}

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
                            viewUser ? "View Purpose": '',
                            // (user?.role === "organisation" ||
                            //   (user?.role === "staff" &&
                            //     userPermissions.includes(
                            //       permissionsMap["view-purposes"],
                            //     ))) &&
                            //   "View User",

                            editPurpose ? "Edit Purpose": '',
                            // (user?.role === "organisation" ||
                            //   (user?.role === "staff" &&
                            //     userPermissions.includes(
                            //       permissionsMap["edit-purpose"],
                            //     ))) &&
                            //   "Edit User",
                          ].filter(Boolean) as string[],
                          actions: [
                            () => {
                              // if (
                              //   user?.role === "organisation" ||
                              //   (user?.role === "staff" &&
                              //     userPermissions.includes(
                              //       permissionsMap["view-purposes"],
                              //     ))
                              // )
                               {
                                setModalState(true);
                                setModalToShow("view-purpose");
                                setPurposeToBeEdited(user._id);
                                setIsPurposeEdited(false);

                          
                              }
                            },
                            () => {
                              // if (
                              //   user?.role === "organisation" ||
                              //   (user?.role === "staff" &&
                              //     userPermissions.includes(
                              //       permissionsMap["edit-purpose"],
                              //     ))
                              // )
                               {
                                setModalToShow("edit-purpose");
                                setModalState(true);
                                setPurposeToBeEdited(user._id);
                                setIsPurposeEdited(false);
                              }
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
                modalToShow === "edit-purpose"
                  ? "Edit User"
                  : modalToShow === "create-purpose"
                    ? "Create a Purpose"
                    : modalToShow === "view-purpose"
                      ? "View Purpose"
                      : ""
              }
            >
              {modalContent === "form" ? (
                <div className="px-[10%]">
                  {modalToShow === "view-purpose" ? (""
                    // <ViewUser userId={purposeToBeEdited} />
                  ) : (
                    <MutateUser
                      setCloseModal={setModalState}
                      setUserCreated={setIsPurposeCreated}
                      setUserEdited={setIsPurposeEdited}
                      setModalContent={setModalContent}
                      setMutationResponse={setMutationResponse}
                      actionToTake={modalToShow}
                      purposeToBeEdited={purposeToBeEdited}
                    />
                  )}
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`Purpose ${modalToShow === "create-purpose" ? "Creation" : modalToShow === "edit-purpose" ? "Editing": ""} Successful`}
                  errorTitle={`Purpose ${modalToShow === "create-purpose" ? "Creation" : "Editing"} Failed`}
                  status={isPurposeCreated || isPurposeEdited ? "success" : "failed"}
                  responseMessage={mutationResponse}
                />
              )}
            </Modal>
          )}
          <PaginationBar
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
};

const MutateUser = ({
  setUserCreated,
  setUserEdited,
  setCloseModal,
  setModalContent,
  actionToTake,
  setMutationResponse,
  purposeToBeEdited,
}: {
  actionToTake: "create-purpose" | "edit-purpose" | "view-user" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setUserCreated: Dispatch<SetStateAction<boolean>>;
  setUserEdited: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
  setMutationResponse: Dispatch<SetStateAction<string>>;
  purposeToBeEdited: string;
}) => {

  const router = useRouter()
  const userId = useSelector(selectUserId)
  const { client } = useAuth();
  const organizationId = useSelector(selectOrganizationId);
  const [selectedOptions, setSelectedOptions] = useState<
  (customer | undefined)[]
>([]);


const {
    data: allCatgories,
    isLoading: isLoadingAllCategories,
    refetch,
  } = useQuery({
    queryKey: ["allCatgories"],
    queryFn: async () => {
      return client
        .get(`/api/categories?ownerRole=merchant&ownerId=${userId}`, {})
        .then((response: AxiosResponse<roleResponse[], any>) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {

          throw error;
        });
    },
    staleTime: 5000,
  });

  const {
    data: allGeneralCategories,
    isLoading: isLoadingAllGeneralCategories,
    refetch: refetchGeneralCategories,
  } = useQuery({
    queryKey: ["allGeneralCategories"],
    queryFn: async () => {
      return client
        .get(`/api/categories?ownerRole=superadmin`, {})
        .then((response: AxiosResponse<roleResponse[], any>) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {

          throw error;
        });
    },
    staleTime: 5000,
  });



  const {
    data: singlePurpose,
    isLoading: isLoadingAllPurpose,
    refetch: editingPurposeRefetched,
  } = useQuery({
    queryKey: ["allPurpose"],
    queryFn: async () => {
      return client
        .get(
          `/api/purpose/${purposeToBeEdited}`,
          {},
        )
        .then((response) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
     
          throw error;
        });
    },
    staleTime: 5000,
  });

// const initialValues:PurposeProps = actionToTake === 'edit-purpose' ? {
//   purposeName: singlePurpose?.purposeName ?? "",
//   description: singlePurpose?.description ?? "",
//   category: singlePurpose?.category ?? "",
//   uniqueCode: singlePurpose?.uniqueCode ?? "",
//   amount: singlePurpose?.amount ?? "",
//   startDate: singlePurpose?.startDate ?? "",
//   startTime: singlePurpose?.startTime ?? "",
//   endDate: singlePurpose?.endDate ?? "",
//   endTime: singlePurpose?.endTime ?? "",
//   promoCode: singlePurpose?.promoCode ?? "",
//   promoPercentage: singlePurpose?.promoPercentage ?? "",
//   referralBonus: singlePurpose?.referralBonus ?? "",
//   image: null,
//   imageUrl: null,
//   visibility: singlePurpose?.visibility ?? "",
//   visibilityStartDate: singlePurpose?.visibilityStartDate ?? "",
//   visibilityStartTime: singlePurpose?.visibiltyStartTime ?? "",
//   visibilityEndDate: singlePurpose?.vivisibilityEndDate ?? "",
//   visibilityEndTime: singlePurpose?.visibilityEndTime ?? "",
//   assignToCustomer: singlePurpose?.assignToCustomer ?? "",
//   assignedCustomers: singlePurpose?.assignedCustomers ?? "",
 
//   organisation: organizationId,
// }: {}

// let [initialValues, setInitialValues] = useState({})
//  if(actionToTake === 'create-purpose'){
//   [initialValues] = useState({
//     purposeName: '',
//     description: '',
//     category: '',
//     uniqueCode: '',
//     amount: 0,
//     startDate: new Date(),
//     startTime: '',
//     endDate: new Date(),
//     endTime: '',
//     promoCode: '',
//     promoPercentage: 0,
//     referralBonus: 0,
//     image: null,
//     imageUrl: null,
//     visibility: 'general',
//     visibilityStartDate: new Date(),
//     visibilityStartTime: '',
//     visibilityEndDate: new Date(),
//     visibilityEndTime: '',
//     assignToCustomer: '',
//     assignedCustomers: [],
//     // customerList: [],
//     organisation: organizationId,
// })
//  }

const initialValues:PurposeProps = actionToTake === 'edit-purpose' ?{
  purposeName: singlePurpose?.purposeName ?? "",
  description: singlePurpose?.description ?? "",
  category: singlePurpose?.category ?? "",
  uniqueCode: singlePurpose?.uniqueCode ?? "",
  amount: singlePurpose?.amount ?? 0,
  quantity: singlePurpose?.quantity ?? "Nill",
  startDate: extractDate(singlePurpose?.startDate) ?? "",
  startTime: singlePurpose?.startTime ?? "",
  endDate: extractDate(singlePurpose?.endDate) ?? "",
  endTime: singlePurpose?.endTime ?? "",
  promoCode: singlePurpose?.promoCode ?? "",
  promoPercentage: singlePurpose?.promoPercentage ?? "",
  referralBonus: singlePurpose?.referralBonus ?? 0,
  image: null,
  imageUrl: null,
  digitalItem: null,
  visibility: singlePurpose?.visibility ?? "",
  visibilityStartDate: extractDate(singlePurpose?.visibilityStartDate) ?? "",
  visibilityStartTime: singlePurpose?.visibiltyStartTime ?? "",
  visibilityEndDate: extractDate(singlePurpose?.visibilityEndDate) ?? "",
  visibilityEndTime: singlePurpose?.visibilityEndTime ?? "",
  assignToCustomer: singlePurpose?.assignToCustomer ?? "",
  assignedCustomers: singlePurpose?.assignedCustomers ?? "",
  referralBonusValue: singlePurpose?.referralBonusValue ?? "",
  SelectorAll: singlePurpose?.SelectorAll ?? "",
  selectorCategory: singlePurpose?.selectorCategory ?? "",
  organisation: organizationId,
 } : {

    purposeName: '',
    description: '',
    category: '',
    uniqueCode: '',
    amount: 0,
    quantity: 1,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    promoCode: '',
    promoPercentage: 0,
    referralBonus: 0,
    image: null,
    imageUrl: null,
    digitalItem: null,
    visibility: 'general',
    visibilityStartDate: '',
    visibilityStartTime: '',
    visibilityEndDate: '',
    visibilityEndTime: '',
    SelectorAll: 'selectorAllOptional',
    selectorCategory: 'selectorCategoryOptional',
    assignToCustomer: '',
    assignedCustomers: [],
    // customerList: [],
    organisation: organizationId,
    referralBonusValue: ''

 }

 const [assignedCustomerIds, setAssignedCustomerIds] = useState<string[]>([]);

  useEffect(() => {
    if(actionToTake === 'edit-purpose'){
      if (singlePurpose?.assignedCustomers) {
        
      const customerIds = singlePurpose.assignedCustomers?.map((customer: { _id: any }) => customer);
      setAssignedCustomerIds(customerIds || []);
    }
    }
    else{
      setAssignedCustomerIds([])
    }
    
  }, [singlePurpose, actionToTake]);

  
  
  

  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&organisation=${organizationId}&userType=individual`,
          {},
        )
        .then((response: AxiosResponse<customer[], any>) => {
          
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });

  const { data: allCustomersUnfiltered, isLoading: isLoadingAllCustomersUnfiltered } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&userType=individual`,
          {},
        )
        .then((response: AxiosResponse<customer[], any>) => {
          
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });
  const customerIds = allCustomersUnfiltered?.map(customer => customer._id);


  const validationSchema = Yup.object().shape({
    uniqueCode: Yup.string().length(8, 'The input must be exactly 8 characters').optional(),
    purposeName: Yup.string().required('Purpose name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    amount: Yup.number().required('Amount is required'),
    quantity: Yup.mixed().required('Quantity is required'),
    startDate: Yup.date().optional(),
    startTime: Yup.string().optional(),
    endDate: Yup.date().optional(),
    endTime: Yup.string().optional(),
    promoPercentage: Yup.number().optional(),
    referralBonus: Yup.number().required('Referral bonus is required'),
    visibility: Yup.string().required('Visibility is required'),
    visibilityStartDate: Yup.date().required('Visibility start date is required'),
    visibilityStartTime: Yup.string().required('Visibility start time is required'),
    visibilityEndDate: Yup.date().required('Visibility end date is required'),
    visibilityEndTime: Yup.string().required('Visibility end time is required'),
    SelectorAll: Yup.string().required('This field is required'),
    selectorCategory: Yup.string().required('This field is required'),
    assignedCustomers: Yup.array().optional(),
    imageUrl: Yup.mixed()
          
          .required()
          .test(
            "fileSize",
            "File size must be less than or equal to 5MB",
            (value) => {
              if (value instanceof FileList && value.length > 0) {
                return value[0].size <= 5242880; // 5MB limit
              }
              return true; // No file provided, so validation passes
            }
          )
          .test(
            "fileType",
            "Only .jpg, .png files are allowed",
            (value) => {
              if (value instanceof FileList && value.length > 0) {
                const fileType = value[0].type;
                return fileType === "image/jpeg" || fileType === "image/png"; // Only .jpg or .png allowed
              }
              return true; // No file provided, so validation passes
            }
          ),
    //  digitalItem: Yup.string().optional()
    
  });

  const formik = useFormik({
    initialValues,
     validationSchema,
     enableReinitialize: true,
    onSubmit: (values, {setSubmitting}) => {
      
        setTimeout(() => {
          if (actionToTake === "create-purpose") {
            console.log("creating user.....................");
        
              createPurpose(values);
            
          } else {
            console.log("editing user.....................");
            editPurpose(values);
          }

          setSubmitting(false);
        }, 800);
    },
  });


  useEffect(() => {
    const calculateReferralBonusValue = () => {
      const { amount, referralBonus } = formik.values;
    
      const referralBonusValue =( (referralBonus/100) * amount);
      console.log(referralBonusValue)
      formik.setFieldValue('referralBonusValue', referralBonusValue);
    };

    calculateReferralBonusValue();
  }, [formik.values.amount, formik.values.referralBonus]);

  const generatePromoCode = () => {
    const code = nanoid(6);
    formik.setFieldValue('promoCode', code);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
      const reader = new FileReader();
      reader.onload = () => {
        formik.setFieldValue('imageUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedOption = allCustomers?.find(
      (option) => option._id === selectedId,
    );
    if (
      !selectedOptions.some((option) => option?._id === selectedOption?._id)
    ) {
      setSelectedOptions([...selectedOptions, selectedOption!]);
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions.splice(index, 1);
    setSelectedOptions(updatedOptions);
  };

  const { mutate: createPurpose, isPending: isCreatingPurpose } = useMutation(
  {
   
    mutationFn: async (values: any) => {
      
      const formData = new FormData()
      formData.append("purposeName", values.purposeName)
      formData.append("description", values.description)
      formData.append("category", values.category)
     formData.append("organisation", organizationId)
      formData.append("uniqueCode", values.uniqueCode)
       formData.append("amount", values.amount)
       formData.append("merchantQuantity",  values.quantity);
      formData.append('startDate', values.startDate);
      formData.append('startTime', values.startTime);
      formData.append('endDate', values.endDate);
      formData.append('endTime', values.endTime);


      formData.append('promoCode', values.promoCode);
      formData.append('promoPercentage', values.promoPercentage);
      formData.append('referralBonus', values.referralBonus);
      formData.append('referralBonusValue', values.referralBonusValue);
      formData.append('visibility', values.visibility);
      formData.append('visibilityStartDate', values.visibilityStartDate);
      formData.append('visibilityStartTime', values.visibilityStartTime);
      formData.append('visibilityEndDate', values.visibilityEndDate);
      formData.append('visibilityEndTime', values.visibilityEndTime);
      formData.append('SelectorAll', values.SelectorAll);
      formData.append('selectorCategory', values.selectorCategory);
      const assignedCustomers = values.visibility === 'general' ? customerIds : values.assignedCustomers;

      assignedCustomers.forEach((item: string | Blob) => formData.append("assignedCustomers[]", item));
      
      if(values.imageUrl){
        formData.append("imageUrl", values.imageUrl[0]);
      }
      if(values.digitalItem){
        formData.append("digitalItem", values.digitalItem[0]);
      }


      return client.post(`/api/purpose`, formData
   
    );
    },

    onSuccess(response) {
      setUserCreated(true);
      setModalContent("status");
      setMutationResponse(response?.data.message);
      
      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form")
        router.push("/merchant/purpose/item")
      }, 3000);
      
    },

    onError(error: AxiosError<any, any>) {
      setUserCreated(false);
      setModalContent("status");
      
      setMutationResponse(error.response?.data.message);
      setTimeout(() => {
        setModalContent("form")
      }, 5000);
      
    },
  });

  const { mutate: editPurpose, isPending: isEditingPurpose } = useMutation(
    {
   
    mutationFn: async (values: any) => {
      const formData = new FormData()
      formData.append("purposeName", values.purposeName)
      formData.append("description", values.description)
      formData.append("category", values.category)
      formData.append("organisation", organizationId)
      formData.append("uniqueCode", values.uniqueCode)
      formData.append("amount", values.amount)
      formData.append("quantity", values.quantity)
      formData.append('startDate', values.startDate);
      formData.append('startTime', values.startTime);
      formData.append('endDate', values.endDate);
      formData.append('endTime', values.endTime);


      formData.append('promoCode', values.promoCode);
      formData.append('promoPercentage', values.promoPercentage);
      formData.append('referralBonus', values.referralBonus);
      formData.append('visibility', values.visibility);
      formData.append('visibilityStartDate', values.visibilityStartDate);
      formData.append('visibilityStartTime', values.visibilityStartTime);
      formData.append('visibilityEndDate', values.visibilityEndDate);
      formData.append('visibilityEndTime', values.visibilityEndTime);
      formData.append('SelectorAll', values.SelectorAll);
      formData.append('selectorCategory', values.selectorCategory);
      values.assignedCustomers.forEach((item: string | Blob) => formData.append("assignedCustomers[]", item))

      
      if(values.imageUrl){
        formData.append("imageUrl", values.imageUrl[0]);
      }
      if(values.digitalItem){
        formData.append("digitalItem", values.digitalItem[0]);
      }
      return client.put(`/api/purpose/${purposeToBeEdited}`, formData
   
    );
    },

    onSuccess(response) {
      setUserCreated(true);
      setModalContent("status");
      setMutationResponse(response?.data.message);
      
      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form")
        router.push("/merchant/users")
      }, 1000);
      
    },

    onError(error: AxiosError<any, any>) {
      setUserCreated(false);
      setModalContent("status");
      
      setMutationResponse(error.response?.data.message);
      setTimeout(() => {
        setModalContent("form")
      }, 1000);
      
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="m-0 text-xs font-medium text-white" htmlFor="purposeName">
        Purpose Name 
        <span className=" font-base font-semibold text-[#FF0000]">
           *
        </span>
        </label>
        <input
          id="purposeName"
          name="purposeName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.purposeName}
           className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
        />
        {formik.errors.purposeName && formik.touched.purposeName && (
          <div className="text-red-500"><>{formik.errors.purposeName}</></div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="m-0 text-xs font-medium text-white" htmlFor="description">
          Description
          <span className="font-base font-semibold text-[#FF0000]">
            *
          </span>
          </label>
        <textarea
          id="description"
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-sm text-[#7D7D7D]"
        />
        {formik.errors.description && formik.touched.description && (
          <div className="text-red-500"><>{formik.errors.description}</></div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4"> 
      <div className="flex flex-col space-y-2">
        <label className="m-0 text-xs font-medium text-white">
          Select All
          <span className="font-base font-semibold text-[#FF0000]">
            *
          </span>
        </label>
        <div className="flex items-center space-x-4">
          <div>
            <input
              id="selectorAllMandatory"
              type="radio"
              name="SelectorAll"
              value="selectorAllMandatory"
              onChange={formik.handleChange}
              checked={formik.values.SelectorAll === 'selectorAllMandatory'}
            />
            <label className="ml-2 m-0 text-xs font-medium text-white" htmlFor="selectorAllMandatory" >
              Mandatory for all
            </label>
          </div>
          <div>
            <input
              id="selectorAllOptional"
              type="radio"
              name="SelectorAll"
              value="selectorAllOptional"
              onChange={formik.handleChange}
              checked={formik.values.SelectorAll === 'selectorAllOptional'}
            />
            <label className="m-2 m-0 text-xs font-medium text-white" htmlFor="selectorAllOptional" >
              Optional for all
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="m-0 text-xs font-medium text-white">
          Category Selection
          <span className="font-base font-semibold text-[#FF0000]">
            *
          </span>
        </label>
        <div className="flex items-center space-x-4">
          <div>
            <input
              id="selectorCategoryMandatory"
              type="radio"
              name="selectorCategory"
              value="selectorCategoryMandatory"
              onChange={formik.handleChange}
              checked={formik.values.selectorCategory === 'selectorCategoryMandatory'}
            />
            <label className="ml-2 m-0 text-xs font-medium text-white" htmlFor="selectorCategoryMandatory" >
              Mandatory for all
            </label>
          </div>
          <div>
            <input
              id="selectorCategoryOptional"
              type="radio"
              name="selectorCategory"
              value="selectorCategoryOptional"
              onChange={formik.handleChange}
              checked={formik.values.selectorCategory === 'selectorCategoryOptional'}
            />
            <label className="m-2 m-0 text-xs font-medium text-white" htmlFor="selectorAllOptional" >
              Optional for all
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="m-0 text-xs font-medium text-white">
          Visibility
          <span className="font-base font-semibold text-[#FF0000]">
            *
          </span>
        </label>
        <div className="flex items-center space-x-4">
          <div>
            <input
              id="visibilityGeneral"
              type="radio"
              name="visibility"
              value="general"
              onChange={formik.handleChange}
              checked={formik.values.visibility === 'general'}
            />
            <label className="ml-2 m-0 text-xs font-medium text-white" htmlFor="visibilityGeneral" >
              General Visibility
            </label>
          </div>
          <div>
            <input
              id="visibilityInhouse"
              type="radio"
              name="visibility"
              value="inhouse"
              onChange={formik.handleChange}
              checked={formik.values.visibility === 'inhouse'}
            />
            <label className="m-2 m-0 text-xs font-medium text-white" htmlFor="visibilityInhouse" >
              Inhouse
            </label>
          </div>
        </div>
      </div>
      </div>

      {formik.values.visibility !== "general" ? 
                <label
                  htmlFor="assignedCustomers"
                  className="m-0 text-xs font-medium text-white"
                >
                  Assign Customers
                </label> : ""
                }
               
               {actionToTake === 'create-purpose' && formik.values.visibility !== "general" ?
               (
                  <div className="w-full">
                  <select
      title="Select an option"
      name="assignedCustomers"
      className="bg-right-20 mt-1 w-full cursor-pointer appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        handleOptionChange(e);
        let assignedCustomers = formik.values.assignedCustomers;

        if (!assignedCustomers.includes(e.target.value)) {
          const updatedAssignedCustomers = [
            ...assignedCustomers,
            e.target.value,
          ];
          formik.setFieldValue("assignedCustomers", updatedAssignedCustomers);
        }
      }}
    >
      <option value="" label="Select an option" />
      {allCustomers?.map((option) => (
        <option key={option._id} value={option._id}>
          {option.firstName} {option.lastName}
        </option>
      ))}
    </select>

        <div className="space-x-1 space-y-2">
          {formik.values.assignedCustomers.map((customerId: string, index: number ) => {
            const option = allCustomers?.find(
              (user) => user._id === customerId,
            );
            return (
              <div key={index} className="mb-2 mr-2 inline-block">
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveOption(index);
                    const updatedCustomers =
                      formik.values.assignedCustomers.filter(
                        (id: any) => id !== customerId,
                      );
                    formik.setFieldValue(
                      "assignedCustomers",
                      updatedCustomers,
                    );
                  }}
                  className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm"
                >
                  {option?.firstName} {option?.lastName}
                  <span className="ml-1 h-5 w-3 cursor-pointer text-gray-700">
                    ×
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      )
      : ""}

{actionToTake === 'edit-purpose' ? (
  <div className="w-full">
    <select
      title="Select an option"
      name="assignedCustomers"
      className="bg-right-20 mt-1 w-full cursor-pointer appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        handleOptionChange(e);
        let assignedCustomers = assignedCustomerIds;

        if (!assignedCustomers.includes(e.target.value)) {
          const updatedAssignedCustomers = [
            ...assignedCustomers,
            e.target.value,
          ];
          setAssignedCustomerIds(updatedAssignedCustomers);
        }
      }}
    >
      <option value="hidden"></option>
      {allCustomers?.map((option) => (
        <option key={option._id} value={option._id}>
          {option.firstName + "76"} {option.lastName}
        </option>
      ))}
    </select>

    <div className="space-x-1 space-y-2">
      
      {assignedCustomerIds.map((customerId: string, index: number) => {
        const option = allCustomers?.find(
          (user) => user._id === customerId,
        );
        
        return (
          <div key={index} className="mb-2 mr-2 inline-block">
            <button
              type="button"
              onClick={() => {
                handleRemoveOption(index);
                const updatedCustomers = assignedCustomerIds.filter(
                  (id: any) => id !== customerId,
                );
                setAssignedCustomerIds(updatedCustomers);
              }}
              className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm"
            >
              {option?.firstName} {option?.lastName}
              <span className="ml-1 h-5 w-3 cursor-pointer text-gray-700">
                ×
              </span>
            </button>
          </div>
        );
      })}
    </div>
  </div>
) : ""}

{formik.errors.assignedCustomers && formik.touched.assignedCustomers && (
          <div className="text-red-500"><>{formik.errors.assignedCustomers}</></div>
        )}


    {actionToTake === 'create-purpose' && formik.values.visibility !== "general"? (
      <div className="flex gap-x-3  mt-2">
      <input
      id="selectAllCustomers"
      name="selectAllCustomers"
      type="checkbox"
      className="block h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-600"
       checked={formik.values.assignedCustomers.length === allCustomers?.length}
      onChange={(e) => {
        if (e.target.checked) {
          formik.setFieldValue(
            "assignedCustomers",
            allCustomers?.map((customer) => customer._id),
          );
        } else {
          formik.setFieldValue("assignedCustomers", []);
        }
      }}
    />
              
      <label
        htmlFor="selectAllCustomers"
        className="m-0 text-sm capitalize text-white"
      >
        Select all Customers
      </label>
    </div>
      ): ''}

{actionToTake === 'edit-purpose' ? (
  <div className="flex gap-x-3">
    <input
      id="selectAllCustomers"
      name="selectAllCustomers"
      type="checkbox"
      className="block h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-600"
      checked={
        assignedCustomerIds.length === allCustomers?.length
      }
      onChange={(e) => {
        if (e.target.checked) {
          if (allCustomers) {
            setAssignedCustomerIds(allCustomers.map((customer) => customer._id));
          }
        } else {
          setAssignedCustomerIds([]);
        }
      }}
    />
    <label
      htmlFor="selectAllCustomers"
      className="m-0 text-sm capitalize text-white"
    >
      Select all Customers
    </label>
  </div>
) : ""}


      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="category">
            Category <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
            </label>
          <select
            id="category"
            name="category"
            onChange={formik.handleChange}
            value={formik.values.category}
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          >
            <option value="">Select Category</option>
            
            {formik.values.visibility === "inhouse" ? allCatgories?.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
            )):
            allGeneralCategories?.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
          ))
          
          }
            
            {/* <option value="category2">Category 2</option> */}
          </select>
          {formik.errors.category && formik.touched.category && (
            <div className="text-red-500"><>{formik.errors.category}</></div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="uniqueCode">Custom Unique Code (Optional)</label>
          <input
            id="uniqueCode"
            name="uniqueCode"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.uniqueCode}
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
          {formik.errors.uniqueCode && formik.touched.uniqueCode && (
            <div className="text-red-500"><>{formik.errors.uniqueCode}</></div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col space-y-2 ">
        <label className="m-0 text-xs font-medium text-white" htmlFor="amount">
          Amount
          <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
          </label>
        <input
          id="amount"
          name="amount"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.amount}
          className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
        />
        {formik.errors.amount && formik.touched.amount && (
          <div className="text-red-500"><>{formik.errors.amount}</></div>
        )}
      </div>

      <div className="flex flex-col space-y-2 ">
        <label className="m-0 text-xs font-medium text-white" htmlFor="quantity">
          Quantity (Nill for unquantifiabe purpose/item)
          <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
          </label>
        <input
          id="quantity"
          name="quantity"
         
          onChange={formik.handleChange}
          value={formik.values.quantity}
          className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
        />
        {formik.errors.quantity && formik.touched.quantity && (
          <div className="text-red-500"><>{formik.errors.quantity}</></div>
        )}
      </div>
        </div>
        <div><h1 className="text-xl text-white">Maximum payment Duration</h1>
      <div className="grid grid-cols-2 gap-4 mt-1">
        
        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-right-20 w-full rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
          {formik.errors.startDate && formik.touched.startDate && (
            <div className="text-red-500">{formik.errors.startDate}</div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="startTime">Start Time</label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            onChange={formik.handleChange}
            value={formik.values.startTime}
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
          {formik.errors.startTime && formik.touched.startTime && (
            <div className="text-red-500"><>{formik.errors.startTime}</></div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="endDate">End Date</label>
          <input
        type="date"
        id="endDate"
        name="endDate"
        value={formik.values.endDate}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="bg-right-20 w-full rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
      />
          {formik.errors.endDate && formik.touched.endDate && (
            <div className="text-red-500">{formik.errors.endDate}</div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="endTime">End Time</label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            onChange={formik.handleChange}
            value={formik.values.endTime}
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
          {formik.errors.endTime && formik.touched.endTime && (
            <div className="text-red-500"><>{formik.errors.endTime}</></div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        
      </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="promoCode">Promo Code</label>
          <div className="relative flex flex-col sm:flex-row items-center">
  <button
    type="button"
    onClick={generatePromoCode}
    className="bg-blue-500 px-2 text-xs md:text-lg md:px-4 rounded-md mb-2 sm:mb-0 sm:absolute sm:left-2 sm:top-1/2 sm:transform sm:-translate-y-1/2 btn text-white"
  >
    Generate
  </button>
  <input
    id="promoCode"
    name="promoCode"
    type="text"
    onChange={formik.handleChange}
    value={formik.values.promoCode}
    className="w-full pl-4 sm:pl-[7rem] rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
  />
</div>


        </div>

        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="promoPercentage">Promo Percentage</label>
          <input
            id="promoPercentage"
            name="promoPercentage"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.promoPercentage}
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
          {formik.errors.promoPercentage && formik.touched.promoPercentage && (
            <div className="text-red-500"><>{formik.errors.promoPercentage}</></div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
        <label className="m-0 text-xs font-medium text-white" htmlFor="referralBonus">Referral Bonus %</label>
        <input
          id="referralBonus"
          name="referralBonus"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.referralBonus}
          className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
        />
        {formik.errors.referralBonus && formik.touched.referralBonus && (
          <div className="text-red-500"><>{formik.errors.referralBonus}</></div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="m-0 text-xs font-medium text-white" htmlFor="referralBonusValue">Referral Bonus Value</label>
        <input
          id="referralBonusValue"
          name="referralBonusValue"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.referralBonusValue}
          className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
        />
        {formik.errors.referralBonusValue && formik.touched.referralBonusValue && (
          <div className="text-red-500"><>{formik.errors.referralBonusValue}</></div>
        )}
      </div>

      </div>

     

      {/* {actionToTake === 'create-purpose' ? (
             <div className="flex flex-col space-y-2">
             <label className="m-0 text-xs font-medium text-white">Upload Image</label>
             <label
               htmlFor="imageUrl"
               className="mt-1 flex h-[150px] cursor-pointer items-center justify-center  rounded-md bg-[#F3F4F6] px-6 pb-6 pt-5"
               >
                 <Image
                       src="/upload.svg"
                       alt="document upload icon"
                       width={48}
                       height={48}
                     />
                      
                       <input
                 id="image"
                 name="image"
                 type="file"
                 onChange={handleImageChange}
                className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
               />
               </label>
               
               {formik.values.imageUrl && (
                 <Image
                 width={48}
                 height={48}
                   src={formik.values.imageUrl}
                   alt="Selected"
                   className="mt-2 w-32 h-32 object-cover"
                 />
               )}
             </div>
      ) : ""} */}

        {actionToTake === 'create-purpose' ? (
                  <div className="mt-4">
                  <label
                    htmlFor="imageUrl"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Upload Purpose/ Item’s Cover Image Picture (max-size - 5MB)
                    <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
                  </label>
                  <label
                    htmlFor="imageUrl"
                    className="mt-1 flex h-[150px] cursor-pointer items-center justify-center  rounded-md bg-[#F3F4F6] px-6 pb-6 pt-5"
                  >
                    <input
                      type="file"
                      name="imageUrl"
                      id="imageUrl"
                      className="hidden w-full"
                      onChange={(e) => {
                        formik.setFieldValue("imageUrl", e.target.files);
                      }}
                      accept="application/pdf, .jpg, .png"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src="/upload.svg"
                        alt="document upload icon"
                        width={48}
                        height={48}
                      />
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.jpg, .png</span> here, or
                        click to select one
                      </p>
                    </div>
                  </label>
                  {formik.values.imageUrl &&
                    formik.values.imageUrl[0] &&
                    ((formik.values.imageUrl[0] as unknown as File).type.includes("image") ? (
                      <Image
                        src={URL.createObjectURL(formik.values.imageUrl[0])}
                        alt="imageUrl"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(formik.values.imageUrl[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Thumbnail Image"
                      ></iframe>
                    ))}
                    {formik.errors.imageUrl && formik.touched.imageUrl && typeof formik.errors.imageUrl === 'string' && (
                      <div className="text-red-500">{formik.errors.imageUrl}</div>
                    )}

                 
                </div>
                ): ''}
                

      {
                actionToTake === 'edit-purpose' ? (
                  <div className="mb-8">
                  <div className="mb-4 ">
                  <label
                  htmlFor="image"
                  className="mb-8  text-xs font-medium text-white"
                >
                  Picture (max-size - 5MB)
                </label>
                  {formik.values.imageUrl && (formik.values.imageUrl as string).length > 0 && formik.values.imageUrl  ? (
                      <Image
                        src={URL.createObjectURL(formik.values.imageUrl[0])} // Display placeholder image or actual image URL
                        alt="photo"
                        className="h-auto w-full"
                        style={{ maxWidth: "100%" }}
                        width={500}
                        height={300}
                      />
                    ) : (
                      <Image
                        src={singlePurpose ? singlePurpose?.imageUrl: ""} // Display placeholder image or actual image URL
                        alt="photo"
                        className="h-auto w-full"
                        style={{ maxWidth: "100%" }}
                        width={500}
                        height={300}
                      />
                    )}
                  </div>

                  <div className="mt-8">
                    <label
                      htmlFor="imageUrl"
                      className=" cursor-pointer rounded-md bg-[#221C3E]  px-4 py-2 text-white hover:bg-gray-400"
                    >
                      Change
                      <input
                        id="imageUrl"
                        name="imageUrl"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files;
                          formik.setFieldValue("imageUrl", file); // Store the selected file in state
                        }}
                      />
                    </label>
                    
                    {formik.isSubmitting && (
                      <span className="ml-2">Uploading...</span>
                    )}
                  </div>
             </div>
                ): ""
              }







      {actionToTake === 'create-purpose' ? (
                  <div className="mt-4">
                  <label
                    htmlFor="digitalItem"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Upload Purpose/ Item’s for video, audio or document (Optional max-size - 5MB)
                  </label>
                  <label
                    htmlFor="digitalItem"
                    className="mt-1 flex h-[150px] cursor-pointer items-center justify-center  rounded-md bg-[#F3F4F6] px-6 pb-6 pt-5"
                  >
                    <input
                      type="file"
                      name="digitalItem"
                      id="digitalItem"
                      className="hidden w-full"
                      onChange={(e) => {
                        formik.setFieldValue("digitalItem", e.target.files);
                      }}
                      accept="application/pdf, .jpg, .png"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src="/upload.svg"
                        alt="document upload icon"
                        width={48}
                        height={48}
                      />
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.jpg, .png</span> here, or
                        click to select one
                      </p>
                    </div>
                  </label>
                  {formik.values.digitalItem &&
                    formik.values.digitalItem[0] &&
                    ((formik.values.digitalItem[0] as unknown as File).type.includes("image") ? (
                      <Image
                        src={URL.createObjectURL(formik.values.digitalItem[0])}
                        alt="digitalItem"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(formik.values.digitalItem[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Thumbnail Image"
                      ></iframe>
                    ))}
                    {formik.errors.imageUrl && formik.touched.imageUrl && typeof formik.errors.imageUrl === 'string' && (
                      <div className="text-red-500">{formik.errors.imageUrl}</div>
                    )}

                  {/* <div className="text-xs text-red-600">
                    <ErrorMessage name="digitalItem" />
                  </div> */}
                </div>
                ): ''}
                

      {
                actionToTake === 'edit-purpose' ? (
                  <div className="mb-8">
                  <div className="mb-4 ">
                  <label
                  htmlFor="image"
                  className="mb-8  text-xs font-medium text-white"
                >
                  Picture (max-size - 5MB)
                </label>
                  {formik.values.digitalItem && (formik.values.digitalItem as string).length > 0 && formik.values.digitalItem  ? (
                      <Image
                        src={URL.createObjectURL(formik.values.digitalItem[0])} // Display placeholder image or actual image URL
                        alt="photo"
                        className="h-auto w-full"
                        style={{ maxWidth: "100%" }}
                        width={500}
                        height={300}
                      />
                    ) : (
                      <Image
                        src={singlePurpose ? singlePurpose?.digitalItem: ""} // Display placeholder image or actual image URL
                        alt="photo"
                        className="h-auto w-full"
                        style={{ maxWidth: "100%" }}
                        width={500}
                        height={300}
                      />
                    )}
                  </div>

                  <div className="mt-8">
                    <label
                      htmlFor="digitalItem"
                      className=" cursor-pointer rounded-md bg-[#221C3E]  px-4 py-2 text-white hover:bg-gray-400"
                    >
                      Change
                      <input
                        id="digitalItem"
                        name="digitalItem"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files;
                          formik.setFieldValue("digitalItem", file); // Store the selected file in state
                        }}
                      />
                    </label>
                    
                    {formik.isSubmitting && (
                      <span className="ml-2">Uploading...</span>
                    )}
                  </div>
             </div>
                ): ""
              }




      

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="visibilityStartDate">
            Visibility Start Date
            <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
          </label>
          <input
        type="date"
        id="visibilityStartDate"
        name="visibilityStartDate"
        value={formik.values.visibilityStartDate}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="bg-right-20 w-full rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
      />
          {formik.errors.visibilityStartDate && formik.touched.visibilityStartDate && (
            <div className="text-red-500">{formik.errors.visibilityStartDate}</div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="visibilityStartTime">
            Visibility Start Time
            <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
            </label>
          <input
            id="visibilityStartTime"
            name="visibilityStartTime"
            type="time"
            onChange={formik.handleChange}
            value={formik.values.visibilityStartTime}
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
          {formik.errors.visibilityStartTime && formik.touched.visibilityStartTime && (
            <div className="text-red-500"><>{formik.errors.visibilityStartTime}</></div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="visibilityEndDate">
            Visibility End Date
            <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
            </label>
          <input
              type="date"
              id="visibilityEndDate"
              name="visibilityEndDate"
              value={formik.values.visibilityEndDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-right-20 w-full rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
      />
          {formik.errors.visibilityEndDate && formik.touched.visibilityEndDate && (
            <div className="text-red-500">{formik.errors.visibilityEndDate}</div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="m-0 text-xs font-medium text-white" htmlFor="visibilityEndTime">
            Visibility End Time
            <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
            </label>
          <input
            id="visibilityEndTime"
            name="visibilityEndTime"
            type="time"
            onChange={formik.handleChange}
            value={formik.values.visibilityEndTime}
            className="bg-right-20 w-full rounded-lg border-0  bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
          />
          {formik.errors.visibilityEndTime && formik.touched.visibilityEndTime && (
            <div className="text-red-500"><>{formik.errors.visibilityEndTime}</></div>
          )}
        </div>
      </div>

      <div className="mb-4 w-3/4">
           

        <button
            type="submit"
            className="w-1/2 rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
            onClick={() => {
             
              formik.submitForm();
            }}
            disabled={formik.isSubmitting || isCreatingPurpose}
          >
            {formik.isSubmitting || isCreatingPurpose || isEditingPurpose  ? (
              <Image
                src="/loadingSpinner.svg"
                alt="loading spinner"
                className="relative left-1/2"
                width={25}
                height={25}
              />
            ) : (
              "Submit"
            )}
        </button>
      </div>
    </form>
  );
};

export default function Page() {
  return <Purpose />;
}

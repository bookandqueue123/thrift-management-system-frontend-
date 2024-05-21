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
  customer,
  mutateUserProps,
  roleResponse,
  staffResponse,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
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

const Users = () => {
  const PAGE_SIZE = 5;
  const organisationId = useSelector(selectOrganizationId);
  const { userPermissions, permissionsMap } = usePermissions();

  const [isUserCreated, setIsUserCreated] = useState(false);
  const [isUserEdited, setIsUserEdited] = useState(false);
  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );
  const [mutationResponse, setMutationResponse] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");

  const { client } = useAuth();
  const user = useSelector(selectUser);

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-user" | "create-user" | "view-user" | ""
  >("");

  const [openDropdown, setOpenDropdown] = useState<number>(0);
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };
  const [userToBeEdited, setUserToBeEdited] = useState("");

  const {
    data: allUsers,
    isLoading: isLoadingAllUsers,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=staff&organisation=${organisationId}&userType=individual`,
          {},
        )
        .then((response: AxiosResponse<customer[], any>) => {
          setFilteredUsers(response.data);
          console.log(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error);
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
          console.log(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error);
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
          console.log("allCustomers", response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // setSearchResult(e.target.value);
    console.log(e.target.value);

    if (allUsers) {
      const filtered = allUsers.filter((item) =>
        String(item.firstName || item.lastName).includes(
          String(e.target.value),
        ),
      );
      // Update the filtered data state
      setFilteredUsers(filtered);
    }
  };
  // const handleDateFilter = () => {
  //   // Filter the data based on the date range
  //   if (allUsers) {
  //     const filtered = allUsers.filter((item) => {
  //       const itemDate = new Date(item.createdAt); // Convert item date to Date object
  //       const startDateObj = new Date(fromDate);
  //       const endDateObj = new Date(toDate);

  //       return itemDate >= startDateObj && itemDate <= endDateObj;
  //     });

  //     // Update the filtered data state
  //     setFilteredUsers(filtered);
  //   }
  // };

  const paginatedRoles = filteredUsers?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allUsers) {
    totalPages = Math.ceil(allUsers.length / PAGE_SIZE);
  }

  useEffect(() => {
    refetch();
    refetchAllRoles();
  }, [isUserCreated, isUserEdited, modalContent, refetch, refetchAllRoles]);

  const viewUser = user?.role === "organisation" ||   (user?.role === "staff" &&
                                userPermissions.includes(
                                  permissionsMap["view-users"],
                                ))

  const editUser = (user?.role === "organisation" ||
  (user?.role === "staff" &&
    userPermissions.includes(
      permissionsMap["edit-user"],
    )))

  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Users
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
              label="Create User"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-user");
                setModalContent("form");
                setIsUserCreated(false);
              }}
            />
          )}
          
        </div>
      

        <p className="mb-2 text-base font-medium text-white">
          Existing Users List
        </p>

        <div>
          <TransactionsTable
            headers={[
              "Username",
              "Account  Created On",
              "Email Address",
              "Phone Number",
              "Roles",
              "Assigned Customers",
              "Action",
            ]}
            content={
              filteredUsers.length === 0 ? (
                <tr className="h-[3rem]">
                  <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                    No Users yet
                  </p>
                </tr>
              ) : (
                paginatedRoles?.map((user, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.firstName + " " + user.lastName || "----"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.createdAt || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.email || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.phoneNumber || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {allRoles
                        ?.filter((role) =>
                          user?.roles.some(
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
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {allCustomers
                        ?.filter((customer) =>
                          user?.assignedUser.some(
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
                            viewUser ? "View User": '',
                            // (user?.role === "organisation" ||
                            //   (user?.role === "staff" &&
                            //     userPermissions.includes(
                            //       permissionsMap["view-users"],
                            //     ))) &&
                            //   "View User",

                            editUser ? "Edit User": '',
                            // (user?.role === "organisation" ||
                            //   (user?.role === "staff" &&
                            //     userPermissions.includes(
                            //       permissionsMap["edit-user"],
                            //     ))) &&
                            //   "Edit User",
                          ].filter(Boolean) as string[],
                          actions: [
                            () => {
                              // if (
                              //   user?.role === "organisation" ||
                              //   (user?.role === "staff" &&
                              //     userPermissions.includes(
                              //       permissionsMap["view-users"],
                              //     ))
                              // )
                               {
                                setModalState(true);
                                setModalToShow("view-user");
                                setUserToBeEdited(user._id);
                                setIsUserEdited(false);

                                console.log(user._id);
                              }
                            },
                            () => {
                              // if (
                              //   user?.role === "organisation" ||
                              //   (user?.role === "staff" &&
                              //     userPermissions.includes(
                              //       permissionsMap["edit-user"],
                              //     ))
                              // )
                               {
                                setModalToShow("edit-user");
                                setModalState(true);
                                setUserToBeEdited(user._id);
                                setIsUserEdited(false);
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
                modalToShow === "edit-user"
                  ? "Edit User"
                  : modalToShow === "create-user"
                    ? "Create a User"
                    : modalToShow === "view-user"
                      ? "View User"
                      : ""
              }
            >
              {modalContent === "form" ? (
                <div className="px-[10%]">
                  {modalToShow === "view-user" ? (
                    <ViewUser userId={userToBeEdited} />
                  ) : (
                    <MutateUser
                      setCloseModal={setModalState}
                      setUserCreated={setIsUserCreated}
                      setUserEdited={setIsUserEdited}
                      setModalContent={setModalContent}
                      setMutationResponse={setMutationResponse}
                      actionToTake={modalToShow}
                      userToBeEdited={userToBeEdited}
                    />
                  )}
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`User ${modalToShow === "create-user" ? "Creation" : "Editing"} Successful`}
                  errorTitle={`User ${modalToShow === "create-user" ? "Creation" : "Editing"} Failed`}
                  status={isUserCreated || isUserEdited ? "success" : "failed"}
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
  userToBeEdited,
}: {
  actionToTake: "create-user" | "edit-user" | "view-user" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setUserCreated: Dispatch<SetStateAction<boolean>>;
  setUserEdited: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
  setMutationResponse: Dispatch<SetStateAction<string>>;
  userToBeEdited: string;
}) => {
  const { client } = useAuth();
  const organizationId = useSelector(selectOrganizationId);
  const userId = useSelector(selectUserId);
  const [selectedOptions, setSelectedOptions] = useState<
    (customer | undefined)[]
  >([]);
  const initialValues: mutateUserProps = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    homeAddress: "",
    dept_unit: "",
    userPicture: null,
    guarantor2ID: null,
    guarantorForm: null,
    guarantorForm2: null,
    idType: "",
    meansOfIDPhoto: null,
    guarantor1Name: "",
    guarantor1Email: "",
    guarantor1Phone: "",
    guarantor1Address: "",
    guarantor2Name: "",
    guarantor2Email: "",
    guarantor2Phone: "",
    guarantor2Address: "",
    assignedCustomers: [],
    roles: [],
  };

  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&organisation=${organizationId}&userType=individual`,
          {},
        )
        .then((response: AxiosResponse<customer[], any>) => {
          console.log("allCustomers", response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });

  const { data: allRoles, isLoading: isLoadingAllRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      return client
        .get(`/api/role?organisation=${organizationId}`)
        .then((response: AxiosResponse<roleResponse[], any>) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });

  
 
  const { mutate: createUser, isPending: isCreatingRole } = useMutation({
    mutationFn: async (values: mutateUserProps) => {
      console.log("role created");

      const formData = new FormData()
      formData.append("firstName", values.firstName)
      formData.append("lastName", values.lastName)
      formData.append("phoneNumber", values.phone)
      formData.append("organisation", organizationId)
      formData.append("homeAddress", values.homeAddress)
      formData.append("email", values.email)
      
      formData.append('guarantor1.fullName', values.guarantor1Name);
      formData.append('guarantor1.homeAddress', values.guarantor1Address);
      formData.append('guarantor1.email', values.guarantor1Email);
      formData.append('guarantor1.phoneNumber', values.guarantor1Phone);


      formData.append('guarantor2.fullName', values.guarantor2Name);
      formData.append('guarantor2.homeAddress', values.guarantor2Address);
      formData.append('guarantor2.email', values.guarantor2Email);
      formData.append('guarantor2.phoneNumber', values.guarantor2Phone);

      formData.append("roles", values.roles)
      formData.append("assignedUser", values.assignedCustomers)
      formData.append('meansOfID', values.idType)
      formData.append
      if(values.userPicture){
        formData.append("photo", values.userPicture[0]);
      }
      if(values.guarantorForm){
        formData.append("guarantorForm", values.guarantorForm[0]);
      }
      if(values.guarantorForm2){
        formData.append("guarantorForm2", values.guarantorForm2[0]);
      }
      if(values.meansOfIDPhoto){
        formData.append("meansOfIDPhoto", values.meansOfIDPhoto[0]);
      }

      return client.post(`/api/user/create-staff`, formData
      //  {
      //   firstName: values.firstName,
      //   lastName: values.lastName,
      //   phoneNumber: values.phone,
      //   organisation: organizationId,
      //   homeAddress: values.homeAddress,
      //   email: values.email,
      //   photo: values.userPicture,
      //    guarantorForm: values.guarantorForm,
      //   guarantor1: {
      //     fullName: values.guarantor1Name,
      //     homeAddress: values.guarantor1Address,
      //     email: values.guarantor1Email,
      //     phoneNumber: values.guarantor1Phone,
      //   },
      //   guarantor2: {
      //     fullName: values.guarantor2Name,
      //     homeAddress: values.guarantor2Address,
      //     email: values.guarantor2Email,
      //     phoneNumber: values.guarantor2Phone,
      //   },
      //   roles: [values.roles],
      //   assignedUser: values.assignedCustomers,
      // }
    );
    },

    onSuccess(response) {
      setUserCreated(true);
      setModalContent("status");
      setMutationResponse(response?.data.message);
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setUserCreated(false);
      setModalContent("status");
      console.log(error.response?.data.message);
      setMutationResponse(error.response?.data.message);
    },
  });

  const { mutate: editUser, isPending: isEditingRole } = useMutation({
    mutationKey: ["edit user"],
    mutationFn: async (values: mutateUserProps) => {
      // const socials = {
      //   facebook: values.facebook,
      //   twitter: values.instagram,
      //   instagram: values.linkedIn,
      //   linkedIn: values.twitter,
      //   pintrest: values.pinterest,
      // };

      // const formData = new FormData();

      // formData.append("description", values.description);
      // formData.append("region", values.city);
      // formData.append("country", values.country);
      // formData.append("state", values.state);
      // formData.append("city", values.lga);
      // formData.append("socialMedia", JSON.stringify(socials));
      // formData.append("tradingName", values.tradingName);
      // formData.append("website", values.websiteUrl);
      // formData.append("businessEmailAdress", values.email);
      // formData.append("officeAddress1", values.officeAddress);
      // formData.append("officeAddress2", values.address2);
      // formData.append("organisationName", values.organisationName);
      // formData.append("email", values.email);
      // formData.append("phoneNumber", values.phoneNumber);

      // if (values.organisationLogo) {
      //   formData.append("organisationLogo", values.organisationLogo[0]);
      // }
      //  if (values.BankRecommendation) {
      //   formData.append("BankRecommendation", values.BankRecommendation[0]);
      // }
      //  if (values.CommunityRecommendation) {
      //   formData.append("CommunityRecommendation", values.CommunityRecommendation[0]);
      // }
      //  if (values.CourtAffidavit) {
      //    formData.append("CourtAffidavit", values.CourtAffidavit[0]);
      //  }
      console.log(values);
      console.log("role edited");
      // return client.put(`/api/user/${userId}`, formData);
      return client.put(`/api/user/${userToBeEdited}`, {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phone,
        organisation: organizationId,
        homeAddress: values.homeAddress,
        email: values.email,
        guarantor1: {
          fullName: values.guarantor1Name,
          homeAddress: values.guarantor1Address,
          email: values.guarantor1Email,
          phoneNumber: values.guarantor1Phone,
        },
        guarantor2: {
          fullName: values.guarantor2Name,
          homeAddress: values.guarantor2Address,
          email: values.guarantor2Email,
          phoneNumber: values.guarantor2Phone,
        },
        roles: [values.roles],
        assignedUser: values.assignedCustomers,
      });
    },

    onSuccess(response) {
      setUserEdited(true);
      setModalContent("status");
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setUserEdited(false);
      setModalContent("status");
      console.log(error.response?.data.message);
      setMutationResponse(error.response?.data.message);
    },
  });

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

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={Yup.object({
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        email: Yup.string().required("Required").email("Invalid email address"),
        phone: Yup.string()
          .matches(
            /^(?:\+234\d{10}|\d{11})$/,
            "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
          )
          .required("Required"),
        homeAddress: Yup.string().required("Required"),
        dept_unit: Yup.string().optional(),
        userPicture: Yup.mixed()
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
          )
          .test(
            "fileType",
            "Only .jpg, .png files are allowed",
            (value: MyFileList) => {
              if (value) {
                const file = value[0];
                const fileType = file.type;
                return fileType === "image/jpeg" || fileType === "image/png";
              }
              return true;
            },
          ),
        // guarantor2ID: Yup.mixed()
        //   .required("required")
        //   .test(
        //     "fileSize",
        //     "File size must be less than 2MB",
        //     (value: MyFileList) => {
        //       if (value) {
        //         return value[0].size <= 2097152;
        //       }
        //       return true;
        //     },
        //   )
        //   .test(
        //     "fileType",
        //     "Only .jpg, .png files are allowed",
        //     (value: MyFileList) => {
        //       if (value) {
        //         const file = value[0];
        //         const fileType = file.type;
        //         return fileType === "image/jpeg" || fileType === "image/png";
        //       }
        //       return true;
        //     },
        //   ),
        idType: Yup.string().optional(),
        guarantor1Name: Yup.string().required("Required"),
        guarantor1Email: Yup.string()
          .required("Required")
          .email("Invalid email address"),
        guarantor1Phone: Yup.string()
          .matches(
            /^(?:\+234\d{10}|\d{11})$/,
            "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
          )
          .required("Required"),
        guarantor1Address: Yup.string().required("Required"),
        guarantor2Name: Yup.string().required("Required"),
        guarantor2Email: Yup.string()
          .required("Required")
          .email("Invalid email address"),
        guarantor2Address: Yup.string().required("Required"),
        assignedCustomers: Yup.array()
          .of(Yup.string())
          .min(1, "At least one customer must be selected")
          .required("required"),
        roles: Yup.string().required("Required"),
        guarantorForm: Yup.mixed()
          .optional()
          .test(
            "fileSize",
            "File size must be less than 2MB",
            (value?: MyFileList) => {
              if (value) {
                return value[0].size <= 2097152;
              }
              return true;
            },
          )
          .test(
            "fileType",
            "Only .pdf, .jpg, .png files are allowed",
            (value?: MyFileList) => {
              if (value) {
                const file = value[0];
                const fileType = file.type;
                return (
                  fileType === "application/pdf" ||
                  fileType === "image/jpeg" ||
                  fileType === "image/png"
                );
              }
              return true;
            },
          ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        
        setTimeout(() => {
          if (actionToTake === "create-user") {
            console.log("creating user.....................");
             console.log(values, 234567)
              createUser(values);
            
          } else {
            console.log("editing user.....................");
            editUser(values);
          }

          setSubmitting(false);
        }, 800);
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
        <form className=" flex flex-col items-center" onSubmit={handleSubmit}>
          <div className=" mb-10 w-full space-y-10 rounded-md bg-white px-[5%] py-[3%]">
            {/* Personal Details */}
            <section>
              <div className="my-3 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    First Name
                  </label>
                  <Field
                    onChange={handleChange}
                    name="firstName"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Last Name
                  </label>
                  <Field
                    name="lastName"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
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
                    htmlFor="phone"
                    className="text-ajo_darkBluee m-0 text-xs font-medium"
                  >
                    Phone Number
                  </label>
                  <Field
                    name="phone"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
              </div>
              <div className="my-3 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label
                    htmlFor="homeAddress"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Home Address
                  </label>
                  <Field
                    onChange={handleChange}
                    name="homeAddress"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="homeAddress"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="mb-4 flex-1">
                  <label
                    htmlFor="dept_unit"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Department/Unit
                  </label>
                  <Field
                    as="select"
                    id="dept_unit"
                    name="dept_unit"
                    className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                  >
                    {/* {StatesAndLGAs.map((country) => (
                    <option key={country.country} value={country.country}>
                      {country.country}
                    </option>
                  ))} */}
                    <option className="invisible"></option>
                  </Field>
                  <ErrorMessage
                    name="dept_unit"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="userPicture"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Picture
                </label>
                <label
                  htmlFor="userPicture"
                  className="mt-1 flex h-[150px] cursor-pointer items-center justify-center  rounded-md bg-[#F3F4F6] px-6 pb-6 pt-5"
                >
                  <input
                    type="file"
                    name="userPicture"
                    id="userPicture"
                    className="hidden w-full"
                    onChange={(e) => {
                      setFieldValue("userPicture", e.target.files);
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
                {values.userPicture &&
                  values.userPicture[0] &&
                  ((values.userPicture[0] as File).type.includes("image") ? (
                    <Image
                      src={URL.createObjectURL(values.userPicture[0])}
                      alt="userPicture"
                      className="mt-4 max-w-full rounded-md"
                      style={{ maxWidth: "100%" }}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <iframe
                      src={URL.createObjectURL(values.userPicture[0])}
                      className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                      title="Bank Recommendation Letter"
                    ></iframe>
                  ))}
                <div className="text-xs text-red-600">
                  <ErrorMessage name="userPicture" />
                </div>
              </div>

              <div className="mb-4 w-1/2">
                  <label
                    htmlFor="idType"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Select Identification Type
                  </label>
                  <Field
                    as="select"
                    id="idType"
                    name="idType"
                    className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                  >
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
                    <option className="hidden"></option>
                  </Field>
                  <ErrorMessage
                    name="idType"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>

                <div className="mt-4">
                <label
                  htmlFor="meansOfIDPhoto"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  {values.idType ? values.idType : "Id Photo"}
                </label>
                <label
                  htmlFor="meansOfIDPhoto"
                  className="mt-1 flex h-[150px] cursor-pointer items-center justify-center  rounded-md bg-[#F3F4F6] px-6 pb-6 pt-5"
                >
                  <input
                    type="file"
                    name="meansOfIDPhoto"
                    id="meansOfIDPhoto"
                    className="hidden w-full"
                    onChange={(e) => {
                      setFieldValue("meansOfIDPhoto", e.target.files);
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
                {values.meansOfIDPhoto &&
                  values.meansOfIDPhoto[0] &&
                  ((values.meansOfIDPhoto[0] as File).type.includes("image") ? (
                    <Image
                      src={URL.createObjectURL(values.meansOfIDPhoto[0])}
                      alt="meansOfIDPhoto"
                      className="mt-4 max-w-full rounded-md"
                      style={{ maxWidth: "100%" }}
                      width={100}
                      height={100}
                    />
                  ) : (
                    <iframe
                      src={URL.createObjectURL(values.meansOfIDPhoto[0])}
                      className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                      title="Bank Recommendation Letter"
                    ></iframe>
                  ))}
                <div className="text-xs text-red-600">
                  <ErrorMessage name="meansOfIDPhoto" />
                </div>
              </div>

            </section>

            <section>
              <p className="pb-3 text-lg font-semibold text-ajo_darkBlue">
                Guarantor&apos;s Details
              </p>

              {/* Guarantor 1 Details */}
              <div id="guarantor1">
                <label
                  htmlFor="guarantor1"
                  className="text-sm font-semibold text-ajo_darkBlue"
                >
                  Guarantor 1
                </label>
                <div className="mt-1">
                  <label
                    htmlFor="guarantor1Name"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    First Name
                  </label>
                  <Field
                    onChange={handleChange}
                    name="guarantor1Name"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="guarantor1Name"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="guarantor1Phone"
                      className="m-0 text-xs font-medium text-ajo_darkBlue"
                    >
                      Phone Number
                    </label>
                    <Field
                      onChange={handleChange}
                      name="guarantor1Phone"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                    <ErrorMessage
                      name="guarantor1Phone"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="guarantor1Email"
                      className="m-0 text-xs font-medium text-ajo_darkBlue"
                    >
                      Email
                    </label>
                    <Field
                      name="guarantor1Email"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                    <ErrorMessage
                      name="guarantor1Email"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="guarantor1Address"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Home Address
                  </label>
                  <Field
                    onChange={handleChange}
                    name="guarantor1Address"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="guarantor1Address"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="guarantorForm"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Upload Filled Guarantor 1 Form
                  </label>
                  <label
                    htmlFor="guarantorForm"
                    className="mt-1 flex h-[150px] cursor-pointer items-center justify-center  rounded-md bg-[#F3F4F6] px-6 pb-6 pt-5"
                  >
                    <input
                      type="file"
                      name="guarantorForm"
                      id="guarantorForm"
                      className="hidden w-full"
                      onChange={(e) => {
                        setFieldValue("guarantorForm", e.target.files);
                      }}
                      accept="application/pdf, .jpg, .png"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src="/upload.svg"
                        alt="guarantor form upload icon"
                        width={48}
                        height={48}
                      />
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.pdf, .jpg, .png</span>{" "}
                        here, or click to select one
                      </p>
                    </div>
                  </label>
                  {values.guarantorForm &&
                    values.guarantorForm[0] &&
                    ((values.guarantorForm[0] as File).type.includes(
                      "image",
                    ) ? (
                      <Image
                        src={URL.createObjectURL(values.guarantorForm[0])}
                        alt="guarantor2ID"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(values.guarantorForm[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Guarantor Form"
                      ></iframe>
                    ))}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="guarantorForm" />
                  </div>
                </div>
             
              </div>

              {/* Guarantor 2 Details */}
              <div id="guarantor2" className="mt-12">
                <label
                  htmlFor="guarantor2"
                  className="text-sm font-semibold text-ajo_darkBlue"
                >
                  Guarantor 2
                </label>
                <div className="mt-1">
                  <label
                    htmlFor="guarantor2Name"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    First Name
                  </label>
                  <Field
                    onChange={handleChange}
                    name="guarantor2Name"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="guarantor2Name"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="my-4 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="guarantor2Phone"
                      className="m-0 text-xs font-medium text-ajo_darkBlue"
                    >
                      Phone Number
                    </label>
                    <Field
                      onChange={handleChange}
                      name="guarantor2Phone"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                    <ErrorMessage
                      name="guarantor2Phone"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="guarantor2Email"
                      className="m-0 text-xs font-medium text-ajo_darkBlue"
                    >
                      Email
                    </label>
                    <Field
                      name="guarantor2Email"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                    <ErrorMessage
                      name="guarantor2Email"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="guarantor2Address"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Home Address
                  </label>
                  <Field
                    onChange={handleChange}
                    name="guarantor2Address"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <ErrorMessage
                    name="guarantor2Address"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                {/* <div className="mb-4 w-1/2">
                  <label
                    htmlFor="idType"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Select Identification Type
                  </label>
                  <Field
                    as="select"
                    id="idType"
                    name="idType"
                    className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                  >
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
                    <option className="hidden"></option>
                  </Field>
                  <ErrorMessage
                    name="idType"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div> */}
                <div className="mt-4">
                  <label
                    htmlFor="guarantorForm2"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Upload Filled Guarantor 2 Form
                  </label>
                  <label
                    htmlFor="guarantorForm2"
                    className="mt-1 flex h-[150px] cursor-pointer items-center justify-center  rounded-md bg-[#F3F4F6] px-6 pb-6 pt-5"
                  >
                    <input
                      type="file"
                      name="guarantorForm2"
                      id="guarantorForm2"
                      className="hidden w-full"
                      onChange={(e) => {
                        setFieldValue("guarantorForm2", e.target.files);
                      }}
                      accept="application/pdf, .jpg, .png"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src="/upload.svg"
                        alt="guarantor form upload icon"
                        width={48}
                        height={48}
                      />
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.pdf, .jpg, .png</span>{" "}
                        here, or click to select one
                      </p>
                    </div>
                  </label>
                  {values.guarantorForm2 &&
                    values.guarantorForm2[0] &&
                    ((values.guarantorForm2[0] as File).type.includes(
                      "image",
                    ) ? (
                      <Image
                        src={URL.createObjectURL(values.guarantorForm2[0])}
                        alt="guarantor2ID"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(values.guarantorForm2[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Guarantor Form"
                      ></iframe>
                    ))}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="guarantorForm2" />
                  </div>
                </div>
              </div>

              <div className="mb-4 w-3/4">
                <label
                  htmlFor="role"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Assign Role
                </label>
                <Field
                  as="select"
                  placeholder="make a selection"
                  id="roles"
                  name="roles"
                  className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                >
                  {allRoles?.map((role: roleResponse) => (
                    <option key={role?._id} value={role?._id}>
                      {role?.name + ":  " + role?.description}
                    </option>
                  ))}
                  <option className="hidden"></option>
                </Field>
                <ErrorMessage
                  name="roles"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
              <div className="mb-4 w-3/4">
                <label
                  htmlFor="assignedCustomers"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Assign Customers
                </label>
                {/* <Field
                  as="select"
                  placeholder="make a selection"
                  id="assignedCustomers"
                  name="assignedCustomers"
                  className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                  onChange={(e: { target: { options: any } }) => {
                    const options = e.target.options;
                    const value = [];
                    for (let i = 0, l = options.length; i < l; i++) {
                      if (options[i].selected) {
                        value.push(options[i].value);
                      }
                    }
                    setFieldValue("assignedCustomers", value);
                  }}
                >
                  {allCustomers?.map((customer) => (
                    <option key={customer?._id} value={customer?._id}>
                      {customer?.firstName + " " + customer?.lastName}
                    </option>
                  ))}
                  <option className="hidden"></option>
                </Field> */}
                <div className="w-full">
                  <Field
                    as="select"
                    title="Select an option"
                    name="assignedCustomers"
                    className="bg-right-20 mt-1 w-full cursor-pointer appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      handleOptionChange(e);
                      const assignedCustomers = values.assignedCustomers;

                      if (!assignedCustomers.includes(e.target.value)) {
                        const updatedAssignedCustomers = [
                          ...assignedCustomers,
                          e.target.value,
                        ];
                        setFieldValue(
                          "assignedCustomers",
                          updatedAssignedCustomers,
                        );
                      }
                    }}
                  >
                    <option value="hidden"></option>
                    {allCustomers?.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}
                      </option>
                    ))}
                  </Field>

                  <div className="space-x-1 space-y-2">
                    {values.assignedCustomers.map((customerId: string, index: number ) => {
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
                                values.assignedCustomers.filter(
                                  (id: any) => id !== customerId,
                                );
                              setFieldValue(
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
                <ErrorMessage
                  name="assignedCustomers"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
              <div className="flex gap-x-3">
                <Field
                  id="selectAllCustomers"
                  name="selectAllCustomers"
                  type="checkbox"
                  className="block h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={
                    values.assignedCustomers.length === allCustomers?.length
                  }
                  onChange={(e: { target: { checked: any } }) => {
                    if (e.target.checked) {
                      setFieldValue(
                        "assignedCustomers",
                        allCustomers?.map((customer) => customer._id),
                      );
                      console.log("checked: ", values.assignedCustomers);
                    } else {
                      setFieldValue("assignedCustomers", []);
                    }
                  }}
                />

                <label
                  htmlFor="selectAllCustomers"
                  className="m-0 text-sm capitalize text-ajo_darkBlue"
                >
                  Select all Customers
                </label>
              </div>
            </section>
          </div>
          <button
            type="submit"
            className="w-1/2 rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
            onClick={() => {
              console.log(errors);
              submitForm();
            }}
            disabled={isSubmitting || isCreatingRole}
          >
            {isSubmitting || isCreatingRole || isEditingRole ? (
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
        </form>
      )}
    </Formik>
  );
};

const ViewUser = ({ userId }: { userId: string }) => {
  const { client } = useAuth();
  const { data: userInfo, isLoading: isLoadingUserInfo } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      return client
        .get(`/api/user/${userId}`)
        .then((response: AxiosResponse<staffResponse, any>) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error.response ?? error.message);
          throw error;
        });
    },
  });


  const Detail = ({
    title,
    value,
  }: {
    title: string | undefined;
    value: string | undefined;
  }) => (
    <p className="flex-1 whitespace-nowrap text-base font-semibold">
      {title ?? "-----"}:{" "}
      <span className="ms-2 font-normal text-gray-500">{value ?? "-----"}</span>
    </p>
  );
  if (isLoadingUserInfo) {
    return (
      <div className="flex min-h-[100vh] justify-center bg-ajo_darkBlue">
        <Image
          src="/loadingSpinner.svg"
          alt="loading spinner"
          width={80}
          height={80}
        />
      </div>
    );
  }
  return (
    <div className="mb-10 w-full space-y-10 rounded-md bg-white px-[5%] py-[3%]">
      <p className="m-0 text-base font-bold text-ajo_darkBlue">USER DETAILS</p>
      <div className="m-0 rounded-md border border-gray-300 px-6 py-4">
        <div className="flex gap-4">

          <Link target="_blank" href={userInfo?.photo ? String(userInfo?.photo): ''}>
            <Image
              // src={userInfo?.image ?? "/user"}
              src={userInfo ? userInfo?.photo: ''}
              alt={`${userInfo?.firstName}'s image`}
              className="h-full rounded-md"
              width={120}
              height={120}
            />
          </Link>
          

          
        
          
          <div className="w-full space-y-4">
            <Detail title="First name" value={userInfo?.firstName} />
            <Detail title="Last name" value={userInfo?.lastName} />
            <Detail title="Email address" value={userInfo?.email} />
            <Detail title="Phone number" value={userInfo?.phoneNumber} />
            <Detail title="Home Address" value={userInfo?.homeAddress} />
            <Detail title="Assigned Role" value={userInfo?.roles[0].name} />
            <div className="flex">
              <p className="font-semibold ">
                Assigned User: 
              </p>
              
              {userInfo?.assignedUser.map((user, index) => (
                <React.Fragment key={user._id}>
                {user.firstName} {user.lastName}
                {index < userInfo.assignedUser.length - 1 && ', '}
              </React.Fragment>
                
              ))}
            </div>
            <div className="flex ">
              <p className="font-semibold ">
                {userInfo?.meansOfID}:
              </p>
              
              <div className="ml-4">
                <Link target="_blank" href={userInfo?.meansOfIDPhoto ? String(userInfo?.photo): ""}>
                
                <Image
                
                src={userInfo ? userInfo?.photo: ''}
                alt={`${userInfo?.firstName}'s image`}
                className="h-full rounded-md"
                width={120}
                height={120}
              />
              
                </Link>
                
              </div>
                
            </div>
          </div>
        </div>
      </div>
      <div className="m-0 rounded-md border border-gray-300 px-6 py-4">
        <p className="font-bold uppercase">Guarantor&lsquo;s Details</p>
        <div key={userInfo?.guarantor1.phoneNumber} className="mt-8 space-y-2">
          <p className="font-semibold text-ajo_darkBlue">Guarantor 1:</p>
          <Detail title="Full Name" value={userInfo?.guarantor1.fullName} />
          <Detail
            title="Phone number"
            value={userInfo?.guarantor1.phoneNumber}
          />
          <Detail title="Email address" value={userInfo?.guarantor1.email} />
          <Detail
            title="Home address"
            value={userInfo?.guarantor1.homeAddress}
          />

          <Link target="_blank" href={userInfo?.guarantorForm ? userInfo?.guarantorForm: ''}>
            <button className="flex rounded-md border border-gray-300 p-2">
              <Image
                src="/pdfLogo.svg"
                alt="pdf"
                width={16}
                height={16}
                className="rounded-sm"
              />
              {userInfo?.guarantor1.fullName}
            </button>
          </Link>
          
        </div>
        <div key={userInfo?.guarantor2.phoneNumber} className="mt-8 space-y-2">
          <p className="font-semibold text-ajo_darkBlue">Guarantor 2:</p>
          <Detail title="Full Name" value={userInfo?.guarantor2.fullName} />
          <Detail
            title="Phone number"
            value={userInfo?.guarantor2.phoneNumber}
          />
          <Detail title="Email address" value={userInfo?.guarantor2.email} />
          <Detail
            title="Home address"
            value={userInfo?.guarantor2.homeAddress}
          />

          <Link target="_blank" href={userInfo?.guarantorForm2 ? userInfo?.guarantorForm2 : ''}>
            <button className="flex rounded-md border border-gray-300 p-2">
              <Image
                src="/pdfLogo.svg"
                alt="pdf"
                width={16}
                height={16}
                className="rounded-sm"
              />
              {userInfo?.guarantor2.fullName}
            </button>
          </Link>
          {/* <button className="flex rounded-md border border-gray-300 p-2">
            <Image
              src="/pdfLogo.svg"
              alt="pdf"
              width={16}
              height={16}
              className="rounded-sm"
            />
            {userInfo?.guarantor2.fullName}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <Users />;
}

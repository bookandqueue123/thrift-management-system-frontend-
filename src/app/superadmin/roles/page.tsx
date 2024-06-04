"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUserId } from "@/slices/OrganizationIdSlice";
import { Role, User, createSuperRoleProps, customer, permissionObject } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const Roles = () => {
  const PAGE_SIZE = 10;
  const organisationId = useSelector(selectOrganizationId);

  const [isRoleMutated, setIsRoleMutated] = useState(false);
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { client } = useAuth();
  // const router = useRouter();
  // const pathname = usePathname();

  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [modalToShow, setModalToShow] = useState<
    "edit-role" | "create-role" | "view-role" | ""
  >("");
  const [roleToBeEdited, setRoleToBeEdited] = useState("");

  const [isRoleCreated, setIsRoleCreated] = useState(false);
  const [isRoleEdited, setIsRoleEdited] = useState(false);
  const [mutationResponse, setMutationResponse] = useState("");

  const {
    data: allRoles,
    isLoading: isLoadingAllRoles,
    refetch,
  } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      return client
        .get(
          `/api/superuser-role`,
          {},
        )
        .then((response: AxiosResponse<customer[], any>) => {
          // setFilteredRoles(response.data);
        
          setFilteredRoles(response.data)
          // setFilteredRoles(
        //     [
        //     {
        //       id: "234555",
        //       roleTitle: "Organisation Manager 1",
        //       affiliatedOrganisation: "Raoatech Technologies",
        //       organisationManagerDetails: {
        //         name: "Olanrewaju Sokumnbi",
        //         email: "sokunmbi@gmail.com",
        //         phone: "+234 9085798782",
        //       },
        //     },
        //     {
        //       id: "234555",
        //       roleTitle: "Organisation Manager 2",
        //       affiliatedOrganisation: "Cooperative Union",
        //       organisationManagerDetails: {
        //         name: "Olanrewaju Sokumnbi",
        //         email: "sokunmbi@gmail.com",
        //         phone: "+234 9085798782",
        //       },
        //     },
        //     {
        //       id: "234555",
        //       roleTitle: "Organisation Manager 3",
        //       affiliatedOrganisation: "AlajoShomolu Cooperative Society",
        //       organisationManagerDetails: {
        //         name: "Olanrewaju Sokumnbi",
        //         email: "sokunmbi@gmail.com",
        //         phone: "+234 9085798782",
        //       },
        //     },
        //     {
        //       id: "234555",
        //       roleTitle: "Organisation Manager 4",
        //       affiliatedOrganisation: "Teachers Union Savings Group",
        //       organisationManagerDetails: {
        //         name: "Olanrewaju Sokumnbi",
        //         email: "sokunmbi@gmail.com",
        //         phone: "+234 9085798782",
        //       },
        //     },
        //     {
        //       id: "234555",
        //       roleTitle: "Customer",
        //       affiliatedOrganisation: null,
        //       organisationManagerDetails: null,
        //     },
        //     {
        //       id: "234555",
        //       roleTitle: "Organisation",
        //       affiliatedOrganisation: "Teachers Union Savings Group",
        //       organisationManagerDetails: null,
        //     },
        //     {
        //       id: "234555",
        //       roleTitle: "Super Admin",
        //       affiliatedOrganisation: null,
        //       organisationManagerDetails: {
        //         name: "Olanrewaju Sokumnbi",
        //         email: "sokunmbi@gmail.com",
        //         phone: "+234 9085798782",
        //       },
        //     },
        //   ]
        // );
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
         
          throw error;
        });
    },
    staleTime: 5000,
  });


  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // setSearchResult(e.target.value);


    if (allRoles) {
      const filtered = allRoles.filter((item) =>
        String(item.accountNumber).includes(String(e.target.value)),
      );
      // Update the filtered data state
      setFilteredRoles(filtered);
    }
  };
  const handleDateFilter = () => {
    // Filter the data based on the date range
    if (allRoles) {
      const filtered = allRoles.filter((item) => {
        const itemDate = new Date(item.createdAt); // Convert item date to Date object
        const startDateObj = new Date(fromDate);
        const endDateObj = new Date(toDate);

        return itemDate >= startDateObj && itemDate <= endDateObj;
      });

      // Update the filtered data state
      setFilteredRoles(filtered);
    }
  };

  const paginatedRoles = filteredRoles?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allRoles) {
    totalPages = Math.ceil(allRoles.length / PAGE_SIZE);
  }

  useEffect(() => {
    // Calling refetch to rerun the allRoles query
    refetch();
  }, [isRoleCreated, isRoleEdited, modalContent, refetch]);

  
  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Roles
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
          <CustomButton
            type="button"
            label="Create a Role"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
              setModalState(true);
              setModalToShow("create-role");
              setIsRoleCreated(false)
              setModalContent('form')
            }}
          />
        </div>

        <p className="mb-2 text-base font-medium text-white">
          Existing Roles List
        </p>

        <div>
          <TransactionsTable
            headers={[
              "Role Title/Name",
              "Affiliated Organisation",
              "Organisation Manager Details",
              "Action",
            ]}
            content={
              filteredRoles.length === 0 ? (
                <tr className="h-[3rem]">
                  <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                    No Roles yet
                  </p>
                </tr>
              ) : (
                paginatedRoles?.map((role, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.name || "----"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.organisation || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.manager || "----"}
                    </td>

                    <td className="flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                      <Image
                        src="/pencil.svg"
                        alt="pencil"
                        width={20}
                        height={20}
                        onClick={() => {
                          setModalToShow("edit-role");
                          setModalState(true);
                          setRoleToBeEdited(role._id);
                        }}
                        className="cursor-pointer"
                      />
                      <Image
                        src="/trash.svg"
                        alt="pencil"
                        width={20}
                        height={20}
                        // onClick={() => deleteGroup(role._id)}
                        className="cursor-pointer"
                      />
                      <Image
                        src="/archive.svg"
                        alt="pencil"
                        width={20}
                        height={20}
                        onClick={() => {}}
                        className="cursor-pointer"
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
                modalToShow === "edit-role"
                  ? "Edit Role"
                  : modalToShow === "create-role"
                    ? "Create a Role"
                    : ""
              }
            >
              {modalContent === "form" ? (
                <div className="px-[10%]">
                  {modalToShow === "view-role" ? (
                    ""
                  ): (
                    <MutateRole
                    setCloseModal={setModalState}
                    setRoleMutated={setIsRoleMutated}
                    actionToTake={modalToShow}
                    roleToBeEdited={roleToBeEdited}

                      setRoleCreated={setIsRoleCreated}
                      setRoleEdited={setIsRoleEdited}
                      setModalContent={setModalContent}
                      setMutationResponse={setMutationResponse}
                    
                     
                  />
                  )}
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`Role ${modalToShow === "create-role" ? "Creation" : "Editing"} Successful`}
                  errorTitle={`Role ${modalToShow === "create-role" ? "Creation" : "Editing"} Failed`}
                  status={isRoleCreated || isRoleEdited ? "success" : "failed"}
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

const MutateRole = ({
  setRoleMutated,
  setCloseModal,
  actionToTake,
  roleToBeEdited,
  setRoleCreated,
  setRoleEdited,
  setModalContent,
  setMutationResponse,
  
}: {
  setMutationResponse: Dispatch<SetStateAction<string>>;
  setRoleEdited: Dispatch<SetStateAction<boolean>>;
  setRoleCreated: Dispatch<SetStateAction<boolean>>;
  roleToBeEdited: string;
  actionToTake: "create-role" | "edit-role" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setRoleMutated: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction< "confirmation" | "form">>;
}) => {
  const { client } = useAuth();
  const [allSuperUsers, setAllSuperUsers] = useState([])
  const [assignType, setAssignType] = useState<"single" | "all">("single");
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
 
  const [selectedOptions, setSelectedOptions] = useState<
    (Role | undefined)[]
  >([]);

  const [assignedUsersIds, setAssignedUsersIds] = useState<string[]>([])



  const { data: role, isLoading: isLoadingRole } = useQuery(
    {
      queryKey: ["role"],
      queryFn: async () => {
        return client
          .get(`api/superuser-role/${roleToBeEdited}`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  );
  console.log(role)

  useEffect(() => {
    if(actionToTake === "edit-role"){
      if (role?.permissions) {
      const permissionsIds = role?.permissions?.map((permissions: { _id: any }) => permissions._id);
      setAssignedPermissions(permissionsIds || []);
    }
    }
    else{
      setAssignedPermissions([])
    }
    
  }, [role, actionToTake]);
  
  const initialValues: createSuperRoleProps = actionToTake === 'edit-role' ? {
    roleName: role?.name ?? "",
    description: role?.description ?? "",
    superuser: role?.superuser ?? ""
  } :
  {
    roleName: "",
    description: "",
    superuser: []
  };

  useEffect(() => {
    if(actionToTake === 'edit-role'){
      if (role?.superuser) {
      const superUsersIds = role?.superuser?.map((superuser: { _id: any }) => superuser._id);
      setAssignedUsersIds(superUsersIds || []);
    }
    }
    else{
      setAssignedUsersIds([])
    }
    
  }, [role, actionToTake]);
  const { data: allPermissions, isLoading: isLoadingAllPermissions } = useQuery(
    {
      queryKey: ["allPermissions"],
      queryFn: async () => {
        return client
          .get("api/superuser-permission")
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  );

  const {
    data: getSuperUsers,
    isLoading: isLoadingAllSUperallSuperUsers,
    refetch,
  } = useQuery({
    queryKey: ["allSuperUsers"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=superuser`, {})
        .then((response) => {
    
          setAllSuperUsers(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {

          throw error;
        });
    },
    staleTime: 5000,
  });


  const { mutate: createRole, isPending: isCreatingRole } = useMutation({
    mutationKey: ["create role"],
    mutationFn: async (values: createSuperRoleProps) => {
    
      return client.post(`/api/superuser-role`, {
        name: values.roleName,
      description: values.description,
      permissions: assignedPermissions,
      superuser: values.superuser
      })

    },
   

    onSuccess(response) {
      setRoleEdited(true);
      setModalContent("confirmation");
      setTimeout(() => {
       setCloseModal(false);
        setModalContent('form')
      }, 1000);
    
    },

    onError(error: AxiosError<any, any>) {
      setRoleEdited(false);
      setModalContent("confirmation");
      setTimeout(() => {
       setCloseModal(false);
        setModalContent('form')
      }, 1000);
    
    },
  });



  const { mutate: editRole, isPending: isEditingRole } = useMutation({
    mutationKey: ["edit role"],
    mutationFn: async (values: createSuperRoleProps) => {
      
      
      return client.put(`/api/superuser-role/${roleToBeEdited}`, {
        name: values.roleName,
      description: values.description,
      permissions: assignedPermissions,
      superuser: assignedUsersIds
      })
    },

    onSuccess(response) {
      setRoleEdited(true);
      setModalContent("confirmation");
      setTimeout(() => {
       setCloseModal(false);
        setModalContent('form')
      }, 1000);
    },

    onError(error: AxiosError<any, any>) {
      setRoleEdited(false);
      setModalContent("confirmation");
      setTimeout(() => {
       setCloseModal(false);
        setModalContent('form')
      }, 1000);
      
    },
  });

  // type viewPermissionKeys = keyof createSuperRoleProps["viewPermissions"];
  // const viewPermissionArr = [
  //   "viewOrgDetails",
  //   "viewOrgCustomerDetails",
  //   "viewOrg",
  //   "generalPostingReport",
  //   "withdrawalReport",
  // ];

  // type editPermissionKeys = keyof createSuperRoleProps["editPermissions"];
  // const editPermissionArr = ["editOrgCustomerDetails", "editOrgDetails"];

  // type actionPermissionKeys = keyof createSuperRoleProps["actionPermissions"];
  // const actionPermissionArr = ["enableOrg", "disableOrg"];

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedOption = getSuperUsers?.find(
      (option: { _id: string; }) => option._id === selectedId,
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
        roleName: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
    
        setTimeout(() => {
          if (actionToTake === "create-role") {
            console.log("creating role.....................");
             createRole(values);
          } else {
            console.log("editing role.....................");
         
            editRole(values);
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
        <form
          className="flex flex-col items-center space-y-10"
          onSubmit={handleSubmit}
        >
          <div className="mb-10 w-full space-y-5 rounded-md bg-white px-[5%] py-[3%]">
            <div className="space-y-3">
              <div className="">
                <label
                  htmlFor="roleName"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Role Name / Title
                </label>
                <Field
                  onChange={handleChange}
                  name="roleName"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
                <ErrorMessage
                  name="roleName"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
              <div className="">
                <label
                  htmlFor="description"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Description
                </label>
                <Field
                  name="description"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                  component="textarea"
                  rows={4}
                  cols={50}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
               <div className="my-3 flex flex-col gap-4 md:flex-row">
                <div className="mb-4 flex-1">
                  <label
                    htmlFor="superuser"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Assign to Super User
                  </label>
                  <Field
                    as="select"
                    id="superuser"
                    name="superuser"
                    className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                  >
                    {getSuperUsers?.map(
                      (superuser: User) => (
                        <option key={superuser._id} value={superuser._id}>
                          {superuser.name}
                        </option>
                      ),
                    )} 
                    <option className="invisible"></option>
                  </Field>
                  <ErrorMessage
                    name="superuser"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="flex w-1/2 flex-row items-center gap-x-1">
                  <Field
                    id="allAssign"
                    name="allAssign"
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={(e: any) => {
                      handleChange(e);
                      if(getSuperUsers){
                        setFieldValue(
                          "superuser",
                          getSuperUsers.map((superuser: { _id: any; }) => superuser._id)
                        )
                      }
                      setAssignType("all");
                    }}
                    checked={assignType === "all" ? true : false}
                  />
                  <label
                    htmlFor="allAssign"
                    className="text-sm font-semibold capitalize text-[#131313]"
                  >
                    All Super Users
                  </label>
                </div>
              </div> 
            </div>


            {actionToTake === 'edit-role' ? (
                  <div className="w-full">
                  <Field
                    as="select"
                    title="Select an option"
                    name="assignedUsers"
                    className="bg-right-20 mt-1 w-full cursor-pointer appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      handleOptionChange(e);
                    let assignedUsers = assignedUsersIds
                      // if(actionToTake === 'edit-user'){
                      //   console.log(values.assignedUsers)
                      //   assignedUsers = values.assignedUsers.map((customer: { _id: any; }) => customer._id);
                      // }
                      

                      if (!assignedUsers.includes(e.target.value)) {
                        const updatedassignedUsers = [
                          ...assignedUsers,
                          e.target.value,
                        ];
                        setAssignedUsersIds(updatedassignedUsers)
                        
                      }
                    }}
                  >
                    <option value="hidden"></option>
                    {/* { actionToTake === 'create-user' ? */}
                    {getSuperUsers?.map((option: User) => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    )) }
                     

                
                  </Field>

                  <div className="space-x-1 space-y-2">
                    {assignedUsersIds.map((userId: string, index: number ) => {
                    
                   
                      const option = getSuperUsers?.find(
                        (user: { _id: string; }) => user._id === userId,
                      );
                      return (
                        <div key={index} className="mb-2 mr-2 inline-block">
                          <button
                            type="button"
                            onClick={() => {
                              
                              handleRemoveOption(index);
                              const updatedCustomers =
                                assignedUsersIds.filter(
                                  (id: any) => id !== userId,
                                );
                              setAssignedUsersIds(updatedCustomers)
                            }}
                            className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm"
                          >
                            {option?.name}
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

              {actionToTake === 'edit-role' ? (
                  <div className="flex gap-x-3">
                  <Field
                    id="selectAllUsers"
                    name="selectAllUsers"
                    type="checkbox"
                    className="block h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={
                      assignedUsersIds.length === getSuperUsers?.length
                    }
                    onChange={(e: { target: { checked: any } }) => {
                      if (e.target.checked) {
                        // setFieldValue(
                        //   "assignedCustomers",
                        //   allCustomers?.map((customer) => customer._id),
                        // );
                        if (getSuperUsers) {
                          setAssignedUsersIds(getSuperUsers.map((superuser: { _id: any; }) => superuser._id));
                        }
                        
                       
                      } else {
                        // setFieldValue("assignedCustomers", []);
                        setAssignedUsersIds([])
                      }
                    }}
                  />
  
                  <label
                    htmlFor="selectAllUsers"
                    className="m-0 text-sm capitalize text-ajo_darkBlue"
                  >
                    Select all super users
                  </label>
                </div>
                ): ""}

            <p className="mb-2 py-4 text-lg font-medium text-ajo_darkBlue underline">
              Permissions
            </p>

            {/* <span className="mb-1 block  text-sm text-ajo_darkBlue">
              View Permissions
            </span>
            {viewPermissionArr.map((permission) => {
              const permissionKey = permission as viewPermissionKeys;
              return (
                <div className="flex gap-x-3" key={permission}>
                  <Field
                    id={permission}
                    name={`viewPermissions.${permission}`}
                    type="checkbox"
                    className="block h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={handleChange}
                    checked={values.viewPermissions[permissionKey]}
                  />
                  <label
                    htmlFor={permission}
                    className="m-0 text-sm capitalize text-ajo_darkBlue"
                  >
                    {permission === "viewOrgDetails"
                      ? "View Organisation Details"
                      : permission === "viewOrgCustomerDetails"
                        ? "view Organisation Customer Details"
                        : permission === "viewOrg"
                          ? "View Organisation"
                          : permission === "generalPostingReport"
                            ? "General Posting Report"
                            : permission === "withdrawalReport"
                              ? "Withdrawal Report"
                              : permission}
                  </label>
                </div>
              );
            })}
            <span className="mb-1 mt-6 block text-sm text-ajo_darkBlue">
              Edit Permissions
            </span>
            {editPermissionArr.map((permission) => {
              const permissionKey = permission as editPermissionKeys;
              return (
                <div className="flex gap-x-3" key={permission}>
                  <Field
                    id={permission}
                    name={`editPermissions.${permission}`}
                    type="checkbox"
                    className="block h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={handleChange}
                    checked={values.editPermissions[permissionKey]}
                  />
                  <label
                    htmlFor={permission}
                    className="m-0 text-sm capitalize text-ajo_darkBlue"
                  >
                    {permission === "editOrgCustomerDetails"
                      ? "Edit Organisation Customer Details"
                      : permission === "editOrgDetails"
                        ? "Edit Organisation Details"
                        : permission}
                  </label>
                </div>
              );
            })}
            <span className="mb-1 mt-6 block text-sm text-ajo_darkBlue">
              Action Permissions
            </span>
            {actionPermissionArr.map((permission) => {
              const permissionKey = permission as actionPermissionKeys;
              return (
                <div className="flex gap-x-3" key={permission}>
                  <Field
                    id={permission}
                    name={`actionPermissions.${permission}`}
                    type="checkbox"
                    className="block h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={handleChange}
                    checked={values.actionPermissions[permissionKey]}
                  />
                  <label
                    htmlFor={permission}
                    className="m-0 text-sm capitalize text-ajo_darkBlue"
                  >
                    {permission === "enableOrg"
                      ? "Enable Organisation"
                      : permission === "disableOrg"
                        ? "Disable Organisation"
                        : permission}
                  </label>
                </div>
              );
            })} */}

<div className="space-y-3">
              {isLoadingAllPermissions ? (
                <Image
                  src="/loadingSpinner.svg"
                  alt="loading spinner"
                  className="relative left-1/2"
                  width={40}
                  height={40}
                />
              ) : (
                allPermissions?.map((permission: permissionObject) => {
                 
                  return (
                    <div className="flex gap-x-3" key={permission._id}>
                      <Field
                        id={permission._id}
                        name={`${permission.title}`}
                        type="checkbox"
                        className="block h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        onChange={(e: any) => {
                          handleChange(e);
                          setAssignedPermissions((prev) => {
                            const isIdPresent = prev.includes(permission._id);
                            if (isIdPresent) {
                              return prev.filter((id) => id !== permission._id);
                            } else {
                              return [...prev, permission._id];
                            }
                          });
                        }}
                        checked={assignedPermissions.includes(permission._id)}
                      />
                      <label
                        htmlFor={permission._id}
                        className="m-0 text-sm capitalize text-ajo_darkBlue"
                      >
                        {permission.title === "create-staff"
                          ? "Create User"
                          : permission.title === "view-assigned-users"
                            ? "View Assigned Customers"
                            : permission.title.replaceAll("-", " ")}
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-1/2 rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
            onClick={() => submitForm()}
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

export default function Page() {
  return <Roles />;
}

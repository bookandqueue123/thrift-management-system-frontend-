"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { createSuperRoleProps, customer } from "@/types";
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
    "edit-role" | "create-role" | ""
  >("");
  const [roleToBeEdited, setRoleToBeEdited] = useState("");

  const {
    data: allRoles,
    isLoading: isLoadingAllRoles,
    refetch,
  } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&organisation=${organisationId}&userType=individual`,
          {},
        )
        .then((response: AxiosResponse<customer[], any>) => {
          // setFilteredRoles(response.data);
          setFilteredRoles([
            {
              id: "234555",
              roleTitle: "Organisation Manager 1",
              affiliatedOrganisation: "Raoatech Technologies",
              organisationManagerDetails: {
                name: "Olanrewaju Sokumnbi",
                email: "sokunmbi@gmail.com",
                phone: "+234 9085798782",
              },
            },
            {
              id: "234555",
              roleTitle: "Organisation Manager 2",
              affiliatedOrganisation: "Cooperative Union",
              organisationManagerDetails: {
                name: "Olanrewaju Sokumnbi",
                email: "sokunmbi@gmail.com",
                phone: "+234 9085798782",
              },
            },
            {
              id: "234555",
              roleTitle: "Organisation Manager 3",
              affiliatedOrganisation: "AlajoShomolu Cooperative Society",
              organisationManagerDetails: {
                name: "Olanrewaju Sokumnbi",
                email: "sokunmbi@gmail.com",
                phone: "+234 9085798782",
              },
            },
            {
              id: "234555",
              roleTitle: "Organisation Manager 4",
              affiliatedOrganisation: "Teachers Union Savings Group",
              organisationManagerDetails: {
                name: "Olanrewaju Sokumnbi",
                email: "sokunmbi@gmail.com",
                phone: "+234 9085798782",
              },
            },
            {
              id: "234555",
              roleTitle: "Customer",
              affiliatedOrganisation: null,
              organisationManagerDetails: null,
            },
            {
              id: "234555",
              roleTitle: "Organisation",
              affiliatedOrganisation: "Teachers Union Savings Group",
              organisationManagerDetails: null,
            },
            {
              id: "234555",
              roleTitle: "Super Admin",
              affiliatedOrganisation: null,
              organisationManagerDetails: {
                name: "Olanrewaju Sokumnbi",
                email: "sokunmbi@gmail.com",
                phone: "+234 9085798782",
              },
            },
          ]);
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
  }, [isRoleMutated, refetch]);

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
                      {role.roleTitle || "----"}
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
              {!isRoleMutated ? (
                <div className="px-[10%]">
                  <MutateRole
                    setCloseModal={setModalState}
                    setRoleMutated={setIsRoleMutated}
                    actionToTake={modalToShow}
                  />
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`Role ${modalToShow === "create-role" ? "Creation" : "Editing"} Successful`}
                  errorTitle={`Role ${modalToShow === "create-role" ? "Creation" : "Editing"} Failed`}
                  status={isRoleMutated ? "success" : "failed"}
                  responseMessage=""
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
}: {
  actionToTake: "create-role" | "edit-role" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setRoleMutated: Dispatch<SetStateAction<boolean>>;
}) => {
  const [assignType, setAssignType] = useState<"single" | "all">("single");
  const initialValues: createSuperRoleProps = {
    roleName: "",
    description: "",
    viewPermissions: {
      viewOrgDetails: false,
      viewOrgCustomerDetails: false,
      viewOrg: false,
      generalPostingReport: false,
      withdrawalReport: false,
    },
    editPermissions: {
      editOrgCustomerDetails: false,
      editOrgDetails: false,
    },
    actionPermissions: {
      enableOrg: false,
      disableOrg: false,
    },
  };

  const { mutate: createRole, isPending: isCreatingRole } = useMutation({
    mutationKey: ["create role"],
    mutationFn: async (values: createSuperRoleProps) => {
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
     
      return;
      //  client.put(`/api/user/${userId}`, formData);
    },

    onSuccess(response) {
      setRoleMutated(true);
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setRoleMutated(false);
    
    },
  });

  const { mutate: editRole, isPending: isEditingRole } = useMutation({
    mutationKey: ["edit role"],
    mutationFn: async (values: createSuperRoleProps) => {
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
      
      return;
      //  client.put(`/api/user/${userId}`, formData);
    },

    onSuccess(response) {
      setRoleMutated(true);
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setRoleMutated(false);
      
    },
  });

  type viewPermissionKeys = keyof createSuperRoleProps["viewPermissions"];
  const viewPermissionArr = [
    "viewOrgDetails",
    "viewOrgCustomerDetails",
    "viewOrg",
    "generalPostingReport",
    "withdrawalReport",
  ];

  type editPermissionKeys = keyof createSuperRoleProps["editPermissions"];
  const editPermissionArr = ["editOrgCustomerDetails", "editOrgDetails"];

  type actionPermissionKeys = keyof createSuperRoleProps["actionPermissions"];
  const actionPermissionArr = ["enableOrg", "disableOrg"];

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
                    htmlFor="singleAssign"
                    className="m-0 text-xs font-medium text-ajo_darkBlue"
                  >
                    Assign to Super User
                  </label>
                  <Field
                    as="select"
                    id="singleAssign"
                    name="singleAssign"
                    className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                  >
                    {/* {organisationGroups?.map(
                      (group: OrganisationGroupsProps) => (
                        <option key={group._id} value={group._id}>
                          {group.groupName}
                        </option>
                      ),
                    )} */}
                    <option className="invisible"></option>
                  </Field>
                  <ErrorMessage
                    name="singleAssign"
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

            <p className="mb-2 py-4 text-lg font-medium text-ajo_darkBlue underline">
              Permissions
            </p>

            <span className="mb-1 block  text-sm text-ajo_darkBlue">
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
            })}
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

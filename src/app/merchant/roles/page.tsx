"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { createRoleProps, permissionObject, roleResponse } from "@/types";
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
  const { userPermissions, permissionsMap } = usePermissions();

  const [isRoleCreated, setIsRoleCreated] = useState(false);
  const [isRoleEdited, setIsRoleEdited] = useState(false);
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { client } = useAuth();
  const user = useSelector(selectUser);

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-role" | "create-role" | ""
  >("");
  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );
  const [roleToBeEdited, setRoleToBeEdited] = useState("");

  const {
    data: allRoles,
    isLoading: isLoadingAllRoles,
    refetch,
  } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      return client
        .get(`/api/role?organisation=${organisationId}`, {})
        .then((response: AxiosResponse<roleResponse[], any>) => {
          console.log(response.data);
          setFilteredRoles(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error);
          throw error;
        });
    },
    staleTime: 5000,
  });

  const { data: allPermissions } = useQuery({
    queryKey: ["allPermissions"],
    queryFn: async () => {
      return client
        .get("api/permission")
        .then((response: AxiosResponse<permissionObject[], any>) => {
          return response.data;
        })
        .catch((error: AxiosResponse<any, any>) => {
          throw error;
        });
    },
  });
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    if (allRoles) {
      const filtered = allRoles.filter((item) =>
        String(item).includes(String(e.target.value)),
      );
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
  }, [isRoleCreated, isRoleEdited, refetch]);

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
          {(user?.role === "organisation" ||
            (user?.role === "staff" &&
              userPermissions.includes(permissionsMap["create-role"]))) && (
            <CustomButton
              type="button"
              label="Create a Role"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-role");
                setModalContent("form");
                setIsRoleCreated(false);
              }}
            />
          )}
        </div>

        <p className="mb-2 text-base font-medium text-white">
          Existing Roles List
        </p>

        <div>
          <TransactionsTable
            headers={[
              "Role Title/Name",
              "Description",
              "Permissions",
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
                paginatedRoles?.map((role: roleResponse, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.name || "----"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.description || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm capitalize">
                      
                      {allPermissions
                        ?.filter((permission) =>
                          role.permissions.some(
                            (eachPermission) =>
                              eachPermission._id === permission._id,
                          ),
                        )
                        .map((filteredPermission) => (
                          <ul key={filteredPermission._id}>
                            <li className="my-1 list-disc marker:text-ajo_offWhite">
                              {filteredPermission.title.replaceAll("-", " ")}
                            </li>
                          </ul>
                        )) || "----"}
                    </td>

                    <td className="flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                      {(user?.role === "organisation" ||
                        (user?.role === "staff" &&
                          userPermissions.includes(
                            permissionsMap["edit-role"],
                          ))) && (
                        <Image
                          src="/pencil.svg"
                          alt="pencil"
                          width={20}
                          height={20}
                          onClick={() => {
                            setModalToShow("edit-role");
                            setModalState(true);
                            setRoleToBeEdited(role._id);
                            setModalContent("form");
                            setIsRoleEdited(false);
                          }}
                          className="cursor-pointer"
                        />
                      )}
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
                  <MutateRole
                    setCloseModal={setModalState}
                    setRoleCreated={setIsRoleCreated}
                    setRoleEdited={setIsRoleEdited}
                    setModalContent={setModalContent}
                    actionToTake={modalToShow}
                  />
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`Role ${modalToShow === "create-role" ? "Creation" : "Editing"} Successful`}
                  errorTitle={`Role ${modalToShow === "create-role" ? "Creation" : "Editing"} Failed`}
                  status={isRoleCreated || isRoleEdited ? "success" : "failed"}
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
  setRoleEdited,
  setRoleCreated,
  setCloseModal,
  actionToTake,
  setModalContent,
}: {
  actionToTake: "create-role" | "edit-role" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setRoleCreated: Dispatch<SetStateAction<boolean>>;
  setRoleEdited: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
}) => {
  const { client } = useAuth();
  const organisationId = useSelector(selectOrganizationId);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
  const initialValues: createRoleProps = {
    roleName: "",
    description: "",
    permissions: {
      "edit-user": false,
      "view-assigned-users": false,
      "export-withdrawal": false,
      "view-withdrawals": false,
      "view-savings": false,
      "export-saving": false,
      "post-saving": false,
      "set-saving": false,
      "view-user": false,
    },
  };
  const { data: allPermissions, isLoading: isLoadingAllPermissions } = useQuery(
    {
      queryKey: ["allPermissions"],
      queryFn: async () => {
        return client
          .get("api/permission")
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  );

  const { mutate: createRole, isPending: isCreatingRole } = useMutation({
    mutationKey: ["create role"],
    mutationFn: async (values: createRoleProps) => {
      return client.post(`/api/role`, {
        name: values.roleName,
        description: values.description,
        organisation: organisationId,
        permissions: assignedPermissions,
      });
    },

    onSuccess(response) {
      
      setRoleCreated(true);
      setModalContent("status");
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setRoleCreated(false);
      setModalContent("status");

      console.log(error.response?.data);
    },
  });

  const { mutate: editRole, isPending: isEditingRole } = useMutation({
    mutationKey: ["edit role"],
    mutationFn: async (values: createRoleProps) => {
      return client.put(`/api/role`, {
        name: values.roleName,
        description: values.description,
        organisation: organisationId,
        permissions: assignedPermissions,
      });
    },

    onSuccess(response) {
      setRoleEdited(true);
      setModalContent("status");

      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setRoleEdited(false);
      setModalContent("status");

      console.log(error.response?.data.message);
    },
  });

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
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="mb-10 w-full rounded-md bg-white px-[5%] py-[3%]">
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
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
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
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
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
            </div>

            <p className="mb-2 pb-2 pt-4 text-xl font-semibold text-ajo_darkBlue">
              Assign Permissions
            </p>
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

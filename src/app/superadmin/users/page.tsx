"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { Organisation, OrganisationGroupsProps, customer } from "@/types";
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
import { CiExport } from "react-icons/ci";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const Users = () => {
  const PAGE_SIZE = 5;
  const organisationId = useSelector(selectOrganizationId);

  const [isUserMutated, setIsUserMutated] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isUserEdited, setIsUserEdited] = useState(false);

  const { client } = useAuth();

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-user" | "create-user" | "view-user" | ""
  >("");
  const [isUserCreated, setIsUserCreated] = useState(false);

  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );

  const [openDropdown, setOpenDropdown] = useState<number>(0);
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };
  const [userToBeEdited, setUserToBeEdited] = useState("");
  const [mutationResponse, setMutationResponse] = useState("");
  const {
    data: allUsers,
    isLoading: isLoadingAllUsers,
    refetch,
  } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=superuser`, {})
        .then((response: AxiosResponse<customer[], any>) => {
          setFilteredUsers(response.data);
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
  const handleDateFilter = () => {
    // Filter the data based on the date range
    if (allUsers) {
      const filtered = allUsers.filter((item) => {
        const itemDate = new Date(item.createdAt); // Convert item date to Date object
        const startDateObj = new Date(fromDate);
        const endDateObj = new Date(toDate);

        return itemDate >= startDateObj && itemDate <= endDateObj;
      });

      // Update the filtered data state
      setFilteredUsers(filtered);
    }
  };

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
  }, [isUserMutated, refetch]);
  useEffect(() => {
    refetch();
  }, [isUserCreated, refetch]);

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
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="mb-2 text-base font-medium text-white">Super Users</p>

          <button className="flex rounded border border-white bg-transparent px-4 py-2 text-sm font-medium text-white hover:border-transparent hover:bg-blue-500 hover:text-white">
            Export as CSV{" "}
            <span className="ml-2 mt-1">
              <CiExport />
            </span>
          </button>
        </div>

        <div>
          <TransactionsTable
            headers={[
              "Name",
              "Email Address",
              "Phone Number",
              "Address",
              "No of Assigned Org",
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
                      {user.name || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.email || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.phoneNumber || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.homeAddress || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.assignedUser.length}
                    </td>
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.assignedOrgName || "----"}
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
                          labels: ["View User", "Edit User"],
                          actions: [
                            () => {
                              setModalState(true);
                              setModalToShow("view-user");
                              setUserToBeEdited(user._id);
                              setIsUserEdited(false);
                            },
                            () => {
                              setModalToShow("edit-user");
                              setModalState(true);
                              setUserToBeEdited(user._id);
                              setIsUserEdited(false);
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
                    ? "Create Super User"
                    : modalToShow === "view-user"
                      ? "View Super User"
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
                      setUserMutated={setIsUserMutated}
                      actionToTake={modalToShow}
                      setUserCreated={setIsUserCreated}
                      setUserEdited={setIsUserEdited}
                      setModalContent={setModalContent}
                      setMutationResponse={setMutationResponse}
                      userToBeEdited={userToBeEdited}
                    />
                  )}
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`User ${modalToShow === "create-user" ? "Creation" : modalToShow === "edit-user" ? "Editing" : ""} Successful`}
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
  setUserMutated,
  setCloseModal,
  actionToTake,
  setUserCreated,
  setUserEdited,
  setModalContent,
  userToBeEdited,
  setMutationResponse,
}: {
  actionToTake: "create-user" | "edit-user" | "view-user" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setUserMutated: Dispatch<SetStateAction<boolean>>;
  setUserCreated: Dispatch<SetStateAction<boolean>>;
  setUserEdited: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
  setMutationResponse: Dispatch<SetStateAction<string>>;
  userToBeEdited: string;
}) => {
  const { client } = useAuth();

  interface userProps {
    email: string;
    password: string;
    phone: string;
    address: string;
    name: string;
    selectOrganisation: string;
    selectOrganisationGroup: string;
  }
  const initialValues: userProps = {
    email: "",
    password: "",
    phone: "",
    address: "",
    name: "",
    selectOrganisation: "",
    selectOrganisationGroup: "",
  };

  const [assignType, setAssignType] = useState<"single" | "group">("single");

  const { mutate: createUser, isPending: isCreatingRole } = useMutation({
    mutationKey: ["create role"],
    mutationFn: async (values: userProps) => {
      return client.post(`/api/user/create-superuser`, {
        name: values.name,
        password: values.password,
        email: values.email,
        phoneNumber: values.phone,
        homeAddress: values.address,
        assignedUser:
          assignType === "single"
            ? values.selectOrganisation
            : values.selectOrganisationGroup,
        role: "superuser",
      });
    },

    onSuccess(response) {
      setUserCreated(true);
      setModalContent("status");
      setMutationResponse(response?.data.message);
      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form");
      }, 2000);
    },

    onError(error: AxiosError<any, any>) {
      setUserCreated(false);
      setModalContent("status");

      setMutationResponse(error.response?.data.message);
      setTimeout(() => {
        setModalContent("form");
      }, 1000);
    },
  });

  const { mutate: editUser, isPending: isEditingRole } = useMutation({
    mutationKey: ["edit role"],
    mutationFn: async (values: userProps) => {
      return;
      //  client.put(`/api/user/${userId}`, formData);
    },

    onSuccess(response) {
      setUserMutated(true);
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setUserMutated(false);
    },
  });

  // const { data: organisationGroups } = useQuery({
  //   queryKey: ["allOrganisationGroups"],
  //   queryFn: async () => {
  //     return client
  //       .get(`/api/user?userType=organisation`, {})
  //       .then((response) => {
  //         return response.data;
  //       })
  //       .catch((error) => {
  //         throw error;
  //       });
  //   },
  // });

  const {
    data: organizationsGroups,
    isLoading: isUserLoading,
    isError: getGroupError,
    refetch,
  } = useQuery({
    queryKey: ["allOrganizationsGroup"],
    queryFn: async () => {
      return client
        .get(`/api/user?userType=group`, {})
        .then((response) => {
          // setFilteredGroups(response.data);
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });
  const { data: organisation } = useQuery({
    queryKey: ["allOrganisation"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=organisation`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });
  console.log(organizationsGroups);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={Yup.object({
        name: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
        email: Yup.string().required("Required").email("Invalid email address"),
        phone: Yup.string()
          .matches(
            /^(?:\+234\d{10}|\d{11})$/,
            "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
          )
          .required("Required"),
        address: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          if (actionToTake === "create-user") {
            console.log("creating user.....................");

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
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="mb-10 w-full space-y-10 rounded-md bg-white px-[5%] py-[3%]">
            <section>
              <div className="my-3">
                <label
                  htmlFor="name"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Name
                </label>
                <Field
                  onChange={handleChange}
                  name="name"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              <div className="my-3">
                <label
                  htmlFor="password"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Password
                </label>
                <Field
                  onChange={handleChange}
                  name="password"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
                <ErrorMessage
                  name="password"
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
              <div className="my-3">
                <label
                  htmlFor="address"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Address
                </label>
                <Field
                  onChange={handleChange}
                  name="address"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              <p className="mb-3  mt-6 text-base font-semibold text-ajo_darkBlue">
                Assign Organisation(s)
              </p>
              <div className="flex flex-row items-center">
                <div className="flex w-1/2 flex-row items-center gap-x-1">
                  <Field
                    id="groupOfOrganisation"
                    name="groupOfOrganisation"
                    type="radio"
                    className="border-text- h-4 w-4 rounded text-indigo-600 focus:ring-indigo-600"
                    onChange={(e: any) => {
                      handleChange(e);
                      setAssignType("group");
                    }}
                    checked={assignType === "group" ? true : false}
                  />
                  <label
                    htmlFor="groupOfOrganisation"
                    className="text-sm font-semibold capitalize text-[#131313]"
                  >
                    Group Of Organisation
                  </label>
                </div>
                <div className="flex w-1/2 flex-row items-center gap-x-1">
                  <Field
                    id="singleOrganisation"
                    name="singleOrganisation"
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={(e: any) => {
                      handleChange(e);
                      setAssignType("single");
                    }}
                    checked={assignType === "single" ? true : false}
                  />
                  <label
                    htmlFor="singleOrganisation"
                    className="text-sm font-semibold capitalize text-[#131313]"
                  >
                    An Organisation
                  </label>
                </div>
              </div>
              {assignType === "single" && (
                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="mb-4 flex-1">
                    <label
                      htmlFor="selectOrganisation"
                      className="m-0 text-xs font-medium text-ajo_darkBlue"
                    >
                      Select Organisation
                    </label>
                    <Field
                      as="select"
                      id="selectOrganisation"
                      name="selectOrganisation"
                      className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                    >
                      {organisation?.map((organisation: Organisation) => (
                        <option key={organisation._id} value={organisation._id}>
                          {organisation.organisationName}
                        </option>
                      ))}
                      <option className="invisible"></option>
                    </Field>
                    <ErrorMessage
                      name="selectOrganisation"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
              )}
              {assignType === "group" && (
                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="mb-4 flex-1">
                    <label
                      htmlFor="selectOrganisationGroup"
                      className="m-0 text-xs font-medium text-ajo_darkBlue"
                    >
                      Select Group
                    </label>
                    <Field
                      as="select"
                      id="selectOrganisationGroup"
                      name="selectOrganisationGroup"
                      className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6]  bg-dropdown-icon  bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D] outline-gray-300"
                    >
                      {organizationsGroups?.map(
                        (group: OrganisationGroupsProps) => (
                          <option key={group._id} value={group._id}>
                            {group.groupName}
                          </option>
                        ),
                      )}
                      <option className="invisible"></option>
                    </Field>
                    <ErrorMessage
                      name="selectOrganisationGroup"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
              )}
            </section>
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

const dummyUserInfo = {
  image: "/userImage.png", // Placeholder image path
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St, Anytown, AT 12345",
  guarantors: [
    {
      name: "Jane Smith",
      phone: "+0987654321",
      email: "jane.smith@example.com",
      address: "456 Elm St, Othertown, OT 67890",
    },
    {
      name: "Mike Johnson",
      phone: "+1122334455",
      email: "mike.johnson@example.com",
      address: "789 Oak St, Anycity, AC 10112",
    },
  ],
  fileName: "Guarantor_Agreement.pdf", // Placeholder file name
};

const ViewUser = ({ userId }: { userId: string }) => {
  const { client } = useAuth();
  // const { data: userInfo, isLoading: isLoadingUserInfo } = useQuery({
  //   queryKey: ["userInfo"],
  //   queryFn: async () => {
  //     return client
  //       .get(`/api/user/${userId}`)
  //       .then((response: AxiosResponse<any, any>) => {
  //         // console.log(response.data);
  //         return response.data;
  //       })
  //       .catch((error: AxiosError<any, any>) => {
  //         console.log(error.response ?? error.message);
  //         throw error;
  //       });
  //   },
  // });

  const userInfo = dummyUserInfo;
  const isLoadingUserInfo = false;

  const Detail = ({ title, value }: { title: string; value: string }) => (
    <p className="flex-1 whitespace-nowrap text-base font-semibold">
      {title}: <span className="ms-2 font-normal text-gray-500">{value}</span>
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
          <Image
            src={userInfo?.image}
            alt="user image"
            className="rounded-md"
            width={120}
            height={120}
          />
          <div className="w-full space-y-4">
            <Detail title="First name" value={userInfo?.firstName} />
            <Detail title="Last name" value={userInfo?.lastName} />
            <Detail title="Email address" value={userInfo?.email} />
            <Detail title="Phone number" value={userInfo?.phone} />
            <Detail title="Home Address" value={userInfo?.address} />
          </div>
        </div>
      </div>
      <div className="m-0 rounded-md border border-gray-300 px-6 py-4">
        <p className="font-bold uppercase">Guarantor&lsquo;s Details</p>
        {userInfo?.guarantors?.map((guarantor: any, index: number) => (
          <div key={index} className="mt-8 space-y-2">
            <p className="font-semibold text-ajo_darkBlue">
              Guarantor {index + 1}:
            </p>
            <Detail title="Full Name" value={guarantor.name} />
            <Detail title="Phone number" value={guarantor.phone} />
            <Detail title="Email address" value={guarantor.email} />
            <Detail title="Home address" value={guarantor.address} />
            <button className="rounded-md border border-gray-300 p-2">
              <Image
                src="/pdfLogo.svg"
                alt="pdf"
                width={16}
                height={16}
                className="rounded-sm"
              />
              {userInfo.fileName}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  return <Users />;
}

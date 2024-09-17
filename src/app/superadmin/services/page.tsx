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
  customer,
  roleResponse,
  servicePackageProps,
  staffResponse,
} from "@/types";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  Dispatch,
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
    data: allServicePackages,
    isLoading: isLoadingallServicePackages,
    refetch,
  } = useQuery({
    queryKey: ["allServicePackages"],
    queryFn: async () => {
      return client
        .get(`/api/service-package`, {})
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

    if (allServicePackages) {
      const filtered = allServicePackages.filter((item) =>
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
  //   if (allServicePackages) {
  //     const filtered = allServicePackages.filter((item) => {
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
  if (allServicePackages) {
    totalPages = Math.ceil(allServicePackages.length / PAGE_SIZE);
  }

  useEffect(() => {
    refetch();
    refetchAllRoles();
  }, [isUserCreated, isUserEdited, modalContent, refetch, refetchAllRoles]);

  const viewUser =
    user?.role === "organisation" ||
    (user?.role === "staff" &&
      userPermissions.includes(permissionsMap["view-users"]));

  const editUser =
    user?.role === "organisation" ||
    (user?.role === "staff" &&
      userPermissions.includes(permissionsMap["edit-user"]));

  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Service
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
          {(user?.role === "superadmin" ||
            (user?.role === "superuser" &&
              userPermissions.includes(permissionsMap["create-staff"]))) && (
            <CustomButton
              type="button"
              label="Create Service Package"
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
          Existing Service Package List
        </p>

        <div>
          <TransactionsTable
            headers={[
              "S/N",
              "Package name",
              "Services",
              "Monthly Subscription",
              "Quaterly Subscription",
              "Yearly Subscription",
              "Setup Date",
              "Promo Start Date",
              "Promo End Date",
              "Updated date",
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
                paginatedRoles?.map((packages, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {index + 1}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {packages.groupName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <ul>
                        {packages.service.map(
                          (
                            service: string,

                            index: number,
                          ) => (
                            <li key={index}>{service}</li>
                          ),
                        )}
                      </ul>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {packages.totals.totalMonthly}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {" "}
                      {packages.totals.totalQuarterly}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {packages.totals.totalYearly}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {extractDate(packages.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {extractDate(
                        packages.promoCode?.startDate ||
                          packages.promoDates.start,
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {extractDate(
                        packages.promoCode?.endDate || packages.promoDates.end,
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {extractDate(packages.updatedAt) || "---"}
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
                            // viewUser ? "View User" : "View Package",
                            // (user?.role === "organisation" ||
                            //   (user?.role === "staff" &&
                            //     userPermissions.includes(
                            //       permissionsMap["view-users"],
                            //     ))) &&
                            //   "View User",

                            editUser ? "Edit User" : "Edit Package",
                            // (user?.role === "organisation" ||
                            //   (user?.role === "staff" &&
                            //     userPermissions.includes(
                            //       permissionsMap["edit-user"],
                            //     ))) &&
                            //   "Edit User",
                          ].filter(Boolean) as string[],
                          actions: [
                            // () => {
                            // if (
                            //   user?.role === "organisation" ||
                            //   (user?.role === "staff" &&
                            //     userPermissions.includes(
                            //       permissionsMap["view-users"],
                            //     ))
                            // )
                            // {
                            //   setModalState(true);
                            //   setModalToShow("view-user");
                            //   setUserToBeEdited(packages._id);
                            //   setIsUserEdited(false);
                            // }
                            // },
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
                                setUserToBeEdited(packages._id);
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
                  ? "Edit Service Package"
                  : modalToShow === "create-user"
                    ? "Create a Service Packager"
                    : modalToShow === "view-user"
                      ? "View Service Package"
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
                  successTitle={`Service Package ${modalToShow === "create-user" ? "Creation" : modalToShow === "edit-user" ? "Editing" : ""} Successful`}
                  errorTitle={`Service Package ${modalToShow === "create-user" ? "Creation" : "Editing"} Failed`}
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
  const router = useRouter();
  const { client } = useAuth();
  const organizationId = useSelector(selectOrganizationId);
  const userId = useSelector(selectUserId);
  const [selectedOptions, setSelectedOptions] = useState<
    (customer | undefined)[]
  >([]);
  const [showGroupCustomerSelect, setShowGroupCustomerSelect] = useState(false);
  const [showIndividualCustomerSelect, setShowIndividualCustomerSelect] =
    useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [organizationsGroups, setOrganizationsGroups] = useState([]);

  const { data: packageInfo, isLoading: isLoadingPackageInfo } = useQuery({
    queryKey: ["packageInfo", userToBeEdited],
    queryFn: async () => {
      return client
        .get(`/api/service-package/${userToBeEdited}`)
        .then((response) => {
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

  const { mutate: createPackage, isPending: isCreatingPackages } = useMutation({
    mutationFn: async (values: servicePackageProps) => {
      return client.post(`/api/service-package`, values);
    },

    onSuccess(response) {
      setUserCreated(true);
      setModalContent("status");
      setMutationResponse(response?.data.message);

      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form");
        // router.push("/merchant/users");
      }, 1000);
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

  const { mutate: editUser, isPending: isEditingPackages } = useMutation({
    mutationKey: ["edit user"],
    mutationFn: async (values: servicePackageProps) => {
      return client.put(`/api/service-package/${userToBeEdited}`, values);
    },

    onSuccess(response) {
      setUserEdited(true);
      setModalContent("status");
      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form");
      }, 1000);
    },

    onError(error: AxiosError<any, any>) {
      setUserEdited(false);
      setModalContent("status");

      setMutationResponse(error.response?.data.message);
      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form");
      }, 1000);
    },
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [promoCode, setPromoCode] = useState(
    packageInfo?.promoCode?.code || "",
  );

  const servicesOptions = ["savings", "purpose"];

  console.log(packageInfo);
  const initialValues: servicePackageProps =
    actionToTake === "edit-user"
      ? {
          groupName: packageInfo?.groupName ?? "",
          description: packageInfo?.description ?? "",
          service: packageInfo?.service ?? "",
          savingsMonthly: packageInfo?.savings.monthly ?? "",
          savingsQuarterly: packageInfo?.savings.quarterly ?? "",
          savingsYearly: packageInfo?.savings.yearly ?? "",
          purposeMonthly: packageInfo?.purpose.monthly ?? "",
          purposeQuarterly: packageInfo?.purpose.quarterly ?? "",
          purposeYearly: packageInfo?.purpose.yearly ?? "",
          totalMonthly: packageInfo?.totals.monthly ?? 0,
          totalQuarterly: packageInfo?.totals.quarterly ?? 0,
          totalYearly: packageInfo?.totals.yearly ?? 0,
          discount: packageInfo?.discount,
          actualFee: "",
          promoCode: packageInfo?.promoCode?.code ?? "",
          promoStartDate: extractDate(packageInfo?.promoCode?.startDate) ?? "",
          promoEndDate: extractDate(packageInfo?.promoCode?.endDate) ?? "",
          promoStartTime: packageInfo?.promoCode?.startTime ?? "",
          promoEndTime: packageInfo?.promoCode?.endTime ?? "",
          actualMonthlyFee: packageInfo?.actualMonthlyFee ?? 0,
          actualQuarterlyFee: packageInfo?.actualQuarterlyFee ?? 0,
          actualYearlyFee: packageInfo?.actualYearlyFee ?? 0,
          applyToOrganisations: packageInfo?.applyToOrganisations ?? "",
          appliedUserId: "",
          selectedCustomerGroup: "",
          selectedIndividualCustomer: "",
          userType: "organisation",
        }
      : {
          groupName: "",
          description: "",
          service: [],
          savingsMonthly: "",
          savingsQuarterly: "",
          savingsYearly: "",
          purposeMonthly: "",
          purposeQuarterly: "",
          purposeYearly: "",
          totalMonthly: 0,
          totalQuarterly: 0,
          totalYearly: 0,
          discount: 2,
          actualFee: "",
          promoCode: "",
          promoStartDate: "",
          promoEndDate: "",
          promoStartTime: "",
          promoEndTime: "",
          actualMonthlyFee: 0,
          actualQuarterlyFee: 0,
          actualYearlyFee: 0,
          applyToOrganisations: "all-organisations",
          appliedUserId: "",
          selectedCustomerGroup: "",
          selectedIndividualCustomer: "",
          userType: "organisation",
        };

  const validationSchema = Yup.object({
    groupName: Yup.string().required("Group Name is required"),
    description: Yup.string().required("Description is required"),
    discount: Yup.number()
      .required("Discount is required")
      .min(0, "Cannot be negative"),
    // actualFee: Yup.number()
    //   .required("Actual Fee is required")
    //   .min(0, "Cannot be negative"),
  });
  useEffect(() => {
    if (actionToTake === "edit-user") {
      if (packageInfo?.service) {
        const services = packageInfo?.service?.map((service: any) => service);
        setSelectedServices(services || []);
      }
    } else {
      setSelectedServices([]);
    }
  }, [packageInfo, actionToTake]);
  const handleServiceSelection = (service: any) => {
    if (!selectedServices.includes(service)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const removeSelectedService = (service: string) => {
    setSelectedServices(selectedServices.filter((s) => s !== service));
  };

  const handlePromoCodeGeneration = () => {
    const code = nanoid(6);
    setPromoCode(code);
  };
  const MyEffectComponent = ({
    formikValues,
    setFieldValue,
  }: {
    formikValues: any;
    setFieldValue: any;
  }) => {
    useEffect(() => {
      const totalMonthly =
        (formikValues.savingsMonthly
          ? parseFloat(formikValues.savingsMonthly)
          : 0) +
        (formikValues.purposeMonthly
          ? parseFloat(formikValues.purposeMonthly)
          : 0);

      const totalQuarterly =
        (formikValues.savingsQuarterly
          ? parseFloat(formikValues.savingsQuarterly)
          : 0) +
        (formikValues.purposeQuarterly
          ? parseFloat(formikValues.purposeQuarterly)
          : 0);

      const totalYearly =
        (formikValues.savingsYearly
          ? parseFloat(formikValues.savingsYearly)
          : 0) +
        (formikValues.purposeYearly
          ? parseFloat(formikValues.purposeYearly)
          : 0);

      const actualMonthlyGroupFee =
        formikValues.totalMonthly -
        (formikValues.discount / 100) * formikValues.totalMonthly;
      const actualQuarterlyGroupFee =
        formikValues.totalQuarterly -
        (formikValues.discount / 100) * formikValues.totalQuarterly;
      const actualYearlyGroupFee =
        formikValues.totalYearly -
        (formikValues.discount / 100) * formikValues.totalYearly;
      setFieldValue("service", selectedServices);
      setFieldValue("promoCode", promoCode);
      setFieldValue("totalMonthly", totalMonthly);
      setFieldValue("totalQuarterly", totalQuarterly);
      setFieldValue("totalYearly", totalYearly);
      setFieldValue("actualMonthlyFee", actualMonthlyGroupFee);
      setFieldValue("actualQuarterlyFee", Number(actualQuarterlyGroupFee));
      setFieldValue("actualYearlyFee", actualYearlyGroupFee);
    }, [
      formikValues.savingsMonthly,
      formikValues.purposeMonthly,
      formikValues.purposeQuarterly,
      formikValues.purposeYearly,
      formikValues.savingsQuarterly,
      formikValues.savingsYearly,
      formikValues.discount,
      formikValues.totalMonthly,
      formikValues.values?.discount,
      formikValues.totalYearly,
      formikValues.totalQuarterly,
      setFieldValue,
    ]);

    return null; // Since this is a utility component, it doesn't render anything
  };

  const {
    data: Allorganisations,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganisations"],
    queryFn: async () => {
      return client
        .get(`/api/user`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  useEffect(() => {
    setOrganizations(
      Allorganisations?.filter(
        (organisation: { role: string }) =>
          organisation?.role === "organisation",
      ),
    );
    setOrganizationsGroups(
      Allorganisations?.filter(
        (organisation: { userType: string }) =>
          organisation?.userType === "group",
      ),
    );
  }, [Allorganisations]);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (actionToTake === "create-user") {
            // console.log(values);
            createPackage(values);
          } else {
            editUser(values);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          return (
            <Form>
              <div role="group" className="flex-col-3 flex justify-between">
                <label className="block text-white">
                  <Field
                    type="radio"
                    name="userType"
                    value="organisation"
                    // onClick={() => {
                    //   setShowGroupCustomerSelect(false);
                    //   setShowIndividualCustomerSelect(false);
                    // }}
                  />
                  <span className="ml-2">All organisation</span>
                </label>
                <label className="block text-white">
                  <Field
                    type="radio"
                    name="userType"
                    value="customer"
                    // onClick={() => {
                    //   setShowGroupCustomerSelect(true);
                    //   setShowIndividualCustomerSelect(false);
                    // }}
                  />
                  <span className="ml-2">Customer</span>
                </label>
              </div>
              {/* Group Name */}
              <div className="mb-4">
                <label className="m-0 text-xs font-medium text-white">
                  Group Name
                  <span className=" font-base font-semibold text-[#FF0000]">
                    *
                  </span>
                </label>
                <Field
                  name="groupName"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  placeholder="Enter Group Name"
                />
                <ErrorMessage
                  name="groupName"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="m-0 text-xs font-medium text-white">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  placeholder="Enter Description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Service */}
              <div className="mb-4">
                <label className="m-0 text-xs font-medium text-white">
                  Service
                </label>
                <Field
                  as="select"
                  name="service"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  onChange={(e: { target: { value: any } }) =>
                    handleServiceSelection(e.target.value)
                  }
                >
                  <option value="">Select Service</option>
                  {servicesOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Selected Services */}
              <div className="mb-4 flex space-x-2">
                {selectedServices.map((service) => (
                  <div
                    key={service}
                    className="rounded-lg bg-blue-100 px-2 py-1"
                  >
                    {service}{" "}
                    <button
                      type="button"
                      onClick={() => removeSelectedService(service)}
                      className="text-red-500"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              {/* Savings & Purpose Inputs */}
              {selectedServices.includes("savings") && (
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div>
                    <label className="m-0 text-xs font-medium text-white">
                      Savings Monthly
                    </label>
                    <Field
                      name="savingsMonthly"
                      type="number"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                  </div>
                  <div>
                    <label className="m-0 text-xs font-medium text-white">
                      Savings Quarterly
                    </label>
                    <Field
                      name="savingsQuarterly"
                      type="number"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                  </div>
                  <div>
                    <label className="m-0 text-xs font-medium text-white">
                      Savings Yearly
                    </label>
                    <Field
                      name="savingsYearly"
                      type="number"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                  </div>
                </div>
              )}

              {selectedServices.includes("purpose") && (
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div>
                    <label className="m-0 text-xs font-medium text-white">
                      Purpose Monthly
                    </label>
                    <Field
                      name="purposeMonthly"
                      type="number"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                  </div>
                  <div>
                    <label className="m-0 text-xs font-medium text-white">
                      Purpose Quarterly
                    </label>
                    <Field
                      name="purposeQuarterly"
                      type="number"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                  </div>
                  <div>
                    <label className="m-0 text-xs font-medium text-white">
                      Purpose Yearly
                    </label>
                    <Field
                      name="purposeYearly"
                      type="number"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                    />
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="m-0 text-xs font-medium text-white">
                    Total Monthly
                  </label>
                  <Field
                    name="totalMonthly"
                    type="number"
                    readOnly
                    // value={totalMonthly}
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                </div>
                <div>
                  <label className="m-0 text-xs font-medium text-white">
                    Total Quarterly
                  </label>
                  <Field
                    name="totalQuarterly"
                    type="number"
                    readOnly
                    // value={totalQuarterly}
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                </div>
                <div>
                  <label className="m-0 text-xs font-medium text-white">
                    Total Yearly
                  </label>
                  <Field
                    name="totalYearly"
                    type="number"
                    readOnly
                    // value={totalYearly}
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                </div>
              </div>

              {/* Discount */}
              <div className="mb-4">
                <label className="m-0 text-xs font-medium text-white">
                  Discount
                </label>
                <Field
                  name="discount"
                  type="number"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
              </div>

              {/* Actual Group's Fee */}
              <div className="mb-4">
                <label className="m-0 text-xs font-medium text-white">
                  Actual Monthly Fee
                </label>
                <Field
                  // value={actualMonthlyGroupFee}
                  name="actualMonthlyFee"
                  type="number"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
              </div>
              <div className="mb-4">
                <label className="m-0 text-xs font-medium text-white">
                  Actual Quaterly Fee
                </label>
                <Field
                  // value={actualQuarterlyGroupFee}
                  name="actualQuarterlyFee"
                  type="number"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
              </div>

              <div className="mb-4">
                <label className="m-0 text-xs font-medium text-white">
                  Actual Yearly Fee
                </label>
                <Field
                  // value={actualYearlyGroupFee}
                  name="actualYearlyFee"
                  type="number"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
              </div>
              {/* <div className="mb-4">
                <label className="m-0 text-xs font-medium text-white">
                  Actual Group&apos;s Fee
                </label>
                <Field
                  name="actualFee"
                  type="number"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
              </div> */}

              {/* Promo Code */}
              <div className="mb-4 ">
                <label className="m-0 text-xs font-medium text-white">
                  Generate Promo Code
                </label>
                <div className="flex">
                  <Field
                    name="promoCode"
                    type="text"
                    // value={promoCode}
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />
                  <button
                    type="button"
                    className="ml-2 rounded-md bg-blue-500 px-4 py-2 text-white"
                    onClick={handlePromoCodeGeneration}
                  >
                    Generate
                  </button>
                </div>
              </div>
              {/* Promo Code Start and End Date */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                {" "}
                <div>
                  {" "}
                  <label className="m-0 text-xs font-medium text-white">
                    Promo Code Start Date
                  </label>{" "}
                  <Field
                    name="promoStartDate"
                    type="date"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="m-0 text-xs font-medium text-white">
                    Promo Code End Date
                  </label>{" "}
                  <Field
                    name="promoEndDate"
                    type="date"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />{" "}
                </div>{" "}
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                {" "}
                <div>
                  {" "}
                  <label className="m-0 text-xs font-medium text-white">
                    Promo Code Start Time
                  </label>{" "}
                  <Field
                    name="promoStartTime"
                    type="time"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="m-0 text-xs font-medium text-white">
                    Promo Code End Time
                  </label>{" "}
                  <Field
                    name="promoEndTime"
                    type="time"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                  />{" "}
                </div>{" "}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white">
                  Apply to Organisation
                </label>
                <div role="group" className="flex-col-3 flex justify-between">
                  <label className="block text-white">
                    <Field
                      type="radio"
                      name="applyToOrganisations"
                      value="all-organisations"
                      onClick={() => {
                        setShowGroupCustomerSelect(false);
                        setShowIndividualCustomerSelect(false);
                      }}
                    />
                    <span className="ml-2">All organisation</span>
                  </label>
                  <label className="block text-white">
                    <Field
                      type="radio"
                      name="applyToOrganisations"
                      value="group-of-organisations"
                      onClick={() => {
                        setShowGroupCustomerSelect(true);
                        setShowIndividualCustomerSelect(false);
                      }}
                    />
                    <span className="ml-2">Group of Organisation</span>
                  </label>

                  <label className="block text-white">
                    <Field
                      type="radio"
                      name="applyToOrganisations"
                      value="individual-organisation"
                      onClick={() => {
                        setShowGroupCustomerSelect(false);
                        setShowIndividualCustomerSelect(true);
                      }}
                    />
                    <span className="ml-2">Individual Organisation</span>
                  </label>
                </div>
                {showGroupCustomerSelect && (
                  <div className="mt-2">
                    <Field
                      name="selectedCustomerGroup"
                      as="select"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                    >
                      <option value="">Select group</option>
                      {organizationsGroups.map(
                        (group: { _id: string; groupName: string }) => (
                          <option key={group._id} value={group._id}>
                            {group.groupName}
                          </option>
                        ),
                      )}
                    </Field>
                  </div>
                )}
                {showIndividualCustomerSelect && (
                  <div className="mt-2">
                    <Field
                      name="selectedIndividualCustomer"
                      as="select"
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                    >
                      <option value="">Select a customer</option>
                      {organizations.map(
                        (IndividualCustomer: {
                          _id: string;
                          organisationName: string;
                        }) => (
                          <option
                            key={IndividualCustomer._id}
                            value={IndividualCustomer._id}
                          >
                            {IndividualCustomer.organisationName}
                          </option>
                        ),
                      )}
                    </Field>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="rounded-md bg-green-500 px-4 py-2 text-white"
              >
                {isSubmitting || isCreatingPackages || isEditingPackages ? (
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
              <MyEffectComponent
                formikValues={values}
                setFieldValue={setFieldValue}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
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
          <Link
            target="_blank"
            href={userInfo?.photo ? String(userInfo?.photo) : ""}
          >
            <Image
              // src={userInfo?.image ?? "/user"}
              src={userInfo ? userInfo?.photo : ""}
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
              <p className="font-semibold ">Assigned User:</p>

              {userInfo?.assignedUser.map((user, index) => (
                <React.Fragment key={user._id}>
                  {user.firstName} {user.lastName}
                  {index < userInfo.assignedUser.length - 1 && ", "}
                </React.Fragment>
              ))}
            </div>
            <div className="flex ">
              <p className="font-semibold ">{userInfo?.meansOfID}:</p>

              <div className="ml-4">
                <Link
                  target="_blank"
                  href={
                    userInfo?.meansOfIDPhoto
                      ? String(userInfo?.meansOfIDPhoto)
                      : ""
                  }
                >
                  <Image
                    src={userInfo ? userInfo?.meansOfIDPhoto : ""}
                    alt={`${userInfo?.firstName}'s ID`}
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

          <Link
            target="_blank"
            href={userInfo?.guarantorForm ? userInfo?.guarantorForm : ""}
          >
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

          <Link
            target="_blank"
            href={userInfo?.guarantorForm2 ? userInfo?.guarantorForm2 : ""}
          >
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

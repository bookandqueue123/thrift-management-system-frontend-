"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import ErrorModal from "@/components/ErrorModal";
import Modal, { ModalConfirmation } from "@/components/Modal";
import { StatusIndicator } from "@/components/StatusIndicator";
import SuccessModal from "@/components/SuccessModal";
import TransactionsTable from "@/components/Tables";
import CreateCommissionForm from "@/modules/superAdmin/CreateCommission";
import { getOrganizationProps, OrganisationGroupsProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  JSXElementConstructor,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CiExport } from "react-icons/ci";

export default function SuperAdminCustomer() {
  const router = useRouter();
  const { client } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number>(0);

  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [modalToShow, setModalToShow] = useState<
    "view-commission" | "edit-commission" | ""
  >("");
  const [commissionToBeEdited, setCommissionToBeEdited] = useState({});
  const [isCommissionEdited, setIsCommissionEdited] = useState(false);
  const [isCommissionCreated, setIsCommissionCreated] = useState(false);
  const [mutationResponse, setMutationResponse] = useState("");
  const [serviceTobeEditedIndex, SetServiceTobeEditedIndex] = useState(-1);
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  const {
    data: organisations,
    isLoading: isUserLoading,
    isError: getGroupError,
    refetch,
  } = useQuery({
    queryKey: ["all Organizations"],
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
  useEffect(() => {
    refetch();
  }, [isCommissionEdited, isCommissionCreated, refetch]);
  // console.log(isCommissionCreated);
  return (
    <div>
      {showModal ? (
        <Modal setModalState={setShowModal} title="Commission">
          <CreateCommissionForm
            setIsCommissionCreated={setIsCommissionCreated}
          />
        </Modal>
      ) : (
        ""
      )}
      <div className="mb-4 space-y-2">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          Commisssion
        </p>
      </div>

      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            {/* <SearchInput onSearch={() => ("")}/> */}
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
              <input
                // onChange={handleSearch}
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
            label="Create Commission"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
              setShowModal(true);
              //   setModalState(true);
              //   setModalContent("form");
            }}
          />
        </div>

        <div className="my-8 justify-between md:flex">
          <div className="flex items-center">
            <p className="font-lg mr-2 text-white">Select range from:</p>
            <input
              type="date"
              //   value={fromDate}
              //     onChange={handleFromDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />

            <p className="mx-2 text-white">to</p>
            <input
              type="date"
              //   value={toDate}
              //   onChange={handleToDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mt-4 flex">
            <button className="mr-4 flex rounded border border-white bg-transparent px-4 py-2 font-medium text-white hover:border-transparent hover:bg-blue-500 hover:text-white">
              Export as CSV{" "}
              <span className="ml-2 mt-1">
                <CiExport />
              </span>
            </button>
            <button className="relative rounded-md border-none bg-transparent px-4 py-2 text-white">
              <u>Export as Excel</u>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xl text-white">Commission List</p>
        </div>

        <TransactionsTable
          headers={[
            "S/N",
            "Organisation",
            "Organisation ID No",
            // "Applied % (lowest range)",
            "Admin Fee (Lowest range)",
            // "Applied %(Highest range)",
            // "Admin Fee (Highest range)",
            // "Applied Service Charge %",
            "Service Charge",
            "Purpose/item commission",
            "Comment",
            "Action",
          ]}
          content={organisations?.map(
            (
              organisation: {
                _id(_id: any): unknown;
                organisation: any;
                organisationName: string;

                accountNumber: string | number;

                adminFee: string | number;

                serviceFee: string | number;

                purposeCommission:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>;
              },
              index: number,
            ) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link href={`/superadmin/commission/`}>{index + 1}</Link>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link href={`/superadmin/commission/`}>
                    {organisation.organisationName}
                  </Link>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link href={`/superadmin/commission/`} key={index}>
                    {organisation.accountNumber}
                  </Link>
                </td>
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/`}
                  key={index}
                >
                  {organisation.Appliedlowest}
                </Link>
              </td> */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link href={`/superadmin/commission/`} key={index}>
                    {organisation.adminFee}
                  </Link>
                </td>
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/`}
                  key={index}
                >
                  {organisation.Apliedhigest}
                </Link>
              </td> */}
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/`}
                  key={index}
                >
                  {organisation.AdminFeeHiest}
                </Link>
              </td> */}

                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/`}
                  key={index}
                >
                  {organisation.AppliedServiceCharge}
                </Link>
              </td> */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link href={`/superadmin/commission/`} key={index}>
                    {organisation.serviceFee}
                  </Link>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link href={`/superadmin/commission/`} key={index}>
                    {organisation.purposeCommission}
                  </Link>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link href={`/superadmin/commission/`} key={index}>
                    {/* {organisation.comment} */}
                  </Link>
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
                      labels: ["Edit Commission"].filter(Boolean) as string[],
                      actions: [
                        // () => {
                        //   {
                        //     setModalState(true);
                        //     setModalToShow("view-commission");
                        //     setCommissionToBeEdited(organisation._id);
                        //     setIsCommissionEdited(false);
                        //   }
                        // },
                        () => {
                          {
                            SetServiceTobeEditedIndex(index);
                            setModalToShow("edit-commission");
                            setModalState(true);
                            setCommissionToBeEdited(organisation._id);
                            setIsCommissionEdited(false);
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
            ),
          )}
        />
        {modalState && (
          <Modal
            setModalState={setModalState}
            title={
              modalToShow === "edit-commission"
                ? "Edit Commission"
                : modalToShow === "view-commission"
                  ? "View Commission"
                  : ""
            }
          >
            {modalContent === "form" ? (
              <div className="px-[10%]">
                {modalToShow === "view-commission" ? (
                  "" // <ViewUser userId={userToBeEdited} />
                ) : (
                  <MutateUser
                    organisationDetails={organisations[serviceTobeEditedIndex]}
                    setCloseModal={setModalState}
                    // setUserCreated={setIsCommissionCreated}
                    setIsCommissionEdited={setIsCommissionEdited}
                    setModalContent={setModalContent}
                    // setMutationResponse={setMutationResponse}
                    // actionToTake={modalToShow}
                    // userToBeEdited={commissionToBeEdited}
                  />
                )}
              </div>
            ) : (
              <ModalConfirmation
                successTitle={`Commission ${modalToShow === "view-commission" ? "View" : modalToShow === "edit-commission" ? "Editing" : ""} Successful`}
                errorTitle={`Commission ${modalToShow === "view-commission" ? "View" : "Editing"} Failed`}
                status={isCommissionEdited ? "success" : "failed"}
                responseMessage={mutationResponse}
              />
            )}
          </Modal>
        )}
        {/* <PaginationBar
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        /> */}
      </section>
    </div>
  );
}

const MutateUser = ({
  organisationDetails,
  setIsCommissionEdited,

  setCloseModal,
  setModalContent,
}: {
  organisationDetails: any;
  // actionToTake: "edit-user" | "view-user" | "";
  setIsCommissionEdited: Dispatch<SetStateAction<boolean>>;
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"form" | "confirmation">>;
  // userToBeEdited: string;
}) => {
  const router = useRouter();

  const { client } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [organizations, setOrganizations] = useState([]);
  const [organizationsGroups, setOrganizationsGroups] = useState([]);

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

  const [formValues, setFormValues] = useState({
    organisationType: "anOrganisation",
    group: "",
    organisation: organisationDetails?._id ?? "",
    selectAllOrganisation: false,
    savingsCommission: organisationDetails.serviceFee,
    purposeCommission: organisationDetails.purposeCommission,
    comment: "",
  });

  const [errors, setErrors] = useState({
    organisationType: "",
    group: "",
    organisation: "",
    savingsCommission: "",
    purposeCommission: "",
    comment: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate all fields
    let formErrors = { ...errors };

    if (!formValues.organisationType) {
      formErrors.organisationType = "Please select an organisation type";
    }

    if (
      formValues.organisationType === "groupOfOrganisation" &&
      !formValues.group
    ) {
      formErrors.group = "Please select a group";
    }

    if (
      formValues.organisationType === "anOrganisation" &&
      !formValues.organisation
    ) {
      formErrors.organisation = "Please select an organisation";
    }

    if (!formValues.savingsCommission) {
      formErrors.savingsCommission = "Please enter savings commission";
    }
    if (!formValues.purposeCommission) {
      formErrors.purposeCommission = "Please enter purpose commission";
    }

    if (!formValues.comment) {
      formErrors.comment = "Please enter a comment";
    }

    setErrors(formErrors);

    // If no errors, submit the form
    if (Object.values(formErrors).every((error) => error === "")) {
      editCommssion();
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = event.target;
    let newValue: string | boolean = value;

    if (type === "checkbox") {
      newValue = (event.target as HTMLInputElement).checked;
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error message when user starts typing
    }));
  };

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

  const {
    mutate: editCommssion,
    isPending: editCommission,
    isError,
  } = useMutation({
    mutationKey: ["Edit Commisson"],
    mutationFn: async () => {
      let payload;
      // if (formValues.organisationType === "groupOfOrganisation") {
      //   payload = {
      //     commission: formValues.savingsCommission,
      //     purposeCommission: formValues.purposeCommission,
      //     group: formValues.group,
      //   };
      // } else if (formValues.organisationType === "all") {
      //   payload = {
      //     commission: formValues.savingsCommission,
      //     purposeCommission: formValues.purposeCommission,
      //     all: "all",
      //   };
      // } else
      // {
      payload = {
        commission: formValues.savingsCommission,
        purposeCommission: formValues.purposeCommission,
        organisation: formValues.organisation,
      };
      //}
      return client.post(`/api/saving/set-commission`, payload);
    },
    onSuccess: (response) => {
      setIsCommissionEdited(true);

      setShowSuccessModal(true);

      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form");
        // router.push("/merchant/purpose/item");
      }, 3000);
    },
    onError: (error: any) => {
      setErrorMessage(error.response.data.message);
      setShowErrorModal(true);
      throw error;
    },
  });

  return (
    <div>
      <form
        className="mx-auto w-[80%] space-y-3 text-white"
        onSubmit={handleSubmit}
      >
        {showErrorModal ? (
          <ErrorModal
            errorText={errorMessage}
            title="Error Setting up commission"
            setShowModal={setShowErrorModal}
          />
        ) : (
          ""
        )}

        {showSuccessModal ? (
          <SuccessModal
            setShowModal={setShowSuccessModal}
            title="Successful"
            successText="Commission setup successful"
          />
        ) : (
          ""
        )}
        <div className="items-center gap-6  md:flex">
          <label className="m-0 w-[16%] text-xs font-medium text-white">
            Organisation Type:{" "}
          </label>
          <div></div>
          {/* {errors.organisationType && (
            <div className="text-red-500">{errors.organisationType}</div>
          )} */}
        </div>

        {formValues.organisationType === "groupOfOrganisation" && (
          <div className="items-center gap-6 md:flex">
            <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
              Select Group
            </label>
            <span className="w-full">
              <select
                name="group"
                onChange={handleInputChange}
                className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
              >
                <option value="">Select group...</option>
                {organizationsGroups?.map(
                  (group: OrganisationGroupsProps, index: number) => (
                    <option value={group._id} key={group._id}>
                      {group.groupName}
                    </option>
                  ),
                )}

                {/* <option value="group1">Group 1</option>
                <option value="group2">Group 2</option> */}
              </select>
              {errors.group && (
                <div className="text-red-500">{errors.group}</div>
              )}
            </span>
          </div>
        )}

        {formValues.organisationType === "anOrganisation" && (
          <>
            <div className="mt-4 items-center gap-6 md:flex">
              <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
                Select Organisation
              </label>
              <span className="w-full">
                <select
                  disabled
                  value={formValues.organisation}
                  name="organisation"
                  onChange={handleInputChange}
                  className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                >
                  {/* <option value="">Select organisation...</option> */}
                  {organizations?.map(
                    (organization: getOrganizationProps, index: number) => (
                      <option key={organization._id} value={organization._id}>
                        {organization.organisationName}
                      </option>
                    ),
                  )}
                </select>
                {errors.organisation && (
                  <div className="text-red-500">{errors.organisation}</div>
                )}
              </span>
            </div>

            {/* <div className='md:ml-[18%]'>
          <label className="block mb-1">
            <input
              type="checkbox"
              name="selectAllOrganisation"
              checked={formValues.selectAllOrganisation}
              onChange={handleInputChange}
              className="mr-1"
            />
            Select all organisations
          </label>
        </div> */}
          </>
        )}

        <div className="mt-4 items-center gap-6 md:flex">
          <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
            Savings Commission (%):
          </label>
          <span className="w-full">
            <input
              type="number"
              name="savingsCommission"
              value={formValues.savingsCommission}
              onChange={handleInputChange}
              onBlur={handleInputChange} // Touch validation
              className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
            />
            {errors.savingsCommission && (
              <div className="text-red-500">{errors.savingsCommission}</div>
            )}
          </span>
        </div>

        <div className="mt-4 items-center gap-6 md:flex">
          <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
            Purpose/Item Commission (%):
          </label>
          <span className="w-full">
            <input
              type="number"
              name="purposeCommission"
              value={formValues.purposeCommission}
              onChange={handleInputChange}
              onBlur={handleInputChange} // Touch validation
              className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
            />
            {errors.purposeCommission && (
              <div className="text-red-500">{errors.purposeCommission}</div>
            )}
          </span>
        </div>

        <div className="mt-4 items-center gap-6 md:flex">
          <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
            Comment:
          </label>
          <span className="w-full">
            <textarea
              name="comment"
              value={formValues.comment}
              onChange={handleInputChange}
              onBlur={handleInputChange} // Touch validation
              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-sm text-[#7D7D7D]"
            ></textarea>
            {errors.comment && (
              <div className="text-red-500">{errors.comment}</div>
            )}
          </span>
        </div>

        <div className="mt-4 flex items-center">
          <span className="invisible w-[20%]">Submit</span>
          <div className="flex justify-center md:w-[80%]">
            {/* <CustomButton
            type="button"
            label={"Create Commission"}
            style={`rounded-md bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500 py-3 px-9 text-sm text-ajo_offWhite md:w-[60%]`}
            // onButtonClick={""}
          /> */}
            <button className="rounded-md bg-ajo_blue px-9 py-3 text-sm text-ajo_offWhite hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]">
              submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

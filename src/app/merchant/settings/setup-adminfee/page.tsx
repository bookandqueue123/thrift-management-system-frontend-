"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton } from "@/components/Buttons";
import ErrorModal from "@/components/ErrorModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import SuccessModal from "@/components/SuccessModal";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { customer, setUpSavingsProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { IoMdSearch } from "react-icons/io";
import { useSelector } from "react-redux";

// import { CustomButton } from "@/components/Buttons";
// import ErrorModal from "@/components/ErrorModal";
// import Modal, { NoBackgroundModal } from "@/components/Modal";
// import SuccessModal from "@/components/SuccessModal";
// import SetUpSavingsAndAdminFee from "@/modules/settings/SetupAdminFee";
// import Image from "next/image";
// import { useState } from "react";

export default function Page() {
  const user = useSelector(selectUser);
  const [successModal, setSuccessModal] = useState(false);
  const [modalState, setModalState] = useState(false);
  const { userPermissions, permissionsLoading, permissionsMap } =
    usePermissions();

  if (
    user?.role === "staff" ||
    (user?.role === "customer" &&
      !userPermissions.includes(permissionsMap["set-saving"]))
  ) {
    return (
      <div className="mt-12 text-center text-3xl text-white">
        You are unauthorized
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-4 space-y-2 ">
        <p className="text-2xl font-bold text-ajo_offWhite text-opacity-60">
          Settings
        </p>
        <p className="text-sm font-bold text-ajo_offWhite">Savings settings</p>
      </div>

      {!modalState ? (
        <>
          <div className="mx-auto mt-[20%] flex h-screen w-[80%] flex-col items-center gap-8 md:mt-[10%] md:w-[40%]">
            <Image
              src="/receive-money.svg"
              alt="hand with coins in it"
              width={120}
              height={120}
              className="w-[5rem] md:w-[7.5rem]"
            />
            <p className="text-center text-sm text-ajo_offWhite">
              Setup savings and admin fee. Make all the necessary edits and
              changes. Use the button below to get started!
            </p>

            <CustomButton
              type="button"
              label="Savings SetUp"
              style="rounded-md bg-indigo-800 py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => setModalState(true)}
            />
          </div>
        </>
      ) : (
        <Form setModalState={setModalState} />
      )}
    </div>
  );
}

const Form = ({
  setModalState,
}: {
  setModalState: Dispatch<SetStateAction<boolean>>;
}) => {
  const { client } = useAuth();
  const organisationId = useSelector(selectOrganizationId);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorsToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<setUpSavingsProps>({
    accountType: "individual",
    percentageBased: "",
    amountBased: "",
    accountNumber: "",
    accountName: "",
    purpose: "",
    amount: "",
    userId: "",
    frequency: "",
    startDate: "",
    endDate: "",
    totalexpectedSavings: "",
    collectionDate: "",
  });

  const [totalexpectedSavings, setTotalExpectedSavings] = useState("");
  const [filterAccountNumbers, setFilteredAccountNumbers] = useState<
    customer[] | undefined
  >([]);
  const [errors, setErrors] = useState<Partial<setUpSavingsProps>>({});

  useEffect(() => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays =
      Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1;

    const totalsavings = differenceInDays * Number(formData.amount);
    setTotalExpectedSavings(String(totalsavings));
  }, [formData.amount, formData.startDate, formData.endDate]);
  // const TotalExpectedSavings = () => {

  // };

  const {
    mutate: SetupSavings,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["savingsSetup"],
    mutationFn: async (values) => {
      return client.post(`/api/saving`, {
        purposeName: formData.purpose,
        amount: formData.amount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        organisation: organisationId,
        frequency: formData.frequency,
        users: [formData.userId],
        dailyBased: formData.amountBased,
        individualBased: formData.percentageBased,
        totalexpectedSavings: formData.totalexpectedSavings,
      });
    },
    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true);
      setSuccessMessage(response.data.message);

      setShowModal(true);

      setFormData({
        accountType: "individual",
        percentageBased: "",
        amountBased: "",
        accountNumber: "",
        accountName: "",
        purpose: "",
        amount: "",
        userId: "",
        frequency: "",
        startDate: "",
        endDate: "",
        totalexpectedSavings: "",
        collectionDate: "",
      });
    },
    onError(error: AxiosError<any, any>) {
      // setModalState(false)
      setShowError(true);

      setErrorMessage(
        error.response?.data.message || "Error creating organization",
      );
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      SetupSavings();

      //  setModalState(false)
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (
    data: setUpSavingsProps,
  ): Partial<setUpSavingsProps> => {
    let errors: Partial<setUpSavingsProps> = {};

    // if (!data.percentageBased && !data.amountBased) {
    //   errors.percentageBased =
    //     "Either Percentage Based or Amount Based is required";
    //   errors.amountBased =
    //     "Either Percentage Based or Amount Based is required";
    // }

    if (!data.accountNumber) {
      errors.accountNumber = "Account Number is required";
    }

    if (!data.accountName) {
      errors.accountName = "Account Name is required";
    }

    if (!data.purpose) {
      errors.purpose = "Purpose is required";
    }

    if (!data.amount) {
      errors.amount = "Amount is required";
    }

    if (!data.frequency) {
      errors.frequency = "Frequency is required";
    }

    if (!data.startDate) {
      errors.startDate = "Start Date is required";
    }

    if (!data.endDate) {
      errors.endDate = "End Date is required";
    }
    // if (!data.totalexpectedSavings) {
    //   errors.totalexpectedSavings = 'Total Expected Savings within the duration is expected to be filled';
    // }

    if (!data.collectionDate) {
      errors.collectionDate = "Collection Date is required";
    }

    // Add more validation rules as needed

    return errors;
  };

  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&organisation=${organisationId}&userType=individual`,
          {},
        ) //populate this based onthee org
        .then((response: AxiosResponse<customer[], any>) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // TotalExpectedSavings()
    setFormData({ ...formData, [name]: value });

    if (name === "accountNumber") {
      if (!value) {
        setFilteredAccountNumbers([]);
        setFormData((prevData) => ({ ...prevData, accountName: "" }));
      } else {
        const customer = allCustomers?.filter((customer) =>
          String(customer.accountNumber).includes(String(value)),
        );
        setFilteredAccountNumbers(customer);
        if (customer && customer.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            accountName: `${customer[0].firstName} ${customer[0].lastName}`,
          }));
        } else {
          setFormData((prevData) => ({ ...prevData, accountName: "" }));
        }
      }
    }
  };
  const handleAccountNumberClick = (
    accountNumber: string,
    firstName: string,
    lastName: string,
    userId: string,
  ) => {
    setFormData({
      ...formData,
      accountNumber,
      accountName: `${firstName} ${lastName}`,
      userId,
    });

    setFilteredAccountNumbers([]);
  };

  return (
    <ProtectedRoute requireSavings>
      <div className="">
        {showModal ? (
          <SuccessModal
            title="Savings Set Up"
            successText="Savings set up Successfully"
            setShowModal={setShowModal}
          />
        ) : (
          ""
        )}
        {showError ? (
          <ErrorModal
            title="Savings Set Up Error"
            errorText="Savings set up Failed"
            setShowModal={setShowError}
          />
        ) : (
          ""
        )}

        {/* <div className="mb-4 space-y-2 md:ml-[15%]">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          Settings
        </p>
      </div> */}

        <div className="mt-12 bg-white md:ml-[15%]">
          <div className="flex justify-between">
            <h2 className="p-4 font-bold">SAVING SETUP AND ADMIN FEE</h2>
            <div
              onClick={() => setModalState(false)}
              className="mr-8 cursor-pointer pt-2"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                className="h-[16px] w-[16px] md:h-[32px] md:w-[32px]"
              >
                <path
                  d="M48 16L16 48M16 16L48 48"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className=" pl-12 pt-1">
            <h1 className="mb-2 text-sm font-semibold">
              Admin Fee (Kindly select your most prefered administrative fee)
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="">
                  <input
                    type="radio"
                    name="accountType"
                    value="individual"
                    checked={formData.accountType === "individual"}
                    onChange={handleChange}
                    className="form-radio cursor-pointer"
                  />
                  <span className="ml-4 text-sm font-medium capitalize text-[#7D7D7D]">
                    Individual(percentage-based)
                  </span>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="savings"
                      checked={formData.accountType === "savings"}
                      onChange={handleChange}
                      className="form-radio cursor-pointer "
                    />
                    <span className="ml-4 text-sm font-medium capitalize text-[#7D7D7D]">
                      Savings amount based (daily)
                    </span>
                  </label>
                </div>
              </div>

              {formData.accountType === "individual" && (
                <div className="mb-4 w-[60%]">
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Individual (Percentage Based)
                  </label>
                  <input
                    type="number"
                    name="percentageBased"
                    value={formData.percentageBased}
                    onChange={handleChange}
                    className="block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black "
                    placeholder="input percentage"
                    required
                  />
                  {errors.percentageBased && (
                    <p className="text-red-500">{errors.percentageBased}</p>
                  )}
                </div>
              )}

              {formData.accountType === "savings" && (
                <div className="mb-4 w-[60%]">
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Savings amount based (daily)
                  </label>
                  <input
                    type="number"
                    name="amountBased"
                    value={formData.amount}
                    onChange={handleChange}
                    className="block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black "
                  />
                  {errors.amountBased && (
                    <p className="text-red-500">{errors.amountBased}</p>
                  )}
                </div>
              )}

              <div className="mr-[8%]">
                <p className="mb-2 text-sm font-bold">Savings Settings</p>
                <hr />

                <div className="flex-between mt-4 md:flex">
                  <div className="relative mb-4 md:mr-4 md:w-[50%]">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Enter Customer Account Number
                    </label>
                    <div className="flex items-center rounded-md border">
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="block w-full rounded-md border-none bg-gray-50 p-3 pl-10 pr-3 text-sm text-black dark:bg-gray-700 dark:text-white dark:placeholder-black"
                        placeholder="Search..."
                      />
                      <IoMdSearch className="absolute left-3 h-6 w-6 text-gray-400 dark:text-gray-300" />
                    </div>
                    {filterAccountNumbers?.length !== 0 && (
                      <div className="rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                        {filterAccountNumbers?.map((account, index) => (
                          <p
                            key={index}
                            onClick={() =>
                              handleAccountNumberClick(
                                String(account.accountNumber),
                                account.firstName,
                                account.lastName,
                                account._id,
                              )
                            }
                            className="block cursor-pointer px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                          >
                            {account.accountNumber}
                          </p>
                        ))}
                      </div>
                    )}

                    {errors.accountNumber && (
                      <p className="text-red-500">{errors.accountNumber}</p>
                    )}
                  </div>
                  <div className="mb-4 md:ml-4 md:w-[50%]">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Customer Account Name
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      className="block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black "
                      readOnly // Prevents user from editing this field directly
                    />
                    {filterAccountNumbers?.length !== 0 ? (
                      <div className="rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                        {filterAccountNumbers &&
                          filterAccountNumbers.map((account, index) => (
                            <p
                              onClick={() => console.log(index)}
                              key={index}
                              className={` block cursor-pointer px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue`}
                            >
                              {account.firstName} {account.lastName}
                            </p>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
                    {errors.accountName && (
                      <p className="text-red-500">{errors.accountName}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4 w-full">
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Enter Savings Purpose
                  </label>
                  <input
                    name="purpose"
                    type="text"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="form-select block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black"
                  />

                  {errors.purpose && (
                    <p className="text-red-500">{errors.purpose}</p>
                  )}
                </div>

                <div className="justify-between md:flex">
                  <div className="mb-4 md:mr-4 md:w-[50%]">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Saving Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="form-input block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black"
                    />
                    {errors.amount && (
                      <p className="text-red-500">{errors.amount}</p>
                    )}
                  </div>

                  <div className="mb-4 md:ml-4 md:w-[50%]">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Saving Frequency
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="form-select block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black"
                    >
                      <option value="">Select Frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    {errors.frequency && (
                      <p className="text-red-500">{errors.frequency}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#7D7D7D]">
                    Savings duration(kindly select the range this savings is to
                    last)
                  </h2>
                  <div className="flex-between flex">
                    <div className="mb-4 mr-2 w-[50%] md:mr-4">
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="form-input block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black"
                      />
                      {errors.startDate && (
                        <p className="text-red-500">{errors.startDate}</p>
                      )}
                    </div>

                    <div className="mb-4 ml-2 w-[50%] md:ml-4">
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="form-input block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black"
                      />
                      {errors.endDate && (
                        <p className="text-red-500">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Total Expected Savings within the duration(debit)
                    </label>
                    <input
                      readOnly
                      name="totalexpectedSavings"
                      type="text"
                      value={totalexpectedSavings}
                      // onChange={handleChange}
                      className="form-select block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black"
                    />

                    {/* {errors.totalexpectedSavings && <p className="text-red-500">{errors.totalexpectedSavings}</p>} */}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Collection Date
                  </label>
                  <input
                    type="date"
                    name="collectionDate"
                    value={formData.collectionDate}
                    onChange={handleChange}
                    className="form-input block  w-full rounded-md border bg-gray-50 p-3 text-sm text-black"
                  />
                  {errors.collectionDate && (
                    <p className="text-red-500">{errors.collectionDate}</p>
                  )}
                </div>
              </div>
              <div className="mb-8 flex justify-center md:w-[100%]">
                <button className="w-100 rounded-md bg-ajo_blue px-9 py-5 text-sm text-ajo_offWhite hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// export default function Page(){
//   const [modalState, setModalState] = useState(false);
//   const [modalContent, setModalContent] = useState<"form" | "confirmation">(
//     "form",
//   );
//   const [showSuccessModal, setShowSuccessModal] = useState(false)
//   const [showErrorModal, setShowErrorModal] = useState(false)
//   return(
//     <div className="">
//     <div className="mb-4 space-y-2 ">
//       <p className="text-2xl font-bold text-ajo_offWhite text-opacity-60">
//         Settings
//       </p>
//       <p className="text-sm font-bold text-ajo_offWhite">Savings settings</p>
//     </div>
//     <div className="mx-auto mt-[20%] flex h-screen w-[80%] flex-col items-center gap-8 md:mt-[10%] md:w-[40%]">
//       <Image
//         src="/receive-money.svg"
//         alt="hand with coins in it"
//         width={120}
//         height={120}
//         className="w-[5rem] md:w-[7.5rem]"
//       />
//       <p className="text-center text-sm text-ajo_offWhite">
//         Create a savings group make all the necessary edits and changes. Use
//         the button below to get started!
//       </p>

//       {/* <Link href="/merchant/settings/savings"> */}
//       <CustomButton
//         type="button"
//         label="Savings SetUp"
//         style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
//         onButtonClick={() => setModalState(true)}
//       />
//       {/* </Link> */}
//     </div>
//     {modalState && (
//       <NoBackgroundModal
//         setModalState={setModalState}

//         title={ "Set Up Savings"}
//       >
//         {modalContent === 'confirmation' && showSuccessModal ?
//           <NoBackgroundModal
//           setModalState={setModalState}
//           // setShowParentModal={setModalState}

//           title={ ""}
//         >

//           <SuccessModal
//            setShowParentModal={setModalState}
//           title='Savings Set Up'
//           successText='Savings set up Successfully'
//           setShowModal={setShowSuccessModal}

//           />
//           </NoBackgroundModal>
//           :
//           modalContent === 'confirmation' && showErrorModal ?
//           <ErrorModal
//            setShowParentModal={setModalState}
//             title='Savings Set Up Error'
//             errorText='Savings set up Failed'
//             setShowModal={setShowErrorModal}

//           />
//           : modalContent === "form" ?
//           <SetUpSavingsAndAdminFee
//               setContent={setModalContent}
//               // content={modalContent === "confirmation" ? "confirmation" : "form"}
//               // closeModal={setModalState}
//               setShowErrorModal={setShowErrorModal}
//               setShowSuccessModal={setShowSuccessModal}
//             />
//             : ""
//       }

//       </NoBackgroundModal>
//     )}
//   </div>
//   )
// }

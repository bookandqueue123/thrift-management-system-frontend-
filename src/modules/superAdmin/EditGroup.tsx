import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton } from "@/components/Buttons";
import ErrorModal from "@/components/ErrorModal";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { FormErrors, FormValues, customer } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SetUpSavingsProps {
  organisationGroups: [];
  // setContent: Dispatch<SetStateAction<"form" | "confirmation">>;
  // content: "form" | "confirmation";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setGroupMutated: Dispatch<SetStateAction<boolean>>;
  actionToTake: "create-group" | "edit-group" | "";
  //   setIsGroupCreated: Dispatch<SetStateAction<boolean>>;
  groupToBeEdited: string;
  setGroupEdited: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"confirmation" | "form">>;
  setMutationResponse: Dispatch<SetStateAction<string>>;
}
const EditOrganisationGroup = ({
  setModalContent,
  groupToBeEdited,
  setCloseModal,
  setGroupEdited,
}: SetUpSavingsProps) => {
  const organizationId = useSelector(selectOrganizationId);

  const { client } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [displayConfirmationModal, setDisplayConfirmationMedal] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedNatureOfBusiness, setSelectedNatureOfBusiness] = useState<
    string[]
  >([]);

  const { data: group, isLoading: isLoadingGroup } = useQuery({
    queryKey: ["group"],
    queryFn: async () => {
      return client
        .get(`api/user/${groupToBeEdited}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  const [selectedOptions, setSelectedOptions] = useState(
    group?.organisation ?? [],
  );

  const {
    data: AllOrganisations,
    isLoading: isOrganisationLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganizations"],
    queryFn: async () => {
      return client
        .get(`/api/user/get-url`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  const [selectedService, setSelectedService] = useState(
    group?.selectedService ?? "",
  );
  const [saveDetails, setSaveDetails] = useState({
    groupName: group?.groupName,
    description: group?.description,
    organisations: group?.organisations,
    startDate: "",
    endDate: "",
    collectionDate: "",
    frequency: "",
    industry: "",
    // generalSpace: group?.generalSpace,
    // group:
  });

  useEffect(() => {
    setSaveDetails({
      groupName: group?.groupName,
      description: group?.description,
      organisations: group?.organisations,
      startDate: "",
      endDate: "",
      collectionDate: "",
      frequency: "",
      industry: group?.industry || "",
      // group:
      // generalSpace: group?.generalSpace,
    }),
      setGeneralSpace(group?.generalSpace);
    setSelectedService(group?.selectedService);
    setSelectedOptions(group?.organisations);
  }, [group]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: validateField(
        name,
        value,
        // saveDetails.savingsType as "named group" | "nameless group",
      ),
    });

    const selectedId = value;
    const selectedOption = users?.find((option) => option._id === selectedId);

    if (selectedOption && !selectedOptions.includes(selectedOption._id)) {
      setSelectedOptions([...selectedOptions, selectedOption._id]);
    }
  };
  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions.splice(index, 1);
    setSelectedOptions(updatedOptions);
  };

  const {
    data: users,
    isLoading: isUserLoading,
    isError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=organisation`, {})
        .then((response: AxiosResponse<customer[], any>) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  const selectedIds = selectedOptions?.map(
    (option: { _id: any }) => option?._id,
  );
  // const groupId = selectedIds[0];

  const { mutate: postOrganisationGroups } = useMutation({
    mutationFn: async () => {
      // setCloseModal(false)

      const payload = {
        groupName: saveDetails.groupName,
        description: saveDetails.description,
        organisations: selectedOptions,
        generalSpace: generalSpace,
        selectedService: selectedService,
      };

      return client.put(`api/user/edit-group/${groupToBeEdited}`, payload);
    },
    onSuccess: (response) => {
      // // console.log(response);
      // setSelectedOptions([])

      // // setContent("confirmation");
      // setDisplayConfirmationMedal(true);
      // setGroupEdited(true)
      // setTimeout(() => {
      //   setCloseModal(false)
      // }, 5000)
      setGroupEdited(true);
      setModalContent("confirmation");
      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form");
      }, 1000);
    },
    onError: (error: any) => {
      setErrorMessage(error.response.data.message);
      // setContent("confirmation")
      // setDisplayConfirmationMedal(true)
      setShowErrorModal(true);

      throw error;
    },
  });

  // Input Validation States
  const [showSelectError, setShowSelectError] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(saveDetails);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      // case "groupName":
      //   if (!value.trim()) return "Savings purpose is required";
      //   break;
      // case "description":
      //   if (!value.trim()) return "Description is required";
      //   break;
      case "addCustomers":
        if (selectedIds.length === 0) return "At least one user is required";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLElement>) => {
    // setShowSelectError(true)
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: validateField(
        name,
        value,
        // saveDetails.savingsType as "named group" | "nameless group",
      ),
    });

    // Initialize a variable to hold the processed value (initially, it's the same as the input value)
    let processedValue = value;

    // If the input field is 'description', remove commas and convert it to a number
    // if (name === "description") {
    //   // Remove commas from the value using a regular expression
    //   const unformattedValue = value.replace(/,/g, "");
    //   // Parse the string to a floating point number
    //   processedValue = parseFloat(unformattedValue).toString();
    // }

    // Update the state 'saveDetails' with the new value, keeping previous state intact
    setSaveDetails((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLElement>) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    setIsTouched({ ...isTouched, [name]: true });
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: validateField(
        name,
        value,
        // saveDetails.savingsType as "named group" | "nameless group",
      ),
    });
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    setShowSelectError(true);

    if (selectedIds.length === 0) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        addCustomers: "Please select at least one option",
      }));
    }
    e.preventDefault();

    let isValid = true;
    const newErrors: FormErrors = {};

    Object.keys(formValues).forEach((key) => {
      const error = validateField(
        key,
        formValues[key],

        // saveDetails.savingsType as "named group" | "nameless group",
      );
      if (error) {
        isValid = false;
        newErrors[key] = error;
      }
    });

    setFormErrors((prevErrors) => {
      return newErrors;
    });

    if (isValid) {
      console.log("Form is valid, submitting...");
      postOrganisationGroups();
    } else {
      console.log("Form is invalid, showing errors...");
    }

    // onSubmit("confirmation");
  };

  const { data: allIndustries, isLoading: isLoadingAllIndustry } = useQuery({
    queryKey: ["all Industries"],
    queryFn: async () => {
      return client
        .get(`/api/industry`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
    staleTime: 5000,
  });

  const [selectAll, setSelectAll] = useState(false);
  const [generalSpace, setGeneralSpace] = useState(group?.generalSpace ?? "");
  const [natureOfBusinessOptions, setNatureOfBusinessOptions] = useState([]);
  const [selectedStateArray, setselectedStateArray] = useState<
    { name: string; lgas: string[] }[]
  >([]);

  const handleSelectAllOrganizations = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedOptions(users?.map((user) => user._id));
    } else {
      setSelectedOptions([]);
    }
  };

  const handleIndustryChange = (e: { target: { value: any } }) => {
    const industry = e.target.value;
    console.log(industry);
    setSelectedIndustry(industry);
    const filteredOrganisations = users?.filter(
      (user) => user?.industry === industry,
    );
    // setFilteredUsers(filteredOrganisations);
    const organisationIds = filteredOrganisations?.map(
      (options) => options._id,
    );

    setSelectedOptions(organisationIds);

    // Update Nature of Business options based on selected industry
  };

  useEffect(() => {
    const filteredIndustry = allIndustries?.find(
      (industry: { name: string }) => industry.name === selectedIndustry,
    );
    // const natureOptions = getNatureOfBusinessOptions(industry); // Function to get options

    setNatureOfBusinessOptions(filteredIndustry?.natureOfBusiness);
  }, [allIndustries, selectedIndustry]);

  const handleNatureOfBusinessChange = (e: { target: { value: any } }) => {
    const nature = e.target.value;
    setSelectedNatureOfBusiness(nature);

    const filteredOrganisations = users?.filter(
      (user) =>
        user.natureOfBusiness === nature && user.industry === selectedIndustry,
    );
    // setFilteredUsers(filteredOrganisations);
    const organisationIds = filteredOrganisations?.map(
      (options) => options._id,
    );

    setSelectedOptions(organisationIds);
  };

  const handleStateChange = (e: { target: { value: any } }) => {
    const state = e.target.value;
    // setSelectedState(state);

    const filteredOrganisations = users?.filter((user) => user.state === state);
    // setFilteredUsers(filteredOrganisations);
    const organisationIds = filteredOrganisations?.map(
      (options) => options._id,
    );

    setSelectedOptions(organisationIds);
  };

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setGeneralSpace(e.target.value);
  };
  const handleRadioChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedService(event.target.value);
  };

  return (
    <div>
      {showErrorModal ? (
        <ErrorModal
          setShowModal={setShowErrorModal}
          title="Error Creating Organisation Groups"
          errorText={errorMessage}
        />
      ) : (
        ""
      )}
      {displayConfirmationModal ? (
        <div className="mx-auto mt-[10%] flex h-full w-1/2 flex-col items-center justify-center space-y-8">
          <Image
            src="/check-circle.svg"
            alt="check-circle"
            width={162}
            height={162}
            className="w-[6rem] md:w-[10rem]"
          />
          <p className="whitespace-nowrap text-ajo_offWhite">
            Group Created Successfully
          </p>
          <CustomButton
            type="button"
            label="Close"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[40%]"
            onButtonClick={() => setDisplayConfirmationMedal(false)}
          />
        </div>
      ) : (
        <form
          className="mx-auto mt-12 w-[90%] space-y-3 md:w-[60%]"
          onSubmit={onSubmitHandler}
        >
          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="groupName"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Group Name:
            </label>
            <span className="w-full">
              <input
                value={saveDetails.groupName}
                id="groupName"
                name="groupName"
                type="text"
                placeholder="state reason"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              />
              {(isTouched.groupName || formErrors.groupName) && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {formErrors.groupName}
                </p>
              )}
            </span>
          </div>

          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="description"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Description:
            </label>
            <span className="w-full">
              <input
                value={saveDetails.description}
                id="description"
                name="description"
                placeholder="describe..."
                type="text"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              />
              {(isTouched.description || formErrors.description) && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {formErrors.description}
                </p>
              )}
            </span>
          </div>

          <div className="items-center gap-6  md:flex">
            <label
              htmlFor="addCustomers"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Add Organisation
            </label>

            <div className="w-full">
              <span className="w-full">
                <select
                  id="addCustomers"
                  name="addCustomers"
                  className="bg-right-20 mt-1 w-full cursor-pointer appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                  onChange={handleOptionChange}
                  onFocus={handleInputFocus}
                >
                  <option className="hidden lowercase text-opacity-10">
                    Select an option
                  </option>
                  {users?.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.organisationName}{" "}
                    </option>
                  ))}
                </select>

                {showSelectError && selectedIds.length === 0 && (
                  <p className="mt-2 text-sm font-semibold text-red-600">
                    At least one user is required
                  </p>
                )}
              </span>

              {/* Add All Organizations Checkbox */}
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllOrganizations}
                    checked={selectAll}
                    className="form-checkbox"
                  />
                  <span className="ml-2 text-sm text-white">
                    Add All Organizations
                  </span>
                </label>
              </div>
            </div>
          </div>

          {selectAll && (
            <div className="mt-4 items-center gap-6 md:flex">
              <label
                htmlFor="industry"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                className="mt-1 w-full cursor-pointer rounded-lg bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                onChange={handleIndustryChange}
              >
                <option value="">Select Industry</option>
                {allIndustries?.map(
                  (industry: { _id: string; name: string }) => (
                    <option key={industry._id} value={industry.name}>
                      {industry.name}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}

          {/* Nature of Business Filter */}
          {selectedIndustry && (
            <div className="mt-4 items-center gap-6 md:flex">
              <label
                htmlFor="natureOfBusiness"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                Nature of Business
              </label>
              <select
                id="natureOfBusiness"
                name="natureOfBusiness"
                className="mt-1 w-full cursor-pointer rounded-lg bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                onChange={handleNatureOfBusinessChange}
              >
                <option value="">Select Nature of Business</option>
                {natureOfBusinessOptions &&
                  natureOfBusinessOptions?.map((nature) => (
                    <option key={nature} value={nature}>
                      {nature}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {selectAll && (
            <div className="mt-4 items-center gap-6 md:flex">
              <label
                htmlFor="state"
                className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
              >
                State
              </label>
              <select
                id="state"
                name="state"
                className="mt-1 w-full cursor-pointer rounded-lg bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {selectedStateArray?.map((state: { name: string }) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4 items-center gap-6 md:flex">
            <label
              htmlFor="trueFalseDropdown"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              General Space
            </label>

            <select
              id="trueFalseDropdown"
              name="trueFalseDropdown"
              value={generalSpace}
              onChange={handleChange}
              onFocus={handleInputFocus}
              className="mt-1 w-full cursor-pointer rounded-lg bg-[#F3F4F6] p-3 text-[#7D7D7D]"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="mt-4 space-x-1 space-y-2 md:ml-[20%]">
            {selectedOptions &&
              selectedOptions.map((option: any, index: number) => {
                const options = users?.find(
                  (user) => user._id === String(option),
                );

                return (
                  <div key={index} className="mb-2 mr-2 inline-block">
                    <p className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm">
                      {options?.organisationName}
                      <svg
                        onClick={() => handleRemoveOption(index)}
                        className="ml-1 h-3 w-3 cursor-pointer text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </p>
                  </div>
                );
              })}
          </div>

          <div className="items-center gap-6 md:flex">
            <label
              htmlFor="groupName"
              className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
            >
              Services:
            </label>
            <div className="flex w-full text-white">
              <label>
                <input
                  type="radio"
                  name="options"
                  value="savings"
                  checked={selectedService === "savings"}
                  onChange={handleRadioChange}
                />
                <span className="ml-2">Savings</span>
              </label>
              <br />
              <label className="ml-8">
                <input
                  type="radio"
                  name="options"
                  value="purchaseSales"
                  checked={selectedService === "purchaseSales"}
                  onChange={handleRadioChange}
                />
                <span className="ml-2">Purchase Sales</span>
              </label>
              <br />
              <label className="ml-8">
                <input
                  type="radio"
                  name="options"
                  value="both"
                  checked={selectedService === "both"}
                  onChange={handleRadioChange}
                />
                <span className="ml-2">Both</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-center pb-12 pt-4">
            <span className="hidden w-[20%] md:block"></span>
            <div className="md:flex md:w-[80%] md:justify-center">
              <CustomButton
                type="button"
                label="Submit"
                style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
                onButtonClick={onSubmitHandler}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditOrganisationGroup;

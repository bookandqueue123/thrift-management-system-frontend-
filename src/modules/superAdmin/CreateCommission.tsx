import { useAuth } from "@/api/hooks/useAuth";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";
import { OrganisationGroupsProps, getOrganizationProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const CreateCommissionForm: React.FC = () => {
  const { client } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formValues, setFormValues] = useState({
    organisationType: "groupOfOrganisation",
    group: "",
    organisation: "",
    selectAllOrganisation: false,
    savingsCommission: "",
    purposeCommission: "",
    comment: "",
  });
  const [organizations, setOrganizations] = useState([]);
  const [organizationsGroups, setOrganizationsGroups] = useState([]);

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
      setUpCommssion();
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

  const {
    data: organisations,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganizationsGroup"],
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
      organisations?.filter(
        (organisation: { role: string }) =>
          organisation?.role === "organisation",
      ),
    );
    setOrganizationsGroups(
      organisations?.filter(
        (organisation: { userType: string }) =>
          organisation?.userType === "group",
      ),
    );
  }, [organisations]);

  // const {
  //   data: organizations,
  //   isLoading: isOrganisationLoading,
  //   isError: isOrganisationError,
  // } = useQuery({
  //   queryKey: ["allOrganizations"],
  //   queryFn: async () => {
  //     return client
  //       .get(`/api/user?role=organisation`, {})
  //       .then((response) => {
  //         return response.data;
  //       })
  //       .catch((error) => {
  //         throw error;
  //       });
  //   },
  // });

  const {
    mutate: setUpCommssion,
    isPending: settingUpCommission,
    isError,
  } = useMutation({
    mutationKey: ["Setup Commisson"],
    mutationFn: async () => {
      let payload;
      if (formValues.organisationType === "groupOfOrganisation") {
        payload = {
          commission: formValues.savingsCommission,
          purposeCommission: formValues.purposeCommission,
          group: formValues.group,
        };
      } else if (formValues.organisationType === "all") {
        payload = {
          commission: formValues.savingsCommission,
          purposeCommission: formValues.purposeCommission,
          all: "all",
        };
      } else {
        payload = {
          commission: formValues.savingsCommission,
          purposeCommission: formValues.purposeCommission,
          organisation: formValues.organisation,
        };
      }
      return client.post(`/api/saving/set-commission`, payload);
    },
    onSuccess: (response) => {
      setFormValues({
        organisationType: "groupOfOrganisation",
        group: "",
        organisation: "",
        selectAllOrganisation: false,
        savingsCommission: "",
        purposeCommission: "",
        comment: "",
      });

      setShowSuccessModal(true);
    },
    onError: (error: any) => {
      setFormValues({
        organisationType: "groupOfOrganisation",
        group: "",
        organisation: "",
        selectAllOrganisation: false,
        savingsCommission: "",
        purposeCommission: "",
        comment: "",
      });

      setErrorMessage(error.response.data.message);
      setShowErrorModal(true);
      throw error;
    },
  });

  return (
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
        <div>
          <input
            type="radio"
            name="organisationType"
            value="groupOfOrganisation"
            onChange={handleInputChange}
            checked={formValues.organisationType === "groupOfOrganisation"}
            className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
          />
          <label
            htmlFor="groupOfOrganisation"
            className="ml-2 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
          >
            Group of Organisation
          </label>
          <input
            type="radio"
            name="organisationType"
            value="anOrganisation"
            onChange={handleInputChange}
            checked={formValues.organisationType === "anOrganisation"}
            className="border-1 ml-4 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
          />
          <label
            className="ml-2 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
            htmlFor="anOrganisation"
          >
            An Organisation
          </label>

          <input
            type="radio"
            name="organisationType"
            value="all"
            onChange={handleInputChange}
            checked={formValues.organisationType === "all"}
            className="border-1 ml-4 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
          />
          <label
            className="ml-2 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
            htmlFor="all"
          >
            All
          </label>
        </div>
        {errors.organisationType && (
          <div className="text-red-500">{errors.organisationType}</div>
        )}
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
            {errors.group && <div className="text-red-500">{errors.group}</div>}
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
                name="organisation"
                onChange={handleInputChange}
                className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
              >
                <option value="">Select organisation...</option>
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
  );
};

export default CreateCommissionForm;

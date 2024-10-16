import { useAuth } from "@/api/hooks/useAuth";
import StatesAndLGAs from "@/api/statesAndLGAs.json";
import { CustomButton } from "@/components/Buttons";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { Organisation, StateProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as Yup from "yup";

interface ShowModalProps {
  organisationId: string;
  closeModal: Dispatch<SetStateAction<boolean>>;
}
export const EditOrganisation = ({
  organisationId,
  closeModal,
}: ShowModalProps) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLGAArray, setSelectesLGAArray] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStateArray, setselectedStateArray] = useState<StateProps[]>(
    [],
  );
  const [selectedState, setSelectedState] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedNatureOfBusiness, setSelectedNatureOfBusiness] = useState<
    string[]
  >([]);

  const { client } = useAuth();
  const { data: customerInfo, isLoading: isLoadingCustomerInfo } = useQuery({
    queryKey: ["customerInfo"],
    queryFn: async () => {
      return client
        .get(`/api/user/${organisationId}`)
        .then((response: AxiosResponse<Organisation, any>) => {
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
  });

  const {
    data: organizations,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganizations"],
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

  const {
    mutate: updateUserInfo,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["user update"],
    mutationFn: async (values: Organisation) => {
      const socialMedia = {
        facebook: values.facebook,
        instagram: values.instagram,
        twitter: values.twitter,
        linkedIn: values.linkedIn,
        pintrest: values.pintrest,
      };

      const formData = new FormData();
      formData.append("description", values.description);
      formData.append("organisationName", values.organisationName);

      formData.append("accountNumber", values.accountNumber);

      formData.append("phoneNumber", values.phoneNumber);

      formData.append("email", values.email);

      formData.append("businessEmailAdress", values.businessEmailAdress);

      formData.append("officeAddress1", values.officeAddress1);

      formData.append("officeAddress2", values.officeAddress2);

      formData.append("region", values.region);

      formData.append("tradingName", values.tradingName);

      formData.append("website", values.website);

      formData.append("country", values.country);

      formData.append("state", values.state);
      formData.append("lga", values.lga);
      formData.append("city", values.city);
      formData.append("industry", values.industry);
      formData.append("natureOfBusiness", values.natureOfBusiness);
      formData.append("contactFullName", values.contactFullName);
      formData.append("contactPhoneNumber", values.contactPhoneNumber);
      formData.append("contactEmail", values.contactEmail);
      formData.append("contactDOB", values.contactDOB);

      formData.append("contactRole", values.contactRole);
      formData.append("contactNationality", values.contactNationality);
      formData.append("contactNIN", values.contactNIN);
      formData.append("contactBvn", values.contactBvn);
      formData.append(
        "ContactPercentOwnership",
        values.ContactPercentOwnership,
      );
      formData.append("cacNumber", values.cacNumber);
      for (const [key, value] of Object.entries(socialMedia)) {
        if (value !== undefined && value !== null) {
          formData.append(`socialMedia[${key}]`, value); // Append if value is defined
        }
      }

      if (values.businessLogo) {
        formData.append("businessLogo", values.businessLogo[0]);
      }
      if (values.bankLetterOfRecommendation) {
        formData.append(
          "bankLetterOfRecommendation",
          values.bankLetterOfRecommendation[0],
        );
      }
      if (values.courtAffidavit) {
        formData.append("courtAffidavit", values.courtAffidavit[0]);
      }
      if (values.letterOfRecommendation) {
        formData.append(
          "letterOfRecommendation",
          values.letterOfRecommendation[0],
        );
      }
      if (values.contactPersonID) {
        formData.append("contactPersonID", values.contactPersonID[0]);
      }
      if (values.certOfBusinessName) {
        formData.append("certOfBusinessName", values.certOfBusinessName[0]);
      }
      if (values.formCacBn) {
        formData.append("formCacBn", values.formCacBn[0]);
      }

      return client.put(`/api/user/${organisationId}`, formData);
    },
    onSuccess(response) {
      // router.push("/customer");

      setShowSuccessToast(true);

      // Delay the execution of closeModal(false) by 5 seconds
      setTimeout(() => {
        closeModal(false);
      }, 5000); // 5000 milliseconds = 5 seconds
    },

    onError(error: AxiosError<any, any>) {
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message);
    },
  });
  const MyEffectComponent = ({ formikValues }: { formikValues: any }) => {
    useEffect(() => {
      // This function will run whenever the value of 'formikValues.myField' changes
      setSelectedCountry(formikValues.country);
      setSelectedState(formikValues.state);
      setSelectedIndustry(formikValues.industry);
    }, [formikValues]); // Add 'formikValues.myField' as a dependency

    return null; // Since this is a utility component, it doesn't render anything
  };
  useEffect(() => {
    const filteredStates =
      StatesAndLGAs.find((country) => country.country === selectedCountry)
        ?.states || [];

    setselectedStateArray(filteredStates);
  }, [selectedCountry]);

  useEffect(() => {
    // Find the Country object in the dataset
    const CountryObject = StatesAndLGAs.find(
      (countryData) => countryData.country === selectedCountry,
    );
    if (CountryObject) {
      const stateObject = CountryObject.states.find(
        (state) => state.name === selectedState,
      );
      // If state is found, return its LGAs
      if (stateObject) {
        setSelectesLGAArray(stateObject.lgas);
      } else {
        // If state is not found, return an empty array
      }
    }
  }, [selectedCountry, selectedState]);

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

  useEffect(() => {
    const filteredIndustry = allIndustries?.find(
      (industry: { name: string }) => industry.name === selectedIndustry,
    );

    setSelectedNatureOfBusiness(filteredIndustry?.natureOfBusiness);
    // setselectedStateArray(filteredStates);
  }, [selectedIndustry, allIndustries]);

  return (
    <div className="mx-auto mt-8 w-[100%] overflow-hidden rounded-md p-4  text-white shadow-md">
      <div>
        {customerInfo && (
          <Formik
            initialValues={{
              organisationName: customerInfo?.organisationName,
              accountNumber: customerInfo?.accountNumber,
              phoneNumber: customerInfo?.phoneNumber,
              email: customerInfo?.email,
              businessEmailAdress: customerInfo.businessEmailAdress,
              officeAddress1: customerInfo?.officeAddress1,
              officeAddress2: customerInfo?.officeAddress2,
              country: customerInfo?.country,
              state: customerInfo?.state,
              lga: customerInfo?.lga,
              city: customerInfo?.city,
              region: customerInfo.region,
              tradingName: customerInfo.tradingName,
              website: customerInfo.website,
              description: customerInfo.description,
              industry: customerInfo.industry,
              natureOfBusiness: customerInfo.natureOfBusiness,
              facebook: customerInfo?.socialMedia?.facebook,
              twitter: customerInfo?.socialMedia?.twitter,
              instagram: customerInfo?.socialMedia?.instagram,
              linkedIn: customerInfo?.socialMedia?.linkedIn,
              pintrest: customerInfo.socialMedia?.pintrest,
              contactFullName: customerInfo.contactFullName ?? "",
              contactPhoneNumber: customerInfo.contactPhoneNumber ?? "",
              contactEmail: customerInfo.contactEmail ?? "",
              contactDOB: customerInfo.contactDOB ?? "",
              contactRole: customerInfo.contactRole ?? "",

              contactNationality: customerInfo.contactNationality ?? "",
              contactNIN: customerInfo.contactNIN ?? "",
              contactBvn: customerInfo.contactBvn ?? "",
              ContactPercentOwnership:
                customerInfo.ContactPercentOwnership ?? "",
              cacNumber: customerInfo.cacNumber ?? "",
              businessLogo: customerInfo.businessLogo ?? "",
              bankLetterOfRecommendation:
                customerInfo.bankLetterOfRecommendation ?? "",
              courtAffidavit: customerInfo.courtAffidavit ?? "",
              letterOfRecommendation: customerInfo.letterOfRecommendation ?? "",
              contactPersonID: customerInfo.contactPersonID ?? "",
              certOfBusinessName: customerInfo.certOfBusinessName ?? "",
              formCacBn: customerInfo.formCacBn ?? "",
            }}
            validationSchema={Yup.object({
              organisationName: Yup.string().required("Required"),
              accountNumber: Yup.string().required("Required"),
              phoneNumber: Yup.string().required(),
              email: Yup.string().required("Required"),
              businessEmailAdress: Yup.string().required("Required"),
              officeAddress1: Yup.string().optional(),
              officeAddress2: Yup.string().optional(),
              country: Yup.string().required("Required"),
              state: Yup.string().required("Required"),
              lga: Yup.string().required("Required"),
              city: Yup.string().required("Required"),
              region: Yup.string().required("Required"),
              tradingName: Yup.string().optional(),
              website: Yup.string().required("Required"),

              description: Yup.string().required("Required"),
              industry: Yup.string().optional(),
              natureOfBusiness: Yup.string().optional(),
              facebook: Yup.string().optional(),
              twitter: Yup.string().optional(),
              instagram: Yup.string().optional(),
              linkedIn: Yup.string().optional(),
              pintrest: Yup.string().optional(),

              contactFullName: Yup.string().optional(),
              contactPhoneNumber: Yup.string().optional(),
              contactEmail: Yup.string().optional(),
              contactDOB: Yup.string().optional(),
              contactRole: Yup.string().optional(),
              contactNationality: Yup.string().optional(),
              contactNIN: Yup.string().optional(),
              contactBvn: Yup.string().optional(),
              ContactPercentOwnership: Yup.string().optional(),
              cacNumber: Yup.string().optional(),
            })}
            onSubmit={(values, { setSubmitting }) => {
              updateUserInfo(values);
              setTimeout(() => {
                setShowSuccessToast(false);
                setShowErrorToast(false);
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              isSubmitting,
              values,
              errors,
              handleChange,
              setFieldValue,
            }) => (
              <Form
                encType="multipart/form-data"
                name="IdImage"
                className="mx-auto mt-4 w-[90%] space-y-3 md:w-[80%]"
              >
                <p className="mb-8 mt-2 text-xl font-bold text-white">
                  Edit Organisation Details
                </p>
                <div className="mt-8">
                  <div className="mb-8 ">
                    <div className="items-center gap-6 ">
                      <div className="md:flex">
                        <label
                          htmlFor="organisationName"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                        >
                          Name{" "}
                          <span className="font-base font-semibold text-[#FF0000]">
                            *
                          </span>
                        </label>
                        <div className="w-full">
                          <Field
                            id="organisationName"
                            name="organisationName"
                            type="text"
                            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                          />
                          <ErrorMessage
                            name="organisationName"
                            component="div"
                            className="text-red-700"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 mt-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="description"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            Description{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              id="description"
                              name="description"
                              as="textarea"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-black"
                            />

                            <ErrorMessage
                              name="description"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="my-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="accountNumber                            "
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Account Number{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              id="accountNumber"
                              name="accountNumber"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="accountNumber"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="phoneNumber"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Phone Number{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              id="phoneNumber"
                              name="phoneNumber"
                              type="tel"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="phoneNumber"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="email"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Email address{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>

                          <div className="w-full">
                            <Field
                              id="email"
                              name="email"
                              type="email"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="businessEmailAdress"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Business Email Adress{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              id="businessEmailAdress"
                              name="businessEmailAdress"
                              type="businessEmailAdress"
                              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="businessEmailAdress"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="officeAddress1"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            Office Address1{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>

                          <div className="w-full">
                            <Field
                              id="officeAddress1"
                              name="officeAddress1"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="officeAddress1"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="officeAddress2"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Office Address2{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>

                          <div className="w-full">
                            <Field
                              id="officeAddress2"
                              name="officeAddress2"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="officeAddress2"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="country"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Country
                          </label>
                          <div className="w-full">
                            <Field
                              onChange={handleChange}
                              as="select"
                              isInvalid={!!errors.country}
                              name="country"
                              id="country"
                              // type="text"
                              placeholder="country"
                              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            >
                              <option>Select Country</option>
                              {StatesAndLGAs &&
                                StatesAndLGAs.map((countries) => (
                                  <option
                                    key={countries.country}
                                    value={countries.country}
                                  >
                                    {countries.country}
                                  </option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="country"
                              component="div"
                              className="text-xs text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="state"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            State
                          </label>
                          <div className="w-full">
                            <Field
                              as="select"
                              id="state"
                              name="state"
                              // type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            >
                              <option>Select State</option>

                              {selectedStateArray &&
                                selectedStateArray.map((state) => (
                                  <option key={state.name} value={state.name}>
                                    {state.name}
                                  </option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="state"
                              component="div"
                              className="text-xs text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="lga"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Local Government <br /> Area (lga)
                          </label>
                          <div className="w-full">
                            <Field
                              as="select"
                              id="lga"
                              name="lga"
                              // type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            >
                              <option>Select LGA</option>

                              {selectedLGAArray &&
                                selectedLGAArray.map((lga) => (
                                  <option key={lga} value={lga}>
                                    {lga}
                                  </option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="lga"
                              component="div"
                              className="text-xs text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="city"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            City{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              id="city"
                              name="city"
                              type="city"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="city"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="region"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            region{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              id="region"
                              name="region"
                              type="region"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="region"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="tradingName"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            Trading Name{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              id="tradingName"
                              name="tradingName"
                              type="tradingName"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="tradingName"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="website"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            Website{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              id="website"
                              name="website"
                              type="website"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="website"
                              component="div"
                              className="text-red-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="industry"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            Industry{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              onChange={handleChange}
                              as="select"
                              isInvalid={!!errors.industry}
                              name="industry"
                              id="industry"
                              placeholder="Industry"
                              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            >
                              <option>Select Industry</option>
                              {allIndustries &&
                                allIndustries.map(
                                  (industry: { id: string; name: string }) => (
                                    <option
                                      key={industry.id}
                                      value={industry.name}
                                    >
                                      {industry.name}
                                    </option>
                                  ),
                                )}
                            </Field>
                            <ErrorMessage
                              name="industry"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="tradingName"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%] "
                          >
                            Nature of Business{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="w-full">
                            <Field
                              as="select"
                              id="natureOfBusiness"
                              name="natureOfBusiness"
                              // type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            >
                              <option>Select nature Of Business</option>

                              {selectedNatureOfBusiness &&
                                selectedNatureOfBusiness.map(
                                  (natureOfBusinesses) => (
                                    <option
                                      key={natureOfBusinesses}
                                      value={natureOfBusinesses}
                                    >
                                      {natureOfBusinesses}
                                    </option>
                                  ),
                                )}
                            </Field>{" "}
                            <ErrorMessage
                              name="natureOfBusiness"
                              component="div"
                              className="text-xs   text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="my-6 text-[16px] text-white md:text-[18px]">
                      SOCIALS
                    </p>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="facebook"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Facebook:
                          </label>
                          <div className="w-full">
                            <Field
                              name="facebook"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="facebook"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="twitter"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Twitter:
                          </label>
                          <div className="w-full">
                            <Field
                              name="twitter"
                              type="text"
                              className="mt-1 w-full flex-1 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                            />
                            <ErrorMessage
                              name="twitter"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="instagram"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Instagram:
                          </label>
                          <div className="w-full">
                            <Field
                              name="instagram"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="instagram"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="linkedIn"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            LinkedIn:
                          </label>
                          <div className="w-full">
                            <Field
                              name="linkedIn"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="linkedIn"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="pintrest"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Pinterest:
                          </label>
                          <div className="w-full">
                            <Field
                              name="pintrest"
                              type="text"
                              className="mt-1 w-full flex-1 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                            />
                            <ErrorMessage
                              name="pintrest"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-10 text-[18px] font-semibold text-white sm:text-[25px] md:text-[32px]">
                      Who can we reach?{" "}
                      <span className="text-[13px] text-[gray]">
                        Update this section with your Organisation contact
                        person’s/ business representative details
                      </span>
                    </p>
                    <div className="my-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="contactFullName"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Contact’s Person
                            <br /> Full Name
                          </label>
                          <div className="w-full">
                            <Field
                              name="contactFullName"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="contactFullName"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="contactPhoneNumber"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Contact’s Person <br />
                            Telephone Number
                          </label>
                          <div className="w-full">
                            <Field
                              name="contactPhoneNumber"
                              type="tel"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="contactPhoneNumber"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="contactEmail"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Contact’s Person <br /> Email address
                          </label>
                          <div className="w-full">
                            <Field
                              name="contactEmail"
                              type="email"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="contactEmail"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="contactDOB"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Contact’s Person <br />
                            Date of Birth
                          </label>
                          <div className="w-full">
                            <Field
                              name="contactDOB"
                              type="date"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="contactDOB"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="contactRole"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Contact’s Person Role <br /> in the Organisation
                          </label>
                          <div className="w-full">
                            <Field
                              as="select"
                              id="contactRole"
                              name="contactRole"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            >
                              <option value={"ceo"}>CEO</option>
                              <option value={"analyst"}>Analyst</option>
                              <option value={"manager"}>Manager</option>
                              <option value={"finance officer"}>
                                Finance Officer
                              </option>
                              <option className="invisible"></option>
                            </Field>
                            <ErrorMessage
                              name="contactRole"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="items-center gap-6 ">
                          <div className="md:flex">
                            <label
                              htmlFor="contactNationality"
                              className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                            >
                              Contact’s Person <br /> Nationality
                            </label>
                            <div className="w-full">
                              <Field
                                as="select"
                                id="contactNationality"
                                name="contactNationality"
                                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                              >
                                {StatesAndLGAs &&
                                  StatesAndLGAs.map((countries) => (
                                    <option
                                      key={countries.country}
                                      value={countries.country}
                                    >
                                      {countries.country}
                                    </option>
                                  ))}
                                <option className="invisible"></option>
                              </Field>
                              <ErrorMessage
                                name="contactNationality"
                                component="div"
                                className="text-xs text-red-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="contactNIN"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Contact’s Person <br /> NIN Number
                          </label>
                          <div className="w-full">
                            <Field
                              name="contactNIN"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="contactNIN"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="contactBvn"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Contact’s Person <br /> BVN Number
                          </label>
                          <div className="w-full">
                            <Field
                              name="contactBvn"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="contactBvn"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="cacNumber"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            Business number i.e <br /> CAC number
                          </label>
                          <div className="w-full">
                            <Field
                              name="cacNumber"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="cacNumber"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="items-center gap-6 ">
                        <div className="md:flex">
                          <label
                            htmlFor="ContactPercentOwnership"
                            className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                          >
                            What percentage of <br /> “YOUR ORGANISATION” <br />
                            does this person have?
                          </label>
                          <div className="w-full">
                            <Field
                              name="ContactPercentOwnership"
                              type="text"
                              className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-black"
                            />
                            <ErrorMessage
                              name="ContactPercentOwnership"
                              component="div"
                              className="text-xs text-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="mb-4">
                        <label
                          htmlFor="businessLogo"
                          className="mb-8 text-xs font-medium text-white"
                        >
                          Business Logo (max-size - 5MB)
                        </label>

                        {values.businessLogo ? (
                          typeof values.businessLogo === "string" ? (
                            // If businessLogo is a Cloudinary URL, display the image from the URL
                            <Image
                              src={values.businessLogo}
                              alt="Business Logo"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          ) : (
                            // If businessLogo is a file, display the uploaded image
                            <Image
                              src={URL.createObjectURL(values.businessLogo[0])} // Display the local file image
                              alt="Business Logo"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          )
                        ) : (
                          <div>No business logo available</div>
                        )}
                      </div>

                      <div className="mt-8">
                        <label
                          htmlFor="businessLogo"
                          className="cursor-pointer rounded-md bg-[#221C3E] px-4 py-2 text-white hover:bg-gray-400"
                        >
                          Change
                          <input
                            id="businessLogo"
                            name="businessLogo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files;
                              setFieldValue("businessLogo", file); // Store the selected file in Formik state
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="mb-4">
                        <label
                          htmlFor="bankLetterOfRecommendation"
                          className="mb-8 text-xs font-medium text-white"
                        >
                          Bank Letter Of Recommendation
                        </label>

                        {values.bankLetterOfRecommendation ? (
                          typeof values.bankLetterOfRecommendation ===
                          "string" ? (
                            // If bankLetterOfRecommendation is a Cloudinary URL, display the image from the URL
                            <Image
                              src={values.bankLetterOfRecommendation}
                              alt="Bank letter of recommendation"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          ) : (
                            // If bankLetterOfRecommendation is a file, display the uploaded image
                            <Image
                              src={URL.createObjectURL(
                                values.bankLetterOfRecommendation[0],
                              )} // Display the local file image
                              alt="Business Logo"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          )
                        ) : (
                          <div>No Bank Letter Of Recommendation available</div>
                        )}
                      </div>

                      <div className="mt-8">
                        <label
                          htmlFor="bankLetterOfRecommendation"
                          className="cursor-pointer rounded-md bg-[#221C3E] px-4 py-2 text-white hover:bg-gray-400"
                        >
                          Change
                          <input
                            id="bankLetterOfRecommendation"
                            name="bankLetterOfRecommendation"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files;
                              setFieldValue("bankLetterOfRecommendation", file); // Store the selected file in Formik state
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="mb-4">
                        <label
                          htmlFor="courtAffidavit"
                          className="mb-8 text-xs font-medium text-white"
                        >
                          Court Affidavit (max-size - 5MB)
                        </label>

                        {values.courtAffidavit ? (
                          typeof values.courtAffidavit === "string" ? (
                            // If courtAffidavit is a Cloudinary URL, display the image from the URL
                            <Image
                              src={values.courtAffidavit}
                              alt="Bank letter of recommendation"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          ) : (
                            // If courtAffidavit is a file, display the uploaded image
                            <Image
                              src={URL.createObjectURL(
                                values.courtAffidavit[0],
                              )} // Display the local file image
                              alt="court Affidavit"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          )
                        ) : (
                          <div>No Bank Letter Of Recommendation available</div>
                        )}
                      </div>

                      <div className="mt-8">
                        <label
                          htmlFor="courtAffidavit"
                          className="cursor-pointer rounded-md bg-[#221C3E] px-4 py-2 text-white hover:bg-gray-400"
                        >
                          Change
                          <input
                            id="courtAffidavit"
                            name="courtAffidavit"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files;
                              setFieldValue("courtAffidavit", file); // Store the selected file in Formik state
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="mb-4">
                        <label
                          htmlFor="letterOfRecommendation"
                          className="mb-8 text-xs font-medium text-white"
                        >
                          Letter Of Recommendation (max-size - 5MB)
                        </label>

                        {values.letterOfRecommendation ? (
                          typeof values.letterOfRecommendation === "string" ? (
                            // If letterOfRecommendation is a Cloudinary URL, display the image from the URL
                            <Image
                              src={values.letterOfRecommendation}
                              alt="letter of recommendation"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          ) : (
                            // If letterOfRecommendation is a file, display the uploaded image
                            <Image
                              src={URL.createObjectURL(
                                values.letterOfRecommendation[0],
                              )} // Display the local file image
                              alt="court Affidavit"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          )
                        ) : (
                          <div>No Letter Of Recommendation available</div>
                        )}
                      </div>

                      <div className="mt-8">
                        <label
                          htmlFor="letterOfRecommendation"
                          className="cursor-pointer rounded-md bg-[#221C3E] px-4 py-2 text-white hover:bg-gray-400"
                        >
                          Change
                          <input
                            id="letterOfRecommendation"
                            name="letterOfRecommendation"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files;
                              setFieldValue("letterOfRecommendation", file); // Store the selected file in Formik state
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="mb-4">
                        <label
                          htmlFor="contactPersonID"
                          className="mb-8 text-xs font-medium text-white"
                        >
                          Contact Person Id (max-size - 5MB)
                        </label>

                        {values.contactPersonID ? (
                          typeof values.contactPersonID === "string" ? (
                            // If contactPersonID is a Cloudinary URL, display the image from the URL
                            <Image
                              src={values.contactPersonID}
                              alt="Contact Person ID"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          ) : (
                            // If contactPersonID is a file, display the uploaded image
                            <Image
                              src={URL.createObjectURL(
                                values.contactPersonID[0],
                              )} // Display the local file image
                              alt="contact person Id"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          )
                        ) : (
                          <div>No Contact person Id available</div>
                        )}
                      </div>

                      <div className="mt-8">
                        <label
                          htmlFor="contactPersonID"
                          className="cursor-pointer rounded-md bg-[#221C3E] px-4 py-2 text-white hover:bg-gray-400"
                        >
                          Change
                          <input
                            id="contactPersonID"
                            name="contactPersonID"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files;
                              setFieldValue("contactPersonID", file); // Store the selected file in Formik state
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="mb-4">
                        <label
                          htmlFor="certOfBusinessName"
                          className="mb-8 text-xs font-medium text-white"
                        >
                          Cert Of Business Name (max-size - 5MB)
                        </label>

                        {values.certOfBusinessName ? (
                          typeof values.certOfBusinessName === "string" ? (
                            // If certOfBusinessName is a Cloudinary URL, display the image from the URL
                            <Image
                              src={values.certOfBusinessName}
                              alt="cert Of BusinessName"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          ) : (
                            // If certOfBusinessName is a file, display the uploaded image
                            <Image
                              src={URL.createObjectURL(
                                values.certOfBusinessName[0],
                              )} // Display the local file image
                              alt="court Affidavit"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          )
                        ) : (
                          <div>No Court Affidavit available</div>
                        )}
                      </div>

                      <div className="mt-8">
                        <label
                          htmlFor="certOfBusinessName"
                          className="cursor-pointer rounded-md bg-[#221C3E] px-4 py-2 text-white hover:bg-gray-400"
                        >
                          Change
                          <input
                            id="certOfBusinessName"
                            name="certOfBusinessName"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files;
                              setFieldValue("certOfBusinessName", file); // Store the selected file in Formik state
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="mb-4">
                        <label
                          htmlFor="formCacBn"
                          className="mb-8 text-xs font-medium text-white"
                        >
                          CAC form (max-size - 5MB)
                        </label>

                        {values.formCacBn ? (
                          typeof values.formCacBn === "string" ? (
                            // If formCacBn is a Cloudinary URL, display the image from the URL
                            <Image
                              src={values.formCacBn}
                              alt="CAC form"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          ) : (
                            // If formCacBn is a file, display the uploaded image
                            <Image
                              src={URL.createObjectURL(values.formCacBn[0])} // Display the local file image
                              alt="CAC FORM"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          )
                        ) : (
                          <div>No CAC form available</div>
                        )}
                      </div>

                      <div className="mt-8">
                        <label
                          htmlFor="formCacBn"
                          className="cursor-pointer rounded-md bg-[#221C3E] px-4 py-2 text-white hover:bg-gray-400"
                        >
                          Change
                          <input
                            id="formCacBn"
                            name="formCacBn"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files;
                              setFieldValue("formCacBn", file); // Store the selected file in Formik state
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}

                  <div className="flex justify-center">
                    <CustomButton
                      type="submit"
                      style="w-96  rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
                      label={
                        isSubmitting ? "Saving Changes..." : "Save Changes"
                      }
                    />
                  </div>

                  {/* Toast Messages */}
                  {showSuccessToast && (
                    <SuccessToaster
                      message={successMessage || "User Updated successfully!"}
                    />
                  )}
                  {showErrorToast && (
                    <ErrorToaster
                      message={errorMessage || "Error Updating User"}
                    />
                  )}
                  <MyEffectComponent formikValues={values} />
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

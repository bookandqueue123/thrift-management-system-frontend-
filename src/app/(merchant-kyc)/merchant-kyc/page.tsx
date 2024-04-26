"use client";
import { useAuth } from "@/api/hooks/useAuth";
import StatesAndLGAs from "@/api/statesAndLGAs.json";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { StateProps, UpdateMerchantKycProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

type kycSections = "profile" | "contact" | "address" | "verify";

const Kyc = () => {
  const userId = useSelector(selectUser);

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { client } = useAuth();
  const router = useRouter();

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStateArray, setselectedStateArray] = useState<StateProps[]>(
    [],
  );
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const organizationId = useSelector(selectOrganizationId);
  const [selectedLGAArray, setSelectesLGAArray] = useState<string[]>([]);

  const MyEffectComponent = ({ formikValues }: { formikValues: any }) => {
    useEffect(() => {
      setSelectedCountry(formikValues.country);
      setSelectedState(formikValues.state);
    }, [formikValues]);

    return null;
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
  function getLGAsByState(stateName: string) {
    // Find the Country object in the dataset
    const CountryObject = StatesAndLGAs.find(
      (countryData) => countryData.country === selectedCountry,
    );

    // If Country object is found, find the state by its name
    if (CountryObject) {
      const stateObject = CountryObject.states.find(
        (state) => state.name === stateName,
      );
      // If state is found, return its LGAs
      if (stateObject) {
        setSelectesLGAArray(stateObject.lgas);
      } else {
        return [];
      }
    } else {
      return null;
    }
  }

  const {
    mutate: kycUpdate,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["merchant kyc"],
    mutationFn: async (values: UpdateMerchantKycProps) => {
      const formData = new FormData();
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("lga", values.lga);
      formData.append("officeAddress", values.officeAddress);
      formData.append("region", values.region);
      formData.append("organisationName", values.organisationName);
      formData.append("prefferedUrl", values.prefferedUrl);
      formData.append("email", values.email);
      formData.append("description", values.description);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("facebook", values.facebook);
      formData.append("instagram", values.instagram);
      formData.append("linkedIn", values.linkedIn);
      formData.append("twitter", values.twitter);
      formData.append("pintrest", values.pintrest);

      if (values.organisationLogo) {
        formData.append("organisationLogo", values.organisationLogo[0]);
      }
      return client.put(`/api/user/${userId}`, formData);
    },

    onSuccess(response) {
      router.push("/success");
      setShowSuccessToast(true);
      setSuccessMessage((response as any).response.data.message);
    },

    onError(error: AxiosError<any, any>) {
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message);
    },
  });

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      return client
        .get(`/api/user/${userId}`, {})
        .then((response) => {
          // initialValues = {...initialValues, prefferedUrl: userData?.prefferedUrl }

          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  let initialValues: UpdateMerchantKycProps = {
    country: "",
    state: "",
    lga: "",
    region: "",
    phoneNumber: userData?.phoneNumber || "",
    officeAddress: "",
    organisationLogo: null,
    tradingName: "",
    organisationName: userData?.organisationName || "",
    description: "",
    prefferedUrl: userData?.prefferedUrl || "",
    email: userData?.email || "",
    facebook: "",
    instagram: "",
    linkedIn: "",
    twitter: "",
    pintrest: "",
    BankRecommendation: null,
    CourtAffidavit: null,
    CommunityRecommendation: null,
  };

  const [allSections, setAllSections] = useState({
    profile: true,
    contact: false,
    address: false,
    verify: false,
  });

  const handleSectionComplete = (section: kycSections) => {
    setAllSections((prev) => ({ ...prev, [section]: true }));
  };

  const [activeSection, SetActiveSection] = useState<kycSections>("profile");

  const getTextColor = (section: kycSections) => {
    return allSections[section] ? "text-ajo_orange" : "text-[#d2d2d2]";
  };
  const getBorderColor = (section: kycSections) => {
    return allSections[section] ? "border-ajo_orange" : "border-[#7D7D7D]";
  };
  const getBgColor = (section: kycSections) => {
    return allSections[section] ? "bg-white" : "bg-[rgba(255,255,255,0.1)]";
  };

  return (
    <div className="px-6 pb-10 md:px-[5%]">
      {/* Heading Starts */}
      <div className=" mx-auto mb-12 mt-4 flex items-center gap-x-2 md:w-[60%]">
        <ProgressIndicator
          index="1"
          label="Profile"
          textColor={getTextColor("profile")}
          bgColor={getBgColor("profile")}
        />
        <span
          className={`flex-grow border-t-[1px] border-dashed ${getBorderColor("contact")} relative -top-[12px]`}
        ></span>
        <ProgressIndicator
          index="2"
          label="Contact"
          textColor={getTextColor("contact")}
          bgColor={getBgColor("contact")}
        />
        <span
          className={`flex-grow border-t-[1px] border-dashed ${getBorderColor("address")} relative -top-[12px]`}
        ></span>
        <ProgressIndicator
          index="3"
          label="Address"
          textColor={getTextColor("address")}
          bgColor={getBgColor("address")}
        />
        <span
          className={`flex-grow border-t-[1px] border-dashed ${getBorderColor("verify")} relative -top-[12px]`}
        ></span>
        <ProgressIndicator
          index="4"
          label="Verify"
          textColor={getTextColor("verify")}
          bgColor={getBgColor("verify")}
        />
      </div>
      {/* Heading Ends */}

      {/* Form Starts */}
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={Yup.object({
          country: Yup.string().required("Required"),
          state: Yup.string().required("Required"),
          lga: Yup.string().required("Required"),
          region: Yup.string().required("Required"),
          officeAddress: Yup.string().required("Required"),
          organisationLogo: Yup.mixed().required("Required"),
          description: Yup.string().required("Required"),
          phoneNumber: Yup.string().required("Required"),
          organisationName: Yup.string().required("Required"),
          tradingName: Yup.string().optional(),
          websiteUrl: Yup.string().optional(),
          BankRecommendation: Yup.mixed().required("Required"),
          CourtAffidavit: Yup.mixed().required("Required"),
          CommunityRecommendation: Yup.mixed().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            kycUpdate(values);
            console.log("bankRecommendation", values.BankRecommendation);

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
          <form className="mt-8" onSubmit={handleSubmit}>
            {activeSection === "profile" && (
              <div className="mb-8">
                <p className=" text-[18px] font-semibold text-white sm:text-[25px] md:text-[32px]">
                  Tell us more about your business
                </p>

                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="organisationName"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Is your legal business name correct?
                    </label>
                    <Field
                      name="organisationName"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="organisationName"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="tradingName"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Trading Name
                    </label>
                    <Field
                      name="tradingName"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="tradingName"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="description"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Business Description
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
                <div className="">
                  <label
                    htmlFor="websiteUrl"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Website
                  </label>
                  <Field
                    name="websiteUrl"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                  />
                  <ErrorMessage
                    name="prefferedUrl"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="organisationLogo"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Business Logo
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="organisationLogo"
                      id="organisationLogo"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("organisationLogo", e.target.files)
                      }
                      accept="image/*"
                    />
                    <label
                      htmlFor="organisationLogo"
                      className="cursor-pointer"
                    >
                      <p className="text-center text-[gray]">
                        Drag n drop an image here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.organisationLogo && values.organisationLogo[0] && (
                    <Image
                      src={URL.createObjectURL(values.organisationLogo[0])}
                      alt="AJO"
                      className="mt-4 max-w-full rounded-md"
                      style={{ maxWidth: "100%" }}
                      width={100}
                      height={100}
                    />
                  )}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="organisationLogo" />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="BankRecommendation"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Letter of recommendation (Bank)
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="BankRecommendation"
                      id="BankRecommendation"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("BankRecommendation", e.target.files)
                      }
                      accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .jpg,.png"
                    />
                    <label
                      htmlFor="BankRecommendation"
                      className="cursor-pointer"
                    >
                      <p className="text-center text-[gray]">
                        Drag n drop an{" "}
                        <span className="font-semibold">
                          .pdf, .docx, .jpg, .png
                        </span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.BankRecommendation &&
                    values.BankRecommendation[0] && (
                      <iframe
                        src={URL.createObjectURL(values.BankRecommendation[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Bank Recommendation Letter"
                      ></iframe>
                    )}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="organisationLogo" />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="organisationLogo"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Court Affidavit
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="organisationLogo"
                      id="organisationLogo"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("organisationLogo", e.target.files)
                      }
                      accept="image/*"
                    />
                    <label
                      htmlFor="organisationLogo"
                      className="cursor-pointer"
                    >
                      <p className="text-center text-[gray]">
                        Drag n drop an{" "}
                        <span className="font-semibold">
                          .pdf, .docx, .jpg, .png
                        </span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.organisationLogo && values.organisationLogo[0] && (
                    <Image
                      src={URL.createObjectURL(values.organisationLogo[0])}
                      alt="AJO"
                      className="mt-4 max-w-full rounded-md"
                      style={{ maxWidth: "100%" }}
                      width={100}
                      height={100}
                    />
                  )}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="organisationLogo" />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="organisationLogo"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Letter of recommendation (Community / Religious Leader)
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="organisationLogo"
                      id="organisationLogo"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("organisationLogo", e.target.files)
                      }
                      accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*"
                    />
                    <label
                      htmlFor="organisationLogo"
                      className="cursor-pointer"
                    >
                      <p className="text-center text-[gray]">
                        Drag n drop an{" "}
                        <span className="font-semibold">
                          .pdf, .docx, .jpg, .png
                        </span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.organisationLogo && values.organisationLogo[0] && (
                    <Image
                      src={URL.createObjectURL(values.organisationLogo[0])}
                      alt="AJO"
                      className="mt-4 max-w-full rounded-md"
                      style={{ maxWidth: "100%" }}
                      width={100}
                      height={100}
                    />
                  )}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="organisationLogo" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "contact" && (
              <div className="mb-8">
                <p className=" text-[18px] font-semibold text-white sm:text-[25px] md:text-[32px]">
                  How do we reach you?{" "}
                  <span className="text-[13px] text-[gray]">
                    Update this section with your contact details
                  </span>
                </p>

                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="email"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Business Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="phoneNumber"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Telephone number
                    </label>
                    <Field
                      name="phoneNumber"
                      type="tel"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
                <p className="my-6 text-[16px] text-white md:text-[18px]">
                  SOCIALS
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor="facebook"
                      className="m-0 w-[20%] text-[14px] font-medium text-white"
                    >
                      Facebook:
                    </label>
                    <Field
                      name="facebook"
                      type="text"
                      className="mt-1 w-full flex-1 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="facebook"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor="twitter"
                      className="m-0 w-[20%] text-[14px] font-medium text-white"
                    >
                      Twitter:
                    </label>
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
                  </div>{" "}
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor="instagram"
                      className="m-0 w-[20%] text-[14px] font-medium text-white"
                    >
                      Instagram:
                    </label>
                    <Field
                      name="instagram"
                      type="text"
                      className="mt-1 w-full flex-1 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="instagram"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>{" "}
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor="linkedIn"
                      className="m-0 w-[20%] text-[14px] font-medium text-white"
                    >
                      LinkedIn:
                    </label>
                    <Field
                      name="linkedIn"
                      type="text"
                      className="mt-1 w-full flex-1 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="linkedIn"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>{" "}
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor="pintrest"
                      className="m-0 w-[20%] text-[14px] font-medium text-white"
                    >
                      Pintrest:
                    </label>
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
            )}

            {activeSection === "address" && (
              <div className="mb-8">
                <p className=" text-[18px] font-semibold text-white sm:text-[25px] md:text-[32px]">
                  How do we find you?{" "}
                  <span className="text-[13px] text-[gray]">
                    Update this section with your address details
                  </span>
                </p>

                <div className="mb-4">
                  <label
                    htmlFor="address1"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Office Address 1
                  </label>
                  <Field
                    name="address1"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                  />
                  <ErrorMessage
                    name="address1"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="address2"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Address 2 (Optional)
                  </label>
                  <Field
                    name="address2"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                  />
                </div>
                <div className="flex gap-x-4">
                  <div className="mb-4 flex-1">
                    <label
                      htmlFor="country"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Country
                    </label>
                    <Field
                      as="select"
                      id="country"
                      name="country"
                      className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-dropdown-icon bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D]"
                    >
                      <option className="invisible"></option>

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
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-4 flex-1">
                    <label
                      htmlFor="state"
                      className="m-0 text-xs font-medium text-white"
                    >
                      State
                    </label>
                    <Field
                      as="select"
                      id="state"
                      name="state"
                      className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-dropdown-icon bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D]"
                    >
                      <option className="invisible"></option>

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
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
                <div className="flex gap-x-4">
                  <div className="mb-4 flex-1">
                    <label
                      htmlFor="lga"
                      className="m-0 text-xs font-medium text-white "
                    >
                      Local Government Area
                    </label>
                    <Field
                      as="select"
                      id="lga"
                      name="lga"
                      className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-dropdown-icon bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D]"
                    >
                      <option className="invisible"></option>

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
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-3 flex-1">
                    <label
                      htmlFor="city"
                      className="m-0 text-xs font-medium text-white"
                    >
                      City/Town
                    </label>
                    <Field
                      name="city"
                      type="text"
                      className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-dropdown-icon bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "verify" && (
              <div className="mb-8">
                <p className=" text-[18px] font-semibold text-white sm:text-[25px] md:text-[32px]">
                  Verify Your Details?{" "}
                  <span className="text-[13px] text-[gray]">
                    Are the information below correct?
                  </span>
                </p>

                <section className="mt-8 rounded-lg bg-[rgba(255,255,255,0.1)] p-4">
                  <span className="mb-4 block">
                    <p className="mb-1 text-sm text-ajo_offWhite">
                      Business Name:
                    </p>
                    <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 capitalize text-ajo_darkBlue">
                      raoatech technologies
                    </div>
                  </span>

                  <span className="block">
                    <p className="mb-1 text-sm text-ajo_offWhite">
                      Business Description:
                    </p>
                    <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 capitalize text-ajo_darkBlue">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Ut et massa mi. Aliquam in hendrerit urna. Pellentesque
                      sit amet sapien fringilla, mattis ligula consectetur,
                      ultrices mauris. Maecenas vitae mattis tellus. Nullam quis
                      imperdiet augue. Vestibulum auctor ornare leo, non
                      suscipit magna interdum eu. Curabitur pellentesque nibh
                      nibh, at maximus ante fermentum sit amet. Pellentesque
                      commodo lacus at sodales sodales.
                    </div>
                  </span>

                  <div className="my-12">
                    <span className="mb-2 block">
                      <p className="mb-1 text-sm text-ajo_offWhite">Website:</p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 capitalize text-ajo_darkBlue">
                        raoatechtechnologies.com
                      </div>
                    </span>
                    <span className="mb-2 block">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Email Address:
                      </p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 capitalize text-ajo_darkBlue">
                        raoatech@gmail.com
                      </div>
                    </span>
                    <span className="mb-2 block">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Telephone number:
                      </p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 capitalize text-ajo_darkBlue">
                        +234 818203 8095
                      </div>
                    </span>
                  </div>

                  <div className="my-12 flex flex-wrap gap-x-4">
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Facebook:
                      </p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 text-ajo_darkBlue">
                        www.facebook.com
                      </div>
                    </span>
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Instagram:
                      </p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 text-ajo_darkBlue">
                        www.instagram.com
                      </div>
                    </span>
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">Twitter:</p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 text-ajo_darkBlue">
                        www.twitter.com
                      </div>
                    </span>
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Linkedin:
                      </p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 text-ajo_darkBlue">
                        www.linkedin.com
                      </div>
                    </span>
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Pinterest:
                      </p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 text-ajo_darkBlue">
                        www.pinterest.com
                      </div>
                    </span>
                  </div>

                  <div>
                    <span className="mb-2 block">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Office Address:
                      </p>
                      <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 capitalize text-ajo_darkBlue">
                        12, Alajo Shomolu Street, Agbado, Ijaiye, Lagos State.
                      </div>
                    </span>
                    <div className="flex flex-wrap gap-x-4">
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Country:
                        </p>
                        <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 capitalize text-ajo_darkBlue">
                          Nigeria
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">State:</p>
                        <div className="rounded-md bg-ajo_offWhite bg-opacity-75 px-4 py-2 capitalize text-ajo_darkBlue">
                          Lagos State
                        </div>
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4">
              <span className="flex w-[50%] justify-end pe-[10%] md:w-[70%]">
                <button
                  type="button"
                  className=" text-ajo_offWhite hover:text-ajo_orange"
                  onClick={() => {
                    if (activeSection === "verify" && allSections.verify) {
                      SetActiveSection("address");
                      setAllSections((prev) => ({
                        ...prev,
                        ["verify"]: false,
                      }));
                    } else if (
                      activeSection === "address" &&
                      allSections.address
                    ) {
                      SetActiveSection("contact");
                      setAllSections((prev) => ({
                        ...prev,
                        ["address"]: false,
                      }));
                    } else if (
                      activeSection === "contact" &&
                      allSections.contact
                    ) {
                      SetActiveSection("profile");
                      setAllSections((prev) => ({
                        ...prev,
                        ["contact"]: false,
                      }));
                    } else {
                      router.push("/welcome");
                    }
                  }}
                >
                  Go Back
                </button>
              </span>
              <button
                type={allSections.verify ? "submit" : "button"}
                className="w-full  flex-1 rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
                onClick={() => {
                  if (!allSections.verify && activeSection !== "verify") {
                    if (allSections.profile && activeSection === "profile") {
                      handleSectionComplete("contact");
                      SetActiveSection("contact");
                    } else if (
                      allSections.contact &&
                      activeSection === "contact"
                    ) {
                      handleSectionComplete("address");
                      SetActiveSection("address");
                    } else if (
                      allSections.address &&
                      activeSection === "address"
                    ) {
                      handleSectionComplete("verify");
                      SetActiveSection("verify");
                    }
                  } else {
                    submitForm();
                  }
                }}
                disabled={isSubmitting}
              >
                {allSections.verify && activeSection === "verify"
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
            {/* <SuccessToaster message="hey" /> */}
            {showSuccessToast && (
              <SuccessToaster message={"Profile completed successfull!"} />
            )}
            {showErrorToast && errorMessage && errorMessage && (
              <ErrorToaster
                message={
                  errorMessage ? errorMessage : "Error completing profile"
                }
              />
            )}
            <MyEffectComponent formikValues={values} />
          </form>
        )}
      </Formik>
    </div>
  );
};

function KYCFallBack() {
  return <>Loading...</>;
}

export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <div>
      <Suspense fallback={<KYCFallBack />}>
        <Kyc />
      </Suspense>
    </div>
  );
}

const ProgressIndicator = ({
  textColor,
  bgColor,
  index,
  label,
}: {
  textColor: string;
  bgColor: string;
  index: string;
  label: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`mb-1 flex h-8 w-8 flex-col items-center justify-center rounded-full ${bgColor}`}
      >
        <p className={`${textColor}`}>{index}</p>
      </div>
      <p className={`text-center text-sm font-semibold ${textColor}`}>
        {label}
      </p>
    </div>
  );
};

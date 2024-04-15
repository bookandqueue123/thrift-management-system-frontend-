"use client";
import { useAuth } from "@/api/hooks/useAuth";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import {
  CountryAndStateProps,
  StateProps,
  UpdateMerchantKycProps,
  getOrganizationProps,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StatesAndLGAs from "@/api/statesAndLGAs.json";
import * as Yup from "yup";

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

  const [kycSection, setKycSection] = useState<
    "profile" | "contact" | "address" | "verify"
  >("profile");

  const [filledSection, setFilledSection] = useState<string[]>([]);

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
        console.log(stateObject.lgas);
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
        console.log(stateObject.lgas);
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
          console.log(error);
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
  };

  const handleSectionComplete = () => {
    switch (kycSection) {
      case "profile":
        setKycSection("contact");
        break;
      case "contact":
        setKycSection("address");
        break;
      case "address":
        setKycSection("verify");
        break;
      default:
        break;
    }
  };

  const getIndicatorColor = (previousSection: string) => {
    const color = {
      borderColor: "border-ajo_orange",
      bgColor: "bg-ajo_orange",
      textColor: "text-ajo_orange",
    };
    return filledSection.includes(previousSection)
      ? color
      : {
          borderColor: "border-ajo_offWhite",
          bgColor: "bg-ajo_offWhite",
          textColor: "text-ajo_offWhite",
        };
  };
  const prevSection =
    kycSection === "contact"
      ? "profile"
      : kycSection === "address"
        ? "contact"
        : "address";
  const { borderColor, bgColor, textColor } = getIndicatorColor(prevSection);
  return (
    <div className="px-6 pb-10 md:px-12">
      <div className=" w-[100%] ">
        <div className=" flex items-center gap-x-2">
          <div
            id="kyc1"
            className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
          >
            <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
          </div>

          <span
            className={`teal-500 flex-grow border-t-[1px] border-dashed ${borderColor}`}
          ></span>
          <div
            id="kyc2"
            className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
          >
            <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
          </div>
          <span
            className={`flex-grow border-t-[1px] border-dashed ${borderColor}`}
          ></span>
          <div
            id="kyc3"
            className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
          >
            <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
          </div>
          <span
            className={`teal-500 flex-grow border-t-[1px] border-dashed ${borderColor}`}
          ></span>
          <div
            id="kyc4"
            className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
          >
            <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="kyc1"
            className={`text-center text-xs font-semibold ${textColor}`}
          >
            Profile
          </label>

          <label
            htmlFor="kyc2"
            className={`text-center text-xs font-semibold ${textColor}`}
          >
            Contact
          </label>
          <label
            htmlFor="kyc3"
            className={`text-center text-xs font-semibold ${textColor}`}
          >
            Address
          </label>

          <label
            htmlFor="kyc4"
            className={`text-center text-xs font-semibold ${textColor}`}
          >
            Verify
          </label>
        </div>
      </div>
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
          prefferedUrl: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            kycUpdate(values);
            console.log(values);
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
        }) => (
          <form
            className="mt-8"
            onSubmit={handleSubmit}
            // encType="multipart/form-data"
            // name="image"
          >
            {kycSection === "profile" && (
              <>
                {/* Personal Details Fields */}
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
                      htmlFor="prefferedUrl"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Website
                    </label>
                    <Field
                      name="prefferedUrl"
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
                      {values.organisationLogo &&
                        values.organisationLogo[0] && (
                          <Image
                            src={URL.createObjectURL(
                              values.organisationLogo[0],
                            )}
                            alt="AJO"
                            className="max-w-full"
                            style={{ maxWidth: "100%" }}
                            width={100}
                            height={100}
                          />
                        )}
                    </div>
                    <div className="text-xs text-red-600">
                      <ErrorMessage name="organisationLogo" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {kycSection === "contact" && (
              <>
                {/* Next of Kin Details Fields */}
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
                        type="text"
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
                        Telephone Phone
                      </label>
                      <Field
                        name="phoneNumber"
                        type="text"
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
              </>
            )}

            

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                className="flex  flex-1 items-center  justify-center gap-4 rounded-md bg-white px-4 py-3 text-sm font-semibold text-ajo_blue hover:bg-ajo_offWhite focus:bg-ajo_offWhite"
                onClick={() => {
                  kycSection === "verify"
                    ? setKycSection("address")
                    : kycSection === "address"
                      ? setKycSection("contact")
                      : kycSection === "contact"
                        ? setKycSection("profile")
                        : router.push("/signup/customer");
                }}
              >
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 19 16"
                  fill="none"
                  className="hidden md:block"
                >
                  <path
                    d="M18.5 7.987L0.711 8M7.488 1L0.5 8L7.488 15"
                    stroke="#2D55FB"
                  />
                </svg>
                Previous
              </button>
              {kycSection !== "verify" ? (
                <button
                  type="button"
                  className="w-full  flex-1 rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
                  onClick={() => handleSectionComplete()}
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full  flex-1 rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              )}
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

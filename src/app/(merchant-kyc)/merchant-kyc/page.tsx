"use client";
import { useAuth } from "@/api/hooks/useAuth";
import StatesAndLGAs from "@/api/statesAndLGAs.json";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { selectUserId } from "@/slices/OrganizationIdSlice";
import { MyFileList, StateProps, UpdateMerchantKycProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import type {} from "ldrs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

type kycSections =
  | "profile"
  | "contact"
  | "address"
  | "identification"
  | "verify";

const Kyc = () => {
  const userId = useSelector(selectUserId);

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
  const [selectedLGAArray, setSelectesLGAArray] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("")
  const [selectedNatureOfBusiness, setSelectedNatureOfBusiness] = useState<string[]>([]);
 
  const {
    data: allIndustries,
    isLoading: isLoadingAllIndustry,
  
  } = useQuery({
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

 
  const MyEffectComponent = ({ formikValues }: { formikValues: any }) => {
    useEffect(() => {
      setSelectedCountry(formikValues.country);
      setSelectedState(formikValues.state);
      setSelectedIndustry(formikValues.industry)
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
    const filteredIndustry =
      allIndustries?.find((industry: { name: string; }) => industry.name === selectedIndustry)
        
    setSelectedNatureOfBusiness(filteredIndustry?.natureOfBusiness
    )
    // setselectedStateArray(filteredStates);
  }, [selectedIndustry, allIndustries]);

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

  const { mutate: kycUpdate, isPending: isUpdatingKyc } = useMutation({
    mutationKey: ["merchant kyc"],
    mutationFn: async (values: UpdateMerchantKycProps) => {
      const socials = {
        facebook: values.facebook,
        twitter: values.instagram,
        instagram: values.linkedIn,
        linkedIn: values.twitter,
        pintrest: values.pinterest,
      };

      const formData = new FormData();

      formData.append("description", values.description);
      formData.append("region", values.city);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("city", values.lga);
      formData.append("socialMedia", JSON.stringify(socials));
      formData.append("tradingName", values.tradingName);
      formData.append("website", values.websiteUrl);
      formData.append("industry", values.industry);
      formData.append("natureOfBusiness", values.natureOfBusiness);
      formData.append("businessEmailAdress", values.email);
      formData.append("officeAddress1", values.officeAddress);
      formData.append("officeAddress2", values.address2);
      formData.append("organisationName", values.organisationName);
      formData.append("contactFullName", values.contactFullName);
      formData.append("contactPhoneNumber", values.contactPhoneNumber);
      formData.append("contactEmail", values.contactEmail);
      formData.append("contactDOB", values.contactDOB);
      formData.append("contactRole", values.OrgRole);
      formData.append("contactNationality", values.contactNationality);
      formData.append("contactBvn", values.contactBvn);
      formData.append("contactNIN", values.contactNIN);
      formData.append("ContactPercentOwnership", values.percentOwnership);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      // formData.append("bankAccountNumber", values.acctNo);
      // formData.append("account_bank", values.account_bank);
      // formData.append("split_type", values.split_type);
      // formData.append("split_value", values.split_value);
      

      if (values.organisationLogo) {
        formData.append("businessLogo", values.organisationLogo[0]);
      }
      if (values.BankRecommendation) {
        formData.append(
          "bankLetterOfRecommendation",
          values.BankRecommendation[0],
        );
      }
      if (values.CommunityRecommendation) {
        formData.append(
          "letterOfRecommendation",
          values.CommunityRecommendation[0],
        );
      }
      if (values.CourtAffidavit) {
        formData.append("courtAffidavit", values.CourtAffidavit[0]);
      }
      if (values.contactPhoto) {
        formData.append("contactPersonID", values.contactPhoto[0]);
      }
      return client.put(`/api/user/${userId}`, formData);
    },

    onSuccess(response) {
      setShowSuccessToast(true);
      router.replace("/verification-successful");
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
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });
  

  let initialValues: UpdateMerchantKycProps = {
    country: userData?.country,
    state: userData?.state,
    lga: userData?.lga,
    city: userData?.city,
    phoneNumber: userData?.phoneNumber ?? "",
    officeAddress: userData?.officeAddress1,
    address2: "",
    organisationLogo: null,
    tradingName: "",
    organisationName: userData?.organisationName ?? "",
    description: "",
    websiteUrl: "",
    industry: userData?.industry,
    natureOfBusiness: userData?.natureOfBusiness,
    email: userData?.email ?? "",
    facebook: "",
    instagram: "",
    linkedIn: "",
    twitter: "",
    pinterest: "",
    BankRecommendation: null,
    CourtAffidavit: null,
    CommunityRecommendation: null,
    FormCacBn: null,
    CertOfBusinessName: null,
    contactPhoto: null,
    percentOwnership: userData?.ContactPercentOwnership,
    cacNumber: "",
    contactBvn: userData?.contactBvn,
    contactNIN: userData?.contactNIN,
    contactNationality: userData?.contactNationality,
    OrgRole: userData?.contactRole,
    contactDOB: userData?.contactDOB,
    contactEmail: userData?.contactEmail,
    contactPhoneNumber: userData?.contactPhoneNumber,
    businessPhoneNumber: "",
    contactFullName: userData?.contactFullName,
    // bankName: "",
    // acctNo: "",
    // account_bank: '044',
    // split_type: 'percentage',
    // split_value: '90',

  };

  const [allSections, setAllSections] = useState({
    profile: true,
    contact: false,
    address: false,
    identification: false,
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

  const initialErrors = {
    organisationName: "Required",
  };

  useEffect(() => {
    if (activeSection) {
      // Scroll to the top of the page
      window.scrollTo(0, 0);
    }
  }, [activeSection]);

  return (
    <div className="px-6 pb-10 md:px-[5%]">
      {/* Heading Starts */}
      <div className=" mx-auto mb-12 mt-4 flex items-center gap-x-2 md:w-[80%]">
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
          className={`flex-grow border-t-[1px] border-dashed ${getBorderColor("identification")} relative -top-[12px]`}
        ></span>
        <ProgressIndicator
          index="4"
          label="Identification"
          textColor={getTextColor("identification")}
          bgColor={getBgColor("identification")}
        />
        <span
          className={`flex-grow border-t-[1px] border-dashed ${getBorderColor("verify")} relative -top-[12px]`}
        ></span>
        <ProgressIndicator
          index="5"
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
        initialErrors={initialErrors}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email format")
            .required("Required"),
          country: Yup.string().required("required"),
          state: Yup.string().required("required"),
          contactFullName: Yup.string().optional(),
          contactPhoneNumber: Yup.string()
            .matches(
              /^(?:\+234\d{10}|\d{11})$/,
              "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
            )
            .optional(),
            businessPhoneNumber: Yup.string()
            .matches(
              /^(?:\+234\d{10}|\d{11})$/,
              "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
            )
            .required("required"),
          contactEmail: Yup.string()
            .email("Invalid email format")
            .optional(),
          contactDOB: Yup.date().optional(),
          OrgRole: Yup.string().optional(),
          contactNationality: Yup.string().optional(),
          contactNIN: Yup.string()
            .matches(/^\d{11}$/, "NIN must be exactly 11 digits")
            .optional(),
          contactBvn: Yup.string()
            .matches(/^\d{11}$/, "BVN must be exactly 11 digits")
            .optional(),
          percentOwnership: Yup.number()
            .typeError("Must be a number")
            .optional(),
          cacNumber: Yup.number().typeError("Must be a number").optional(),
          // bankName: Yup.string()
          //   .optional()
          //   .min(2, "Account name must be at least 2 characters")
          //   .max(100, "Account name must be less than 100 characters")
          //   .matches(
          //     /^[a-zA-Z\s]*$/,
          //     "Account name should only contain alphabets and spaces",
          //   ),
          // acctNo: Yup.string()
          //   .optional()
          //   .length(10, "Account number must be exactly 10 digits")
          //   .matches(/^\d{10}$/, "Account number should only contain digits"),
          lga: Yup.string().required("required"),
          officeAddress: Yup.string().required("required"),
          organisationLogo: Yup.mixed()
          .nullable()
          .optional()
          .test(
            "fileSize",
            "File size must be less than or equal to 5MB",
            (value) => {
              if (value instanceof FileList && value.length > 0) {
                return value[0].size <=  5242880; // 5MB limit
              }
              return true; // No file provided, so validation passes
            }
          )
          .test(
            "fileType",
            "Only .jpg, .png files are allowed",
            (value) => {
              if (value instanceof FileList && value.length > 0) {
                const fileType = value[0].type;
                return fileType === "image/jpeg" || fileType === "image/png"; // Only .jpg or .png allowed
              }
              return true; // No file provided, so validation passes
            }
          ),

          description: Yup.string().optional(),
          phoneNumber: Yup.string()
            .matches(
              /^(?:\+234\d{10}|\d{11})$/,
              "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
            )
            .required("Phone number is required"),
          organisationName: Yup.string().required("Required"),
          tradingName: Yup.string().optional(),
          websiteUrl: Yup.string().optional(),
          industry: Yup.string().optional(),
          natureOfBusiness: Yup.string().optional(),
          BankRecommendation: Yup.mixed()
            .nullable()
            .optional()
            .test(
              "fileSize",
              "File size must be less than or equal to 5MB",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  return value[0].size <=  5242880;
                }
                return true;
              },
            )
            .test(
              "fileType",
              "Only .pdf, .jpg, .png files are allowed",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  const file = value[0];
                  const fileType = file.type;
                  return (
                    fileType === "application/pdf" ||
                    fileType === "image/jpeg" ||
                    fileType === "image/png"
                  );
                }
                return true;
              },
            ),
          contactPhoto: Yup.mixed()
          .nullable()
            .optional()
            .test(
              "fileSize",
              "File size must be less than or equal to 5MB",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  return value[0].size <=  5242880;
                }
                return true;
              },
            )
            .test(
              "fileType",
              "Only .pdf, .jpg, .png files are allowed",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  const file = value[0];
                  const fileType = file.type;
                  return (
                    fileType === "application/pdf" ||
                    fileType === "image/jpeg" ||
                    fileType === "image/png"
                  );
                }
                return true;
              },
            ),
          CertOfBusinessName: Yup.mixed()
            .nullable()
            .optional()
            .test(
              "fileSize",
              "File size must be less than or equal to 5MB",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  return value[0].size <=  5242880;
                }
                return true;
              },
            )
            .test(
              "fileType",
              "Only .pdf, .jpg, .png files are allowed",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  const file = value[0];
                  const fileType = file.type;
                  return (
                    fileType === "application/pdf" ||
                    fileType === "image/jpeg" ||
                    fileType === "image/png"
                  );
                }
                return true;
              },
            ),
          FormCacBn: Yup.mixed()
          .nullable()
            .optional()
            .test(
              "fileSize",
              "File size must be less than or equal to 5MB",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  return value[0].size <=  5242880;
                }
                return true;
              },
            )
            .test(
              "fileType",
              "Only .pdf, .jpg, .png files are allowed",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  const file = value[0];
                  const fileType = file.type;
                  return (
                    fileType === "application/pdf" ||
                    fileType === "image/jpeg" ||
                    fileType === "image/png"
                  );
                }
                return true;
              },
            ),
          CourtAffidavit: Yup.mixed()
          .nullable()
            .optional()
            .test(
              "fileSize",
              "File size must be less than or equal to 5MB",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  return value[0].size <=  5242880;
                }
                return true;
              },
            )
            .test(
              "fileType",
              "Only .pdf, .jpg, .png files are allowed",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  const file = value[0];
                  const fileType = file.type;
                  return (
                    fileType === "application/pdf" ||
                    fileType === "image/jpeg" ||
                    fileType === "image/png"
                  );
                }
                return true;
              },
            ),
            CommunityRecommendation: Yup.mixed()
            .nullable()
            .optional()
            .test(
              "fileSize",
              "File size must be less than or equal to 5MB",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  return value[0].size <=  5242880;
                }
                return true;
              },
            )
            .test(
              "fileType",
              "Only .pdf, .jpg, .png files are allowed",
              (value) => {
                if (value instanceof FileList && value.length > 0) {
                  const file = value[0];
                  const fileType = file.type;
                  return (
                    fileType === "application/pdf" ||
                    fileType === "image/jpeg" ||
                    fileType === "image/png"
                  );
                }
                return true;
              },
            ),
          // CommunityRecommendation: Yup.mixed()
          //   .required("Required")
          //   .test(
          //     "fileSize",
          //     "File size must be less than or equal to 5MB",
          //     (value: MyFileList) => {
          //       if (value) {
          //         return value[0].size <=  5242880;
          //       }
          //       return true;
          //     },
          //   )
          //   .test(
          //     "fileType",
          //     "Only .pdf, .jpg, .png files are allowed",
          //     (value: MyFileList) => {
          //       if (value) {
          //         const file = value[0];
          //         const fileType = file.type;
          //         return (
          //           fileType === "application/pdf" ||
          //           fileType === "image/jpeg" ||
          //           fileType === "image/png"
          //         );
          //       }
          //       return true;
          //     },
          //   ),
        })}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values, 123)
          setTimeout(() => {
           
            kycUpdate(values);

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
                      onChange={handleChange}
                      name="organisationName"
                      type="text"
                      disabled={true}
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                      isInvalid={!!errors.organisationName}
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
                <div className="mb-4">
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
                    name="websiteUrl"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="industry"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Industry
                  </label>
                  <Field
                    onChange={handleChange}
                    as="select"
                    isInvalid={!!errors.industry}
                    name="industry"
                    id="industry"
                    placeholder="Industry"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                  >
                    <option>Select Industry</option>
                      {allIndustries &&
                        allIndustries.map((industry: { id:string; name: string }) => (
                          <option key={industry.id} value={industry.name}>
                          {industry.name}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="industry"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>

                
                <div className="mb-4">
                        <label
                          htmlFor="natureOfBusiness"
                          className="w-[20%] whitespace-nowrap text-xs font-medium text-white md:mt-[2%]"
                        >
                          Nature of Business
                        </label>
                        <div>
                          <Field
                            as="select"
                            id="natureOfBusiness"
                            name="natureOfBusiness"
                            // type="text"
                            className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          >
                            <option>Select nature Of Business</option>

                            {selectedNatureOfBusiness &&
                              selectedNatureOfBusiness.map((natureOfBusinesses) => (
                                <option key={natureOfBusinesses} value={natureOfBusinesses}>
                                  {natureOfBusinesses}
                                </option>
                              ))}
                          </Field>{" "}
                        </div>
                        <ErrorMessage
                          name="natureOfBusiness"
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
                      accept="image/jpeg, image/png"
                    />
                    <label
                      htmlFor="organisationLogo"
                      className="cursor-pointer"
                    >
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.jpg or .png file</span>{" "}
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
                      accept="application/pdf, .jpg, .png"
                    />
                    <label
                      htmlFor="BankRecommendation"
                      className="cursor-pointer"
                    >
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.pdf, .jpg, .png</span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.BankRecommendation &&
                    values.BankRecommendation[0] &&
                    ((values.BankRecommendation[0] as File).type.includes(
                      "image",
                    ) ? (
                      <Image
                        src={URL.createObjectURL(values.BankRecommendation[0])}
                        alt="Bank Recommendation"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(values.BankRecommendation[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Bank Recommendation Letter"
                      ></iframe>
                    ))}

                  <div className="text-xs text-red-600">
                    <ErrorMessage name="BankRecommendation" />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="CourtAffidavit"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Court Affidavit
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="CourtAffidavit"
                      id="CourtAffidavit"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("CourtAffidavit", e.target.files)
                      }
                      accept="application/pdf, .jpg, .png"
                    />
                    <label htmlFor="CourtAffidavit" className="cursor-pointer">
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.pdf, .jpg, .png</span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.CourtAffidavit &&
                    values.CourtAffidavit[0] &&
                    ((values.CourtAffidavit[0] as File).type.includes(
                      "image",
                    ) ? (
                      <Image
                        src={URL.createObjectURL(values.CourtAffidavit[0])}
                        alt="Court Affidavit"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(values.CourtAffidavit[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Court Affidavit Letter"
                      ></iframe>
                    ))}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="CourtAffidavit" />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="CommunityRecommendation"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Letter of recommendation (Community / Religious Leader)
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="CommunityRecommendation"
                      id="CommunityRecommendation"
                      className="hidden"
                      onChange={(e) => {
                        setFieldValue(
                          "CommunityRecommendation",
                          e.target.files,
                        );
                      }}
                      accept="application/pdf, .jpg, .png"
                    />
                    <label
                      htmlFor="CommunityRecommendation"
                      className="cursor-pointer"
                    >
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.pdf, .jpg, .png</span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.CommunityRecommendation &&
                    values.CommunityRecommendation[0] &&
                    ((values.CommunityRecommendation[0] as File).type.includes(
                      "image",
                    ) ? (
                      <Image
                        src={URL.createObjectURL(
                          values.CommunityRecommendation[0],
                        )}
                        alt="Community Recommendation"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(
                          values.CommunityRecommendation[0],
                        )}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Bank Recommendation Letter"
                      ></iframe>
                    ))}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="CommunityRecommendation" />
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

                <p className="mb-4  mt-8 text-white last:text-[16px] md:text-[18px]">
                  BUSINESS ACCOUNT DETAILS
                </p>
                {/* <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="bankName"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Bank Name
                    </label>
                    <Field
                      name="bankName"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="bankName"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="acctNo"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Account Number
                    </label>
                    <Field
                      name="acctNo"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="acctNo"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>


                <div className="hidden my-3 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="account_bank"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Account Bank
                    </label>
                    <Field
                      name="account_bank"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="account_bank"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="split_type"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Split Type
                    </label>
                    <Field
                      name="split_type"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="split_type"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="split_value"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Split Value
                    </label>
                    <Field
                      name="split_value"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="split_value"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div> */}

                <p className="my-6 text-[16px] text-white md:text-[18px]">
                  SOCIALS
                </p>
                <div className="flex flex-col gap-4">
                  <span className="flex justify-between gap-5">
                    <div className="flex w-full items-center">
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
                    <div className="flex w-full items-center">
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
                    </div>
                  </span>
                  <span className="flex justify-between gap-5">
                    <div className="flex w-full items-center">
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
                    </div>
                    <div className="flex w-full items-center">
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
                    </div>
                  </span>
                  <div className="flex items-center">
                    <label
                      htmlFor="pintrest"
                      className="m-0 w-[10%] text-[14px] font-medium text-white"
                    >
                      Pinterest:
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

                <p className="mt-10 text-[18px] font-semibold text-white sm:text-[25px] md:text-[32px]">
                  Who can we reach?{" "}
                  <span className="text-[13px] text-[gray]">
                    Update this section with your Organisation contact person’s/
                    business representative details
                  </span>
                </p>
                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="contactFullName"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Contact’s Person Full Name
                    </label>
                    <Field
                      name="contactFullName"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="contactFullName"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="contactPhoneNumber"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Contact’s Person Telephone Number
                    </label>
                    <Field
                      name="contactPhoneNumber"
                      type="tel"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="contactPhoneNumber"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="contactEmail"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Contact’s Person Email address
                    </label>
                    <Field
                      name="contactEmail"
                      type="email"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="contactEmail"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="contactDOB"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Contact’s Person Date of Birth
                    </label>
                    <Field
                      name="contactDOB"
                      type="date"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="contactDOB"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="contactPhoto"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Contact’s Person Document of Identification
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="contactPhoto"
                      id="contactPhoto"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("contactPhoto", e.target.files)
                      }
                      accept="application/pdf, .jpg, .png"
                    />
                    <label htmlFor="contactPhoto" className="cursor-pointer">
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.pdf, .jpg, .png</span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.contactPhoto &&
                    values.contactPhoto[0] &&
                    ((values.contactPhoto[0] as File).type.includes("image") ? (
                      <Image
                        src={URL.createObjectURL(values.contactPhoto[0])}
                        alt="Contact Photo"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(values.contactPhoto[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Contact Photo Document"
                      ></iframe>
                    ))}

                  <div className="text-xs text-red-600">
                    <ErrorMessage name="contactPhoto" />
                  </div>
                </div>
                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="mb-4 flex-1">
                    <label
                      htmlFor="OrgRole"
                      className="m-0 text-xs font-medium text-white "
                    >
                      Contact’s Person Role in the Organisation
                    </label>
                    <Field
                      as="select"
                      id="OrgRole"
                      name="OrgRole"
                      className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-dropdown-icon bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D]"
                    >
                      <option value={"ceo"}>CEO</option>
                      <option value={"analyst"}>Analyst</option>
                      <option value={"manager"}>Manager</option>
                      <option value={"finance officer"}>Finance Officer</option>
                      <option className="invisible"></option>
                    </Field>
                    <ErrorMessage
                      name="OrgRole"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-4 flex-1">
                    <label
                      htmlFor="contactNationality"
                      className="m-0 text-xs font-medium text-white "
                    >
                      Contact’s Person Nationality
                    </label>
                    <Field
                      as="select"
                      id="contactNationality"
                      name="contactNationality"
                      className="mt-1 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-dropdown-icon bg-[position:97%_center] bg-no-repeat p-3 pr-10 text-[#7D7D7D]"
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
                      name="OrgRole"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
                <div className="my-3 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <label
                      htmlFor="contactNIN"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Contact’s Person NIN Number
                    </label>
                    <Field
                      name="contactNIN"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="contactNIN"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="contactBvn"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Contact’s Person BVN Number
                    </label>
                    <Field
                      name="contactBvn"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="contactBvn"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="percentOwnership"
                    className="m-0 text-xs font-medium text-white"
                  >
                    What percentage of “YOUR ORGANISATION NAME” does this person
                    have?
                  </label>
                  <Field
                    name="percentOwnership"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                  />
                  <ErrorMessage
                    name="percentOwnership"
                    component="div"
                    className="text-xs text-red-500"
                  />
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
                    htmlFor="officeAddress"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Office Address 1
                  </label>
                  <Field
                    name="officeAddress"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                  />
                  <ErrorMessage
                    name="officeAddress"
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
                      {StatesAndLGAs.map((country) => (
                        <option key={country.country} value={country.country}>
                          {country.country}
                        </option>
                      ))}
                      <option className="invisible"></option>
                    </Field>
                    <ErrorMessage
                      name="country"
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
                      {selectedStateArray &&
                        selectedStateArray.map((state) => (
                          <option key={state.name} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      <option className="invisible"></option>
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
                      {selectedLGAArray &&
                        selectedLGAArray.map((lga) => (
                          <option key={lga} value={lga}>
                            {lga}
                          </option>
                        ))}
                      <option className="invisible"></option>
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
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 pr-10 text-[#7D7D7D]"
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

            {activeSection === "identification" && (
              <div className="mb-8">
                <p className=" text-[18px] font-semibold text-white sm:text-[25px] md:text-[32px]">
                  Business Identification{" "}
                  <span className="text-[13px] text-[gray]">
                    Enter your business registration information
                  </span>
                </p>

                <div className="mb-4"> 
                    <label
                      htmlFor="businessPhoneNumber"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Contact’s Person Telephone Number
                    </label>
                    <Field
                      name="businessPhoneNumber"
                      type="tel"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="businessPhoneNumber"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>

                <div className="mb-4">
                  <label
                    htmlFor="cacNumber"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Business number i.e CAC number
                  </label>
                  <Field
                    name="cacNumber"
                    type="text"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                  />
                  <ErrorMessage
                    name="cacNumber"
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>

                
                <p className="mt-4 text-base font-semibold text-ajo_offWhite">
                  Kindly upload documents that are:
                </p>
                <ul>
                  <li className="list-disc text-sm text-ajo_offWhite">
                    Government Issued
                  </li>
                  <li className="list-disc text-sm text-ajo_offWhite">
                    Full sized, original and unedited
                  </li>
                  <li className="list-disc text-sm text-ajo_offWhite">
                    In JPG, PNG or PDF File Format
                  </li>
                </ul>

                <div className="mt-4">
                  <label
                    htmlFor="CertOfBusinessName"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Certificate of business Name
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="CertOfBusinessName"
                      id="CertOfBusinessName"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("CertOfBusinessName", e.target.files)
                      }
                      accept="application/pdf, .jpg, .png"
                    />
                    <label
                      htmlFor="CertOfBusinessName"
                      className="cursor-pointer"
                    >
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.pdf, .jpg, .png</span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.CertOfBusinessName &&
                    values.CertOfBusinessName[0] &&
                    ((values.CertOfBusinessName[0] as File).type.includes(
                      "image",
                    ) ? (
                      <Image
                        src={URL.createObjectURL(values.CertOfBusinessName[0])}
                        alt="CertOfBusinessName"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(values.CertOfBusinessName[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="CertOfBusinessName Letter"
                      ></iframe>
                    ))}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="CertOfBusinessName" />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="FormCacBn"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Form CAC BN 1
                  </label>
                  <div className="mt-1 flex h-[100px] items-center justify-center  rounded-md border-2 border-gray-300 bg-white px-6 pb-6 pt-5">
                    <input
                      type="file"
                      name="FormCacBn"
                      id="FormCacBn"
                      className="hidden"
                      onChange={(e) =>
                        setFieldValue("FormCacBn", e.target.files)
                      }
                      accept="application/pdf, .jpg, .png"
                    />
                    <label htmlFor="FormCacBn" className="cursor-pointer">
                      <p className="text-center text-[gray]">
                        Drag n drop a{" "}
                        <span className="font-semibold">.pdf, .jpg, .png</span>{" "}
                        here, or click to select one
                      </p>
                    </label>
                  </div>
                  {values.FormCacBn &&
                    values.FormCacBn[0] &&
                    ((values.FormCacBn[0] as File).type.includes("image") ? (
                      <Image
                        src={URL.createObjectURL(values.FormCacBn[0])}
                        alt="CFormCacBn"
                        className="mt-4 max-w-full rounded-md"
                        style={{ maxWidth: "100%" }}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <iframe
                        src={URL.createObjectURL(values.FormCacBn[0])}
                        className="no-border mt-4 block h-auto w-auto max-w-full rounded-md"
                        title="Court Affidavit Letter"
                      ></iframe>
                    ))}
                  <div className="text-xs text-red-600">
                    <ErrorMessage name="FormCacBn" />
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
                    <p className="mb-1 whitespace-nowrap text-sm text-ajo_offWhite">
                      Business Name:
                    </p>
                    <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                      {values.organisationName}
                    </div>
                  </span>
                  <span className="mb-4 block">
                    <p className="mb-1 whitespace-nowrap text-sm text-ajo_offWhite">
                      Trading Name:
                    </p>
                    <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                      {values.tradingName}
                    </div>
                  </span>

                  <span className="block">
                    <p className="mb-1 whitespace-nowrap text-sm text-ajo_offWhite">
                      Business Description:
                    </p>
                    <div className="break-words rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                      {values.description}
                    </div>
                  </span>

                  <div className="my-12">
                    <span className="mb-2 block">
                      <p className="mb-1 whitespace-nowrap text-sm text-ajo_offWhite">
                        Website:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                        {values.websiteUrl}
                      </div>
                    </span>
                    <span className="mb-2 block">
                      <p className="mb-1 whitespace-nowrap text-sm text-ajo_offWhite">
                        Email Address:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                        {values.email}
                      </div>
                    </span>
                    <span className="mb-2 block">
                      <p className="mb-1 whitespace-nowrap text-sm text-ajo_offWhite">
                        Telephone number:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                        {values.phoneNumber}
                      </div>
                    </span>
                    {/* <span className="mb-2 block">
                      <p className="mb-1 whitespace-nowrap text-sm text-ajo_offWhite">
                        Bank Name:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                        {values.bankName}
                      </div>
                    </span> */}
                    {/* <span className="mb-2 block">
                      <p className="mb-1 whitespace-nowrap text-sm text-ajo_offWhite">
                        Bank Account Number:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                        {values.acctNo}
                      </div>
                    </span> */}
                  </div>

                  <div className="my-12 flex flex-wrap gap-x-4">
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Facebook:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 text-ajo_darkBlue">
                        {values.facebook}
                      </div>
                    </span>
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Instagram:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 text-ajo_darkBlue">
                        {values.instagram}
                      </div>
                    </span>
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">Twitter:</p>
                      <div className="rounded-md bg-white  px-4 py-2 text-ajo_darkBlue">
                        {values.twitter}
                      </div>
                    </span>
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Linkedin:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 text-ajo_darkBlue">
                        {values.linkedIn}
                      </div>
                    </span>
                    <span className="mb-2">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Pinterest:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 text-ajo_darkBlue">
                        {values.pinterest}
                      </div>
                    </span>
                  </div>

                  <div>
                    <span className="mb-2 block">
                      <p className="mb-1 text-sm text-ajo_offWhite">Address:</p>
                      <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                        {values.officeAddress + " " + values.address2}
                      </div>
                    </span>
                    <div className="flex flex-wrap gap-x-4">
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Country:
                        </p>
                        <div className="rounded-md bg-ajo_offWhite  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.country}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">State:</p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.state}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Local Govt:
                        </p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.lga}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">City:</p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.city}
                        </div>
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="mb-2 block">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Contact Full Name:
                      </p>
                      <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                        {values.contactFullName}
                      </div>
                    </span>
                    <div className="flex flex-wrap gap-x-4">
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Contact Email:
                        </p>
                        <div className="rounded-md bg-ajo_offWhite  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.contactEmail}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Contact Role:
                        </p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.OrgRole}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Ownership Percentage (%):
                        </p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.percentOwnership + "%"}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Contact BVN:
                        </p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.contactBvn}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Contact NIN:
                        </p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.contactNIN}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Contact Nationality:
                        </p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.contactNationality}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Contact Date of Birth:
                        </p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.contactDOB}
                        </div>
                      </span>
                      <span className="mb-2 flex-1">
                        <p className="mb-1 text-sm text-ajo_offWhite">
                          Contact Phone Number:
                        </p>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.contactPhoneNumber}
                        </div>
                        <div className="rounded-md bg-white  px-4 py-2 capitalize text-ajo_darkBlue">
                          {values.businessPhoneNumber}
                        </div>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4">
                    <span className="mb-2 flex-1">
                      <p className="mb-1 text-sm text-ajo_offWhite">
                        Business CAC Number:
                      </p>
                      <div className="rounded-md bg-ajo_offWhite  px-4 py-2 capitalize text-ajo_darkBlue">
                        {values.cacNumber}
                      </div>
                    </span>
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
                      SetActiveSection("identification");
                      setAllSections((prev) => ({
                        ...prev,
                        ["verify"]: false,
                      }));
                    } else if (
                      activeSection === "identification" &&
                      allSections.identification
                    ) {
                      SetActiveSection("address");
                      setAllSections((prev) => ({
                        ...prev,
                        ["identification"]: false,
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
                type={
                  !allSections.verify && activeSection !== "verify"
                    ? "submit"
                    : "button"
                }
                className="w-full  flex-1 items-center rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
                onClick={() => {
                  if (!allSections.verify && activeSection !== "verify") {
                    if (
                      allSections.profile &&
                      activeSection === "profile" &&
                      !errors.organisationName &&
                      !errors.description &&
                      !errors.organisationLogo &&
                      !errors.BankRecommendation &&
                      !errors.CommunityRecommendation &&
                      !errors.CourtAffidavit
                    ) {
                      handleSectionComplete("contact");
                      SetActiveSection("contact");
                    } else if (
                      allSections.contact &&
                      activeSection === "contact" &&
                      !errors.phoneNumber &&
                      !errors.email &&
                      // !errors.bankName &&
                      // !errors.acctNo &&
                      !errors.contactFullName &&
                      !errors.contactBvn &&
                      !errors.contactDOB &&
                      !errors.contactEmail &&
                      !errors.contactNIN &&
                      !errors.contactNationality &&
                      !errors.contactPhoneNumber &&
                      !errors.contactPhoto
                    ) {
                      handleSectionComplete("address");
                      SetActiveSection("address");
                    } else if (
                      allSections.address &&
                      activeSection === "address" &&
                      !errors.officeAddress &&
                      !errors.country &&
                      !errors.state &&
                      !errors.lga
                    ) {
                      handleSectionComplete("identification");
                      SetActiveSection("identification");
                    } else if (
                      allSections.identification &&
                      activeSection === "identification" &&
                      !errors.businessPhoneNumber &&
                      !errors.cacNumber &&
                      !errors.FormCacBn &&
                      !errors.CertOfBusinessName
                    ) {
                      handleSectionComplete("verify");
                      SetActiveSection("verify");
                    }
                  } else {
                    console.log(errors);
                    submitForm();
                  }
                }}
                disabled={isSubmitting || isUpdatingKyc}
              >
                {allSections.verify && activeSection === "verify" ? (
                  isSubmitting || isUpdatingKyc ? (
                    <Image
                      src="/loadingSpinner.svg"
                      alt="loading spinner"
                      className="relative left-1/2"
                      width={25}
                      height={25}
                    />
                  ) : (
                    "Submit"
                  )
                ) : (
                  "Next"
                )}
              </button>
            </div>
            {showSuccessToast && (
              <SuccessToaster message={"KYC update successful!"} />
            )}
            {showErrorToast && errorMessage && errorMessage && (
              <ErrorToaster
                message={errorMessage ? errorMessage : "Error updating KYC"}
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

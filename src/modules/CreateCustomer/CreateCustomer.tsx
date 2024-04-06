"use client";
import { useAuth } from "@/api/hooks/useAuth";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import {
  selectOrganizationId,
  selectUserId,
} from "@/slices/OrganizationIdSlice";
import {
  CountryAndStateProps,
  StateProps,
  UpdateKycProps,
  getOrganizationProps,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StatesAndLGAs from "@/api/statesAndLGAs.json";
import * as Yup from "yup";

const CreateCustomer = ({
  setCloseModal,
}: {
  setCloseModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { client } = useAuth();

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStateArray, setselectedStateArray] = useState<StateProps[]>(
    [],
  );
  const [selectedState, setSelectedState] = useState("");
  // const [selectedLGA, setSelectedLGA] = useState("");
  const organizationId = useSelector(selectOrganizationId);
  console.log("ID:  " + organizationId);
  const [selectedLGAArray, setSelectesLGAArray] = useState<string[]>([]);

  const initialValues: UpdateKycProps = {
    firstName: "",
    lastName: "",
    otherName: "",
    phoneNumber: "",
    email: "",
    country: "",
    state: "",
    lga: "",
    city: "",
    popularMarket: "",
    nok: "",
    nokRelationship: "",
    nokPhone: "",
    homeAddress: "",
    photo: null,
    meansOfID: "",
    meansOfIDPhoto: null,
    nin: "",
    bvn: "",
    bankAcctNo: "",
    organisation: "",
    userType: "individual",
  };

  const MyEffectComponent = ({ formikValues }: { formikValues: any }) => {
    useEffect(() => {
      // This function will run whenever the value of 'formikValues.myField' changes
      setSelectedCountry(formikValues.country);
      setSelectedState(formikValues.state);
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
        console.log(stateObject.lgas);
        setSelectesLGAArray(stateObject.lgas);
      } else {
        // If state is not found, return an empty array
      }
    }
  }, [selectedCountry, selectedState]);

  // function getLGAsByState(stateName: string) {
  //   // Find the Country object in the dataset
  //   const CountryObject = StatesAndLGAs.find(
  //     (countryData) => countryData.country === selectedCountry,
  //   );

  //   // If Country object is found, find the state by its name
  //   if (CountryObject) {
  //     const stateObject = CountryObject.states.find(
  //       (state) => state.name === stateName,
  //     );
  //     // If state is found, return its LGAs
  //     if (stateObject) {
  //       console.log(stateObject.lgas);
  //       setSelectesLGAArray(stateObject.lgas);
  //     } else {
  //       // If state is not found, return an empty array
  //       return [];
  //     }
  //   } else {
  //     // If Nigeria object is not found, return null or handle the error accordingly
  //     return null;
  //   }
  // }

  const {
    mutate: createNewCustomer,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["kyc update"],
    mutationFn: async (values: UpdateKycProps) => {
      const formData = new FormData();

      // Append all the fields to the formData
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("otherName", values.otherName);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("email", values.email);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("lga", values.lga);
      formData.append("city", values.city);
      formData.append("popularMarket", values.popularMarket);
      formData.append("nok", values.nok);
      formData.append("nokRelationship", values.nokRelationship);
      formData.append("nokPhone", values.nokPhone);
      formData.append("homeAddress", values.homeAddress);
      formData.append("userType", values.userType);
      formData.append("organisation", organizationId);
      formData.append("nin", values.nin);
      formData.append("bvn", values.bvn);
      formData.append("meansOfID", values.meansOfID);
      formData.append("bankAcctNo", values.bankAcctNo);
      // Append images
      if (values.photo) {
        formData.append("photo", values.photo[0]); // Assuming photo is an array of File objects
      }

      if (values.meansOfIDPhoto) {
        formData.append("meansOfIDPhoto", values.meansOfIDPhoto[0]);
      }

      // console.log(formData.entries);
      // Make the API call with formData
      return client.post(`/api/user/create-customer`, formData);
    },

    onSuccess(response) {
      // router.push("/customer");
      console.log(response);
      console.log("customer created successfully");
      setCloseModal(false);
      setShowSuccessToast(true);
      setSuccessMessage((response as any).response.data.message);
    },

    onError(error: AxiosError<any, any>) {
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        phoneNumber: Yup.string()
          .matches(
            /^(?:\+234\d{10}|\d{11})$/,
            "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
          )
          .required("Phone number is required"),
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
        country: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        lga: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        popularMarket: Yup.string().required("Required"),
        nok: Yup.string().required("Required"),
        nokRelationship: Yup.string().required("Required"),
        nokPhone: Yup.string().required("Required"),
        homeAddress: Yup.string().required("Required"),
        photo: Yup.mixed().required("Required"),
        meansOfID: Yup.string().required("Required"),
        meansOfIDPhoto: Yup.mixed().required("Required"),
        nin: Yup.string().optional(),
        bvn: Yup.string().optional(),
        bankAcctNo: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log("submitting........");
        setTimeout(() => {
          createNewCustomer(values);
          console.log(values);
          setSubmitting(false);
        }, 400);
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
        <Form
          className="mt-8"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          name="image"
        >
          <div className="flex w-full items-center justify-between gap-4">
            <div className="mb-3 w-1/2">
              <label
                htmlFor="firstName"
                className="m-0 text-xs font-medium text-white"
              >
                First Name{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="firstName"
                name="firstName"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3 w-1/2">
              <label
                htmlFor="lastName"
                className="m-0 text-xs font-medium text-white"
              >
                Last Name{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="lastName"
                name="lastName"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="otherName"
              className="m-0 text-xs font-medium text-white"
            >
              Other Names
            </label>
            <Field
              id="otherName"
              name="otherName"
              type="text"
              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="phoneNumber"
              className="m-0 text-xs font-medium text-white"
            >
              Phone Number{" "}
              <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
              <Field
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="bg-transparent outline-none"
              />
            </div>
            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="text-red-500"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="email"
              className="m-0 text-xs font-medium text-white"
            >
              Email address{" "}
              <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500"
            />
          </div>
          {/* Personal Details Fields */}
          <div className="mb-8">
            <div className="mb-3">
              <label
                htmlFor="country"
                className="m-0 text-xs font-medium text-white"
              >
                Country of Residence
              </label>
              <Field
                onChange={handleChange}
                as="select"
                isInvalid={!!errors.country}
                name="country"
                id="country"
                // type="text"
                placeholder="country"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              >
                <option>Select Country</option>
                {StatesAndLGAs &&
                  StatesAndLGAs.map((countries) => (
                    <option key={countries.country} value={countries.country}>
                      {countries.country}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="country"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Add more fields for personal details */}

            <div className="mb-3">
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
                // type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
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
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="lga"
                className="m-0 text-xs font-medium text-white"
              >
                Local Government Area (lga)
              </label>
              <Field
                as="select"
                id="lga"
                name="lga"
                // type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              >
                <option>Select LGA</option>

                {selectedLGAArray &&
                  selectedLGAArray.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                {/* {selectedLGAArray && selectedStateArray.map((lga) => (
                        <option>

                        </option>
                      )) } */}
              </Field>
              <ErrorMessage
                name="lga"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="city"
                className="m-0 text-xs font-medium text-white"
              >
                City/Town
              </label>
              <Field
                name="city"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="popularMarket"
                className="m-0 text-xs font-medium text-white"
              >
                Popular market/bus park/religion centre/event centre/place in
                your locality
              </label>
              <Field
                name="popularMarket"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="popularMarket"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-3">
              <label
                htmlFor="nok"
                className="m-0 text-xs font-medium text-white"
              >
                Next Of Kin
              </label>
              <Field
                name="nok"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="nok"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Add more fields for next of kin details */}
            <div className="mb-3">
              <label
                htmlFor="nokRelationship"
                className="m-0 text-xs font-medium text-white"
              >
                Relationship to Next of Kin
              </label>
              <Field
                name="nokRelationship"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="nokRelationship"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="nokPhoneNumber"
                className="m-0 text-xs font-medium text-white"
              >
                Next of Kin Phone number
              </label>
              <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                <Field
                  name="nokPhone"
                  id="kin-phone"
                  type="tel"
                  className=" bg-transparent outline-none"
                />
              </div>
              <ErrorMessage
                name="nokPhoneNumber"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="homeAddress"
                className="m-0 text-xs font-medium text-white"
              >
                Home address
              </label>
              <Field
                name="homeAddress"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="homeAddress"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="">
              <label
                htmlFor="photo"
                className="text-md block font-medium text-white"
              >
                Photo
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  className="hidden"
                  onChange={(e) => setFieldValue("photo", e.target.files)}
                  accept="image/*"
                />
                <label htmlFor="photo" className="cursor-pointer">
                  <p className="text-center text-white">
                    Drag n drop an image here, or click to select one
                  </p>
                </label>
                {values.photo && values.photo[0] && (
                  <Image
                    src={URL.createObjectURL(values.photo[0])}
                    alt="Product"
                    className="max-w-full"
                    style={{ maxWidth: "100%" }}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="text-red-500">
                <ErrorMessage name="photo" />
              </div>
            </div>

            <div className="mb-3 mt-4">
              <label
                htmlFor="meansOfID"
                className="m-0 text-xs font-medium text-white"
              >
                Select Identification Document type
              </label>
              <Field
                as="select"
                name="meansOfID"
                className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
              >
                <option value="International Passport">
                  International Passport
                </option>
                <option value="Utility Bill">Utility Bill</option>
                <option value="Utility Bill">NIN</option>
                <option value="Utility Bill">Drivers License</option>
                <option value="Utility Bill">Voters Card</option>
                <option value="Utility Bill">Association Membership ID</option>
                <option value="Utility Bill">School ID</option>
              </Field>
              <ErrorMessage
                name="meansOfID"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="image"
                className="text-md block font-medium text-white "
              >
                {!values.meansOfID ? "Means  of Id" : values.meansOfID} Photo
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="hidden"
                  onChange={(e) =>
                    setFieldValue("meansOfIDPhoto", e.target.files)
                  }
                  accept="image/*"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <p className="text-center text-white">
                    Drag n drop an image here, or click to select one
                  </p>
                </label>
                {values.meansOfIDPhoto && values.meansOfIDPhoto[0] && (
                  <Image
                    src={URL.createObjectURL(values.meansOfIDPhoto[0])}
                    alt="Product"
                    className="max-w-full"
                    style={{ maxWidth: "100%" }}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="text-red-500">
                <ErrorMessage name="meansOfIDPhoto" className="text-red-500" />
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="nin"
                className="m-0 text-xs font-medium text-white"
              >
                NIN number
              </label>
              <Field
                name="nin"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="nin"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="bvn"
                className="m-0 text-xs font-medium text-white"
              >
                BVN number
              </label>
              <Field
                name="bvn"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="bvn"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="bankAcctNo"
                className="m-0 text-xs font-medium text-white"
              >
                Bank Account Number (All withdrawals will be made into this
                account)
              </label>
              <Field
                name="bankAcctNo"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="bankAcctNo"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          {/* Submission buttons */}
          <button
            type="submit"
            className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
            disabled={isSubmitting}
          >
            {isSubmitting || isPending ? "Creating Customer......" : "Submit"}
          </button>

          {/* <SuccessToaster message="hey" /> */}
          {showSuccessToast && (
            <SuccessToaster message={"Customer Creation successful!"} />
          )}
          {showErrorToast && errorMessage && errorMessage && (
            <ErrorToaster
              message={errorMessage ? errorMessage : "Error Creating Customer"}
            />
          )}
          <MyEffectComponent formikValues={values} />
        </Form>
      )}
    </Formik>
  );
};

export default CreateCustomer;

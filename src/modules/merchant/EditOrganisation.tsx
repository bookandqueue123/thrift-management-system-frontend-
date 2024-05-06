import { useAuth } from "@/api/hooks/useAuth";
import { Organisation, StateProps, UpdateKycProps, customer, getOrganizationProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import StatesAndLGAs from "@/api/statesAndLGAs.json";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { CustomButton } from "@/components/Buttons";
import SuccessToaster, { ErrorToaster } from "@/components/toast";

interface ShowModalProps{
    organisationId: string
}
export const EditOrganisation = ({
    organisationId,
   
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
            console.log(error.response ?? error.message);
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
            console.log(error);
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
        console.log(values)
        const formData = new FormData();
        formData.append("description", values.description)
        formData.append("organisationName", values.organisationName);
        formData.append("accountNumber", values.accountNumber);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("email", values.email);
        formData.append("businessEmailAdress", values.businessEmailAdress);
        formData.append("officeAddress1", values.officeAddress1);
        formData.append("officeAddress2", values.officeAddress2);
        formData.append("region", values.region);
        formData.append("tradingName", values.tradingName)
        formData.append("website", values.website)
        formData.append("country", values.country);
        formData.append("state", values.state);
       
        formData.append("city", values.city);
        
      
        return client.put(`/api/user/${organisationId}`, formData);
      },
      onSuccess(response) {
        // router.push("/customer");
        console.log(response);
        setShowSuccessToast(true);
        // setSuccessMessage((response as any).response.data.message);
      },
      onError(error: AxiosError<any, any>) {
        console.log(error);
        setShowErrorToast(true);
        setErrorMessage(error.response?.data.message);
      },
    });
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
         
          setSelectesLGAArray(stateObject.lgas);
        } else {
          // If state is not found, return an empty array
        }
      }
    }, [selectedCountry, selectedState]);
   
    return (
      <div className="mx-auto mt-8 w-[100%] overflow-hidden rounded-md bg-white p-4 shadow-md">
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
                // lga: customerInfo?.lga,
                city: customerInfo?.city,
                region: customerInfo.region,
                tradingName: customerInfo.tradingName,
                website: customerInfo.website,
                description: customerInfo.description,
               
              }}
              // validationSchema={Yup.object({
              //   organisationName: Yup.string().required("Required"),
              //   accountNumber: Yup.string().required("Required"),
              //   otherName: Yup.string().optional(),
              //   email: Yup.string().required("Required"),
              //   businessEmailAdress: Yup.string().required("Required"),
              //   // officeAddress1: Yup.string().required("Required"),
              //   // officeAddress2: Yup.string().required("Required"),
              //   country: Yup.string().required("Required"),
              //   state: Yup.string().required("Required"),
              //   lga: Yup.string().required("Required"),
              //   city: Yup.string().required("Required"),
              //   region: Yup.string().required("Required"),
              //   // tradingName: Yup.string().required("Required"),
              //   website: Yup.string().required("Required"),
              //   organisation: Yup.string().required("Required"),
              //   description: Yup.string().required("Required"),
              // })}
              onSubmit={(values, { setSubmitting }) => {
                console.log(12345)
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
                  className="mt-8 w-full"
                >
                  <div className="p-6 md:flex ">
                    <div className="mr-6 md:w-1/6 ">
                      <div className="">
                        {/* <div className="mb-4 ">
                          {values.photo && values.photo[0] ? (
                            <Image
                              src={URL.createObjectURL(values.photo[0])} // Display placeholder image or actual image URL
                              alt="photo"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          ) : (
                            <Image
                              src={customerInfo.photo} // Display placeholder image or actual image URL
                              alt="photo"
                              className="h-auto w-full"
                              style={{ maxWidth: "100%" }}
                              width={500}
                              height={300}
                            />
                          )}
                        </div> */}
  
                        <div>
                          <label
                            htmlFor="photo"
                            className="mt-4 cursor-pointer rounded-md bg-gray-300  px-4 py-2 text-white hover:bg-gray-400"
                          >
                            Change
                            <input
                              id="photo"
                              name="photo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files;
                                setFieldValue("photo", file); // Store the selected file in state
                              }}
                            />
                          </label>
                          {isSubmitting && (
                            <span className="ml-2">Uploading...</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex w-5/6 flex-wrap md:mx-16">
                      <div className="mb-8">
                        
                          <div className="mb-3 w-full">
                            <label
                              htmlFor="organisationName"
                              className="text-normal m-0 font-bold "
                            >
                              Name{" "}
                              <span className="font-base font-semibold text-[#FF0000]">
                                *
                              </span>
                            </label>
                            <Field
                              id="organisationName"
                              name="organisationName"
                              type="text"
                              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                            />
                            <ErrorMessage
                              name="organisationName"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                          
                       
  
                        <div className="mb-3">
                          <label
                            htmlFor="accountNumber                            "
                            className="text-normal m-0 font-bold "
                          >
                            Account Number
                          </label>
                          <Field
                            id="accountNumber"
                            name="accountNumber"
                            type="text"
                            className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          />
                        </div>
  
                        <div className="mb-3">
                          <label
                            htmlFor="phoneNumber"
                            className="text-normal m-0 font-bold "
                          >
                            Phone Number{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
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
                            className="text-normal m-0 font-bold "
                          >
                            Email address{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
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

                        <div className="mb-3">
                          <label
                            htmlFor="businessEmailAdress"
                            className="text-normal m-0 font-bold "
                          >
                            business Email Adress {" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <Field
                            id="businessEmailAdress"
                            name="businessEmailAdress"
                            type="businessEmailAdress"
                            className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                          />
                          <ErrorMessage
                            name="businessEmailAdress"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
  
                        <div className="mb-3">
                          <label
                            htmlFor="officeAddress1"
                            className="text-normal m-0 font-bold "
                          >
                            Home Address{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                            <Field
                              id="officeAddress1"
                              name="officeAddress1"
                              type="text"
                              className="bg-transparent outline-none"
                            />
                          </div>
                          <ErrorMessage
                            name="officeAddress1"
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="officeAddress2"
                            className="text-normal m-0 font-bold "
                          >
                            Office Address2{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                            <Field
                              id="officeAddress2"
                              name="officeAddress2"
                              type="text"
                              className="bg-transparent outline-none"
                            />
                          </div>
                          <ErrorMessage
                            name="officeAddress2"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
  
                        <div className="mb-3">
                          <label
                            htmlFor="country"
                            className="text-normal m-0 font-bold "
                          >
                            Country
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
                            className="text-xs text-red-500"
                          />
                        </div>
  
                        <div className="mb-3">
                          <label
                            htmlFor="state"
                            className="text-normal m-0 font-bold "
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
                            className="text-xs text-red-500"
                          />
                        </div>
                        {/* <div className="mb-3">
                          <label
                            htmlFor="lga"
                            className="text-normal m-0 font-bold"
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
                          </Field>
                          <ErrorMessage
                            name="lga"
                            component="div"
                            className="text-xs text-red-500"
                          />
                        </div> */}
  
                        <div className="mb-3">
                          <label
                            htmlFor="city"
                            className="text-normal m-0 font-bold "
                          >
                            City{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                            <Field
                              id="city"
                              name="city"
                              type="city"
                              className="bg-transparent outline-none"
                            />
                          </div>
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="region"
                            className="text-normal m-0 font-bold "
                          >
                            region{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                            <Field
                              id="region"
                              name="region"
                              type="region"
                              className="bg-transparent outline-none"
                            />
                          </div>
                          <ErrorMessage
                            name="region"
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="tradingName"
                            className="text-normal m-0 font-bold "
                          >
                            Trading Name{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                            <Field
                              id="tradingName"
                              name="tradingName"
                              type="tradingName"
                              className="bg-transparent outline-none"
                            />
                          </div>
                          <ErrorMessage
                            name="tradingName"
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="website"
                            className="text-normal m-0 font-bold "
                          >
                            Website{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                            <Field
                              id="website"
                              name="website"
                              type="website"
                              className="bg-transparent outline-none"
                            />
                          </div>
                          <ErrorMessage
                            name="website"
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="description"
                            className="text-normal m-0 font-bold "
                          >
                            Description{" "}
                            <span className="font-base font-semibold text-[#FF0000]">
                              *
                            </span>
                          </label>
                          <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                            <Field
                              id="description"
                              name="description"
                              type="description"
                              className="bg-transparent outline-none"
                            />
                          </div>
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-red-500"
                          />
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
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    );
  };
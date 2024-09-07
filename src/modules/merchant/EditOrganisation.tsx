import { useAuth } from "@/api/hooks/useAuth";
import { Organisation, StateProps, UpdateKycProps, customer, getOrganizationProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import StatesAndLGAs from "@/api/statesAndLGAs.json";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { CustomButton } from "@/components/Buttons";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { useSelector } from "react-redux";
import { selectUserId } from "@/slices/OrganizationIdSlice";


interface ShowModalProps{
    organisationId: string,
    closeModal: Dispatch<SetStateAction<boolean>>;
}
export const EditOrganisation = ({
    organisationId,
    closeModal
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
    const [selectedIndustry, setSelectedIndustry] = useState<string>("")
    const   [selectedNatureOfBusiness, setSelectedNatureOfBusiness] = useState<string[]>([]);
    
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
        formData.append("industry", values.industry);
        formData.append("natureOfBusiness", values.natureOfBusiness);
        // formData.append("description", values.description);
        
      
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
        setSelectedIndustry(formikValues.industry)
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
    
    useEffect(() => {
      const filteredIndustry =
        allIndustries?.find((industry: { name: string; }) => industry.name === selectedIndustry)
          
      setSelectedNatureOfBusiness(filteredIndustry?.natureOfBusiness
      )
      // setselectedStateArray(filteredStates);
    }, [selectedIndustry, allIndustries]);
 
    return (
      <div className="mx-auto text-white mt-8 w-[100%] overflow-hidden rounded-md  p-4 shadow-md">
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
                  
                  <p className="mb-8 mt-2 text-xl text-white font-bold">Edit Organisation Details</p>
                    <div className="mt-8">
                      <div className="mb-8 ">
                        
                        <div className="items-center gap-6 ">
                          <div className="md:flex">
                            <label
                              htmlFor="organisationName"
                              className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium"
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "
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
                                className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium"
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium"
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium"
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium"
                          >
                            Business Email Adress {" "}
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium"
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium"
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
                                  value={countries  .country}
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium"
                          >
                            Local Government <br/> Area (lga)
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "
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
                            className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "
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
                            /><ErrorMessage
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
                                className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "  >
                            
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
                                className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "  >
                            
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
                              </div>
                            </div>
                          </div>

                
                <div className="mb-4">
             
                <div className="items-center gap-6 ">
                <div className="md:flex">
                <label
                  htmlFor="tradingName"
                  className="md:mt-[2%] text-white w-[20%] whitespace-nowrap text-xs font-medium "
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
                        selectedNatureOfBusiness.map((natureOfBusinesses) => (
                          <option key={natureOfBusinesses} value={natureOfBusinesses}>
                            {natureOfBusinesses}
                          </option>
                        ))}
                    </Field>{" "}
              
                  <ErrorMessage
                    name="natureOfBusiness"
                    component="div"
                    className="text-xs text-red-500"
                  />  
                  </div>
                  </div>
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



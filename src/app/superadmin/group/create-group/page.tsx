
'use client'  
  import { Formik, Form, Field, ErrorMessage } from 'formik';
  import * as Yup from 'yup';
  import { useSelector } from "react-redux";
  import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { useAuth } from '@/api/hooks/useAuth';
import { customer } from '@/types';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';
  
  const CreateOranisationGroup = ({
    
  }) => {
    const organizationId = useSelector(selectOrganizationId)
    console.log(organizationId)
    const { client } = useAuth();
    const [selectedOptions, setSelectedOptions] = useState<customer[]>([]);
  
    // const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //   const selectedId = e.target.value;
    //   const selectedOption = users?.find((option) => option._id === selectedId);
    //   if (!selectedOptions.some((option) => option._id === selectedOption?._id)) {
    //     setSelectedOptions([...selectedOptions, selectedOption!]);
    //   }
    // };
    console.log(selectedOptions)
  
    const handleRemoveOption = (index: number) => {
      const updatedOptions = [...selectedOptions];
      updatedOptions.splice(index, 1);
      setSelectedOptions(updatedOptions);
    };
    
  
    // const {data: users, isLoading: isUserLoading, isError} = useQuery({
    //   queryKey: ["allUsers"],
    //   queryFn: async () => {
    //     return client
    //       .get(`/api/user?organisation=${organizationId}&userType=individual`, {})
    //       .then((response: AxiosResponse<customer[], any>) => {
            
    //         return response.data;
    //       })
    //       .catch((error) => {
           
    //         throw error;
    //       })
    //   }
    // })
  
      const selectedIds = selectedOptions.map(option => option._id);
      // console.log('Selected IDs:', selectedIds);
    
  
  
    //   const {mutate: createGroups, isPending: isCreatingGroup, isError: createGroupError} = useMutation({
    //     mutationKey: ["create Group"],
    //     mutationFn: async (groupName:string) => {
    //       return client.post(`/api/user/create-group`, {
    //         groupName: groupName,
    //         groupMember: selectedOptions,
    //         organisation: organizationId
    //       })
    //     },
  
    //       onSuccess(response) {
   
        
    //     setPostingResponse(response.data)
    //     setPostingResponse(
    //       (prev) =>
    //         ({
    //           ...prev,
    //           ["status"]: "success",
    //         }) as postSavingsResponse,
    //     );
    //     console.log("yes")
    //     return response.data;
    //   },
    //   onError(error: any) {
    //     setPostingResponse(error.response.data!)
        
    //     setPostingResponse(
    //       (prev) =>
    //         ({
    //           ...prev,
    //           ["status"]: "failed",
    //         }) as postSavingsResponse,
    //     );
      
    //     throw error;
    //   },
    // })
  
  
      
  
    // useEffect(() => {
    //   if (isError) {
    //     // Handle error
    //     console.error('Error fetching users');
    //   }
    // }, [isError]);
    return (
      <Formik
        initialValues={{
          groupType: 'named group',
          groupName: '',
          groupDescription: '',
          savingsPurpose: '',
          selectedCustomer : []
        }}
        validationSchema={Yup.object({
          groupName: Yup.string().required('Group Name is required'),
          groupDescription: Yup.string().required('Group Description is required'),
          savingsPurpose: Yup.string().required('Savings Purpose is required'),
          selectedCustomers: Yup.array().min(1, 'At least one customer must be selected')
        })}
        onSubmit={(values:{groupName: string}, { setSubmitting }) => {
          console.log(values)
          setTimeout(() => {
            setSubmitting(false);
            
            // createGroups(values.groupName);
  
            // postSavings();
            // onSubmit("confirmation");
  
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mx-auto mt-12 w-[90%] space-y-3 md:w-[60%]">
            {/** Group Name Field */}
  
            <div>
  
            
            <div className="items-center gap-6 md:flex">
              <label htmlFor="groupName" className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
                Group Name:
              </label>
              <Field
                id="groupName"
                name="groupName"
                type="text"
                placeholder="E.g 1million Goal"
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              
            </div>
            <div className="items-center gap-6 md:flex">
              <div className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"></div>
              <ErrorMessage name="groupName" component="div" className="text-red-500 w-full" />
            </div>
            </div>
  
            {/** Group Description Field */}
           
           <div className="">
            <div className="items-center gap-6 md:flex">
              <label htmlFor="groupDescription" className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
                Group description:
              </label> 
              
              <Field
                id="groupDescription"
                name="groupDescription"
                type="text"
                placeholder="Describe..."
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              /> 
             
            </div>
            <div className="items-center gap-6 md:flex">
            <div className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"></div>
                <ErrorMessage name="groupDescription" component="div" className="text-red-500 w-full" />
            </div>
            </div>
  
            {/** Savings Purpose Field */}
            <div>
            <div className="items-center gap-6 md:flex">
              <label htmlFor="savingsPurpose" className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
                Savings Purpose:
              </label>
              <Field
                id="savingsPurpose"
                name="savingsPurpose"
                type="text"
                placeholder="Purpose...."
                className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              
            </div>
            <div className="items-center gap-6 md:flex">
            <div className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"></div>
              <ErrorMessage name="savingsPurpose" component="div" className="text-red-500 w-full" />
            </div>
            </div>
            
  
            {/* Add Customers Field */}
             {/* Add Customers Field */}
             <div className="items-center gap-6 md:flex">
              <label htmlFor="addCustomers" className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">
                Add Customers
              </label>
              <div className="w-full">
                <select
                  className="bg-right-20 mt-1 w-full cursor-pointer appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                //   onChange={handleOptionChange}
                >
                  <option value="">Select an option</option>
                  {/* {users?.map((option) => (
                    <option key={option._id} value={option._id}>{option.firstName} {option.lastName}</option>
                  ))} */}
                </select>
  
                
                <div className="space-x-1 space-y-2">
                  {selectedOptions.map((option, index) => (
                    <div key={index} className="inline-block mr-2 mb-2">
                      <button
                        onClick={() => handleRemoveOption(index)}
                        className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm"
                      >
                        {option.firstName} {option.lastName}
                        <svg
                          className="ml-1 h-3 w-3 text-gray-700 cursor-pointer"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <Field name="selectedCustomers" as="input" type="hidden" value={selectedOptions.map((option) => option._id)} />
                <ErrorMessage name="selectedCustomers" component="div" className="text-red-500" />
              </div>
            </div>
  
            {/** Submit Button */}
            <div className="flex items-center justify-center pb-12 pt-4">
              <span className="hidden w-[20%] md:block">Submit</span>
              <div className="md:flex md:w-[80%] md:justify-center">
                <button
                  type="submit"
                  className="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  };

  export default CreateOranisationGroup
'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { client } from '@/api/hooks/useAuth';
import { MerchantSignUpProps } from '@/types';
import SuccessToaster, { ErrorToaster } from '@/components/toast';
import { useRouter } from 'next/navigation';
import { AxiosError, AxiosResponse } from "axios";
// export const metadata = {
//   title: "Merchant SignUp | Ajo by Raoatech",
//   description: "Create your account",
// };
const validationSchema = Yup.object().shape({
  organisationName: Yup.string()
    .required('Organisation Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\+234\d{10}$/, 'Invalid phone number')
    .required('Phone number is required'),
    prefferedUrl: Yup.string()
  .required(),
    
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
});

const MerchantForm = () => {
  const router = useRouter()
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const initialValues: MerchantSignUpProps = {
    organisationName: '',
    email: '',
    phoneNumber: '',
    prefferedUrl: '',
    password: '',
    confirmPassword: '',
    role: 'organisation'
  };

  const {mutate: MerchantSignUp, isPending, isError} = useMutation({
    mutationKey: ["Merchant sign up"],
    mutationFn: async (values: MerchantSignUpProps) => {
     
      return client.post(`/api/auth/register`, {
        
        organisationName: values.organisationName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        prefferedUrl: values.prefferedUrl,
        role: "organisation"
      
      })
    },
    
    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true)
      console.log(response.data);
      router.push('/signin')
      setSuccessMessage((response as any).response.data.message);
      console.log(successMessage)
    },
    onError(error : AxiosError<any, any>){
      setShowErrorToast(true)
      setErrorMessage(error.response?.data.message)
      // setErrorMessage(error.data)
  
    }
    
  })

  return (
    
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
       
        
        MerchantSignUp(values)
        setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
           setShowSuccessToast(false)
           setShowErrorToast(false)
          setSubmitting(false);
        }, 400);
       
        
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mt-8">
          <div className="mb-8">
         
            <div className="mb-3">
              <label htmlFor="organisation-name" className="m-0 text-xs font-medium text-white">Organisation Name</label>
              <Field type="text" name="organisationName" id="organisation-name" className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]" />
              <ErrorMessage name="organisationName" component="div" className="text-red-500" />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="m-0 text-xs font-medium text-white">Email Address</label>
              <Field type="email" name="email" id="email" className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]" />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNumber" className="m-0 text-xs font-medium text-white">Contact Number <span className="font-base font-semibold text-[#FF0000]">*</span></label>
              <div className="mt-1 flex w-full gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                <span className="flex h-full w-1/5 select-none items-center gap-2 text-gray-400 sm:text-sm">
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-100 f-100"
                  >
                    <path
                      d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
                      fill="white"
                    />
                    <path
                      d="M1 2.05C1 1.60817 1.35817 1.25 1.8 1.25H6.29677C6.7386 1.25 7.09677 1.60817 7.09677 2.05V13.95C7.09677 14.3918 6.7386 14.75 6.29677 14.75H1.8C1.35817 14.75 1 14.3918 1 13.95V2.05ZM12.9032 2.05C12.9032 1.60817 13.2614 1.25 13.7032 1.25H18.2C18.6418 1.25 19 1.60817 19 2.05V13.95C19 14.3918 18.6418 14.75 18.2 14.75H13.7032C13.2614 14.75 12.9032 14.3918 12.9032 13.95V2.05Z"
                      fill="#186648"
                    />
                    <path
                      d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
                      stroke="#131313"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  +234
                </span>
                <Field type="tel" name="phoneNumber" id="phoneNumber" className="w-4/5 bg-transparent outline-none" />
              </div>
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
            </div>

            <div className="mb-3">
              <label htmlFor="prefferedUrl" className="m-0 text-xs font-medium text-white">Preferred  <span className="font-base font-semibold text-[#FF0000]">*</span></label>
              <Field type="string" name="prefferedUrl" id="prefferedUrl" className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]" />
              <ErrorMessage name="prefferedUrl" component="div" className="text-red-500" />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="m-0 text-xs font-medium text-white">Password <span className="font-base font-semibold text-[#FF0000]">*</span></label>
              <Field type="password" name="password" id="password" className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]" />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>

            <div className="mb-3">
              <label htmlFor="confirm-password" className="m-0 text-xs font-medium text-white">Confirm Password <span className="font-base font-semibold text-[#FF0000]">*</span></label>
              <Field type="password" name="confirmPassword" id="confirm-password" className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]" />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
            </div>
          </div>
          <button type="submit" className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

           {/* Conditionally render SuccessToaster component */}
           {showSuccessToast && successMessage && <SuccessToaster message={successMessage ? successMessage : "Account Created successfully!"} />}
           {showErrorToast && errorMessage && errorMessage && <ErrorToaster message={errorMessage? errorMessage : "Error creating organization"} />}
        </Form>
      )}
    </Formik>
    
  );
};

export default MerchantForm;

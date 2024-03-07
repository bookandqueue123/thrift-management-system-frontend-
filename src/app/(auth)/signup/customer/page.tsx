


// 'use client'
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { CustomButton } from '@/components/Buttons';
// import { useRouter } from 'next/navigation';
// import { useMutation } from '@tanstack/react-query';
// import { client } from '@/api/hooks/useAuth';
// import { CustomerSignUpProps } from '@/types';
// import { AxiosError, AxiosResponse } from "axios";
// import { useState } from 'react';
// import SuccessToaster, { ErrorToaster } from '@/components/toast';

// const initialValues: CustomerSignUpProps = {
//   firstName: '',
//   lastName: '',
//   otherName : '',
//   phoneNumber: '',
//   email: '',
//   password: '',
//   confirmPassword: '',
//   // role: "",
//   // organisation:''
// }

// const validationSchema=Yup.object().shape({
//   firstName: Yup.string().required('First Name is required'),
//   lastName: Yup.string().required('Last Name is required'),
//   phoneNumber: Yup.string()
//     // .matches(/^\+234\d{10}$/, 'Invalid phone number')
//     .matches(
//       /^(?:\+234\d{10}|\d{11})$/,
//       'Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long'
//     )
//     .required('Phone number is required'),
//   email: Yup.string().email('Invalid email address').required('Email is required'),
//   password: Yup.string().required('Password is required'),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('password')], 'Passwords must match')
//     .required('Confirm Password is required'),
//   // role: Yup.string().required("Role is required"),
//   // organization: Yup.string()
  
// })
// const organisation = [
//   {
//     "id": 1,
//     "name": "Acme Inc."
//   },
//   {
//     "id": 2,
//     "name": "GreenTech Solutions"
//   },
//   {
//     "id": 3,
//     "name": "Global Innovation Labs"
//   },
//   {
//     "id": 4,
//     "name": "Learning Curve Academy"
//   },
//   {
//     "id": 5,
//     "name": "Community Health Initiative"
//   },
//   {
//     "id": 6,
//     "name": "Wildwood Adventures"
//   },
//   {
//     "id": 7,
//     "name": "Sonar Technologies"
//   },
//   {
//     "id": 8,
//     "name": "Metro Financial Group"
//   },
//   {
//     "id": 9,
//     "name": "Eco-Life Products"
//   },
//   {
//     "id": 10,
//     "name": "People's Choice Awards"
//   }
// ]

// const Page = () => {
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [showErrorToast, setShowErrorToast] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("")
//   const [errorMessage, setErrorMessage] = useState("")

//   const router = useRouter();

//   // const handleSubmit = async (values, { setSubmitting }) => {
//   //   try {
//   //     console.log(values);
     
//   //   } catch (error) {
//   //     console.error('Error creating account:', error);
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

//   const {mutate: CustomerSignUp, isPending, isError} = useMutation({
//     mutationKey: ["customer sign up"],
//     mutationFn: async (values: CustomerSignUpProps) => {
     
//       return client.post(`/api/auth/register`, {
       
//         firstName: values.firstName,
//         lastName: values.lastName,
//         otherName: values.otherName,
//         phoneNumber: values.phoneNumber,
//         email: values.email,
//         password: values.password,
//         role: "customer",
//           organisation: "65ca01a52c8fabbc92aed513"
      
//       })
//     },
    
//     onSuccess(response: AxiosResponse<any, any>) {
//       setShowSuccessToast(true)
//       console.log(response.data);
//       router.push('/signin')
//       setSuccessMessage((response as any).response.data.message);
//       console.log(successMessage)
//     },
//     onError(error : AxiosError<any, any>){
//       setShowErrorToast(true)
//       setErrorMessage(error.response?.data.message)
//       // setErrorMessage(error.data)
  
//     }
    
//   })

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={(values, { setSubmitting }) => {
//        console.log(values)
//         CustomerSignUp(values)
//         setTimeout(() => {
//           // alert(JSON.stringify(values, null, 2));
//            setShowSuccessToast(false)
//            setShowErrorToast(false)
//           setSubmitting(false);
//         }, 400);
      
        
//       }}
//     >
//       {({isSubmitting}) => (

      
//       <Form className="mt-8">
//         <div className="mb-8">
//           <div className="flex w-full items-center justify-between gap-4">
//             <div className="mb-3 w-1/2">
//               <label htmlFor="firstName" className="m-0 text-xs font-medium text-white">
//                 First Name{' '}
//                 <span className="font-base font-semibold text-[#FF0000]">*</span>
//               </label>
//               <Field
//                 id="firstName"
//                 name="firstName"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//               <ErrorMessage name="firstName" component="div" className="text-red-500" />
//             </div>
//             <div className="mb-3 w-1/2">
//               <label htmlFor="lastName" className="m-0 text-xs font-medium text-white">
//                 Last Name{' '}
//                 <span className="font-base font-semibold text-[#FF0000]">*</span>
//               </label>
//               <Field
//                 id="lastName"
//                 name="lastName"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//               <ErrorMessage name="lastName" component="div" className="text-red-500" />
//             </div>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="otherName" className="m-0 text-xs font-medium text-white">
//               Other Names
//             </label>
//             <Field
//               id="otherName"
//               name="otherName"
//               type="text"
//               className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="phoneNumber" className="m-0 text-xs font-medium text-white">
//               Phone Number{' '}
//               <span className="font-base font-semibold text-[#FF0000]">*</span>
//             </label>
//             <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
//               {/* <span className="flex h-full select-none items-center gap-2 text-gray-400 sm:text-sm">
//                 <svg
//                   width="20"
//                   height="16"
//                   viewBox="0 0 20 16"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-100 f-100"
//                 >
//                   <path
//                     d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M1 2.05C1 1.60817 1.35817 1.25 1.8 1.25H6.29677C6.7386 1.25 7.09677 1.60817 7.09677 2.05V13.95C7.09677 14.3918 6.7386 14.75 6.29677 14.75H1.8C1.35817 14.75 1 14.3918 1 13.95V2.05ZM12.9032 2.05C12.9032 1.60817 13.2614 1.25 13.7032 1.25H18.2C18.6418 1.25 19 1.60817 19 2.05V13.95C19 14.3918 18.6418 14.75 18.2 14.75H13.7032C13.2614 14.75 12.9032 14.3918 12.9032 13.95V2.05Z"
//                     fill="#186648"
//                   />
//                   <path
//                     d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
//                     stroke="#131313"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 +234
//               </span> */}
//               <Field
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 type="tel"
//                 className="bg-transparent outline-none"
//               />
//             </div>
//             <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="email" className="m-0 text-xs font-medium text-white">
//               Email address <span className="font-base font-semibold text-[#FF0000]">*</span>
//             </label>
//             <Field
//               id="email"
//               name="email"
//               type="email"
//               className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//             />
//             <ErrorMessage name="email" component="div" className="text-red-500" />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="password" className="m-0 text-xs font-medium text-white">
//               Password{' '}
//               <span className="font-base font-semibold text-[#FF0000]">*</span>
//             </label>
//             <Field
//               id="password"
//               name="password"
//               type="password"
//               className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//             />
//             <ErrorMessage name="password" component="div" className="text-red-500" />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="confirmPassword" className="m-0 text-xs font-medium text-white">
//               Confirm Password{' '}
//               <span className="font-base font-semibold text-[#FF0000]">*</span>
//             </label>
//             <Field
//               id="confirmPassword"
//               name="confirmPassword"
//               type="password"
//               className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//             />
//             <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
//           </div>
//         </div>
//         <CustomButton
//           type="submit"
//           style="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
//           label={isSubmitting ? 'Creating account...' : 'Create account'}
//         />
//         {showSuccessToast && successMessage && <SuccessToaster message={successMessage ? successMessage : "Account Created successfully!"} />}
//            {showErrorToast && errorMessage && errorMessage && <ErrorToaster message={errorMessage? errorMessage : "Error creating organization"} />}
//       </Form>
//       )}
//     </Formik>
//   );
// };

// export default Page;

'use client'

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CustomButton } from '@/components/Buttons';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '@/api/hooks/useAuth';
import { CustomerSignUpProps, customer } from '@/types';
import { AxiosError, AxiosResponse } from 'axios';
import SuccessToaster, { ErrorToaster } from '@/components/toast';

const initialValues: CustomerSignUpProps = {
  firstName: '',
  lastName: '',
  otherName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  organization: '',
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  phoneNumber: Yup.string()
    .matches(
      /^(?:\+234\d{10}|\d{11})$/,
      'Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long'
    )
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  organization: Yup.string().required('Organization is required'),
});


const Page = () => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredOrganisations, setFilteredOrganisations] = useState([]);

  const router = useRouter();

  const { mutate: CustomerSignUp, isPending, isError } = useMutation({
    mutationKey: ['customer sign up'],
    mutationFn: async (values: CustomerSignUpProps) => {
      return client.post(`/api/auth/register`, {
        ...values,
        role: 'customer',
      });
    },
    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true);
      setSuccessMessage(response.data.message);
      router.push('/signin');
    },
    onError(error: AxiosError<any, any>) {
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message || 'Error creating organization');
    },
    
  });

  // const handleSearchChange = (e, setFieldValue) => {
  //   const value = e.target.value.toLowerCase();
  //   const filtered = organisation.filter((org) => org.name.toLowerCase().includes(value));
  //   setFilteredOrganisations(filtered);
  // };

  // const handleOrganizationClick = (orgId, setFieldValue) => {
  //   const org = organisation.find((o) => o.id === orgId);
  //   if (org) {
  //     setFieldValue('organization', org.name);
  //     setFilteredOrganisations([]);
  //   }
  // };

  const {data: groups, isLoading: isUserLoading, isError: getGroupError} = useQuery({
    queryKey: ["allgroups", ],
    queryFn: async () => {
      return client
        .get(`/api/user?userType=group`, {})
        .then((response) => {
          console.log(response.data)
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        })
    }
  })
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        CustomerSignUp(values);
        setTimeout(() => {
          setShowSuccessToast(false);
          setShowErrorToast(false);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="mt-8">
                  <div className="mb-8">
           <div className="flex w-full items-center justify-between gap-4">
             <div className="mb-3 w-1/2">
               <label htmlFor="firstName" className="m-0 text-xs font-medium text-white">
                 First Name{' '}
                 <span className="font-base font-semibold text-[#FF0000]">*</span>
               </label>
               <Field
                id="firstName"
                name="firstName"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500" />
            </div>
            <div className="mb-3 w-1/2">
              <label htmlFor="lastName" className="m-0 text-xs font-medium text-white">
                Last Name{' '}
                <span className="font-base font-semibold text-[#FF0000]">*</span>
              </label>
              <Field
                id="lastName"
                name="lastName"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500" />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="otherName" className="m-0 text-xs font-medium text-white">
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
            <label htmlFor="phoneNumber" className="m-0 text-xs font-medium text-white">
              Phone Number{' '}
              <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
              {/* <span className="flex h-full select-none items-center gap-2 text-gray-400 sm:text-sm">
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
              </span> */}
              <Field
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="bg-transparent outline-none"
              />
            </div>
            <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="m-0 text-xs font-medium text-white">
              Email address <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            />
            <ErrorMessage name="email" component="div" className="text-red-500" />
          </div>

          {/* Organization Search Input */}
          {
            groups && (
              <div className="mb-3">
            <label htmlFor="organization" className="m-0 text-xs font-medium text-white">
              Organization <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <Field
              as="select"
              id="organization"
              name="organization"
              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            >
              <option value="">Select Organization</option>
              {groups?.map((org:customer) => (
                <option key={org._id} value={org._id}>
                  {org.groupName}
                </option>
              ))}
            </Field>
            <ErrorMessage name="organization" component="div" className="text-red-500" />
          </div>
            )
          }

          <div className="mb-3">
            <label htmlFor="password" className="m-0 text-xs font-medium text-white">
              Password{' '}
              <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            />
            <ErrorMessage name="password" component="div" className="text-red-500" />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="m-0 text-xs font-medium text-white">
              Confirm Password{' '}
              <span className="font-base font-semibold text-[#FF0000]">*</span>
            </label>
            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            />
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
          </div>
        </div>
        {/* <CustomButton
          type="submit"
          style="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
          label={isSubmitting ? 'Creating account...' : 'Create account'}
        />
        {showSuccessToast && successMessage && <SuccessToaster message={successMessage ? successMessage : "Account Created successfully!"} />}
           {showErrorToast && errorMessage && errorMessage && <ErrorToaster message={errorMessage? errorMessage : "Error creating organization"} />}
 */}

          
          

          {/* Submit Button */}
          <CustomButton
            type="submit"
            style="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
            label={isSubmitting ? 'Creating account...' : 'Create account'}
          />

          {/* Toast Messages */}
          {showSuccessToast && <SuccessToaster message={successMessage || 'Account Created successfully!'} />}
          {showErrorToast && <ErrorToaster message={errorMessage || 'Error creating organization'} />}
        </Form>
      )}
    </Formik>
  );
};

export default Page;

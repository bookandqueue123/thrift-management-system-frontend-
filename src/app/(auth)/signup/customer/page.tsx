// "use client";
// import { CustomButton } from "@/components/Buttons";
// import { useRouter } from "next/navigation";


// const Page = () => {
//   const router = useRouter();

//   const handleSubmit = async (event: { preventDefault: () => void }) => {
//     event.preventDefault();
//     try {
//       console.log("Account Created!");
//       router.push("/customer");
//     } catch (error) {
//       console.error("Error creating account:", error);
//     }
//   };
//   return (
//     <form className="mt-8" onSubmit={handleSubmit}>
//       <div className="mb-8">
//         <div className="flex w-full items-center justify-between gap-4">
//           <div className="mb-3 w-1/2">
//             <label
//               htmlFor="fName"
//               className="m-0 text-xs font-medium text-white"
//             >
//               First Name{" "}
//               <span className="font-base font-semibold text-[#FF0000]">*</span>
//             </label>
//             <input
//               id="fname"
//               name="fname"
//               required
//               type="text"
//               className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//             />
//           </div>
//           <div className="mb-3 w-1/2">
//             <label
//               htmlFor="lName"
//               className="m-0 text-xs font-medium text-white"
//             >
//               Last Name{" "}
//               <span className="font-base font-semibold text-[#FF0000]">*</span>
//             </label>
//             <input
//               id="lname"
//               name="lname"
//               type="text"
//               required
//               className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//             />
//           </div>
//         </div>

//         <div className="mb-3">
//           <label
//             htmlFor="otherNames"
//             className="m-0 text-xs font-medium text-white"
//           >
//             Other Names
//           </label>
//           <input
//             id="other-names"
//             name="other-names"
//             type="text"
//             className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//           />
//         </div>

//         <div className="mb-3">
//           <label htmlFor="phone" className="m-0 text-xs font-medium text-white">
//             Phone Number{" "}
//             <span className="font-base font-semibold text-[#FF0000]">*</span>
//           </label>
//           <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
//             <span className="flex h-full select-none items-center gap-2 text-gray-400 sm:text-sm">
//               <svg
//                 width="20"
//                 height="16"
//                 viewBox="0 0 20 16"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-100 f-100"
//               >
//                 <path
//                   d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
//                   fill="white"
//                 />
//                 <path
//                   d="M1 2.05C1 1.60817 1.35817 1.25 1.8 1.25H6.29677C6.7386 1.25 7.09677 1.60817 7.09677 2.05V13.95C7.09677 14.3918 6.7386 14.75 6.29677 14.75H1.8C1.35817 14.75 1 14.3918 1 13.95V2.05ZM12.9032 2.05C12.9032 1.60817 13.2614 1.25 13.7032 1.25H18.2C18.6418 1.25 19 1.60817 19 2.05V13.95C19 14.3918 18.6418 14.75 18.2 14.75H13.7032C13.2614 14.75 12.9032 14.3918 12.9032 13.95V2.05Z"
//                   fill="#186648"
//                 />
//                 <path
//                   d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
//                   stroke="#131313"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//               +234
//             </span>
//             <input
//               id="phone"
//               name="phone"
//               type="tel"
//               required
//               className="bg-transparent outline-none"
//             />
//           </div>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="email" className="m-0 text-xs font-medium text-white">
//             Email address
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//           />
//         </div>

//         <div className="mb-3">
//           <label
//             htmlFor="password"
//             className="m-0 text-xs font-medium text-white"
//           >
//             Password{" "}
//             <span className="font-base font-semibold text-[#FF0000]">*</span>
//           </label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             required
//             className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//           />
//         </div>
//         <div className="mb-3">
//           <label
//             htmlFor="confirmPassword"
//             className="m-0 text-xs font-medium text-white"
//           >
//             Confirm Password{" "}
//             <span className="font-base font-semibold text-[#FF0000]">*</span>
//           </label>
//           <input
//             id="confirm-password"
//             name="confirm-password"
//             type="confirm-password"
//             required
//             className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//           />
//         </div>
//       </div>
//       <CustomButton
//         type="submit"
//         style="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
//         label="Create account"
//       />
//     </form>
//   );
// };

// export default Page;


'use client'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CustomButton } from '@/components/Buttons';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { client } from '@/api/hooks/useAuth';
import { CustomerSignUpProps } from '@/types';
import { AxiosError, AxiosResponse } from "axios";
import { useState } from 'react';
import SuccessToaster, { ErrorToaster } from '@/components/toast';

const initialValues: CustomerSignUpProps = {
  firstName: '',
  lastName: '',
  otherName : '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  // role: "",
  // organisation:''
}
const Page = () => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter();

  // const handleSubmit = async (values, { setSubmitting }) => {
  //   try {
  //     console.log(values);
     
  //   } catch (error) {
  //     console.error('Error creating account:', error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const {mutate: CustomerSignUp, isPending, isError} = useMutation({
    mutationKey: ["customer sign up"],
    mutationFn: async (values: CustomerSignUpProps) => {
     
      return client.post(`/api/auth/register`, {
       
        firstName: values.firstName,
        lastName: values.lastName,
        otherName: values.otherName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        role: "customer",
          organisation: "65ca01a52c8fabbc92aed513"
      
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
      // validationSchema={Yup.object({
      //   firstName: Yup.string().required('First Name is required'),
      //   lastName: Yup.string().required('Last Name is required'),
      //   phone: Yup.string().required('Phone Number is required'),
      //   email: Yup.string().email('Invalid email address'),
      //   password: Yup.string().required('Password is required'),
      //   confirmPassword: Yup.string()
      //     .oneOf([Yup.ref('password'), null], 'Passwords must match')
      //     .required('Confirm Password is required'),
      //   // role: Yup.string().required("Role is required"),
      //   // organization: Yup.string()
        
      // })}
      onSubmit={(values, { setSubmitting }) => {
       console.log(values)
        CustomerSignUp(values)
        setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
           setShowSuccessToast(false)
           setShowErrorToast(false)
          setSubmitting(false);
        }, 400);
       
        
      }}
    >
      {({isSubmitting}) => (

      
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
              <span className="flex h-full select-none items-center gap-2 text-gray-400 sm:text-sm">
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
              Email address
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
            />
            <ErrorMessage name="email" component="div" className="text-red-500" />
          </div>

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
        <CustomButton
          type="submit"
          style="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
          label={isSubmitting ? 'Creating account...' : 'Create account'}
        />
        {showSuccessToast && successMessage && <SuccessToaster message={successMessage ? successMessage : "Account Created successfully!"} />}
           {showErrorToast && errorMessage && errorMessage && <ErrorToaster message={errorMessage? errorMessage : "Error creating organization"} />}
      </Form>
      )}
    </Formik>
  );
};

export default Page;

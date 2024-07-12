// 'use client'
// import React from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useMutation } from '@tanstack/react-query';
// import { useAuth } from '@/api/hooks/useAuth';
// import { ModalConfirmation } from '@/components/Modal';

// interface CategoryFormValuesProps {
//     name: string;
//     description: string;
//   }
// export default function CreateCategory(){
//     const { client } = useAuth();
//     const initialValues: CategoryFormValuesProps = {
//         name: '',
//         description: '',
//       };
    
//       const validationSchema = Yup.object({
//         name: Yup.string()
//           .max(50, 'Name must be 50 characters or less')
//           .required('Name is required'),
//         description: Yup.string()
//           .max(200, 'Description must be 200 characters or less')
//           .required('Description is required'),
//       });
    
//       const handleSubmit = (values: CategoryFormValuesProps) => {
//         console.log(values);
//         // Submit form values to your API or perform other actions
//       };

//       const {
//         mutate: CreateCategory,
//         isPending,
//         isError,
//       } = useMutation({
//         mutationKey: ["Create category"],
//         mutationFn: async (values:CategoryFormValuesProps) => {
//           return client.post(`/api/categories`, {
//             name: values.name,
//             description: values.description
//           });
//         },
    
//         onSuccess(response) {
//             console.log(response, "response")
//           ModalConfirmation({
//             responseMessage: "Created successfully",
//             status: "success",
//             successTitle: "",
//             errorTitle: ""
//           })
//         },
//         onError(error) {
          
//         },
//       });
    
//     return(
//         <div className="ml-[20%]">
//             <div className="mb-4 space-y-2">
//                 <h6 className="text-base font-bold text-ajo_offWhite opacity-60">
//                 Purpose/Item
//                 </h6>
//                 <p className="text-sm text-ajo_offWhite">
//                 Create Category Page (Purpose/Item)              
//                 </p>
//             </div>

//             <div>
//             <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={(values, { setSubmitting }) => {
//         CreateCategory(values);

//         setSubmitting(false);
//       }}
//     >
//       {({ isSubmitting }) => (
//         <Form>
//          <div className='p-[5%] bg-ajo_purple'>
//          <div >
//             <label htmlFor="name" className='text-white'>Name</label>
//             <Field
//              type="text"
//               id="name" 
//               name="name" 
//               className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white "
//               />
//             <ErrorMessage className='text-red-500' name="name" component="div" />
//           </div>

//           <div className='my-[3%]'> 
//             <label className='text-white' htmlFor="description">Description</label>
//             <Field 
//             as="textarea" 
//             id="description" 
//             name="description" 
//             className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-sm text-[#7D7D7D]"
//             />
//             <ErrorMessage className='text-red-500' name="description" component="div" />
//           </div>

//           <div className="flex justify-center md:w-[100%] mb-8">
//             <button type="submit" 
//              className="w-1/2 rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
//             disabled={isSubmitting}>
//               Submit
//             </button>
//           </div>
//          </div>
//         </Form>
//       )}
//     </Formik>
//             </div>
//         </div>
//     )
// }
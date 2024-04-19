// import { useAuth } from "@/api/hooks/useAuth";
// import { CustomButton } from "@/components/Buttons";
// import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
// import { FormErrors, FormValues, customer } from "@/types";
// import { Dispatch } from "@reduxjs/toolkit";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { AxiosResponse } from "axios";
// import Image from "next/image";
// import { SetStateAction, useState } from "react";
// import { useSelector } from "react-redux";

// // interface SetUpSavingsProps {
// //     setContent: Dispatch<SetStateAction<"form" | "confirmation">>;
// //     content: "form" | "confirmation";
// //     closeModal: Dispatch<SetStateAction<boolean>>;
// //   }
//   const CreateCommissionForm = () => {
//     const organizationId = useSelector(selectOrganizationId);
//     console.log(organizationId);
//     const { client } = useAuth();
//     const [selectedOptions, setSelectedOptions] = useState<customer[]>([]);
//     const [displayConfirmationModal, setDisplayConfirmationMedal] =
//       useState(false);
//     const [saveDetails, setSaveDetails] = useState({
//       savingsType: "named group",
//       purposeName: "",
//       amount: "",
//       startDate: "",
//       endDate: "",
//       collectionDate: "",
//       frequency: "",
//       // group:
//     });
  
//     const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const { name, value } = e.target as
//         | HTMLInputElement
//         | HTMLSelectElement
//         | HTMLTextAreaElement;
//       setFormValues({ ...formValues, [name]: value });
//       setFormErrors({
//         ...formErrors,
//         [name]: validateField(
//           name,
//           value,
//           saveDetails.savingsType as "named group" | "nameless group",
//         ),
//       });
  
//       const selectedId = value;
//       const selectedOption = users?.find((option: { _id: string; }) => option._id === selectedId);
//       if (!selectedOptions.some((option) => option._id === selectedOption?._id)) {
//         setSelectedOptions([...selectedOptions, selectedOption!]);
//       }
//     };
//     const handleRemoveOption = (index: number) => {
//       const updatedOptions = [...selectedOptions];
//       updatedOptions.splice(index, 1);
//       setSelectedOptions(updatedOptions);
//     };
  
//     const {
//       data: users,
//       isLoading: isUserLoading,
//       isError,
//     } = useQuery({
//       queryKey: ["allUsers", saveDetails.savingsType],
//       queryFn: async () => {
//         const endpoint =
//           saveDetails.savingsType === "named group"
//             ? `/api/user?organisation=${organizationId}&userType=group`
//             : `/api/user?organisation=${organizationId}&userType=individual`;
  
//         return client
//           .get(endpoint, {})
//           .then((response: AxiosResponse<customer[], any>) => {
//             console.log(response.data);
//             return response.data;
//           })
//           .catch((error) => {
//             console.log(error);
//             throw error;
//           });
//       },
//     });
  
//     const selectedIds = selectedOptions.map((option) => option._id);
//     const groupId = selectedIds[0];
//     console.log(selectedIds);
//     const { mutate: postNamedGroups } = useMutation({
//       mutationFn: async () => {
//         const unNamedPayload = {
//           purposeName: saveDetails.purposeName,
//           amount: saveDetails.amount,
//           startDate: saveDetails.startDate,
//           endDate: saveDetails.endDate,
//           collectionDate: saveDetails.collectionDate,
//           organisation: organizationId,
//           frequency: saveDetails.frequency,
//           users: selectedIds,
//         };
//         const namedPayload = {
//           purposeName: saveDetails.purposeName,
//           amount: saveDetails.amount,
//           startDate: saveDetails.startDate,
//           endDate: saveDetails.endDate,
//           collectionDate: saveDetails.collectionDate,
//           organisation: organizationId,
//           frequency: saveDetails.frequency,
//           group: groupId,
//         };
//         const payload =
//           saveDetails.savingsType === "named group"
//             ? namedPayload
//             : unNamedPayload;
//         return client.post(`/api/saving`, payload);
//       },
//       onSuccess: (response) => {
//         // console.log(response);
//         console.log("User created successfully");
//         // setContent("confirmation");
//         setDisplayConfirmationMedal(true);
//         console.log(displayConfirmationModal);
//         // console.log(response);
//       },
//       onError: (error) => {
//         console.log(saveDetails.amount);
//         // setContent("confirmation")
//         // setDisplayConfirmationMedal(true)
//         console.error("Error creating user:", error);
//         throw error;
//       },
//     });
  
//     const unnamedInitialValues = {
//       purposeName: "",
//       amount: "",
//       startDate: "",
//       endDate: "",
//       collectionDate: "",
//       frequency: "",
//       addCustomers: [],
//     };
  
//     const namedInitialValues = {
//       purposeName: "",
//       amount: "",
//       startDate: "",
//       endDate: "",
//       collectionDate: "",
//       frequency: "",
//       chosenGroup: "",
//     };
  
//     const initialValues =
//       saveDetails.savingsType === "named group"
//         ? namedInitialValues
//         : unnamedInitialValues;
  
//     // Input Validation States
//     const [formValues, setFormValues] = useState<FormValues>(initialValues);
//     const [formErrors, setFormErrors] = useState<FormErrors >({});
//     const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({});
  
//     const validateField = (
//       name: string,
//       value: string,
//       savingType: "named group" | "nameless group",
//     ) => {
//       switch (name) {
//         case "purposeName":
//           if (!value.trim()) return "Savings purpose is required";
//           break;
//         case "amount":
//           if (!value.trim()) return "Amount is required";
//           if (isNaN(Number(value))) return "Amount must be a number";
//           if (Number(value) <= 0) return "Amount must be greater than zero";
//           break;
//         case "startDate":
//         case "endDate":
//         case "collectionDate":
//           if (!value.trim()) return "Date is required";
//           // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//           // if (!dateRegex.test(value))
//           //   return "Invalid date format, use YYYY-MM-DD";
//           // Additional validation for past dates could be added here
//           break;
//         case "frequency":
//           if (!value.trim()) return "Frequency is required";
//           // Add specific frequency validation if needed
//           break;
//         case "chosenGroup":
//           if (savingType === "named group" && !value.trim())
//             return "At least one group is required";
//           break;
//         case "addCustomers":
//           if (selectedIds.length === 0) return "At least one user is required";
//           break;
  
//         default:
//           return "";
//       }
  
//       // if (savingType === "named group" && !!formValues.addCustomers === true) {
//       //   return "Groups should be empty for individuals";
//       // }
//       // if (savingType !== "named group" && !!formValues.group === true) {
//       //   return "Customers should be empty for groups";
//       // }
//       return "";
//     };
  
//     const handleInputChange = (e: React.ChangeEvent<HTMLElement>) => {
//       const { name, value } = e.target as
//         | HTMLInputElement
//         | HTMLSelectElement
//         | HTMLTextAreaElement;
//       setFormValues({ ...formValues, [name]: value });
//       setFormErrors({
//         ...formErrors,
//         [name]: validateField(
//           name,
//           value,
//           saveDetails.savingsType as "named group" | "nameless group",
//         ),
//       });
  
//       // Initialize a variable to hold the processed value (initially, it's the same as the input value)
//       let processedValue = value;
  
//       // If the input field is 'amount', remove commas and convert it to a number
//       if (name === "amount") {
//         // Remove commas from the value using a regular expression
//         const unformattedValue = value.replace(/,/g, "");
//         // Parse the string to a floating point number
//         processedValue = parseFloat(unformattedValue).toString();
//       }
  
//       // Update the state 'saveDetails' with the new value, keeping previous state intact
//       setSaveDetails((prev) => ({ ...prev, [name]: processedValue }));
//     };
  
//     const handleInputFocus = (e: React.FocusEvent<HTMLElement>) => {
//       const { name, value } = e.target as
//         | HTMLInputElement
//         | HTMLSelectElement
//         | HTMLTextAreaElement;
//       setIsTouched({ ...isTouched, [name]: true });
//       setFormValues({ ...formValues, [name]: value });
//       setFormErrors({
//         ...formErrors,
//         [name]: validateField(
//           name,
//           value,
//           saveDetails.savingsType as "named group" | "nameless group",
//         ),
//       });
//     };
  
//     const onSubmitHandler = (e: React.FormEvent) => {
//       // console.log(saveDetails);
//       // console.log(organizationId);
//       // console.log(selectedIds);
  
//       e.preventDefault();
  
//       let isValid = true;
//       const newErrors: FormErrors = {};
  
//       Object.keys(formValues).forEach((key) => {
//         const error = validateField(
//           key,
//           formValues[key],
//           saveDetails.savingsType as "named group" | "nameless group",
//         );
//         if (error) {
//           isValid = false;
//           newErrors[key] = error;
//         }
//       });
  
//       setFormErrors((prevErrors) => {
//         return newErrors;
//       });
  
//       if (isValid) {
//         console.log("Form is valid, submitting...");
//         postNamedGroups();
//       } else {
//         console.log(formErrors);
//         console.log("Form is invalid, showing errors...");
//       }
  
//       // onSubmit("confirmation");
//     };
//     return (
//       <div>
//         {displayConfirmationModal ? (
//           <div className="mx-auto mt-[10%] flex h-full w-1/2 flex-col items-center justify-center space-y-8">
//             <Image
//               src="/check-circle.svg"
//               alt="check-circle"
//               width={162}
//               height={162}
//               className="w-[6rem] md:w-[10rem]"
//             />
//             <p className="whitespace-nowrap text-ajo_offWhite">
//               Savings Set Up Successful
//             </p>
//             <CustomButton
//               type="button"
//               label="Close"
//               style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[40%]"
//             //   onButtonClick={() => closeModal(false)}
//             />
//           </div>
//         ) : (
//           <form
//             className="mx-auto mt-12 w-[90%] space-y-3 md:w-[60%]"
//             onSubmit={onSubmitHandler}
//           >
//             <div className="items-center gap-6  md:flex">
//               <label
//                 htmlFor="check-group"
//                 className="m-0 w-[16%] text-xs font-medium text-white"
//               >
//                 Organisation Type
//               </label>
//               <div
//                 id="check-group"
//                 className="my-3 flex w-[80%] items-center justify-start gap-8"
//               >
//                 <span className="flex items-center gap-2">
//                   <input
//                     id="named group"
//                     name="savingsType"
//                     type="radio"
//                     className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
//                     onChange={() => {
//                       setSaveDetails((prev) => ({
//                         ...prev,
//                         ["savingsType"]: "named group",
//                       }));
//                     }}
//                     checked={saveDetails.savingsType === "named group"}
//                     required
//                   />
//                   <label
//                     htmlFor="named group"
//                     className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
//                   >
//                     Group of Organisation
//                   </label>
//                 </span>
//                 <span className="flex items-center gap-2">
//                   <input
//                     id="nameless group"
//                     name="savingsType"
//                     type="radio"
//                     className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
//                     onChange={() => {
//                       setSaveDetails((prev) => ({
//                         ...prev,
//                         ["savingsType"]: "nameless group",
//                       }));
//                     }}
//                     required
//                     checked={saveDetails.savingsType === "nameless group"}
//                   />
//                   <label
//                     htmlFor="nameless group"
//                     className="m-0 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite"
//                   >
//                     An Organisation
//                   </label>
//                 </span>
//               </div>
//             </div>
  
           
//             {saveDetails.savingsType === "named group" && (
//               <div className="items-center gap-6 md:flex">
//                 <label
//                   htmlFor="chosenGroup"
//                   className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//                 >
//                   Group:
//                 </label>
//                 <span className="w-full">
//                   <select
//                     id="chosenGroup"
//                     name="chosenGroup"
//                     className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
//                     onChange={handleOptionChange}
//                     onFocus={handleInputFocus}
//                     required
//                   >
//                     <option className="hidden lowercase text-opacity-10">
//                       Select a group
//                     </option>
//                     {users?.map((option: customer) => (
//                       <option key={option._id} value={option._id}>
//                         {option.groupName}
//                       </option>
//                     ))}
//                   </select>
//                   {(isTouched.chosenGroup || formErrors.chosenGroup) && (
//                     <p className="mt-2 text-sm font-semibold text-red-600">
//                       {formErrors.chosenGroup}
//                     </p>
//                   )}
//                 </span>
//               </div>
//             )}
  
//             {saveDetails.savingsType === "nameless group" && (
//               // <MultiSelectDropdown
//               //         options={["Option 1", "Option 2", "Option 3"]}
//               //         label="Add Customers: "
//               //         placeholder="Choose customers"
//               //       />
  
//               <div className="items-center gap-6 md:flex">
//                 <label
//                   htmlFor="addCustomers"
//                   className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//                 >
//                   Add Customers
//                 </label>
  
//                 <div className="w-full">
//                   <span className="w-full">
//                     <select
//                       id="addCustomers"
//                       name="addCustomers"
//                       className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
//                       onChange={handleOptionChange}
//                       onFocus={handleInputFocus}
//                     >
//                       <option className="hidden lowercase text-opacity-10">
//                         Select an option
//                       </option>
//                       {users?.map((option) => (
//                         <option key={option._id} value={option._id}>
//                           {option.firstName} {option.lastName}{" "}
//                         </option>
//                       ))}
//                     </select>
  
//                     {(isTouched.addCustomers || formErrors.addCustomers) && selectedIds.length === 0 && (
//                       <p className="mt-2 text-sm font-semibold text-red-600">
//                         {formErrors.addCustomers}
//                       </p>
//                     )}
//                   </span>
  
//                   <div className="space-x-1 space-y-2">
//                     {selectedOptions.map((option, index) => (
//                       <div key={index} className="mb-2 mr-2 inline-block">
//                         <button
//                           onClick={() => handleRemoveOption(index)}
//                           className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm"
//                         >
//                           {option.firstName} {option.lastName}
//                           <svg
//                             className="ml-1 h-3 w-3 cursor-pointer text-gray-700"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M6 18L18 6M6 6l12 12"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
  
//             <div className="items-center gap-6 md:flex">
//               <label
//                 htmlFor="amount"
//                 className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//               >
//                 Savings Amount:
//               </label>
//               <span className="w-full">
//                 <input
//                   id="amount"
//                   name="amount"
//                   placeholder="0000.00 NGN"
//                   type="text"
//                   className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//                   onChange={(event) => {
//                     const { name, value } = event.target;
//                     setFormValues({ ...formValues, [name]: value });
//                     setFormErrors({
//                       ...formErrors,
//                       [name]: validateField(
//                         name,
//                         value,
//                         saveDetails.savingsType as
//                           | "named group"
//                           | "nameless group",
//                       ),
//                     });
//                     const input = event.target.value.replace(/\D/g, "");
//                     const formatted = Number(input).toLocaleString();
//                     setSaveDetails((prev) => ({
//                       ...prev,
//                       ["amount"]: input,
//                     }));
//                   }}
//                   onFocus={handleInputFocus}
//                   required
//                 />
//                 {(isTouched.amount || formErrors.amount) && (
//                   <p className="mt-2 text-sm font-semibold text-red-600">
//                     {formErrors.amount}
//                   </p>
//                 )}
//               </span>
//             </div>
//             <div className="items-center gap-6 md:flex">
//               <label
//                 htmlFor="frequency"
//                 className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//               >
//                 Savings Frequency:
//               </label>
//               <span className="w-full">
//                 <select
//                   id="frequency"
//                   name="frequency"
//                   className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 capitalize text-[#7D7D7D]"
//                   onChange={handleInputChange}
//                   onFocus={handleInputFocus}
//                   required
//                 >
//                   <option className="hidden">Select frequency</option>
  
//                   <option className="capitalize">daily</option>
//                   <option className="capitalize">weekly</option>
//                   <option className="capitalize">monthly</option>
//                   <option className="capitalize">quarterly</option>
//                 </select>
//                 {(isTouched.frequency || formErrors.frequency) && (
//                   <p className="mt-2 text-sm font-semibold text-red-600">
//                     {formErrors.frequency}
//                   </p>
//                 )}
//               </span>
//             </div>
//             <p className="mt-6 text-sm text-ajo_offWhite text-opacity-60">
//               Savings Duration (Kindly select the range this savings is to last)
//             </p>
//             <div className="flex w-full items-center justify-between gap-x-8">
//               <div className="w-[50%] items-center gap-6 md:flex md:w-[60%]">
//                 <label
//                   htmlFor="startDate"
//                   className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white md:w-[43%]"
//                 >
//                   Start Date:
//                 </label>
//                 <span className="w-full">
//                   <input
//                     id="startDate"
//                     name="startDate"
//                     type="date"
//                     className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
//                     onChange={handleInputChange}
//                     onFocus={handleInputFocus}
//                     required
//                   />
//                   {(isTouched.startDate || formErrors.startDate) && (
//                     <p className="mt-2 text-sm font-semibold text-red-600">
//                       {formErrors.startDate}
//                     </p>
//                   )}
//                 </span>
//               </div>
//               <div className="w-[50%] items-center gap-6 md:flex md:w-[40%]">
//                 <label
//                   htmlFor="endDate"
//                   className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//                 >
//                   End Date:
//                 </label>
//                 <span className="w-full">
//                   <input
//                     id="endDate"
//                     name="endDate"
//                     type="date"
//                     className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
//                     onChange={handleInputChange}
//                     onFocus={handleInputFocus}
//                     required
//                   />
//                   {(isTouched.endDate || formErrors.endDate) && (
//                     <p className="mt-2 text-sm font-semibold text-red-600">
//                       {formErrors.endDate}
//                     </p>
//                   )}
//                 </span>
//               </div>
//             </div>
//             <div className="items-center gap-6 md:flex">
//               <label
//                 htmlFor="collectionDate"
//                 className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
//               >
//                 Collection Date:
//               </label>
//               <span className="w-full">
//                 <input
//                   id="collectionDate"
//                   name="collectionDate"
//                   type="date"
//                   className="bg-right-20 w-full appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] md:bg-none"
//                   onChange={handleInputChange}
//                   onFocus={handleInputFocus}
//                   required
//                 />
//                 {(isTouched.collectionDate || formErrors.collectionDate) && (
//                   <p className="mt-2 text-sm font-semibold text-red-600">
//                     {formErrors.collectionDate}
//                   </p>
//                 )}
//               </span>
//             </div>
  
//             <div className="flex items-center justify-center pb-12 pt-4">
//               <span className="hidden w-[20%] md:block">Submit</span>
//               <div className="md:flex md:w-[80%] md:justify-center">
//                 <CustomButton
//                   type="button"
//                   label="Submit"
//                   style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
//                   onButtonClick={onSubmitHandler}
//                 />
//               </div>
//             </div>
//           </form>
//         )}
//       </div>
//     );
//   };
  
//   export default CreateCommissionForm


import { CustomButton } from '@/components/Buttons';
import { useState } from 'react';

const CreateCommissionForm: React.FC = () => {
  const [formValues, setFormValues] = useState({
    organisationType: 'groupOfOrganisation',
    group: '',
    organisation: '',
    selectAllOrganisation: false,
    applyCommission: '',
    comment: '',
  });

  const [errors, setErrors] = useState({
    organisationType: '',
    group: '',
    organisation: '',
    applyCommission: '',
    comment: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate all fields
    let formErrors = { ...errors };

    if (!formValues.organisationType) {
      formErrors.organisationType = 'Please select an organisation type';
    }

    if (formValues.organisationType === 'groupOfOrganisation' && !formValues.group) {
      formErrors.group = 'Please select a group';
    }

    if (formValues.organisationType === 'anOrganisation' && !formValues.organisation) {
      formErrors.organisation = 'Please select an organisation';
    }

    if (!formValues.applyCommission) {
      formErrors.applyCommission = 'Please enter apply commission';
    }

    if (!formValues.comment) {
      formErrors.comment = 'Please enter a comment';
    }

    setErrors(formErrors);

    // If no errors, submit the form
    if (Object.values(formErrors).every((error) => error === '')) {
      console.log(formValues);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    let newValue: string | boolean = value;
  
    if (type === 'checkbox') {
      newValue = (event.target as HTMLInputElement).checked;
    }
  
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Clear the error message when user starts typing
    }));
  };
  

  return (
    <form className="text-white mx-auto w-[80%] space-y-3" onSubmit={handleSubmit}>
      <div className='items-center gap-6  md:flex'>
        <label className="m-0 w-[16%] text-xs font-medium text-white">Organisation Type: </label>
        <div>
          <input
            type="radio"
            name="organisationType"
            value="groupOfOrganisation"
            onChange={handleInputChange}
            checked={formValues.organisationType === 'groupOfOrganisation'}
            className="border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
          />
          <label htmlFor="groupOfOrganisation" className="ml-2 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite">
            Group of Organisation
          </label>
          <input
            type="radio"
            name="organisationType"
            value="anOrganisation"
            onChange={handleInputChange}
            checked={formValues.organisationType === 'anOrganisation'}
            className="ml-4 border-1 h-4 w-4 cursor-pointer border-ajo_offWhite bg-transparent"
          />
          <label className='ml-2 cursor-pointer whitespace-nowrap text-sm font-medium capitalize text-ajo_offWhite' htmlFor="anOrganisation">An Organisation</label>
        </div>
        {errors.organisationType && <div className="text-red-500">{errors.organisationType}</div>}
      </div>

      {formValues.organisationType === 'groupOfOrganisation' && (
        <div className='items-center gap-6 md:flex'>
          <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">Select Group</label>
          <span className='w-full'>
            <select name="group"
            onChange={handleInputChange} 
            className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]">
                <option value="">Select group...</option>
                <option value="group1">Group 1</option>
                <option value="group2">Group 2</option>
            </select>
            {errors.group && <div className="text-red-500">{errors.group}</div>}
          </span>
          
        </div>
      )}

      {formValues.organisationType === 'anOrganisation' && (
        <div className='items-center gap-6 md:flex mt-4'>
          <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">Select Organisation</label>
          <span className='w-full'>
            <select name="organisation" onChange={handleInputChange} className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]">
                <option value="">Select organisation...</option>
                <option value="org1">Organization 1</option>
                <option value="org2">Organization 2</option>
            </select> 
            {errors.organisation && <div className="text-red-500">{errors.organisation}</div>}
          </span>
         
        </div>
      )}

      <div className='md:ml-[18%]'>
        <label className="block mb-1">
          <input
            type="checkbox"
            name="selectAllOrganisation"
            checked={formValues.selectAllOrganisation}
            onChange={handleInputChange}
            className="mr-1"
          />
          Select all organisations
        </label>
      </div>

      <div className='items-center gap-6 md:flex mt-4'>
        <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">Apply Commission (%):</label>
        <span className='w-full'>
        <input
          type="number"
          name="applyCommission"
          value={formValues.applyCommission}
          onChange={handleInputChange}
          onBlur={handleInputChange} // Touch validation
          className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
        />
        {errors.applyCommission && <div className="text-red-500">{errors.applyCommission}</div>}
        </span>
        
      </div>

      <div className='items-center gap-6 md:flex mt-4'>
        <label className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white">Comment:</label>
        <span className='w-full'>
        <textarea
          name="comment"
          value={formValues.comment}
          onChange={handleInputChange}
          onBlur={handleInputChange} // Touch validation
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-sm text-[#7D7D7D]"
        ></textarea>
        {errors.comment && <div className="text-red-500">{errors.comment}</div>}
        </span>
        
      </div>

      <div className="flex items-center mt-4">
        <span className="invisible w-[20%]">Submit</span>
        <div className="flex justify-center md:w-[80%]">
          {/* <CustomButton
            type="button"
            label={"Create Commission"}
            style={`rounded-md bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500 py-3 px-9 text-sm text-ajo_offWhite md:w-[60%]`}
            // onButtonClick={""}
          /> */}
          <button className='rounded-md bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500 py-3 px-9 text-sm text-ajo_offWhite md:w-[60%]'>submit</button>
        </div>
      </div>
    </form>
  );
};

export default CreateCommissionForm;

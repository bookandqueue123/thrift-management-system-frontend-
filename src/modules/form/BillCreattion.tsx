// "use client";

// import React, { useState, ChangeEvent, useEffect, useRef, memo } from 'react';
// import { Plus, Trash2, Calendar, User, Users, FileText, DollarSign, ChevronRight, ChevronLeft, Upload, Search, X } from 'lucide-react';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { useAuth } from '@/api/hooks/useAuth';
// import { nanoid } from 'nanoid';
// import { useRouter } from 'next/navigation';

// interface BillItem {
//   _id?: string; // Backend ID, present after saving
//   id?: string;  // Local temporary ID for React keys
//   billName: string;
//   category: string;
//   isMandatory: boolean;
//   amount: number;
//   quantity: number;
//   amountWithoutCharge: number;
//   image: string | File | null | undefined;
//   promoCode: {
//     code: string | null;
//     promoPercentage: number;
//     startDate: string | null;
//     endDate: string | null;
//     startTime: string | null;
//     endTime: string | null;
//   } | null;
// }

// interface BillDetails {
//   id: number;
//   name: string;
//   code: string;
//   customerGroupId: string;
//   startDate: string;
//   startTime: string;
//   endTime: string;
//   endDate: string;
//   promoCode: string;
//   customPromoCode: string; // <-- Add this line
//   promoPercentage: number;
//   billImage: File | null;
//   billImageUrl: string | null;
//   visibility: string;
//   visibilityStartDate: string;
//   visibilityStartTime: string;
//   visibilityEndDate: string;
//   visibilityEndTime: string;
//   selectorAll: string;
//   selectorCategory: string;
//   assignToCustomer: string[]; // Now an array
//   assignedCustomers: string[];
//   organisation: string;
//   referralBonusValue: string;
//   customUniqueCode: string;
//   platformServiceCharge: number;
// }

// interface Category {
//   id: string;
//   _id?: string;
//   name: string;
// }

// interface Customer {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   accountNumber: string;
// }

// const generatePromoCode = () => nanoid(8).toUpperCase();

// interface BillCreationFormProps {
//   organizationId: string;
//   onSuccess?: () => void;
// }

// const BillCreationForm = ({ organizationId, onSuccess }: BillCreationFormProps) => {
//   const { client } = useAuth();
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 3;

//   // State for modal/status management
//   const [userCreated, setUserCreated] = useState(false);
//   const [modalContent, setModalContent] = useState("form");
//   const [mutationResponse, setMutationResponse] = useState("");
//   const [closeModal, setCloseModal] = useState(true);

//   // Customer search and selection state
//   const [customerSearchTerm, setCustomerSearchTerm] = useState("");
//   const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
//   const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
//   const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
//   const customerSearchRef = useRef<HTMLDivElement>(null);

//   // Bill Details
//   const [billDetails, setBillDetails] = useState<BillDetails>({
//     id: 1,
//     name: "",
//     code: "",
//     customerGroupId: "",
//     startDate: "",
//     startTime: "",
//     endTime: "",
//     endDate: "",
//     promoCode: "",
//     customPromoCode: "", // <-- Add this line
//     promoPercentage: 0,
//     billImage: null,
//     billImageUrl: null,
//     visibility: "inhouse",
//     visibilityStartDate: "",
//     visibilityStartTime: "",
//     visibilityEndDate: "",
//     visibilityEndTime: "",
//     selectorAll: "selectorAllOptional",
//     selectorCategory: "selectorCategoryOptional",
//     assignToCustomer: [], // Now an array
//     assignedCustomers: [],
//     organisation: organizationId,
//     referralBonusValue: "",
//     customUniqueCode: "",
//     platformServiceCharge: 0
//   });

//   // Bill Items
//   const [billItems, setBillItems] = useState<BillItem[]>([
//     {
//       id: nanoid(),
//       billName: "",
//       category: "",
//       isMandatory: false,
//       amount: 0,
//       quantity: 1,
//       amountWithoutCharge: 0,
//       image: null,
//       promoCode: null,
//     },
//   ]);

  
 
//    const { data: categoriesData, isLoading } = useQuery<Category[]>({
//   queryKey: ['bill-categories'],
//   queryFn: async () => {
//     const res = await client.get('/api/bill-categories');
//      console.log('API Response:', res.data);
//     return res.data.data;
//   },
// });

// // Fetch groups for the customer group dropdown
// const { data: groupsData, isLoading: isGroupsLoading } = useQuery({
//   queryKey: ['groups'],
//   queryFn: async () => {
//     const res = await client.get('/api/groups');
//     return res.data.data;
//   },
// });

//   // Fetch customer organization data
// const { data: customerOrganisation, isLoading: isLoadingCustomerOrganisation } = useQuery({
//   queryKey: ["organisation"],
//   queryFn: async () => {
//     return client
//       .get(
//         `/api/user?role=customer&organisation=${organizationId}&userType=individual`,
//         {},
//       )
//       .then((response) => {
        
//         if (Array.isArray(response.data)) return response.data;
//         if (Array.isArray(response.data.data)) return response.data.data;
//         return [];
//       })
//       .catch((error: any) => {
//         console.error('Error loading customers:', error);
//         throw error;
//       });
//   },
//   staleTime: 5000,
// });


// const { data: platformChargeData, isLoading: isLoadingPlatformCharge } = useQuery({
//   queryKey: ['platform-charge'],
//   queryFn: async () => {
//     const res = await client.get('/api/bill-charge');
//     return res.data;
//   },
// });

 
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (customerSearchRef.current && !customerSearchRef.current.contains(event.target as Node)) {
//         setShowCustomerDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     if (customerOrganisation && billDetails.assignToCustomer && Array.isArray(billDetails.assignToCustomer)) {
//       const assigned = billDetails.assignToCustomer
//         .map((id: string) => customerOrganisation.find((c: any) => c._id === id))
//         .filter(Boolean);
//       setSelectedCustomers(assigned);
//     }
//   }, [customerOrganisation, billDetails.assignToCustomer]);


//   const handleCustomerSearch = (searchTerm: string) => {
//     setCustomerSearchTerm(searchTerm);
    
//     if (!customerOrganisation || !searchTerm.trim()) {
//       setFilteredCustomers([]);
//       setShowCustomerDropdown(false);
//       return;
//     }

//     console.log('Searching customers:', { searchTerm, customerOrganisation });

//     const filtered = customerOrganisation.filter((customer: Customer) => {
//       const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
//       const email = customer.email.toLowerCase();
//       const customerId = customer._id.toLowerCase();
//       const searchLower = searchTerm.toLowerCase();

//       const matches = (
//         fullName.includes(searchLower) ||
//         email.includes(searchLower) ||
//         customerId.includes(searchLower)
//       );

//       console.log('Customer match check:', { 
//         customer: `${customer.firstName} ${customer.lastName}`,
//         fullName,
//         email,
//         customerId,
//         searchLower,
//         matches
//       });

//       return matches;
//     });

//     console.log('Filtered customers:', filtered);
//     setFilteredCustomers(filtered);
//     setShowCustomerDropdown(filtered.length > 0);
//   };

//   // Handle customer selection
//   const handleCustomerSelect = (customer: Customer) => {
//     console.log('Customer selected:', customer);
    
//     const isAlreadySelected = selectedCustomers.some(c => c._id === customer._id);
//     console.log('Is already selected:', isAlreadySelected);
    
//     if (isAlreadySelected) {
//       setSelectedCustomers(prev => prev.filter(c => c._id !== customer._id));
//     } else {
//       setSelectedCustomers(prev => [...prev, customer]);
//     }
    
//     // Update billDetails assignedCustomers
//     const customerIds = isAlreadySelected 
//       ? selectedCustomers.filter(c => c._id !== customer._id).map(c => c._id)
//       : [...selectedCustomers, customer].map(c => c._id);
    
//     console.log('Updated customer IDs:', customerIds);
    
//     setBillDetails(prev => ({
//       ...prev,
//       assignedCustomers: customerIds,
//       assignToCustomer: customerIds, // Keep in sync
//     }));
    
//     setCustomerSearchTerm("");
//     setShowCustomerDropdown(false);
//   };

//   // Remove selected customer
//   const removeSelectedCustomer = (customerId: string) => {
//     setSelectedCustomers(prev => prev.filter(c => c._id !== customerId));
//     setBillDetails(prev => ({
//       ...prev,
//       assignedCustomers: prev.assignedCustomers.filter(id => id !== customerId),
//       assignToCustomer: prev.assignToCustomer.filter(id => id !== customerId),
//     }));
//   };

//   // React Query mutation
//   const { mutate: createBill, isPending: isCreatingBill } = useMutation({
//     mutationFn: async (values: any) => {
//       const formData = new FormData();
      
//       // Bill Details
//       formData.append("billName", values.name);
//       formData.append("billCode", values.code);
//       formData.append("organisation", organizationId);
//       formData.append("assignToCustomerGroup", values.customerGroupId);
//       formData.append("startDate", values.startDate);
//       formData.append("startTime", values.startTime);
//       formData.append("endDate", values.endDate);
//       formData.append("endTime", values.endTime);
//       formData.append("promoCode", values.promoCode);
//       formData.append("customUniqueCode", values.customUniqueCode);
//       formData.append("platformServiceCharge", values.platformServiceCharge.toString());
//       formData.append("promoPercentage", values.promoPercentage.toString());
//       formData.append("visibility", values.visibility);
//       formData.append("visibilityStartDate", values.visibilityStartDate);
//       formData.append("visibilityStartTime", values.visibilityStartTime);
//       formData.append("visibilityEndDate", values.visibilityEndDate);
//       formData.append("visibilityEndTime", values.visibilityEndTime);
//       formData.append("SelectorAll", values.selectorAll);
//       formData.append("selectorCategory", values.selectorCategory);
//       formData.append("referralBonusValue", values.referralBonusValue);

//       // Handle assigned customers
//       if (Array.isArray(values.assignToCustomer)) {
//         values.assignToCustomer.forEach((customerId: string) => {
//           formData.append("assignToCustomer[]", customerId);
//         });
//       }

//       // Handle image upload
//       if (values.billImage) {
//         formData.append("billImage", values.billImage);
//       }

//       // Bill Items - send as JSON string
//       const billItemsData = billItems.map((item) => ({
//         billName: item.billName,
//         category: item.category,
//         isMandatory: item.isMandatory,
//         amount: item.amount,
//         quantity: item.quantity,
//         amountWithoutCharge: item.amountWithoutCharge,
//         image: null, // handle image upload if needed
//         promoCode: item.promoCode,
//       }));
//       formData.append("billItems", JSON.stringify(billItemsData));

//       // Max Payment Duration
//       const maxPaymentDuration = {
//         startDate: values.startDate,
//         endDate: values.endDate,
//         startTime: values.startTime,
//         endTime: values.endTime
//       };
//       formData.append("maxPaymentDuration", JSON.stringify(maxPaymentDuration));

//       return client.post('/api/bills', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//     },
//     onSuccess(response) {
//       setUserCreated(true);
//       setModalContent("status");
//       setMutationResponse(response?.data.message || "Bill created successfully!");
//       setBillDetails({
//         id: 1,
//         name: "",
//         code: "",
//         customerGroupId: "",
//         startDate: "",
//         endDate: "",
//         promoCode: "",
//         customPromoCode: "",
//         startTime: '',
//         endTime: '',
//         promoPercentage: 0,
//         billImage: null,
//         billImageUrl: null,
//         visibility: "inhouse",
//         visibilityStartDate: "",
//         visibilityStartTime: "",
//         visibilityEndDate: "",
//         visibilityEndTime: "",
//         selectorAll: "selectorAllOptional",
//         selectorCategory: "selectorCategoryOptional",
//         assignToCustomer: [],
//         assignedCustomers: [],
//         organisation: organizationId,
//         referralBonusValue: "",
//         customUniqueCode: "",
//         platformServiceCharge: 0
//       });
//       setBillItems([{
//         id: nanoid(),
//         billName: "",
//         category: "",
//         isMandatory: false,
//         amount: 0,
//         quantity: 1,
//         amountWithoutCharge: 0,
//         image: null,
//         promoCode: null,
//       }]);
//       setTimeout(() => {
//         if (onSuccess) onSuccess();
//       }, 2000); // Show modal for 2 seconds before navigating
//     },
//     onError(error: any) {
//       // Axios error handling pattern
//       setMutationResponse(error?.response?.data?.message || error.message || "An error occurred while creating the bill");
//       setModalContent("status");
//     }
//   });

//   // Handlers for bill details
//   const handleBillDetailsChange = (field: keyof BillDetails, value: string | number | File | null) => {
//     setBillDetails(prev => ({ ...prev, [field]: value }));
//   };

//   // Handlers for bill items
//   const handleItemChange = (idx: number, field: keyof BillItem | keyof BillItem["promoCode"], value: any) => {
//     setBillItems(prev => prev.map((item, i) => {
//       if (i !== idx) return item;
//       if (field === "amountWithoutCharge") {
//         const percentage = platformChargeData?.data?.percentage || 0;
//         const amount = Number(value) + (percentage / 100) * Number(value);
//         return { ...item, amountWithoutCharge: value, amount };
//       }
//       if (
//         field === "promoCode" && (typeof value === "object" || value === null)
//       ) {
//         return { ...item, promoCode: value };
//       }
//       // Handle nested promoCode fields
//       if (
//         ["code", "promoPercentage", "startDate", "endDate", "startTime", "endTime"].includes(field as string)
//       ) {
//         return {
//           ...item,
//           promoCode: {
//             ...((item.promoCode as any) || {
//               code: null,
//               promoPercentage: 0,
//               startDate: null,
//               endDate: null,
//               startTime: null,
//               endTime: null,
//             }),
//             [field]: value,
//           },
//         };
//       }
//       return { ...item, [field]: value };
//     }));
//   };

//   const addBillItem = () => {
//     setBillItems(prev => [
//       ...prev,
//       {
//         id: nanoid(),
//         billName: "",
//         category: "",
//         isMandatory: false,
//         amount: 0,
//         quantity: 1,
//         amountWithoutCharge: 0,
//         image: null,
//         promoCode: null,
//       },
//     ]);
//   };

//   const removeBillItem = (idx: number) => {
//     if (billItems.length > 1) {
//       setBillItems(prev => prev.filter((_, i) => i !== idx));
//     }
//   };

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setBillDetails(prev => ({
//         ...prev,
//         billImage: file,
//         billImageUrl: URL.createObjectURL(file)
//       }));
//     }
//   };

//   const handleCustomerSelection = (customerId: string) => {
//     setBillDetails(prev => {
//       const isSelected = prev.assignedCustomers.includes(customerId);
//       return {
//         ...prev,
//         assignedCustomers: isSelected 
//           ? prev.assignedCustomers.filter(id => id !== customerId)
//           : [...prev.assignedCustomers, customerId]
//       };
//     });
//   };

//   const nextStep = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   // Add formError state
//   const [formError, setFormError] = useState<string | null>(null);

//   const handleSubmit = () => {
//     if (!billDetails.name) {
//       setFormError("Bill Name is required.");
//       return;
//     }
//     if (!billDetails.code) {
//       setFormError("Bill Code is required.");
//       return;
//     }
//     if (!billDetails.startDate || billDetails.startDate === 'Invalid Date') {
//       setFormError("Start Date is required and must be valid.");
//       return;
//     }
//     if (!billDetails.endDate || billDetails.endDate === 'Invalid Date') {
//       setFormError("End Date is required and must be valid.");
//       return;
//     }
//     if (billDetails.promoPercentage < 0 || billDetails.promoPercentage > 100) {
//       setFormError("Promo Percentage must be between 0 and 100.");
//       return;
//     }
//     // New validation: Ensure every bill item has a category
//     const missingCategory = billItems.some(item => !item.category || item.category.trim() === "");
//     if (missingCategory) {
//       setFormError("Each bill item must have a category.");
//       return;
//     }
//     // New validation: Ensure every bill item has a name
//     const missingName = billItems.some(item => !item.billName || item.billName.trim() === "");
//     if (missingName) {
//       setFormError("Each bill item must have a name.");
//       return;
//     }
//     // New validation: Must assign to at least a customer or a group
//     if (!billDetails.customerGroupId && (!billDetails.assignToCustomer || billDetails.assignToCustomer.length === 0)) {
//       setFormError("You must assign this bill to at least one customer or a group.");
//       return;
//     }
//     setFormError(null);
//     createBill({
//       ...billDetails,
//       billItems: billItems
//     });
//   };

//   const handleCreateAndSendEmail = () => {
//     // Add email sending logic here
//     console.log("Creating and sending email to customers:", selectedCustomers);
//     // You can implement the email sending functionality here
//     // This could be a separate API call or integrated with the bill creation
//   };

//   // Memoized BillItemInput component
//   const BillItemInput = memo(function BillItemInput({
//     item,
//     index,
//     handleItemChange,
//     removeBillItem,
//     categoriesData,
//     platformChargeData,
//     isLoadingPlatformCharge,
//     billItemsLength
//   }: {
//     item: any;
//     index: number;
//     handleItemChange: any;
//     removeBillItem: any;
//     categoriesData: any;
//     platformChargeData: any;
//     isLoadingPlatformCharge: boolean;
//     billItemsLength: number;
//   }) {
//     return (
//       <div className="bg-white rounded-lg p-4 border border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-medium text-gray-800">Bill Item {index + 1}</h3>
//           {billItemsLength > 1 && (
//             <button
//               type="button"
//               onClick={() => removeBillItem(index)}
//               className="text-red-600 hover:text-red-800 p-1"
//             >
//               <Trash2 size={16} />
//             </button>
//           )}
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Make bill item mandatory for payment</label>
//           <div className="flex items-center gap-4">
//             <input
//               type="radio"
//               id={`isMandatory-yes-${index}`}
//               name={`isMandatory-${index}`}
//               checked={item.isMandatory}
//               onChange={() => handleItemChange(index, 'isMandatory', true)}
//             />
//             <label htmlFor={`isMandatory-yes-${index}`}>Yes</label>
//             <input
//               type="radio"
//               id={`isMandatory-no-${index}`}
//               name={`isMandatory-${index}`}
//               checked={!item.isMandatory}
//               onChange={() => handleItemChange(index, 'isMandatory', false)}
//             />
//             <label htmlFor={`isMandatory-no-${index}`}>No</label>
//           </div>
//         </div>
//         <div className="w-full px-2 sm:px-4 py-2 sm:p-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Bill Name <span className='text-red-500'>*</span>
//               </label>
//               <input
//                 type="text"
//                 value={item.billName}
//                 onChange={(e) => handleItemChange(index, 'billName', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="Enter item name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 value={item.category}
//                 onChange={(e) => handleItemChange(index, 'category', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               >
//                 <option value="">Select category</option>
//                 {categoriesData?.map((category: any) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 DEBIT AMOUNT
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={item.amountWithoutCharge}
//                 onChange={(e) => handleItemChange(index, 'amountWithoutCharge', parseFloat(e.target.value) || 0)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="Enter amount without charge"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ACTUAL DEBIT AMOUNT
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={item.amount}
//                 readOnly
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                 placeholder="Amount with charge"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Platform charge (%)</label>
//               <input
//                 type="number"
//                 value={platformChargeData?.data?.percentage || ''}
//                 disabled
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//               />
//               {isLoadingPlatformCharge && <span className="text-xs text-gray-400">Loading platform charge...</span>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Platform charge value</label>
//               <input
//                 type="number"
//                 value={
//                   platformChargeData?.data?.percentage
//                     ? ((platformChargeData.data.percentage / 100) * item.amountWithoutCharge).toFixed(2)
//                     : ''
//                 }
//                 disabled
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Quantity
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 value={item.quantity}
//                 onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>
//         {/* Promo Code Settings - Full width section */}
//         <div className="mt-6">
//           <div className="p-4 w-full border border-gray-200 rounded-lg bg-gray-50">
//             <label className="block text-base font-semibold mb-4">Promo Code Settings</label>
//             <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name={`promoType-${index}`}
//                   checked={!!(item.promoCode && item.promoCode.code && item.promoCode.code !== '')}
//                   onChange={() => handleItemChange(index, 'promoCode', { code: nanoid(8).toUpperCase(), promoPercentage: 0, startDate: null, endDate: null, startTime: null, endTime: null })}
//                 />
//                 Promo Code
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name={`promoType-${index}`}
//                   checked={!!item.promoCode && item.promoCode.code === ''}
//                   onChange={() => handleItemChange(index, 'promoCode', { code: '', promoPercentage: 0, startDate: null, endDate: null, startTime: null, endTime: null })}
//                 />
//                 Custom Promo Code
//               </label>
//             </div>
//             <div className="flex flex-col md:flex-row gap-2 mb-4 w-full">
//               <input
//                 type="text"
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded"
//                 placeholder={item.promoCode?.code || "Enter promo code"}
//                 value={item.promoCode?.code || ''}
//                 onChange={e => handleItemChange(index, 'promoCode', { ...item.promoCode, code: e.target.value })}
//               />
//               <button
//                 type="button"
//                 className="w-32 px-4 py-2 bg-gray-200 rounded text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
//                 onClick={() => handleItemChange(index, 'promoCode', { ...item.promoCode, code: nanoid(8).toUpperCase() })}
//               >
//                 Generate
//               </button>
//             </div>
//             {/* Promo Percentage input */}
//             <div className="mb-4 w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Promo Percentage (%)</label>
//               <input
//                 type="number"
//                 min="0"
//                 max="100"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={item.promoCode?.promoPercentage || 0}
//                 onChange={e => handleItemChange(index, 'promoCode', { ...item.promoCode, promoPercentage: parseFloat(e.target.value) || 0 })}
//                 disabled={!item.promoCode?.code}
//                 placeholder="Enter promo percentage"
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">Start Date</label>
//                 <input
//                   type="date"
//                   className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   value={item.promoCode?.startDate || ''}
//                   onChange={e => handleItemChange(index, 'promoCode', { ...item.promoCode, startDate: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">Start Time</label>
//                 <input
//                   type="time"
//                   className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   value={item.promoCode?.startTime || ''}
//                   onChange={e => handleItemChange(index, 'promoCode', { ...item.promoCode, startTime: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">End Date</label>
//                 <input
//                   type="date"
//                   className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   value={item.promoCode?.endDate || ''}
//                   onChange={e => handleItemChange(index, 'promoCode', { ...item.promoCode, endDate: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">End Time</label>
//                 <input
//                   type="time"
//                   className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   value={item.promoCode?.endTime || ''}
//                   onChange={e => handleItemChange(index, 'promoCode', { ...item.promoCode, endTime: e.target.value })}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   });

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1: // Bill Details
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
//             <div className="text-xs text-red-500 mt-1 mb-4">
//               You must assign this bill to at least one customer or a group. <span className='text-red-500'>*</span>
//             </div>
//             <div className="w-full px-2 py-2 sm:px-4 sm:py-4 sm:p-8">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Bill Name <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={billDetails.name}
//                     onChange={(e) => handleBillDetailsChange('name', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter bill name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Bill Code <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={billDetails.code}
//                     onChange={(e) => handleBillDetailsChange('code', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter bill code"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                     <User size={16} />
//                     Assign to Customers (Multiple Selection)
//                   </label>
//                   <div className="relative" ref={customerSearchRef}>
//                     <div
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white"
//                       onClick={() => setShowCustomerDropdown((prev) => !prev)}
//                     >
//                       {selectedCustomers.length === 0
//                         ? "Select customers..."
//                         : selectedCustomers.map((c) => `${c.firstName} ${c.lastName}`).join(", ")}
//                     </div>
//                     {showCustomerDropdown && (
//                       <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                         <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
//                           <input
//                             type="text"
//                             value={customerSearchTerm}
//                             onChange={e => setCustomerSearchTerm(e.target.value)}
//                             placeholder="Search customers..."
//                             className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             autoFocus
//                           />
//                         </div>
//                         {customerOrganisation?.length > 0 ? (
//                           customerOrganisation
//                             .filter((customer: Customer) => {
//                               if (!customerSearchTerm.trim()) return true;
//                               const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
//                               const email = customer.email.toLowerCase();
//                               const customerId = customer._id.toLowerCase();
//                               const searchLower = customerSearchTerm.toLowerCase();
//                               return (
//                                 fullName.includes(searchLower) ||
//                                 email.includes(searchLower) ||
//                                 customerId.includes(searchLower)
//                               );
//                             })
//                             .map((customer: Customer) => {
//                               const isSelected = selectedCustomers.some((c) => c._id === customer._id);
//                               return (
//                                 <div
//                                   key={customer._id}
//                                   onClick={() => handleCustomerSelect(customer)}
//                                   className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
//                                     isSelected ? "bg-blue-50" : ""
//                                   }`}
//                                 >
//                                   <div className="font-medium text-gray-900">
//                                     {customer.firstName} {customer.lastName}
//                                   </div>
//                                   <div className="text-sm text-gray-500">
//                                     Account Number: {customer.accountNumber} | Email: {customer.email}
//                                   </div>
//                                   {isSelected && <span className="text-blue-600 ml-2">✓ Selected</span>}
//                                 </div>
//                               );
//                             })
//                         ) : (
//                           <div className="px-4 py-3 text-gray-500 text-center">
//                             {isLoadingCustomerOrganisation ? 'Loading customers...' : 'No customers available'}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   {/* Selected Customers Display */}
//                   {selectedCustomers.length > 0 && (
//                     <div className="space-y-2 mt-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Selected Customers ({selectedCustomers.length}):
//                       </label>
//                       <div className="space-y-2">
//                         {selectedCustomers.map((customer) => (
//                           <div
//                             key={customer._id}
//                             className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
//                           >
//                             <div>
//                               <div className="font-medium text-gray-900">
//                                 {customer.firstName} {customer.lastName}
//                               </div>
//                               <div className="text-sm text-gray-600">
//                                 Account Number: {customer.accountNumber} | Email: {customer.email}
//                               </div>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={() => removeSelectedCustomer(customer._id)}
//                               className="text-red-600 hover:text-red-800 p-1"
//                             >
//                               <X size={16} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Assign to Group <span className='text-red-500'>*</span>
//                   </label>
//                   <select
//                     value={billDetails.customerGroupId}
//                     onChange={(e) => handleBillDetailsChange('customerGroupId', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Select customer group</option>
//                     {groupsData?.map((group: any) => (
//                       <option key={group._id} value={group._id}>
//                         {group.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                     <Calendar size={16} />
//                     Start Date <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={billDetails.startDate}
//                     onChange={(e) => handleBillDetailsChange('startDate', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Start Time
//                   </label>
//                   <input
//                     type="time"
//                     value={billDetails.startTime}
//                     onChange={(e) => handleBillDetailsChange('startTime', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     End Date <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={billDetails.endDate}
//                     onChange={(e) => handleBillDetailsChange('endDate', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     End Time
//                   </label>
//                   <input
//                     type="time"
//                     value={billDetails.endTime}
//                     onChange={(e) => handleBillDetailsChange('endTime', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//             </div>
//           </div>
//         );
//         break;
//       case 2: // Bill Items
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
//               <DollarSign className="text-green-600" size={20} />
//               Bill Items
//             </h2>
//             <div className="space-y-4">
//               {billItems.map((item, index) => (
//                 <BillItemInput
//                   key={item._id || item.id || index}
//                   item={item}
//                   index={index}
//                   handleItemChange={handleItemChange}
//                   removeBillItem={removeBillItem}
//                   categoriesData={categoriesData}
//                   platformChargeData={platformChargeData}
//                   isLoadingPlatformCharge={isLoadingPlatformCharge}
//                   billItemsLength={billItems.length}
//                 />
//               ))}
//             </div>
//             <button
//               type="button"
//               onClick={addBillItem}
//               className="flex items-center gap-2 px-4 py-2 bg-[#221c3e] text-white rounded-lg hover:bg-[#3b2f73] transition-colors mt-4"
//             >
//               <Plus size={16} />
//               Add Bill Item
//             </button>
//           </div>
//         );
//         break;
//       case 3: // Additional Settings
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Settings</h2>
//             <div className="w-full px-2 py-2 sm:px-4 sm:py-4 sm:p-8">
//               {/* Use grid for perfect alignment */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
//                 {/* Row 1: Promo Code & Platform Service Charge */}
//                 {/* <div className="flex flex-col">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
//                   <div className="flex w-full">
//                     <input
//                       type="text"
//                       value={billDetails.promoCode}
//                       readOnly
//                       className="flex-1 px-2 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed text-sm h-11"
//                       placeholder="Promo code"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setBillDetails(prev => ({ ...prev, promoCode: generatePromoCode() }))}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors text-sm h-11"
//                       style={{ marginLeft: '-1px' }}
//                     >
//                       Generate
//                     </button>
//                   </div>
//                 </div> */}
//                 <div className="flex flex-col">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Platform Service Charge</label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={billDetails.platformServiceCharge}
//                     onChange={(e) => handleBillDetailsChange('platformServiceCharge', parseFloat(e.target.value) || 0)}
//                     className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm h-11"
//                   />
//                 </div>
//                 {/* Row 2: Promo Percentage & Custom Unique Code */}
//                 <div className="flex flex-col">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Promo Percentage (%)</label>
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={billDetails.promoPercentage}
//                     onChange={(e) => handleBillDetailsChange('promoPercentage', parseFloat(e.target.value) || 0)}
//                     className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-11"
//                     placeholder="0"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Custom Unique Code</label>
//                   <input
//                     type="text"
//                     value={billDetails.customUniqueCode}
//                     onChange={(e) => handleBillDetailsChange('customUniqueCode', e.target.value)}
//                     className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-11"
//                     placeholder="Enter unique code"
//                   />
//                 </div>
//                 {/* Row 3: Upload Image (spans both columns) */}
//                 <div className="flex flex-col sm:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center h-28 flex flex-col justify-center items-center">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                       id="image-upload"
//                     />
//                     <label htmlFor="image-upload" className="cursor-pointer w-full h-full flex flex-col justify-center items-center">
//                       <Upload className="mx-auto h-8 w-8 text-gray-400" />
//                       <p className="mt-2 text-xs text-gray-600">Click to upload an image</p>
//                     </label>
//                     {billDetails.billImageUrl && (
//                       <div className="mt-2">
//                         <img 
//                           src={billDetails.billImageUrl} 
//                           alt="Preview" 
//                           className="mx-auto h-20 w-20 object-cover rounded-lg"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//         break;
//       default:
//         return null;
//     }
//   };

//   // Status/Success Modal Content
//   if (modalContent === "status") {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
//           <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
//             userCreated ? 'bg-green-100' : 'bg-red-100'
//           }`}>
//             {userCreated ? (
//               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//             ) : (
//               <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//               </svg>
//             )}
//           </div>
//           <h2 className={`text-xl font-semibold mb-2 ${userCreated ? 'text-green-800' : 'text-red-800'}`}>
//             {userCreated ? 'Success!' : 'Error'}
//           </h2>
//           <p className="text-gray-600 mb-4">{mutationResponse}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-2 sm:p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-2 sm:p-8">
//           <div className="mb-8">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
//               <FileText className="text-blue-600" size={32} />
//               Bill Creation
//             </h1>
//             <p className="text-gray-600 text-sm sm:text-base">Create a new bill with detailed information</p>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
//               <span className="text-xs sm:text-sm font-medium text-gray-700">
//                 Step {currentStep} of {totalSteps}
//               </span>
//               <span className="text-xs sm:text-sm text-gray-500">
//                 {Math.round((currentStep / totalSteps) * 100)}% Complete
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Above the form, display error messages */}
//           {(formError || (modalContent === "status" && !userCreated && mutationResponse)) && (
//             <div className="mb-4 text-red-600 font-semibold bg-red-100 p-2 rounded text-xs sm:text-base">
//               {formError || mutationResponse}
//             </div>
//           )}

//           {/* Step Content */}
//           <div className="mb-8">
//             {renderStepContent()}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex flex-col sm:flex-row w-full mt-4 gap-3 sm:gap-0 sm:items-start sm:justify-between">
//             {/* Previous Button on the left */}
//             <div className="sm:w-1/2 sm:pr-2">
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 disabled={currentStep === 1 || isCreatingBill}
//                 className={`w-full flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-colors text-white text-base justify-center ${
//                   currentStep === 1
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-gray-200 hover:bg-gray-300'
//                 }`}
//               >
//                 <ChevronLeft size={20} />
//                 Previous
//               </button>
//             </div>
//             {/* Action Buttons on the right, stacked vertically */}
//             <div className="sm:w-1/2 sm:pl-2 flex flex-col gap-2 items-end">
//               {currentStep < totalSteps ? (
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   disabled={isCreatingBill}
//                   className="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-[#221c3e] text-white rounded-lg font-semibold hover:bg-[#3b2f73] transition-colors text-base justify-center"
//                 >
//                   Next
//                   <ChevronRight size={20} />
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     type="button"
//                     onClick={handleSubmit}
//                     disabled={isCreatingBill}
//                     className="w-full sm:w-auto px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-base mb-2"
//                   >
//                     {isCreatingBill ? 'Creating Bill...' : 'Create Bill'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleCreateAndSendEmail}
//                     disabled={isCreatingBill || selectedCustomers.length === 0}
//                     className="w-full sm:w-auto px-5 py-3 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 text-base"
//                   >
//                     Create and Send Email
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillCreationForm; 






"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Plus, Trash2, Calendar, User, Users, FileText, DollarSign, ChevronRight, ChevronLeft, Upload, Search, X, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';

interface BillItem {
  id: number;
  billName: string;
  category: string;
  isMandatory: boolean;
  amount: number;
  amountWithoutCharge: number;
  quantity: number;
  promoCode: {
    code: string | null;
    promoPercentage: number;
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
  };
}

interface BillDetails {
  billName: string;
  billCode: string;
  assignToCustomer: string[];
  assignToCustomerGroup: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  promoCode: string;
  customUniqueCode: string;
  platformServiceCharge: number;
  promoPercentage: number;
  billImage: File | null;
  billImageUrl: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountNumber: string;
}

interface Group {
  _id: string;
  name: string;
}

const generatePromoCode = () => nanoid(8).toUpperCase();

interface BillCreationFormProps {
  organizationId: string;
  onSuccess?: () => void;
}

const BillCreationForm = ({ organizationId, onSuccess }: BillCreationFormProps) => {
  const { client } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Customer search and selection state
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const customerSearchRef = useRef<HTMLDivElement>(null);
   const [isSuccess, setIsSuccess] = useState(false);
  // Bill Details
  const [billDetails, setBillDetails] = useState<BillDetails>({
    billName: "",
    billCode: "",
    assignToCustomer: [],
    assignToCustomerGroup: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    promoCode: "",
    customUniqueCode: "",
    platformServiceCharge: 0,
    promoPercentage: 0,
    billImage: null,
    billImageUrl: null
  });

  // Bill Items
  const [billItems, setBillItems] = useState<BillItem[]>([{
    id: 1,
    billName: "",
    category: "",
    isMandatory: false,
    amount: 0,
    amountWithoutCharge: 0,
    quantity: 1,
    promoCode: {
      code: null,
      promoPercentage: 0,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null
    }
  }]);
  

   
  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['bill-categories'],
    queryFn: async () => {
      const res = await client.get('/api/bill-categories');
      return res.data.data;
    },
  });

  const { data: groupsData } = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await client.get('/api/groups');
      return res.data.data;
    },
  });

  const { data: customerOrganisation } = useQuery<Customer[]>({
    queryKey: ["organisation", organizationId],
    queryFn: async () => {
      const res = await client.get(
        `/api/user?role=customer&organisation=${organizationId}&userType=individual`
      );
      return Array.isArray(res.data) ? res.data : res.data.data || [];
    }
  });

  const { data: platformChargeData } = useQuery({
    queryKey: ['platform-charge'],
    queryFn: async () => {
      const res = await client.get('/api/bill-charge');
      return res.data;
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerSearchRef.current && !customerSearchRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (platformChargeData?.data?.percentage) {
      setBillDetails(prev => ({
        ...prev,
        platformServiceCharge: platformChargeData.data.percentage
      }));
    }
  }, [platformChargeData]);

  useEffect(() => {
    // Update amounts when platform charge changes
    setBillItems(prev => prev.map(item => {
      const newAmount = item.amountWithoutCharge + 
        (item.amountWithoutCharge * billDetails.platformServiceCharge) / 100;
      return { ...item, amount: newAmount };
    }));
  }, [billDetails.platformServiceCharge]);

  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm);
    
    if (!customerOrganisation || !searchTerm.trim()) {
      setFilteredCustomers([]);
      setShowCustomerDropdown(false);
      return;
    }

    const filtered = customerOrganisation.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return fullName.includes(searchLower) || 
        customer.email.toLowerCase().includes(searchLower) ||
        customer._id.toLowerCase().includes(searchLower);
    });

    setFilteredCustomers(filtered);
    setShowCustomerDropdown(filtered.length > 0);
  };

  const handleCustomerSelect = (customer: Customer) => {
    const isSelected = selectedCustomers.some(c => c._id === customer._id);
    
    if (isSelected) {
      setSelectedCustomers(prev => prev.filter(c => c._id !== customer._id));
    } else {
      setSelectedCustomers(prev => [...prev, customer]);
    }
    
    const customerIds = selectedCustomers
      .filter(c => c._id !== customer._id)
      .map(c => c._id);
    
    if (!isSelected) {
      customerIds.push(customer._id);
    }
    
    setBillDetails(prev => ({
      ...prev,
      assignToCustomer: customerIds
    }));
    
    setCustomerSearchTerm("");
    setShowCustomerDropdown(false);
  };

  const removeSelectedCustomer = (customerId: string) => {
    setSelectedCustomers(prev => prev.filter(c => c._id !== customerId));
    setBillDetails(prev => ({
      ...prev,
      assignToCustomer: prev.assignToCustomer.filter(id => id !== customerId)
    }));
  };

  const { mutate: createBill, isPending: isCreatingBill } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      // Bill Details
      formData.append("billName", billDetails.billName);
      formData.append("billCode", billDetails.billCode);
      formData.append("organisation", organizationId);
      formData.append("assignToCustomerGroup", billDetails.assignToCustomerGroup);
      formData.append("startDate", billDetails.startDate);
      formData.append("endDate", billDetails.endDate);
      formData.append("startTime", billDetails.startTime);
      formData.append("endTime", billDetails.endTime);
      formData.append("promoCode", billDetails.promoCode);
      formData.append("customUniqueCode", billDetails.customUniqueCode);
      formData.append("platformServiceCharge", billDetails.platformServiceCharge.toString());
      formData.append("promoPercentage", billDetails.promoPercentage.toString());

      // Assign to customers
      billDetails.assignToCustomer.forEach(customerId => {
        formData.append("assignToCustomer[]", customerId);
      });

      // Bill Items
      const itemsData = billItems.map(item => ({
        billName: item.billName,
        category: item.category,
        isMandatory: item.isMandatory,
        amount: item.amount,
        amountWithoutCharge: item.amountWithoutCharge,
        quantity: item.quantity,
        promoCode: item.promoCode
      }));
      formData.append("billItems", JSON.stringify(itemsData));

      // Max Payment Duration
      const maxPaymentDuration = {
        startDate: billDetails.startDate,
        endDate: billDetails.endDate,
        startTime: billDetails.startTime,
        endTime: billDetails.endTime
      };
      formData.append("maxPaymentDuration", JSON.stringify(maxPaymentDuration));

      // Bill image
      if (billDetails.billImage) {
        formData.append("billImage", billDetails.billImage);
      }

      return client.post('/api/bills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess() {
      setIsSuccess(true); 
      setTimeout(() => {
        if (onSuccess) onSuccess();
        setIsSuccess(false);
      }, 3000); // Show success message for 3 seconds
    }
  });

  const handleBillDetailsChange = (field: keyof BillDetails, value: string | number | File | null) => {
    setBillDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (itemId: number, field: keyof BillItem, value: string | number | boolean) => {
    setBillItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const updatedItem = { ...item, [field]: value };
      
      if (field === 'amountWithoutCharge') {
        const percentage = billDetails.platformServiceCharge;
        updatedItem.amount = Number(value) + (Number(value) * percentage) / 100;
      }
      
      return updatedItem;
    }));
  };

  const handlePromoCodeChange = (
    itemId: number, 
    field: keyof BillItem['promoCode'], 
    value: string | number | null
  ) => {
    setBillItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      return {
        ...item,
        promoCode: {
          ...item.promoCode,
          [field]: value
        }
      };
    }));
  };

  const addBillItem = () => {
    const newId = Math.max(0, ...billItems.map(item => item.id)) + 1;
    setBillItems(prev => [...prev, {
      id: newId,
      billName: "",
      category: "",
      isMandatory: false,
      amount: 0,
      amountWithoutCharge: 0,
      quantity: 1,
      promoCode: {
        code: null,
        promoPercentage: 0,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null
      }
    }]);
  };

  const removeBillItem = (itemId: number) => {
    if (billItems.length > 1) {
      setBillItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBillDetails(prev => ({
        ...prev,
        billImage: file,
        billImageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const nextStep = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = () => createBill();

  return (
    <div className="min-h-screen p-2 sm:p-6">
       {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bill Created Successfully!</h2>
            
            {/* <button
              onClick={() => setIsSuccess(false)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button> */}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-2 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              
              Bill Creation
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Create a new bill with detailed information</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
                <div className="text-xs text-red-500 mt-1 mb-4">
                  You must assign this bill to at least one customer or a group.
                </div>
                <div className="w-full px-2 py-2 sm:px-4 sm:py-4 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill Name *
                      </label>
                      <input
                        type="text"
                        value={billDetails.billName}
                        onChange={(e) => handleBillDetailsChange('billName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter bill name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill Code *
                      </label>
                      <input
                        type="text"
                        value={billDetails.billCode}
                        onChange={(e) => handleBillDetailsChange('billCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter bill code"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User size={16} />
                        Assign to Customers
                      </label>
                      <div className="relative" ref={customerSearchRef}>
                        <div
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white"
                          onClick={() => setShowCustomerDropdown(true)}
                        >
                          {selectedCustomers.length === 0
                            ? "Select customers..."
                            : selectedCustomers.map(c => `${c.firstName} ${c.lastName}`).join(", ")}
                        </div>
                        {showCustomerDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={customerSearchTerm}
                                onChange={e => handleCustomerSearch(e.target.value)}
                                placeholder="Search customers..."
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                              />
                            </div>
                            {customerOrganisation?.map(customer => (
                              <div
                                key={customer._id}
                                onClick={() => handleCustomerSelect(customer)}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                  selectedCustomers.some(c => c._id === customer._id) ? "bg-blue-50" : ""
                                }`}
                              >
                                <div className="font-medium text-gray-900">
                                  {customer.firstName} {customer.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Account: {customer.accountNumber} | Email: {customer.email}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {selectedCustomers.length > 0 && (
                        <div className="space-y-2 mt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Selected Customers ({selectedCustomers.length}):
                          </label>
                          <div className="space-y-2">
                            {selectedCustomers.map(customer => (
                              <div
                                key={customer._id}
                                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                              >
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {customer.firstName} {customer.lastName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Account: {customer.accountNumber}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeSelectedCustomer(customer._id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign to Group
                      </label>
                      <select
                        value={billDetails.assignToCustomerGroup}
                        onChange={(e) => handleBillDetailsChange('assignToCustomerGroup', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select customer group</option>
                        {groupsData?.map(group => (
                          <option key={group._id} value={group._id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={16} />
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={billDetails.startDate}
                        onChange={(e) => handleBillDetailsChange('startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={billDetails.startTime}
                        onChange={(e) => handleBillDetailsChange('startTime', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={billDetails.endDate}
                        onChange={(e) => handleBillDetailsChange('endDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={billDetails.endTime}
                        onChange={(e) => handleBillDetailsChange('endTime', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                 
                  Bill Items
                </h2>
                <div className="space-y-4">
                  {billItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800">Bill Item</h3>
                        {billItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBillItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Make bill item mandatory
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={item.isMandatory}
                              onChange={() => handleItemChange(item.id, 'isMandatory', true)}
                            />
                            Yes
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={!item.isMandatory}
                              onChange={() => handleItemChange(item.id, 'isMandatory', false)}
                            />
                            No
                          </label>
                        </div>
                      </div>
                      <div className="w-full px-2 sm:px-4 py-2 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bill Name *
                            </label>
                            <input
                              type="text"
                              value={item.billName}
                              onChange={(e) => handleItemChange(item.id, 'billName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter item name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category
                            </label>
                            <select
                              value={item.category}
                              onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="">Select category</option>
                              {categoriesData?.map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                            <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DEBIT AMOUNT
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.amountWithoutCharge === 0 ? '' : item.amountWithoutCharge}
            onChange={(e) => {
              const value = e.target.value;
              // Handle empty input
              if (value === '') {
                handleItemChange(item.id, 'amountWithoutCharge', 0);
              } else {
                const num = parseFloat(value);
                if (!isNaN(num)) {
                  handleItemChange(item.id, 'amountWithoutCharge', num);
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
                          {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Amount Without Charge
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.amountWithoutCharge}
                              onChange={(e) => handleItemChange(item.id, 'amountWithoutCharge', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div> */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ACTUAL DEBIT AMOUNT
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.amount}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                          </div>
                               
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Service Charge (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={billDetails.platformServiceCharge}
                        onChange={(e) => handleBillDetailsChange('platformServiceCharge', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div> */}

                           <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Platform charge (%)</label>
               <input
                type="number"
                value={platformChargeData?.data?.percentage || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform charge value</label>
              <input
                type="number"
                value={
                  platformChargeData?.data?.percentage
                    ? ((platformChargeData.data.percentage / 100) * item.amountWithoutCharge).toFixed(2)
                    : ''
                }
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>



                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="p-4 w-full border border-gray-200 rounded-lg bg-gray-50">
                          <label className="block text-base font-semibold mb-4">Promo Code Settings</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* <div>
                              <label className="block text-xs text-gray-600 mb-1">Promo Code</label>
                              <input
                                type="text"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                placeholder="Enter promo code"
                                value={item.promoCode.code || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'code', e.target.value)}
                              />
                            </div> */}

                            <div>
      <label className="block text-xs text-gray-600 mb-1">Promo Code</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow px-2 py-2 border border-gray-300 rounded"
          placeholder="Enter promo code"
          value={item.promoCode.code || ''}
          onChange={e => handlePromoCodeChange(item.id, 'code', e.target.value)}
        />
        <button
          type="button"
          onClick={() => handlePromoCodeChange(item.id, 'code', generatePromoCode())}
          className="px-3 py-2 bg-blue-500 text-white  hover:bg-gray-300 rounded transition-colors text-xs whitespace-nowrap"
        >
          Generate
        </button>
      </div>
    </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Promo Percentage (%)</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.promoCode.promoPercentage}
                                onChange={e => handlePromoCodeChange(item.id, 'promoPercentage', parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                              <input
                                type="date"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                value={item.promoCode.startDate || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">End Date</label>
                              <input
                                type="date"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                value={item.promoCode.endDate || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'endDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                              <input
                                type="time"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                value={item.promoCode.startTime || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'startTime', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">End Time</label>
                              <input
                                type="time"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                value={item.promoCode.endTime || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'endTime', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addBillItem}
                  className="flex items-center gap-2 px-4 py-2 bg-[#221c3e] text-white rounded-lg hover:bg-[#3b2f73] transition-colors mt-4"
                >
                  <Plus size={16} />
                  Add Bill Item
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Settings</h2>
                <div className="w-full px-2 py-2 sm:px-4 sm:py-4 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Promo Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={billDetails.promoCode}
          onChange={(e) => handleBillDetailsChange('promoCode', e.target.value)}
          className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter promo code"
        />
        <button
          type="button"
          onClick={() => handleBillDetailsChange('promoCode', generatePromoCode())}
          className="px-4 py-3 bg-blue-500 text-white hover:bg-gray-300 rounded-lg transition-colors whitespace-nowrap"
        >
          Generate
        </button>
      </div>
    </div>
               
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Promo Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={billDetails.promoPercentage}
                        onChange={(e) => handleBillDetailsChange('promoPercentage', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Unique Code
                      </label>
                      <input
                        type="text"
                        value={billDetails.customUniqueCode}
                        onChange={(e) => handleBillDetailsChange('customUniqueCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter unique code"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center h-28 flex flex-col justify-center items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer w-full h-full flex flex-col justify-center items-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-xs text-gray-600">Click to upload an image</p>
                        </label>
                        {billDetails.billImageUrl && (
                          <div className="mt-2">
                            <img 
                              src={billDetails.billImageUrl} 
                              alt="Preview" 
                              className="mx-auto h-20 w-20 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row w-full mt-4 gap-3 sm:gap-0 sm:items-start sm:justify-between">
            <div className="sm:w-1/2 sm:pr-2">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isCreatingBill}
                className={`w-full flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-colors text-white text-base justify-center ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
            </div>
            
            <div className="sm:w-1/2 sm:pl-2 flex flex-col gap-2 items-end">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isCreatingBill}
                  className="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-[#221c3e] text-white rounded-lg font-semibold hover:bg-[#3b2f73] transition-colors text-base justify-center"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isCreatingBill}
                  className="w-full sm:w-auto px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-base mb-2"
                >
                  {isCreatingBill ? 'Creating Bill...' : 'Create Bill'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillCreationForm;
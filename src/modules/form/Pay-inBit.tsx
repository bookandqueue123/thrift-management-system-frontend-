// "use client";
// import { X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// // Define CartItem interface to match CartItemFromAPI from cart page
// interface CartItem {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//   };
//   name: string;
//   quantity: number;
//   price: number;
//   imageUrl?: string;
// }

// interface PayInBitsFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   cartItems: CartItem[];
//   previewData?: any;
//   previewLoading?: boolean;
//   previewError?: string;
// }

// export default function PayInBitsForm({
//   isOpen,
//   onClose,
//   cartItems = [],
//   previewData,
//   previewLoading,
//   previewError,
// }: PayInBitsFormProps) {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     accountName: "",
//     accountNumber: "",
//     bankName: "",
//     bvn: "",
//     nin: "",
//     guarantorA: {
//       name: "",
//       phone: "",
//     },
//     guarantorB: {
//       name: "",
//       phone: "",
//     },
//   });

//   const handleInputChange = (field: string, value: string) => {
//     if (field.startsWith("guarantorA.")) {
//       const subField = field.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         guarantorA: { ...prev.guarantorA, [subField]: value },
//       }));
//     } else if (field.startsWith("guarantorB.")) {
//       const subField = field.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         guarantorB: { ...prev.guarantorB, [subField]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!previewData) return;

//     // Check authentication
//     const token =
//       localStorage.getItem("token") || localStorage.getItem("authToken");
//     if (!token) {
//       alert("Authentication required. Please log in again.");
//       window.location.href = "/signin";
//       return;
//     }

//     const paymentPayload = {
//       orderItems: cartItems.map((item) => ({
//         product: item.product._id,
//         name: item.name,
//         quantity: item.quantity,
//         price: item.price,
//         initialDeposit: previewData.firstPayment,
//       })),
//       shippingAddress: {
//         fullName: formData.accountName,
//         address: "User address", // Replace with actual input
//         city: "User city", // Replace with actual input
//         postalCode: "User postal", // Replace with actual input
//         country: "Nigeria",
//       },
//       paymentMethod: "Card",
//       paymentMode: "Pay In Bits",
//       totalPrice: previewData.totalCost,
//       initialPaymentAmount: previewData.firstPayment,
//       paymentSchedule: previewData.paymentSchedule,
//     };

//     // Save comprehensive Pay In Bits data for OrderConfirmation and PaymentPage
//     localStorage.setItem(
//       "payInBitsData",
//       JSON.stringify({
//         initialDeposit: previewData.firstPayment,
//         paymentMode: "bits",
//         paymentSchedule: previewData.paymentSchedule,
//         totalCost: previewData.totalCost,
//         totalInterest: previewData.totalInterest,
//         platformFee: previewData.platformFee,
//         annualInterestRate: previewData.annualInterestRate,
//         repaymentMonths: previewData.repaymentMonths,
//         subsequentPayments: previewData.subsequentPayments,
//         previewData: previewData, // Store the entire preview data
//       }),
//     );

//     // Also save to initialDeposit for backward compatibility
//     localStorage.setItem(
//       "initialDeposit",
//       JSON.stringify({
//         initialDeposit: previewData.firstPayment,
//         paymentMode: "bits",
//       }),
//     );

//     console.log("Submitting payment:", paymentPayload);

//     try {
//       const response = await fetch("/api/cart/clear/all", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok && response.status === 401) {
//         alert("Authentication expired. Please log in again.");
//         window.location.href = "/signin";
//         return;
//       }
//     } catch (err) {
//       console.error("Failed to clear cart:", err);
//     }

//     onClose();
//     router.push("/cart/delivery");
//   };

//   const getImageUrl = (item: CartItem) => {
//     if (item.imageUrl) {
//       return item.imageUrl;
//     }

//     console.log("Using fallback image");
//     return "/market/Image8.png";
//   };

//   if (!isOpen) return null;

//   if (previewLoading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//         <div className="flex max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-8">
//           <span className="text-lg font-semibold">
//             Loading payment preview...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   if (previewError) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//         <div className="flex max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-8">
//           <span className="text-lg font-semibold text-red-600">
//             {previewError}
//           </span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
//         <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
//           <h2 className="text-xl font-semibold">Pay little-by-little</h2>
//           <button
//             onClick={onClose}
//             className="rounded-md p-2 transition-colors hover:bg-gray-100"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//             {/* Item Details */}
//             <div className="space-y-6">
//               <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
//                 <div className="border-b border-gray-200 px-6 py-4">
//                   <h3 className="text-lg font-semibold">Item Details</h3>
//                 </div>
//                 <div className="space-y-4 p-6">
//                   {cartItems.map((item) => (
//                     <React.Fragment key={item._id}>
//                       <div className="mb-2 flex items-center gap-4 border-b pb-2 last:mb-0 last:border-b-0 last:pb-0">
//                         <img
//                           src={getImageUrl(item) || "/placeholder.svg"}
//                           alt={item.name}
//                           className="h-16 w-16 rounded border object-cover"
//                           onError={(e) => {
//                             console.log("Image failed to load, using fallback");
//                             e.currentTarget.src = "/market/Image8.png";
//                           }}
//                         />
//                         <div className="flex-1">
//                           <h3 className="text-sm font-medium">{item.name}</h3>
//                           <p className="text-sm text-gray-600">
//                             Quantity:{" "}
//                             {item.quantity.toString().padStart(2, "0")}
//                           </p>
//                           {previewData && previewData.firstPayment && (
//                             <p className="text-sm font-semibold text-blue-600">
//                               Initial Deposit: ₦
//                               {previewData.firstPayment?.toLocaleString()}
//                             </p>
//                           )}
//                         </div>
//                         <div className="text-right">
//                           {previewData && previewData.firstPayment ? (
//                             <>
//                               <p className="font-semibold text-blue-600">
//                                 ₦{previewData.firstPayment.toLocaleString()}{" "}
//                                 <span className="text-xs">
//                                   (Initial Payment)
//                                 </span>
//                               </p>
//                               <p className="text-xs text-gray-400 line-through">
//                                 ₦{item.price.toLocaleString()}{" "}
//                                 <span className="text-xs">(Full Price)</span>
//                               </p>
//                             </>
//                           ) : (
//                             <p className="font-semibold">
//                               ₦{item.price.toLocaleString()}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       {previewData && previewData.paymentSchedule && (
//                         <div className="mt-2">
//                           <h4 className="mb-1 font-semibold">
//                             Payment Schedule
//                           </h4>
//                           <table className="min-w-full divide-y divide-gray-200 border">
//                             <thead>
//                               <tr>
//                                 <th className="px-2 py-1 text-xs font-medium uppercase text-gray-500">
//                                   #
//                                 </th>
//                                 <th className="px-1 py-1 text-xs font-medium uppercase text-gray-500">
//                                   Due Date
//                                 </th>
//                                 <th className="px-1 py-1 text-xs font-medium uppercase text-gray-500">
//                                   Amount
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {previewData.paymentSchedule.map(
//                                 (schedule: any, sidx: number) => (
//                                   <tr key={sidx}>
//                                     <td className="px-2 py-1 text-center">
//                                       {schedule.paymentNumber}
//                                     </td>
//                                     <td className="px-1 py-1 text-center">
//                                       {new Date(
//                                         schedule.dueDate,
//                                       ).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-1 py-1 text-center">
//                                       ₦{schedule.totalPayment?.toLocaleString()}
//                                     </td>
//                                   </tr>
//                                 ),
//                               )}
//                               <tr>
//                                 <td
//                                   colSpan={2}
//                                   className="text-right font-bold"
//                                 >
//                                   Total Installments
//                                 </td>
//                                 <td className="text-center font-bold">
//                                   ₦
//                                   {previewData.paymentSchedule
//                                     .reduce(
//                                       (sum: number, s: any) =>
//                                         sum + s.totalPayment,
//                                       0,
//                                     )
//                                     .toLocaleString()}
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                           <div className="mt-4">
//                             <h4 className="mb-1 font-semibold">
//                               Payment Breakdown
//                             </h4>
//                             <ul className="mb-2">
//                               <li>
//                                 <b>Initial Payment:</b> ₦
//                                 {previewData.firstPayment?.toLocaleString()}{" "}
//                                 (Due:{" "}
//                                 {previewData.paymentSchedule[0]
//                                   ? new Date(
//                                       previewData.paymentSchedule[0].dueDate,
//                                     ).toLocaleDateString()
//                                   : "Immediately"}
//                                 )
//                               </li>
//                             </ul>
//                             <h4 className="mb-1 font-semibold">
//                               Subsequent Payments
//                             </h4>
//                             <ul>
//                               {previewData.paymentSchedule.map(
//                                 (schedule: any, sidx: number) => (
//                                   <li key={sidx}>
//                                     Payment {schedule.paymentNumber}: ₦
//                                     {schedule.totalPayment.toLocaleString()}{" "}
//                                     (Due:{" "}
//                                     {new Date(
//                                       schedule.dueDate,
//                                     ).toLocaleDateString()}
//                                     )
//                                   </li>
//                                 ),
//                               )}
//                             </ul>
//                           </div>
//                         </div>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </div>
//               </div>

//               {/* Bank Details Section */}
//               <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
//                 <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
//                   <h3 className="text-lg font-semibold">Bank Details</h3>
//                   <span className="rounded-md bg-yellow-400 px-2 py-1 text-xs font-medium text-black">
//                     Required
//                   </span>
//                 </div>
//                 <div className="space-y-4 p-6">
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="accountName"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Account Name
//                     </label>
//                     <input
//                       id="accountName"
//                       type="text"
//                       placeholder="Enter your full name"
//                       value={formData.accountName}
//                       onChange={(e) =>
//                         handleInputChange("accountName", e.target.value)
//                       }
//                       className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="accountNumber"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Account Number
//                     </label>
//                     <input
//                       id="accountNumber"
//                       type="text"
//                       placeholder="Enter your account number"
//                       value={formData.accountNumber}
//                       onChange={(e) =>
//                         handleInputChange("accountNumber", e.target.value)
//                       }
//                       className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="bankName"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Bank Name
//                     </label>
//                     <input
//                       id="bankName"
//                       type="text"
//                       placeholder="Enter your bank name"
//                       value={formData.bankName}
//                       onChange={(e) =>
//                         handleInputChange("bankName", e.target.value)
//                       }
//                       className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="bvn"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Bank Verification Number (BVN)
//                     </label>
//                     <input
//                       id="bvn"
//                       type="text"
//                       placeholder="Enter your BVN"
//                       value={formData.bvn}
//                       onChange={(e) => handleInputChange("bvn", e.target.value)}
//                       className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="nin"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       National Identity Number (NIN)
//                     </label>
//                     <input
//                       id="nin"
//                       type="text"
//                       placeholder="Enter your NIN"
//                       value={formData.nin}
//                       onChange={(e) => handleInputChange("nin", e.target.value)}
//                       className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Guarantor Details */}
//             <div className="space-y-6">
//               <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
//                 <div className="border-b border-gray-200 px-6 py-4">
//                   <h3 className="text-lg font-semibold">Guarantor Details</h3>
//                 </div>
//                 <div className="space-y-6 p-6">
//                   {/* Guarantor A */}
//                   <div className="space-y-4">
//                     <h4 className="font-medium text-gray-900">Guarantor A</h4>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="guarantorAName"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Guarantor Name
//                         </label>
//                         <input
//                           id="guarantorAName"
//                           type="text"
//                           placeholder="Enter guarantor's full name"
//                           value={formData.guarantorA.name}
//                           onChange={(e) =>
//                             handleInputChange("guarantorA.name", e.target.value)
//                           }
//                           className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="guarantorAPhone"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Guarantor Telephone Number
//                         </label>
//                         <input
//                           id="guarantorAPhone"
//                           type="tel"
//                           placeholder="Enter guarantor's phone number"
//                           value={formData.guarantorA.phone}
//                           onChange={(e) =>
//                             handleInputChange(
//                               "guarantorA.phone",
//                               e.target.value,
//                             )
//                           }
//                           className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Guarantor B */}
//                   <div className="space-y-4">
//                     <h4 className="font-medium text-gray-900">Guarantor B</h4>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="guarantorBName"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Guarantor Name
//                         </label>
//                         <input
//                           id="guarantorBName"
//                           type="text"
//                           placeholder="Enter guarantor's full name"
//                           value={formData.guarantorB.name}
//                           onChange={(e) =>
//                             handleInputChange("guarantorB.name", e.target.value)
//                           }
//                           className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="guarantorBPhone"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Guarantor Telephone Number
//                         </label>
//                         <input
//                           id="guarantorBPhone"
//                           type="tel"
//                           placeholder="Enter guarantor's phone number"
//                           value={formData.guarantorB.phone}
//                           onChange={(e) =>
//                             handleInputChange(
//                               "guarantorB.phone",
//                               e.target.value,
//                             )
//                           }
//                           className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="mt-8">
//             <form onSubmit={handleSubmit} className="mt-6">
//               <button
//                 type="submit"
//                 className="mt-4 w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700"
//               >
//                 Confirm & Pay (₦{previewData?.firstPayment?.toLocaleString()})
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Define CartItem interface to match CartItemFromAPI from cart page
interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  };
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface PayInBitsFormProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  previewData?: any;
  previewLoading?: boolean;
  previewError?: string;
}

export default function PayInBitsForm({
  isOpen,
  onClose,
  cartItems = [],
  previewData,
  previewLoading,
  previewError,
}: PayInBitsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    bvn: "",
    nin: "",
    guarantorA: {
      name: "",
      phone: "",
    },
    guarantorB: {
      name: "",
      phone: "",
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("guarantorA.")) {
      const subField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        guarantorA: { ...prev.guarantorA, [subField]: value },
      }));
    } else if (field.startsWith("guarantorB.")) {
      const subField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        guarantorB: { ...prev.guarantorB, [subField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewData) return;

    // Check authentication
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      alert("Authentication required. Please log in again.");
      window.location.href = "/signin";
      return;
    }

    const paymentPayload = {
      orderItems: cartItems.map((item) => ({
        product: item.product._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        initialDeposit: previewData.firstPayment,
      })),
      shippingAddress: {
        fullName: formData.accountName,
        address: "User address", // Replace with actual input
        city: "User city", // Replace with actual input
        postalCode: "User postal", // Replace with actual input
        country: "Nigeria",
      },
      paymentMethod: "Card",
      paymentMode: "Pay In Bits",
      totalPrice: previewData.totalCost,
      initialPaymentAmount: previewData.firstPayment,
      paymentSchedule: previewData.paymentSchedule,
    };

    // Save comprehensive Pay In Bits data for OrderConfirmation and PaymentPage
    localStorage.setItem(
      "payInBitsData",
      JSON.stringify({
        initialDeposit: previewData.firstPayment,
        paymentMode: "bits",
        paymentSchedule: previewData.paymentSchedule,
        totalCost: previewData.totalCost,
        totalInterest: previewData.totalInterest,
        platformFee: previewData.platformFee,
        annualInterestRate: previewData.annualInterestRate,
        repaymentMonths: previewData.repaymentMonths,
        subsequentPayments: previewData.subsequentPayments,
        previewData: previewData, // Store the entire preview data
      }),
    );

    // Also save to initialDeposit for backward compatibility
    localStorage.setItem(
      "initialDeposit",
      JSON.stringify({
        initialDeposit: previewData.firstPayment,
        paymentMode: "bits",
      }),
    );

    console.log("Submitting payment:", paymentPayload);

    try {
      const response = await fetch("/api/cart/clear/all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok && response.status === 401) {
        alert("Authentication expired. Please log in again.");
        window.location.href = "/signin";
        return;
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }

    onClose();
    router.push("/cart/delivery");
  };

  const getImageUrl = (item: CartItem) => {
    if (item.imageUrl) {
      return item.imageUrl;
    }

    console.log("Using fallback image");
    return "/market/Image8.png";
  };

  // Helper function to safely format currency
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "0";
    }
    return amount.toLocaleString();
  };

  if (!isOpen) return null;

  if (previewLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-8">
          <span className="text-lg font-semibold">
            Loading payment preview...
          </span>
        </div>
      </div>
    );
  }

  if (previewError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-8">
          <span className="text-lg font-semibold text-red-600">
            {previewError}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-xl font-semibold">Pay little-by-little</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Item Details */}
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold">Item Details</h3>
                </div>
                <div className="space-y-4 p-6">
                  {cartItems.map((item) => (
                    <React.Fragment key={item._id}>
                      <div className="mb-2 flex items-center gap-4 border-b pb-2 last:mb-0 last:border-b-0 last:pb-0">
                        <img
                          src={getImageUrl(item) || "/placeholder.svg"}
                          alt={item.name}
                          className="h-16 w-16 rounded border object-cover"
                          onError={(e) => {
                            console.log("Image failed to load, using fallback");
                            e.currentTarget.src = "/market/Image8.png";
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Quantity:{" "}
                            {item.quantity.toString().padStart(2, "0")}
                          </p>
                          {previewData && previewData.firstPayment && (
                            <p className="text-sm font-semibold text-blue-600">
                              Initial Deposit: ₦
                              {formatCurrency(previewData.firstPayment)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {previewData && previewData.firstPayment ? (
                            <>
                              <p className="font-semibold text-blue-600">
                                ₦{formatCurrency(previewData.firstPayment)}{" "}
                                <span className="text-xs">
                                  (Initial Payment)
                                </span>
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                ₦{formatCurrency(item.price)}{" "}
                                <span className="text-xs">(Full Price)</span>
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold">
                              ₦{formatCurrency(item.price)}
                            </p>
                          )}
                        </div>
                      </div>
                      {previewData && previewData.paymentSchedule && Array.isArray(previewData.paymentSchedule) && (
                        <div className="mt-2">
                          <h4 className="mb-1 font-semibold">
                            Payment Schedule
                          </h4>
                          <table className="min-w-full divide-y divide-gray-200 border">
                            <thead>
                              <tr>
                                <th className="px-2 py-1 text-xs font-medium uppercase text-gray-500">
                                  #
                                </th>
                                <th className="px-1 py-1 text-xs font-medium uppercase text-gray-500">
                                  Due Date
                                </th>
                                <th className="px-1 py-1 text-xs font-medium uppercase text-gray-500">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {previewData.paymentSchedule.map(
                                (schedule: any, sidx: number) => (
                                  <tr key={sidx}>
                                    <td className="px-2 py-1 text-center">
                                      {schedule.paymentNumber || sidx + 1}
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                      {schedule.dueDate ? new Date(schedule.dueDate).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                      ₦{formatCurrency(schedule.totalPayment)}
                                    </td>
                                  </tr>
                                ),
                              )}
                              <tr>
                                <td
                                  colSpan={2}
                                  className="text-right font-bold"
                                >
                                  Total Installments
                                </td>
                                <td className="text-center font-bold">
                                  ₦
                                  {formatCurrency(
                                    previewData.paymentSchedule.reduce(
                                      (sum: number, s: any) =>
                                        sum + (s.totalPayment || 0),
                                      0,
                                    )
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="mt-4">
                            <h4 className="mb-1 font-semibold">
                              Payment Breakdown
                            </h4>
                            <ul className="mb-2">
                              <li>
                                <b>Initial Payment:</b> ₦
                                {formatCurrency(previewData.firstPayment)}{" "}
                                (Due:{" "}
                                {previewData.paymentSchedule[0]?.dueDate
                                  ? new Date(
                                      previewData.paymentSchedule[0].dueDate,
                                    ).toLocaleDateString()
                                  : "Immediately"}
                                )
                              </li>
                            </ul>
                            <h4 className="mb-1 font-semibold">
                              Subsequent Payments
                            </h4>
                            <ul>
                              {previewData.paymentSchedule.map(
                                (schedule: any, sidx: number) => (
                                  <li key={sidx}>
                                    Payment {schedule.paymentNumber || sidx + 1}: ₦
                                    {formatCurrency(schedule.totalPayment)}{" "}
                                    (Due:{" "}
                                    {schedule.dueDate ? new Date(schedule.dueDate).toLocaleDateString() : "N/A"}
                                    )
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold">Bank Details</h3>
                  <span className="rounded-md bg-yellow-400 px-2 py-1 text-xs font-medium text-black">
                    Required
                  </span>
                </div>
                <div className="space-y-4 p-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="accountName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Name
                    </label>
                    <input
                      id="accountName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.accountName}
                      onChange={(e) =>
                        handleInputChange("accountName", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      type="text"
                      placeholder="Enter your account number"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        handleInputChange("accountNumber", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bank Name
                    </label>
                    <input
                      id="bankName"
                      type="text"
                      placeholder="Enter your bank name"
                      value={formData.bankName}
                      onChange={(e) =>
                        handleInputChange("bankName", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="bvn"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bank Verification Number (BVN)
                    </label>
                    <input
                      id="bvn"
                      type="text"
                      placeholder="Enter your BVN"
                      value={formData.bvn}
                      onChange={(e) => handleInputChange("bvn", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="nin"
                      className="block text-sm font-medium text-gray-700"
                    >
                      National Identity Number (NIN)
                    </label>
                    <input
                      id="nin"
                      type="text"
                      placeholder="Enter your NIN"
                      value={formData.nin}
                      onChange={(e) => handleInputChange("nin", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantor Details */}
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold">Guarantor Details</h3>
                </div>
                <div className="space-y-6 p-6">
                  {/* Guarantor A */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Guarantor A</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="guarantorAName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Guarantor Name
                        </label>
                        <input
                          id="guarantorAName"
                          type="text"
                          placeholder="Enter guarantor's full name"
                          value={formData.guarantorA.name}
                          onChange={(e) =>
                            handleInputChange("guarantorA.name", e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="guarantorAPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Guarantor Telephone Number
                        </label>
                        <input
                          id="guarantorAPhone"
                          type="tel"
                          placeholder="Enter guarantor's phone number"
                          value={formData.guarantorA.phone}
                          onChange={(e) =>
                            handleInputChange(
                              "guarantorA.phone",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guarantor B */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Guarantor B</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="guarantorBName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Guarantor Name
                        </label>
                        <input
                          id="guarantorBName"
                          type="text"
                          placeholder="Enter guarantor's full name"
                          value={formData.guarantorB.name}
                          onChange={(e) =>
                            handleInputChange("guarantorB.name", e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="guarantorBPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Guarantor Telephone Number
                        </label>
                        <input
                          id="guarantorBPhone"
                          type="tel"
                          placeholder="Enter guarantor's phone number"
                          value={formData.guarantorB.phone}
                          onChange={(e) =>
                            handleInputChange(
                              "guarantorB.phone",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="mt-6">
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700"
              >
                Confirm & Pay (₦{formatCurrency(previewData?.firstPayment)})
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
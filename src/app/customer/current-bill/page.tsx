                                                    

// "use client"

// import React, { useState } from "react"
// import { useQuery } from '@tanstack/react-query'
// import { useAuth } from '@/api/hooks/useAuth'
// import Image from "next/image"

// interface BillItemApi {
//   billName: string
//   category: string
//   amount: number
//   quantity: number
//   amountWithoutCharge: number
//   image: string | null
//   _id: string
//   createdAt: string
//   updatedAt: string
//   totalPaidForItem: number
//   remainingBalance: number | null
//   paymentStatus: string
//   isMandatory?: boolean
//   promoPercentage?: number;
//   promoCode?: {
//     code: string;
//     promoPercentage: number;
//     [key: string]: any;
//   };
// }

// interface BillApi {
//   _id: string
//   billName: string
//   billCode: string
//   organisationId: { _id: string; email: string }
//   assignToCustomer: { _id: string; email: string }[]
//   assignToCustomerGroup: { _id: string; name: string; description: string }
//   startDate: string
//   endDate: string
//   startTime: string
//   endTime: string
//   billItems: BillItemApi[]
//   promoCode: string
//   customUniqueCode: string
//   platformServiceCharge: number
//   promoPercentage: number
//   billImage: string | null
//   maxPaymentDuration: {
//     startDate: string
//     endDate: string
//     startTime: string
//     endTime: string
//   }
//   totalAmount: number
//   totalAmountWithoutCharge: number
//   status: string
//   createdBy: { _id: string; email: string }
//   createdAt: string
//   updatedAt: string
//   __v: number
//   totalBillAmount: number | null
//   totalPaidForBill: number
//   totalRemainingBalance: number | null
//   billPaymentStatus: string
//   paymentHistory: number
// }

// interface TableBillItem extends BillItemApi {
//   sn: number
//   billId: string
//   billCode: string
//   billDuration: string
//   startDate: string
//   endDate: string
//   transactionDate: string
//   modeOfPayment: string
// }

// // Modal component for error display
// const ErrorModal = ({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) => {
//   return (
//     open && (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//         <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
//           <div className="text-lg font-semibold text-red-600 mb-2">Error</div>
//           <div className="text-gray-800 mb-4">{message}</div>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     )
//   );
// };

// const CurrentBill = () => {
//   const { client } = useAuth()
//   const [selectedPayments, setSelectedPayments] = useState<Record<string, number>>({})
//   const [paying, setPaying] = useState(false)
//   const [viewType, setViewType] = useState<'current' | 'all'>('current')
//   const [promoCodes, setPromoCodes] = useState<Record<string, string>>({})
//   const [modalOpen, setModalOpen] = useState(false)
//   const [modalMessage, setModalMessage] = useState("")

//   // Fetch bills data
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['customer-bills'],
//     queryFn: async () => {
//       const res = await client.get('/api/bills/customer/all')
//       return res.data
//     },
//     enabled: !!client,
//   })

//   // Fetch categories
//   const { data: categoriesData } = useQuery({
//     queryKey: ['bill-categories'],
//     queryFn: async () => {
//       const res = await client.get('/api/bill-categories')
//       return res.data.data
//     },
//     enabled: !!client,
//   })

//   // Helper functions
//   const getCategoryName = (cat: string) => {
//     if (/^[a-f0-9]{24}$/i.test(cat) && categoriesData) {
//       const found = categoriesData.find((c: any) => c._id === cat || c.id === cat)
//       return found ? found.name : cat
//     }
//     return cat
//   }

//   const groupByCategory = (items: TableBillItem[]) => {
//     const groups: Record<string, TableBillItem[]> = {}
//     items.forEach(item => {
//       const cat = getCategoryName(item.category)
//       if (!groups[cat]) groups[cat] = []
//       groups[cat].push(item)
//     })
//     return groups
//   }

//   const formatCurrency = (amount: number | null) => {
//     if (amount === null || amount === undefined) return "NGN 0.00"
//     return `NGN ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
//   }

//   const getOutstandingAmount = (item: TableBillItem) => {
//     return item.amount - (item.totalPaidForItem || 0)
//   }

//   // Process bills data
//   const allBills: BillApi[] = data?.data || []
//   const sortedBills = [...allBills].sort((a, b) => 
//     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   )
//   const currentBill = sortedBills[0]
//   const previousBills = sortedBills.slice(1)

//   const currentBillItems: TableBillItem[] = (currentBill?.billItems || []).map((item, idx) => ({
//     ...item,
//     sn: idx + 1,
//     billId: currentBill._id,
//     billCode: currentBill.billCode,
//     billDuration: `${currentBill.startDate?.slice(0, 10)} to ${currentBill.endDate?.slice(0, 10)}`,
//     startDate: currentBill.startDate?.slice(0, 10),
//     endDate: currentBill.endDate?.slice(0, 10),
//     transactionDate: item.updatedAt,
//     modeOfPayment: item.paymentStatus === 'paid' ? 'Self' : 'Partner',
//   }))

//    const previousDebtItems: TableBillItem[] = previousBills.flatMap((bill) =>
//     bill.billItems
//       .filter(item => (item.amount - (item.totalPaidForItem || 0)) > 0)
//       .map((item, idx) => ({
//         ...item,
//         sn: idx + 1,
//         billId: bill._id,
//         billCode: bill.billCode,
//         billDuration: `${bill.startDate?.slice(0, 10)} to ${bill.endDate?.slice(0, 10)}`,
//         startDate: bill.startDate?.slice(0, 10),
//         endDate: bill.endDate?.slice(0, 10),
//         transactionDate: item.updatedAt,
//         modeOfPayment: item.paymentStatus === 'paid' ? 'Self' : 'Partner',
//       }))
//   )
//   const payableItems = viewType === 'all' ? [...previousDebtItems, ...currentBillItems] : currentBillItems

//   // Promo code handling
//   const isPromoCodeValid = (item: TableBillItem) => {
//     return item.promoCode && 
//            promoCodes[item._id] && 
//            promoCodes[item._id].trim().toUpperCase() === item.promoCode.code.toUpperCase()
//   }

//   const getPromoPercentage = (item: TableBillItem) => {
//     return isPromoCodeValid(item) && item.promoCode ? item.promoCode.promoPercentage : 0
//   }

//   const calculatePromoDiscount = (item: TableBillItem) => {
//     const percentage = getPromoPercentage(item)
//     if (percentage > 0) {
//       const outstanding = getOutstandingAmount(item)
//       return (outstanding * percentage) / 100
//     }
//     return 0
//   }

//   const getEffectiveAmount = (item: TableBillItem) => {
//     const outstanding = getOutstandingAmount(item)
//     const discount = calculatePromoDiscount(item)
//     return outstanding - discount
//   }
  
//   const calcOverallGrandTotal = (items: TableBillItem[]) => 
//     items.reduce((sum, item) => {
//       if (item.isMandatory) {
//         return sum + item.amount; // Include full amount for mandatory items
//       }
//       return sum + (item.totalPaidForItem || 0) + (selectedPayments[item._id] || 0);
//     }, 0)

    
//   const handlePaymentInput = (billItemId: string, value: string) => {
//     const num = Number(value)
//     setSelectedPayments((prev) => ({ ...prev, [billItemId]: isNaN(num) ? 0 : num }))
//   }

//   const handlePromoCodeInput = (billItemId: string, value: string) => {
//     setPromoCodes((prev) => ({ ...prev, [billItemId]: value }));
//   };

//   const handlePromoCodeBlur = (item: TableBillItem) => {
//     if (promoCodes[item._id] && item.promoCode && promoCodes[item._id].trim() !== item.promoCode.code) {
//       setModalMessage('Invalid promo code');
//       setModalOpen(true);
//     }
//   };

//   const handleMakePayment = async () => {
//     setPaying(true)
//     setModalMessage("")
    
//     const paymentsByBill: Record<string, { 
//       billId: string; 
//       billItems: { 
//         billItemId: string; 
//         amountToPay: number; 
//         promoCode?: string 
//       }[] 
//     }> = {}
    
//     let hasInvalidPayment = false;
    
//     payableItems.forEach(item => {
//       const outstanding = getOutstandingAmount(item)
//       let amount = 0
      
//       if (item.isMandatory) {
//         // Mandatory items: full amount
//         amount = outstanding;
//       } else {
//         // Non-mandatory items: user input
//         const inputAmount = selectedPayments[item._id] || 0;
        
//         // Validate payment amount
//         if (inputAmount > outstanding) {
//           setModalMessage(`Payment for ${item.billName} exceeds outstanding amount`);
//           hasInvalidPayment = true;
//           return;
//         }
        
//         amount = inputAmount;
//       }
      
//       // Apply promo discount if valid
//       if (isPromoCodeValid(item)) {
//         const discount = calculatePromoDiscount(item);
//         amount = Math.min(amount, getEffectiveAmount(item));
//       }
      
//       if (amount > 0) {
//         if (!paymentsByBill[item.billId]) {
//           paymentsByBill[item.billId] = { billId: item.billId, billItems: [] }
//         }
        
//         paymentsByBill[item.billId].billItems.push({
//           billItemId: item._id,
//           amountToPay: amount,
//           ...(isPromoCodeValid(item) && { promoCode: promoCodes[item._id] })
//         })
//       }
//     })
    
//     if (hasInvalidPayment) {
//       setModalOpen(true)
//       setPaying(false)
//       return;
//     }
    
//     if (Object.keys(paymentsByBill).length === 0) {
//       setModalMessage("Please enter an amount to pay for at least one item")
//       setModalOpen(true)
//       setPaying(false)
//       return
//     }
    
//     try {
//       for (const billId in paymentsByBill) {
//         const { billItems } = paymentsByBill[billId]
//         const res = await client.post('/api/payments/bills', {
//           billId,
//           billItems,
//           paymentMethod: "card",
//           notes: "Partial payment",
//         })
        
//         const link = res?.data?.data?.data?.link
//         if (link) {
//           window.location.href = link
//           return
//         }
//       }
      
//       refetch()
//     } catch (e: any) {
//       const errorMsg = e?.response?.data?.message || e.message || "Payment failed"
//       setModalMessage(errorMsg)
//       setModalOpen(true)
//     } finally {
//       setPaying(false)
//     }
//   }

//   // Organization info
//   const organisationId = currentBill?.organisationId?._id
//   const { data: organisationData } = useQuery({
//     queryKey: ["organisation-info", organisationId],
//     queryFn: async () => {
//       if (!organisationId) return null
//       const res = await client.get(`/api/user/${organisationId}`)
//       return res.data
//     },
//     enabled: !!organisationId,
//   })

//   return (
//     <div className="min-h-screen bg-white p-8 rounded">
//       {/* Organization Header */}
//       <div className="flex flex-col items-center justify-center mb-8">
//         {organisationData?.businessLogo && (
//           <div className="mb-2">
//             <Image
//               src={organisationData.businessLogo}
//               alt={organisationData.organisationName || "Organisation Logo"}
//               width={80}
//               height={80}
//               className="rounded-full object-cover"
//               priority
//               onError={(e) => {
//                 e.currentTarget.src = "/Logo.svg"
//               }}
//             />
//           </div>
//         )}
//         <div className="text-3xl font-bold text-gray-800 mb-2">
//           {organisationData?.organisationName || "FINKIA LIMITED"}
//         </div>
//         <div className="text-gray-600 mb-1">
//           {organisationData?.officeAddress1 || organisationData?.address || "1A, Hughes Avenue, Yaba, Lagos, Nigeria."}
//         </div>
//         <div className="text-gray-600">
//           {organisationData?.email || organisationData?.businessEmailAdress || organisationData?.contactEmail || "Finkia@raoatech.com"}
//           {organisationData?.phoneNumber ? ` | ${organisationData.phoneNumber}` : " | +234 8097227051"}
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         {/* View Toggle */}
//         <div className="flex gap-4 mb-6">
//           <button
//             className={`px-4 py-2 rounded font-medium ${
//               viewType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//             onClick={() => setViewType('all')}
//           >
//             Current bill and outstanding debts
//           </button>
//           <button
//             className={`px-4 py-2 rounded font-medium ${
//               viewType === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//             onClick={() => setViewType('current')}
//           >
//             Current bill only
//           </button>
//         </div>

//         {/* Loading/Error States */}
//         {isLoading && <div className="text-center text-gray-500">Loading bills...</div>}
//         {error && <div className="text-center text-red-500">{(error as any)?.message || 'Error loading bills'}</div>}
        
//         {/* Bills Table */}
//         {!isLoading && !error && (
//           <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-300">
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">S/N</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Item</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Category</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Code</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Description</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Duration</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Start Date</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">End Date</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Debit Amount</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Credit Amount</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Promo Debit</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Paid Amount</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Promo Code</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Promo Value</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3">Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Previous Debts Section */}
//                   {viewType === 'all' && previousDebtItems.length > 0 && (
//                     <>
//                       <tr>
//                         <td colSpan={15} className="text-lg text-blue-500 font-bold px-3 py-2">
//                           Previous Debts
//                         </td>
//                       </tr>
//                       {Object.entries(groupByCategory(previousDebtItems)).map(([category, items]) => (
//                         <React.Fragment key={`prev-${category}`}>
//                           <tr>
//                             <td colSpan={15} className="bg-gray-100 font-semibold px-3 py-2">
//                               Category: {category}
//                             </td>
//                           </tr>
//                           {items.map(item => (
//                             <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.sn}.</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200 whitespace-nowrap">{item.billName}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{category}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billCode}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billName}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billDuration}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.startDate}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.endDate}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200 ">{formatCurrency(item.amount)}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 {item.isMandatory ? (
//                                   <span className="text-blue-900 font-semibold">
//                                     {formatCurrency(item.amount)}
//                                   </span>
//                                 ) : (
//                                   <input
//                                     type="number"
//                                     placeholder="Amount"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded"
//                                     value={selectedPayments[item._id] || ""}
//                                     onChange={(e) => handlePaymentInput(item._id, e.target.value)}
//                                     min={0}
//                                     max={getOutstandingAmount(item)}
//                                   />
//                                 )}
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 {isPromoCodeValid(item) ? (
//                                   <span className="text-blue-900 font-semibold">
//                                     {formatCurrency(getEffectiveAmount(item))}
//                                   </span>
//                                 ) : "NGN 0.00"}
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 {formatCurrency(item.totalPaidForItem)}
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 <input
//                                   type="text"
//                                   placeholder="Promo code"
//                                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                                   value={promoCodes[item._id] || ""}
//                                   onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
//                                   onBlur={() => handlePromoCodeBlur(item)}
//                                 />
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 {isPromoCodeValid(item) && getPromoPercentage(item) > 0 ? (
//                                   <span className="text-green-700 font-semibold">
//                                     {formatCurrency(calculatePromoDiscount(item))}
//                                   </span>
//                                 ) : "-"}
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 whitespace-nowrap">
//                                 {formatCurrency(getOutstandingAmount(item))}
//                               </td>
//                             </tr>
//                           ))}
//                           {/* Category Subtotal */}
//                           <tr className="bg-gray-50">
//                             <td colSpan={8} className="text-right font-semibold px-4 py-3">
//                               SUB-TOTAL ({category})
//                             </td>
//                             <td className="text-blue-900 whitespace-nowrap font-bold text-center py-3 border-r border-gray-200">
//                               {formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))}
//                             </td>
//                             <td className="text-blue-900 font-bold text-center whitespace-nowrap py-3">
//                               {formatCurrency(items.reduce((sum, item) => sum + item.totalPaidForItem, 0))}
//                             </td>
//                             <td colSpan={5}></td>
//                           </tr>
//                         </React.Fragment>
//                       ))}
//                     </>
//                   )}

//                   {/* Current Bill Section */}
//                   {currentBillItems.length > 0 && (
//                     <>
//                       <tr>
//                         <td colSpan={15} className="text-blue-500 text-lg font-bold px-3 py-3">
//                           Current Bill
//                         </td>
//                       </tr>
//                       {Object.entries(groupByCategory(currentBillItems)).map(([category, items]) => (
//                         <React.Fragment key={`current-${category}`}>
//                           <tr>
//                             <td colSpan={15} className="bg-gray-100 font-semibold px-3 py-2">
//                               Category: {category}
//                             </td>
//                           </tr>
//                           {items.map(item => (
//                             <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.sn}.</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200 whitespace-nowrap">{item.billName}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{category}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billCode}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billName}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billDuration}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.startDate}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.endDate}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{formatCurrency(item.amount)}</td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 {item.isMandatory ? (
//                                   <span className="text-blue-900 whitespace-nowrap font-semibold">
//                                     {formatCurrency(item.amount)}
//                                   </span>
//                                 ) : (
//                                   <input
//                                     type="number"
//                                     placeholder="Amount"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded"
//                                     value={selectedPayments[item._id] || ""}
//                                     onChange={(e) => handlePaymentInput(item._id, e.target.value)}
//                                     min={0}
//                                     max={getOutstandingAmount(item)}
//                                   />
//                                 )}
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 {isPromoCodeValid(item) ? (
//                                   <span className="text-blue-900 font-semibold">
//                                     {formatCurrency(getEffectiveAmount(item))}
//                                   </span>
//                                 ) : "NGN 0.00"}
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 {formatCurrency(item.totalPaidForItem)}
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 <input
//                                   type="text"
//                                   placeholder="Promo code"
//                                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                                   value={promoCodes[item._id] || ""}
//                                   onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
//                                   onBlur={() => handlePromoCodeBlur(item)}
//                                 />
//                               </td>
//                               <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                 {isPromoCodeValid(item) && getPromoPercentage(item) > 0 ? (
//                                   <span className="text-green-700 font-semibold">
//                                     {formatCurrency(calculatePromoDiscount(item))}
//                                   </span>
//                                 ) : "-"}
//                               </td>
//                               <td className="text-gray-700 px-3 py-4">
//                                 {formatCurrency(getOutstandingAmount(item))}
//                               </td>
//                             </tr>
//                           ))}
//                           {/* Category Subtotal */}
//                           <tr className="bg-gray-50">
//                             <td colSpan={8} className="text-right font-semibold px-4 py-3">
//                               SUB-TOTAL ({category})
//                             </td>
//                             <td className="text-blue-900 font-bold text-center py-3 border-r border-gray-200">
//                               {formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))}
//                             </td>
//                             <td className="text-blue-900 font-bold text-center py-3">
//                               {formatCurrency(items.reduce((sum, item) => sum + item.totalPaidForItem, 0))}
//                             </td>
//                             <td colSpan={5}></td>
//                           </tr>
//                         </React.Fragment>
//                       ))}
//                     </>
//                   )}

//                   {/* Grand Totals Section */}
                  
//                   <tr className="bg-blue-100 font-bold">
//                     <td colSpan={8} className="text-right px-4 py-3">
//                       GRAND TOTAL(Debit)
//                     </td>
//                     <td className="text-blue-900 text-center py-3">
//                       {viewType === 'all' 
//                         ? formatCurrency(payableItems.reduce((sum, item) => sum + (item.totalPaidForItem || 0), 0))
//                         : formatCurrency(currentBillItems.reduce((sum, item) => sum + (item.totalPaidForItem || 0), 0))
//                       }
//                     </td>
//                     <td colSpan={6}></td>
//                   </tr>
//                    <tr className="bg-blue-100 font-bold">
//                          <td colSpan={8} className="text-right px-4 py-3">
//                            Grand Total(Credit):
//                          </td>
//                          <td className="text-blue-900 text-center py-3 border-r border-gray-200">
//                            {formatCurrency(calcOverallGrandTotal(payableItems))}
//                          </td>
//                          <td colSpan={6}></td>
//                        </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Payment Button */}
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={handleMakePayment}
//             disabled={paying}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-lg"
//           >
//             {paying ? "Processing Payment..." : "Make Payment"}
//           </button>
//         </div>
        
//         {/* Footer */}
//         <div className="text-center text-gray-500 text-sm mt-8">
//           <p>Powered by Raoatech (www.raoatech.com)</p>
//         </div>
        
//         {/* Error Modal */}
//         <ErrorModal open={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />
//       </div>
//     </div>
//   )
// }

// export default CurrentBill





// promo debit fix


// "use client"

// import React, { useState } from "react"
// import { useQuery } from '@tanstack/react-query'
// import { useAuth } from '@/api/hooks/useAuth'
// import Image from "next/image"

// interface BillItemApi {
//   billName: string
//   category: string
//   amount: number
//   quantity: number
//   amountWithoutCharge: number
//   image: string | null
//   _id: string
//   createdAt: string
//   updatedAt: string
//   totalPaidForItem: number
//   remainingBalance: number | null
//   paymentStatus: string
//   isMandatory?: boolean
//   promoPercentage?: number;
//   promoCode?: {
//     code: string;
//     promoPercentage: number;
//     [key: string]: any;
//   };
// }

// interface BillApi {
//   _id: string
//   billName: string
//   billCode: string
//   organisationId: { _id: string; email: string }
//   assignToCustomer: { _id: string; email: string }[]
//   assignToCustomerGroup: { _id: string; name: string; description: string }
//   startDate: string
//   endDate: string
//   startTime: string
//   endTime: string
//   billItems: BillItemApi[]
//   promoCode: string
//   customUniqueCode: string
//   platformServiceCharge: number
//   promoPercentage: number
//   billImage: string | null
//   maxPaymentDuration: {
//     startDate: string
//     endDate: string
//     startTime: string
//     endTime: string
//   }
//   totalAmount: number
//   totalAmountWithoutCharge: number
//   status: string
//   createdBy: { _id: string; email: string }
//   createdAt: string
//   updatedAt: string
//   __v: number
//   totalBillAmount: number | null
//   totalPaidForBill: number
//   totalRemainingBalance: number | null
//   billPaymentStatus: string
//   paymentHistory: number
// }

// interface TableBillItem extends BillItemApi {
//   sn: number
//   billId: string
//   billCode: string
//   billDuration: string
//   startDate: string
//   endDate: string
//   transactionDate: string
//   modeOfPayment: string
// }

// // Modal component for error display
// const ErrorModal = ({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) => {
//   return (
//     open && (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//         <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
//           <div className="text-lg font-semibold text-red-600 mb-2">Error</div>
//           <div className="text-gray-800 mb-4">{message}</div>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     )
//   );
// };

// const CurrentBill = () => {
//   const { client } = useAuth()
//   const [selectedPayments, setSelectedPayments] = useState<Record<string, number>>({})
//   const [paying, setPaying] = useState(false)
//   const [viewType, setViewType] = useState<'current' | 'all'>('current')
//   const [promoCodes, setPromoCodes] = useState<Record<string, string>>({})
//   const [modalOpen, setModalOpen] = useState(false)
//   const [modalMessage, setModalMessage] = useState("")

//   // Fetch bills data
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['customer-bills'],
//     queryFn: async () => {
//       const res = await client.get('/api/bills/customer/all')
//       return res.data
//     },
//     enabled: !!client,
//   })

//   // Fetch categories
//   const { data: categoriesData } = useQuery({
//     queryKey: ['bill-categories'],
//     queryFn: async () => {
//       const res = await client.get('/api/bill-categories')
//       return res.data.data
//     },
//     enabled: !!client,
//   })

//   // Helper functions
//   const getCategoryName = (cat: string) => {
//     if (/^[a-f0-9]{24}$/i.test(cat) && categoriesData) {
//       const found = categoriesData.find((c: any) => c._id === cat || c.id === cat)
//       return found ? found.name : cat
//     }
//     return cat
//   }
//     const getPromoDebitAmount = (item: TableBillItem) => {
//     if (isPromoCodeValid(item)) {
//       return getEffectiveAmount(item); // This is the outstanding amount minus discount
//     }
//     return getOutstandingAmount(item); // If no valid promo, show original outstanding
//   };

//   const groupByCategory = (items: TableBillItem[]) => {
//     const groups: Record<string, TableBillItem[]> = {}
//     items.forEach(item => {
//       const cat = getCategoryName(item.category)
//       if (!groups[cat]) groups[cat] = []
//       groups[cat].push(item)
//     })
//     return groups
//   }

//   const formatCurrency = (amount: number | null) => {
//     if (amount === null || amount === undefined) return "₦0.00"
//     return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
//   }

//   const getOutstandingAmount = (item: TableBillItem) => {
//     return item.amount - (item.totalPaidForItem || 0)
//   }

//   // Process bills data
//   const allBills: BillApi[] = data?.data || []
//   const sortedBills = [...allBills].sort((a, b) => 
//     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   )
//   const currentBill = sortedBills[0]
//   const previousBills = sortedBills.slice(1)

//   const currentBillItems: TableBillItem[] = (currentBill?.billItems || []).map((item, idx) => ({
//     ...item,
//     sn: idx + 1,
//     billId: currentBill._id,
//     billCode: currentBill.billCode,
//     billDuration: `${currentBill.startDate?.slice(0, 10)} to ${currentBill.endDate?.slice(0, 10)}`,
//     startDate: currentBill.startDate?.slice(0, 10),
//     endDate: currentBill.endDate?.slice(0, 10),
//     transactionDate: item.updatedAt,
//     modeOfPayment: item.paymentStatus === 'paid' ? 'Self' : 'Partner',
//   } as TableBillItem))

//   const previousDebtItems: TableBillItem[] = previousBills.flatMap((bill) =>
//     bill.billItems
//       .filter(item => getOutstandingAmount(item as TableBillItem) > 0)
//       .map((item, idx) => ({
//         ...item,
//         sn: idx + 1,
//         billId: bill._id,
//         billCode: bill.billCode,
//         billDuration: `${bill.startDate?.slice(0, 10)} to ${bill.endDate?.slice(0, 10)}`,
//         startDate: bill.startDate?.slice(0, 10),
//         endDate: bill.endDate?.slice(0, 10),
//         transactionDate: item.updatedAt,
//         modeOfPayment: item.paymentStatus === 'paid' ? 'Self' : 'Partner',
//       } as TableBillItem))
//   )

//   const payableItems = viewType === 'all' ? [...previousDebtItems, ...currentBillItems] : currentBillItems

//   // Calculate totals
//   const currentBillTotalDebit = currentBillItems.reduce((sum, item) => sum + item.amount, 0)
//   const currentBillTotalPaid = currentBillItems.reduce((sum, item) => sum + (item.totalPaidForItem || 0), 0)
  
//   const previousDebtTotalDebit = previousDebtItems.reduce((sum, item) => sum + item.amount, 0)
//   const previousDebtTotalPaid = previousDebtItems.reduce((sum, item) => sum + (item.totalPaidForItem || 0), 0)
  
//   const allItemsTotalDebit = viewType === 'all' ? 
//     currentBillTotalDebit + previousDebtTotalDebit : 
//     currentBillTotalDebit
    
//   const allItemsTotalPaid = viewType === 'all' ? 
//     currentBillTotalPaid + previousDebtTotalPaid : 
//     currentBillTotalPaid

//   // Promo code handling
//   const isPromoCodeValid = (item: TableBillItem) => {
//     return item.promoCode && 
//            promoCodes[item._id] && 
//            promoCodes[item._id].trim().toUpperCase() === item.promoCode.code.toUpperCase()
//   }

//   const getPromoPercentage = (item: TableBillItem) => {
//     return isPromoCodeValid(item) && item.promoCode ? item.promoCode.promoPercentage : 0
//   }

//   const calculatePromoDiscount = (item: TableBillItem) => {
//     const percentage = getPromoPercentage(item)
//     if (percentage > 0) {
//       const outstanding = getOutstandingAmount(item)
//       return (outstanding * percentage) / 100
//     }
//     return 0
//   }

//   const getEffectiveAmount = (item: TableBillItem) => {
//     const outstanding = getOutstandingAmount(item)
//     const discount = calculatePromoDiscount(item)
//     return outstanding - discount
//   }
  
//   const calcOverallGrandTotal = (items: TableBillItem[]) => 
//     items.reduce((sum, item) => {
//       if (item.isMandatory) {
//         return sum + getOutstandingAmount(item)
//       }
//       return sum + (selectedPayments[item._id] || 0)
//     }, 0)

    
//   const handlePaymentInput = (billItemId: string, value: string) => {
//     const num = Number(value)
//     setSelectedPayments((prev) => ({ ...prev, [billItemId]: isNaN(num) ? 0 : num }))
//   }

//   const handlePromoCodeInput = (billItemId: string, value: string) => {
//     setPromoCodes((prev) => ({ ...prev, [billItemId]: value }));
//   };

//   const handlePromoCodeBlur = (item: TableBillItem) => {
//     if (promoCodes[item._id] && item.promoCode && promoCodes[item._id].trim() !== item.promoCode.code) {
//       setModalMessage('Invalid promo code');
//       setModalOpen(true);
//     }
//   };

//   const handleMakePayment = async () => {
//     setPaying(true)
//     setModalMessage("")
    
//     const paymentsByBill: Record<string, { 
//       billId: string; 
//       billItems: { 
//         billItemId: string; 
//         amountToPay: number; 
//         promoCode?: string 
//       }[] 
//     }> = {}
    
//     let hasInvalidPayment = false;
    
//     payableItems.forEach(item => {
//       const outstanding = getOutstandingAmount(item)
//       let amount = 0
      
//       if (item.isMandatory) {
//         amount = outstanding;
//       } else {
//         const inputAmount = selectedPayments[item._id] || 0;
        
//         if (inputAmount > outstanding) {
//           setModalMessage(`Payment for ${item.billName} exceeds outstanding amount`);
//           hasInvalidPayment = true;
//           return;
//         }
        
//         amount = inputAmount;
//       }
      
//       if (isPromoCodeValid(item)) {
//         const discount = calculatePromoDiscount(item);
//         amount = Math.min(amount, getEffectiveAmount(item));
//       }
      
//       if (amount > 0) {
//         if (!paymentsByBill[item.billId]) {
//           paymentsByBill[item.billId] = { billId: item.billId, billItems: [] }
//         }
        
//         paymentsByBill[item.billId].billItems.push({
//           billItemId: item._id,
//           amountToPay: amount,
//           ...(isPromoCodeValid(item) && { promoCode: promoCodes[item._id] })
//         })
//       }
//     })
    
//     if (hasInvalidPayment) {
//       setModalOpen(true)
//       setPaying(false)
//       return;
//     }
    
//     if (Object.keys(paymentsByBill).length === 0) {
//       setModalMessage("Please enter an amount to pay for at least one item")
//       setModalOpen(true)
//       setPaying(false)
//       return
//     }
    
//     try {
//       for (const billId in paymentsByBill) {
//         const { billItems } = paymentsByBill[billId]
//         const res = await client.post('/api/payments/bills', {
//           billId,
//           billItems,
//           paymentMethod: "card",
//           notes: "Partial payment",
//         })
        
//         const link = res?.data?.data?.data?.link
//         if (link) {
//           window.location.href = link
//           return
//         }
//       }
      
//       refetch()
//     } catch (e: any) {
//       const errorMsg = e?.response?.data?.message || e.message || "Payment failed"
//       setModalMessage(errorMsg)
//       setModalOpen(true)
//     } finally {
//       setPaying(false)
//     }
//   }

//   // Organization info
//   const organisationId = currentBill?.organisationId?._id
//   const { data: organisationData } = useQuery({
//     queryKey: ["organisation-info", organisationId],
//     queryFn: async () => {
//       if (!organisationId) return null
//       const res = await client.get(`/api/user/${organisationId}`)
//       return res.data
//     },
//     enabled: !!organisationId,
//   })

//   return (
//     <div className="min-h-screen bg-white p-8 rounded">
//       {/* Organization Header */}
//       <div className="flex flex-col items-center justify-center mb-8">
//         {organisationData?.businessLogo && (
//           <div className="mb-2">
//             <Image
//               src={organisationData.businessLogo}
//               alt={organisationData.organisationName || "Organisation Logo"}
//               width={80}
//               height={80}
//               className="rounded-full object-cover"
//               priority
//               onError={(e) => {
//                 e.currentTarget.src = "/Logo.svg"
//               }}
//             />
//           </div>
//         )}
//         <div className="text-3xl font-bold text-gray-800 mb-2">
//           {organisationData?.organisationName || "FINKIA LIMITED"}
//         </div>
//         <div className="text-gray-600 mb-1">
//           {organisationData?.officeAddress1 || organisationData?.address || "1A, Hughes Avenue, Yaba, Lagos, Nigeria."}
//         </div>
//         <div className="text-gray-600">
//           {organisationData?.email || organisationData?.businessEmailAdress || organisationData?.contactEmail || "Finkia@raoatech.com"}
//           {organisationData?.phoneNumber ? ` | ${organisationData.phoneNumber}` : " | +234 8097227051"}
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         {/* View Toggle */}
//         <div className="flex gap-4 mb-6">
//           <button
//             className={`px-4 py-2 rounded font-medium ${
//               viewType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//             onClick={() => setViewType('all')}
//           >
//             Current bill and outstanding debts
//           </button>
//           <button
//             className={`px-4 py-2 rounded font-medium ${
//               viewType === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//             onClick={() => setViewType('current')}
//           >
//             Current bill only
//           </button>
//         </div>

//         {/* Loading/Error States */}
//         {isLoading && <div className="text-center text-gray-500">Loading bills...</div>}
//         {error && <div className="text-center text-red-500">{(error as any)?.message || 'Error loading bills'}</div>}
        
//         {/* Bills Table */}
//         {!isLoading && !error && (
//           <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-300">
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">S/N</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Item</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Category</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Code</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Description</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Duration</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Start Date</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">End Date</th>
//                     <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Debit Amount</th>
//                     <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Credit Amount</th>
//                     <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Promo Debit</th>
//                     <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Paid Amount</th>
//                     <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Promo Code</th>
//                     <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Promo Value</th>
//                     <th className="text-gray-700 font-semibold text-right px-3 py-3">Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Previous Debts Section */}
//                   {viewType === 'all' && previousDebtItems.length > 0 && (
//                     <>
//                       <tr>
//                         <td colSpan={15} className="text-lg text-blue-500 font-bold px-3 py-2">
//                           Previous Debts
//                         </td>
//                       </tr>
//                       {Object.entries(groupByCategory(previousDebtItems)).map(([category, items]) => {
//                         // Calculate subtotals for this category
//                         let totalDebit = 0;
//                         let totalCredit = 0;
//                         let totalDiscount = 0;
//                         let totalPaid = 0;
//                         let totalOutstanding = 0;

//                         items.forEach(item => {
//                           const outstanding = getOutstandingAmount(item);
//                           totalDebit += item.amount;
//                           totalPaid += item.totalPaidForItem || 0;
//                           totalOutstanding += outstanding;
                          
//                           const discount = isPromoCodeValid(item) ? calculatePromoDiscount(item) : 0;
//                           totalDiscount += discount;
                          
//                           if (item.isMandatory) {
//                             totalCredit += outstanding;
//                           } else {
//                             totalCredit += selectedPayments[item._id] || 0;
//                           }
//                         });

//                         return (
//                           <React.Fragment key={`prev-${category}`}>
//                             <tr>
//                               <td colSpan={15} className="bg-gray-100 font-semibold px-3 py-2">
//                                 Category: {category}
//                               </td>
//                             </tr>
//                             {items.map(item => (
//                               <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.sn}.</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 whitespace-nowrap">{item.billName}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{category}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billCode}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billName}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billDuration}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.startDate}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.endDate}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">{formatCurrency(item.amount)}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                   {item.isMandatory ? (
//                                     <span className="text-blue-900 font-semibold">
//                                       {formatCurrency(item.amount)}
//                                     </span>
//                                   ) : (
//                                     <input
//                                       type="number"
//                                       placeholder="Amount"
//                                       className="w-full px-3 py-2 border border-gray-300 rounded text-right"
//                                       value={selectedPayments[item._id] || ""}
//                                       onChange={(e) => handlePaymentInput(item._id, e.target.value)}
//                                       min={0}
//                                       max={getOutstandingAmount(item)}
//                                     />
//                                   )}
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
//                                   {isPromoCodeValid(item) ? (
//                                     <span className="text-blue-900 font-semibold">
//                                       {formatCurrency(calculatePromoDiscount(item))}
//                                     </span>
//                                   ) : "₦0.00"}
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
//                                   {formatCurrency(item.totalPaidForItem)}
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                   <input
//                                     type="text"
//                                     placeholder="Promo code"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded"
//                                     value={promoCodes[item._id] || ""}
//                                     onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
//                                     onBlur={() => handlePromoCodeBlur(item)}
//                                   />
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
//                                   {isPromoCodeValid(item) && getPromoPercentage(item) > 0 ? (
//                                     <span className="text-green-700 font-semibold">
//                                       {formatCurrency(calculatePromoDiscount(item))}
//                                     </span>
//                                   ) : "-"}
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 whitespace-nowrap text-right">
//                                   {formatCurrency(getOutstandingAmount(item))}
//                                 </td>
//                               </tr>
//                             ))}
//                             {/* Category Subtotal */}
//                             <tr className="bg-gray-50">
//                               <td colSpan={8} className="text-right font-semibold px-4 py-3">
//                                 SUB-TOTAL ({category})
//                               </td>
//                               <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalDebit)}
//                               </td>
//                               <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalCredit)}
//                               </td>
//                               <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalDiscount)}
//                               </td>
//                               <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalPaid)}
//                               </td>
//                               <td className="border-r border-gray-200"></td>
//                                <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalDiscount)}
//                               </td> 
//                               <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3">
//                                 {formatCurrency(totalOutstanding)}
//                               </td>
//                             </tr>
//                           </React.Fragment>
//                         );
//                       })}
//                     </>
//                   )}

//                   {/* Current Bill Section */}
//                   {currentBillItems.length > 0 && (
//                     <>
//                       <tr>
//                         <td colSpan={15} className="text-blue-500 text-lg font-bold px-3 py-3">
//                           Current Bill
//                         </td>
//                       </tr>
//                       {Object.entries(groupByCategory(currentBillItems)).map(([category, items]) => {
//                         // Calculate subtotals for this category
//                         let totalDebit = 0;
//                         let totalCredit = 0;
//                         let totalDiscount = 0;
//                         let totalPaid = 0;
//                         let totalOutstanding = 0;

//                         items.forEach(item => {
//                           const outstanding = getOutstandingAmount(item);
//                           totalDebit += item.amount;
//                           totalPaid += item.totalPaidForItem || 0;
//                           totalOutstanding += outstanding;
                          
//                           const discount = isPromoCodeValid(item) ? calculatePromoDiscount(item) : 0;
//                           totalDiscount += discount;
                          
//                           if (item.isMandatory) {
//                             totalCredit += outstanding;
//                           } else {
//                             totalCredit += selectedPayments[item._id] || 0;
//                           }
//                         });

//                         return (
//                           <React.Fragment key={`current-${category}`}>
//                             <tr>
//                               <td colSpan={15} className="bg-gray-100 font-semibold px-3 py-2">
//                                 Category: {category}
//                               </td>
//                             </tr>
//                             {items.map(item => (
//                               <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.sn}.</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 whitespace-nowrap">{item.billName}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{category}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billCode}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billName}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billDuration}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.startDate}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.endDate}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">{formatCurrency(item.amount)}</td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                   {item.isMandatory ? (
//                                     <span className="text-blue-900 whitespace-nowrap font-semibold">
//                                       {formatCurrency(item.amount)}
//                                     </span>
//                                   ) : (
//                                     <input
//                                       type="number"
//                                       placeholder="Amount"
//                                       className="w-full px-3 py-2 border border-gray-300 rounded text-right"
//                                       value={selectedPayments[item._id] || ""}
//                                       onChange={(e) => handlePaymentInput(item._id, e.target.value)}
//                                       min={0}
//                                       max={getOutstandingAmount(item)}
//                                     />
//                                   )}
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
//                                   {isPromoCodeValid(item) ? (
//                                     <span className="text-blue-900 font-semibold">
//                                       {formatCurrency(calculatePromoDiscount(item))}
//                                     </span>
//                                   ) : "₦0.00"}
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
//                                   {formatCurrency(item.totalPaidForItem)}
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
//                                   <input
//                                     type="text"
//                                     placeholder="Promo code"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded"
//                                     value={promoCodes[item._id] || ""}
//                                     onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
//                                     onBlur={() => handlePromoCodeBlur(item)}
//                                   />
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
//                                   {isPromoCodeValid(item) && getPromoPercentage(item) > 0 ? (
//                                     <span className="text-green-700 font-semibold">
//                                       {formatCurrency(calculatePromoDiscount(item))}
//                                     </span>
//                                   ) : "-"}
//                                 </td>
//                                 <td className="text-gray-700 px-3 py-4 text-right">
//                                   {formatCurrency(getOutstandingAmount(item))}
//                                 </td>
//                               </tr>
//                             ))}
//                             {/* Category Subtotal */}
//                             <tr className="bg-gray-50">
//                               <td colSpan={8} className="text-right font-semibold px-4 py-3">
//                                 SUB-TOTAL ({category})
//                               </td>
//                               <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalDebit)}
//                               </td>
//                               <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalCredit)}
//                               </td>
//                               <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalDiscount)}
//                               </td>
//                               <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalPaid)}
//                               </td>
//                               <td className="border-r border-gray-200"></td>
//                               <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
//                                 {formatCurrency(totalDiscount)}
//                               </td>
//                               <td className="text-blue-900 font-bold text-right py-3">
//                                 {formatCurrency(totalOutstanding)}
//                               </td>
//                             </tr>
//                           </React.Fragment>
//                         );
//                       })}

//                       {/* Current Bill Grand Total */}
//                       <tr className="bg-blue-50 font-bold">
//                         <td colSpan={8} className="text-right px-4 py-3">
//                           GRAND TOTAL (CURRENT BILL)
//                         </td>
//                         <td className="text-blue-900 text-right py-3 border-r border-gray-200">
//                           {formatCurrency(currentBillTotalDebit)}
//                         </td>
//                         <td className="text-blue-900 text-right py-3 border-r border-gray-200">
//                           {formatCurrency(currentBillItems.reduce((sum, item) => {
//                             if (item.isMandatory) return sum + getOutstandingAmount(item);
//                             return sum + (selectedPayments[item._id] || 0);
//                           }, 0))}
//                         </td>
//                         <td colSpan={5}></td>
//                       </tr>
//                     </>
//                   )}

//                   {/* Overall Payment Total */}
//                   <tr className="bg-green-100 font-bold">
//                     <td colSpan={8} className="text-right px-4 py-3">
//                       GRAND TOTAL CREDIT
//                     </td>
//                     <td></td>
//                     <td className="text-right px-4 py-3 text-green-700">
//                       {formatCurrency(calcOverallGrandTotal(payableItems))}
//                     </td>
//                     <td colSpan={5}></td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Payment Button */}
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={handleMakePayment}
//             disabled={paying}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-lg"
//           >
//             {paying ? "Processing Payment..." : "Make Payment"}
//           </button>
//         </div>
        
//         {/* Footer */}
//         <div className="text-center text-gray-500 text-sm mt-8">
//           <p>Powered by Raoatech (www.raoatech.com)</p>
//         </div>
        
//         {/* Error Modal */}
//         <ErrorModal open={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />
//       </div>
//     </div>
//   )
// }

// export default CurrentBill

"use client"

import React, { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/api/hooks/useAuth'
import Image from "next/image"

interface BillItemApi {
  billName: string
  category: string
  amount: number
  quantity: number
  amountWithoutCharge: number
  image: string | null
  _id: string
  createdAt: string
  updatedAt: string
  totalPaidForItem: number
  remainingBalance: number | null
  paymentStatus: string
  isMandatory?: boolean
  promoPercentage?: number;
  promoCode?: {
    code: string;
    promoPercentage: number;
    [key: string]: any;
  };
}

interface BillApi {
  _id: string
  billName: string
  billCode: string
  organisationId: { _id: string; email: string }
  assignToCustomer: { _id: string; email: string }[]
  assignToCustomerGroup: { _id: string; name: string; description: string }
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  billItems: BillItemApi[]
  promoCode: string
  customUniqueCode: string
  platformServiceCharge: number
  promoPercentage: number
  billImage: string | null
  maxPaymentDuration: {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
  }
  totalAmount: number
  totalAmountWithoutCharge: number
  status: string
  createdBy: { _id: string; email: string }
  createdAt: string
  updatedAt: string
  __v: number
  totalBillAmount: number | null
  totalPaidForBill: number
  totalRemainingBalance: number | null
  billPaymentStatus: string
  paymentHistory: number
}

interface TableBillItem extends BillItemApi {
  sn: number
  billId: string
  billCode: string
  billDuration: string
  startDate: string
  endDate: string
  transactionDate: string
  modeOfPayment: string
}

// Modal component for error display
const ErrorModal = ({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) => {
  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <div className="text-lg font-semibold text-red-600 mb-2">Error</div>
          <div className="text-gray-800 mb-4">{message}</div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

const CurrentBill = () => {
  const { client } = useAuth()
  const [selectedPayments, setSelectedPayments] = useState<Record<string, number>>({})
  const [paying, setPaying] = useState(false)
  const [viewType, setViewType] = useState<'current' | 'all'>('current')
  const [promoCodes, setPromoCodes] = useState<Record<string, string>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  // Fetch bills data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-bills'],
    queryFn: async () => {
      const res = await client.get('/api/bills/customer/all')
      return res.data
    },
    enabled: !!client,
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['bill-categories'],
    queryFn: async () => {
      const res = await client.get('/api/bill-categories')
      return res.data.data
    },
    enabled: !!client,
  })

  // Helper functions
  const getCategoryName = (cat: string) => {
    if (/^[a-f0-9]{24}$/i.test(cat) && categoriesData) {
      const found = categoriesData.find((c: any) => c._id === cat || c.id === cat)
      return found ? found.name : cat
    }
    return cat
  }

  const groupByCategory = (items: TableBillItem[]) => {
    const groups: Record<string, TableBillItem[]> = {}
    items.forEach(item => {
      const cat = getCategoryName(item.category)
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "₦0.00"
    return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getOutstandingAmount = (item: TableBillItem) => {
    return item.amount - (item.totalPaidForItem || 0)
  }

  // Process bills data
  const allBills: BillApi[] = data?.data || []
  const sortedBills = [...allBills].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const currentBill = sortedBills[0]
  const previousBills = sortedBills.slice(1)

  const currentBillItems: TableBillItem[] = (currentBill?.billItems || []).map((item, idx) => ({
    ...item,
    sn: idx + 1,
    billId: currentBill._id,
    billCode: currentBill.billCode,
    billDuration: `${currentBill.startDate?.slice(0, 10)} to ${currentBill.endDate?.slice(0, 10)}`,
    startDate: currentBill.startDate?.slice(0, 10),
    endDate: currentBill.endDate?.slice(0, 10),
    transactionDate: item.updatedAt,
    modeOfPayment: item.paymentStatus === 'paid' ? 'Self' : 'Partner',
  } as TableBillItem))

  const previousDebtItems: TableBillItem[] = previousBills.flatMap((bill) =>
    bill.billItems
      .filter(item => getOutstandingAmount(item as TableBillItem) > 0)
      .map((item, idx) => ({
        ...item,
        sn: idx + 1,
        billId: bill._id,
        billCode: bill.billCode,
        billDuration: `${bill.startDate?.slice(0, 10)} to ${bill.endDate?.slice(0, 10)}`,
        startDate: bill.startDate?.slice(0, 10),
        endDate: bill.endDate?.slice(0, 10),
        transactionDate: item.updatedAt,
        modeOfPayment: item.paymentStatus === 'paid' ? 'Self' : 'Partner',
      } as TableBillItem))
  )

  const payableItems = viewType === 'all' ? [...previousDebtItems, ...currentBillItems] : currentBillItems

  // Calculate totals
  const currentBillTotalDebit = currentBillItems.reduce((sum, item) => sum + item.amount, 0)
  const currentBillTotalPaid = currentBillItems.reduce((sum, item) => sum + (item.totalPaidForItem || 0), 0)
  
  const previousDebtTotalDebit = previousDebtItems.reduce((sum, item) => sum + item.amount, 0)
  const previousDebtTotalPaid = previousDebtItems.reduce((sum, item) => sum + (item.totalPaidForItem || 0), 0)
  
  const allItemsTotalDebit = viewType === 'all' ? 
    currentBillTotalDebit + previousDebtTotalDebit : 
    currentBillTotalDebit
    
  const allItemsTotalPaid = viewType === 'all' ? 
    currentBillTotalPaid + previousDebtTotalPaid : 
    currentBillTotalPaid

  // Promo code handling
  const isPromoCodeValid = (item: TableBillItem) => {
    return item.promoCode && 
           promoCodes[item._id] && 
           promoCodes[item._id].trim().toUpperCase() === item.promoCode.code.toUpperCase()
  }

  const getPromoPercentage = (item: TableBillItem) => {
    return isPromoCodeValid(item) && item.promoCode ? item.promoCode.promoPercentage : 0
  }

  const calculatePromoDiscount = (item: TableBillItem) => {
    const percentage = getPromoPercentage(item)
    if (percentage > 0) {
      const outstanding = getOutstandingAmount(item)
      return (outstanding * percentage) / 100
    }
    return 0
  }

  const getEffectiveAmount = (item: TableBillItem) => {
    const outstanding = getOutstandingAmount(item)
    const discount = calculatePromoDiscount(item)
    return Math.max(0, outstanding - discount)
  }
  
  const calcOverallGrandTotal = (items: TableBillItem[]) => 
    items.reduce((sum, item) => {
      if (item.isMandatory) {
        return sum + getOutstandingAmount(item)
      }
      return sum + (selectedPayments[item._id] || 0)
    }, 0)

    
  const handlePaymentInput = (billItemId: string, value: string) => {
    const num = Number(value)
    setSelectedPayments((prev) => ({ ...prev, [billItemId]: isNaN(num) ? 0 : num }))
  }

  const handlePromoCodeInput = (billItemId: string, value: string) => {
    setPromoCodes((prev) => ({ ...prev, [billItemId]: value }));
  };

  const handlePromoCodeBlur = (item: TableBillItem) => {
    if (promoCodes[item._id] && item.promoCode && promoCodes[item._id].trim() !== item.promoCode.code) {
      setModalMessage('Invalid promo code');
      setModalOpen(true);
    }
  };

  const handleMakePayment = async () => {
    setPaying(true)
    setModalMessage("")
    
    const paymentsByBill: Record<string, { 
      billId: string; 
      billItems: { 
        billItemId: string; 
        amountToPay: number; 
        promoCode?: string 
      }[] 
    }> = {}
    
    let hasInvalidPayment = false;
    
    payableItems.forEach(item => {
      const outstanding = getOutstandingAmount(item)
      let amount = 0
      
      if (item.isMandatory) {
        amount = outstanding;
      } else {
        const inputAmount = selectedPayments[item._id] || 0;
        
        if (inputAmount > outstanding) {
          setModalMessage(`Payment for ${item.billName} exceeds outstanding amount`);
          hasInvalidPayment = true;
          return;
        }
        
        amount = inputAmount;
      }
      
      if (isPromoCodeValid(item)) {
        const discount = calculatePromoDiscount(item);
        amount = Math.min(amount, getEffectiveAmount(item));
      }
      
      if (amount > 0) {
        if (!paymentsByBill[item.billId]) {
          paymentsByBill[item.billId] = { billId: item.billId, billItems: [] }
        }
        
        paymentsByBill[item.billId].billItems.push({
          billItemId: item._id,
          amountToPay: amount,
          ...(isPromoCodeValid(item) && { promoCode: promoCodes[item._id] })
        })
      }
    })
    
    if (hasInvalidPayment) {
      setModalOpen(true)
      setPaying(false)
      return;
    }
    
    if (Object.keys(paymentsByBill).length === 0) {
      setModalMessage("Please enter an amount to pay for at least one item")
      setModalOpen(true)
      setPaying(false)
      return
    }
    
    try {
      for (const billId in paymentsByBill) {
        const { billItems } = paymentsByBill[billId]
        const res = await client.post('/api/payments/bills', {
          billId,
          billItems,
          paymentMethod: "card",
          notes: "Partial payment",
        })
        
        const link = res?.data?.data?.data?.link
        if (link) {
          window.location.href = link
          return
        }
      }
      
      refetch()
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e.message || "Payment failed"
      setModalMessage(errorMsg)
      setModalOpen(true)
    } finally {
      setPaying(false)
    }
  }

  // Organization info
  const organisationId = currentBill?.organisationId?._id
  const { data: organisationData } = useQuery({
    queryKey: ["organisation-info", organisationId],
    queryFn: async () => {
      if (!organisationId) return null
      const res = await client.get(`/api/user/${organisationId}`)
      return res.data
    },
    enabled: !!organisationId,
  })

  return (
    <div className="min-h-screen bg-white p-8 rounded">
      {/* Organization Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        {organisationData?.businessLogo && (
          <div className="mb-2">
            <Image
              src={organisationData.businessLogo}
              alt={organisationData.organisationName || "Organisation Logo"}
              width={80}
              height={80}
              className="rounded-full object-cover"
              priority
              onError={(e) => {
                e.currentTarget.src = "/Logo.svg"
              }}
            />
          </div>
        )}
        <div className="text-3xl font-bold text-gray-800 mb-2">
          {organisationData?.organisationName || "FINKIA LIMITED"}
        </div>
        <div className="text-gray-600 mb-1">
          {organisationData?.officeAddress1 || organisationData?.address || "1A, Hughes Avenue, Yaba, Lagos, Nigeria."}
        </div>
        <div className="text-gray-600">
          {organisationData?.email || organisationData?.businessEmailAdress || organisationData?.contactEmail || "Finkia@raoatech.com"}
          {organisationData?.phoneNumber ? ` | ${organisationData.phoneNumber}` : " | +234 8097227051"}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded font-medium ${
              viewType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setViewType('all')}
          >
            Current bill and outstanding debts
          </button>
          <button
            className={`px-4 py-2 rounded font-medium ${
              viewType === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setViewType('current')}
          >
            Current bill only
          </button>
        </div>

        {/* Loading/Error States */}
        {isLoading && <div className="text-center text-gray-500">Loading bills...</div>}
        {error && <div className="text-center text-red-500">{(error as any)?.message || 'Error loading bills'}</div>}
        
        {/* Bills Table */}
        {!isLoading && !error && (
          <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-300">
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">S/N</th>
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Item</th>
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Category</th>
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Code</th>
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Description</th>
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Bill Duration</th>
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Start Date</th>
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">End Date</th>
                    <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Debit Amount</th>
                    <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Credit Amount</th>
                    <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Promo Debit</th>
                    <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Paid Amount</th>
                    <th className="text-gray-700 font-semibold text-left px-3 py-3 border-r border-gray-300">Promo Code</th>
                    <th className="text-gray-700 font-semibold text-right px-3 py-3 border-r border-gray-300">Promo Value</th>
                    <th className="text-gray-700 font-semibold text-right px-3 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Previous Debts Section */}
                  {viewType === 'all' && previousDebtItems.length > 0 && (
                    <>
                      <tr>
                        <td colSpan={15} className="text-lg text-blue-500 font-bold px-3 py-2">
                          Previous Debts
                        </td>
                      </tr>
                      {Object.entries(groupByCategory(previousDebtItems)).map(([category, items]) => {
                        // Calculate subtotals for this category
                        let totalDebit = 0;
                        let totalCredit = 0;
                        let totalDiscount = 0;
                        let totalPaid = 0;
                        let totalOutstanding = 0;

                        items.forEach(item => {
                          const outstanding = getOutstandingAmount(item);
                          totalDebit += item.amount;
                          totalPaid += item.totalPaidForItem || 0;
                          totalOutstanding += outstanding;
                          
                          const discount = isPromoCodeValid(item) ? calculatePromoDiscount(item) : 0;
                          totalDiscount += discount;
                          
                          if (item.isMandatory) {
                            totalCredit += outstanding;
                          } else {
                            totalCredit += selectedPayments[item._id] || 0;
                          }
                        });

                        return (
                          <React.Fragment key={`prev-${category}`}>
                            <tr>
                              <td colSpan={15} className="bg-gray-100 font-semibold px-3 py-2">
                                Category: {category}
                              </td>
                            </tr>
                            {items.map(item => {
                              const outstanding = getOutstandingAmount(item);
                              const discount = calculatePromoDiscount(item);
                              const effectiveAmount = getEffectiveAmount(item);
                              
                              return (
                              <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.sn}.</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 whitespace-nowrap">{item.billName}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{category}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billCode}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billName}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billDuration}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.startDate}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.endDate}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">{formatCurrency(item.amount)}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
                                  {item.isMandatory ? (
                                    <span className="text-blue-900 font-semibold text-right w-full block">
                                      {formatCurrency(outstanding)}
                                    </span>
                                  ) : (
                                    <input
                                      type="number"
                                      placeholder="Amount"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-right"
                                      value={selectedPayments[item._id] || ""}
                                      onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                      min={0}
                                      max={outstanding}
                                    />
                                  )}
                                </td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
                                  {isPromoCodeValid(item) ? (
                                    <span className="text-blue-900 font-semibold">
                                      {formatCurrency(effectiveAmount)}
                                    </span>
                                  ) : formatCurrency(outstanding)}
                                </td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
                                  {formatCurrency(item.totalPaidForItem)}
                                </td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
                                  <input
                                    type="text"
                                    placeholder="Promo code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    value={promoCodes[item._id] || ""}
                                    onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
                                    onBlur={() => handlePromoCodeBlur(item)}
                                  />
                                </td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
                                  {isPromoCodeValid(item) ? (
                                    <span className="text-green-700 font-semibold">
                                      {formatCurrency(discount)}
                                    </span>
                                  ) : "-"}
                                </td>
                                <td className="text-gray-700 px-3 py-4 whitespace-nowrap text-right">
                                  {formatCurrency(outstanding)}
                                </td>
                              </tr>
                            )})}
                            {/* Category Subtotal */}
                            <tr className="bg-gray-50">
                              <td colSpan={8} className="text-right font-semibold px-4 py-3">
                                SUB-TOTAL ({category})
                              </td>
                              <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalDebit)}
                              </td>
                              <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalCredit)}
                              </td>
                              <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalOutstanding - totalDiscount)}
                              </td>
                              <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalPaid)}
                              </td>
                              <td className="border-r border-gray-200"></td>
                              <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalDiscount)}
                              </td>
                              <td className="text-blue-900 whitespace-nowrap font-bold text-right py-3">
                                {formatCurrency(totalOutstanding)}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </>
                  )}

                  {/* Current Bill Section */}
                  {currentBillItems.length > 0 && (
                    <>
                      <tr>
                        <td colSpan={15} className="text-blue-500 text-lg font-bold px-3 py-3">
                          Current Bill
                        </td>
                      </tr>
                      {Object.entries(groupByCategory(currentBillItems)).map(([category, items]) => {
                        // Calculate subtotals for this category
                        let totalDebit = 0;
                        let totalCredit = 0;
                        let totalDiscount = 0;
                        let totalPaid = 0;
                        let totalOutstanding = 0;

                        items.forEach(item => {
                          const outstanding = getOutstandingAmount(item);
                          totalDebit += item.amount;
                          totalPaid += item.totalPaidForItem || 0;
                          totalOutstanding += outstanding;
                          
                          const discount = isPromoCodeValid(item) ? calculatePromoDiscount(item) : 0;
                          totalDiscount += discount;
                          
                          if (item.isMandatory) {
                            totalCredit += outstanding;
                          } else {
                            totalCredit += selectedPayments[item._id] || 0;
                          }
                        });

                        return (
                          <React.Fragment key={`current-${category}`}>
                            <tr>
                              <td colSpan={15} className="bg-gray-100 font-semibold px-3 py-2">
                                Category: {category}
                              </td>
                            </tr>
                            {items.map(item => {
                              const outstanding = getOutstandingAmount(item);
                              const discount = calculatePromoDiscount(item);
                              const effectiveAmount = getEffectiveAmount(item);
                              
                              return (
                              <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.sn}.</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 whitespace-nowrap">{item.billName}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{category}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billCode}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billName}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.billDuration}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.startDate}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">{item.endDate}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">{formatCurrency(item.amount)}</td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
                                  {item.isMandatory ? (
                                    <span className="text-blue-900 whitespace-nowrap font-semibold text-right w-full block">
                                      {formatCurrency(outstanding)}
                                    </span>
                                  ) : (
                                    <input
                                      type="number"
                                      placeholder="Amount"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-right"
                                      value={selectedPayments[item._id] || ""}
                                      onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                      min={0}
                                      max={outstanding}
                                    />
                                  )}
                                </td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
                                  {isPromoCodeValid(item) ? (
                                    <span className="text-blue-900 font-semibold">
                                      {formatCurrency(effectiveAmount)}
                                    </span>
                                  ) : formatCurrency(outstanding)}
                                </td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
                                  {formatCurrency(item.totalPaidForItem)}
                                </td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200">
                                  <input
                                    type="text"
                                    placeholder="Promo code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    value={promoCodes[item._id] || ""}
                                    onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
                                    onBlur={() => handlePromoCodeBlur(item)}
                                  />
                                </td>
                                <td className="text-gray-700 px-3 py-4 border-r border-gray-200 text-right">
                                  {isPromoCodeValid(item) ? (
                                    <span className="text-green-700 font-semibold">
                                      {formatCurrency(discount)}
                                    </span>
                                  ) : "-"}
                                </td>
                                <td className="text-gray-700 px-3 py-4 text-right">
                                  {formatCurrency(outstanding)}
                                </td>
                              </tr>
                            )})}
                            {/* Category Subtotal */}
                            <tr className="bg-gray-50">
                              <td colSpan={8} className="text-right font-semibold px-4 py-3">
                                SUB-TOTAL ({category})
                              </td>
                              <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalDebit)}
                              </td>
                              <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalCredit)}
                              </td>
                              <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalOutstanding - totalDiscount)}
                              </td>
                              <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalPaid)}
                              </td>
                              <td className="border-r border-gray-200"></td>
                              <td className="text-blue-900 font-bold text-right py-3 border-r border-gray-200">
                                {formatCurrency(totalDiscount)}
                              </td>
                              <td className="text-blue-900 font-bold text-right py-3">
                                {formatCurrency(totalOutstanding)}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}

                      {/* Current Bill Grand Total */}
                      <tr className="bg-blue-50 font-bold">
                        <td colSpan={8} className="text-right px-4 py-3">
                          GRAND TOTAL (CURRENT BILL)
                        </td>
                        <td className="text-blue-900 text-right py-3 border-r border-gray-200">
                          {formatCurrency(currentBillTotalDebit)}
                        </td>
                        <td className="text-blue-900 text-right py-3 border-r border-gray-200">
                          {formatCurrency(currentBillItems.reduce((sum, item) => {
                            if (item.isMandatory) return sum + getOutstandingAmount(item);
                            return sum + (selectedPayments[item._id] || 0);
                          }, 0))}
                        </td>
                        <td colSpan={5}></td>
                      </tr>
                    </>
                  )}

                  {/* Overall Payment Total */}
                  <tr className="bg-green-50 font-bold">
                    <td colSpan={8} className="text-right px-4 py-3">
                      GRAND TOTAL CREDIT
                    </td>
                    <td></td>
                    <td className="text-right px-4 py-3 text-blue-700">
                      {formatCurrency(calcOverallGrandTotal(payableItems))}
                    </td>
                    <td colSpan={5}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleMakePayment}
            disabled={paying}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-lg"
          >
            {paying ? "Processing Payment..." : "Make Payment"}
          </button>
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Powered by Raoatech (www.raoatech.com)</p>
        </div>
        
        {/* Error Modal */}
        <ErrorModal open={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />
      </div>
    </div>
  )
}

export default CurrentBill
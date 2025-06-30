// "use client"

// import React, { useState } from 'react';
// import { Printer, Calendar, User, Building2, Mail, Phone, Plus, Trash2, Calculator } from 'lucide-react';
// import Image from "next/image"
// export default function CurrentBillComponent() {
//   const [billData, setBillData] = useState({
//     billCode: 'BILL-001',
//     startDate: '2025-06-01',
//     endDate: '2025-06-12',
//     organizationName: 'Name of Organization',
//     address: '123 Business Street',
//     email: 'contact@yourorg.com',
//     phone: '+1 (555) 123-4567',
//     customerName: 'John Doe',
//     customerId: 'CUST-001',
//     customerGroup: 'Premium'
//   });

//   const [billItems, setBillItems] = useState([
//     { id: 1, billItem:"School fees", description: 'Previous balance', duration: 30, amount: 150.00},
//     { id: 2, billItem:"text books",  description: 'Product Item 2', duration: 0, amount: 75.50 },
//     { id: 3, billItem:"Medical checkup",  description: 'Consultation', duration: 60, amount: 200.00 }
//   ]);
  
//   const [startDate, setStartDate] = useState("2024-05-01")
//     const [endDate, setEndDate] = useState("2024-06-14")
//   const addNewItem = () => {
//     const newItem = {
//       id: Date.now(),
//       billItem: '',
//       description: '',
//       duration: 0,
//       amount: 0,
      
//     };
//     setBillItems([...billItems, newItem]);
//   };

//   const updateItem = (id: number, field: string, value: string | number) => {
//     setBillItems(billItems.map(item => 
//       item.id === id ? { ...item, [field]: value } : item
//     ));
//   };

//   const removeItem = (id: number) => {
//     setBillItems(billItems.filter(item => item.id !== id));
//   };

//   const calculateSubtotal = () => {
//     return billItems.reduce((sum, item) => sum + (item.amount), 0);
//   };

//   const subtotal = calculateSubtotal();
//   const tax = subtotal * 0.1; // 10% tax
//   const total = subtotal + tax;

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 shadow-lg min-h-screen">
//       {/* Header */}
//       <div className="border-2 border-gray-700/50 bg-gray-800/30 rounded-lg p-4 mb-6">
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center gap-2">
//              <Image src="/Logo.svg" width={100} height={100} alt="logo" />
           
//             <div>
//               <input
//                 type="text"
//                 value={billData.organizationName}
//                 onChange={(e) => setBillData({...billData, organizationName: e.target.value})}
//                 className="text-xl font-bold border-b border-gray-600 bg-transparent text-white placeholder-gray-400"
//                 placeholder="Name of Organization"
//               />
//             </div>
//           </div>
//           <button
//             onClick={handlePrint}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
//           >
//             <Printer className="w-4 h-4" />
//             Print
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
          
//               <span className="font-semibold text-gray-300">Address:</span>
//             </div>
//             <textarea
//               value={billData.address}
//               onChange={(e) => setBillData({...billData, address: e.target.value})}
//               className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 resize-none focus:border-blue-500 focus:outline-none"
              
//             />
            
//             <div className="flex items-center gap-2 mt-2 mb-1">
//               <Mail className="w-4 h-4 text-gray-400" />
//               <span className="font-semibold text-gray-300">Email:</span>
//             </div>
//             <input
//               type="email"
//               value={billData.email}
//               onChange={(e) => setBillData({...billData, email: e.target.value})}
//               className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
//             />

//             <div className="flex items-center gap-2 mt-2 mb-1">
//               <Phone className="w-4 h-4 text-gray-400" />
//               <span className="font-semibold text-gray-300">Phone:</span>
//             </div>
//             <input
//               type="tel"
//               value={billData.phone}
//               onChange={(e) => setBillData({...billData, phone: e.target.value})}
//               className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           <div className="space-y-4">
//            <div className="grid grid-cols-3 gap-4 h-24">
//   {/* Bill's Code */}
//   <div>
//     <label className="block font-semibold mb-1 text-gray-300">Bill&apos;s Code:</label>
//     <input
//       type="text"
//       value={billData.billCode}
//       onChange={(e) => setBillData({ ...billData, billCode: e.target.value })}
//       className="w-full h-10 mt-1 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
//     />
//   </div>

//   {/* Duration */}
//   <div>
//     <label className="block font-semibold mb-1 text-gray-300">Bill Duration:</label>
//     <div className="flex items-center gap-2">
//       <input
//         id="start-date"
//         type="date"
//         value={billData.startDate}
//         onChange={(e) => setBillData({ ...billData, startDate: e.target.value })}
//         className="w-full h-10 border border-gray-600 bg-gray-800/50 text-white rounded p-2 text-sm focus:border-blue-500 focus:outline-none"
//       />
//       <span className="text-gray-300">to</span>
//       <input
//         id="end-date"
//         type="date"
//         value={billData.endDate}
//         onChange={(e) => setBillData({ ...billData, endDate: e.target.value })}
//         className="w-full h-10 border border-gray-600 bg-gray-800/50 text-white rounded p-2 text-sm focus:border-blue-500 focus:outline-none"
//       />
//     </div>
//   </div>
// </div>


//             <div className="grid grid-cols-3 gap-2">
//               <div>
//                 <label className="block font-semibold mb-1 text-gray-300">Customer Name:</label>
//                 <input
//                   type="text"
//                   value={billData.customerName}
//                   onChange={(e) => setBillData({...billData, customerName: e.target.value})}
//                   className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1 text-gray-300">Customer ID:</label>
//                 <input
//                   type="text"
//                   value={billData.customerId}
//                   onChange={(e) => setBillData({...billData, customerId: e.target.value})}
//                   className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block font-semibold mb-1 text-gray-300">Customer Group:</label>
//                 <select
//                   value={billData.customerGroup}
//                   onChange={(e) => setBillData({...billData, customerGroup: e.target.value})}
//                   className="w-full border border-gray-600 bg-gray-800/50 text-white rounded p-2 focus:border-blue-500 focus:outline-none"
//                 >
//                   <option value="Premium">Premium</option>
//                   <option value="Standard">Standard</option>
//                   <option value="Basic">Basic</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bill Items Table */}
//       <div className="mb-6">
//         <div className="overflow-x-auto bg-gray-800/30 rounded-lg border border-gray-700/50">
//           <table className="min-w-full">
//             <thead className="bg-gray-800/50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   S/N
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Bill Item 
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Duration
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                   Amount
//                 </th>
                
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-700/50">
//               {billItems.length === 0 ? (
//                 <tr className="h-12">
//                   <td colSpan={6} className="text-center text-sm font-semibold text-gray-400 py-8">
//                     No Items Added Yet
//                   </td>
//                 </tr>
//               ) : (
//                 billItems.map((item, index) => (
//                   <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
//                     <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
//                       {index + 1}
//                     </td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
//           <input
//     type="text"
//     value={item.billItem}
//     onChange={(e) => updateItem(item.id, 'billItem', e.target.value)}
//     className="w-full border-none bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
//       placeholder="Bill item"
//           />
//               </td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm">
//                       <input
//                         type="text"
//                         value={item.description}
//                         onChange={(e) => updateItem(item.id, 'description', e.target.value)}
//                         className="w-full border-none bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
//                         placeholder="Enter description"
//                       />
//                     </td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm">
//                       <input
//                         type="number"
//                         value={item.duration}
//                         onChange={(e) => updateItem(item.id, 'duration', parseInt(e.target.value) || 0)}
//                         className="w-full border-none bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
//                         min="0"
//                       />
//                     </td>
//                     <td className="whitespace-nowrap px-6 py-4 text-sm">
//                       <input
//                         type="number"
//                         value={item.amount}
//                         onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
//                         className="w-full border-none bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
//                         min="0"
//                         step="0.01"
//                       />
//                     </td>
                   
                    
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
        
       
//       </div>

//       {/* Totals Section */}
//       <div className="flex ">
//         <div className="w-80 border border-gray-700/50 bg-gray-800/30 rounded-lg">
         
          
//           <div className="p-3 space-y-2">
//             <div className="flex justify-between text-gray-300">
//               <span>Subtotal:</span>
//               <span>${subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-gray-300">
//               <span>Tax (10%):</span>
//               <span>${tax.toFixed(2)}</span>
//             </div>
//             <div className="border-t border-gray-700/50 pt-2">
//               <div className="flex justify-between font-bold text-lg text-white">
//                 <span>Total:</span>
//                 <span>${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Current Bill Section */}
//       <div className="mt-8 border-t-2 border-gray-700/50 pt-4">
//         <h2 className="text-xl font-bold mb-4 text-white">Current Bill</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="text-gray-300">
//             <p><strong className="text-white">Bill Period:</strong> {billData.startDate} to {billData.endDate}</p>
//             <p><strong className="text-white">Customer:</strong> {billData.customerName} ({billData.customerId})</p>
//             <p><strong className="text-white">Group:</strong> {billData.customerGroup}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-bold text-white">Amount Due: ${total.toFixed(2)}</p>
//             <p className="text-sm text-gray-400">Due Date: {billData.endDate}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client"

import { useState } from "react"
import { Download, FileSpreadsheet } from "lucide-react"

interface StatementItem {
  sn: number
  billItem: string
  code: string
  description: string
  billDuration: string
  startDate: string
  endDate: string
  debitAmount: number | null
  creditAmount: number | null
  balance: number | null
  transactionDate: string
  modeOfPayment: "Self" | "Partner"
}

const CurrentBill = () => {
  const [startDate, setStartDate] = useState("2024-05-01")
  const [endDate, setEndDate] = useState("2024-06-14")

  // Sample data matching the updated structure
  const statementData: StatementItem[] = [
    {
      sn: 1,
      billItem: "Rent",
      code: "RT01",
      description: "Monthly rent payment for office space",
      billDuration: "01/05/2024 to 02/05/2024",
      startDate: "01/05/2024",
      endDate: "02/05/2024",
      debitAmount: null,
      creditAmount: 50000,
      balance: 50000,
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Self",
    },
    {
      sn: 2,
      billItem: "Rent",
      code: "RT01",
      description: "Monthly rent payment for office space",
      billDuration: "01/05/2024 to 02/05/2024",
      startDate: "01/05/2024",
      endDate: "02/05/2024",
      debitAmount: 10000,
      creditAmount: null,
      balance: 40000,
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Partner",
    },
    {
      sn: 3,
      billItem: "Rent",
      code: "RT01",
      description: "Monthly rent payment for office space",
      billDuration: "01/05/2024 to 02/05/2024",
      startDate: "01/05/2024",
      endDate: "02/05/2024",
      debitAmount: null,
      creditAmount: 50000,
      balance: 90000,
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Self",
    },
    {
      sn: 4,
      billItem: "Car",
      code: "CT02",
      description: "Vehicle maintenance and fuel costs",
      billDuration: "01/05/2024 to 02/05/2024",
      startDate: "01/05/2024",
      endDate: "02/05/2024",
      debitAmount: 15000,
      creditAmount: null,
      balance: 75000,
      transactionDate: "Tuesday, 2nd of May, 2024 02:30 PM (WAT)",
      modeOfPayment: "Partner",
    },
    {
      sn: 5,
      billItem: "Car",
      code: "CT02",
      description: "Vehicle maintenance and fuel costs",
      billDuration: "01/05/2024 to 02/05/2024",
      startDate: "01/05/2024",
      endDate: "02/05/2024",
      debitAmount: 20000,
      creditAmount: null,
      balance: 55000,
      transactionDate: "Wednesday, 3rd of May, 2024 11:15 AM (WAT)",
      modeOfPayment: "Partner",
    },
  ]

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return `NGN ${amount.toLocaleString()}`
  }

  const handleExportPDF = () => {
    console.log("Exporting as PDF...")
  }

  const handleExportExcel = () => {
    console.log("Exporting as Excel...")
  }

  // Group items by bill type for subtotals
  const rentItems = statementData.filter(item => item.billItem === "Rent")
  const carItems = statementData.filter(item => item.billItem === "Car")
  
  const rentSubTotal = rentItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
  const carSubTotal = carItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
  const grandTotal = rentSubTotal + carSubTotal
  
  const totalCredit = statementData.reduce((sum, item) => sum + (item.creditAmount || 0), 0)
  const totalDebit = statementData.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
  const balance = totalCredit - totalDebit

  return (
    <div className="min-h-screen bg-white p-8 rounded">
      <div className="max-w-7xl mx-auto">
       
        {/* Header with Logo */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Details */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">FINKIA LIMITED</h1>
          <p className="text-gray-600 mb-1">1A, Hughes Avenue, Yaba, Lagos, Nigeria.</p>
          <p className="text-gray-600">Finkia@raoatech.com | +234 8097227051</p>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Customer Name:</span>
              <span className="text-gray-600">Olanrewaju Adeyanju Oluwagbemilekenibiapaeniyankoto</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Customer ID:</span>
              <span className="text-gray-600">CUST001</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Customer Group:</span>
              <span className="text-gray-600">Premium</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Organisation:</span>
              <span className="text-gray-600">Raoatech Technologies</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Address:</span>
              <span className="text-gray-600">6, Iyaode Road, Idiroko, Lagos State.</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Bill Code:</span>
              <span className="text-gray-600">BILL-2024-001</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Bill Duration:</span>
              <span className="text-gray-600">01/05/2024 - 02/06/2024</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Start Date:</span>
              <span className="text-gray-600">01/05/2024</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">End Date:</span>
              <span className="text-gray-600">02/06/2024</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Email Address:</span>
              <span className="text-gray-600">olarewaju08@gmail.com</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-800 w-32">Phone number:</span>
              <span className="text-gray-600">+2346790239, +234806453209</span>
            </div>
          </div>
        </div>

        {/* Date Range and Export Controls */}
        <div className="mb-6 border border-gray-300 rounded-lg">
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="start-date" className="text-gray-700 text-sm">
                    Select range from
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <span className="text-gray-700">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 rounded px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 rounded px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statement Title */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Current Bill</h2>

        {/* Statement Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">S/N</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Bill Item</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Code</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Description</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Bill Duration</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Start Date</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">End Date</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Debit Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Credit Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Balance</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Transaction Date</th>
                  <th className="text-gray-800 font-semibold text-left px-3 py-3 whitespace-nowrap">Mode of Payment</th>
                </tr>
              </thead>
              <tbody>
                {/* Rent Items */}
                {rentItems.map((item) => (
                  <tr key={item.sn} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.sn}.</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billItem}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.code}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3">{item.description}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billDuration}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.startDate}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.endDate}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.debitAmount)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.creditAmount)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.balance)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.transactionDate}</td>
                    <td className="border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.modeOfPayment === "Self" ? "text-green-700 bg-green-100" : "text-orange-700 bg-orange-100"
                      }`}>
                        {item.modeOfPayment}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {/* Rent Sub-total row */}
                <tr className="bg-gray-100 border-b border-gray-300">
                  <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={7}>SUB-TOTAL (Rent)</td>
                  <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(rentSubTotal)}</td>
                  <td className="border-r border-gray-300 px-3 py-3" colSpan={4}></td>
                </tr>
                
                {/* Car Items */}
                {carItems.map((item) => (
                  <tr key={item.sn} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.sn}.</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billItem}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.code}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3">{item.description}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billDuration}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.startDate}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.endDate}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.debitAmount)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.creditAmount)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.balance)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.transactionDate}</td>
                    <td className="border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.modeOfPayment === "Self" ? "text-green-700 bg-green-100" : "text-orange-700 bg-orange-100"
                      }`}>
                        {item.modeOfPayment}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {/* Car Sub-total row */}
                <tr className="bg-gray-100 border-b border-gray-300">
                  <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={7}>SUB-TOTAL (Car)</td>
                  <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(carSubTotal)}</td>
                  <td className="border-r border-gray-300 px-3 py-3" colSpan={4}></td>
                </tr>
                
                {/* Grand total row */}
                <tr className="bg-gray-200 border-b border-gray-300">
                  <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={7}>GRAND TOTAL</td>
                  <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(grandTotal)}</td>
                  <td className="border-r border-gray-300 px-3 py-3" colSpan={4}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <p className="text-lg"><span className="font-semibold">Total Credit:</span> <span className="text-gray-600">{formatCurrency(totalCredit)}</span></p>
          </div>
          <div className="text-right">
            <p className="text-lg"><span className="font-semibold">Total Debit:</span> <span className="text-gray-600">{formatCurrency(totalDebit)}</span></p>
            <p className="text-xl font-bold mt-2"><span className="font-semibold">Balance:</span> <span className="text-gray-600">{formatCurrency(balance)}</span></p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Powered by Raoatech (www.raoatech.com)</p>
        </div>
      </div>
    </div>
  )
}

export default CurrentBill
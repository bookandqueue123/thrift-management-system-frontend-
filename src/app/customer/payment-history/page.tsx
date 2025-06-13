
// "use client"

// import { useState } from "react"
// import { Download, FileSpreadsheet } from "lucide-react"
// import Image from "next/image";

// interface StatementItem {
//   sn: number
//   itemPurpose: string
//   uniqueCode: string
//   debitAmount: number | null
//   paymentStart: string
//   paymentEnd: string
//   creditAmount: number | null
//   subTotal: number | null
//   balance: number | null
//   duration: string
//   transactionDate: string
//   modeOfPayment: "Self" | "Partner"
// }

// const PaymentHistory = () => {
//   const [startDate, setStartDate] = useState("2024-05-01")
//   const [endDate, setEndDate] = useState("2024-06-14")

//   // Sample data matching the Figma design
//   const statementData: StatementItem[] = [
//     {
//       sn: 1,
//       itemPurpose: "Rent",
//       uniqueCode: "RT01",
//       debitAmount: null,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: 50000,
//       subTotal: 250000,
//       balance: null,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Self",
//     },
//     {
//       sn: 2,
//       itemPurpose: "Rent",
//       uniqueCode: "RT01",
//       debitAmount: 10000,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: null,
//       subTotal: null,
//       balance: 40000,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Partner",
//     },
//     {
//       sn: 3,
//       itemPurpose: "Rent",
//       uniqueCode: "RT01",
//       debitAmount: null,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: 50000,
//       subTotal: 50000,
//       balance: null,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Self",
//     },
//     {
//       sn: 4,
//       itemPurpose: "Rent",
//       uniqueCode: "RT01",
//       debitAmount: null,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: 50000,
//       subTotal: 50000,
//       balance: 50000,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Self",
//     },
//     {
//       sn: 5,
//       itemPurpose: "Rent",
//       uniqueCode: "RT01",
//       debitAmount: null,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: 50000,
//       subTotal: 50000,
//       balance: 50000,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Self",
//     },
//     {
//       sn: 6,
//       itemPurpose: "Rent",
//       uniqueCode: "RT01",
//       debitAmount: 1000,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: null,
//       subTotal: null,
//       balance: 24000,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Partner",
//     },
//     {
//       sn: 7,
//       itemPurpose: "Car",
//       uniqueCode: "CT02",
//       debitAmount: 1000,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: null,
//       subTotal: null,
//       balance: 24000,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Partner",
//     },
//     {
//       sn: 8,
//       itemPurpose: "Car",
//       uniqueCode: "CT02",
//       debitAmount: 1000,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: null,
//       subTotal: null,
//       balance: 24000,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Partner",
//     },
//     {
//       sn: 9,
//       itemPurpose: "Car",
//       uniqueCode: "CT02",
//       debitAmount: 1000,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: null,
//       subTotal: null,
//       balance: 24000,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Partner",
//     },
//     {
//       sn: 10,
//       itemPurpose: "Car",
//       uniqueCode: "CT02",
//       debitAmount: 1000,
//       paymentStart: "01/05/2024",
//       paymentEnd: "01/12/2024",
//       creditAmount: null,
//       subTotal: null,
//       balance: 24000,
//       duration: "01/05/2024 to 02/05/2024",
//       transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
//       modeOfPayment: "Partner",
//     },
//   ]

//   const formatCurrency = (amount: number | null) => {
//     if (amount === null) return "-"
//     return `NGN ${amount.toLocaleString()}`
//   }

//   const handleExportPDF = () => {
//     console.log("Exporting as PDF...")
//   }

//   const handleExportExcel = () => {
//     console.log("Exporting as Excel...")
//   }

//   const generateReportTimestamp = () => {
//     const now = new Date()
//     const day = now.getDate()
//     const month = now.toLocaleString('default', { month: 'long' })
//     const year = now.getFullYear()
//     const time = now.toLocaleString('en-US', { 
//       hour: 'numeric', 
//       minute: '2-digit', 
//       hour12: true 
//     })
    
//     const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
//                    day === 2 || day === 22 ? 'nd' :
//                    day === 3 || day === 23 ? 'rd' : 'th'
    
//     return `${day}${suffix} of ${month}, ${year} at ${time}`
//   }

//   const rentItems = statementData.filter(item => item.itemPurpose === "Rent")
//   const carItems = statementData.filter(item => item.itemPurpose === "Car")
  
//   const rentSubTotal = rentItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
//   const grandTotal = statementData.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
  
//   const totalCredit = 0
//   const totalDebit = grandTotal
//   const balance = totalCredit - totalDebit

//   return (
//     <div className="min-h-screen bg-white p-8 rounded">
//       <div className="max-w-7xl mx-auto">
       
//         <div className="flex justify-between items-start mb-8">
//           <div className="flex items-center gap-4">
            
//             <div className="flex items-center gap-2">

//                 <div className="">
                  
//                   <Image src="/Logo.svg" width={100} height={100} alt="logo" />
//                 </div>
              
           
//             </div>
//           </div>
//           <div className="text-right text-gray-600 text-sm">
//             Statement generated on the 10th June, 2024 at 03:00 PM
//           </div>
//         </div>

      
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">FINKIA LIMITED</h1>
//           <p className="text-gray-600 mb-1">1A, Hughes Avenue, Yaba, Lagos, Nigeria.</p>
//           <p className="text-gray-600">Finkia@raoatech.com | +234 8097227051</p>
//         </div>

//         {/* Customer Information */}
//         <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
//           <div className="space-y-2">
//             <div className="flex">
//               <span className="font-semibold text-gray-800 w-32">Customer Name:</span>
//               <span className="text-gray-600">Olanrewaju Adeyanju Oluwagbemilekenibiapaeniyankoto</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold text-gray-800 w-32">Organisation:</span>
//               <span className="text-gray-600">Raoatech Technologies</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold text-gray-800 w-32">Address:</span>
//               <span className="text-gray-600">6, Iyaode Road, Idiroko, Lagos State.</span>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <div className="flex">
//               <span className="font-semibold text-gray-800 w-32">Duration:</span>
//               <span className="text-gray-600">01/05/2024 - 02/06/2024</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold text-gray-800 w-32">Email Address:</span>
//               <span className="text-gray-600">olarewaju08@gmail.com</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold text-gray-800 w-32">Phone number:</span>
//               <span className="text-gray-600">+2346790239, +234806453209</span>
//             </div>
//           </div>
//         </div>

//         {/* Date Range and Export Controls */}
//         <div className="mb-6 border border-gray-300 rounded-lg">
//           <div className="p-4">
//             <div className="flex flex-wrap items-center gap-4 justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <label htmlFor="start-date" className="text-gray-700 text-sm">
//                     Select range from
//                   </label>
//                   <input
//                     id="start-date"
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
//                 <span className="text-gray-700">to</span>
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={handleExportPDF}
//                   className="border border-gray-300 hover:bg-gray-50 text-gray-700 rounded px-4 py-2 text-sm flex items-center gap-2 transition-colors"
//                 >
//                   <Download className="w-4 h-4" />
//                   Export as PDF
//                 </button>
//                 <button
//                   onClick={handleExportExcel}
//                   className="border border-gray-300 hover:bg-gray-50 text-gray-700 rounded px-4 py-2 text-sm flex items-center gap-2 transition-colors"
//                 >
//                   <FileSpreadsheet className="w-4 h-4" />
//                   Export as Excel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Statement Title */}
//         <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Payment History</h2>

//         {/* Statement Table */}
//         <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-300">
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">S/N</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Item/Purpose</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Item/Purpose Unique Code</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Debit Amount</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Payment Start</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Payment End</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Credit Amount</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Sub Total</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Balance</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Duration</th>
//                   <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Transaction Date</th>
//                   <th className="text-gray-800 font-semibold text-left px-3 py-3 whitespace-nowrap">Mode of Payment</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rentItems.map((item) => (
//                   <tr key={item.sn} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.sn}.</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.itemPurpose}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.uniqueCode}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.debitAmount)}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.paymentStart}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.paymentEnd}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.creditAmount)}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.subTotal)}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.balance)}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.duration}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.transactionDate}</td>
//                     <td className="border-r border-gray-200 px-3 py-3 whitespace-nowrap">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         item.modeOfPayment === "Self" ? "text-green-700 bg-green-100" : "text-orange-700 bg-orange-100"
//                       }`}>
//                         {item.modeOfPayment}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 {/* Sub-total row */}
//                 <tr className="bg-gray-100 border-b border-gray-300">
//                   <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={3}>SUB- TOTAL</td>
//                   <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(rentSubTotal)}</td>
//                   <td className="border-r border-gray-300 px-3 py-3" colSpan={8}></td>
//                 </tr>
                
//                 {carItems.map((item) => (
//                   <tr key={item.sn} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.sn}.</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.itemPurpose}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.uniqueCode}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.debitAmount)}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.paymentStart}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.paymentEnd}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.creditAmount)}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.subTotal)}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.balance)}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.duration}</td>
//                     <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.transactionDate}</td>
//                     <td className="border-r border-gray-200 px-3 py-3 whitespace-nowrap">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         item.modeOfPayment === "Self" ? "text-green-700 bg-green-100" : "text-orange-700 bg-orange-100"
//                       }`}>
//                         {item.modeOfPayment}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
                
//                 {/* Grand total row */}
//                 <tr className="bg-gray-200 border-b border-gray-300">
//                   <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={3}>GRAND TOTAL</td>
//                   <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(grandTotal)}</td>
//                   <td className="border-r border-gray-300 px-3 py-3" colSpan={8}></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Summary Section */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="text-left">
//             <p className="text-lg"><span className="font-semibold">Total Credit</span> <span className="text-gray-600">NGN 000 0000</span></p>
//           </div>
//           <div className="text-right">
//             <p className="text-lg"><span className="font-semibold">Total Debit:</span> <span className="text-gray-600">NGN 000 0000</span></p>
//             <p className="text-xl font-bold mt-2"><span className="font-semibold">Balance:</span> <span className="text-gray-600">NGN 000 0000</span></p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center text-gray-500 text-sm">
//           <p>Powered by Raoatech (www.raoatech.com)</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PaymentHistory






"use client"

import React, { useState } from 'react';
import { Edit3, Save, X, Plus, Trash2, Calendar, User, Users, FileText, DollarSign, Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import { FilterDropdown } from '@/components/Buttons';
import Modal from '@/components/Modal';
import PaginationBar from '@/components/Pagination';
import { StatusIndicator } from '@/components/StatusIndicator';
import TransactionsTable from '@/components/Tables';
import Image from 'next/image';

// Dummy data for bills
const dummyBills = [
  {
    id: 1,
    name: 'Monthly Service Bill',
    code: 'BILL-2024-001',
    description: 'Monthly subscription services for premium customers',
    customerId: '2',
    customerGroupId: '1',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    items: [
      { id: 1, name: 'Premium Support Service', quantity: 1, price: 299.99, total: 299.99 },
      { id: 2, name: 'System Maintenance', quantity: 2, price: 149.50, total: 299.00 },
      { id: 3, name: 'Additional Feature License', quantity: 1, price: 99.99, total: 99.99 }
    ],
    grandTotal: 698.98,
    createdAt: '2023-12-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Quarterly Cloud Hosting',
    code: 'BILL-2024-002',
    description: 'Cloud hosting services for Q1 2024',
    customerId: '4',
    customerGroupId: '3',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    items: [
      { id: 1, name: 'Cloud Storage (100GB)', quantity: 1, price: 199.99, total: 199.99 },
      { id: 2, name: 'Database Hosting', quantity: 3, price: 89.99, total: 269.97 }
    ],
    grandTotal: 469.96,
    createdAt: '2023-12-20T14:45:00Z'
  },
  {
    id: 3,
    name: 'Annual Software License',
    code: 'BILL-2024-003',
    description: 'Annual license for enterprise software',
    customerId: '1',
    customerGroupId: '2',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    items: [
      { id: 1, name: 'Enterprise License', quantity: 1, price: 4999.99, total: 4999.99 },
      { id: 2, name: 'Premium Support Package', quantity: 1, price: 999.99, total: 999.99 }
    ],
    grandTotal: 5999.98,
    createdAt: '2023-12-10T09:15:00Z'
  }
];

const dummyCustomers = [
  { id: '1', name: 'John Ray' },
  { id: '2', name: 'Peter J' },
  { id: '3', name: 'Sarah Wilson' },
  { id: '4', name: 'Mike Johnson' }
];

const dummyCustomerGroups = [
  { id: '1', name: 'Premium Customers' },
  { id: '2', name: 'Regular Customers' },
  { id: '3', name: 'VIP Customers' }
];

const BillsTable = () => {
  const PAGE_SIZE = 2;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [searchResult, setSearchResult] = useState("");
  const [filteredBills, setFilteredBills] = useState(dummyBills);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<number>(0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.target.value);
    const filtered = dummyBills.filter(bill => 
      bill.name.toLowerCase().includes(e.target.value.toLowerCase()) || 
      bill.code.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBills(filtered);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    handleDateFilter();
  };

  const handleDateFilter = () => {
    if (fromDate && toDate) {
      const filtered = dummyBills.filter(bill => {
        const billDate = new Date(bill.createdAt);
        const startDateObj = new Date(fromDate);
        const endDateObj = new Date(toDate);
        return billDate >= startDateObj && billDate <= endDateObj;
      });
      setFilteredBills(filtered);
    }
  };

  const toggleDropdown = (val: number) => {
    setOpenDropdown(openDropdown === val ? 0 : val);
  };

  const handleViewBill = (bill: any) => {
    setSelectedBill(bill);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditBill = (bill: any) => {
    setSelectedBill(bill);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveBill = (updatedBill: any) => {
    setIsModalOpen(false);
  };

  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredBills.length / PAGE_SIZE);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getCustomerName = (customerId: string) => {
    const customer = dummyCustomers.find(c => c.id === customerId);
    return customer ? customer.name : 'N/A';
  };

  const getCustomerGroupName = (groupId: string) => {
    const group = dummyCustomerGroups.find(g => g.id === groupId);
    return group ? group.name : 'N/A';
  };

  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Bills
        </p>
      </div>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <FilterDropdown
              options={[
                "Bill Name",
                "Bill Code",
                "Customer",
                "Status",
              ]}
            />
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
              <input
                onChange={handleSearch}
                type="search"
                placeholder="Search"
                className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
              />
              <Search size={16} className="text-ajo_offWhite" />
            </form>
          </span>
          {/* Create button removed */}
        </div>

        <div className="my-8">
          <label
            htmlFor="fromDate"
            className="mb-2 text-sm font-semibold text-white"
          >
            Select range from:
          </label>
          <div className="justify-between space-y-2 md:flex">
            <div className="flex items-center">
              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
              />
              <label htmlFor="toDate" className="mx-2 text-white">
                to
              </label>
              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={handleToDateChange}
                className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
              />
            </div>
            {/* Export buttons removed */}
          </div>
        </div>

        <div>
          <TransactionsTable
            headers={[
              "User Name",
              "Code",
              "Customer",
              "Customer Group",
              "Start Date",
              "End Date",
              "Total Amount",
            
            ]}
            content={paginatedBills.map((bill, index) => (
              <tr key={bill.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {bill.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {bill.code}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {getCustomerName(bill.customerId)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {getCustomerGroupName(bill.customerGroupId)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {formatDate(bill.startDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {formatDate(bill.endDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  ${bill.grandTotal.toFixed(2)}
                </td>
                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {formatDate(bill.createdAt)}
                </td> */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator
                    label={`Actions`}
                    clickHandler={() => toggleDropdown(index + 1)}
                    dropdownEnabled
                    dropdownContents={{
                      labels: ["View Bill", "Edit Bill"],
                      actions: [
                        () => handleViewBill(bill),
                        () => handleEditBill(bill)
                      ],
                    }}
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    currentIndex={index + 1}
                  />
                </td>
              </tr>
            ))}
          />
          <div className="flex justify-center">
            <PaginationBar
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </section>

     
    </>
  );
};
export default BillsTable

"use client"

import { useState } from "react"
import { Download, FileSpreadsheet } from "lucide-react"
import Image from "next/image";

interface StatementItem {
  sn: number
  itemPurpose: string
  uniqueCode: string
  debitAmount: number | null
  paymentStart: string
  paymentEnd: string
  creditAmount: number | null
  subTotal: number | null
  balance: number | null
  duration: string
  transactionDate: string
  modeOfPayment: "Self" | "Partner"
}

const PaymentHistory = () => {
  const [startDate, setStartDate] = useState("2024-05-01")
  const [endDate, setEndDate] = useState("2024-06-14")

  // Sample data matching the Figma design
  const statementData: StatementItem[] = [
    {
      sn: 1,
      itemPurpose: "Rent",
      uniqueCode: "RT01",
      debitAmount: null,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: 50000,
      subTotal: 250000,
      balance: null,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Self",
    },
    {
      sn: 2,
      itemPurpose: "Rent",
      uniqueCode: "RT01",
      debitAmount: 10000,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: null,
      subTotal: null,
      balance: 40000,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Partner",
    },
    {
      sn: 3,
      itemPurpose: "Rent",
      uniqueCode: "RT01",
      debitAmount: null,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: 50000,
      subTotal: 50000,
      balance: null,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Self",
    },
    {
      sn: 4,
      itemPurpose: "Rent",
      uniqueCode: "RT01",
      debitAmount: null,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: 50000,
      subTotal: 50000,
      balance: 50000,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Self",
    },
    {
      sn: 5,
      itemPurpose: "Rent",
      uniqueCode: "RT01",
      debitAmount: null,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: 50000,
      subTotal: 50000,
      balance: 50000,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Self",
    },
    {
      sn: 6,
      itemPurpose: "Rent",
      uniqueCode: "RT01",
      debitAmount: 1000,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: null,
      subTotal: null,
      balance: 24000,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Partner",
    },
    {
      sn: 7,
      itemPurpose: "Car",
      uniqueCode: "CT02",
      debitAmount: 1000,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: null,
      subTotal: null,
      balance: 24000,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Partner",
    },
    {
      sn: 8,
      itemPurpose: "Car",
      uniqueCode: "CT02",
      debitAmount: 1000,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: null,
      subTotal: null,
      balance: 24000,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Partner",
    },
    {
      sn: 9,
      itemPurpose: "Car",
      uniqueCode: "CT02",
      debitAmount: 1000,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: null,
      subTotal: null,
      balance: 24000,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
      modeOfPayment: "Partner",
    },
    {
      sn: 10,
      itemPurpose: "Car",
      uniqueCode: "CT02",
      debitAmount: 1000,
      paymentStart: "01/05/2024",
      paymentEnd: "01/12/2024",
      creditAmount: null,
      subTotal: null,
      balance: 24000,
      duration: "01/05/2024 to 02/05/2024",
      transactionDate: "Monday, 1st of May, 2024 10:09 AM (WAT)",
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

  const generateReportTimestamp = () => {
    const now = new Date()
    const day = now.getDate()
    const month = now.toLocaleString('default', { month: 'long' })
    const year = now.getFullYear()
    const time = now.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
    
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th'
    
    return `${day}${suffix} of ${month}, ${year} at ${time}`
  }

  const rentItems = statementData.filter(item => item.itemPurpose === "Rent")
  const carItems = statementData.filter(item => item.itemPurpose === "Car")
  
  const rentSubTotal = rentItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
  const grandTotal = statementData.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
  
  const totalCredit = 0
  const totalDebit = grandTotal
  const balance = totalCredit - totalDebit

  return (
    <div className="min-h-screen bg-white p-8 rounded">
      <div className="max-w-7xl mx-auto">
       
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2">

                <div className="">
                  
                  <Image src="/Logo.svg" width={100} height={100} alt="logo" />
                </div>
              
           
            </div>
          </div>
          <div className="text-right text-gray-600 text-sm">
            Statement generated on the 10th June, 2024 at 03:00 PM
          </div>
        </div>

      
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
              <span className="font-semibold text-gray-800 w-32">Duration:</span>
              <span className="text-gray-600">01/05/2024 - 02/06/2024</span>
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
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Payment History</h2>

        {/* Statement Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">S/N</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Item/Purpose</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Item/Purpose Unique Code</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Debit Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Payment Start</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Payment End</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Credit Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Sub Total</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Balance</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Duration</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Transaction Date</th>
                  <th className="text-gray-800 font-semibold text-left px-3 py-3 whitespace-nowrap">Mode of Payment</th>
                </tr>
              </thead>
              <tbody>
                {rentItems.map((item) => (
                  <tr key={item.sn} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.sn}.</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.itemPurpose}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.uniqueCode}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.debitAmount)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.paymentStart}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.paymentEnd}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.creditAmount)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.subTotal)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.balance)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.duration}</td>
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
                {/* Sub-total row */}
                <tr className="bg-gray-100 border-b border-gray-300">
                  <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={3}>SUB- TOTAL</td>
                  <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(rentSubTotal)}</td>
                  <td className="border-r border-gray-300 px-3 py-3" colSpan={8}></td>
                </tr>
                
                {carItems.map((item) => (
                  <tr key={item.sn} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.sn}.</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.itemPurpose}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.uniqueCode}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.debitAmount)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.paymentStart}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.paymentEnd}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.creditAmount)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.subTotal)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.balance)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.duration}</td>
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
                
                {/* Grand total row */}
                <tr className="bg-gray-200 border-b border-gray-300">
                  <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={3}>GRAND TOTAL</td>
                  <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(grandTotal)}</td>
                  <td className="border-r border-gray-300 px-3 py-3" colSpan={8}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <p className="text-lg"><span className="font-semibold">Total Credit</span> <span className="text-gray-600">NGN 000 0000</span></p>
          </div>
          <div className="text-right">
            <p className="text-lg"><span className="font-semibold">Total Debit:</span> <span className="text-gray-600">NGN 000 0000</span></p>
            <p className="text-xl font-bold mt-2"><span className="font-semibold">Balance:</span> <span className="text-gray-600">NGN 000 0000</span></p>
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

export default PaymentHistory
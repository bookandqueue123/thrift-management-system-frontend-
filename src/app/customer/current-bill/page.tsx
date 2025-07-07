"use client"

import React, { useState, useEffect } from "react"
import { useQuery } from '@tanstack/react-query'
import { Download, FileSpreadsheet } from "lucide-react"
import { useAuth } from '@/api/hooks/useAuth'

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

const COMPANY_NAME = "FINKIA LIMITED";
const COMPANY_ADDRESS = "1A, Hughes Avenue, Yaba, Lagos, Nigeria.";
const COMPANY_CONTACT = "Finkia@raoatech.com | +234 8097227051";

const CurrentBill = () => {
  const { client } = useAuth()
  const [selectedPayments, setSelectedPayments] = useState<Record<string, number>>({})
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [viewType, setViewType] = useState<'current' | 'all'>('current')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-bills'],
    queryFn: async () => {
      const res = await client.get('/api/bills/customer/all')
      return res.data
    },
    enabled: !!client,
  })

  // Helper to get category name (if needed)
  const { data: categoriesData } = useQuery({
    queryKey: ['bill-categories'],
    queryFn: async () => {
      const res = await client.get('/api/bill-categories')
      return res.data.data
    },
    enabled: !!client,
  })
  const getCategoryName = (cat: string) => {
    if (/^[a-f0-9]{24}$/i.test(cat) && categoriesData) {
      const found = categoriesData.find((c: any) => c._id === cat || c.id === cat)
      return found ? found.name : cat
    }
    return cat
  }

  // Helper: group items by category
  const groupByCategory = (items: TableBillItem[]) => {
    const groups: Record<string, TableBillItem[]> = {}
    items.forEach(item => {
      const cat = getCategoryName(item.category)
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }

  // Find the current bill (latest by startDate)
  const allBills: BillApi[] = data?.data || []
  const sortedBills = [...allBills].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  const currentBill = sortedBills[0]
  const previousBills = sortedBills.slice(1)

  // Split items
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
  }))
  const previousDebtItems: TableBillItem[] = previousBills.flatMap((bill) =>
    bill.billItems
      .filter(item => (item.amount - (item.totalPaidForItem || 0)) > 0)
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
      }))
  )

  // Fix: payableItems must be declared before handleMakePayment
  const payableItems = viewType === 'all' ? [...previousDebtItems, ...currentBillItems] : currentBillItems

  // Helper: calculate totals
  const calcTotals = (items: TableBillItem[]) => {
    const totalDebit = items.reduce((sum, item) => sum + (item.amount || 0), 0)
    const totalCredit = items.reduce((sum, item) => sum + (item.totalPaidForItem || 0), 0)
    const grandTotal = totalDebit - totalCredit
    return { totalDebit, totalCredit, grandTotal }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return `NGN ${amount.toLocaleString()}`
  }

  const handlePaymentInput = (billItemId: string, value: string) => {
    const num = Number(value)
    setSelectedPayments((prev) => ({ ...prev, [billItemId]: isNaN(num) ? 0 : num }))
  }

  const handleMakePayment = async () => {
    setPaying(true)
    setPayError(null)
    // Group selected payments by billId
    const paymentsByBill: Record<string, { billId: string; billItems: { billItemId: string; amountToPay: number }[] }> = {}
    payableItems.forEach((item: TableBillItem) => {
      const amount = selectedPayments[item._id]
      if (amount && amount > 0) {
        if (!paymentsByBill[item.billId]) paymentsByBill[item.billId] = { billId: item.billId, billItems: [] }
        paymentsByBill[item.billId].billItems.push({ billItemId: item._id, amountToPay: amount })
      }
    })
    if (Object.keys(paymentsByBill).length === 0) {
      setPayError("Please enter an amount to pay for at least one item.")
      setPaying(false)
      return
    }
    try {
      // For each bill, make a payment request
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
      setPayError(e.message || "Payment failed")
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8 rounded">
      {/* Centered company info header */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="text-3xl font-bold text-gray-800 mb-2">{COMPANY_NAME}</div>
        <div className="text-gray-600 mb-1">{COMPANY_ADDRESS}</div>
        <div className="text-gray-600">{COMPANY_CONTACT}</div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Toggle buttons */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded font-semibold ${viewType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewType('all')}
          >
            Current bill and outstanding debts
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold ${viewType === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewType('current')}
          >
            Current bill only
          </button>
        </div>
        {/* Error/Loading */}
        {isLoading && <div className="text-center text-gray-500">Loading bills...</div>}
        {error && <div className="text-center text-red-500">{(error as any)?.message || 'Error loading bills'}</div>}
        {payError && <div className="text-center text-red-500 mb-2">{payError}</div>}
        {/* Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">S/N</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Bill Item</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Category</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Bill Code</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Description</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Bill Duration</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Start Date</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">End Date</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Debit Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Credit Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Paid Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Balance</th>
                </tr>
              </thead>
              <tbody>
                {/* Render for 'Current bill and outstanding debts' */}
                {viewType === 'all' && (
                  <>
                    {/* Previous Debts Section */}
                    {previousDebtItems.length > 0 && (
                      <>
                        <tr><td colSpan={12} className="text-lg  text-blue-500 w-[40%] font-bold px-3 py-2">Previous Debts</td></tr>
                        {Object.entries(groupByCategory(previousDebtItems)).map(([cat, items], i) => (
                          <React.Fragment key={cat}>
                            <tr><td colSpan={12} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
                            {items.map((item, idx) => (
                              <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{idx + 1}.</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billName}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{cat}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billCode}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3">{item.billName}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billDuration}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.startDate}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.endDate}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount)}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                                  {item.amount - (item.totalPaidForItem || 0) > 0
                                    ? <input
                                        type="number"
                                        placeholder="Amount"
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={selectedPayments[item._id] || ""}
                                        onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                      />
                                    : formatCurrency(item.totalPaidForItem || 0)
                                  }
                                </td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem || 0)}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount - (item.totalPaidForItem || 0))}</td>
                              </tr>
                            ))}
                            {/* Category sub-total */}
                            <tr className="text-gray-500">
                              <td colSpan={8} className="font-bold text-right px-3 py-2">Sub-total for {cat}</td>
                              <td className="font-bold">{formatCurrency(calcTotals(items).totalDebit)}</td>
                              <td className="font-bold">{formatCurrency(calcTotals(items).totalCredit)}</td>
                              <td className="font-bold">{formatCurrency(calcTotals(items).grandTotal)}</td>
                              <td></td>
                            </tr>
                          </React.Fragment>
                        ))}
                        {/* Section grand total */}
                        <tr className="text-gray-500">
                          <td colSpan={8} className="font-bold text-right px-3 py-2">Grand Total (Previous Debts)</td>
                          <td className="font-bold">{formatCurrency(calcTotals(previousDebtItems).totalDebit)}</td>
                          <td className="font-bold">{formatCurrency(calcTotals(previousDebtItems).totalCredit)}</td>
                          <td className="font-bold">{formatCurrency(calcTotals(previousDebtItems).grandTotal)}</td>
                          <td></td>
                        </tr>
                      </>
                    )}
                    {/* Current Bill Section */}
                    {currentBillItems.length > 0 && (
                      <>
                        <tr><td colSpan={12} className=" text-blue-500 text-lg font-bold px-3 py-2">Current Bill</td></tr>
                        {Object.entries(groupByCategory(currentBillItems)).map(([cat, items], i) => (
                          <React.Fragment key={cat}>
                            <tr><td colSpan={12} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
                            {items.map((item, idx) => (
                              <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{idx + 1}.</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billName}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{cat}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billCode}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3">{item.billName}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billDuration}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.startDate}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.endDate}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount)}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                                  {item.amount - (item.totalPaidForItem || 0) > 0
                                    ? <input
                                        type="number"
                                        placeholder="Amount"
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={selectedPayments[item._id] || ""}
                                        onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                      />
                                    : formatCurrency(item.totalPaidForItem || 0)
                                  }
                                </td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem || 0)}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount - (item.totalPaidForItem || 0))}</td>
                              </tr>
                            ))}
                            {/* Category sub-total */}
                            <tr className="text-gray-500">
                              <td colSpan={8} className="font-bold text-right px-3 py-2">Sub-total for {cat}</td>
                              <td className="font-bold">{formatCurrency(calcTotals(items).totalDebit)}</td>
                              <td className="font-bold">{formatCurrency(calcTotals(items).totalCredit)}</td>
                              <td className="font-bold">{formatCurrency(calcTotals(items).grandTotal)}</td>
                              <td></td>
                            </tr>
                          </React.Fragment>
                        ))}
                        {/* Section grand total */}
                        <tr className="text-gray-500">
                          <td colSpan={8} className="font-bold text-right px-3 py-2">Grand Total (Current Bill)</td>
                          <td className="font-bold">{formatCurrency(calcTotals(currentBillItems).totalDebit)}</td>
                          <td className="font-bold">{formatCurrency(calcTotals(currentBillItems).totalCredit)}</td>
                          <td className="font-bold">{formatCurrency(calcTotals(currentBillItems).grandTotal)}</td>
                          <td></td>
                        </tr>
                      </>
                    )}
                    {/* Overall grand total */}
                    <tr className="text-gray-500">
                      <td colSpan={8} className="font-bold text-right px-3 py-2">Overall Grand Total</td>
                      <td className="font-bold">{formatCurrency(calcTotals([...previousDebtItems, ...currentBillItems]).totalDebit)}</td>
                      <td className="font-bold">{formatCurrency(calcTotals([...previousDebtItems, ...currentBillItems]).totalCredit)}</td>
                      <td className="font-bold">{formatCurrency(calcTotals([...previousDebtItems, ...currentBillItems]).grandTotal)}</td>
                      <td></td>
                    </tr>
                  </>
                )}
                {/* Render for 'Current bill only' (existing logic) */}
                {viewType === 'current' && (
                  <>
                    {Object.entries(groupByCategory(currentBillItems)).map(([cat, items], i) => (
                      <React.Fragment key={cat}>
                        <tr><td colSpan={12} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
                        {items.map((item, idx) => (
                          <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{idx + 1}.</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billName}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{cat}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billCode}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3">{item.billName}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billDuration}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.startDate}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.endDate}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount)}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                              {item.amount - (item.totalPaidForItem || 0) > 0
                                ? <input
                                    type="number"
                                    placeholder="Amount"
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                    value={selectedPayments[item._id] || ""}
                                    onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                  />
                                : formatCurrency(item.totalPaidForItem || 0)
                              }
                            </td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem || 0)}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount - (item.totalPaidForItem || 0))}</td>
                          </tr>
                        ))}
                        {/* Category sub-total */}
                        <tr className="text-gray-500">
                          <td colSpan={8} className="font-bold text-right px-3 py-2">Sub-total for {cat}</td>
                          <td className="font-bold">{formatCurrency(calcTotals(items).totalDebit)}</td>
                          <td className="font-bold">{formatCurrency(calcTotals(items).totalCredit)}</td>
                          <td className="font-bold">{formatCurrency(calcTotals(items).grandTotal)}</td>
                          <td></td>
                        </tr>
                      </React.Fragment>
                    ))}
                    {/* Section grand total */}
                    <tr className="text-gray-500">
                      <td colSpan={8} className="font-bold text-right px-3 py-2">Grand Total (Current Bill)</td>
                      <td className="font-bold">{formatCurrency(calcTotals(currentBillItems).totalDebit)}</td>
                      <td className="font-bold">{formatCurrency(calcTotals(currentBillItems).totalCredit)}</td>
                      <td className="font-bold">{formatCurrency(calcTotals(currentBillItems).grandTotal)}</td>
                      <td></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Single payment button below table */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleMakePayment}
            disabled={paying}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {paying ? "Processing..." : "Make Payment"}
          </button>
        </div>
        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Powered by Raoatech (www.raoatech.com)</p>
        </div>
      </div>
    </div>
  )
}

export default CurrentBill


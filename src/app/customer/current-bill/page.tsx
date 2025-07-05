"use client"

import { useState } from "react"
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

const CurrentBill = () => {
  const { client } = useAuth()
  const [selectedPayments, setSelectedPayments] = useState<Record<string, number>>({})
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [payingItemId, setPayingItemId] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-bills'],
    queryFn: async () => {
      const res = await client.get('/api/bills/customer/all')
      return res.data
    },
    enabled: !!client,
  })

  // Flatten all bill items from all bills, add bill-level info to each item
  const allBillItems: TableBillItem[] = (data?.data || []).flatMap((bill: BillApi) =>
    bill.billItems.map((item, idx) => ({
      ...item,
      sn: idx + 1,
      billId: bill._id,
      billCode: bill.billCode,
      billDuration: `${bill.startDate?.slice(0, 10)} to ${bill.endDate?.slice(0, 10)}`,
      startDate: bill.startDate?.slice(0, 10),
      endDate: bill.endDate?.slice(0, 10),
      transactionDate: item.updatedAt,
      modeOfPayment: item.paymentStatus === 'paid' ? 'Self' : 'Partner', // Placeholder, adjust as needed
    }))
  )

  // Group by category
  const groupedItems: Record<string, TableBillItem[]> = allBillItems.reduce(
    (acc: Record<string, TableBillItem[]>, item: TableBillItem) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {}
  )

  // Subtotals and totals
  const categorySubtotals: Record<string, number> = Object.fromEntries(
    Object.entries(groupedItems).map(([cat, items]: [string, TableBillItem[]]) => [cat, items.reduce((sum: number, item: TableBillItem) => sum + (item.amount || 0), 0)])
  )
  const grandTotal: number = Object.values(categorySubtotals).reduce((sum: number, item: number) => sum + item, 0)
  const totalPaid: number = allBillItems.reduce((sum: number, item: TableBillItem) => sum + (item.totalPaidForItem || 0), 0)
  const totalBalance: number = grandTotal - totalPaid

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

  const handlePaymentInput = (billItemId: string, value: string) => {
    const num = Number(value)
    setSelectedPayments((prev) => ({ ...prev, [billItemId]: isNaN(num) ? 0 : num }))
  }

  const handleMakePayment = async () => {
    setPaying(true)
    setPayError(null)
    // Group selected payments by billId
    const paymentsByBill: Record<string, { billId: string; billItems: { billItemId: string; amountToPay: number }[] }> = {}
    allBillItems.forEach((item: TableBillItem) => {
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

  const handleMakePaymentSingle = async (item: TableBillItem) => {
    const amount = selectedPayments[item._id];
    setPayError(null);
    if (!amount || amount <= 0) {
      setPayError("Please enter an amount to pay for this item.");
      return;
    }
    setPayingItemId(item._id);
    try {
      const res = await client.post('/api/payments/bills', {
        billId: item.billId,
        billItems: [{ billItemId: item._id, amountToPay: amount }],
        paymentMethod: "card",
        notes: "Partial payment",
      });
      const link = res?.data?.data?.data?.link;
      if (link) {
        window.location.href = link;
        return;
      }
      refetch();
    } catch (e: any) {
      setPayError(e.message || "Payment failed");
    } finally {
      setPayingItemId(null);
    }
  };

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

        {/* Error/Loading */}
        {isLoading && <div className="text-center text-gray-500">Loading bills...</div>}
        {error && <div className="text-center text-red-500">{(error as any)?.message || 'Error loading bills'}</div>}
        {payError && <div className="text-center text-red-500 mb-2">{payError}</div>}

        {/* Statement Table */}
        {!isLoading && !error && allBillItems.length > 0 && (
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
                    <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Paid</th>
                    <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Balance</th>
                    <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Transaction Date</th>
                    <th className="text-gray-800 font-semibold text-left px-3 py-3 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedItems).map(([category, items]: [string, TableBillItem[]]) => (
                    <>
                      {/* Category header row */}
                      <tr className="bg-blue-50 border-b border-blue-200">
                        <td colSpan={14} className="font-bold text-blue-900 px-3 py-2 text-left">{category}</td>
                      </tr>
                      {/* Items for this category */}
                      {items.map((item: TableBillItem, idx: number) => (
                        <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{idx + 1}.</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billName}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.category}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billCode}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3">{item.billName}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.billDuration}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.startDate}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.endDate}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount)}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              min={1}
                              max={item.amount - item.totalPaidForItem}
                              value={selectedPayments[item._id] || ""}
                              onChange={e => handlePaymentInput(item._id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 w-24 text-sm"
                              placeholder="Amount"
                              disabled={item.paymentStatus === "paid"}
                            />
                          </td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem)}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount - item.totalPaidForItem)}</td>
                          <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{item.transactionDate?.slice(0, 10)}</td>
                          <td className="border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${item.paymentStatus === "paid" ? "text-green-700 bg-green-100" : item.paymentStatus === "partial" ? "text-orange-700 bg-orange-100" : "text-gray-700 bg-gray-100"}`}>{item.paymentStatus}</span>
                          </td>
                        </tr>
                      ))}
                      {/* Sub-total row for this category */}
                      <tr className="bg-gray-100 border-b border-gray-300">
                        <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={9}>SUB-TOTAL ({category})</td>
                        <td className="font-semibold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(categorySubtotals[category])}</td>
                        <td className="border-r border-gray-300 px-3 py-3" colSpan={4}></td>
                      </tr>
                    </>
                  ))}
                  {/* Grand total row */}
                  <tr className="bg-gray-200 border-b border-gray-300">
                    <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={9}>GRAND TOTAL</td>
                    <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3">{formatCurrency(grandTotal)}</td>
                    <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={2}>Total Paid: {formatCurrency(totalPaid)}</td>
                    <td className="font-bold text-gray-800 border-r border-gray-300 px-3 py-3" colSpan={2}>Balance: {formatCurrency(totalBalance)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Single Make Payment Button below the table */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleMakePayment}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg shadow"
                disabled={paying}
              >
                {paying ? "Processing..." : "Make Payment"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Powered by Raoatech (www.raoatech.com)</p>
        </div>
      </div>
    </div>
  )
}

export default CurrentBill


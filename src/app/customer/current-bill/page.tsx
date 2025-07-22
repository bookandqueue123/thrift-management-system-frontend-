


"use client"

import React, { useState, useEffect } from "react"
import { useQuery } from '@tanstack/react-query'
import { Download, FileSpreadsheet } from "lucide-react"
import { useAuth } from '@/api/hooks/useAuth'
import Image from "next/image";

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
  promoPercentage?: number;
  promoCode?: {
    code: string;
    promoPercentage: number;
    [key: string]: any;
  };
}

// Modal component for error display
const ErrorModal = ({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="text-lg font-semibold text-red-600 mb-2">Promo Code Error</div>
        <div className="text-gray-800 mb-4">{message}</div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const CurrentBill = () => {
  const { client } = useAuth()
  const [selectedPayments, setSelectedPayments] = useState<Record<string, number>>({})
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [viewType, setViewType] = useState<'current' | 'all'>('current')
  const [promoCodes, setPromoCodes] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  // Add state for custom payment error
  const [customPayError, setCustomPayError] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-bills'],
    queryFn: async () => {
      const res = await client.get('/api/bills/customer/all')
      return res.data
    },
    enabled: !!client,
  })

  
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

  // Find the current bill - using createdAt instead of startDate for more accurate sorting
  const allBills: BillApi[] = data?.data || []
  const sortedBills = [...allBills].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

  // Helper: calculate total subtotal for a category (user input + mandatory amounts)
  const calcTotalSubtotal = (items: TableBillItem[]) => {
    return items.reduce((sum, item) => {
      // If mandatory, use the full outstanding amount; else use selectedPayments or 0
      if (item.isMandatory) {
        return sum + (item.amount - (item.totalPaidForItem || 0));
      } else {
        return sum + (Number(selectedPayments[item._id]) || 0);
      }
    }, 0);
  };

  // Helper: calculate total of all inputted amounts
  const calcTotalInput = () => {
    // Only sum for items that are currently payable (payableItems)
    return payableItems.reduce((sum, item) => {
      if (item.isMandatory) {
        return sum + (item.amount - (item.totalPaidForItem || 0));
      } else {
        return sum + (Number(selectedPayments[item._id]) || 0);
      }
    }, 0);
  };

  // Helper: calculate grand total as sum of category subtotals
  const calcGrandTotalFromSubtotals = (items: TableBillItem[]) => {
    const grouped = groupByCategory(items)
    return Object.values(grouped).reduce((total, categoryItems) => {
      return total + calcTotalSubtotal(categoryItems)
    }, 0)
  }

  // Grand Sub Total Debit: sum of all item.amount in the current view
  const calcGrandSubTotalDebit = (items: TableBillItem[]) => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  // Grand Sub Total Credit: sum of all item.totalPaidForItem + user input for non-mandatory items
  const calcGrandSubTotalCredit = (items: TableBillItem[]) => {
    return items.reduce((sum, item) => {
      if (item.isMandatory) {
        return sum + (item.totalPaidForItem || 0);
      } else {
        // Add both paid and currently inputted value
        return sum + (item.totalPaidForItem || 0) + (Number(selectedPayments[item._id]) || 0);
      }
    }, 0);
  };

  // Helper: calculate overall grand total credit (sum of paid + user input for all items in the view)
  const calcOverallGrandTotalCredit = (items: TableBillItem[]) => {
    return items.reduce((sum, item) => {
      if (item.isMandatory) {
        return sum + (item.totalPaidForItem || 0);
      } else {
        // Add both paid and currently inputted value
        return sum + (item.totalPaidForItem || 0) + (Number(selectedPayments[item._id]) || 0);
      }
    }, 0);
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return `NGN ${amount.toLocaleString()}`
  }

  const handlePaymentInput = (billItemId: string, value: string) => {
    const num = Number(value)
    setSelectedPayments((prev) => ({ ...prev, [billItemId]: isNaN(num) ? 0 : num }))
  }

  const handlePromoCodeInput = (billItemId: string, value: string) => {
    setPromoCodes((prev) => ({ ...prev, [billItemId]: value }));
  };

  // Add a function to handle promo code validation onBlur
  const handlePromoCodeBlur = (item: TableBillItem) => {
    if (promoCodes[item._id] && item.promoCode && promoCodes[item._id].trim() !== item.promoCode.code) {
      setModalMessage('Invalid promo code');
      setModalOpen(true);
    }
  };

  // Helper: check if promo code matches for an item (now applies to all items)
  const isPromoCodeValid = (item: TableBillItem) => {
    return item.promoCode && promoCodes[item._id] && promoCodes[item._id].trim().toUpperCase() === item.promoCode.code.toUpperCase();
  };

  // Helper: get promo percentage for an item if code matches
  const getPromoPercentage = (item: TableBillItem) => {
    return isPromoCodeValid(item) && item.promoCode ? item.promoCode.promoPercentage : 0;
  };

  // Helper: calculate promo discount for an item (applies to all items)
  const calculatePromoDiscount = (item: TableBillItem) => {
    const percentage = getPromoPercentage(item);
    if (percentage > 0) {
      // Discount is always on the outstanding amount
      const outstanding = item.amount - (item.totalPaidForItem || 0);
      return (outstanding * percentage) / 100;
    }
    return 0;
  };

  // Helper: get effective amount after promo for an item (applies to all items)
  const getEffectiveAmount = (item: TableBillItem) => {
    const outstanding = item.amount - (item.totalPaidForItem || 0);
    const discount = calculatePromoDiscount(item);
    return outstanding - discount;
  };

  const handleMakePayment = async () => {
    setPaying(true)
    setPayError(null)
    setCustomPayError(null)
    // Group selected payments by billId
    const paymentsByBill: Record<string, { billId: string; billItems: { billItemId: string; amountToPay: number; promoCode?: string }[] }> = {}
    payableItems.forEach((item: TableBillItem) => {
      const outstanding = item.amount - (item.totalPaidForItem || 0);
      let amount = 0
      if (isPromoCodeValid(item)) {
        const discounted = getEffectiveAmount(item);
        amount = Math.min(discounted, outstanding);
      } else if (item.isMandatory) {
        amount = outstanding;
      } else {
        amount = Math.min(selectedPayments[item._id] || 0, outstanding);
      }
      
      if (amount && amount > 0) {
        if (!paymentsByBill[item.billId]) paymentsByBill[item.billId] = { billId: item.billId, billItems: [] }
        if (isPromoCodeValid(item)) {
          paymentsByBill[item.billId].billItems.push({ billItemId: item._id, amountToPay: amount, promoCode: promoCodes[item._id] })
        } else {
          paymentsByBill[item.billId].billItems.push({ billItemId: item._id, amountToPay: amount })
        }
      }
    })
    
    if (Object.keys(paymentsByBill).length === 0) {
      setPayError("Please enter an amount to pay for at least one item.")
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
      const errorMsg = e?.response?.data?.message || e.message || "Payment failed";
      if (errorMsg) {
        setModalMessage(errorMsg);
        setModalOpen(true);
      }
    } finally {
      setPaying(false)
    }
  }

  // Fetch organization info dynamically based on the current bill's organisationId
  const organisationId = currentBill?.organisationId?._id;
  const { data: organisationData, isLoading: isOrgLoading } = useQuery({
    queryKey: ["organisation-info", organisationId],
    queryFn: async () => {
      if (!organisationId) return null;
      const res = await client.get(`/api/user/${organisationId}`);
      return res.data;
    },
    enabled: !!organisationId,
  });

  return (
    <div className="min-h-screen bg-white p-8 rounded">
     
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
                e.currentTarget.src = "/Logo.svg";
              }}
            />
          </div>
        )}
        <div className="text-3xl font-bold text-gray-800 mb-2">
          {isOrgLoading ? "Loading..." : organisationData?.organisationName || "FINKIA LIMITED"}
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
        {customPayError && <div className="text-center text-red-500 mb-2">{customPayError}</div>}
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
          <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Promo Debit Amount</th>
          <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Paid Amount</th>
          <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Promo Code</th>
          <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Promo Code Value</th>
          <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Remaining Balance</th>
        </tr>
      </thead>
      <tbody>
        {/* Render for 'Current bill and outstanding debts' */}
        {viewType === 'all' && (
          <>
            {/* Previous Debts Section */}
            {previousDebtItems.length > 0 && (
              <>
                <tr><td colSpan={14} className="text-lg text-blue-500 w-[40%] font-bold px-3 py-2">Previous Debts</td></tr>
                {Object.entries(groupByCategory(previousDebtItems)).map(([cat, items], i) => (
                  <React.Fragment key={cat}>
                    <tr><td colSpan={14} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
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
                          {item.isMandatory
                            ? <span className="text-blue-900 font-semibold">{formatCurrency(item.amount)}</span>
                            : (
                                <input
                                  type="number"
                                  placeholder="Amount"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                  value={selectedPayments[item._id] || ""}
                                  onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                />
                              )
                          }
                        </td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                          {isPromoCodeValid(item)
                            ? <span className="text-blue-900 font-semibold">{formatCurrency(getEffectiveAmount(item))}</span>
                            : <span className="text-blue-900 font-semibold">NGN 0</span>
                          }
                        </td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem)}</td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            placeholder="Enter promo code"
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            value={promoCodes[item._id] || ""}
                            onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
                            onBlur={() => handlePromoCodeBlur(item)}
                          />
                        </td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                          {isPromoCodeValid(item) && getPromoPercentage(item) > 0
                            ? <span className="text-green-700 font-semibold">{formatCurrency(calculatePromoDiscount(item))}</span>
                            : <span className="text-gray-400">-</span>
                          }
                        </td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                          {(item.amount - (item.totalPaidForItem || 0)) <= 0 ? formatCurrency(0) : formatCurrency(item.amount - (item.totalPaidForItem || 0))}
                        </td>
                      </tr>
                    ))}
                    {/* Sub-total row for this category */}
                    <tr>
                      <td colSpan={5}></td>
                      <td className="text-right font-semibold px-4 align-top">SUB-TOTAL ({cat})</td>
                      <td colSpan={2}></td>
                      <td className="text-blue-900 font-bold text-lg text-center align-top">{formatCurrency(items.reduce((sum, item) => sum + (item.amount || 0), 0))}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </React.Fragment>
                ))}
                {/* Section grand total */}
                {/* <tr className="text-gray-500">
                  <td colSpan={9} className="font-bold text-right px-3 py-2">Grand Total (Previous Debts):</td>
                  <td className="font-bold text-blue-900 text-lg">{formatCurrency(calcGrandTotalFromSubtotals(previousDebtItems))}</td>
                  <td></td><td></td>
                  <td></td>
                  <td></td>
                </tr> */}
              </>
            )}
            {/* Current Bill Section */}
            {currentBillItems.length > 0 && (
              <>
                <tr><td colSpan={14} className="text-blue-500 text-lg font-bold px-3 py-2">Current Bill</td></tr>
                {Object.entries(groupByCategory(currentBillItems)).map(([cat, items], i) => (
                  <React.Fragment key={cat}>
                    <tr><td colSpan={14} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
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
                          {item.isMandatory
                            ? <span className="text-blue-900 font-semibold">{formatCurrency(item.amount)}</span>
                            : (
                                <input
                                  type="number"
                                  placeholder="Amount"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                  value={selectedPayments[item._id] || ""}
                                  onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                />
                              )
                          }
                        </td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                          {isPromoCodeValid(item)
                            ? <span className="text-blue-900 font-semibold">{formatCurrency(getEffectiveAmount(item))}</span>
                            : <span className="text-blue-900 font-semibold">NGN 0</span>
                          }
                        </td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem)}</td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            placeholder="Enter promo code"
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            value={promoCodes[item._id] || ""}
                            onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
                            onBlur={() => handlePromoCodeBlur(item)}
                          />
                        </td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                          {isPromoCodeValid(item) && getPromoPercentage(item) > 0
                            ? <span className="text-green-700 font-semibold">{formatCurrency(calculatePromoDiscount(item))}</span>
                            : <span className="text-gray-400">-</span>
                          }
                        </td>
                        <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                          {(item.amount - (item.totalPaidForItem || 0)) <= 0 ? formatCurrency(0) : formatCurrency(item.amount - (item.totalPaidForItem || 0))}
                        </td>
                      </tr>
                    ))}
                    {/* Sub-total row for this category */}
                    <tr>
                      <td colSpan={5}></td>
                      <td className="text-right font-semibold px-4 align-top">SUB-TOTAL ({cat})</td>
                      <td colSpan={2}></td>
                      <td className="text-blue-900 font-bold text-lg text-center align-top">{formatCurrency(items.reduce((sum, item) => sum + (item.amount || 0), 0))}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </React.Fragment>
                ))}
                {/* Section grand total */}
                {/* <tr className="text-gray-500">
                  <td colSpan={9} className="font-bold text-right px-3 py-2">Grand Total (Current Bill):</td>
                  <td className="font-bold text-blue-900 text-lg">{formatCurrency(calcGrandTotalFromSubtotals(currentBillItems))}</td>
                  <td></td><td></td>
                  <td></td>
                  <td></td>
                </tr> */}
              </>
            )}
            {/* Add vertical space before grand sub total */}
            <tr><td colSpan={14} style={{ height: '32px' }}></td></tr>
            {/* Grand Sub Total row */}
            <tr className="text-gray-500 bg-gray-100">
              <td colSpan={5}></td>
              <td className="text-right font-bold px-4 align-top">Grand Sub Total:</td>
              <td colSpan={2}></td>
              <td className="font-bold text-blue-900 text-xl text-center align-top">{formatCurrency(calcGrandSubTotalDebit(payableItems))}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {/* Overall Grand Total row */}
            <tr className="text-gray-500">
              <td colSpan={5}></td>
              <td className="text-right font-bold px-4 align-top">Overall Grand Total:</td>
              <td colSpan={2}></td>
              <td></td>
              <td className="font-bold text-blue-900 text-xl text-center align-top">{formatCurrency(calcOverallGrandTotalCredit(payableItems))}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </>
        )}
        {/* Render for 'Current bill only' */}
        {viewType === 'current' && (
          <>
            {Object.entries(groupByCategory(currentBillItems)).map(([cat, items], i) => (
              <React.Fragment key={cat}>
                <tr><td colSpan={14} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
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
                      {item.isMandatory
                        ? <span className="text-blue-900 font-semibold">{formatCurrency(item.amount)}</span>
                        : (
                            <input
                              type="number"
                              placeholder="Amount"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              value={selectedPayments[item._id] || ""}
                              onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                            />
                          )
                      }
                    </td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                      {isPromoCodeValid(item)
                        ? <span className="text-blue-900 font-semibold">{formatCurrency(getEffectiveAmount(item))}</span>
                        : <span className="text-blue-900 font-semibold">NGN 0</span>
                      }
                    </td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem)}</td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        value={promoCodes[item._id] || ""}
                        onChange={(e) => handlePromoCodeInput(item._id, e.target.value)}
                        onBlur={() => handlePromoCodeBlur(item)}
                      />
                    </td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                      {isPromoCodeValid(item) && getPromoPercentage(item) > 0
                        ? <span className="text-green-700 font-semibold">{formatCurrency(calculatePromoDiscount(item))}</span>
                        : <span className="text-gray-400">-</span>
                      }
                    </td>
                    <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                      {(item.amount - (item.totalPaidForItem || 0)) <= 0 ? formatCurrency(0) : formatCurrency(item.amount - (item.totalPaidForItem || 0))}
                    </td>
                  </tr>
                ))}
                {/* Sub-total row for this category */}
                <tr>
                  <td colSpan={5}></td>
                  <td className="text-right font-semibold px-4 align-top">SUB-TOTAL ({cat})</td>
                  <td colSpan={2}></td>
                  <td className="text-blue-900 font-bold text-lg text-center align-top">{formatCurrency(items.reduce((sum, item) => sum + (item.amount || 0), 0))}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </React.Fragment>
            ))}
            {/* Add vertical space before grand total */}
            <tr><td colSpan={14} style={{ height: '32px' }}></td></tr>
            {/* Grand Total Debit row */}
            <tr className="text-gray-500 bg-gray-100">
              <td colSpan={5}></td>
              <td className="text-right font-bold px-4 align-top">Grand Total (Current Bill):</td>
              <td colSpan={2}></td>
              <td className="font-bold text-blue-900 text-xl text-center align-top">{formatCurrency(calcGrandSubTotalDebit(currentBillItems))}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {/* Overall Grand Total row */}
            <tr className="text-gray-500">
              <td colSpan={5}></td>
              <td className="text-right font-bold px-4 align-top">Overall Grand Total:</td>
              <td colSpan={2}></td>
              <td></td>
              <td className="font-bold text-blue-900 text-xl text-center align-top">{formatCurrency(calcOverallGrandTotalCredit(currentBillItems))}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  </div>
</div>
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
<ErrorModal open={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />

</div>
        
      
      </div>  
   
  )
}

export default CurrentBill


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
  isMandatory?: boolean
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

interface OrganizationDetails {
  _id: string
  organisationName: string
  email: string
  phoneNumber: string
  officeAddress1: string
  officeAddress2?: string
  businessLogo?: string
  tradingName?: string
  website?: string
  description?: string
  country?: string
  state?: string
  city?: string
}

// Fallback values if organization data is not available
const FALLBACK_COMPANY_NAME = "FINKIA LIMITED";
const FALLBACK_COMPANY_ADDRESS = "1A, Hughes Avenue, Yaba, Lagos, Nigeria.";
const FALLBACK_COMPANY_CONTACT = "Finkia@raoatech.com | +234 8097227051";

const CurrentBill = () => {
  const { client } = useAuth()
  const [selectedPayments, setSelectedPayments] = useState<Record<string, number>>({})
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [viewType, setViewType] = useState<'current' | 'all'>('current')
  const [promoCodes, setPromoCodes] = useState<Record<string, string>>({})
  const [promoDiscounts, setPromoDiscounts] = useState<Record<string, number>>({})
  const [appliedPromos, setAppliedPromos] = useState<Record<string, boolean>>({})

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-bills'],
    queryFn: async () => {
      const res = await client.get('/api/bills/customer/all')
      return res.data
    },
    enabled: !!client,
  })

 
  const allBills: BillApi[] = data?.data || []
  const sortedBills = [...allBills].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const currentBill = sortedBills[0]
  const organizationId = currentBill?.organisationId?._id

  
  const { data: organizationData, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ['organization-details', organizationId],
    queryFn: async () => {
      if (!organizationId) return null
      const res = await client.get(`/api/user/${organizationId}`)
      return res.data
    },
    enabled: !!client && !!organizationId,
  })

 
  const getOrganizationDetails = () => {
    if (!organizationData) {
      return {
        name: FALLBACK_COMPANY_NAME,
        address: FALLBACK_COMPANY_ADDRESS,
        contact: FALLBACK_COMPANY_CONTACT,
        logo: null
      }
    }

    const org = organizationData as OrganizationDetails
    const address = [
      org.officeAddress1,
      org.officeAddress2,
      org.city,
      org.state,
      org.country
    ].filter(Boolean).join(', ')

    const contact = [
      org.email,
      org.phoneNumber
    ].filter(Boolean).join(' | ')

    return {
      name: org.organisationName || org.tradingName || FALLBACK_COMPANY_NAME,
      address: address || FALLBACK_COMPANY_ADDRESS,
      contact: contact || FALLBACK_COMPANY_CONTACT,
      logo: org.businessLogo
    }
  }

  const orgDetails = getOrganizationDetails()
  
  const { data: categoriesData } = useQuery({
    queryKey: ['bill-categories'],
    queryFn: async () => {
      const res = await client.get('/api/bill-categories')
      return res.data.data
    },
    enabled: !!client,
  })

  const handlePromoCodeChange = async (billItemId: string, promoCode: string) => {
    setPromoCodes(prev => ({ ...prev, [billItemId]: promoCode }))
    
    if (promoCode.trim()) {
      try {
     
        const discount = Math.floor(Math.random() * 20) + 10 
        setPromoDiscounts(prev => ({ ...prev, [billItemId]: discount }))
        setAppliedPromos(prev => ({ ...prev, [billItemId]: true }))
      } catch (error) {
        setPromoDiscounts(prev => ({ ...prev, [billItemId]: 0 }))
        setAppliedPromos(prev => ({ ...prev, [billItemId]: false }))
      }
    } else {
      setPromoDiscounts(prev => ({ ...prev, [billItemId]: 0 }))
      setAppliedPromos(prev => ({ ...prev, [billItemId]: false }))
    }
  }

  // Function to calculate reduced amount with promo code
  const getReducedAmount = (item: TableBillItem) => {
    const discount = promoDiscounts[item._id] || 0
    const originalAmount = item.amount - (item.totalPaidForItem || 0)
    return originalAmount * (1 - discount / 100)
  }

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
  const previousDebtItems: TableBillItem[] = sortedBills.slice(1).flatMap((bill) =>
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

  
  const calcTotalSubtotal = (items: TableBillItem[]) => {
    return items.reduce((sum, item) => {
     
      if (item.isMandatory) {
        const outstandingAmount = item.amount - (item.totalPaidForItem || 0)
        const discount = promoDiscounts[item._id] || 0
        return sum + (outstandingAmount * (1 - discount / 100));
      } else {
        return sum + (Number(selectedPayments[item._id]) || 0);
      }
    }, 0);
  };

  
  const calcTotalInput = () => {
  
    return payableItems.reduce((sum, item) => {
      if (item.isMandatory) {
        const outstandingAmount = item.amount - (item.totalPaidForItem || 0)
        const discount = promoDiscounts[item._id] || 0
        return sum + (outstandingAmount * (1 - discount / 100));
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

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return `NGN ${amount.toLocaleString()}`
  }

  const handlePaymentInput = (billItemId: string, value: string) => {
    const num = Number(value)
    setSelectedPayments((prev) => ({ ...prev, [billItemId]: isNaN(num) ? 0 : num }))
  }

  // Function to download bill as PDF
  const handleDownloadBill = () => {
    const billData = {
      companyName: orgDetails.name,
      companyAddress: orgDetails.address,
      companyContact: orgDetails.contact,
      billItems: payableItems,
      totals: {
        totalDebit: payableItems.reduce((sum, item) => sum + (item.amount || 0), 0),
        totalCredit: payableItems.reduce((sum, item) => sum + (item.totalPaidForItem || 0), 0),
        grandTotal: calcGrandTotalFromSubtotals(payableItems)
      },
      viewType,
      currentBill: currentBill,
      previousBills: sortedBills.slice(1)
    }

    // Create a blob with the bill data
    const blob = new Blob([JSON.stringify(billData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    // Create download link
    const link = document.createElement('a')
    link.href = url
    link.download = `bill-${currentBill?.billCode || 'current'}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleMakePayment = async () => {
    setPaying(true)
    setPayError(null)
    // Group selected payments by billId
    const paymentsByBill: Record<string, { billId: string; billItems: { billItemId: string; amountToPay: number }[] }> = {}
    
    payableItems.forEach((item: TableBillItem) => {
      let amount = 0
      
      if (item.isMandatory) {
        // For mandatory items, use the reduced outstanding amount (with promo discount if applied)
        const outstandingAmount = item.amount - (item.totalPaidForItem || 0)
        const discount = promoDiscounts[item._id] || 0
        amount = outstandingAmount * (1 - discount / 100)
      } else {
        // For non-mandatory items, use the user-selected amount
        amount = selectedPayments[item._id] || 0
      }
      
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
     
      <div className="flex flex-col items-center justify-center mb-8">
        {orgDetails.logo && (
          <div className="mb-4">
            <img 
              src={orgDetails.logo} 
              alt="Company Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
        )}

        <div className="text-lg font-semibold text-gray-700 mb-1">OrganizationName: {orgDetails.name}</div>
        <div className="text-gray-600 mb-1">Office Address: {orgDetails.address}</div>
        <div className="text-gray-600">{orgDetails.contact}</div>
      </div>
      <div className="max-w-7xl mx-auto">
       
        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadBill}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-500 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Bill
          </button>
        </div>
       
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
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Promo Code Debit Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Credit Amount</th>
                  <th className="text-gray-800 font-semibold text-left border-r border-gray-300 px-3 py-3 whitespace-nowrap">Paid Amount</th>
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
                        <tr><td colSpan={13} className="text-lg text-blue-500 w-[40%] font-bold px-3 py-2">Previous Debts</td></tr>
                        {Object.entries(groupByCategory(previousDebtItems)).map(([cat, items], i) => (
                          <React.Fragment key={cat}>
                            <tr><td colSpan={13} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
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
                                  <div className="flex flex-col gap-1">
                                    <input
                                      type="text"
                                      placeholder="Promo code"
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                                      value={promoCodes[item._id] || ""}
                                      onChange={(e) => handlePromoCodeChange(item._id, e.target.value)}
                                    />
                                    <div className="text-xs text-blue-600 font-semibold">
                                      {appliedPromos[item._id] ? formatCurrency(getReducedAmount(item)) : formatCurrency(item.amount - (item.totalPaidForItem || 0))}
                                    </div>
                                  </div>
                                </td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                                  {item.amount - (item.totalPaidForItem || 0) > 0 ? (
                                    item.isMandatory ? (
                                      <span className="text-blue-900 font-semibold">
                                        {formatCurrency(getReducedAmount(item))}
                                      </span>
                                    ) : (
                                      <input
                                        type="number"
                                        placeholder="Amount"
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={selectedPayments[item._id] || ""}
                                        onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                      />
                                    )
                                  ) : (
                                    <span>-</span>
                                  )}
                                </td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                                  {formatCurrency(item.totalPaidForItem || 0)}
                                </td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                                  {formatCurrency(item.amount - (item.totalPaidForItem || 0))}
                                </td>
                              </tr>
                            ))}
                            {/* Dynamic Total row under Credit Amount column */}
                            <tr>
                              <td colSpan={10}></td>
                              <td className="text-blue-900 font-bold text-lg" style={{ textAlign: 'center' }}>
                                Total: NGN {calcTotalSubtotal(items).toLocaleString()}
                              </td>
                              <td></td><td></td>
                            </tr>
                            {/* Sub-total row for this category */}
                            <tr>
                              <td colSpan={10} className="text-right font-semibold px-3 py-2">Sub-total for {cat}:</td>
                              <td></td>
                              <td></td><td></td>
                            </tr>
                          </React.Fragment>
                        ))}
                        {/* Section grand total */}
                        <tr className="text-gray-500">
                          <td colSpan={10} className="font-bold text-right px-3 py-2">Grand Total (Previous Debts):</td>
                          <td className="font-bold text-blue-900 text-lg">{formatCurrency(calcGrandTotalFromSubtotals(previousDebtItems))}</td>
                          <td></td><td></td>
                        </tr>
                      </>
                    )}
                    {/* Current Bill Section */}
                    {currentBillItems.length > 0 && (
                      <>
                        <tr><td colSpan={13} className="text-blue-500 text-lg font-bold px-3 py-2">Current Bill</td></tr>
                        {Object.entries(groupByCategory(currentBillItems)).map(([cat, items], i) => (
                          <React.Fragment key={cat}>
                            <tr><td colSpan={13} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
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
                                  <div className="flex flex-col gap-1">
                                    <input
                                      type="text"
                                      placeholder="Promo code"
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                                      value={promoCodes[item._id] || ""}
                                      onChange={(e) => handlePromoCodeChange(item._id, e.target.value)}
                                    />
                                    <div className="text-xs text-blue-600 font-semibold">
                                      {appliedPromos[item._id] ? formatCurrency(getReducedAmount(item)) : formatCurrency(item.amount - (item.totalPaidForItem || 0))}
                                    </div>
                                  </div>
                                </td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                                  {item.isMandatory ? (
                                    <span className="text-blue-900 font-semibold">
                                      {formatCurrency(getReducedAmount(item))}
                                    </span>
                                  ) : (
                                    <input
                                      type="number"
                                      placeholder="Amount"
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                      value={selectedPayments[item._id] || ""}
                                      onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                    />
                                  )}
                                </td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem || 0)}</td>
                                <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount - (item.totalPaidForItem || 0))}</td>
                              </tr>
                            ))}
                            {/* Dynamic Total row under Credit Amount column */}
                            <tr>
                              <td colSpan={10}></td>
                              <td className="text-blue-900 font-bold text-lg" style={{ textAlign: 'center' }}>
                                Total: NGN {calcTotalSubtotal(items).toLocaleString()}
                              </td>
                              <td></td><td></td>
                            </tr>
                            {/* Sub-total row for this category */}
                            <tr>
                              <td colSpan={10} className="text-right font-semibold px-3 py-2">Sub-total for {cat}:</td>
                              <td></td>
                              <td></td><td></td>
                            </tr>
                          </React.Fragment>
                        ))}
                        {/* Section grand total */}
                        <tr className="text-gray-500">
                          <td colSpan={10} className="font-bold text-right px-3 py-2">Grand Total (Current Bill):</td>
                          <td className="font-bold text-blue-900 text-lg">{formatCurrency(calcGrandTotalFromSubtotals(currentBillItems))}</td>
                          <td></td><td></td>
                        </tr>
                      </>
                    )}
                    {/* Overall grand total */}
                    <tr className="text-gray-500">
                      <td colSpan={10} className="font-bold text-right px-3 py-2">Overall Grand Total:</td>
                      <td className="font-bold text-blue-900 text-xl">{formatCurrency(calcGrandTotalFromSubtotals([...previousDebtItems, ...currentBillItems]))}</td>
                      <td></td><td></td>
                    </tr>
                  </>
                )}
                {/* Render for 'Current bill only' (existing logic) */}
                {viewType === 'current' && (
                  <>
                    {Object.entries(groupByCategory(currentBillItems)).map(([cat, items], i) => (
                      <React.Fragment key={cat}>
                        <tr><td colSpan={13} className="bg-gray-100 font-semibold px-3 py-2">Category: {cat}</td></tr>
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
                              <div className="flex flex-col gap-1">
                                <input
                                  type="text"
                                  placeholder="Promo code"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                                  value={promoCodes[item._id] || ""}
                                  onChange={(e) => handlePromoCodeChange(item._id, e.target.value)}
                                />
                                <div className="text-xs text-blue-600 font-semibold">
                                  {appliedPromos[item._id] ? formatCurrency(getReducedAmount(item)) : formatCurrency(item.amount - (item.totalPaidForItem || 0))}
                                </div>
                              </div>
                            </td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">
                              {item.isMandatory ? (
                                <span className="text-blue-900 font-semibold">
                                  {formatCurrency(getReducedAmount(item))}
                                </span>
                              ) : (
                                <input
                                  type="number"
                                  placeholder="Amount"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                  value={selectedPayments[item._id] || ""}
                                  onChange={(e) => handlePaymentInput(item._id, e.target.value)}
                                />
                              )}
                            </td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.totalPaidForItem || 0)}</td>
                            <td className="text-gray-700 border-r border-gray-200 px-3 py-3 whitespace-nowrap">{formatCurrency(item.amount - (item.totalPaidForItem || 0))}</td>
                          </tr>
                        ))}
                        {/* Dynamic Total row under Credit Amount column */}
                        <tr>
                          <td colSpan={10}></td>
                          <td className="text-blue-900 font-bold text-lg" style={{ textAlign: 'center' }}>
                            Total: NGN {calcTotalSubtotal(items).toLocaleString()}
                          </td>
                          <td></td><td></td>
                        </tr>
                        {/* Sub-total row for this category */}
                        <tr>
                          <td colSpan={10} className="text-right font-semibold px-3 py-2">Sub-total for {cat}:</td>
                          <td></td>
                          <td></td><td></td>
                        </tr>
                      </React.Fragment>
                    ))}
                    {/* Section grand total */}
                    <tr className="text-gray-500">
                      <td colSpan={10} className="font-bold text-right px-3 py-2">Grand Total (Current Bill):</td>
                      <td className="font-bold text-blue-900 text-xl">{formatCurrency(calcGrandTotalFromSubtotals(currentBillItems))}</td>
                      <td></td><td></td>
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
      </div>
    </div>
  )
}

export default CurrentBill
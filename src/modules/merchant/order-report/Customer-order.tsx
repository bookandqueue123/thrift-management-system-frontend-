'use client';
import React, { useState, useMemo } from 'react'
import TransactionsTable from '@/components/Tables'
import { StatusIndicator } from '@/components/StatusIndicator'
import { useAuth } from '@/api/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal';

// TypeScript interfaces for the API response
interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface ProductPaymentTerms {
  repaymentPeriodInMonths: number;
  mininumRepaymentAmount: number;
  mininumDepositPercentage: number;
  interestRatePercentage: number;
  platformFee: number;
}

interface LoanDetails {
  totalInterestAccrued: number;
  isAmortized: boolean;
  totalLateFees: number;
  earlyPaymentSavings: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Product {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string[];
}

interface OrderItem {
  product: Product;
  name: string;
  quantity: number;
  price: number;
  _id: string;
}

interface PickupStation {
  contact: any;
  address: {
    country: string;
  };
  _id: string;
  name: string;
  fullAddress: string;
  manager: {
    fullName: string;
  };
  isAvailable: boolean;
  id: string;
}

interface Order {
  _id: string;
  orderId: string;
  user: User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  productPaymentTerms: ProductPaymentTerms;
  loanDetails: LoanDetails;
  pickupStation: PickupStation;
  paymentMethod: string;
  paymentMode: string;
  totalPrice: number;
  amountPaid: number;
  remainingBalance: number;
  paymentPlan: any[];
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  orderStatus: string;
  paymentStatus: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalOrders: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
  };
}

// Fixed headers to match all the columns being displayed
const headers = [
  'S/N',
  'Customer ID',
  'Customer Name',
  'Customer Email',
  'Product',
  'Description',
  'Quantity',
  'Amount',
  'Product ID',
  'Order ID',
  'Date & Time',
  'Payment',
  'Mode Of Delivery',
  'Pickup Station',
  'Status',
  'Delivery Cost',
  'Total Cost'
];

const AdminOrderReport = () => {
  const { client } = useAuth();
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number>(0);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<PickupStation | null>(null);
  
  const { data: apiResponse, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await client.get('/api/order/admin/all?page=1&limit=10');
      return res.data;
    },
  });

  const orders = apiResponse?.data?.orders || [];

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Helper function to determine delivery status
  const getDeliveryStatus = (order: Order) => {
    if (order.isDelivered) return 'Delivered';
    if (order.orderStatus === 'pending') return 'Pending';
    if (order.orderStatus === 'processing') return 'Processing';
    return 'In-transit';
  };

  // Helper function to determine payment completeness
  const getPaymentCompleteness = (order: Order) => {
    if (order.isPaid) return 'Full';
    if (order.paymentMode === '100% Full Payment') return 'Full';
    return 'Partial';
  };

  // Simple search function for name, email, product, and description
  const filteredOrders = useMemo(() => {
    if (!search.trim()) {
      // If no search term, apply only date filter
      return orders.filter((order: Order) => {
        let matchesDate = true;
        if (fromDate) {
          matchesDate = new Date(order.createdAt) >= new Date(fromDate);
        }
        if (toDate && matchesDate) {
          const endDate = new Date(toDate);
          endDate.setHours(23, 59, 59, 999);
          matchesDate = new Date(order.createdAt) <= endDate;
        }
        return matchesDate;
      });
    }

    const searchTerm = search.toLowerCase().trim();
    
    return orders.filter((order: Order) => {
      // Search in customer name and email
      const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase();
      const customerEmail = (order.user?.email || '').toLowerCase();
      
      const customerMatch = customerName.includes(searchTerm) || customerEmail.includes(searchTerm);
      
      // Search in products and descriptions
      const productMatch = order.orderItems?.some((item: OrderItem) => {
        const productName = (item.product?.name || item.name || '').toLowerCase();
        const productBrand = (item.product?.brand || '').toLowerCase();
        const productCategory = (item.product?.category || '').toLowerCase();
        const description = `${productBrand} - ${productCategory}`.toLowerCase();
        
        return productName.includes(searchTerm) || description.includes(searchTerm);
      }) || false;
      
      const matchesSearch = customerMatch || productMatch;
      
      // Date filter
      let matchesDate = true;
      if (fromDate) {
        matchesDate = new Date(order.createdAt) >= new Date(fromDate);
      }
      if (toDate && matchesDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = new Date(order.createdAt) <= endDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [orders, search, fromDate, toDate]);

  // Create flattened rows for the table (one row per order item)
  const tableRows = useMemo(() => {
    return filteredOrders.flatMap((order: Order, orderIndex: number) => 
      order.orderItems.map((item: OrderItem, itemIndex: number) => ({
        sn: `${orderIndex + 1}.${itemIndex + 1}`,
        customerId: order.user._id,
        customerName: `${order.user.firstName} ${order.user.lastName}`,
        customerEmail: order.user.email,
        product: item.product?.name || item.name || 'N/A',
        description: `${item.product?.brand || 'Unknown Brand'} - ${item.product?.category || 'No Category'}`,
        quantity: item.quantity,
        amount: formatCurrency(item.price),
        productId: item.product?.productId || item.product?._id || 'N/A',
        orderId: order.orderId,
        dateTime: formatDate(order.createdAt),
        payment: getPaymentCompleteness(order),
        mode: order.pickupStation ? 'Pickup Centre' : 'Door Delivery',
        pickupStation: order.pickupStation,
        status: getDeliveryStatus(order),
        deliveryCost: formatCurrency(order.productPaymentTerms?.platformFee || 0),
        totalCost: formatCurrency(order.totalPrice),
        originalOrder: order,
        originalItem: item
      }))
    );
  }, [filteredOrders]);

  const handleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  if (isLoading) {
    return (
      <div className="text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Admin&apos;s Orders Report</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Admin&apos;s Orders Report</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-400 text-lg">
            Error loading orders: {error?.message || 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }
     
  return (
    <div className="text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Admin&apos;s Orders Report</h2>
      
      {/* Search and Date Range Controls */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form className="flex items-center rounded-lg bg-[rgba(255,255,255,0.1)] p-3 w-full md:w-1/3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="Search by name, email, product, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
          />
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <circle
              cx="8.60996"
              cy="8.10312"
              r="7.10312"
              stroke="#EAEAFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.4121 13.4121L16.9997 16.9997"
              stroke="#EAEAFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </form>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="fromDate" className="text-sm font-semibold text-white mr-2">Range:</label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg bg-[rgba(255,255,255,0.1)] p-2 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
          />
          <span className="mx-2 text-white">to</span>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg bg-[rgba(255,255,255,0.1)] p-2 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
          />
        </div>
      </div>

      {/* Orders Summary */}
      <div className="mb-4 text-sm text-ajo_offWhite">
        Showing {tableRows.length} order items from {filteredOrders.length} orders
        {search && (
          <span className="ml-4 text-yellow-400">
            (filtered by: &quot;{search}&quot;)
          </span>
        )}
        {apiResponse?.data?.pagination && (
          <span className="ml-4">
            Page {apiResponse.data.pagination.currentPage} of {apiResponse.data.pagination.totalPages} 
            ({apiResponse.data.pagination.totalOrders} total orders)
          </span>
        )}
      </div>

      <TransactionsTable
        key={`${search}-${filteredOrders.length}`}
        headers={headers}
        content={tableRows.map((row, idx) => (
          <tr key={`${row.orderId}-${idx}`} className="border-b border-ajo_offWhite/10">
            <td className="px-6 py-3 whitespace-nowrap">{row.sn}</td>
            <td className="px-6 py-3 whitespace-nowrap text-sm text-ajo_offWhite/80">{row.customerId}</td>
            <td className="px-6 py-3 whitespace-nowrap font-medium">{row.customerName}</td>
            <td className="px-6 py-3 whitespace-nowrap text-sm text-ajo_offWhite/80">{row.customerEmail}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.product}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.description}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.quantity}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.amount}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.productId}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.orderId}</td>
            <td className="px-6 py-3 whitespace-nowrap">{row.dateTime}</td>
            <td className="px-6 py-3 whitespace-nowrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.payment === 'Full' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {row.payment}
              </span>
            </td>
            <td className="px-6 py-3 whitespace-nowrap">{row.mode}</td>
            <td className="px-6 py-3 whitespace-nowrap">
              {row.pickupStation ? (
                <button
                  onClick={() => setSelectedStation(row.pickupStation)}
                  className="text-blue-400 hover:underline"
                >
                  View Pickup Station
                </button>
              ) : (
                'N/A'
              )}
            </td>
            <td className="px-6 py-3 whitespace-nowrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.status === 'Delivered' 
                  ? 'bg-green-500/20 text-green-400' 
                  : row.status === 'Pending'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {row.status}
              </span>
            </td>
            <td className="px-6 py-3 whitespace-nowrap">{row.deliveryCost}</td>
            <td className="px-6 py-3 whitespace-nowrap font-semibold">{row.totalCost}</td>
          </tr>
        ))}
      />
      
      {selectedStation && (
        <Modal title="View Pickup Station" setModalState={() => setSelectedStation(null)}>
          <div className="p-4 text-white space-y-2">
            <div><b>Name:</b> {selectedStation.name || 'N/A'}</div>
            <div><b>Address:</b> {selectedStation.fullAddress || selectedStation.address?.country || 'N/A'}</div>
            <div><b>Phone Number:</b> {selectedStation.contact?.phone || 'N/A'}</div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminOrderReport
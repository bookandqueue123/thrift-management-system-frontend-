"use client";
import { apiUrl } from "@/api/hooks/useAuth";
import { selectToken } from "@/slices/OrganizationIdSlice";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Filter,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Types
interface BillPayment {
  billItems: any;
  _id: string;
  billId: {
    startDate: string | Date;
    endDate: string | Date;
    _id: string;
    billName: string;
    billCode: string;
    amount: number;
    totalAmount: number;
    status: string;
  };
  customerId: {
    firstName: string;
    lastName: string;
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  organisationId: {
    _id: string;
    name: string;
    email: string;
  };
  paymentStatus: "pending" | "completed" | "failed" | "cancelled";
  paymentMethod: string;
  totalAmountPaid: number;
  paymentReference: string;
  transactionId: string;
  createdAt: string;
  notes?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface Summary {
  totalAmount: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
}

interface ApiResponse {
  success: boolean;
  data: BillPayment[];
  pagination: Pagination;
  summary: Summary;
  message?: string;
}

const OrganizationBillPayments: React.FC = () => {
  const token = useSelector(selectToken);
  const [payments, setPayments] = useState<BillPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [summary, setSummary] = useState<Summary>({
    totalAmount: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    startDate: "",
    endDate: "",
    customerId: "",
    billId: "",
    paymentMethod: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // API call to fetch organization bill payments
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(
        `${apiUrl}api/bills/organisation/bill/payment?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adjust based on your auth implementation
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setPayments(data.data);
        setPagination(data.pagination);
        setSummary(data.summary);
      } else {
        throw new Error(data.message || "Failed to fetch payments");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch payments";
      setError(errorMessage);
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewPayment = (paymentId: string) => {
    // Implement view payment logic
    console.log("View payment:", paymentId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Bill Payments
          </h1>
          <p className="text-gray-600">View and manage bills payments</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.totalAmount)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.completedPayments}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {summary.pendingPayments}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {summary.failedPayments}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button
                onClick={fetchPayments}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filters.paymentMethod}
                onChange={(e) =>
                  handleFilterChange("paymentMethod", e.target.value)
                }
                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Methods</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="wallet">Wallet</option>
              </select>

              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Start Date"
              />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="End Date"
              />
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment History ({pagination.totalCount} total)
            </h3>
          </div>

          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <div className="mb-4 text-red-600">{error}</div>
              <button
                onClick={fetchPayments}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No payments found. Try adjusting your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Bill Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Bill start date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Bill end date
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Bill item 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Bill item 2
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Bill item 3
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Mode of Payment
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Transaction Reference
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.customerId.firstName} {""}{" "}
                            {payment.customerId.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.customerId.email}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.billId?.billName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.billId?.billCode || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className="font-medium">
                          {formatDate(payment.billId?.startDate)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className="font-medium">
                          {formatDate(payment.billId?.endDate)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className="font-medium">
                          {payment.billItems[0]?.billName || "N/A"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className="font-medium">
                          {payment.billItems[1]?.billName || "N/A"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className="font-medium">
                          {payment.billItems[2]?.billName || "N/A"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className="font-medium">
                          {payment.paymentMethod || "N/A"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.paymentReference}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.transactionId}
                          </div>
                          <div className="text-xs text-gray-400">
                            {payment.paymentMethod}
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.totalAmountPaid)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(payment.paymentStatus)}`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </td>
                      {/* <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewPayment(payment._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.currentPage - 1) * filters.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * filters.limit,
                pagination.totalCount,
              )}{" "}
              of {pagination.totalCount} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationBillPayments;

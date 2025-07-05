"use client";
import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import { selectToken } from "@/slices/OrganizationIdSlice";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Download,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BillPaymentsTable = () => {
  const { client } = useAuth();
  const token = useSelector(selectToken);
  type Payment = {
    _id: string;
    billId?: {
      billName?: string;
      billCode?: string;
      startDate?: string;
      endDate?: string;
    };
    billItems: { billName?: string }[];
    paymentMethod?: string;
    paymentReference?: string;
    transactionId?: string;
    totalAmountPaid?: number;
    paymentStatus?: string;
    paymentDate?: string;
    createdAt?: string;
  };

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  const fetchPayments = async (page = 1, status = "") => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (status) {
        params.append("status", status);
      }

      // Simulate API call - replace with actual API endpoint
      const response = await fetch(
        `${apiUrl}api/bills/customer/bill/payment?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bill payments");
      }

      const data = await response.json();

      if (data.success) {
        setPayments(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message || "Failed to fetch payments");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const formatDate = (dateString: Date | string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(amount || 0);
  };

  if (loading && payments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="mb-4 h-8 rounded bg-gray-200"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 rounded bg-gray-200"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Bill Payments
          </h1>
          <p className="text-gray-600">
            View and manage your bill payment history
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Showing {payments.length} of {pagination.totalCount} payments
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                <span className="text-xs text-white">!</span>
              </div>
              <span className="font-medium">Error loading payments</span>
            </div>
            <p className="mt-1 text-red-700">{error}</p>
            <button
              onClick={() => fetchPayments(currentPage, statusFilter)}
              className="mt-2 font-medium text-red-600 hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
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
                    Date and time of payment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-4">
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
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.paymentReference}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.paymentMethod || "N/A"}
                        </div>
                        {payment.transactionId && (
                          <div className="text-xs text-gray-400">
                            TX: {payment.transactionId}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <span className="font-medium">
                        {formatCurrency(payment.totalAmountPaid)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[payment.paymentStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
                      >
                        {payment.paymentStatus || "N/A"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {formatDate(payment.paymentDate || payment.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payments.length === 0 && !loading && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No payments found
              </h3>
              <p className="text-gray-500">
                No bill payments match your current filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map(
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            page === pagination.currentPage
                              ? "bg-blue-600 text-white"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillPaymentsTable;

"use client";
import { apiUrl } from "@/api/hooks/useAuth";
import { selectToken } from "@/slices/OrganizationIdSlice";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Edit,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PlatformChargeManager = () => {
  const token = useSelector(selectToken);
  interface PlatformCharge {
    percentage: number;
    createdAt: string;
    updatedAt: string;
  }
  const [platformCharge, setPlatformCharge] = useState<PlatformCharge | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [formData, setFormData] = useState({ percentage: "" });
  const [errors, setErrors] = useState<{ percentage?: string }>({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Fetch platform charge on component mount
  useEffect(() => {
    fetchPlatformCharge();
  }, []);

  const fetchPlatformCharge = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}api/platform-charge`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlatformCharge(data.data);
      } else if (response.status === 404) {
        setPlatformCharge(null);
      } else {
        throw new Error("Failed to fetch platform charge");
      }
    } catch (error) {
      showNotification("Error fetching platform charge", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { percentage?: string } = {};
    const percentage = parseFloat(formData.percentage);

    if (!formData.percentage) {
      newErrors.percentage = "Percentage is required";
    } else if (isNaN(percentage)) {
      newErrors.percentage = "Percentage must be a valid number";
    } else if (percentage < 0 || percentage > 100) {
      newErrors.percentage = "Percentage must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const url =
        modalMode === "create"
          ? `${apiUrl}api/platform-charge`
          : `${apiUrl}api/platform-charge`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ percentage: parseFloat(formData.percentage) }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlatformCharge(data.data);
        setShowModal(false);
        setFormData({ percentage: "" });
        showNotification(
          modalMode === "create"
            ? "Platform charge created successfully"
            : "Platform charge updated successfully",
          "success",
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : String(error),
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}api/platform-charge`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPlatformCharge(null);
        setShowDeleteModal(false);
        showNotification("Platform charge deleted successfully", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Delete failed");
      }
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : String(error),
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  interface PlatformCharge {
    percentage: number;
    createdAt: string;
    updatedAt: string;
  }

  type ModalMode = "create" | "edit";

  interface FormData {
    percentage: string;
  }

  interface Errors {
    percentage?: string;
  }

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    if (mode === "edit" && platformCharge) {
      setFormData({ percentage: platformCharge.percentage.toString() });
    } else {
      setFormData({ percentage: "" });
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ percentage: "" });
    setErrors({});
  };

  interface Notification {
    show: boolean;
    message: string;
    type: "success" | "error" | string;
  }

  const showNotification = (message: string, type: Notification["type"]) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  interface FormatDateOptions extends Intl.DateTimeFormatOptions {}

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    } as FormatDateOptions);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Platform Charge Management
          </h1>
          <p className="text-gray-600">
            Manage your platform&apos;s commission percentage
          </p>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed right-4 top-4 z-50 rounded-lg p-4 shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } flex items-center space-x-2 text-white`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() =>
                setNotification({ show: false, message: "", type: "" })
              }
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {loading && !showModal ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : platformCharge ? (
            /* Display Platform Charge */
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Current Platform Charge
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal("edit")}
                    className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center space-x-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-blue-500 p-3">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {platformCharge.percentage}%
                    </h3>
                    <p className="text-gray-600">Platform Commission</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-blue-200 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-medium">
                        {formatDate(platformCharge.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Updated</p>
                      <p className="font-medium">
                        {formatDate(platformCharge.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No Platform Charge */
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 p-4">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No Platform Charge Set
              </h3>
              <p className="mb-6 text-gray-600">
                Create a platform charge to start collecting commissions
              </p>
              <button
                onClick={() => openModal("create")}
                className="mx-auto flex items-center space-x-2 rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
              >
                <Plus size={20} />
                <span>Create Platform Charge</span>
              </button>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                onClick={closeModal}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="w-full">
                        <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                          {modalMode === "create"
                            ? "Create Platform Charge"
                            : "Edit Platform Charge"}
                        </h3>

                        <div className="mb-4">
                          <label
                            htmlFor="percentage"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Percentage (%)
                          </label>
                          <input
                            type="number"
                            id="percentage"
                            value={formData.percentage}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                percentage: e.target.value,
                              })
                            }
                            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.percentage
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter percentage (0-100)"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          {errors.percentage && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.percentage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {loading
                        ? "Processing..."
                        : modalMode === "create"
                          ? "Create"
                          : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                onClick={() => setShowDeleteModal(false)}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Delete Platform Charge
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete the platform charge?
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformChargeManager;

"use client";

import React, { useState, useEffect, useRef } from "react";
import TransactionsTable from "@/components/Tables";
import Modal from "@/components/Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BillCreationForm from "@/modules/form/BillCreattion";
import { useAuth } from "@/api/hooks/useAuth";
import EditBillForm from "@/modules/form/EditBillForm";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";

// Bill type based on your API
export interface Bill {
  _id: string;
  billName: string;
  billCode: string;
  totalAmount: number;
  status: string;
  startDate: string;
  endDate: string;
   specialNote?: string;
  createdAt: string;
  billItems?: Array<{
    billName: string;
    category: string;
    isMandatory: boolean;
    amount: number;
    quantity: number;
    amountWithoutCharge: number;
    image: string | File | null | undefined;
    promoCode: string | null;
    promoPercentage: number;
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
  }>;
  [key: string]: any;
}

// Add ApiResponse type if not defined
interface ApiResponse<T> {
  data: T;
  [key: string]: any;
}

const initialBillForm = {
  billName: "",
  billCode: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  billItems: [
    { billName: "", category: "", amount: "", quantity: "", amountWithoutCharge: "", image: null },
  ],
  promoCode: "",
  customUniqueCode: "",
  platformServiceCharge: "",
  promoPercentage: "",
  maxPaymentDuration: {
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  },
  billImage: null,
  status: "draft",
};

const Create = () => {
  const queryClient = useQueryClient();
  const { client } = useAuth();
  const organizationId = useSelector(selectOrganizationId);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewEditModal, setShowViewEditModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete-confirm' | null>(null);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 10;
  const [billForm, setBillForm] = useState<any>(initialBillForm);
  const [editMode, setEditMode] = useState(false);
  const [showBillItemsModal, setShowBillItemsModal] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState<string | null>(null);
  const actionDropdownRef = useRef<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // Add state for update modal
  const [updateSuccessModal, setUpdateSuccessModal] = useState(false);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");

  // Fetch all bills
const { data: billsResponse, isLoading: billsLoading, isError: billsError } = useQuery<ApiResponse<Bill[]>>({
  queryKey: ["bills"],
  queryFn: async () => {
    const res = await client.get("/api/bills");
    return res.data;
  },
});
   
  
  // Fetch single bill
 const { data: singleBillResponse } = useQuery<ApiResponse<Bill>>({
  queryKey: ["bill", selectedBillId],
  queryFn: async () => {
    const res = await client.get(`/api/bills/${selectedBillId}`);
    return res.data;
  },
  enabled: !!selectedBillId && (modalType === "view" || modalType === "edit"),
});

const singleBill = singleBillResponse?.data;

  // Fetch platform charge percentage from API
  const { data: platformChargeData, isLoading: isLoadingPlatformCharge } = useQuery({
    queryKey: ['platform-charge'],
    queryFn: async () => {
      const res = await client.get('/api/bill-charge');
      return res.data;
    },
  });

  // Prefill form for edit
  useEffect(() => {
    if (modalType === 'edit' && singleBill) {
      setBillForm({
        ...singleBill,
        billItems: singleBill.billItems?.length
          ? singleBill.billItems.map((item: any) => ({
              ...item,
              image: null,
              promoCode: typeof item.promoCode === 'string' || item.promoCode == null
                ? {
                    code: item.promoCode || null,
                    promoPercentage: item.promoPercentage ?? 0,
                    startDate: item.startDate ?? null,
                    endDate: item.endDate ?? null,
                    startTime: item.startTime ?? null,
                    endTime: item.endTime ?? null,
                  }
                : item.promoCode,
            }))
          : [{ billName: "", category: "", amount: "", quantity: "", amountWithoutCharge: "", image: null, promoCode: null }],
        billImage: null,
      });
      setEditMode(true);
    } else if (modalType === 'view' || !showViewEditModal) {
      setBillForm(initialBillForm);
      setEditMode(false);
    }
  }, [modalType, singleBill, showViewEditModal]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as any;
    if (type === "file") {
      setBillForm((prev: any) => ({ ...prev, [name]: files[0] }));
    } else {
      setBillForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // Bill items handlers
  const handleBillItemChange = (idx: number, field: string, value: any) => {
    setBillForm((prev: any) => {
      const items = [...prev.billItems];
      items[idx][field] = value;
      return { ...prev, billItems: items };
    });
  };
  const handleBillItemFile = (idx: number, file: File | null) => {
    setBillForm((prev: any) => {
      const items = [...prev.billItems];
      items[idx].image = file;
      return { ...prev, billItems: items };
    });
  };
  const addBillItem = () => {
    setBillForm((prev: any) => ({
      ...prev,
      billItems: [...prev.billItems, { billName: "", category: "", amount: "", quantity: "", amountWithoutCharge: "", image: null }],
    }));
  };
  const removeBillItem = (idx: number) => {
    setBillForm((prev: any) => {
      const items = [...prev.billItems];
      items.splice(idx, 1);
      return { ...prev, billItems: items };
    });
  };

  // Handle max payment duration changes
  const handleMaxPaymentChange = (field: string, value: string) => {
    setBillForm((prev: any) => ({
      ...prev,
      maxPaymentDuration: { ...prev.maxPaymentDuration, [field]: value },
    }));
  };

  // Submit handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(billForm).forEach(([key, value]) => {
      if (key === "billItems") {
        if (Array.isArray(value)) {
          formData.append(
            "billItems",
            JSON.stringify(
              value.map((item: any) => {
                const { image, ...rest } = item;
                return rest;
              })
            )
          );
          value.forEach((item: any, idx: number) => {
            if (item.image instanceof File) formData.append(`billItemImage_${idx}`, item.image);
          });
        }
      } else if (key === "billImage" && value) {
        if (value instanceof File) {
          formData.append("billImage", value);
        }
      } else if (key === "maxPaymentDuration") {
        formData.append("maxPaymentDuration", JSON.stringify(value));
      } else if (typeof value === "string") {
        formData.append(key, value);
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      }
      // Ignore null/undefined/objects that aren't handled above
    });
    createBillMutation.mutate(formData);
  };
  const handleEdit = (updatedBillData: any) => {
    if (!selectedBillId) return;
    const formData = new FormData();
    Object.entries(updatedBillData).forEach(([key, value]) => {
      if (key === "billItems") {
        if (Array.isArray(value)) {
          formData.append(
            "billItems",
            JSON.stringify(
              value.map((item: any) => {
                const { image, ...rest } = item;
                return rest;
              })
            )
          );
          value.forEach((item: any, idx: number) => {
            if (item.image instanceof File) formData.append(`billItemImage_${idx}`, item.image);
          });
        }
      } else if (key === "billImage" && value) {
        if (value instanceof File) {
          formData.append("billImage", value);
        }
      } else if (key === "maxPaymentDuration") {
        formData.append("maxPaymentDuration", JSON.stringify(value));
      } else if (key === "assignToCustomer" && Array.isArray(value)) {
        value.forEach((customerId: string) => {
          formData.append("assignToCustomer", customerId);
        });
      } else if (typeof value === "string") {
        formData.append(key, value);
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      }
      // Ignore null/undefined/objects that aren't handled above
    });
    updateBillMutation.mutate({ id: selectedBillId, formData });
  };

  // Mutations for create, update, delete
  const createBillMutation = useMutation({
    mutationFn: async (formData: any) => {
      return client.post('/api/bills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      setShowCreateModal(false);
    },
    onError: (error: any) => {
      // Optionally handle error
      // e.g. setError(error?.response?.data?.message || error.message);
    },
  });

  const updateBillMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: any }) => {
      return client.put(`/api/bills/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      setUpdateSuccessMessage("Bill updated successfully!");
      setUpdateSuccessModal(true);
      setTimeout(() => {
        setUpdateSuccessModal(false);
        queryClient.invalidateQueries({ queryKey: ["bills"] });
        setShowViewEditModal(false);
        setSelectedBillId(null);
        setModalType(null);
      }, 2000); // Show modal for 2 seconds before navigating
    },
    onError: (error: any) => {
      // Optionally handle error
    },
  });

  const deleteBillMutation = useMutation({
    mutationFn: async (id: string) => {
      return client.delete(`/api/bills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      setShowViewEditModal(false);
      setSelectedBillId(null);
      setModalType(null);
    },
    onError: (error: any) => {
      // Optionally handle error
    },
  });

  // Table headers
  const headers = [
    "S/N",
    "Bill Name",
    "Bill Code",
    "Promo Code",
    "Unique Code",
    "Platform Percentage",
    "Bill Image",
    "Max Payment Duration",
    "Total Amount",
    "Bill Items",
    "Actions",
  ];

  // Pagination and search
  const filteredBills = billsResponse?.data?.length
    ? billsResponse.data.filter((bill: Bill) =>
        bill.billName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.billCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * billsPerPage,
    currentPage * billsPerPage
  );
  const totalPages = Math.ceil(filteredBills.length / billsPerPage) || 1;

  // Modal openers
  const openBillModal = (id: string, type: 'view' | 'edit') => {
    setSelectedBillId(id);
    setModalType(type);
    setShowViewEditModal(true);
  };
  const openDeleteConfirmModal = (id: string) => {
    setSelectedBillId(id);
    setModalType('delete-confirm');
    setShowViewEditModal(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-2 md:px-6 md:py-8 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-ajo_offWhite">Bills</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowCreateModal(true)}
        >
          Create Bill
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search bills by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[27%] rounded-2xl border px-3 py-2 text-black"
        />
      </div>
      <TransactionsTable
        headers={headers}
        content={paginatedBills.map((bill: Bill, idx: number) => (
          <tr key={bill._id}>
            <td className="px-4">{(currentPage - 1) * billsPerPage + idx + 1}</td>
            <td className="px-4">{bill.billName}</td>
            <td className="px-4">{bill.billCode}</td>
            <td className="px-4">{bill.promoCode}</td>
            <td className="px-4">{bill.customUniqueCode}</td>
            <td className="px-4">{platformChargeData?.data?.percentage || '--'}</td>
            <td className="px-4">{bill.billImage ? "Yes" : "No"}</td>
            <td className="px-4"><button className="text-blue-600 underline" onClick={() => { setSelectedBillId(bill._id); setShowPaymentModal(true); }}>View </button></td>
            <td className="px-4">{bill.totalAmount}</td>
            <td className="px-4"><button className="text-blue-600 underline" onClick={() => { setSelectedBillId(bill._id); setShowBillItemsModal(true); }}>View</button></td>
            <td className="px-4">
              <div className="relative">
                <button
                  className="bg-[#2d254c] text-white px-4 py-2 rounded font-semibold flex items-center gap-2 focus:outline-none"
                  onClick={() => setActionDropdownOpen(bill._id)}
                >
                  Actions <span className="ml-1">▼</span>
                </button>
                {actionDropdownOpen === bill._id && (
                  <div className="absolute z-10 mt-2 w-40 bg-[#221c3e] rounded shadow-lg text-white">
                    <button className="block w-full text-left px-4 py-2 hover:bg-[#3b2f73]" onClick={() => { openBillModal(String(bill._id), 'view'); setActionDropdownOpen(null); }}>View Bill</button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-[#3b2f73]" onClick={() => { openBillModal(String(bill._id), 'edit'); setActionDropdownOpen(null); }}>Edit Bill</button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-[#3b2f73]" onClick={() => { openDeleteConfirmModal(String(bill._id)); setActionDropdownOpen(null); }}>Delete Bill</button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      />
      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-white border rounded disabled:opacity-50">Prev</button>
        <span className="text-white">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-white border rounded disabled:opacity-50">Next</button>
      </div>
      {/* Create Modal */}
      {showCreateModal && (
        <Modal title="Create Bill" setModalState={setShowCreateModal}>
          <BillCreationForm organizationId={organizationId} onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ["bills"] });
          }} />
        </Modal>
      )}
      {/* View/Edit/Delete Modal */}
      {showViewEditModal && modalType === 'view' && singleBill && (
        <Modal title="View Bill" setModalState={setShowViewEditModal}>
          <div className="space-y-4 text-white">
            <div className="px-4"><strong>Bill Name:</strong> {singleBill.billName}</div>
            <div className="px-4"><strong>Bill Code:</strong> {singleBill.billCode}</div>
            <div className="px-4"><strong>Promo Code:</strong> {singleBill.promoCode}</div>
            <div className="px-4"><strong>Unique Code:</strong> {singleBill.customUniqueCode}</div>
            <div className="px-4">
               <strong>Special Note:</strong> {singleBill.specialNotes || 'N/A'}
                  </div>
            <div className="px-4"><strong>Bill Image:</strong> {singleBill.billImage ? (<img src={singleBill.billImage} alt="Bill" className="h-24 w-24 object-cover rounded" />) : 'No Image'}</div>
            <div className="px-4"><strong>Max Payment Duration:</strong> <button className="text-blue-600 underline" onClick={() => setShowPaymentModal(true)}>View Payment</button></div>
            <div className="px-4"><strong>Total Amount:</strong> {singleBill.totalAmount}</div>
            <div className="px-4">
              <strong>Bill Items:</strong> <button className="ml-2 text-blue-600 underline" onClick={() => setShowBillItemsModal(true)}>View Bill Items</button>
            </div>
          </div>
        </Modal>
      )}
      {showViewEditModal && modalType === 'edit' && singleBill && (
        <Modal title="Edit Bill" setModalState={setShowViewEditModal}>
          <EditBillForm
            initialData={{
              billName: singleBill.billName || '',
              billCode: singleBill.billCode || '',
              startDate: singleBill.startDate ? singleBill.startDate.slice(0, 10) : '',
              endDate: singleBill.endDate ? singleBill.endDate.slice(0, 10) : '',
              startTime: singleBill.startTime || '',
              endTime: singleBill.endTime || '',
              promoCode: singleBill.promoCode || '',
              promoPercentage: singleBill.promoPercentage || 0,
              billImage: null,
              billImageUrl: singleBill.billImage || '',
              customUniqueCode: singleBill.customUniqueCode || '',
              platformServiceCharge: singleBill.platformServiceCharge || 0,
              maxPaymentDuration: {
                startDate: singleBill.maxPaymentDuration?.startDate ? singleBill.maxPaymentDuration.startDate.slice(0, 10) : '',
                endDate: singleBill.maxPaymentDuration?.endDate ? singleBill.maxPaymentDuration.endDate.slice(0, 10) : '',
                startTime: singleBill.maxPaymentDuration?.startTime || '',
                endTime: singleBill.maxPaymentDuration?.endTime || '',
              },
              billItems: (singleBill.billItems || []).map((item: any) => ({
                ...item,
                promoCode: typeof item.promoCode === 'string' || item.promoCode == null
                  ? {
                      code: item.promoCode || null,
                      promoPercentage: item.promoPercentage ?? 0,
                      startDate: item.startDate ? item.startDate.slice(0, 10) : null,
                      endDate: item.endDate ? item.endDate.slice(0, 10) : null,
                      startTime: item.startTime ?? null,
                      endTime: item.endTime ?? null,
                    }
                  : {
                      ...item.promoCode,
                      startDate: item.promoCode.startDate ? item.promoCode.startDate.slice(0, 10) : null,
                      endDate: item.promoCode.endDate ? item.promoCode.endDate.slice(0, 10) : null,
                    },
              })),
              organisation: singleBill.organisation?._id || singleBill.organisationId || '',
              assignToCustomer: singleBill.assignToCustomer || [], // <-- prefill assigned customers
              customerGroupId: singleBill.assignToCustomerGroup?._id || singleBill.customerGroupId || '',
              // Add any other fields as needed
            }}
            onSubmit={handleEdit}
            onCancel={() => setShowViewEditModal(false)}
          />
        </Modal>
      )}
      {showViewEditModal && modalType === 'delete-confirm' && (
        <Modal title="Delete Bill" setModalState={setShowViewEditModal}>
          <div className="flex flex-col items-center justify-center text-white p-4">
            <div className="mb-4">Are you sure you want to delete this bill?</div>
            <button className="bg-red-600 text-white px-4 py-2 rounded mt-4" onClick={() => selectedBillId && deleteBillMutation.mutate(selectedBillId)}>Delete</button>
          </div>
        </Modal>
      )}
      {/* Bill Items Modal */}
     {showBillItemsModal && singleBill && (
  <Modal title="Bill Items" setModalState={setShowBillItemsModal}>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-white border-separate border-spacing-y-2">
        <thead className="bg-transparent border-b border-gray-600">
          <tr>
            <th className="px-6 py-3">Bill Name</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Quantity</th>
            <th className="px-6 py-3">Platform %</th>
            <th className="px-6 py-3">Platform Value</th>
            <th className="px-6 py-3">Actual Debit</th>
            <th className="px-6 py-3">Promo Code</th>
            <th className="px-6 py-3">Promo %</th>
            <th className="px-6 py-3">Promo Period</th>
          </tr>
        </thead>
        <tbody>
          {(singleBill.billItems || []).map((item: any, idx: number) => {
            const normalizedPromoCode = typeof item.promoCode === 'string' || item.promoCode == null
              ? {
                  code: item.promoCode || null,
                  promoPercentage: item.promoPercentage ?? 0,
                  startDate: item.startDate ?? null,
                  endDate: item.endDate ?? null,
                  startTime: item.startTime ?? null,
                  endTime: item.endTime ?? null,
                }
              : item.promoCode;
            const percentage = platformChargeData?.data?.percentage || 0;
            const amount = Number(item.amount) || 0;
            const platformValue = ((percentage / 100) * amount);
            const actualDebit = amount + platformValue;
            return (
              <tr key={idx} className="bg-[#0d0f29] border-b border-gray-700">
                <td className="px-6 py-2 whitespace-nowrap">{item.billName}</td>
                <td className="px-6 py-2 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-2 whitespace-nowrap">{amount}</td>
                <td className="px-6 py-2 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-2 whitespace-nowrap">{percentage}%</td>
                <td className="px-6 py-2 whitespace-nowrap">{platformValue.toFixed(2)}</td>
                <td className="px-6 py-2 whitespace-nowrap">{actualDebit.toFixed(2)}</td>
                <td className="px-6 py-2 whitespace-nowrap">{normalizedPromoCode.code || '-'}</td>
                <td className="px-6 py-2 whitespace-nowrap">{normalizedPromoCode.promoPercentage || 0}</td>
                <td className="px-6 py-2 whitespace-nowrap">{normalizedPromoCode.startDate && normalizedPromoCode.endDate ? `${normalizedPromoCode.startDate} to ${normalizedPromoCode.endDate}` : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Modal>
)}

      {showPaymentModal && singleBill && (
        <Modal title="Max Payment Duration" setModalState={setShowPaymentModal}>
          <div className="space-y-2 px-4 text-white">
            <div><strong>Start Date:</strong> {singleBill.maxPaymentDuration?.startDate}</div>
            <div><strong>Start Time:</strong> {singleBill.maxPaymentDuration?.startTime}</div>
            <div><strong>End Date:</strong> {singleBill.maxPaymentDuration?.endDate}</div>
            <div><strong>End Time:</strong> {singleBill.maxPaymentDuration?.endTime}</div>
          </div>
        </Modal>
      )}
      {updateSuccessModal && (
        <Modal title="Success" setModalState={setUpdateSuccessModal}>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-800">Success!</h2>
            <p className="text-gray-600 mb-4">{updateSuccessMessage}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Create; 
"use client";

import React, { useState, useEffect } from "react";
import TransactionsTable from "@/components/Tables";
import Modal from "@/components/Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BillCreationForm from "@/modules/form/BillCreattion";
import { useAuth } from "@/api/hooks/useAuth";

// Bill type based on your API
export interface Bill {
  _id: string;
  billName: string;
  billCode: string;
  totalAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewEditModal, setShowViewEditModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete-confirm' | null>(null);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 10;
  const [billForm, setBillForm] = useState<any>(initialBillForm);
  const [editMode, setEditMode] = useState(false);

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


  // Prefill form for edit
  useEffect(() => {
    if (modalType === 'edit' && singleBill) {
      setBillForm({
        ...singleBill,
        billItems: singleBill.billItems?.length ? singleBill.billItems.map((item: any) => ({ ...item, image: null })) : [{ billName: "", category: "", amount: "", quantity: "", amountWithoutCharge: "", image: null }],
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
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBillId) return;
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
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      setShowViewEditModal(false);
      setSelectedBillId(null);
      setModalType(null);
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
    "Total Amount",
    "Status",
    "Start Date",
    "End Date",
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
            <td>{(currentPage - 1) * billsPerPage + idx + 1}</td>
            <td>{bill.billName}</td>
            <td>{bill.billCode}</td>
            <td>{bill.totalAmount}</td>
            <td>{bill.status}</td>
            <td>{bill.startDate?.slice(0, 10)}</td>
            <td>{bill.endDate?.slice(0, 10)}</td>
            <td>
              <button className="text-blue-600 mr-2" onClick={() => openBillModal(String(bill._id), 'view')}>View</button>
              <button className="text-yellow-600 mr-2" onClick={() => openBillModal(String(bill._id), 'edit')}>Edit</button>
              <button className="text-red-600" onClick={() => openDeleteConfirmModal(String(bill._id))}>Delete</button>
            </td>
          </tr>
        ))}
      />
      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
      {/* Create Modal */}
      {showCreateModal && (
        <Modal title="Create Bill" setModalState={setShowCreateModal}>
          <BillCreationForm organizationId="YOUR_ORG_ID_HERE" />
        </Modal>
      )}
      {/* View/Edit/Delete Modal */}
      {showViewEditModal && modalType === 'view' && singleBill && (
        <Modal title="View Bill" setModalState={setShowViewEditModal}>
          <pre>{JSON.stringify(singleBill, null, 2)}</pre>
        </Modal>
      )}
      {showViewEditModal && modalType === 'edit' && singleBill && (
        <Modal title="Edit Bill" setModalState={setShowViewEditModal}>
          <div>Edit bill form for ID: {selectedBillId}</div>
        </Modal>
      )}
      {showViewEditModal && modalType === 'delete-confirm' && (
        <Modal title="Delete Bill" setModalState={setShowViewEditModal}>
          <div>Are you sure you want to delete this bill?</div>
          <button className="bg-red-600 text-white px-4 py-2 rounded mt-4" onClick={() => selectedBillId && deleteBillMutation.mutate(selectedBillId)}>Delete</button>
        </Modal>
      )}
    </div>
  );
};

export default Create; 
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Trash2, Calendar, DollarSign, ChevronRight, ChevronLeft, Upload, User, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';
import { nanoid } from 'nanoid';

interface BillItem {
  id?: number;
  _id?: string;
  billName: string;
  category: string;
  isMandatory: boolean;
  amount: number;
  amountWithoutCharge: number;
  quantity: number;
  image: string | File | null | undefined;
  promoCode: {
    code: string | null;
    promoPercentage: number;
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
  } | null;
}

interface BillDetails {
  billName: string;
  billCode: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  promoCode: string;
   specialNote?: string;
  promoPercentage: number;
  billImage: File | null;
  billImageUrl?: string | null;
  customUniqueCode: string;
  platformServiceCharge: number;
  maxPaymentDuration: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  };
  billItems: BillItem[];
  [key: string]: any;
}

interface Category {
  id: string;
  name: string;
}

interface EditBillFormProps {
  initialData: BillDetails;
  onSubmit: (data: BillDetails) => void;
  onCancel: () => void;
}

const EditBillForm: React.FC<EditBillFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { client } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [billDetails, setBillDetails] = useState<BillDetails>(initialData);
  const [billItems, setBillItems] = useState<BillItem[]>(initialData.billItems || []);
  const [formError, setFormError] = useState<string | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  const customerSearchRef = React.useRef<HTMLDivElement>(null);
   const generatePromoCode = () => nanoid(8).toUpperCase();
  useEffect(() => {
    setBillDetails(initialData);
    setBillItems(initialData.billItems || []);
    // This correctly resets the selected customers when the initialData prop changes.
    if (initialData.assignToCustomer && Array.isArray(initialData.assignToCustomer)) {
      setSelectedCustomers(initialData.assignToCustomer);
    } else {
      setSelectedCustomers([]);
    }
  }, [initialData]);

  // Fetch platform charge percentage from API
  const { data: platformChargeData, isLoading: isLoadingPlatformCharge } = useQuery({
    queryKey: ['platform-charge'],
    queryFn: async () => {
      const res = await client.get('/api/bill-charge');
      return res.data;
    },
  });

  // Fetch groups for the customer group dropdown
  const { data: groupsData, isLoading: isGroupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await client.get('/api/groups');
      return res.data.data;
    },
  });

  const organisationId = initialData.organisation || billDetails.organisation;
  const { data: customerOrganisation, isLoading: isLoadingCustomerOrganisation } = useQuery({
    queryKey: ["organisation", organisationId],
    queryFn: async () => {
      if (!organisationId) return [];
      return client
        .get(
          `/api/user?role=customer&organisation=${organisationId}&userType=individual`,
          {},
        )
        .then((response) => {
          if (Array.isArray(response.data)) return response.data;
          if (Array.isArray(response.data.data)) return response.data.data;
          return [];
        })
        .catch((error: any) => {
          console.error('Error loading customers:', error);
          throw error;
        });
    },
    enabled: !!organisationId,
    staleTime: 5000,
  });

  // This effect "hydrates" the customer data. `initialData` might have partial
  // customer info (e.g., just ID). This merges it with the full customer
  // details fetched from the API.
  useEffect(() => {
    if (billDetails.assignToCustomer && Array.isArray(billDetails.assignToCustomer) && customerOrganisation) {
      const assigned = billDetails.assignToCustomer.map((customerOrId: any) => {
        const id = typeof customerOrId === 'object' && customerOrId !== null ? customerOrId._id : customerOrId;
        const found = customerOrganisation.find((c: any) => c._id === id);
        return found || customerOrId; // Fallback to original if not found
      });
      setSelectedCustomers(assigned);
    }
  }, [customerOrganisation, billDetails.assignToCustomer]);

  // Add a useEffect for group pre-population (optional, for completeness)
  useEffect(() => {
    if (groupsData && billDetails.customerGroupId) {
      // No need to set a separate state, as the select uses billDetails.customerGroupId directly
      // But you could add logic here if you want to display the group name elsewhere
    }
  }, [groupsData, billDetails.customerGroupId]);

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['bill-categories'],
    queryFn: async () => {
      const res = await client.get('/api/bill-categories');
      return res.data.data;
    },
  });

  // Handle customer selection
  const handleCustomerSelect = (customer: any) => {
    const isAlreadySelected = selectedCustomers.some((c) => c._id === customer._id);
    let updatedCustomers;
    if (isAlreadySelected) {
      updatedCustomers = selectedCustomers.filter((c) => c._id !== customer._id);
    } else {
      updatedCustomers = [...selectedCustomers, customer];
    }
    setSelectedCustomers(updatedCustomers);
    setBillDetails((prev) => ({
      ...prev,
      assignToCustomer: updatedCustomers, // keep as array of objects
      assignedCustomers: updatedCustomers, // keep as array of objects
    }));
    setCustomerSearchTerm("");
    setShowCustomerDropdown(false);
  };

  const removeSelectedCustomer = (customerId: string) => {
    const updatedCustomers = selectedCustomers.filter((c) => c._id !== customerId);
    setSelectedCustomers(updatedCustomers);
    setBillDetails((prev) => ({
      ...prev,
      assignToCustomer: updatedCustomers, // keep as array of objects
      assignedCustomers: updatedCustomers, // keep as array of objects
    }));
  };

  // Handlers for bill details
  const handleBillDetailsChange = (field: keyof BillDetails, value: any) => {
    setBillDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handlers for bill items
  const handleItemChange = (idx: number, field: keyof BillItem, value: any) => {
    setBillItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addBillItem = () => {
    setBillItems(prev => [...prev, { billName: '', category: '', isMandatory: false, amount: 0, amountWithoutCharge: 0, quantity: 1, image: null, promoCode: null }]);
  };

  const removeBillItem = (idx: number) => {
    if (billItems.length > 1) {
      setBillItems(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBillDetails(prev => ({ ...prev, billImage: file, billImageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleMaxPaymentChange = (field: keyof BillDetails['maxPaymentDuration'], value: string) => {
    setBillDetails(prev => ({
      ...prev,
      maxPaymentDuration: { ...prev.maxPaymentDuration, [field]: value },
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!billDetails.billName) {
      setFormError('Bill Name is required.');
      return;
    }
    if (!billDetails.billCode) {
      setFormError('Bill Code is required.');
      return;
    }
    // New validation: Must assign to at least a customer or a group
    if (!billDetails.customerGroupId && (!selectedCustomers || selectedCustomers.length === 0)) {
      setFormError('You must assign this bill to at least one customer or a group.');
      return;
    }
    setFormError(null);
    onSubmit({
      ...billDetails,
      assignToCustomer: selectedCustomers.map((c) => c._id), // convert to IDs for backend
      assignedCustomers: selectedCustomers.map((c) => c._id),
      billItems,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
            <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bill Name <span className='text-red-500'>*</span></label>
                  <input type="text" value={billDetails.billName} onChange={e => handleBillDetailsChange('billName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter bill name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bill Code <span className='text-red-500'>*</span></label>
                  <input type="text" value={billDetails.billCode} onChange={e => handleBillDetailsChange('billCode', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter bill code" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Calendar size={16} />Start Date <span className='text-red-500'>*</span></label>
                  <input type="date" value={billDetails.startDate} onChange={e => handleBillDetailsChange('startDate', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date <span className='text-red-500'>*</span></label>
                  <input type="date" value={billDetails.endDate} onChange={e => handleBillDetailsChange('endDate', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Group <span className='text-red-500'>*</span>
              </label>
              <select
                value={billDetails.customerGroupId || ''}
                onChange={e => handleBillDetailsChange('customerGroupId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select customer group</option>
                {groupsData?.map((group: any) => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User size={16} />
                Assign to Customers (Multiple Selection)
              </label>
              <div className="relative" ref={customerSearchRef}>
                <div
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white"
                  onClick={() => setShowCustomerDropdown((prev) => !prev)}
                >
                  {selectedCustomers.length === 0
                    ? "Select customers..."
                    : selectedCustomers.map((c) =>
                        (c.firstName || c.lastName)
                          ? `${c.firstName || ""} ${c.lastName || ""}`.trim()
                          : c.accountNumber
                            ? c.accountNumber
                            : c.email
                              ? c.email
                              : c._id
                      ).join(", ")
                  }
                </div>
                {showCustomerDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={customerSearchTerm}
                        onChange={e => setCustomerSearchTerm(e.target.value)}
                        placeholder="Search customers..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    {customerOrganisation?.length > 0 ? (
                      customerOrganisation
                        .filter((customer: any) => {
                          if (!customerSearchTerm.trim()) return true;
                          const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
                          const email = customer.email.toLowerCase();
                          const customerId = customer._id.toLowerCase();
                          const searchLower = customerSearchTerm.toLowerCase();
                          return (
                            fullName.includes(searchLower) ||
                            email.includes(searchLower) ||
                            customerId.includes(searchLower)
                          );
                        })
                        .map((customer: any) => {
                          const isSelected = selectedCustomers.some((c) => c._id === customer._id);
                          return (
                            <div
                              key={customer._id}
                              onClick={() => handleCustomerSelect(customer)}
                              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                isSelected ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="font-medium text-gray-900">
                                {customer.firstName} {customer.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Account Number: {customer.accountNumber} | Email: {customer.email}
                              </div>
                              {isSelected && <span className="text-blue-600 ml-2">✓ Selected</span>}
                            </div>
                          );
                        })
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        {isLoadingCustomerOrganisation ? 'Loading customers...' : 'No customers available'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Selected Customers Display */}
              {selectedCustomers.length > 0 && (
                <div className="space-y-2 mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Selected Customers ({selectedCustomers.length}):
                  </label>
                  <div className="space-y-2">
                    {selectedCustomers.map((customer) => (
                      <div
                        key={customer._id}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {(customer.firstName || customer.lastName)
                              ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                              : customer.accountNumber
                                ? customer.accountNumber
                                : customer.email
                                  ? customer.email
                                  : customer._id
                            }
                          </div>
                          <div className="text-sm text-gray-600">
                            Account Number: {customer.accountNumber || "N/A"} | Email: {customer.email || "Unknown"}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSelectedCustomer(customer._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6"><DollarSign className="text-green-600" size={20} />Bill Items</h2>
            <div className="space-y-4">
              {billItems.map((item, idx) => (
                <div key={item._id || idx} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-800">Bill Item {idx + 1}</h3>
                    {billItems.length > 1 && (
                      <button type="button" onClick={() => removeBillItem(idx)} className="text-red-600 hover:text-red-800 p-1"><Trash2 size={16} /></button>
                    )}
                  </div>
                  <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bill Name <span className='text-red-500'>*</span></label>
                        <input type="text" value={item.billName} onChange={e => handleItemChange(idx, 'billName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter item name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select value={item.category} onChange={e => handleItemChange(idx, 'category', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option value="">Select category</option>
                          {categoriesData?.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Is Mandatory</label>
                        <input type="checkbox" checked={item.isMandatory} onChange={e => handleItemChange(idx, 'isMandatory', e.target.checked)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Debit Amount</label>
                        <input type="number" min="0" step="0.01" value={item.amount} onChange={e => handleItemChange(idx, 'amount', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter total amount" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      {/* Platform charge fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform charge (%)</label>
                        <input
                          type="number"
                          value={platformChargeData?.data?.percentage || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                        {isLoadingPlatformCharge && <span className="text-xs text-gray-400">Loading platform charge...</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform charge value</label>
                        <input
                          type="number"
                          value={
                            platformChargeData?.data?.percentage
                              ? ((platformChargeData.data.percentage / 100) * item.amount).toFixed(2)
                              : ''
                          }
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Actual debit amount</label>
                        <input
                          type="number"
                          value={
                            platformChargeData?.data?.percentage
                              ? (item.amount + (platformChargeData.data.percentage / 100) * item.amount).toFixed(2)
                              : item.amount
                          }
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      {/* Promo Code */}
                       <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Promo Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={item.promoCode?.code || ''}
          onChange={e => handleItemChange(idx, 'promoCode', { ...item.promoCode, code: e.target.value })}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter promo code"
        />
        <button
          type="button"
          onClick={() => handleItemChange(idx, 'promoCode', { ...item.promoCode, code: generatePromoCode() })}
          className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors whitespace-nowrap"
        >
          Generate
        </button>
      </div>
    </div>
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                        <input type="text" value={item.promoCode?.code || ''} onChange={e => handleItemChange(idx, 'promoCode', { ...item.promoCode, code: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter promo code" />
                      </div> */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Percentage (%)</label>
                        <input type="number" min="0" max="100" value={item.promoCode?.promoPercentage || ''} onChange={e => handleItemChange(idx, 'promoCode', { ...item.promoCode, promoPercentage: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Start Date</label>
                        <input type="date" value={item.promoCode?.startDate || ''} onChange={e => handleItemChange(idx, 'promoCode', { ...item.promoCode, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo End Date</label>
                        <input type="date" value={item.promoCode?.endDate || ''} onChange={e => handleItemChange(idx, 'promoCode', { ...item.promoCode, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Start Time</label>
                        <input type="time" value={item.promoCode?.startTime || ''} onChange={e => handleItemChange(idx, 'promoCode', { ...item.promoCode, startTime: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo End Time</label>
                        <input type="time" value={item.promoCode?.endTime || ''} onChange={e => handleItemChange(idx, 'promoCode', { ...item.promoCode, endTime: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addBillItem} className="flex items-center gap-2 px-4 py-2 bg-[#221c3e] text-white rounded-lg hover:bg-[#3b2f73] transition-colors mt-4"><Plus size={16} />Add Bill Item</button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Settings</h2>
            <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Promo Code
    </label>
    <div className="flex gap-2">
      <input
        type="text"
        value={billDetails.promoCode}
        onChange={e => handleBillDetailsChange('promoCode', e.target.value)}
        className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter promo code"
      />
      <button
        type="button"
        onClick={() => handleBillDetailsChange('promoCode', generatePromoCode())}
        className="px-4 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors whitespace-nowrap"
      >
        Generate
      </button>
    </div>
  </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <input type="text" value={billDetails.promoCode} onChange={e => handleBillDetailsChange('promoCode', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter promo code" />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Unique Code</label>
                  <input type="text" value={billDetails.customUniqueCode} onChange={e => handleBillDetailsChange('customUniqueCode', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter unique code" />
                </div>
                 {/* Add this after the customer assignment section */}
<div className="sm:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Special Note
  </label>
  <textarea
    value={billDetails.specialNote || ''}
    onChange={e => handleBillDetailsChange('specialNote', e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Enter any special note for this bill"
    rows={3}
  />
</div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Percentage (%)</label>
                  <input type="number" min="0" max="100" value={billDetails.promoPercentage} onChange={e => handleBillDetailsChange('promoPercentage', parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload-edit" />
                    <label htmlFor="image-upload-edit" className="cursor-pointer"><Upload className="mx-auto h-12 w-12 text-gray-400" /><p className="mt-2 text-sm text-gray-600">Click to upload an image</p></label>
                    {billDetails.billImageUrl && (<div className="mt-4"><img src={billDetails.billImageUrl} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" /></div>)}
                  </div>
                </div>
               
                {/* Maximum payment Duration */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2">Maximum payment Duration</h4>
                  <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="date" value={billDetails.maxPaymentDuration?.startDate || ''} onChange={e => handleMaxPaymentChange('startDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input type="time" value={billDetails.maxPaymentDuration?.startTime || ''} onChange={e => handleMaxPaymentChange('startTime', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="date" value={billDetails.maxPaymentDuration?.endDate || ''} onChange={e => handleMaxPaymentChange('endDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input type="time" value={billDetails.maxPaymentDuration?.endTime || ''} onChange={e => handleMaxPaymentChange('endTime', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">Edit Bill</h1>
            <p className="text-gray-600">Edit the details of your bill</p>
          </div>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
            </div>
          </div>
          {/* Error */}
          {formError && <div className="mb-4 text-red-600 font-semibold bg-red-100 p-2 rounded">{formError}</div>}
          {/* Step Content */}
          <div className="mb-8">{renderStepContent()}</div>
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button type="button" onClick={prevStep} disabled={currentStep === 1} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors text-white ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}><ChevronLeft size={20} />Previous</button>
            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-3 bg-[#221c3e] text-white rounded-lg font-medium hover:bg-[#3b2f73] transition-colors">Next<ChevronRight size={20} /></button>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={onCancel} className="px-8 py-3 bg-gray-400 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">Update Bill</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditBillForm; 
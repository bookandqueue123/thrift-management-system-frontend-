"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Plus, Trash2, Calendar, User, Users, FileText, DollarSign, ChevronRight, ChevronLeft, Upload, Search, X } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';
import { nanoid } from 'nanoid';

interface BillItem {
  id: number;
  purposeName: string;
  category: string;
  amount: number;
  amountWithoutCharge: number;
  quantity: number;
  isMandatory: boolean;
  customPromoCode?: string;
}

interface BillDetails {
  id: number;
  name: string;
  code: string;
  customerGroupId: string;
  startDate: string;
  startTime: string;
  endTime: string;
  endDate: string;
  promoCode: string;
  customPromoCode: string; // <-- Add this line
  promoPercentage: number;
  billImage: File | null;
  billImageUrl: string | null;
  visibility: string;
  visibilityStartDate: string;
  visibilityStartTime: string;
  visibilityEndDate: string;
  visibilityEndTime: string;
  selectorAll: string;
  selectorCategory: string;
  assignToCustomer: string[]; // Now an array
  assignedCustomers: string[];
  organisation: string;
  referralBonusValue: string;
  customUniqueCode: string;
  platformServiceCharge: number;
}

interface Category {
  id: string;
  _id?: string;
  name: string;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountNumber: string;
}

const generatePromoCode = () => nanoid(8).toUpperCase();

const BillCreationForm = ({ organizationId }: { organizationId: string }) => {
  const { client } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // State for modal/status management
  const [userCreated, setUserCreated] = useState(false);
  const [modalContent, setModalContent] = useState("form");
  const [mutationResponse, setMutationResponse] = useState("");
  const [closeModal, setCloseModal] = useState(true);

  // Customer search and selection state
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const customerSearchRef = useRef<HTMLDivElement>(null);

  // Bill Details
  const [billDetails, setBillDetails] = useState<BillDetails>({
    id: 1,
    name: "",
    code: "",
    customerGroupId: "",
    startDate: "",
    startTime: "",
    endTime: "",
    endDate: "",
    promoCode: "",
    customPromoCode: "", // <-- Add this line
    promoPercentage: 0,
    billImage: null,
    billImageUrl: null,
    visibility: "inhouse",
    visibilityStartDate: "",
    visibilityStartTime: "",
    visibilityEndDate: "",
    visibilityEndTime: "",
    selectorAll: "selectorAllOptional",
    selectorCategory: "selectorCategoryOptional",
    assignToCustomer: [], // Now an array
    assignedCustomers: [],
    organisation: organizationId,
    referralBonusValue: "",
    customUniqueCode: "",
    platformServiceCharge: 0
  });

  // Bill Items
  const [billItems, setBillItems] = useState<BillItem[]>([{
    id: 1,
    purposeName: "",
    category: "",
    amount: 0,
    amountWithoutCharge: 0,
    quantity: 1,
    isMandatory: false,
    customPromoCode: "",
  }]);

  
 
   const { data: categoriesData, isLoading } = useQuery<Category[]>({
  queryKey: ['bill-categories'],
  queryFn: async () => {
    const res = await client.get('/api/bill-categories');
     console.log('API Response:', res.data);
    return res.data.data;
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

  // Fetch customer organization data
const { data: customerOrganisation, isLoading: isLoadingCustomerOrganisation } = useQuery({
  queryKey: ["organisation"],
  queryFn: async () => {
    return client
      .get(
        `/api/user?role=customer&organisation=${organizationId}&userType=individual`,
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
  staleTime: 5000,
});


const { data: platformChargeData, isLoading: isLoadingPlatformCharge } = useQuery({
  queryKey: ['platform-charge'],
  queryFn: async () => {
    const res = await client.get('/api/bill-charge');
    return res.data;
  },
});

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerSearchRef.current && !customerSearchRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm);
    
    if (!customerOrganisation || !searchTerm.trim()) {
      setFilteredCustomers([]);
      setShowCustomerDropdown(false);
      return;
    }

    console.log('Searching customers:', { searchTerm, customerOrganisation });

    const filtered = customerOrganisation.filter((customer: Customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const email = customer.email.toLowerCase();
      const customerId = customer._id.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      const matches = (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        customerId.includes(searchLower)
      );

      console.log('Customer match check:', { 
        customer: `${customer.firstName} ${customer.lastName}`,
        fullName,
        email,
        customerId,
        searchLower,
        matches
      });

      return matches;
    });

    console.log('Filtered customers:', filtered);
    setFilteredCustomers(filtered);
    setShowCustomerDropdown(filtered.length > 0);
  };

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer) => {
    console.log('Customer selected:', customer);
    
    const isAlreadySelected = selectedCustomers.some(c => c._id === customer._id);
    console.log('Is already selected:', isAlreadySelected);
    
    if (isAlreadySelected) {
      setSelectedCustomers(prev => prev.filter(c => c._id !== customer._id));
    } else {
      setSelectedCustomers(prev => [...prev, customer]);
    }
    
    // Update billDetails assignedCustomers
    const customerIds = isAlreadySelected 
      ? selectedCustomers.filter(c => c._id !== customer._id).map(c => c._id)
      : [...selectedCustomers, customer].map(c => c._id);
    
    console.log('Updated customer IDs:', customerIds);
    
    setBillDetails(prev => ({
      ...prev,
      assignedCustomers: customerIds,
      assignToCustomer: customerIds, // Keep in sync
    }));
    
    setCustomerSearchTerm("");
    setShowCustomerDropdown(false);
  };

  // Remove selected customer
  const removeSelectedCustomer = (customerId: string) => {
    setSelectedCustomers(prev => prev.filter(c => c._id !== customerId));
    setBillDetails(prev => ({
      ...prev,
      assignedCustomers: prev.assignedCustomers.filter(id => id !== customerId),
      assignToCustomer: prev.assignToCustomer.filter(id => id !== customerId),
    }));
  };

  // React Query mutation
  const { mutate: createBill, isPending: isCreatingBill } = useMutation({
    mutationFn: async (values: any) => {
      const formData = new FormData();
      
      // Bill Details
      formData.append("billName", values.name);
      formData.append("billCode", values.code);
      formData.append("organisation", organizationId);
      formData.append("assignToCustomerGroup", values.customerGroupId);
      formData.append("startDate", values.startDate);
      formData.append("startTime", values.startTime);
      formData.append("endDate", values.endDate);
      formData.append("endTime", values.endTime);
      formData.append("promoCode", values.promoCode);
      formData.append("customUniqueCode", values.customUniqueCode);
      formData.append("platformServiceCharge", values.platformServiceCharge.toString());
      formData.append("promoPercentage", values.promoPercentage.toString());
      formData.append("visibility", values.visibility);
      formData.append("visibilityStartDate", values.visibilityStartDate);
      formData.append("visibilityStartTime", values.visibilityStartTime);
      formData.append("visibilityEndDate", values.visibilityEndDate);
      formData.append("visibilityEndTime", values.visibilityEndTime);
      formData.append("SelectorAll", values.selectorAll);
      formData.append("selectorCategory", values.selectorCategory);
      formData.append("referralBonusValue", values.referralBonusValue);

      // Handle assigned customers
      if (Array.isArray(values.assignToCustomer)) {
        values.assignToCustomer.forEach((customerId: string) => {
          formData.append("assignToCustomer[]", customerId);
        });
      }

      // Handle image upload
      if (values.billImage) {
        formData.append("billImage", values.billImage);
      }

      // Bill Items - send as JSON string
      const billItemsData = billItems.map(({ id, category, isMandatory, ...rest }) => {
        console.log('Processing bill item:', { category, categoriesData });
        const selectedCategory = categoriesData?.find(cat => cat.id === category || cat._id === category);
        console.log('Category lookup result:', { 
          category, 
          categoriesData: categoriesData?.map(c => ({ id: c.id, _id: c._id, name: c.name })),
          selectedCategory: selectedCategory ? { id: selectedCategory.id, _id: selectedCategory._id, name: selectedCategory.name } : null
        });
        return {
          billName: rest.purposeName,
          category, // ID
          name: selectedCategory ? selectedCategory.name : "",
          amount: rest.amount,
          amountWithoutCharge: rest.amountWithoutCharge,
          quantity: rest.quantity,
          isMandatory,
        };
      });
      formData.append("billItems", JSON.stringify(billItemsData));

      // Max Payment Duration
      const maxPaymentDuration = {
        startDate: values.startDate,
        endDate: values.endDate,
        startTime: values.startTime,
        endTime: values.endTime
      };
      formData.append("maxPaymentDuration", JSON.stringify(maxPaymentDuration));

      return client.post('/api/bills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess(response) {
      setUserCreated(true);
      setModalContent("status");
      setMutationResponse(response?.data.message || "Bill created successfully!");
      setBillDetails({
        id: 1,
        name: "",
        code: "",
        customerGroupId: "",
        startDate: "",
        endDate: "",
        promoCode: "",
        customPromoCode: "",
        startTime: '',
        endTime: '',
        promoPercentage: 0,
        billImage: null,
        billImageUrl: null,
        visibility: "inhouse",
        visibilityStartDate: "",
        visibilityStartTime: "",
        visibilityEndDate: "",
        visibilityEndTime: "",
        selectorAll: "selectorAllOptional",
        selectorCategory: "selectorCategoryOptional",
        assignToCustomer: [],
        assignedCustomers: [],
        organisation: organizationId,
        referralBonusValue: "",
        customUniqueCode: "",
        platformServiceCharge: 0
      });
      setBillItems([{
        id: 1,
        purposeName: "",
        category: "",
        amount: 0,
        amountWithoutCharge: 0,
        quantity: 1,
        isMandatory: false,
        customPromoCode: "",
      }]);
      setTimeout(() => {
        setCloseModal(false);
        setModalContent("form");
        // Optionally reset form or redirect as needed
        // router.push("/merchant/bills");
      }, 3000);
    },
    onError(error: any) {
      // Axios error handling pattern
      setMutationResponse(error?.response?.data?.message || error.message || "An error occurred while creating the bill");
      setModalContent("status");
    }
  });

  // Handlers for bill details
  const handleBillDetailsChange = (field: keyof BillDetails, value: string | number | File | null) => {
    setBillDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handlers for bill items
  const handleItemChange = (itemId: number, field: keyof BillItem, value: string | number | boolean) => {
    setBillItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const addBillItem = () => {
    const newId = Math.max(0, ...billItems.map(item => item.id)) + 1;
    setBillItems(prev => [...prev, {
      id: newId,
      purposeName: "",
      category: "",
      amount: 0,
      amountWithoutCharge: 0,
      quantity: 1,
      isMandatory: false,
      customPromoCode: "",
    }]);
  };

  const removeBillItem = (itemId: number) => {
    if (billItems.length > 1) {
      setBillItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBillDetails(prev => ({
        ...prev,
        billImage: file,
        billImageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleCustomerSelection = (customerId: string) => {
    setBillDetails(prev => {
      const isSelected = prev.assignedCustomers.includes(customerId);
      return {
        ...prev,
        assignedCustomers: isSelected 
          ? prev.assignedCustomers.filter(id => id !== customerId)
          : [...prev.assignedCustomers, customerId]
      };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add formError state
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!billDetails.name) {
      setFormError("Bill Name is required.");
      return;
    }
    if (!billDetails.code) {
      setFormError("Bill Code is required.");
      return;
    }
    if (!billDetails.startDate || billDetails.startDate === 'Invalid Date') {
      setFormError("Start Date is required and must be valid.");
      return;
    }
    if (!billDetails.endDate || billDetails.endDate === 'Invalid Date') {
      setFormError("End Date is required and must be valid.");
      return;
    }
    if (billDetails.promoPercentage < 0 || billDetails.promoPercentage > 100) {
      setFormError("Promo Percentage must be between 0 and 100.");
      return;
    }
    setFormError(null);
    createBill({
      ...billDetails,
      billItems: billItems
    });
  };

  const handleCreateAndSendEmail = () => {
    // Add email sending logic here
    console.log("Creating and sending email to customers:", selectedCustomers);
    // You can implement the email sending functionality here
    // This could be a separate API call or integrated with the bill creation
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Bill Details
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
            <div className="w-full px-2 py-2 sm:px-4 sm:py-4 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bill Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    value={billDetails.name}
                    onChange={(e) => handleBillDetailsChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bill name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bill Code <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    value={billDetails.code}
                    onChange={(e) => handleBillDetailsChange('code', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bill code"
                  />
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
                        : selectedCustomers.map((c) => `${c.firstName} ${c.lastName}`).join(", ")}
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
                            .filter((customer: Customer) => {
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
                            .map((customer: Customer) => {
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
                                {customer.firstName} {customer.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                Account Number: {customer.accountNumber} | Email: {customer.email}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Assign to Customer Group
                  </label>
                  <select
                    value={billDetails.customerGroupId}
                    onChange={(e) => handleBillDetailsChange('customerGroupId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select customer group</option>
                    {groupsData?.map((group: any) => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Start Date <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="date"
                    value={billDetails.startDate}
                    onChange={(e) => handleBillDetailsChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={billDetails.startTime}
                    onChange={(e) => handleBillDetailsChange('startTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="date"
                    value={billDetails.endDate}
                    onChange={(e) => handleBillDetailsChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={billDetails.endTime}
                    onChange={(e) => handleBillDetailsChange('endTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

            </div>
          </div>
        );

      case 2: // Bill Items
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <DollarSign className="text-green-600" size={20} />
              Bill Items
            </h2>
            <div className="space-y-4">
              {billItems.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-800">Bill Item {index + 1}</h3>
                    {billItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBillItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make bill item mandatory for payment</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        id={`isMandatory-yes-${item.id}`}
                        name={`isMandatory-${item.id}`}
                        checked={item.isMandatory}
                        onChange={() => handleItemChange(item.id, 'isMandatory', true)}
                      />
                      <label htmlFor={`isMandatory-yes-${item.id}`}>Yes</label>
                      <input
                        type="radio"
                        id={`isMandatory-no-${item.id}`}
                        name={`isMandatory-${item.id}`}
                        checked={!item.isMandatory}
                        onChange={() => handleItemChange(item.id, 'isMandatory', false)}
                      />
                      <label htmlFor={`isMandatory-no-${item.id}`}>No</label>
                    </div>
                  </div>
                  <div className="w-full px-2 sm:px-4 py-2 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bill Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type="text"
                          value={item.purposeName}
                          onChange={(e) => handleItemChange(item.id, 'purposeName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter item name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select category</option>
                          {categoriesData?.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          DEBIT AMOUNT
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => handleItemChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter debit amount"
                        />
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      {/* Custom Promo Code for this item */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Promo Code</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.customPromoCode || ''}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                            placeholder="Custom promo code"
                          />
                          <button
                            type="button"
                            onClick={() => handleItemChange(item.id, 'customPromoCode', generatePromoCode())}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addBillItem}
              className="flex items-center gap-2 px-4 py-2 bg-[#221c3e] text-white rounded-lg hover:bg-[#3b2f73] transition-colors mt-4"
            >
              <Plus size={16} />
              Add Bill Item
            </button>
          </div>
        );

      case 3: // Additional Settings
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Settings</h2>
            <div className="w-full px-2 py-2 sm:px-4 sm:py-4 sm:p-8">
              {/* Use grid for perfect alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                {/* Row 1: Promo Code & Platform Service Charge */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <div className="flex w-full">
                    <input
                      type="text"
                      value={billDetails.promoCode}
                      readOnly
                      className="flex-1 px-2 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed text-sm h-11"
                      placeholder="Promo code"
                    />
                    <button
                      type="button"
                      onClick={() => setBillDetails(prev => ({ ...prev, promoCode: generatePromoCode() }))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors text-sm h-11"
                      style={{ marginLeft: '-1px' }}
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Service Charge</label>
                  <input
                    type="number"
                    min="0"
                    value={billDetails.platformServiceCharge}
                    onChange={(e) => handleBillDetailsChange('platformServiceCharge', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm h-11"
                  />
                </div>
                {/* Row 2: Promo Percentage & Custom Unique Code */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={billDetails.promoPercentage}
                    onChange={(e) => handleBillDetailsChange('promoPercentage', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-11"
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Unique Code</label>
                  <input
                    type="text"
                    value={billDetails.customUniqueCode}
                    onChange={(e) => handleBillDetailsChange('customUniqueCode', e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-11"
                    placeholder="Enter unique code"
                  />
                </div>
                {/* Row 3: Upload Image (spans both columns) */}
                <div className="flex flex-col sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center h-28 flex flex-col justify-center items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer w-full h-full flex flex-col justify-center items-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-xs text-gray-600">Click to upload an image</p>
                    </label>
                    {billDetails.billImageUrl && (
                      <div className="mt-2">
                        <img 
                          src={billDetails.billImageUrl} 
                          alt="Preview" 
                          className="mx-auto h-20 w-20 object-cover rounded-lg"
                        />
                      </div>
                    )}
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

  // Status/Success Modal Content
  if (modalContent === "status") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            userCreated ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {userCreated ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${userCreated ? 'text-green-800' : 'text-red-800'}`}>
            {userCreated ? 'Success!' : 'Error'}
          </h2>
          <p className="text-gray-600 mb-4">{mutationResponse}</p>
          {userCreated && (
            <div className="text-sm text-gray-500">
              Redirecting in 3 seconds...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-2 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              Bill Creation
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Create a new bill with detailed information</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Above the form, display error messages */}
          {(formError || (modalContent === "status" && !userCreated && mutationResponse)) && (
            <div className="mb-4 text-red-600 font-semibold bg-red-100 p-2 rounded text-xs sm:text-base">
              {formError || mutationResponse}
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row w-full mt-4 gap-3 sm:gap-0 sm:items-start sm:justify-between">
            {/* Previous Button on the left */}
            <div className="sm:w-1/2 sm:pr-2">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isCreatingBill}
                className={`w-full flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-colors text-white text-base justify-center ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
            </div>
            {/* Action Buttons on the right, stacked vertically */}
            <div className="sm:w-1/2 sm:pl-2 flex flex-col gap-2 items-end">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isCreatingBill}
                  className="w-full sm:w-auto flex items-center gap-2 px-5 py-3 bg-[#221c3e] text-white rounded-lg font-semibold hover:bg-[#3b2f73] transition-colors text-base justify-center"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isCreatingBill}
                    className="w-full sm:w-auto px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-base mb-2"
                  >
                    {isCreatingBill ? 'Creating Bill...' : 'Create Bill'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateAndSendEmail}
                    disabled={isCreatingBill || selectedCustomers.length === 0}
                    className="w-full sm:w-auto px-5 py-3 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 text-base"
                  >
                    Create and Send Email
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillCreationForm; 
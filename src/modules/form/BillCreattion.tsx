"use client";

import React, { useState, ChangeEvent } from 'react';
import { Plus, Trash2, Calendar, User, Users, FileText, DollarSign, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
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
  mandatory: boolean;
}

interface BillDetails {
  id: number;
  name: string;
  code: string;
  customerId: string;
  customerGroupId: string;
  startDate: string;
  startTime: string;
  endTime: string;
  endDate: string;
  promoCode: string;
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
  assignToCustomer: string;
  assignedCustomers: string[];
  organisation: string;
  referralBonusValue: string;
  customUniqueCode: string;
  platformServiceCharge: number;
}

interface Category {
  id: string;
  name: string;
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

  // Bill Details
  const [billDetails, setBillDetails] = useState<BillDetails>({
    id: 1,
    name: "",
    code: "",
    customerId: "",
    customerGroupId: "",
    startDate: "",
    endDate: "",
    promoCode: "",
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
    assignToCustomer: "",
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
    mandatory: false,
  }]);

  
 
   const { data: categoriesData, isLoading } = useQuery<Category[]>({
  queryKey: ['bill-categories'],
  queryFn: async () => {
    const res = await client.get('/api/bill-categories');
     console.log('API Response:', res.data);
    return res.data.data;
  },
});

  // React Query mutation
  const { mutate: createBill, isPending: isCreatingBill } = useMutation({
    mutationFn: async (values: any) => {
      const formData = new FormData();
      
      // Bill Details
      formData.append("billName", values.name);
      formData.append("billCode", values.code);
      formData.append("organisation", organizationId);
      formData.append("assignToCustomer", "");
       formData.append("assignToCustomerGroup", "");  
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
      const assignedCustomers = values.visibility === "general" 
        ? values.assignedCustomers 
        : values.assignedCustomers;
      
      assignedCustomers.forEach((customerId: string) => 
        formData.append("assignedCustomers[]", customerId)
      );

      // Handle image upload
      if (values.billImage) {
        formData.append("billImage", values.billImage);
      }

      // Bill Items - send as JSON string
      const billItemsData = billItems.map(({ id, category, mandatory, ...rest }) => {
        const selectedCategory = categoriesData?.find(cat => cat.id === category);
        return {
          billName: rest.purposeName,
          category, // ID
          name: selectedCategory ? selectedCategory.name : "",
          amount: rest.amount,
          amountWithoutCharge: rest.amountWithoutCharge,
          quantity: rest.quantity,
          mandatory,
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
        customerId: "",
        customerGroupId: "",
        startDate: "",
        endDate: "",
        promoCode: "",
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
        assignToCustomer: "",
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
        mandatory: false,
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
      mandatory: false,
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Bill Details
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
            
            <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} />
                    Assign to Customer
                  </label>
                  <select
                    value={billDetails.customerId}
                    onChange={(e) => handleBillDetailsChange('customerId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select customer</option>
                    {customersData?.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* <div>
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
                    {customerGroupsData?.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div> */}

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
                    End Date <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="date"
                    value={billDetails.endDate}
                    onChange={(e) => handleBillDetailsChange('endDate', e.target.value)}
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
                        id={`mandatory-yes-${item.id}`}
                        name={`mandatory-${item.id}`}
                        checked={item.mandatory}
                        onChange={() => handleItemChange(item.id, 'mandatory', true)}
                      />
                      <label htmlFor={`mandatory-yes-${item.id}`}>Yes</label>
                      <input
                        type="radio"
                        id={`mandatory-no-${item.id}`}
                        name={`mandatory-${item.id}`}
                        checked={!item.mandatory}
                        onChange={() => handleItemChange(item.id, 'mandatory', false)}
                      />
                      <label htmlFor={`mandatory-no-${item.id}`}>No</label>
                    </div>
                  </div>
                  <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
            <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={billDetails.promoCode}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                      placeholder="Promo code"
                    />
                    <button
                      type="button"
                      onClick={() => setBillDetails(prev => ({ ...prev, promoCode: generatePromoCode() }))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Unique Code
                  </label>
                  <input
                    type="text"
                    value={billDetails.customUniqueCode}
                    onChange={(e) => handleBillDetailsChange('customUniqueCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter unique code"
                  />
                </div>
                 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Service Charge
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={billDetails.platformServiceCharge}
                    onChange={(e) => handleBillDetailsChange('platformServiceCharge', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={billDetails.promoPercentage}
                    onChange={(e) => handleBillDetailsChange('promoPercentage', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
                    </label>
                    {billDetails.billImageUrl && (
                      <div className="mt-4">
                        <img 
                          src={billDetails.billImageUrl} 
                          alt="Preview" 
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              
                {/* Maximum payment Duration */}
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2">Maximum payment Duration</h4>
                  <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={billDetails.startDate}
                          onChange={e => handleBillDetailsChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={billDetails.startTime}
                          onChange={e => handleBillDetailsChange('startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={billDetails.endDate}
                          onChange={e => handleBillDetailsChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          value={billDetails.endTime}
                          onChange={e => handleBillDetailsChange('endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              Bill Creation
            </h1>
            <p className="text-gray-600">Create a new bill with detailed information</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
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
            <div className="mb-4 text-red-600 font-semibold bg-red-100 p-2 rounded">
              {formError || mutationResponse}
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || isCreatingBill}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors text-white ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isCreatingBill}
                className="flex items-center gap-2 px-6 py-3 bg-[#221c3e] text-white rounded-lg font-medium hover:bg-[#3b2f73] transition-colors"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isCreatingBill}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isCreatingBill ? 'Creating Bill...' : 'Create Bill'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillCreationForm;
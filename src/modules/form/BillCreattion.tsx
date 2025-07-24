
"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Plus, Trash2, Calendar, User, Users, FileText, DollarSign, ChevronRight, ChevronLeft, Upload, Search, X, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';

interface BillItem {
  id: number;
  billName: string;
  category: string;
  isMandatory: boolean;
  amount: number;
  amountWithoutCharge: number;
  quantity: number;
  promoCode: {
    code: string | null;
    promoPercentage: number;
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    sendEmail: false,
  };
}

interface BillDetails {
  billName: string;
  billCode: string;
  assignToCustomer: string[];
  assignToCustomerGroup: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  promoCode: string;
  customUniqueCode: string;
  platformServiceCharge: number;
  promoPercentage: number;
  billImage: File | null;
  billImageUrl: string | null;
  specialNotes: string;
}

interface Category {
  id: string;
  name: string;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountNumber: string;
}

interface Group {
  _id: string;
  name: string;
}

const generatePromoCode = () => nanoid(8).toUpperCase();

interface BillCreationFormProps {
  organizationId: string;
  onSuccess?: () => void;
}

const BillCreationForm = ({ organizationId, onSuccess }: BillCreationFormProps) => {
  const { client } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Customer search and selection state
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const customerSearchRef = useRef<HTMLDivElement>(null);
   const [isSuccess, setIsSuccess] = useState(false);
  // Bill Details
  const [billDetails, setBillDetails] = useState<BillDetails>({
    billName: "",
    billCode: "",
    assignToCustomer: [],
    assignToCustomerGroup: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    promoCode: "",
    specialNotes: '',
    customUniqueCode: "",
    platformServiceCharge: 0,
    promoPercentage: 0,
    billImage: null,
    billImageUrl: null
  });

  // Bill Items
  const [billItems, setBillItems] = useState<BillItem[]>([{
    id: 1,
    billName: "",
    category: "",
    isMandatory: false,
    amount: 0,
    amountWithoutCharge: 0,
    quantity: 1,
    promoCode: {
      code: null,
      promoPercentage: 0,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      sendEmail: false,
    }
  }]);
  

   
  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['bill-categories'],
    queryFn: async () => {
      const res = await client.get('/api/bill-categories');
      return res.data.data;
    },
  });

  const { data: groupsData } = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await client.get('/api/groups');
      return res.data.data;
    },
  });

  const { data: customerOrganisation } = useQuery<Customer[]>({
    queryKey: ["organisation", organizationId],
    queryFn: async () => {
      const res = await client.get(
        `/api/user?role=customer&organisation=${organizationId}&userType=individual`
      );
      return Array.isArray(res.data) ? res.data : res.data.data || [];
    }
  });

  const { data: platformChargeData } = useQuery({
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (platformChargeData?.data?.percentage) {
      setBillDetails(prev => ({
        ...prev,
        platformServiceCharge: platformChargeData.data.percentage
      }));
    }
  }, [platformChargeData]);

  useEffect(() => {
    // Update amounts when platform charge changes
    setBillItems(prev => prev.map(item => {
      const newAmount = item.amountWithoutCharge + 
        (item.amountWithoutCharge * billDetails.platformServiceCharge) / 100;
      return { ...item, amount: newAmount };
    }));
  }, [billDetails.platformServiceCharge]);

  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm);
    
    if (!customerOrganisation || !searchTerm.trim()) {
      setFilteredCustomers([]);
      setShowCustomerDropdown(false);
      return;
    }

    const filtered = customerOrganisation.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return fullName.includes(searchLower) || 
        customer.email.toLowerCase().includes(searchLower) ||
        customer._id.toLowerCase().includes(searchLower);
    });

    setFilteredCustomers(filtered);
    setShowCustomerDropdown(filtered.length > 0);
  };

  const handleCustomerSelect = (customer: Customer) => {
    const isSelected = selectedCustomers.some(c => c._id === customer._id);
    
    if (isSelected) {
      setSelectedCustomers(prev => prev.filter(c => c._id !== customer._id));
    } else {
      setSelectedCustomers(prev => [...prev, customer]);
    }
    
    const customerIds = selectedCustomers
      .filter(c => c._id !== customer._id)
      .map(c => c._id);
    
    if (!isSelected) {
      customerIds.push(customer._id);
    }
    
    setBillDetails(prev => ({
      ...prev,
      assignToCustomer: customerIds
    }));
    
    setCustomerSearchTerm("");
    setShowCustomerDropdown(false);
  };

  const removeSelectedCustomer = (customerId: string) => {
    setSelectedCustomers(prev => prev.filter(c => c._id !== customerId));
    setBillDetails(prev => ({
      ...prev,
      assignToCustomer: prev.assignToCustomer.filter(id => id !== customerId)
    }));
  };

  const { mutate: createBill, isPending: isCreatingBill } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      // Bill Details
      formData.append("billName", billDetails.billName);
      formData.append("billCode", billDetails.billCode);
      formData.append("organisation", organizationId);
      formData.append("assignToCustomerGroup", billDetails.assignToCustomerGroup);
      formData.append("startDate", billDetails.startDate);
      formData.append("endDate", billDetails.endDate);
      formData.append("startTime", billDetails.startTime);
      formData.append("endTime", billDetails.endTime);
      formData.append("promoCode", billDetails.promoCode);
      formData.append("customUniqueCode", billDetails.customUniqueCode);
      formData.append("platformServiceCharge", billDetails.platformServiceCharge.toString());
      formData.append("promoPercentage", billDetails.promoPercentage.toString());

      // Assign to customers
      billDetails.assignToCustomer.forEach(customerId => {
        formData.append("assignToCustomer[]", customerId);
      });

      // Bill Items
      const itemsData = billItems.map(item => ({
        billName: item.billName,
        category: item.category,
        isMandatory: item.isMandatory,
        amount: item.amount,
        amountWithoutCharge: item.amountWithoutCharge,
        quantity: item.quantity,
        promoCode: item.promoCode
      }));
      formData.append("billItems", JSON.stringify(itemsData));

      // Max Payment Duration
      const maxPaymentDuration = {
        startDate: billDetails.startDate,
        endDate: billDetails.endDate,
        startTime: billDetails.startTime,
        endTime: billDetails.endTime
      };
      formData.append("maxPaymentDuration", JSON.stringify(maxPaymentDuration));

      // Bill image
      if (billDetails.billImage) {
        formData.append("billImage", billDetails.billImage);
      }

      return client.post('/api/bills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess() {
      setIsSuccess(true); 
      setTimeout(() => {
        if (onSuccess) onSuccess();
        setIsSuccess(false);
      }, 3000); // Show success message for 3 seconds
    }
  });

  const handleBillDetailsChange = (field: keyof BillDetails, value: string | number | File | null) => {
    setBillDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (itemId: number, field: keyof BillItem, value: string | number | boolean) => {
    setBillItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const updatedItem = { ...item, [field]: value };
      
      if (field === 'amountWithoutCharge') {
        const percentage = billDetails.platformServiceCharge;
        updatedItem.amount = Number(value) + (Number(value) * percentage) / 100;
      }
      
      return updatedItem;
    }));
  };

  const handlePromoCodeChange = (
    itemId: number, 
    field: keyof BillItem['promoCode'], 
    value: string | number | boolean | null
  ) => {
    setBillItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      return {
        ...item,
        promoCode: {
          ...item.promoCode,
          [field]: value
        }
      };
    }));
  };

  const addBillItem = () => {
    const newId = Math.max(0, ...billItems.map(item => item.id)) + 1;
    setBillItems(prev => [...prev, {
      id: newId,
      billName: "",
      category: "",
      isMandatory: false,
      amount: 0,
      amountWithoutCharge: 0,
      quantity: 1,
      promoCode: {
        code: null,
        promoPercentage: 0,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        sendEmail: false,
      }
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

  const nextStep = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = () => createBill();

  return (
    <div className="min-h-screen p-2 sm:p-6">
       {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bill Created Successfully!</h2>
            
            {/* <button
              onClick={() => setIsSuccess(false)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button> */}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-2 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              
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

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
                <div className="text-xs text-red-500 mt-1 mb-4">
                  You must assign this bill to at least one customer or a group.
                </div>
                <div className="w-full px-2 py-2 sm:px-4 sm:py-4 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill Name *
                      </label>
                      <input
                        type="text"
                        value={billDetails.billName}
                        onChange={(e) => handleBillDetailsChange('billName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter bill name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill Code *
                      </label>
                      <input
                        type="text"
                        value={billDetails.billCode}
                        onChange={(e) => handleBillDetailsChange('billCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter bill code"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User size={16} />
                        Assign to Customers
                      </label>
                      <div className="relative" ref={customerSearchRef}>
                        <div
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white"
                          onClick={() => setShowCustomerDropdown(true)}
                        >
                          {selectedCustomers.length === 0
                            ? "Select customers..."
                            : selectedCustomers.map(c => `${c.firstName} ${c.lastName}`).join(", ")}
                        </div>
                        {showCustomerDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={customerSearchTerm}
                                onChange={e => handleCustomerSearch(e.target.value)}
                                placeholder="Search customers..."
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                              />
                            </div>
                            {customerOrganisation?.map(customer => (
                              <div
                                key={customer._id}
                                onClick={() => handleCustomerSelect(customer)}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                  selectedCustomers.some(c => c._id === customer._id) ? "bg-blue-50" : ""
                                }`}
                              >
                                <div className="font-medium text-gray-900">
                                  {customer.firstName} {customer.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Account: {customer.accountNumber} | Email: {customer.email}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {selectedCustomers.length > 0 && (
                        <div className="space-y-2 mt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Selected Customers ({selectedCustomers.length}):
                          </label>
                          <div className="space-y-2">
                            {selectedCustomers.map(customer => (
                              <div
                                key={customer._id}
                                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                              >
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {customer.firstName} {customer.lastName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Account: {customer.accountNumber}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign to Group
                      </label>
                      <select
                        value={billDetails.assignToCustomerGroup}
                        onChange={(e) => handleBillDetailsChange('assignToCustomerGroup', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select customer group</option>
                        {groupsData?.map(group => (
                          <option key={group._id} value={group._id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={16} />
                        Start Date *
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
                        End Date *
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
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                 
                  Bill Items
                </h2>
                <div className="space-y-4">
                  {billItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800">Bill Item</h3>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Make bill item mandatory
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={item.isMandatory}
                              onChange={() => handleItemChange(item.id, 'isMandatory', true)}
                            />
                            Yes
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={!item.isMandatory}
                              onChange={() => handleItemChange(item.id, 'isMandatory', false)}
                            />
                            No
                          </label>
                        </div>
                      </div>
                      <div className="w-full px-2 sm:px-4 py-2 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bill Name *
                            </label>
                            <input
                              type="text"
                              value={item.billName}
                              onChange={(e) => handleItemChange(item.id, 'billName', e.target.value)}
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
            value={item.amountWithoutCharge === 0 ? '' : item.amountWithoutCharge}
            onChange={(e) => {
              const value = e.target.value;
              // Handle empty input
              if (value === '') {
                handleItemChange(item.id, 'amountWithoutCharge', 0);
              } else {
                const num = parseFloat(value);
                if (!isNaN(num)) {
                  handleItemChange(item.id, 'amountWithoutCharge', num);
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
                          {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Amount Without Charge
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.amountWithoutCharge}
                              onChange={(e) => handleItemChange(item.id, 'amountWithoutCharge', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div> */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ACTUAL DEBIT AMOUNT
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.amount}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                          </div>
                               
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Service Charge (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={billDetails.platformServiceCharge}
                        onChange={(e) => handleBillDetailsChange('platformServiceCharge', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div> */}

                           <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Platform charge (%)</label>
               <input
                type="number"
                value={platformChargeData?.data?.percentage || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform charge value</label>
              <input
                type="number"
                value={
                  platformChargeData?.data?.percentage
                    ? ((platformChargeData.data.percentage / 100) * item.amountWithoutCharge).toFixed(2)
                    : ''
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
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="p-4 w-full border border-gray-200 rounded-lg bg-gray-50">
                          <label className="block text-base font-semibold mb-4">Promo Code Settings</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* <div>
                              <label className="block text-xs text-gray-600 mb-1">Promo Code</label>
                              <input
                                type="text"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                placeholder="Enter promo code"
                                value={item.promoCode.code || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'code', e.target.value)}
                              />
                            </div> */}

                            <div>
      <label className="block text-xs text-gray-600 mb-1">Promo Code</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow px-2 py-2 border border-gray-300 rounded"
          placeholder="Enter promo code"
          value={item.promoCode.code || ''}
          onChange={e => handlePromoCodeChange(item.id, 'code', e.target.value)}
        />
        <button
          type="button"
          onClick={() => handlePromoCodeChange(item.id, 'code', generatePromoCode())}
          className="px-3 py-2 bg-blue-500 text-white  hover:bg-gray-300 rounded transition-colors text-xs whitespace-nowrap"
        >
          Generate
        </button>
      </div>
    </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Promo Percentage (%)</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.promoCode.promoPercentage}
                                onChange={e => handlePromoCodeChange(item.id, 'promoPercentage', parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                              <input
                                type="date"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                value={item.promoCode.startDate || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">End Date</label>
                              <input
                                type="date"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                value={item.promoCode.endDate || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'endDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                              <input
                                type="time"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                value={item.promoCode.startTime || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'startTime', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">End Time</label>
                              <input
                                type="time"
                                className="w-full px-2 py-2 border border-gray-300 rounded"
                                value={item.promoCode.endTime || ''}
                                onChange={e => handlePromoCodeChange(item.id, 'endTime', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center mt-4">
  <input
    type="checkbox"
    id={`send-email-${item.id}`}
    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    checked={item.promoCode.sendEmail || false}
 onChange={e => handlePromoCodeChange(item.id, 'sendEmail', e.target.checked)}

  />
  <label
    htmlFor={`send-email-${item.id}`}
    className="ml-2 text-base font-semibold text-gray-800"
  >
    Send promo code to customers via email
  </label>
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
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Settings</h2>
                <div className="w-full px-2 py-2 sm:px-4 sm:py-4 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Promo Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={billDetails.promoCode}
          onChange={(e) => handleBillDetailsChange('promoCode', e.target.value)}
          className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter promo code"
        />
        <button
          type="button"
          onClick={() => handleBillDetailsChange('promoCode', generatePromoCode())}
          className="px-4 py-3 bg-blue-500 text-white hover:bg-gray-300 rounded-lg transition-colors whitespace-nowrap"
        >
          Generate
        </button>
      </div>
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
                      />
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
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill Image
                      </label>
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
                    <div className="sm:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Special Notes
  </label>
  <textarea
    value={billDetails.specialNotes}
    onChange={(e) => handleBillDetailsChange('specialNotes', e.target.value)}
    rows={5}
    placeholder="Type any additional information here..."
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
  />
</div>

                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row w-full mt-4 gap-3 sm:gap-0 sm:items-start sm:justify-between">
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
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isCreatingBill}
                  className="w-full sm:w-auto px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-base mb-2"
                >
                  {isCreatingBill ? 'Creating Bill...' : 'Create Bill'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillCreationForm;
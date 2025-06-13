


"use client";

import React, { useState, ChangeEvent } from 'react';
import { Plus, Trash2, Calendar, User, Users, FileText, DollarSign, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

interface BillItem {
  id: number;
  purposeName: string;
  description: string;
  category: string;
  amount: number;
  quantity: number;
  amountWithoutCharge: number;
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
  referralBonus: number;
  image: File | null;
  imageUrl: string | null;
  digitalItem: File | null;
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
}

interface Customer {
  id: string;
  name: string;
}

interface CustomerGroup {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const BillCreationForm = ({ organizationId }: { organizationId: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Bill Details (5-7 core fields)
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
    referralBonus: 0,
    image: null,
    imageUrl: null,
    digitalItem: null,
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
    referralBonusValue: ""
  });

  // Bill Items (with item-specific fields)
  const [billItems, setBillItems] = useState<BillItem[]>([{
    id: 1,
    purposeName: "",
    description: "",
    category: "",
    amount: 0,
    quantity: 1,
    amountWithoutCharge: 0
  }]);

  const [customers] = useState<Customer[]>([
    { id: '1', name: 'John Ray' },
    { id: '2', name: 'Peter J' },
    { id: '3', name: 'Sarah Wilson' },
    { id: '4', name: 'Mike Johnson' }
  ]);

  const [customerGroups] = useState<CustomerGroup[]>([
    { id: '1', name: 'Premium Customers' },
    { id: '2', name: 'Regular Customers' },
    { id: '3', name: 'VIP Customers' }
  ]);

  const [categories] = useState<Category[]>([
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Books' },
    { id: '4', name: 'Home & Garden' }
  ]);

  // Handlers for bill details
  const handleBillDetailsChange = (field: keyof BillDetails, value: string | number | File | null) => {
    setBillDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handlers for bill items
  const handleItemChange = (itemId: number, field: keyof BillItem, value: string | number) => {
    setBillItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const addBillItem = () => {
    const newId = Math.max(0, ...billItems.map(item => item.id)) + 1;
    setBillItems(prev => [...prev, {
      id: newId,
      purposeName: "",
      description: "",
      category: "",
      amount: 0,
      quantity: 1,
      amountWithoutCharge: 0
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
        image: file,
        imageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleDigitalItemUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBillDetailsChange('digitalItem', file);
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

  const handleSubmit = () => {
    const billData = {
      billDetails,
      billItems
    };

    console.log('Complete Bill Data:', billData);
    alert('Bill created successfully!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Bill Details
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Name *
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
                  Bill Code
                </label>
                <input
                  type="text"
                  value={billDetails.code}
                  onChange={(e) => handleBillDetailsChange('code', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter bill code"
                />
              </div>

              <div>
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
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
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
                  {customerGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Start Date
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
                  End Date
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
        );

      case 2: // Bill Items
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="text-green-600" size={20} />
                Bill Items
              </h2>
              <button
                type="button"
                onClick={addBillItem}
                className="flex items-center gap-2 px-4 py-2 bg-[#221c3e] text-white rounded-lg hover:bg-[#3b2f73] transition-colors"
              >
                <Plus size={16} />
                Add Bill Item
              </button>
            </div>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill Name *
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
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                   

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount 
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => handleItemChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

                    <div>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Additional Settings
        return (
          <div className="space-y-6">
           
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={billDetails.promoCode}
                  onChange={(e) => handleBillDetailsChange('promoCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter promo code"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custome unique Code
                </label>
                <input
                  type="text"
                  value={billDetails.customerId}
                  onChange={(e) => handleBillDetailsChange('promoCode', e.target.value)}
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
                  value={billDetails.promoPercentage}
                    onChange={(e) => handleBillDetailsChange('promoPercentage', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100"
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
                  Referral Bonus
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={billDetails.referralBonus}
                  onChange={(e) => handleBillDetailsChange('referralBonus', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Bonus Value
                </label>
                <input
                  type="text"
                  value={billDetails.referralBonusValue}
                  onChange={(e) => handleBillDetailsChange('referralBonusValue', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter referral bonus value"
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
                  {billDetails.imageUrl && (
                    <div className="mt-4">
                      <img 
                        src={billDetails.imageUrl} 
                        alt="Preview" 
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
                 <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Item
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                   onChange={handleDigitalItemUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
                  </label>
                  {billDetails.imageUrl && (
                    <div className="mt-4">
                      <img 
                        src={billDetails.imageUrl} 
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
  <div className="grid grid-cols-2 gap-2">
    <div>
      <label>Start Date</label>
      <input
        type="date"
        value={billDetails.startDate}
        onChange={e => handleBillDetailsChange('startDate', e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
    </div>

    <div>
      <label>Start Time</label>
      <input
        type="time"
        value={billDetails.startTime}
        onChange={e => handleBillDetailsChange('startTime', e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
    </div>

    <div>
      <label>End Date</label>
      <input
        type="date"
        value={billDetails.endDate}
        onChange={e => handleBillDetailsChange('endDate', e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
    </div>

    <div>
      <label>End Time</label>
      <input
        type="time"
        value={billDetails.endTime}
        onChange={e => handleBillDetailsChange('endTime', e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
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
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
             
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

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-[#221c3e] text-white rounded-lg font-medium hover:bg-[#3b2f73] transition-colors"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Submit Bill
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillCreationForm;
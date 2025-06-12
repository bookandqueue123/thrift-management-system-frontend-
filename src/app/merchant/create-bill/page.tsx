"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Calendar, User, Users, FileText, DollarSign } from 'lucide-react';

const BillCreationForm = () => {
  const [billDetails, setBillDetails] = useState({
    name: '',
    code: '',
    description: '',
    customerId: '',
    customerGroupId: '',
    startDate: '',
    endDate: ''
  });

  const [billItems, setBillItems] = useState([
    { id: 1, name: '', quantity: 1, price: 0, total: 0 }
  ]);

  const [customers] = useState([
    { id: '1', name: 'John Ray' },
    { id: '2', name: 'Peter J' },
    { id: '3', name: 'Sarah Wilson' },
    { id: '4', name: 'Mike Johnson' }
  ]);

  const [customerGroups] = useState([
    { id: '1', name: 'Premium Customers' },
    { id: '2', name: 'Regular Customers' },
    { id: '3', name: 'VIP Customers' }
  ]);

  const handleBillDetailsChange = (field: string, value: string) => {
    setBillDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (itemId: number, field: string, value: string | number) => {
    setBillItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addBillItem = () => {
    const newId = Math.max(...billItems.map(item => item.id)) + 1;
    setBillItems(prev => [...prev, {
      id: newId,
      name: '',
      quantity: 1,
      price: 0,
      total: 0
    }]);
  };

  const removeBillItem = (itemId: number) => {
    if (billItems.length > 1) {
      setBillItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const calculateGrandTotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handleSubmit = () => {
    const isValid = billDetails.name.trim() && billItems.every(item => item.name.trim());
    
    if (!isValid) {
      alert('Please fill in all required fields (Bill name and Item names)');
      return;
    }

    console.log('Bill Details:', billDetails);
    console.log('Bill Items:', billItems);
    alert('Bill created successfully!');
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              
              Bill Creation
            </h1>
            <p className="text-gray-600">Create a new bill with items and assign to customers</p>
          </div>

          <div className="space-y-8">
            {/* Bill Details Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                
                Bill&apos;s Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. Bill&apos;s s name *
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
                    Bill&apos;s code
                  </label>
                  <input
                    type="text"
                    value={billDetails.code}
                    onChange={(e) => handleBillDetailsChange('code', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Auto-generated or custom"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Bill&apos;s  description
                  </label>
                  <textarea
                    value={billDetails.description}
                    onChange={(e) => handleBillDetailsChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bill description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} />
                    3. Assign to customer
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
                    4. Assign to group of customer/user
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
                    5. Bill&apos;s duration - Start date
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
                    End date
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

            {/* Bill Items Section */}
            <div className="bg-green-50 rounded-lg p-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item name *
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter item name"
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
                          Price ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-4 bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Item Total:</span>
                          <span className="text-lg font-bold text-black">
                            ${item.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Bill Item Button */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={addBillItem}
                  className="px-6 py-2 bg-[#221c3e] text-white rounded-lg hover:bg-gray-300 transition-colors"
                >
                  + Add More Bill Item
                </button>
              </div>

              <div className="mt-6 bg-white rounded-lg p-4 border-2 border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Grand Total:</span>
                  <span className="text-2xl font-bold text-black">
                    ${calculateGrandTotal()}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-4 bg-[#221c3e] w-full text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillCreationForm;
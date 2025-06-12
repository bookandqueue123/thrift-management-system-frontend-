


"use client"

import React, { useState } from 'react';
import { Edit3, Save, X, Plus, Trash2, Calendar, User, Users, FileText, DollarSign, Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import { FilterDropdown } from '@/components/Buttons';
import Modal from '@/components/Modal';
import PaginationBar from '@/components/Pagination';
import { StatusIndicator } from '@/components/StatusIndicator';
import TransactionsTable from '@/components/Tables';
import Image from 'next/image';

// Dummy data for bills
const dummyBills = [
  {
    id: 1,
    name: 'Monthly Service Bill',
    code: 'BILL-2024-001',
    description: 'Monthly subscription services for premium customers',
    customerId: '2',
    customerGroupId: '1',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    items: [
      { id: 1, name: 'Premium Support Service', quantity: 1, price: 299.99, total: 299.99 },
      { id: 2, name: 'System Maintenance', quantity: 2, price: 149.50, total: 299.00 },
      { id: 3, name: 'Additional Feature License', quantity: 1, price: 99.99, total: 99.99 }
    ],
    grandTotal: 698.98,
    createdAt: '2023-12-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Quarterly Cloud Hosting',
    code: 'BILL-2024-002',
    description: 'Cloud hosting services for Q1 2024',
    customerId: '4',
    customerGroupId: '3',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    items: [
      { id: 1, name: 'Cloud Storage (100GB)', quantity: 1, price: 199.99, total: 199.99 },
      { id: 2, name: 'Database Hosting', quantity: 3, price: 89.99, total: 269.97 }
    ],
    grandTotal: 469.96,
    createdAt: '2023-12-20T14:45:00Z'
  },
  {
    id: 3,
    name: 'Annual Software License',
    code: 'BILL-2024-003',
    description: 'Annual license for enterprise software',
    customerId: '1',
    customerGroupId: '2',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    items: [
      { id: 1, name: 'Enterprise License', quantity: 1, price: 4999.99, total: 4999.99 },
      { id: 2, name: 'Premium Support Package', quantity: 1, price: 999.99, total: 999.99 }
    ],
    grandTotal: 5999.98,
    createdAt: '2023-12-10T09:15:00Z'
  }
];

const dummyCustomers = [
  { id: '1', name: 'John Ray' },
  { id: '2', name: 'Peter J' },
  { id: '3', name: 'Sarah Wilson' },
  { id: '4', name: 'Mike Johnson' }
];

const dummyCustomerGroups = [
  { id: '1', name: 'Premium Customers' },
  { id: '2', name: 'Regular Customers' },
  { id: '3', name: 'VIP Customers' }
];

const BillsTable = () => {
  const PAGE_SIZE = 2;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [searchResult, setSearchResult] = useState("");
  const [filteredBills, setFilteredBills] = useState(dummyBills);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<number>(0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.target.value);
    const filtered = dummyBills.filter(bill => 
      bill.name.toLowerCase().includes(e.target.value.toLowerCase()) || 
      bill.code.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBills(filtered);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    handleDateFilter();
  };

  const handleDateFilter = () => {
    if (fromDate && toDate) {
      const filtered = dummyBills.filter(bill => {
        const billDate = new Date(bill.createdAt);
        const startDateObj = new Date(fromDate);
        const endDateObj = new Date(toDate);
        return billDate >= startDateObj && billDate <= endDateObj;
      });
      setFilteredBills(filtered);
    }
  };

  const toggleDropdown = (val: number) => {
    setOpenDropdown(openDropdown === val ? 0 : val);
  };

  const handleViewBill = (bill: any) => {
    setSelectedBill(bill);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditBill = (bill: any) => {
    setSelectedBill(bill);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveBill = (updatedBill: any) => {
    setIsModalOpen(false);
  };

  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredBills.length / PAGE_SIZE);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getCustomerName = (customerId: string) => {
    const customer = dummyCustomers.find(c => c.id === customerId);
    return customer ? customer.name : 'N/A';
  };

  const getCustomerGroupName = (groupId: string) => {
    const group = dummyCustomerGroups.find(g => g.id === groupId);
    return group ? group.name : 'N/A';
  };

  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Bills
        </p>
      </div>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <FilterDropdown
              options={[
                "Bill Name",
                "Bill Code",
                "Customer",
                "Status",
              ]}
            />
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
              <input
                onChange={handleSearch}
                type="search"
                placeholder="Search"
                className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
              />
              <Search size={16} className="text-ajo_offWhite" />
            </form>
          </span>
          {/* Create button removed */}
        </div>

        <div className="my-8">
          <label
            htmlFor="fromDate"
            className="mb-2 text-sm font-semibold text-white"
          >
            Select range from:
          </label>
          <div className="justify-between space-y-2 md:flex">
            <div className="flex items-center">
              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
              />
              <label htmlFor="toDate" className="mx-2 text-white">
                to
              </label>
              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={handleToDateChange}
                className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
              />
            </div>
            {/* Export buttons removed */}
          </div>
        </div>

        <div>
          <TransactionsTable
            headers={[
              "Bill Name",
              "Bill Code",
              "Customer",
              "Customer Group",
              "Start Date",
              "End Date",
              "Total Amount",
              "Created At",
              "Action"
            ]}
            content={paginatedBills.map((bill, index) => (
              <tr key={bill.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {bill.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {bill.code}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {getCustomerName(bill.customerId)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {getCustomerGroupName(bill.customerGroupId)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {formatDate(bill.startDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {formatDate(bill.endDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  ${bill.grandTotal.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {formatDate(bill.createdAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator
                    label={`Actions`}
                    clickHandler={() => toggleDropdown(index + 1)}
                    dropdownEnabled
                    dropdownContents={{
                      labels: ["View Bill", "Edit Bill"],
                      actions: [
                        () => handleViewBill(bill),
                        () => handleEditBill(bill)
                      ],
                    }}
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    currentIndex={index + 1}
                  />
                </td>
              </tr>
            ))}
          />
          <div className="flex justify-center">
            <PaginationBar
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </section>

      {isModalOpen && selectedBill && (
        <Modal
          setModalState={setIsModalOpen}
          title={modalMode === 'view' ? 'View Bill' : 'Edit Bill'}
        >
          <BillViewEdit 
            bill={selectedBill} 
            mode={modalMode}
            onSave={handleSaveBill}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};

const BillViewEdit = ({ bill, mode, onSave, onClose }: { 
  bill: any; 
  mode: 'view' | 'edit'; 
  onSave: (updatedBill: any) => void; 
  onClose: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [billDetails, setBillDetails] = useState(bill);
  const [billItems, setBillItems] = useState(bill.items);

  const handleBillDetailsChange = (field: string, value: string) => {
    setBillDetails((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (itemId: number, field: string, value: string | number) => {
    setBillItems((prev: any[]) => prev.map(item => {
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
    const newId = Math.max(...billItems.map((item: any) => item.id)) + 1;
    setBillItems((prev: any) => [...prev, {
      id: newId,
      name: '',
      quantity: 1,
      price: 0,
      total: 0
    }]);
  };

  const removeBillItem = (itemId: number) => {
    if (billItems.length > 1) {
      setBillItems((prev: any[]) => prev.filter(item => item.id !== itemId));
    }
  };

  const calculateGrandTotal = () => {
    return billItems.reduce((sum: number, item: any) => sum + item.total, 0).toFixed(2);
  };

  const handleSave = () => {
    const updatedBill = {
      ...billDetails,
      items: billItems,
      grandTotal: parseFloat(calculateGrandTotal())
    };
    onSave(updatedBill);
  };

  const getCustomerName = (customerId: string) => {
    const customer = dummyCustomers.find(c => c.id === customerId);
    return customer ? customer.name : 'Not assigned';
  };

  const getCustomerGroupName = (groupId: string) => {
    const group = dummyCustomerGroups.find(g => g.id === groupId);
    return group ? group.name : 'Not assigned';
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        <div className=" rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-ajo_offWhite mb-2 flex items-center gap-3">
                
                {isEditing ? 'Edit Bill' : 'Bill Details'}
              </h1>
              <p className="text-ajo_offWhite">
                {isEditing ? 'Edit bill information and items' : 'View bill information and items'}
              </p>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-ajo_offWhite rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 size={16} />
                  Edit Bill
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Bill Details Section */}
            <div className=" rounded-lg p-6">
              <h2 className="text-xl font-semibold text-ajo_offWhite mb-4 flex items-center gap-2">
               
                Bill Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ajo_offWhite mb-2">
                    Bill Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={billDetails.name}
                      onChange={(e) => handleBillDetailsChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bill name"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800">
                      {billDetails.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ajo_offWhite mb-2">
                    Bill Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={billDetails.code}
                      onChange={(e) => handleBillDetailsChange('code', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bill code"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800">
                      {billDetails.code}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ajo_offWhite mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={billDetails.description}
                      onChange={(e) => handleBillDetailsChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bill description"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 min-h-[80px]">
                      {billDetails.description}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ajo_offWhite mb-2 flex items-center gap-2">
                    <User size={16} />
                    Assigned Customer
                  </label>
                  {isEditing ? (
                    <select
                      value={billDetails.customerId}
                      onChange={(e) => handleBillDetailsChange('customerId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select customer</option>
                      {dummyCustomers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800">
                      {getCustomerName(billDetails.customerId)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ajo_offWhite mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Customer Group
                  </label>
                  {isEditing ? (
                    <select
                      value={billDetails.customerGroupId}
                      onChange={(e) => handleBillDetailsChange('customerGroupId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select customer group</option>
                      {dummyCustomerGroups.map(group => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800">
                      {getCustomerGroupName(billDetails.customerGroupId)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ajo_offWhite mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Start Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={billDetails.startDate}
                      onChange={(e) => handleBillDetailsChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800">
                      {formatDate(billDetails.startDate)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={billDetails.endDate}
                      onChange={(e) => handleBillDetailsChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800">
                      {formatDate(billDetails.endDate)}
                    </div>
                  )}
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
                {isEditing && (
                  <button
                    type="button"
                    onClick={addBillItem}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {billItems.map((item: any, index: number) => (
                  <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">Item {index + 1}</h3>
                      {isEditing && billItems.length > 1 && (
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
                          Item Name *
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter item name"
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                            {item.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                            {item.quantity}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($)
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                            ${item.price.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-4 bg-gray-100 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Item Total:</span>
                          <span className="text-lg font-bold text-gray-900">
                            ${item.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Item Button (when editing) */}
              {isEditing && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={addBillItem}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    + Add More Item
                  </button>
                </div>
              )}

              {/* Grand Total */}
              <div className="mt-6 bg-white rounded-lg p-4 border-2 border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Grand Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${calculateGrandTotal()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const View = () => {
  return <BillsTable />;
};

export default View;
"use client"

import React, { useState } from 'react';
import { Printer, Calendar, User, Building2, Mail, Phone, Plus, Trash2, Calculator } from 'lucide-react';
import Image from "next/image"
export default function CurrentBillComponent() {
  const [billData, setBillData] = useState({
    billCode: 'BILL-001',
    startDate: '2025-06-01',
    endDate: '2025-06-12',
    organizationName: 'Name of Organization',
    address: '123 Business Street',
    email: 'contact@yourorg.com',
    phone: '+1 (555) 123-4567',
    customerName: 'John Doe',
    customerId: 'CUST-001',
    customerGroup: 'Premium'
  });

  const [billItems, setBillItems] = useState([
    { id: 1, billItem:"School fees", description: 'Previous balance', duration: 30, amount: 150.00},
    { id: 2, billItem:"text books",  description: 'Product Item 2', duration: 0, amount: 75.50 },
    { id: 3, billItem:"Medical checkup",  description: 'Consultation', duration: 60, amount: 200.00 }
  ]);
  
  const [startDate, setStartDate] = useState("2024-05-01")
    const [endDate, setEndDate] = useState("2024-06-14")
  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      billItem: '',
      description: '',
      duration: 0,
      amount: 0,
      
    };
    setBillItems([...billItems, newItem]);
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setBillItems(billItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: number) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => sum + (item.amount), 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-lg min-h-screen">
      {/* Header */}
      <div className="border-2 border-gray-700/50 bg-gray-800/30 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
             <Image src="/Logo.svg" width={100} height={100} alt="logo" />
           
            <div>
              <input
                type="text"
                value={billData.organizationName}
                onChange={(e) => setBillData({...billData, organizationName: e.target.value})}
                className="text-xl font-bold border-b border-gray-600 bg-transparent text-white placeholder-gray-400"
                placeholder="Name of Organization"
              />
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
          
              <span className="font-semibold text-gray-300">Address:</span>
            </div>
            <textarea
              value={billData.address}
              onChange={(e) => setBillData({...billData, address: e.target.value})}
              className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 resize-none focus:border-blue-500 focus:outline-none"
              
            />
            
            <div className="flex items-center gap-2 mt-2 mb-1">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-300">Email:</span>
            </div>
            <input
              type="email"
              value={billData.email}
              onChange={(e) => setBillData({...billData, email: e.target.value})}
              className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
            />

            <div className="flex items-center gap-2 mt-2 mb-1">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-300">Phone:</span>
            </div>
            <input
              type="tel"
              value={billData.phone}
              onChange={(e) => setBillData({...billData, phone: e.target.value})}
              className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-4">
           <div className="grid grid-cols-3 gap-4 h-24">
  {/* Bill's Code */}
  <div>
    <label className="block font-semibold mb-1 text-gray-300">Bill&apos;s Code:</label>
    <input
      type="text"
      value={billData.billCode}
      onChange={(e) => setBillData({ ...billData, billCode: e.target.value })}
      className="w-full h-10 mt-1 border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
    />
  </div>

  {/* Duration */}
  <div>
    <label className="block font-semibold mb-1 text-gray-300">Bill Duration:</label>
    <div className="flex items-center gap-2">
      <input
        id="start-date"
        type="date"
        value={billData.startDate}
        onChange={(e) => setBillData({ ...billData, startDate: e.target.value })}
        className="w-full h-10 border border-gray-600 bg-gray-800/50 text-white rounded p-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <span className="text-gray-300">to</span>
      <input
        id="end-date"
        type="date"
        value={billData.endDate}
        onChange={(e) => setBillData({ ...billData, endDate: e.target.value })}
        className="w-full h-10 border border-gray-600 bg-gray-800/50 text-white rounded p-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  </div>
</div>


            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold mb-1 text-gray-300">Customer Name:</label>
                <input
                  type="text"
                  value={billData.customerName}
                  onChange={(e) => setBillData({...billData, customerName: e.target.value})}
                  className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-300">Customer ID:</label>
                <input
                  type="text"
                  value={billData.customerId}
                  onChange={(e) => setBillData({...billData, customerId: e.target.value})}
                  className="w-full border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 rounded p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-300">Customer Group:</label>
                <select
                  value={billData.customerGroup}
                  onChange={(e) => setBillData({...billData, customerGroup: e.target.value})}
                  className="w-full border border-gray-600 bg-gray-800/50 text-white rounded p-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Items Table */}
      <div className="mb-6">
        <div className="overflow-x-auto bg-gray-800/30 rounded-lg border border-gray-700/50">
          <table className="min-w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  S/N
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Bill Item 
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {billItems.length === 0 ? (
                <tr className="h-12">
                  <td colSpan={6} className="text-center text-sm font-semibold text-gray-400 py-8">
                    No Items Added Yet
                  </td>
                </tr>
              ) : (
                billItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
          <input
    type="text"
    value={item.billItem}
    onChange={(e) => updateItem(item.id, 'billItem', e.target.value)}
    className="w-full border-none bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
      placeholder="Bill item"
          />
              </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full border-none bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
                        placeholder="Enter description"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <input
                        type="number"
                        value={item.duration}
                        onChange={(e) => updateItem(item.id, 'duration', parseInt(e.target.value) || 0)}
                        className="w-full border-none bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
                        min="0"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full border-none bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
                        min="0"
                        step="0.01"
                      />
                    </td>
                   
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
       
      </div>

      {/* Totals Section */}
      <div className="flex ">
        <div className="w-80 border border-gray-700/50 bg-gray-800/30 rounded-lg">
         
          
          <div className="p-3 space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-700/50 pt-2">
              <div className="flex justify-between font-bold text-lg text-white">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Bill Section */}
      <div className="mt-8 border-t-2 border-gray-700/50 pt-4">
        <h2 className="text-xl font-bold mb-4 text-white">Current Bill</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-gray-300">
            <p><strong className="text-white">Bill Period:</strong> {billData.startDate} to {billData.endDate}</p>
            <p><strong className="text-white">Customer:</strong> {billData.customerName} ({billData.customerId})</p>
            <p><strong className="text-white">Group:</strong> {billData.customerGroup}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">Amount Due: ${total.toFixed(2)}</p>
            <p className="text-sm text-gray-400">Due Date: {billData.endDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
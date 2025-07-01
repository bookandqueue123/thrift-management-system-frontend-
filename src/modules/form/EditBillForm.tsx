import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Trash2, Calendar, DollarSign, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';

interface BillItem {
  id?: number;
  _id?: string;
  billName: string;
  category: string;
  amount: number;
  amountWithoutCharge: number;
  quantity: number;
  image?: File | null;
}

interface BillDetails {
  billName: string;
  billCode: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  promoCode: string;
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

  useEffect(() => {
    setBillDetails(initialData);
    setBillItems(initialData.billItems || []);
  }, [initialData]);

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['bill-categories'],
    queryFn: async () => {
      const res = await client.get('/api/bill-categories');
      return res.data.data;
    },
  });

  // Handlers for bill details
  const handleBillDetailsChange = (field: keyof BillDetails, value: any) => {
    setBillDetails(prev => ({ ...prev, [field]: value }));
  };

  // Handlers for bill items
  const handleItemChange = (idx: number, field: keyof BillItem, value: any) => {
    setBillItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addBillItem = () => {
    setBillItems(prev => [...prev, { billName: '', category: '', amount: 0, amountWithoutCharge: 0, quantity: 1, image: null }]);
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
    setFormError(null);
    onSubmit({ ...billDetails, billItems });
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                        <input type="number" min="0" step="0.01" value={item.amount} onChange={e => handleItemChange(idx, 'amount', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter total amount" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <input type="text" value={billDetails.promoCode} onChange={e => handleBillDetailsChange('promoCode', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter promo code" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Unique Code</label>
                  <input type="text" value={billDetails.customUniqueCode} onChange={e => handleBillDetailsChange('customUniqueCode', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter unique code" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Service Charge</label>
                  <input type="number" min="0" value={billDetails.platformServiceCharge} onChange={e => handleBillDetailsChange('platformServiceCharge', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
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
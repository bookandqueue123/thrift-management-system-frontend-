
'use client'
import { ChangeEvent, FormEvent, useState } from 'react';

interface setUpSavingsProps{
  accountType: string,
    percentageBased: string,
    amountBased: string,
    accountNumber: string,
    accountName: string,
    purpose: string,
    amount: string,
    frequency: string,
    startDate: string,
    endDate: string,
    collectionDate: string
}
const Form = () => {
  const [formData, setFormData] = useState<setUpSavingsProps>({
    accountType: 'individual',
    percentageBased: '',
    amountBased: '',
    accountNumber: '',
    accountName: '',
    purpose: '',
    amount: '',
    frequency: '',
    startDate: '',
    endDate: '',
    collectionDate: ''
  });

  const [errors, setErrors] = useState<Partial<setUpSavingsProps>>({});

  const handleChange = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'accountNumber') {
      // Your logic to fetch and fill accountName based on accountNumber
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      console.log(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data : setUpSavingsProps) : Partial<setUpSavingsProps>=> {
    let errors: Partial<setUpSavingsProps> = {};
  
    if (!data.percentageBased && !data.amountBased) {
      errors.percentageBased = 'Either Percentage Based or Amount Based is required';
      errors.amountBased = 'Either Percentage Based or Amount Based is required';
    }
  
    if (!data.accountNumber) {
      errors.accountNumber = 'Account Number is required';
    }
  
    if (!data.accountName) {
      errors.accountName = 'Account Name is required';
    }
  
    if (!data.purpose) {
      errors.purpose = 'Purpose is required';
    }
  
    if (!data.amount) {
      errors.amount = 'Amount is required';
    }
  
    if (!data.frequency) {
      errors.frequency = 'Frequency is required';
    }
  
    if (!data.startDate) {
      errors.startDate = 'Start Date is required';
    }
  
    if (!data.endDate) {
      errors.endDate = 'End Date is required';
    }
  
    if (!data.collectionDate) {
      errors.collectionDate = 'Collection Date is required';
    }
  
    // Add more validation rules as needed
  
    return errors;
  };
  
  return (
    <div className="">
      <div className="mb-4 space-y-2 md:ml-[15%]">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          Settings
        </p>
      </div>
      <div className='md:ml-[15%] bg-white mt-12'>
        <h2 className="font-bold p-4">ADMIN FEE</h2>
        <div className=" pl-12 pt-1">
        <h1 className="text-sm font-semibold mb-2">Admin Fee (Kindly select your most prefered administrative fee)</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              
              <div className="">
                
                  <input
                    type="radio"
                    name="accountType"
                    value="individual"
                    checked={formData.accountType === 'individual'}
                    onChange={handleChange}
                    className="form-radio cursor-pointer"
                  />
                  <span className="ml-4 text-sm font-medium capitalize text-[#7D7D7D]">Individual(percentage-based)</span>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    value="savings"
                    checked={formData.accountType === 'savings'}
                    onChange={handleChange}
                    className="form-radio cursor-pointer "
                  />
                  <span className="ml-4 text-sm font-medium capitalize text-[#7D7D7D]">Savings amount based (daily)</span>
                </label>
              </div>
            </div>

            {formData.accountType === "individual" && (
              <div className="mb-4 w-[60%]">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Individual (Percentage Based)</label>
              <input
                type="number"
                name="percentageBased"
                value={formData.percentageBased}
                onChange={handleChange}
                className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white "
                placeholder='input percentage' 
                required 
              />
              {errors.percentageBased && <p className="text-red-500">{errors.percentageBased}</p>}
            </div>
            )}
            
            {formData.accountType === "savings" && (
              <div className="mb-4 w-[60%]">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Savings amount based (daily)</label>
              <input
                type="number"
                name="amountBased"
                value={formData.amountBased}
                onChange={handleChange}
                className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white "
              />
              {errors.amountBased && <p className="text-red-500">{errors.amountBased}</p>}
            </div>
            )}


            <div className='mr-[8%]'>
              <p className='text-sm font-bold mb-2'>Savings Settings</p>
              <hr/>
            
                <div className='md:flex flex-between mt-4'>
                  <div className="mb-4 md:w-[50%] md:mr-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white "
                    />
                    {errors.accountNumber && <p className="text-red-500">{errors.accountNumber}</p>}
                  </div>

                  <div className="mb-4 md:w-[50%] md:ml-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer Account Name</label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white "
                    readOnly // Prevents user from editing this field directly
                  />
                  {errors.accountName && <p className="text-red-500">{errors.accountName}</p>}
                </div>
              </div>
              
            
              <div className="mb-4 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="form-select bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                >
                  <option value="">Select Purpose</option>
                  {/* Add options for purposes */}
                </select>
                {errors.purpose && <p className="text-red-500">{errors.purpose}</p>}
              </div>
              
              <div className='md:flex justify-between'>
                <div className="mb-4 md:w-[50%] md:mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                  <input
                    type="number"
                    name="text"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-input bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                  />
                  {errors.amount && <p className="text-red-500">{errors.amount}</p>}
                </div>

                <div className="mb-4 md:w-[50%] md:ml-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="form-select bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                >
                  <option value="">Select Frequency</option>
                  {/* Add options for frequency */}
                </select>
                {errors.frequency && <p className="text-red-500">{errors.frequency}</p>}
              </div>
              </div>
              
              <div>
                <h2 className='text-[#7D7D7D] text-sm font-semibold'>Savings duration(kindly select the range this savings is to last)</h2>
                <div className='flex flex-between'>
                  <div className="mb-4 mr-2 md:mr-4 w-[50%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="form-input bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                    />
                    {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
                  </div>

                  <div className="mb-4 ml-2 md:ml-4 w-[50%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="form-input bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                      />
                    {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
                  </div>
                </div>
              </div>
             
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Collection Date</label>
                <input
                  type="date"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleChange}
                  className="form-input bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                />
                {errors.collectionDate && <p className="text-red-500">{errors.collectionDate}</p>}
                </div>
                  
            </div>  
            <div className="flex justify-center md:w-[100%] mb-8">
    
                  <button className='rounded-md bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500 py-5 px-9 text-sm text-ajo_offWhite w-100 md:w-[60%]'>Submit</button>
                </div>
          </form>
        </div>  
      </div>  
    </div>
  );
};

export default Form;

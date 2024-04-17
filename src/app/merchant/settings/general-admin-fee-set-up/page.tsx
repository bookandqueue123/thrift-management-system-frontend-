
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
    <div className="flex flex-col ">
      <div className="mb-4 space-y-2 md:ml-[15%] ">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          Settings
        </p>
      </div>
      
      <div className='border md:ml-[30%] md:mr-[15%] bg-white mt-[10%] p-8'>
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
                  <span className="ml-4 text-sm font-medium capitalize text-[#7D7D7D]">General(percentage-based)</span>
              </div>
             
            </div>


              <div className="mb-4 w-[100%]">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">General(percentage- based):</label>
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
        
            <div className="flex justify-center md:w-[100%] my-8">
    
                <button className='rounded-md bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500 py-2 px-9 text-sm text-ajo_offWhite w-100 md:w-[60%]'>Submit</button>
            </div>
          </form>
        </div>  
      </div>  
    </div>
  );
};

export default Form;

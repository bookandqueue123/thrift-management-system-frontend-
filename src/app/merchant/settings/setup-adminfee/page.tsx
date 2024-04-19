
'use client'
import { useAuth } from '@/api/hooks/useAuth';
import { CustomButton } from '@/components/Buttons';
import ErrorModal from '@/components/ErrorModal';
import Modal from '@/components/Modal';
import SuccessModal from '@/components/SuccessModal';
import { selectOrganizationId } from '@/slices/OrganizationIdSlice';
import { customer } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import Image from 'next/image';
import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { useSelector } from 'react-redux';

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
    totalexpectedSavings: string,
    collectionDate: string,
    userId: string
}
const Form = () => {
  const { client } = useAuth();
  const organisationId = useSelector(selectOrganizationId);

  const [showModal, setShowModal] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<setUpSavingsProps>({
    accountType: 'individual',
    percentageBased: '',
    amountBased: '',
    accountNumber: '',
    accountName: '',
    purpose: '',
    amount: '',
    userId: '',
    frequency: '',
    startDate: '',
    endDate: '',
    totalexpectedSavings: '',
    collectionDate: ''
  });


  const [totalexpectedSavings, setTotalExpectedSavings] = useState("")
  const [filterAccountNumbers, setFilteredAccountNumbers] = useState<customer[] | undefined>([]) 
  const [errors, setErrors] = useState<Partial<setUpSavingsProps>>({});

  useEffect(() => {
     const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = (Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1);
    
    const totalsavings = (differenceInDays * Number(formData.amount))
    setTotalExpectedSavings(String(totalsavings))
  }, [formData.amount, formData.startDate, formData.endDate])
  // const TotalExpectedSavings = () => {
   
  // };
  
  
  const {
    mutate: SetupSavings,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["savingsSetup"],
    mutationFn: async (values) => {
      return client.post(`/api/saving`, {
        purposeName: formData.purpose,
        amount: formData.amount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        organisation: organisationId,
        frequency: formData.frequency,
        users: [formData.userId],
        dailyBased: formData.amountBased,
        individualBased : formData.percentageBased
      });
    },
    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true);
      setSuccessMessage(response.data.message);
      console.log(response);
      setShowModal(true)
      // router.push(`/signin`);
    },
    onError(error: AxiosError<any, any>) {
      setShowError(true)
      setShowErrorToast(true);
      setErrorMessage(                                   
        error.response?.data.message || "Error creating organization",
      );
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      console.log(formData);
       SetupSavings()
      setShowModal(true)

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
    // if (!data.totalexpectedSavings) {
    //   errors.totalexpectedSavings = 'Total Expected Savings within the duration is expected to be filled';
    // }
  
    if (!data.collectionDate) {
      errors.collectionDate = 'Collection Date is required';
    }
  
    // Add more validation rules as needed
  
    return errors;
  };
  
  const { data: allCustomers, isLoading: isLoadingAllCustomers } = useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      return client
        .get(
          `/api/user?role=customer&organisation=${organisationId}&userType=individual`,
          {},
        ) //populate this based onthee org
        .then((response: AxiosResponse<customer[], any>) => {
          
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error);
          throw error;
        });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // TotalExpectedSavings()
    setFormData({ ...formData, [name]: value });
  
    if (name === 'accountNumber') {
      if (!value) {
        setFilteredAccountNumbers([]);
        setFormData((prevData) => ({ ...prevData, accountName: '' }));
      } else {
        const customer = allCustomers?.filter((customer) => String(customer.accountNumber).includes(String(value)));
        setFilteredAccountNumbers(customer);
        if (customer && customer.length > 0) {
          setFormData((prevData) => ({ ...prevData, accountName: `${customer[0].firstName} ${customer[0].lastName}` }));
        } else {
          setFormData((prevData) => ({ ...prevData, accountName: '' }));
        }
      }
    }
  };
  const handleAccountNumberClick = (accountNumber: string, firstName: string, lastName: string, userId:string) => {
    setFormData({ ...formData, accountNumber, accountName: `${firstName} ${lastName}`, userId });
    
    setFilteredAccountNumbers([])
  };


  

  return (
    <div className="">
      {showModal ? (
        <SuccessModal
        title='Savings Set Up'
        successText='Savings set up Successfully'
        setShowModal={setShowModal}
        />
      ): ""
    }
      {showError ? (
        <ErrorModal
        title='Savings Set Up Error'
        errorText='Savings set up Failed'
        setShowModal={setShowError}
        />
      ): ""
      
    }
      
      <div className="mb-4 space-y-2 md:ml-[15%]">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          Settings
        </p>
      </div>
      <div className='md:ml-[15%] bg-white mt-12'>
        <h2 className="font-bold p-4">SAVING SETUP AND ADMIN FEE</h2>
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
                <div className="relative mb-4 md:w-[50%] md:mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Customer Account Number</label>
                  <div className="flex items-center border rounded-md">
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="bg-gray-50 border-none text-black text-sm rounded-md block w-full p-3 pl-10 pr-3 dark:bg-gray-700 dark:placeholder-black dark:text-white"
                      placeholder="Search..."
                    />
                    <IoMdSearch className="absolute left-3 h-6 w-6 text-gray-400 dark:text-gray-300" />
                  </div>
                  {filterAccountNumbers?.length !== 0 && (
                  <div className="rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    {filterAccountNumbers?.map((account, index) => (
                      <p
                        key={index}
                        onClick={() => handleAccountNumberClick(String(account.accountNumber), account.firstName, account.lastName, account._id)}
                        className="block cursor-pointer px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                      >
                        {account.accountNumber}
                      </p>
                    ))}
                  </div>
)}
                  
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
                     readOnly// Prevents user from editing this field directly
                  />
                  {filterAccountNumbers?.length !== 0 ? (
                    <div className="rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    {filterAccountNumbers && filterAccountNumbers.map((account, index) => (
                      <p
                      onClick={() => console.log(index)}
                       key={index} 
                       className={` block cursor-pointer px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue`}
                      >
                        {account.firstName} {account.lastName}
                      </p>
                    ))}
                  </div>
                  ): ""}
                  {errors.accountName && <p className="text-red-500">{errors.accountName}</p>}
                </div>
              </div>
              
            
              <div className="mb-4 w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Savings Purpose</label>
                <input
                  name="purpose"
                  type='text'
                  value={formData.purpose}
                  onChange={handleChange}
                  className="form-select bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                />
                 
                {errors.purpose && <p className="text-red-500">{errors.purpose}</p>}
              </div>
              
              <div className='md:flex justify-between'>
                <div className="mb-4 md:w-[50%] md:mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Saving Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-input bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                  />
                  {errors.amount && <p className="text-red-500">{errors.amount}</p>}
                </div>

                <div className="mb-4 md:w-[50%] md:ml-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Saving Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                   onChange={handleChange}
                  className="form-select bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                >
                  <option value="">Select Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
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

                <div className="mb-4 w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total Expected Savings within the duration(debit)</label>
                  <input
                    readOnly
                    name="totalexpectedSavings"
                    type='text'
                    value={totalexpectedSavings}
                    // onChange={handleChange}
                    className="form-select bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                  />
                  
                  {/* {errors.totalexpectedSavings && <p className="text-red-500">{errors.totalexpectedSavings}</p>} */}
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
    
                  <button 
                    
                    className='rounded-md bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500 py-5 px-9 text-sm text-ajo_offWhite w-100 md:w-[60%]'>Submit</button>
                </div>
          </form>
        </div>  
      </div>  
    </div>
  );
};

export default Form;


'use client'
import { useAuth } from '@/api/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import { selectOrganizationId } from '@/slices/OrganizationIdSlice';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';
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
  const { client } = useAuth();
  const organisationId = useSelector(selectOrganizationId);
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
  const [showModal, setShowModal] = useState(false)
  const [showError, setShowError] = useState(false)
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

  const {
    mutate: SetupGeneralSavings,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["generalSavingsSetup"],
    mutationFn: async () => {
      return client.put(`api/user/${organisationId}`, {
        
        adminFee: formData.percentageBased
      });
    },
    onSuccess(response: AxiosResponse<any, any>) {
      
      setShowModal(true)
      // router.push(`/signin`);
      setFormData({
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
      })
    },
    onError(error: AxiosError<any, any>) {
      setShowError(true)
     
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      SetupGeneralSavings()
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
  
    
  
    // Add more validation rules as needed
  
    return errors;
  };
  
  return (
    <div className="flex flex-col ">
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

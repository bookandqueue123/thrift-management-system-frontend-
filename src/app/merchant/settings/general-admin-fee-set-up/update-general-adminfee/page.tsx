
'use client'
import { useAuth } from '@/api/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import { selectOrganizationId, selectUser } from '@/slices/OrganizationIdSlice';
import SuccessModal from '@/components/SuccessModal';
import ErrorModal from '@/components/ErrorModal';
import { CustomButton } from '@/components/Buttons';
import Image from 'next/image';
import { usePermissions } from '@/api/hooks/usePermissions';
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


export default function Page(){
  const [successModal, setSuccessModal ] = useState(false)
  const [modalState, setModalState] = useState(false);

  const user = useSelector(selectUser)
  const { userPermissions, permissionsLoading, permissionsMap } =
   usePermissions();
 
   if(user?.role === "staff" || user?.role === "customer" && !userPermissions.includes(permissionsMap["set-saving"])){
     return <div className="text-center text-3xl text-white mt-12">You are unauthorized</div>;
   }
  return (
    <div className="">

      <div className="mb-4 space-y-2 ">
        <p className="text-2xl font-bold text-ajo_offWhite text-opacity-60">
          Settings
        </p>
        
        <p className="text-sm font-bold text-ajo_offWhite">Savings settings</p>
      </div>

      
        {!modalState ? 
        <><div className="mx-auto mt-[20%] flex h-screen w-[80%] flex-col items-center gap-8 md:mt-[10%] md:w-[40%]">
        <Image
          src="/receive-money.svg"
          alt="hand with coins in it"
          width={120}
          height={120}
          className="w-[5rem] md:w-[7.5rem]"
        />
        <p className="text-center text-sm text-ajo_offWhite">
          Update General admin fee of all the customers in the organisation. Make all the necessary edits and changes. Use
          the button below to get started!
        </p>

       
        <CustomButton
          type="button"
          label="Savings SetUp"
          style="rounded-md bg-indigo-800 py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
          onButtonClick={() => setModalState(true)}
        /></div>
        </>
        : <Form 
          setModalState={setModalState} 
          
          />
        }
        
      
      
        
          
     
    </div>
  );
}

const Form = ({setModalState}:  {setModalState: Dispatch<SetStateAction<boolean>>}) => {
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
  const {
    data: organizations,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganizations"],
    queryFn: async () => {
    
      return client
        .get(`/api/user/${organisationId}`, {})
        .then((response) => {
          setFormData((prevData) => ({...prevData, percentageBased:response.data.adminFee          }))
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });


  return (
    <div className="flex flex-col ">
    {showModal ? (
        <SuccessModal
        title='General admin fee'
        successText='General admin fee updated successfully'
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
      {/* <div className="mb-4 space-y-2 md:ml-[15%] ">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          Settings
        </p>
      </div> */}
      
      <div className='border md:ml-[30%] md:mr-[15%] bg-white mt-[5%] mb-8 p-8'>
      <div className='flex justify-between'>
          <h2 className="font-bold p-4">UPDATE GENERAL SAVING SETUP AND ADMIN FEE</h2>
          <div
            onClick={() => setModalState(false)}
            className="mr-8 cursor-pointer pt-2"
          >
             <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                className="h-[16px] w-[16px] md:h-[32px] md:w-[32px]"
            >
                <path
                    d="M48 16L16 48M16 16L48 48"
                    stroke="black" 
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>

          </div>
          </div>
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



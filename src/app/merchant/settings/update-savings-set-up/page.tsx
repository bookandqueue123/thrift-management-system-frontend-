'use client'

import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton } from "@/components/Buttons";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { useSelector } from "react-redux";
import { AxiosError, AxiosResponse } from 'axios';
import { allSavingsResponse, customer, setUpSavingsProps } from "@/types";
import { extractDate } from "@/utils/TimeStampFormatter";
import { usePermissions } from "@/api/hooks/usePermissions";
export default function UpdateSavingsSetup(){
    const [modalState, setModalState] = useState(false);
    const user = useSelector(selectUser)
    const { userPermissions, permissionsLoading, permissionsMap } = usePermissions();

    if(user?.role === "staff" || user?.role === "customer" && !userPermissions.includes(permissionsMap["set-saving"])){
      return <div className="text-center text-3xl text-white mt-12">You are unauthorized</div>;
    }
    return(
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
          Update your savings set up for any customer in the organisation. Make all the necessary edits and changes. Use
          the button below to get started!
        </p>

       
        <CustomButton
          type="button"
          label="Update Savings SetUp"
          style="rounded-md bg-indigo-800 py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
          onButtonClick={() => setModalState(true)}
        /></div>
        </>
        : <Form 
          setModalState={setModalState} 
          
          />
        }
        
    </div>
    )
}

const Form = ({setModalState}:  {setModalState: Dispatch<SetStateAction<boolean>>}) => {
    const { client } = useAuth();
    const user = useSelector(selectUser)
    const organisationId = useSelector(selectOrganizationId);
    const router = useRouter()
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
      collectionDate: '',
      savingID: '',
    
    });
    const [showForm, setShowForm] = useState(false)
    const [customerName, setCustomerName] = useState("null");
    const [selectedCustomer, setSelectedCustomer] = useState("")
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
        return client.put(`/api/saving/${formData.savingID}`, {
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
     
        setShowModal(true)
      
         
        setFormData({
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
        })
      },
      onError(error: AxiosError<any, any>) {
        // setModalState(false)
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
       
          SetupSavings()
       
        //  setModalState(false)
     
  
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
          // console.log(customer[0]._id)
          if (customer && customer.length > 0) {
            setCustomerName(`${customer[0].firstName} ${customer[0].lastName}`)
            setFormData((prevData) => ({ ...prevData, accountName: `${customer[0].firstName} ${customer[0].lastName}` }));
          } else {
            setFormData((prevData) => ({ ...prevData, accountName: '' }));
          }
        }
      }
    };
    const handleAccountNumberClick = (accountNumber: string, firstName: string, lastName: string, userId:string) => {
      setFormData({ ...formData, accountNumber, accountName: `${firstName} ${lastName}`, userId });
      setSelectedCustomer(userId)
      setFilteredAccountNumbers([])
    };
  
    const { data: allSavings, isLoading: isLoadingAllSavings } = useQuery({
      queryKey: [' selectedCustomer', selectedCustomer],
      staleTime: 5000,
      queryFn: async () => {
      if(selectedCustomer !== ""){
        return client
            .get(`/api/saving/get-savings?user=${selectedCustomer}`)
            .then((response) => {
          
              // setFilteredSavings(response.data.savings)
              return response.data;
            })
            .catch((error: AxiosError<any, any>) => {
          
              throw error;
            });
          }
          else{
          return []
          }
      }
        
    });

    const handleSavingsClick = (id:any) => {
    
      const selectedSaving = allSavings.savings.filter((saving: { _id: string; }) => saving._id === id )

      
      
      if(selectedSaving && selectedSaving.length > 0){
        
        setShowForm(true)
        setFormData((prevData) => ({...prevData,
          accountName: customerName,
         amountBased: selectedSaving[0].dailyBased,
         percentageBased: selectedSaving[0].individualBased,
         amount:selectedSaving[0].amount,
         frequency:selectedSaving[0].frequency,
         startDate: extractDate(selectedSaving[0].startDate),
        endDate: extractDate(selectedSaving[0].endDate),
        purpose: selectedSaving[0].purposeName,
        collectionDate: extractDate(selectedSaving[0].collectionDate),
        savingID: selectedSaving[0]._id

        }))
      }else{
        
        setFormData((prevData) => ({ ...prevData, accountName: '' }));
      }
      
   }

  
    return (
      <div className="">
        
        {showModal ? (
          <SuccessModal
          title='Successful'
          successText='Savings updated Successfully'
          setShowModal={setShowModal}
          />
        ): ""
      }
        {showError ? (
          <ErrorModal
          title='Error'
          errorText='Error updating saving'
          setShowModal={setShowError}
          />
        ): ""
        
      }
      
        
        {/* <div className="mb-4 space-y-2 md:ml-[15%]">
          <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
            Settings
          </p>
        </div> */}
        
        <div className='md:ml-[15%] bg-white mt-12'>
          <div className='flex justify-between'>
            <h2 className="font-bold p-4">UPDATE SAVING SETUP AND ADMIN FEE</h2>
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
            
          
            <form onSubmit={handleSubmit}>
              <div className="md:flex justify-between">
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

                <div className="relative mb-4 md:w-[50%] md:mr-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Savings Purpose</label>
                  <select
                    name="savingID"
                    value={formData.savingID}
                    onChange={handleChange}
                     onClick={(e) => handleSavingsClick((e.target as HTMLSelectElement).value)}
                    className="form-select bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white"
                  >
                    <option value="">Select Savings</option>
                    {allSavings && allSavings?.savings?.map((saving: allSavingsResponse, index: number) => (
                      <option
                       
                       key={saving._id} value={saving._id}>
                        {saving.purposeName}
                      </option>
                    ))}
                  </select>
                  
                    {errors.accountNumber && <p className="text-red-500">{errors.accountNumber}</p>}
                </div>
              </div>
                
              
              <div className="mb-4">
                <h1 className="text-sm font-semibold mb-2">Admin Fee (Kindly select your most prefered administrative fee)</h1>
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

                  
                  
                  {showForm ?
                   <>
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
                      {filterAccountNumbers && filterAccountNumbers?.map((account, index) => (
                        <p
                        
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
                    
              </> : ""}
              </div>  
              {showForm ? 
                <div className="flex justify-center md:w-[100%] mb-8">
        
                  <button 
                        
                        className='rounded-md bg-ajo_blue hover:bg-indigo-500 focus:bg-indigo-500 py-5 px-9 text-sm text-ajo_offWhite w-100 md:w-[60%]'>Submit</button>
                  </div> : ""
                } 
            </form>
          </div>  
        </div>   
       
      </div>
    );
  };
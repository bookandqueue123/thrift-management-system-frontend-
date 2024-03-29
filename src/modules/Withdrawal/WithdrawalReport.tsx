import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import DummyTransactions from "@/api/dummyTransactions.json";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/api/hooks/useAuth";
import { WithdrawalProps } from "@/types";
import StatusBadge, { Badge } from "@/components/StatusBadge";
import { useSelector } from "react-redux";
import { selectUser } from "@/slices/OrganizationIdSlice";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import Modal from "@/components/Modal";
import Image from "next/image";

export default function WithdrawalReport(){
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [withdrawalId, setWithdrawalId] = useState("")
 
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalProps[]>([])
    const userId = useSelector(selectUser)
    const router = useRouter();
    const [paymentConfirmation, setpaymentConfirmation] = useState("")

    const { client } = useAuth();

 const handleUploadBtnClick = (withdrawalId: string) => {
    setIsModalOpen(true);
    setWithdrawalId(withdrawalId)
  };
    const handleImageChange = (event: { target: { files: FileList | null; }; }) => {
      if(event.target.files){
         const file = event.target.files[0];
      setSelectedImage(file);
      }
     
    };
  
    const handleSubmit = () => {
      // Logic to handle image submission
     
      setIsModalOpen(false);
      if (!selectedImage) {
        alert('Please select an image.');
        return;
      }
      uploadReceipt()
    
      
    };

    const {mutate: uploadReceipt} = useMutation({
      mutationKey: ['upload receipt'],
      mutationFn: async() => {

    
        const formData = new FormData();
        formData.append('paymentEvidence', selectedImage);
  
        // Send the file to the backend
        return client.put(`/api/withdrawal/${withdrawalId}`, formData)
        

    
      },
      onSuccess(response: AxiosResponse<any>) {
        alert('Receipt submitted successfully!');
        console.log(response)
        // router.push('/merchant/settings/withdrawals')
        
      },
      onError(error: AxiosError<any, any>) {
      
  
        console.log(error);
      },
    })

    // const handleFileUpload = async (e) => {
    //   const file = e.target.files[0];
    //   if (!file) return; // If no file is selected, do nothing
    //   try {
    //     const formData = new FormData();
    //     formData.append('file', file);
  
    //     // Send the file to the backend
    //     const response = await axios.post('/api/upload', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     });
    //     console.log('File uploaded:', response.data);
    //   } catch (error) {
    //     console.error('Error uploading file:', error);
    //   }
    // };


    const { mutate: UpdateCofirmationStatus } = useMutation({
      mutationFn: async (updatedConfirmationPaymentRow: WithdrawalProps) => {
        console.log(updatedConfirmationPaymentRow)
  
        console.log(updatedConfirmationPaymentRow.paymentConfirmation)
        return client.put(`/api/withdrawal/${updatedConfirmationPaymentRow._id}`, {
          paymentConfirmation: updatedConfirmationPaymentRow.paymentConfirmation
          // status: "paid"
        });

      },
      onSuccess(response: AxiosResponse<any>) {
        console.log(response)
        // router.push('/merchant/settings/withdrawals')
        router.refresh()
      },
      onError(error: AxiosError<any, any>) {
      
  
        console.log(error);
      },
    });

    

    const {
        data: withdrawals,
        isLoading: isWithdrawalLoading,
        isError: withDrawerError,
      } = useQuery({
        queryKey: ["allWithdrawals", withdrawalData],
        queryFn: async () => {
          return client
            .get(`/api/withdrawal?user=${userId}`, {})
            .then((response) => {
              setWithdrawalData(response.data)
              return response.data;
            })
            .catch((error) => {
              console.log(error);
              throw error;
            });
        },
      });
     console.log(withdrawals)

     const handleStatus = (index: number) =>{
      console.log(index)
      const newData = [...withdrawalData]
      console.log(newData)
      newData[index].paymentConfirmation = newData[index].paymentConfirmation === 'unconfirmed' ? 'confirmed' : 'unconfirmed';
      
      setWithdrawalData(newData)
      console.log(withdrawalData)
      // updateStatus(newData[index])
      UpdateCofirmationStatus(newData[index])


    }
     
    return(
        <div className="mt-16">
    
        <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="md:flex items-center gap-3">
            <p className="text-white">Withdrawal Report</p>
            {/* <SearchInput onSearch={() => ("")}/> */}
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
      <input
      onChange={(e) => console.log(12)}
        type="search"
        placeholder="Search"
        className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
      />
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <circle
          cx="8.60996"
          cy="8.10312"
          r="7.10312"
          stroke="#EAEAFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.4121 13.4121L16.9997 16.9997"
          stroke="#EAEAFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </form>
            
             
          </span>
          <span className="flex items-center gap-3">
            
            <FilterDropdown
              options={[
                "Customer Account",
                "Saving Purpose",
                "Transaction Date & Time",
                "Amount",
                "Narration",
                "Reference ID",
                "Status",
                "Payment Confirmation ",
                "Withdrawer Request",
                "Evidence of payment"

              ]}
            />
          </span>
          
        </div>

        <div>
            {withdrawals && 
        <TransactionsTable
            headers={[
            "Customer Account",
            "Saving Purpose",
            "Transaction Date & Time",
            "Amount",
            "Narration",
            "Reference ID",
            "Status",
            "Payment Confirmation",
            // "Withdrawal Request",
              "Upload Evidence of Receipt"
          ]}
            content={withdrawals?.map((withdrawal:WithdrawalProps, index:number) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {withdrawal.user.accountNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {withdrawal.saving}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                {withdrawal.updatedAt ? 
                    new Date(withdrawal.updatedAt).toLocaleDateString() : 
                    'Invalid Date'} {withdrawal.updatedAt ? 
                        new Date(withdrawal.updatedAt).toLocaleTimeString() : 
                        'Invalid Date'}

                </td>


                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {AmountFormatter(Number(withdrawal.amount))} NGN
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {withdrawal._id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusBadge status={withdrawal.status}/>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                
                
                {/* <Badge status={withdrawal.paymentConfirmation} onClick={() => console.log(12)}/> */}
                <div className="">
                    <button 
                    style={{
                      borderRadius: '5px',
                      padding: '4px',
                       backgroundColor: withdrawal.paymentConfirmation === 'confirmed' ? 'green' : '#FF535B',
                      color: withdrawal.paymentConfirmation === 'confirmed' ? 'white' : 'white'
                    }}
                        onClick={() => handleStatus(index)}>
                      {withdrawal.paymentConfirmation === 'confirmed' ? 'Confirmed' : 'Unconfirmed'}
                    </button>
                  </div>
                </td>

                {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                
                <Badge status={withdrawal.withdrawalRequest} onClick={(() => "")}/>
                </td> */}


                <td className="whitespace-nowrap px-6 py-4 text-sm">
                
                <label className="bg-[#F2F2F2] hover:bg-white text-[#090E2C] font-bold py-2 px-4 rounded flex items-center cursor-pointer">
                
                {/* <span className="ml-4 mr-4">
                  <FiUpload/>
                </span>
                
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    //  onChange={() => (UpdateWithdrawalConfirmation(withdrawal))}
                    accept="image/*,.pdf,.doc,.docx,.txt" // Accept images and common document formats
                  /> */}

<button
                className="  font-bold  rounded"
                onClick={() => handleUploadBtnClick(withdrawal._id)}
              >
                Upload Evidence
              </button>
                </label>

                </td>

              </tr>
            ))}
          />}
           {/* Modal */}
          
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-dark text-white">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      Upload Evidence
                    </h3>
                    <div className="mt-5">
                      <input type="file" onChange={handleImageChange} className="mt-2" accept="image/*" />
                      {selectedImage && (
                        <Image width={500} height={500} src={URL.createObjectURL(selectedImage)} alt="Selected" className="mt-4 mx-auto" style={{ maxWidth: '200px' }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
          <PaginationBar apiResponse={DummyTransactions} />
        </div>
      </section>
        </div>
    )
}
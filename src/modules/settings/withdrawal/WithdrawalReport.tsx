import { useAuth } from "@/api/hooks/useAuth";
import { FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import StatusBadge, { Badge } from "@/components/StatusBadge";
import TransactionsTable from "@/components/Tables";
import { WithdrawalProps } from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import DummyTransactions from "@/api/dummyTransactions.json";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";
import Image from "next/image";
import Link from "next/link";
export default function WithDrawalReportSettings(){
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalProps[]>([])

  const [status, setStatus] = useState("");
  const [imageURL, setImageURL] = useState("");

 
    const { client } = useAuth();
    const router = useRouter()
    
    const handleViewImage = (imageURL: string) => {
        setImageURL(imageURL);
      };
    const { mutate: UpdateWithdrawalConfirmation } = useMutation({
      mutationFn: async (withdrawalId: string) => {

        
        return client.put(`/api/withdrawal/${withdrawalId}`, {
          withdrawalRequest: "confirmed",
          status: "paid"
        });
      },
      onSuccess(response: AxiosResponse<any>) {
        
        console.log(response)
        router.push('/merchant/settings/withdrawals')
        router.refresh()
      },
      onError(error: AxiosError<any, any>) {
      
  
        console.log(error?.response?.data);
      },
    });
    const {
        data: withdrawals,
        isLoading: isWithdrawalLoading,
        isError: withDrawerError,
      } = useQuery({
        queryKey: ["allWithdrawals",],
        queryFn: async () => {
          return client
            .get(`/api/withdrawal`, {})
            .then((response) => {
              console.log(response)
              setWithdrawalData(response.data)
              return response.data;
            })
            .catch((error) => {
              console.log(error);
              throw error;
            });
        },
      });
      
      // const handleBadgeClick = (savingId) => {
      //   console.log('Badge clicked!', savingId); // You can replace this with any function you want to run
      // };


      // const handleStatusClick = (e, id) => {
      //   const updatedStatusString = e.target.value === 'unpaid' ? 'paid' : 'unpaid';
      //   console.log(updateStatus)
      //   setStatus(updatedStatusString);
        
      //   // Call function to send updated status to backend
      //   updateStatus(id);
      // };
    
      const { mutate: updateStatus } = useMutation({
        mutationKey: [withdrawalData],
        mutationFn: async ( UpdatedStatusRow: WithdrawalProps) => {
          console.log(UpdatedStatusRow)
          console.log(UpdatedStatusRow.status)
          return client.put(`/api/withdrawal/${UpdatedStatusRow._id}`, {
           
            status: UpdatedStatusRow.status,
            withdrawalRequest: "confirmed",
          });
        },
        onSuccess(response: AxiosResponse<any>) {
          
          console.log(response)
          // router.push('/merchant/settings/withdrawals')
          router.refresh()
        },
        onError(error: AxiosError<any, any>) {
        
    
          console.log(error?.response?.data);
        },
      });

      const handleStatus = (index: number) =>{
        const newData = [...withdrawalData]
        newData[index].status = newData[index].status === 'paid' ? 'unpaid' : 'paid';
        setWithdrawalData(newData)
        
        updateStatus(newData[index])

  
      }
    return(
        <div>
            <section className="mt-4">
                <h1 className="text-xxl text-white mb-8">Settings</h1>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          
          <span className="md:flex items-center gap-3">
            
            <FilterDropdown
              options={[
                "Customer Account",
                "Saving Purpose",
                "Transaction Date & Time",
                "Amount",
                "Narration",
                "Reference ID",
                "Status",
                "Withdrawal Request",
                "Payment Confirmation"
                
              ]}
            />
            {/* <SearchInput onSearch={() => ("")}/> */}
            
            {/* <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3"> */}
              {/* <input
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
            </form> */}
             
          </span>
          <span className="flex items-center gap-3">
            
          <p className="text-white">Export Withdrawal Report</p>
          </span>
          
        </div>

        <div>
            {/* {withdrawals &&  */}
        <TransactionsTable
            headers={[
            "Customer Account",
            "Saving Purpose",
            "Transaction Date & Time",
            "Amount",
            "Narration",
            "Reference ID",
            "Status",
            "Withdrawal Request",
            "Payment Confirmation ",
            "Evidence of Payment"
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

                 {/* <Badge status={withdrawal.status} onClick={() => ""}/>  */}
                  
                  <div className="">
                    <button 
                    style={{
                      borderRadius: '5px',
                      padding: '4px',
                      backgroundColor: withdrawal.status === 'paid' ? 'green' : '#FF535B',
                      color: withdrawal.status === 'paid' ? 'white' : 'white'
                    }}
                        onClick={() => handleStatus(index)}>
                      {withdrawal.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </button>
                  </div>
                 
                  
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                {/* <StatusBadge status={withdrawal.withdrawalRequest} /> */}
                <Badge status={withdrawal.withdrawalRequest} onClick={(() => "")}/>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                
                
                {/* <Badge status={withdrawal.paymentConfirmation} onClick={() => console.log(12)}/> */}
                  <div className="">
                    <button 
                    style={{
                      borderRadius: '5px',
                      padding: '4px',
                      // backgroundColor: withdrawal.status === 'paid' ? 'green' : '#FF535B',
                      color: withdrawal.paymentConfirmation === 'confirmed' ? 'green' : '#FF535B'
                    }}
                        // onClick={() => handleStatus(index)}
                        >
                      {withdrawal.paymentConfirmation === 'confirmed' ? 'Confirmed' : 'Unconfirmed'}
                    </button>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm">
                {withdrawal.paymentEvidence ? (
                  <Link target="_blank" href={withdrawal.paymentEvidence}>
                  <button
                  style={{
                    borderRadius: '5px',
                    padding: '8px',
                    paddingRight: '16px',
                    paddingLeft: '16px',
                    backgroundColor: '#F2F2F2',
                    color: 'black'
                  }}
                  //  onClick={() => router.push(withdrawal.paymentEvidence)}
                   >
                    View Evidence
                    </button>
                  </Link>
                ): 'No Evidence'}
                
                </td>
              </tr>
            ))}
          />
          {imageURL && (
        <div>
          <Image width={1000} height={1000} src={imageURL} alt="Evidence" />
          <button onClick={() => setImageURL("")}>Close</button>
        </div>
      )}
          {/* } */}
          <PaginationBar apiResponse={DummyTransactions} />
        </div>
      </section>
        </div>
    )
}
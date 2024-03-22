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
export default function WithDrawalReportSettings(){
    const { client } = useAuth();
    const router = useRouter()
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
        queryKey: ["allWithdrawals"],
        queryFn: async () => {
          return client
            .get(`/api/withdrawal`, {})
            .then((response) => {

                console.log(response)
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
                "Confirmation Status"
              ]}
            />
            <SearchInput />
            
             
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
            "Confirmation Status"]}
            content={withdrawals?.map((withdrawal:WithdrawalProps, index:string) => (
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
                {/* <StatusBadge status={withdrawal.withdrawalRequest} /> */}
                <Badge status={withdrawal.withdrawalRequest} onClick={(() => UpdateWithdrawalConfirmation(withdrawal._id))}/>
                </td>
              </tr>
            ))}
          />
          {/* } */}
          <PaginationBar apiResponse={DummyTransactions} />
        </div>
      </section>
        </div>
    )
}
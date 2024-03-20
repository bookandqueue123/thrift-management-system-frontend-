import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import DummyTransactions from "@/api/dummyTransactions.json";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/api/hooks/useAuth";
import { WithdrawalProps } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { useSelector } from "react-redux";

export default function WithdrawalReport(){
    
    const router = useRouter();
    const { client } = useAuth();

    

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
              return response.data;
            })
            .catch((error) => {
              console.log(error);
              throw error;
            });
        },
      });
     

      
    return(
        <div className="mt-16">
             <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="md:flex items-center gap-3">
            <p className="text-white">Withdrawal Report</p>
            <SearchInput />
            
             
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
                "Confirmation Status"
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
                <StatusBadge status={withdrawal.paymentConfirmation} />
                </td>
              </tr>
            ))}
          />}
          <PaginationBar apiResponse={DummyTransactions} />
        </div>
      </section>
        </div>
    )
}
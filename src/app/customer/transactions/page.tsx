import DummyTransactions from "@/api/dummyTransactions.json";
import { FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";
import { StatusIndicator } from "../page";

const Transactions = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="min-w-16 truncate text-sm font-semibold text-ajo_offWhite">
            Recent Transactions
          </p>
          <span className="flex items-center gap-3">
            <SearchInput />
            <FilterDropdown
              options={[
                "Timestamp",
                "Name",
                "Email",
                "Phone",
                "Channel",
                "Amount",
                "Status",
              ]}
            />
          </span>
        </div>

        <div>
          <p className="pl-2 text-xs text-ajo_offWhite">
            *Please Scroll sideways to view all content
          </p>
          <TransactionsTable
            headers={["Date", "Reference", "Channel", "Amount", "Status"]}
            content={DummyTransactions.map((transaction, index) => (
              <tr className="" key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.transactionDate}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.reference}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {transaction.channel}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {AmountFormatter(Number(transaction.amount))} NGN
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusIndicator label={transaction.transactionStatus} />
                </td>
              </tr>
            ))}
          />
          <PaginationBar apiResponse={DummyTransactions} />
        </div>
      </section>
    </div>
  );
};

export default Transactions;

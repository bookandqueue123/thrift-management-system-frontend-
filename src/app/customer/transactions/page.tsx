import DummyTransactions from "@/api/dummyTransactions.json";
import { FilterDropdown } from "@/components/Buttons";
import { SearchInput } from "@/components/Forms";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import AmountFormatter from "@/utils/AmountFormatter";

const Transactions = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="min-w-16 truncate text-sm font-semibold text-ajo_offWhite">
            Recent Transactions
          </p>
          <span className="flex items-center gap-3">
            {/* <SearchInput onSearch={() => ("")}/> */}
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
      <input
      onChange={() => console.log(12)}
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

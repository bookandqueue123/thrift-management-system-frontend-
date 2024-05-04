import TransactionsTable from "@/components/Tables";

const data = [
    {
      "S/N": 1,
      "Item/Purpose": "Rent",
      "Debit Amount": 1000,
      "Payment Start": "2024-01-01",
      "Payment End": "2024-12-31",
      "Credit Amount": 0,
      "Balance": -1000,
      "Duration": "1 year"
    },
    {
      "S/N": 2,
      "Item/Purpose": "Electricity Bill",
      "Debit Amount": 50,
      "Payment Start": "2024-04-01",
      "Payment End": "2024-04-30",
      "Credit Amount": 0,
      "Balance": -50,
      "Duration": "1 month"
    },
    {
      "S/N": 3,
      "Item/Purpose": "Groceries",
      "Debit Amount": 200,
      "Payment Start": "2024-04-15",
      "Payment End": "2024-04-30",
      "Credit Amount": 0,
      "Balance": -200,
      "Duration": "15 days"
    },
    // Add more data entries as needed
  ];
  
export default function MakePayment(){
   const textBelow = 
            <div className="flex justify-center">
                <p className="font-bold text-white pt-2">Selected Amount to be Paid</p>
    
                <form className="ml-4">
                    <div className="flex  border">
                        
                        
                            <input type="number" id="search-dropdown" className="bg-ajo_darkBlue text-white block p-2.5  w-full z-20 text-sm  border border-gray-300" placeholder="Total" required />
                            <button type="submit" className="w-full bg-green-400 text-white">
                                Make Payment
                            </button>
                        
                    </div>
                </form>

            </div>
       
    return(
        <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
        <div className="mb-4 space-y-2">
            <h6 className="text-base font-bold text-ajo_offWhite opacity-60">
                Dashboard
            </h6>

            <div>
            <div className="flex items-center mt-16 mb-16">
                <p className="font-lg mr-2 text-white">Select range from:</p>
                <input
                  type="date"
                  // value={fromDate}
                  //  onChange={handleFromDateChange}
                  className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />

                <p className="mx-2 text-white">to</p>
                <input
                  type="date"
                  // value={toDate}
                  // onChange={handleToDateChange}
                  className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            

            <div className="mt-8">
                <TransactionsTable
                    headers={[
                        "",
                        "S/N",
                        "Item/Purpose",
                        "Debit Amount",
                        "Payment Start",
                        "Payment End",
                        "Credit Amount",
                        "Balance",
                        "Duration"
                    ]}
                    content={data.map((payment, index) => (
                        <tr className="" key={index}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                                />
                             </td>
                             <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {payment["S/N"]}
                             </td>
                             <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {payment["Item/Purpose"]}
                             </td>
                             <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {payment["Debit Amount"]}
                             </td>
                             <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {payment["Payment Start"]}
                             </td>
                             <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {payment["Payment End"]}
                             </td>
                             <td className="whitespace-nowrap px-6 py-4 text-sm">
                                
                                <form className="max-w-sm mx-auto">
                                    
                                    <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="90210" required />
                                </form>

                             </td>
                             <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {payment.Balance}
                             </td>
                             <td className="whitespace-nowrap px-6 py-4 text-sm">
                                {payment.Duration}
                             </td>

                        </tr>
                    ))}
                    belowText={textBelow} 
                />
            </div>


            
        </div>
        </div>
       
    )
}
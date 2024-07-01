export default function Page(){
    return(
        <div>
            <div className="mb-4 space-y-2">
                <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
                 Payment Gateway
                </p>
            </div>

            <div className="md:flex items-center">
            <p className="mr-2 font-lg text-white">Select range from:</p>
            <input
              type="date"
            //   value={fromDate}
            //   onChange={handleFromDateChange}
              className="px-4 mt-2 md:mt-0 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />


            <p className="mx-2 text-white">to</p>
            <input
              type="date"
            //   value={toDate}
            //    onChange={handleToDateChange}
              className="px-4 py-2 w-48 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />

            {/* <button 
            
            onClick={handleDateFilter} 
            className="ml-2 px-4 py-2 text-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              Go
              </button> */}
            </div>
        </div>
    )
}
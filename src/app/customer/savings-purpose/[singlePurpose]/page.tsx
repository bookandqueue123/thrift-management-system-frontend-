'use client'
import { useAuth } from "@/api/hooks/useAuth";
import { FilterDropdown } from "@/components/Buttons";
import AmountFormatter from "@/utils/AmountFormatter";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";

const purpose = {
    name: "Annual Charity Marathon",
    description: "Participate in our annual charity marathon to support local causes. This event includes a 5K, 10K, and a half marathon. All levels of runners are welcome!",
    startDate: "2024-09-01",
    endDate: "2024-09-07",
    participants: 500,
    picture: "https://via.placeholder.com/150", // Replace with an actual image URL
    progress: 45, // 45% of the goal achieved
    userName: "Jane Smith"
  };
  
export default function Page(){
    const params = useParams()
    

    const { client } = useAuth();
    const { data: SinglePurpose, isLoading: isLoadingPurpose, isError } = useQuery({
      queryKey: ["purpose"],
      queryFn: async () => {
        return client
          .get(`/api/purpose/${params.singlePurpose}`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            
            throw error;
          });
      },
    });


   const daysLeft = (endDate: string | number | Date) => {
      const today = new Date();
      const end = new Date(endDate);
      const timeDiff = Number(end) - Number(today);
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff;
    }; 
   
    return(
        <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
        <div className="mb-4 space-y-2">
            <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
                Savings Purpose
            </p>
            <p className="text-sm capitalize text-ajo_offWhite">
            Turn Your Dreams into Reality with Finkia’s Savings Purpose,  <span className="text-ajo_orange font-bold">Give Your money a new purpose!</span>
            
            </p>
        </div>

        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
       
            <span className="flex items-center gap-3">
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
                <input
                //   onChange={handleSearch}
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
                placeholder="sort by"
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
            <div role="group" className="flex flex-col-2 justify-between ">
          
            
            
            
          </div>
      </div>
    
    {!SinglePurpose ? (
        <div className="text-white">Loading...</div>
    ): (
        <div>

        <div className="relative p-6 mb-6 rounded-lg shadow-md">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#EBAE48] rounded-lg flex justify-center items-center ">
            <h2 className="text-2xl font-bold text-ajo_darkBlue z-20 mt-[-12rem]">Savings Purpose</h2>
        </div>
    <div className="bg-purposeBg relative z-10 mt-12 rounded-lg shadow-md mx-6">
        <div className="grid grid-cols-1 md:grid-cols-3 p-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold capitalize">{SinglePurpose.purposeName}</h2>
                <h2 className="my-2 font-semibold text-xs text-black">Description</h2>
                <p className="text-xs">{SinglePurpose.description}</p>
                <div className="my-4 flex ">
                    <p className="font-semibold text-xs text-black">Start Date:<br /> {!SinglePurpose.startDate  ? "Nill" : extractDate(SinglePurpose.startDate)}</p>
                    <p className="mr-8 font-semibold text-xs text-black ml-16">End Date: <br /> {!SinglePurpose.endDate ? "Nill" :  extractDate(SinglePurpose.endDate)}</p>
                </div>
                <p className="text-xl font-semibold">No of participants: <br /> {(SinglePurpose.assignedCustomers).length}</p>
            </div>
            <div className="mb-4 flex flex-col items-center mx-8">
                <div className="flex justify-center w-full">
                    <div className="w-full aspect-square rounded-full bg-gray-300 flex items-center justify-center">
                        <Image
                            src={SinglePurpose.imageUrl}
                            alt={SinglePurpose.purposeName}
                            width={200}
                            height={200}
                            className="object-cover transform translate-x-2"
                        />
                    </div>
                </div>
                <p className="my-6 text-center text-2xl font-bold">NGN {AmountFormatter(SinglePurpose.amount)}</p>
            </div>

            <div className="mb-4">
                <h2 className="mb-4 text-xl font-semibold">Savings Progress</h2>
                <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden mb-2">
                    <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `40%` }}></div>
                </div>
                <p className="text-xl font-semibold">How many days left?</p>
                <p className="text-black">{daysLeft(SinglePurpose.endDate)} days left</p>
                <div>
                    <h2 className="mt-4 text-sm font-semibold">Promotional Code</h2>
                    <input type="text" 
                        placeholder="Promo Code" 
                        className="w-full p-2 border border-black text-black rounded-md mb-2 bg-transparent" />

                </div>
                <div className="flex space-x-2 mb-2 mt-8">
                    <button className="w-1/2 p-2 bg-blue-500 text-white rounded-md">Make Full Payment</button>
                    <button className="w-1/2 p-2 bg-transparent border border-black text-black rounded-md">Make Part Payment</button>
                </div>
                <div className="flex justify-between space-x-2 mb-2 mt-8">
                    <p className="text-xl font-semibold">No of participants: <br /> {(SinglePurpose.assignedCustomers.length)}</p>
                    <p className="mr-4 text-xl font-normal">Merchant:<br /> {SinglePurpose.organisation.organisationName}</p>
                </div>
            </div>
        </div>
    </div>
</div>

      </div>
    )}
    
    

    </div>
    )
}
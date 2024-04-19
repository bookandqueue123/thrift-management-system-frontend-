import { useRouter } from "next/navigation"

export default function HowToUse(){
    const router = useRouter()
    return(
        <div className="mx-[4%] mt-24 mb-8">
            <h2 className="text-3xl text-white font-bold">
                How to use Finkia
            </h2>
            <div className="md:flex justify-between my-12">
                <div className="relative">
                    <div className="-rotate-6 max-w-sm px-6 bg-[#EAAB40] rounded-lg shadow ">
                        <button type="button" className="-rotate-12 absolute top-[-10px]  transform  text-dark bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl px-6 py-3 text-center   ">
                        Organisation

                        </button>
                        <p className="mb-3 pt-16 pb-16 font-normal text-gray-700 dark:text-gray-400">Organisations sign Up by providing all necessary information. Organisation can onboard its customers/staff.</p>
                        
                        <button 
                        onClick={() => router.push('/signup/merchant')}
                        type="button" className="mb-16 text-dark bg-white hover:bg-gray-200 font-medium rounded-lg text-sm px-2 py-2 text-center   ">
                        Register as an organisation
                        </button>
                    </div>
                </div>

                
                

                <div className=" mt-16 md:mt-0">
                    <div className="rotate-6 max-w-sm px-6 bg-white rounded-lg shadow ">
                        <button type="button" className="rotate-12 absolute top-[-10px]  transform  text-white bg-[#EAAB40] hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl px-6 py-3 text-center   ">
                            Customer
                        </button>
                        <p className="mb-3 pt-16 pb-16 font-normal text-gray-700 dark:text-gray-400">Customers/Organisations staff can go through Finkia’s self on-boarding process or He/She can be onboarded by an organisation..</p>
                        <button 
                        onClick={() => router.push('/signup/customer')}
                         type="button" className="mb-16 text-white bg-[#EAAB40] font-medium rounded-lg text-sm px-2 py-2 text-center hover:bg-yellow-400  ">
                            Register as a customer
                        </button>
                    </div>
                    
                </div>

            </div>

           
        </div>
    )
}
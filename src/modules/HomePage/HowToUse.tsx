export default function HowToUse(){
    return(
        <div className="mx-[4%] mt-24 mb-8">
            <h2 className="text-3xl text-white font-bold">
                How to use Finkia
            </h2>
            <div className="md:flex justify-between my-12">
                <div className="relative">
                    <div className="-rotate-6 max-w-sm px-6 bg-[#EAAB40] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <button type="button" className="-rotate-12 absolute top-[-10px]  transform  text-dark bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl px-6 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Organisation
                        </button>
                        <p className="mb-3 pt-16 pb-32 font-normal text-gray-700 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin imperdiet consectetur odio quis tempor. Nam fringilla elit felis, a porta elit porttitor vel.</p>
                    </div>
                </div>

                
                

                <div className=" mt-16 md:mt-0">
                    <div className="rotate-6 max-w-sm px-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <button type="button" className="rotate-12 absolute top-[-10px]  transform  text-white bg-[#EAAB40] hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl px-6 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Individual
                        </button>
                        <p className="mb-3 pt-16 pb-32 font-normal text-gray-700 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin imperdiet consectetur odio quis tempor. Nam fringilla elit felis, a porta elit porttitor vel.</p>
                    </div>
                </div>

            </div>

           
        </div>
    )
}
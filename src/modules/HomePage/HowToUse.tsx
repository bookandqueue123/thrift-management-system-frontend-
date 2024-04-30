import { useRouter } from "next/navigation"

export default function HowToUse(){
    const router = useRouter()
    return (
      <div className="mx-[4%] mb-8 mt-24">
        <h2 className="text-3xl font-bold text-white">How to use Finkia</h2>
        <div className="my-12 justify-between md:flex">
          <div className="relative">
            <div className="max-w-sm -rotate-6 rounded-lg bg-[#EAAB40] px-6 shadow ">
              <button
                type="button"
                className="text-dark absolute top-[-10px]  -rotate-12  transform rounded-lg bg-white px-6 py-3 text-center text-xl font-bold hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300   "
              >
                Organisation
              </button>
              <p className="mb-3 pb-16 pt-16 font-normal text-ajo_darkBlue">
                Organisations sign up by providing all necessary information.
                Organisation can onboard its customers/staff.
              </p>

              <button
                onClick={() => router.push("/signup/merchant")}
                type="button"
                className="text-dark mb-16 rounded-lg bg-white px-2 py-2 text-center text-sm font-medium hover:bg-gray-200   "
              >
                Register as an organisation
              </button>
            </div>
          </div>

          <div className=" mt-16 md:mt-0">
            <div className="max-w-sm rotate-6 rounded-lg bg-white px-6 shadow ">
              <button
                type="button"
                className="absolute top-[-10px] rotate-12  transform  rounded-lg bg-[#EAAB40] px-6 py-3 text-center text-xl font-bold text-white hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-blue-300   "
              >
                Customer
              </button>
              <p className="mb-3 pb-16 pt-16 font-normal text-ajo_darkBlue">
                Customers/Organisations staff can go through Finkia’s self
                on-boarding process or He/She can be onboarded by an
                organisation..
              </p>
              <button
                onClick={() => router.push("/signup/customer")}
                type="button"
                className="mb-16 rounded-lg bg-[#EAAB40] px-2 py-2 text-center text-sm font-medium text-white hover:bg-yellow-400  "
              >
                Register as a customer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
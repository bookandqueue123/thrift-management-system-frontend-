'use client'
import { FaArrowLeftLong } from "react-icons/fa6";
import ViewCommission from "@/modules/superAdmin/ViewCommission";
import { useRouter } from "next/navigation";
export default function ViewDetails(){
    const router = useRouter()
    return(
        <div>
            
            <p className="flex items-center text-[#EAAB40] cursor-pointer" onClick={() => router.back()}>
            <span className="mr-2">
              <FaArrowLeftLong /> 
            </span>
            <span>Go Back</span>
          </p>
            <div className="md:flex justify-between mb-12 mt-8 ">
              <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
                Commission
              </p>
              <p className="text-white">{'commission> View Detais'}</p>
            </div>

            <ViewCommission/>
            

        </div>
    )
}
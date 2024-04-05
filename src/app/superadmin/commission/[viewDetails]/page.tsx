'use client'
import { FaArrowLeftLong } from "react-icons/fa6";
import ViewCommission from "@/modules/superAdmin/ViewCommission";
export default function ViewDetails(){
    return(
        <div>
            <p className="flex text-[#EAAB40]">
                <span className="pt-2">
                    <FaArrowLeftLong /> 
                </span>
                <span className="ml-4 ">Go Back</span></p>
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
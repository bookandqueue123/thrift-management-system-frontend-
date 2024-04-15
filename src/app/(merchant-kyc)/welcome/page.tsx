"use client";

import { CustomButton } from "@/components/Buttons";
import { useRouter } from "next/navigation";

const data = [
  { no: "1", content: "Certificate of Business Name" },
  { no: "2", content: "Business Number" },
  { no: "3", content: "Form CAC BN 1" },
  { no: "4", content: "Proof of Bussiness Address" },
  { no: "5", content: "Business Contact Details" },
];

const Welcome = () => {
    const router = useRouter()
  return (
    <div className=" px-8 md:px-12 pt-8 pb-16">
      <p className=" text-[35px] md:text-[48px] font-extrabold text-white  ">Welcome !</p>
      <p className=" mt-8 text-[18px] md:text-[23px] font-semibold text-[#EAAB40]">
        In order to serve your business better, Ajo requires you provide the
        following details about your organization:
      </p>
      <div className="mt-6 flex flex-col gap-5">
        {data.map((item) => (
          <div className=" flex items-center gap-3" key={item.no}>
            <div className=" flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#D2D2D2]">
              <span className=" text-white">{item.no}</span>
            </div>
            <p className=" font-semibold text-[#D2D2D2]">{item.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <p className="text-[#D2D2D2]">Why do I need to submit these documents? <a className="text-[#2F54FB]">Read Details Here</a> </p>
      </div>
      <div className="flex justify-end  mt-20">
      <div className="flex flex-col  md:flex-row items-center w-[100%] lg:w-[70%]">
        <CustomButton
          label="Cancel"
          type="button"
          style=" bg-transparent text-[15px] py-3 px-28 text-[#D2D2D2] flex-1"
        />
        <CustomButton
          label="Proceed"
          type="button"
          style=" bg-[#2F54FB] text-[15px] py-3 px-28 text-white flex-1 rounded-md"
          onButtonClick={() => router.push("/merchant-kyc")}
        />
      </div>
      </div>
      
    </div>
  );
};

export default Welcome;

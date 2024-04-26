"use client";

import { CustomButton } from "@/components/Buttons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const data = [
  { no: "1", content: "Certificate of Business Name" },
  { no: "2", content: "Business Number" },
  { no: "3", content: "Form CAC BN 1" },
  { no: "4", content: "Proof of Business Address" },
  { no: "5", content: "Business Contact Details" },
];

const Welcome = () => {
  const router = useRouter();
  return (
    <div className=" px-8 pb-16 pt-8 md:px-[5%]">
      <p className=" text-2xl font-extrabold text-white md:text-4xl  ">
        Welcome !
      </p>
      <p className="mt-2 text-[#EAAB40] md:mt-4 md:text-xl">
        In order to serve your business better, Ajo requires you provide the
        following details about your organization:
      </p>
      <div className="mt-8 flex flex-col gap-5">
        {data.map((item) => (
          <div className=" flex items-center gap-3" key={item.no}>
            <div className=" flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#D2D2D2]">
              <span className=" text-ajo_darkBlue">{item.no}</span>
            </div>
            <p className=" text-[#D2D2D2] font-semibold">{item.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <p className="text-[#D2D2D2]">
          Why do I need to submit these documents? {"  "}
          <Link
            className="text-[#2F54FB] underline underline-offset-2"
            href="#"
          >
            Read Details Here
          </Link>
        </p>
      </div>
      <div className="mt-20 flex  justify-end">
        <div className="flex w-[100%]  flex-col items-center md:flex-row lg:w-[70%]">
          <CustomButton
            label=""
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

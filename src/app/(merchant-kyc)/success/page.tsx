"use client";
import Image from "next/image";
import { CustomButton } from "@/components/Buttons";
import { useRouter} from "next/navigation";

const Verification = () => {
  const router = useRouter();
  return (
    <div className="mt-[-30px] flex h-[90vh] flex-col items-center justify-center px-8">
      <Image
        src="/sucees.svg"
        alt="verification check"
        className=" m-0 h-[50px] w-[50px] md:h-[100px] md:w-[100px] "
        width={300}
        height={300}
        loading="eager"
      />
      <p className=" text-center text-[22px] font-semibold text-[#EAAB40] md:text-[30px]">
        Verification Successful
      </p>
      <p className=" mt-5 text-center text-[15px]  text-white md:text-[18px]">
        🎉 Congratulations! Your KYC verification has been successfully
        completed. 🎉
      </p>
      <CustomButton
        label="Proceed To Dashboard"
        type="button"
        onButtonClick={() => router.replace("/merchant")}
        style=" bg-[#2F54FB] text-[10px] md:text-[15px] py-3 px-28 text-white rounded-md mt-5"
      />
    </div>
  );
};

export default Verification;

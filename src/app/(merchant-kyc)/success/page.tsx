"use client";
import Image from "next/image";
import { CustomButton } from "@/components/Buttons";
import { useRouter} from "next/navigation";

const Verification = () => {
  const router = useRouter();
  return (
    <div className="flex h-[90vh] flex-col items-center justify-center mt-[-30px] px-8">
      <Image
        src="/sucees.svg"
        alt="Ajo Logo"
        className="relative -left-[.5rem] -top-[.5rem] m-0 h-[50px] w-[50px] md:-left-[2rem] md:-top-[1rem] md:h-[100px] md:w-[100px] "
        width={250}
        height={250}
        loading="eager"
      />
      <p className=" text-[22px] md:text-[30px] font-semibold text-[#EAAB40] text-center">
        Verification Successful
      </p>
      <p className=" text-[15px] md:text-[18px] mt-5  text-white text-center">
        Lorem Ipsum dolor et Manhjikl Nikojnij;os ;jn h b ; cxcv
        nftfdvbkhgyfvbjb,k dsxb x{" "}
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

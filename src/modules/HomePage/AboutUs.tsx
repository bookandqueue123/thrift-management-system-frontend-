import Image from "next/image";
import { usePathname } from "next/navigation";

interface AboutProps{
    bg?:string
    aboutText: string
}
export default function AboutUs({bg, aboutText}:AboutProps ){
    const pathName = usePathname()

    const isHomepage = pathName === "/"
    
    const data = [
        {
          text: "Helping traders save on daily basis",
          firstImageSrc: "/woman-holding.svg",
          secondImageSrc: "/man-woman.svg"
        },
        {
            text: "Automating financial management for cooperative societies",
            firstImageSrc: "/automate1.svg",
            secondImageSrc: "/automate2.svg"
        },
        {
            text: "Inculcating healthy saving habits in youths",
            firstImageSrc: "/inculate1.svg",
            secondImageSrc: "/inculate2.svg"
        },

        
      ];
    return(
        <div className={`${bg === "white" ? 'text-black': "text-white"} ${bg === "white" ? "bg-[#E3E7FA]": ""} py-12  md:px-[4%]  my-8 mt-16`}>
            <h2 className="text-3xl font-bold">About us</h2>
            <p className="my-8 text-left md:mr-[4%] text-left">
                {aboutText}
            </p>
            <p className={`mt-2 ${!isHomepage ? 'hidden' : 'block'}`}>Finkia achieves this by:</p>

          
            {/* This component isn't meant to show on any other page except the homepage. scope might change later */}
            <div className={`mt-2 ${!isHomepage ? 'hidden' : 'block'}`}>
                {data.map((item, index) => (
                    <div key={index} className="md:flex justify-between mb-[30%] md:mb-[10%]">
                    <div className="mt-8">
                        <Image
                        alt="text item"
                        src="/about-text.svg"
                        width={30}
                        height={30}
                        />
                        <p className="font-bold text-xl mt-4 md:mt-8">{item.text}</p>
                    </div>
                    <div className=" mt-8 md:mt-0 flex relative md:mr-[10%]">
                        <div className="">
                        {/* First image */}
                        <Image 
                            width="100"
                            height={100}
                            src={item.firstImageSrc} 
                            alt="First Image" 
                            className="w-48 h-auto" />
                        </div>
                        <div className="">
                        {/* Second image */}
                        <Image 
                            width="100"
                            height={100}
                            src={item.secondImageSrc} 
                            alt="Second Image" 
                            className="w-48 h-auto absolute top-[50%] left-[30%] md:top-[50%] md:left-[75%]" />
                        </div>
                    </div>
                    </div>
                ))}
                </div>
           
        </div>
    )
}
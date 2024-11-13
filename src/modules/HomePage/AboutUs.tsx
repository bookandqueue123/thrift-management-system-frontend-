import Image from "next/image";
import { usePathname } from "next/navigation";

interface AboutProps{
    bg?:string
    aboutText: string
    data: dataProps[]
    
}
interface dataProps{
        text: string
        firstImageSrc: string,
        secondImageSrc: string
}

//the data props should contain 2 images when it is being used on the prmary homepage else one single image
export default function AboutUs({bg, aboutText, data}:AboutProps ){
    const pathName = usePathname()

    const isHomepage = pathName === "/"
    
    
    return(
        <div id="about-content" className={`${bg === "white" ? 'text-black': "text-white"} ${bg === "white" ? "bg-[#E3E7FA]": ""} py-12 px-[4%] md:px-[4%]   mt-16`}>
            <h2 className="text-3xl font-bold">About us</h2>
            <p className="my-8 md:mr-[4%] text-left whitespace-pre-line">
                {aboutText}
            </p>
            <p className={`mt-2 ${!isHomepage ? 'hidden' : 'block'}`}>Finkia achieves this by:</p>

          
            {/* This component isn't meant to show on any other page except the homepage. scope might change later */}
            <div className={`mt-2 `}>
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

                    {isHomepage ? 
                      <div className=" mt-8 md:mt-0 flex relative md:mr-[10%]">
                      <div className="">
                      {/* First image */}
                      <Image 
                          width="500"
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
                  :
                  <div className="mt-8 md:mt-0 md:w-[50%]">
                    <Image
                        width={600}
                        height={200}
                        src={item.firstImageSrc} 
                        alt="First Image" 
                        className=""
                    />
                  </div>
                }
                  
                    </div>
                ))}
                </div>
           
        </div>
    )
}
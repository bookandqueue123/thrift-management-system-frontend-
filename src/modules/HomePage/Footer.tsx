import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook,  FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
export default function Footer(){
    const pathName = usePathname()
    const isHomepage = pathName === "/"
    return(
        <div className={``} >
            <div className="mt-[4%] mx-[6%]">
                <p className="text-xl font-semibold text-ajo_orange pb-4">
                    <Image
                
                    src="/Logo.svg"
                    width={100}
                    height={100}
                    alt="logo"
                    />
                </p>
                
                <div className="md:flex justify-between">
                    <div className="flex">
                        <div className="">
                        <FaFacebook size={40}  color="orange"/>
                        </div>
                        <div className="px-12">
                           <FaXTwitter size={40}  color="orange"/>
                        </div>
                        <div className="">
                        <FaEnvelope size={40}  color="orange"/>
                        </div>
                        <div className="pl-12">
                            <FaWhatsapp size={40}  color="orange"/>
                        </div>
                    </div>

                    <div className="flex space-x-8">
            <a href="#" className="text-gray-500 hover:text-gray-700">About Us</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Cookie</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a>
          </div>
                </div>

                <div className="text-center text-gray-400 text-sm mt-4 mb-4">
          &copy; <Link
            target="_blank"
            href="https://www.raoatech.com"
            className="text-blue-500 hover:underline"
          >
            2024 Roaetech Ng - All Rights Reserved
          </Link>
        </div>
            </div>
        </div>
    )
}
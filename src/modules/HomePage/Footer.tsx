import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer(){
    const pathName = usePathname()
    const isHomepage = pathName === "/"
    return(
        <div className={`${isHomepage ? 'bg-ajo_darkBlue' : ""}`}>
            <div className="mt-[4%] mx-[6%]">
                <p className="text-xl font-semibold text-ajo_orange pb-4">Finkia</p>
                
                <div className="md:flex justify-between">
                    <div className="flex">
                        <div className="">
                            <Image
                            src="/fb.svg"
                            alt="fb icon"
                            width={40}
                            height={40}
                            />
                        </div>
                        <div className="px-12">
                            <Image
                            src="/x.svg"
                            alt="fb icon"
                            width={40}
                            height={40}
                            />
                        </div>
                        <div className="">
                            <Image
                            src="/mail.svg"
                            alt="fb icon"
                            width={40}
                            height={40}
                            />
                        </div>
                        <div className="pl-12">
                            <Image
                            src="/whatsapp.svg"
                            alt="fb icon"
                            width={40}
                            height={40}
                            />
                        </div>
                    </div>

                    <div className={`${isHomepage ? 'text-white' : 'black'} mt-4 md:mt-0`}>
                        <h2>About us</h2>
                        <h2 className="py-4">Contact us</h2>
                        <h2>Privacy policy</h2>
                    </div>
                </div>

                <div className={` my-8 flex justify-center  ${isHomepage ? 'text-white' : 'black'} pb-8`}>
                Powered by <Link target="_blank" href={"https://raoatech.com/"} className="ml-1"><span> Raoatech Ng</span> </Link>
                </div>
            </div>
        </div>
    )
}
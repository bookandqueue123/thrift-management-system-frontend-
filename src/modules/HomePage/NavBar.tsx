import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar(){
    const pathName = usePathname()
    const isHomepage = pathName === "/"
    return(
        <nav className="">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    {isHomepage
                        ?
                        <Image
                        src="/Logo.svg"
                        width={100}
                        height={100}
                        alt="logo"
                        />
                        :
                        <Image
                        src="/MAXWELL.png"
                        width={100}
                        height={100}
                        alt="logo"
                        />
                    }
                   
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#EAAB40]">Finkia</span> */}
                </a>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
                    
                    <li>
                    <a href="/about-us" className="mt-2 block text-gray-400" aria-current="page">About Us</a>
                    </li>
                    <li>
                    <a href="/contact-us" className="mt-2 block text-gray-400" aria-current="page">Contact Us</a>
                    </li>
                    {/* <li>
                    <a href="#" className="mt-2 block text-gray-400">Product/Services</a>
                    </li> */}
                    {/* <li>
                    <a href="/#" className="mt-2 block text-gray-400 hover:text-gray-200">Services</a>
                    </li > */}
                    {/* <li>
                    <a href="/signup" className="mt-2 block text-gray-400 hover:text-gray-200">Sign up</a>
                    </li> */}
                    {/* <a href="#contactUs-content">
                        <button type="button" className="text-white bg-[#2D55FB] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join Community</button>
                    </a> */}
                     <div className="space-x-4">
              <Link href={'/signup'}>
              <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Sign Up</button>
              </Link>
              
              <Link href={'/signin'}>
              <button className="px-4 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">Sign In</button>
              </Link>
              
            </div>
                    
                </ul>
                </div>
            </div>
        </nav>


        
  );
}

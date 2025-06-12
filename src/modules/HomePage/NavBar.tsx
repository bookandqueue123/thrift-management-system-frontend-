// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const pathName = usePathname();
//   const isHomepage = pathName === "/";

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         <a href="https://finkia.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
//           {isHomepage ? (
//             <Image src="/Logo.svg" width={100} height={100} alt="logo" />
//           ) : (
//             <Image src="/MAXWELL.png" width={100} height={100} alt="logo" />
//           )}
//         </a>
//         <button
//           type="button"
//           onClick={toggleMenu}
//           className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
//           aria-controls="navbar-default"
//           aria-expanded={isMenuOpen}
//         >
//           <span className="sr-only">Open main menu</span>
//           <svg
//             className="w-5 h-5"
//             aria-hidden="true"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 17 14"
//           >
//             <path
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M1 1h15M1 7h15M1 13h15"
//             />
//           </svg>
//         </button>
//         <div
//           className={`${
//             isMenuOpen ? "block" : "hidden"
//           } w-full md:block md:w-auto`}
//           id="navbar-default"
//         >
//           <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
//             <li>
//               <a href="/about-us" className="mt-2 block text-gray-400" aria-current="page">
//                 About Us
//               </a>
//             </li>
//             <li>
//               <a href="/contact-us" className="mt-2 block text-gray-400" aria-current="page">
//                 Contact Us
//               </a>
//             </li>
//              <li>
//               <a href="" className="mt-2 block text-gray-400" aria-current="page">
//                 Services
//               </a>
//             </li>
//             <div className="space-x-4">
//               <Link href={"/signup"}>
//                 <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
//                   Sign Up
//                 </button>
//               </Link>
//               <Link href={"/signin"}>
//                 <button className="px-4 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
//                   Sign In
//                 </button>
//               </Link>
//             </div>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface ServiceItem {
  id: number;
  title: string;
  href: string;

}

export default function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isServicesOpen, setIsServicesOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const router = useRouter();
  const isHomepage: boolean = pathName === "/";
  const dropdownRef = useRef<HTMLLIElement>(null);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServices = (): void => {
    setIsServicesOpen(!isServicesOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const services: ServiceItem[] = [
    {
      id: 1,
      title: "AI Photo Editor",
      href: "/photo-editor"
      // description: "Advanced AI-powered photo editing tools"
    },
    {
      id: 2,
      title: "Thrift Savings",
      href: "/thrift"
      // description: "Comprehensive AI solutions for your needs"
    },
    {
      id: 3,
      title: "MarketPlace",
      href: "/market-place"
      // description: "Latest smartphone deals and offers"
    }
  ];

  const handleServiceClick = (href: string): void => {
    setIsServicesOpen(false);
    router.push(href);
  };

  return (
    <nav className="relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
     <Link href="https://finkia.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
          {isHomepage ? (
            <Image src="/Logo.svg" width={100} height={100} alt="logo" />
          ) : (
            <Image src="/MAXWELL.png" width={100} height={100} alt="logo" />
          )}
        </Link> 
       
        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            <li>
              <Link href="/about-us" className="mt-2 block text-gray-400 hover:text-gray-600" aria-current="page">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="mt-2 block text-gray-400 hover:text-gray-600" aria-current="page">
                Contact Us
              </Link>
            </li>
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleServices}
                className="mt-2 block text-gray-400 hover:text-gray-600 flex items-center focus:outline-none"
                aria-current="page"
              >
                Services
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="py-2">
                    {services.map((service: ServiceItem) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceClick(service.href)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {service.title}
                            </h3>
                            
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/signup">
                <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Sign Up
                </button>
              </Link>
              <Link href="/signin">
                <button className="px-4 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors">
                  Sign In
                </button>
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}
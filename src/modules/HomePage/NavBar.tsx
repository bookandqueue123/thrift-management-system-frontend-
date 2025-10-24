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

"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ServiceItem {
  id: number;
  title: string;
  href: string;
}

interface CartResponse {
  items: Array<{
    id: string;
    quantity: number;
    // Add other cart item properties as needed
  }>;
  total: number;
  // Add other cart response properties as needed
}

export default function Navbar(): JSX.Element {
  const { client } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isServicesOpen, setIsServicesOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const router = useRouter();
  const isHomepage: boolean = pathName === "/";
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Cart data fetching
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("/api/cart");
      return res.data;
    },
  });

  // Calculate total items in cart
  const cartItemCount =
    cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServices = (): void => {
    setIsServicesOpen(!isServicesOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      href: "/photo-editor",
      // description: "Advanced AI-powered photo editing tools"
    },
    {
      id: 2,
      title: "Thrift Savings",
      href: "/thrift",
      // description: "Comprehensive AI solutions for your needs"
    },
    {
      id: 3,
      title: "MarketPlace",
      href: "/market-place",
      // description: "Latest smartphone deals and offers"
    },
  ];

  const handleServiceClick = (href: string): void => {
    setIsServicesOpen(false);
    router.push(href);
  };

  const handleCartClick = (): void => {
    router.push("/cart");
  };

  return (
    <nav className="relative">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link
          href="https://finkia.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src="/Logo.svg" width={100} height={100} alt="logo" />
        </Link>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-5 w-5"
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
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse">
            <li>
              <Link
                href="/about-us"
                className="mt-2 block text-gray-400 hover:text-gray-600"
                aria-current="page"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                className="mt-2 block text-gray-400 hover:text-gray-600"
                aria-current="page"
              >
                Contact Us
              </Link>
            </li>
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleServices}
                className="mt-2 block flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-current="page"
              >
                Services
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
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
                <div className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                  <div className="py-2">
                    {services.map((service: ServiceItem) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceClick(service.href)}
                        className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors duration-200 last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="mb-1 text-sm font-medium text-gray-900">
                              {service.title}
                            </h3>
                          </div>
                          <svg
                            className="h-4 w-4 text-gray-400"
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

            <div className="mt-4 flex items-center space-x-4 md:mt-0">
              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative rounded p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Shopping cart"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                {/* Cart Badge */}
                {!isLoading && cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
                {/* Loading indicator */}
                {isLoading && (
                  <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-gray-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>
                  </span>
                )}
              </button>

              <Link href="/signup">
                <button className="rounded bg-blue-500 px-4 py-1 text-white transition-colors hover:bg-blue-600">
                  Sign Up
                </button>
              </Link>
              <Link href="/signin">
                <button className="rounded border border-blue-500 px-4 py-1 text-blue-500 transition-colors hover:bg-blue-50">
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

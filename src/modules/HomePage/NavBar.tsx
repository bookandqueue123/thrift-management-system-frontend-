import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();
  const isHomepage = pathName === "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://finkia.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
          {isHomepage ? (
            <Image src="/Logo.svg" width={100} height={100} alt="logo" />
          ) : (
            <Image src="/MAXWELL.png" width={100} height={100} alt="logo" />
          )}
        </a>
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
              <a href="/about-us" className="mt-2 block text-gray-400" aria-current="page">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact-us" className="mt-2 block text-gray-400" aria-current="page">
                Contact Us
              </a>
            </li>
            <div className="space-x-4">
              <Link href={"/signup"}>
                <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Sign Up
                </button>
              </Link>
              <Link href={"/signin"}>
                <button className="px-4 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
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

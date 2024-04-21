import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathName = usePathname();
  const isHomepage = pathName === "/";
  return (
    <nav className="">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a
          href="https://finkia.com.ng/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          {isHomepage ? (
            <Image src="/Logo.svg" width={100} height={100} alt="logo" />
          ) : (
            <Image src="/MAXWELL.png" width={100} height={100} alt="logo" />
          )}

          {/* <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#EAAB40]">Finkia</span> */}
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
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
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium md:mt-0  md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse ">
            <li>
              <a
                href="#"
                className="mt-2 block text-gray-400"
                aria-current="page"
              >
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="mt-2 block text-gray-400">
                Product/Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="mt-2 block text-gray-400 hover:text-gray-200"
              >
                Contact us
              </a>
            </li>

            <Link
              href={"/signup"}
              type="button"
              className="rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Get Started
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
}

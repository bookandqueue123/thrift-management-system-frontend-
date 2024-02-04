import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "SignUp",
  description: "Create your account",
};

const page = () => {
  return (
    <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-full md:w-1/2 md:items-center md:justify-center md:px-8">
      <div className="">
        <p className="text-center text-3xl font-bold text-white md:text-6xl">
          SignUp
        </p>
        <p className="mt-2 text-center text-sm text-ajo_orange">
          Experience the power of seamless savings with Ajo.{" "}
          <span className="font-semibold">
            Kindly Fill in your details in the fields provided below:
          </span>
        </p>
        <form className="mt-8">
          <div className="mb-8">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="mb-3 w-1/2">
                <label
                  htmlFor="fname"
                  className="m-0 text-xs font-medium text-white"
                >
                  First Name{" "}
                  <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
                </label>
                <input
                  id="fname"
                  name="fname"
                  required
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
              </div>
              <div className="mb-3 w-1/2">
                <label
                  htmlFor="lname"
                  className="m-0 text-xs font-medium text-white"
                >
                  Last Name{" "}
                  <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
                </label>
                <input
                  id="lname"
                  name="lname"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="other-names"
                className="m-0 text-xs font-medium text-white"
              >
                Other Names
              </label>
              <input
                id="other-names"
                name="other-names"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="phone"
                className="m-0 text-xs font-medium text-white"
              >
                Phone Number{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <div className="mt-1 flex w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] gap-2">
                <span className="flex h-full w-1/5 select-none items-center gap-2 text-gray-400 sm:text-sm">
                  {/* <Image
                    src="./NG.svg"
                    alt="nigerian flag"
                    width={18}
                    height={13.5}
                  /> */}
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-100 f-100"
                  >
                    <path
                      d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
                      fill="white"
                    />
                    <path
                      d="M1 2.05C1 1.60817 1.35817 1.25 1.8 1.25H6.29677C6.7386 1.25 7.09677 1.60817 7.09677 2.05V13.95C7.09677 14.3918 6.7386 14.75 6.29677 14.75H1.8C1.35817 14.75 1 14.3918 1 13.95V2.05ZM12.9032 2.05C12.9032 1.60817 13.2614 1.25 13.7032 1.25H18.2C18.6418 1.25 19 1.60817 19 2.05V13.95C19 14.3918 18.6418 14.75 18.2 14.75H13.7032C13.2614 14.75 12.9032 14.3918 12.9032 13.95V2.05Z"
                      fill="#186648"
                    />
                    <path
                      d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
                      stroke="#131313"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  +234
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-4/5 bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="email"
                className="m-0 text-xs font-medium text-white"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="m-0 text-xs font-medium text-white"
              >
                Password{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="confirm-password"
                className="m-0 text-xs font-medium text-white"
              >
                Confirm Password{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="confirm-password"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
          >
            Create account
          </button>
        </form>
        <div className="mt-6 justify-center md:flex md:gap-1">
          <p className="text-center text-sm font-semibold text-white">
            Don’t have an account yet?
          </p>
          <Link href="/signin">
            <p className="text-center text-sm font-semibold text-ajo_orange hover:underline focus:underline">
              Sign In!
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default page;

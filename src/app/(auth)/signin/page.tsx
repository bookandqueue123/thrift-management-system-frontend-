import Link from "next/link";

export const metadata = {
  title: "SignIn",
  description: "Login to your account",
};

const page = () => {
  return (
    <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-screen md:w-1/2 md:items-center md:justify-center md:px-8">
      <div>
        <p className="text-center text-3xl font-bold text-white md:text-6xl">
          SignIn
        </p>
        <p className="text-ajo_orange mt-2 text-center text-sm">
          Experience the power of seamless savings with Ajo.
        </p>
        <form className="mt-8">
          <div className="mb-8">
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
                autoComplete="email"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="user-category"
                className="m-0 text-xs font-medium text-white"
              >
                User Category
              </label>
              <select
                id="user-category"
                name="user-category"
                className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] "
              >
                <option>Customer</option>
                <option>Merchant</option>
              </select>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="m-0 text-xs font-medium text-white"
                >
                  Password
                </label>
                <Link href="" className="">
                  <span className="text-ajo_orange m-0 text-xs font-medium hover:underline focus:underline">
                    Forgot Password?
                  </span>
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>

            <div className="flex gap-x-3">
              <input
                id="remember-password"
                name="remember-password"
                type="checkbox"
                className="block h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="remember-password"
                className="m-0 block text-xs font-medium text-white"
              >
                Remember Password
              </label>
            </div>
          </div>

          <Link href="/customer"><button
            type="submit"
            className="bg-ajo_blue w-full rounded-md py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
          >
            LogIn
          </button></Link>
        </form>
        <div className="mt-6 md:flex md:gap-1 justify-center">
          <p className="text-center text-sm font-semibold text-white">
            Don’t have an account yet?
          </p>
          <Link href="/">
            <p className="text-ajo_orange text-center text-sm font-semibold hover:underline focus:underline">
              Sign up!
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default page;

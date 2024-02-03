import Link from "next/link";

export const metadata = {
  title: "SignUp",
  description: "Create your account",
};

const page = () => {
  return (
    <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-screen md:w-1/2 md:items-center md:justify-center md:px-8">
      <div>
        <p className="text-center text-3xl font-bold text-white md:text-6xl">
          SignUp
        </p>
        <p className="text-ajo_orange mt-2 text-center text-sm">
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
              <input
                id="phone"
                name="phone"
                type="number"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
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
            className="bg-ajo_blue w-full rounded-md py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
          >
            Create account
          </button>
        </form>
        <div className="mt-6 md:flex md:gap-1">
          <p className="text-center text-sm font-semibold text-white">
            Don’t have an account yet?
          </p>
          <Link href="/signin">
            <p className="text-ajo_orange text-center text-sm font-semibold hover:underline focus:underline">
              Sign In!
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default page;

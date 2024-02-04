export const metadata = {
  title: "Merchant SignUp | Ajo by Raoatech",
  description: "Create your account",
};

const MerchantForm = () => {
  return (
    <form className="mt-8">
      <div className="mb-8">
        <div className="mb-3">
          <label
            htmlFor="organisation-name"
            className="m-0 text-xs font-medium text-white"
          >
            Organisation Name
          </label>
          <input
            id="organisation-name"
            name="organisation-name"
            type="text"
            className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="m-0 text-xs font-medium text-white">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="m-0 text-xs font-medium text-white">
            Contact Number{" "}
            <span className="font-base font-semibold text-[#FF0000]">*</span>
          </label>
          <div className="mt-1 flex w-full gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
            <span className="flex h-full w-1/5 select-none items-center gap-2 text-gray-400 sm:text-sm">
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
            htmlFor="url"
            className="m-0 text-xs font-medium text-white"
          >
            Preferred URL
          </label>
          <input
            id="url"
            name="url"
            type="url"
            className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="password"
            className="m-0 text-xs font-medium text-white"
          >
            Password{" "}
            <span className="font-base font-semibold text-[#FF0000]">*</span>
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
            <span className="font-base font-semibold text-[#FF0000]">*</span>
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
  );
};

export default MerchantForm;
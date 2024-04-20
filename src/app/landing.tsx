import Banner from "@/components/Banner";
import VerifyOrgSubdomain from "@/utils/VerifyOrgSubdomain";
import Link from "next/link";

const Landing = () => {
  VerifyOrgSubdomain();
  return (
    <main className="md:flex">
      <Banner />
      <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-screen md:w-1/2 md:items-center md:justify-center md:px-8">
        <div className="">
          <div className="mb-4">
            <span className="text-[32px] leading-10 text-ajo_orange">
              Experience the power of seamless savings with{" "}
            </span>
            <span className="text-[32px] font-bold leading-10 text-ajo_orange">
              Ajo.
            </span>
          </div>
          <p className="mb-8 text-base text-white">
            How would you like to use Ajo? Kindly select the option that suits
            you best:
          </p>

          <Link href="/signup/customer">
            <div className="mb-4 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white bg-opacity-20 px-6 py-4 hover:bg-opacity-40 focus:bg-opacity-40">
              <h6 className="mb-1 text-start font-bold text-ajo_offWhite">
                Sign Up as a Customer
              </h6>
              <p className="text-justify text-sm font-light text-ajo_offWhite">
                Join us on the path to financial success! start saving, growing
                your money, and withdrawing funds whenever you need them.
              </p>
            </div>
          </Link>
          <Link href="/signup/merchant">
            <div className="cursor-pointer rounded-lg border border-[#E0E0E0] bg-white bg-opacity-20 px-6 py-4 hover:bg-opacity-40 focus:bg-opacity-40">
              <h6 className="mb-1 text-left font-bold text-ajo_offWhite">
                Sign Up as an Organization
              </h6>
              <p className="text-justify text-sm font-light text-ajo_offWhite">
                Optimize your financial operations with Ajo&apos;s
                organizational platform. Seamlessly manage and set up customers
                and merchants, while monitoring performance with ease.
              </p>
            </div>
          </Link>

          <div className="mt-6 md:flex md:gap-1">
            <p className="text-center text-sm font-semibold text-white">
              Not a new user, I Already have an account?
            </p>
            <Link href="/signin">
              <p className="text-center text-sm font-semibold text-ajo_orange hover:underline focus:underline">
                Sign In!
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;

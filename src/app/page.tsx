import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const date = new Date();
  const currentYear = date.getFullYear();
  return (
    <main className="">
      <section className="mb-4">
        <Image
          src="./Ajo.svg"
          alt="Ajo Logo"
          className="relative -left-[32px] -top-[18px] m-0"
          width={158}
          height={140}
          // priority
        />

        <div className="mx-4 mt-4">
          <span className="mb-4 flex items-center gap-2">
            <Image
              src="./ellipse.svg"
              alt="bullet point"
              width={25}
              height={40}
            />
            <p className="text-ajo_blue text-3xl font-bold">Grow your Money</p>
          </span>
          <span className="flex items-center gap-2">
            <Image
              src="./ellipse.svg"
              alt="bullet point"
              width={25}
              height={40}
            />
            <p className="text-ajo_blue text-3xl font-bold">
              Save your Future.
            </p>
          </span>
        </div>

        <Image
          src="./coins.svg"
          alt="coins growing like a tree"
          className="relative -left-[18px] mt-8"
          width={435}
          height={234}
          loading="lazy"
        />

        <div className="mt-8">
          <p className="text-ajo_orange text-center text-xs font-semibold md:text-base">
            Powered by Raoatech
          </p>
          <p className="text-ajo_orange text-center text-xs md:text-base">
            ©{currentYear}
          </p>
        </div>
      </section>
      <section className="bg-ajo_darkBlue px-4 pb-10 pt-8">
        <div className="mb-4">
          <span className="text-ajo_orange text-[32px] leading-10">
            Experience the power of seamless savings with{" "}
          </span>
          <span className="text-ajo_orange text-[32px] font-bold leading-10">
            Ajo.
          </span>
        </div>
        <p className="mb-8 text-base text-white">
          How would you like to use Ajo? Kindly select the option that suits you
          best:
        </p>

        <Link href="/signup">
          <div className="mb-4 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white bg-opacity-20 px-6 py-4 hover:bg-opacity-40 focus:bg-opacity-40">
            <h6 className="text-ajo_offWhite mb-1 text-start font-bold">
              Sign Up as a Customer
            </h6>
            <p className="text-ajo_offWhite text-justify text-sm font-light">
              Join us on the path to financial success! start saving, growing
              your money, and withdrawing funds whenever you need them.
            </p>
          </div>
        </Link>
        <Link href="/signup/kyc">
          <div className="cursor-pointer rounded-lg border border-[#E0E0E0] bg-white bg-opacity-20 px-6 py-4 hover:bg-opacity-40 focus:bg-opacity-40">
            <h6 className="text-ajo_offWhite mb-1 text-left font-bold">
              Sign Up as a Merchant
            </h6>
            <p className="text-ajo_offWhite text-justify text-sm font-light">
              Optimize your financial operations with Ajo&apos;s organizational
              platform. Seamlessly manage and set up customers and merchants,
              while monitoring performance with ease.
            </p>
          </div>
        </Link>

        <div className="mt-6">
          <p className="text-center text-sm font-semibold text-white">
            Not a new user, I Already have an account?
          </p>
          <Link href="/signin">
            <p className="text-ajo_orange text-center text-sm font-semibold hover:underline focus:underline">
              Sign In!
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}

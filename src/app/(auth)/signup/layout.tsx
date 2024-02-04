import Link from "next/link";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:w-1/2 md:items-center  md:justify-center md:px-8 md:py-12 md:pt-52">
      <div className="">
        <div>
          <h1 className="text-center text-3xl font-bold text-white md:text-6xl">
            SignUp
          </h1>
          <h3 className="mt-2 text-center text-sm text-ajo_orange">
            Experience the power of seamless savings with Ajo.{" "}
            <span className="font-semibold">
              Kindly Fill in your details in the fields provided below:
            </span>
          </h3>
        </div>{" "}
        {children}
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
}

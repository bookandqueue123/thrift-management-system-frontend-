"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // console.log(pathname)
  return (
    <section className=" bg-[#090E2C] bg-[url('/squiggly.svg')] bg-cover bg-center bg-no-repeat ">
      <Image
        src="/Ajo.svg"
        alt="Ajo Logo"
        className="relative -left-[.5rem] -top-[.5rem] m-0 h-[50px] w-[50px] md:-left-[2rem] md:-top-[1rem] md:h-[100px] md:w-[100px] "
        width={100}
        height={100}
        loading="eager"
        tabIndex={-1}
      />

      {children}
    </section>
  );
}

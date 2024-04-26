"use client";
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
    <section className="min-h-[100vh] bg-[#090E2C] bg-[url('/squiggly.svg')] bg-cover bg-center bg-no-repeat pb-10 pt-6 md:pt-10">
      <Image
        src="/Logo.svg"
        alt="Finkia Logo"
        className="relatives m-0 ms-6"
        width={100}
        height={100}
        loading="eager"
        tabIndex={-1}
      />

      {children}
    </section>
  );
}

"use client";
import HomePage from "@/modules/HomePage/homePage";
import VerifyOrgSubdomain from "@/utils/VerifyOrgSubdomain";
import { useEffect, useState } from "react";
import Landing from "./landing";
import Image from "next/image";

export default function Home() {
  VerifyOrgSubdomain();
  const [homePageToShow, setHomePageToShow] = useState("");
  const [isHomepageSet, setIsHomepageSet] = useState(false);
  const [host, setHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      setHost(url.host);
      
    }

    if (host === "www.finkia.com.ng" || host === "staging.finkia.com.ng") {
      setHomePageToShow("finkia");
    } else {
      setHomePageToShow("portal");
    }
    setIsHomepageSet(true);
  }, [host]);

  if (!isHomepageSet) {
    return (
      <div className="flex min-h-[100vh] justify-center bg-ajo_darkBlue pt-[10%]">
        <Image
          src="/loadingSpinner.svg"
          alt="loading spinner"
          width={80}
          height={80}
        />
      </div>
    );
  }

  return homePageToShow === "finkia" ? <HomePage /> : <Landing />;
}

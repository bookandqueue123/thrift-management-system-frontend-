"use client";
import HomePage from "@/modules/HomePage/homePage";
import { tailspin } from "ldrs";
import { useEffect, useState } from "react";
import Landing from "./landing";

export default function Home() {
  const [homePageToShow, setHomePageToShow] = useState("");
  const [isHomepageSet, setIsHomepageSet] = useState(false);
  const [host, setHost] = useState("");

  tailspin.register();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      setHost(url.host);
      console.log("host", host);
    }

    if (host === "finkia.com.ng" || host === "staging.finkia.com.ng") {
      setHomePageToShow("finkia");
    } else {
      setHomePageToShow("portal");
    }
    setIsHomepageSet(true);
  }, [host]);

  if (!isHomepageSet) {
    return (
      // <div className="al flex bg-ajo_darkBlue">
      <div className="flex h-[100vh] items-center justify-center bg-ajo_darkBlue">
        <l-tailspin
          size="100"
          stroke="8"
          speed="0.9"
          color="#F2F0FF"
        ></l-tailspin>
      </div>
    );
  }

  return homePageToShow === "finkia" ? <HomePage /> : <Landing />;
}

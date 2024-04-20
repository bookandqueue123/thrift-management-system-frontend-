"use client";
import HomePage from "@/modules/HomePage/homePage";
import { useEffect, useState } from "react";
import Landing from "./landing";

export default function Home() {
  const [homePageToShow, setHomePageToShow] = useState("");
  const [isHomepageSet, setIsHomepageSet] = useState(false);
  const [host, setHost] = useState("");

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
    return <div>Loading...</div>;
  }

  return homePageToShow === "finkia" ? <HomePage /> : <Landing />;
}

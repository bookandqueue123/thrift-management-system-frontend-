"use client";
import HomePage from "@/modules/HomePage/homePage";
import VerifyOrgSubdomain from "@/utils/VerifyOrgSubdomain";
import Landing from "./landing";

export default function Home() {
  let host;
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    host = url.host;
    console.log("host", host);
  }

  if (host === "finkia.com.ng" || host === "staging.finkia.com.ng") {
    VerifyOrgSubdomain();
    return <Landing />;
  } else {
    return <HomePage />;
  }
}

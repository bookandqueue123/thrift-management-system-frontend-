"use client";
import VerifyOrgSubdomain from "@/utils/VerifyOrgSubdomain";
import Landing from "./landing";

export default function Home() {
  VerifyOrgSubdomain();
  return <Landing />;
}

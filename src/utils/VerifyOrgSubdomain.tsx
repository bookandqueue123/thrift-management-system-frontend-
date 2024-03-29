"use client";

import { useAuth } from "@/api/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import preferredUrls from "@/api/dummyPreferredUrls.json";
import { useUrl } from "@/api/hooks/useUrl";

const VerifyOrgSubdomain = () => {
  const { preferredUrl, setPreferredUrl } = useUrl();
  const router = useRouter();

  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    const hostUrl: string =
      typeof window !== "undefined" ? window.location.origin : "";
    setCurrentUrl(hostUrl);
  }, [setPreferredUrl]);

  useEffect(() => {
    const foundOrganization = preferredUrls.organizations.find((org) => {
      if (org.preferred_url === currentUrl) {
        console.log("currentUrl", currentUrl);
        setPreferredUrl(org.preferred_url);
      } else {
        setPreferredUrl("");
      }
    });

    if (!foundOrganization) {
      router.push("/not-found");
    }
  }, [preferredUrl, router, setPreferredUrl, currentUrl]);

  console.log("preferredUrl", preferredUrl);
  return null;
};

export default VerifyOrgSubdomain;

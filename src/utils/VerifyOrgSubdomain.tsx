"use client";

import { useAuth } from "@/api/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import preferredUrls from "@/api/dummyPreferredUrls.json";
import { useUrl } from "@/api/hooks/useUrl";

const VerifyOrgSubdomain = () => {
  console.log("Verifying Subdomain");
  const { preferredUrl, setPreferredUrl } = useUrl();
  const router = useRouter();
  const { client } = useAuth();

  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const hostname = url.hostname;
      console.log("hostname", hostname)
      const subdomain = hostname.split(".")[0];
      setCurrentUrl(subdomain);
    }
  }, [setPreferredUrl]);

  console.log("currentUrl", currentUrl);

  const { data: allOrganizations, isLoading: isLoadingAllOrganizations } =
    useQuery({
      queryKey: ["allOrganizations"],
      queryFn: async () => {
        return client
          .get(`/api/user/get-url`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      },
    });

  useEffect(() => {
    if (allOrganizations) {
      const foundOrganization = allOrganizations.find(
        (org: { prefferedUrl: string }) => org.prefferedUrl === currentUrl,
      );

      if (foundOrganization) {
        console.log("Matched URL:", foundOrganization.prefferedUrl);
        setPreferredUrl(foundOrganization.prefferedUrl);
      } else {
        console.log("No matching URL found.");
        setPreferredUrl("");
        router.push("/not-found");
      }

    }

    
  }, [preferredUrl, router, setPreferredUrl, currentUrl, allOrganizations]);

  console.log("preferredUrl", preferredUrl);
  return null;
};

export default VerifyOrgSubdomain;

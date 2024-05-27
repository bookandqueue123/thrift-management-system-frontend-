"use client";

import { useAuth } from "@/api/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import preferredUrls from "@/api/dummyPreferredUrls.json";
import { useUrl } from "@/api/hooks/useUrl";

const VerifyOrgSubdomain = () => {
  console.log("Verifying Subdomain");
  const { preferredUrl, setPreferredUrl } = useUrl();
  const router = useRouter();
  const { client } = useAuth();

  const [currentUrl, setCurrentUrl] = useState("");

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
            throw error;
          });
      },
    });

  useEffect(() => {
    const excludedDomains = [
      "staging.finkia.com.ng",
      "www.finkia.com.ng",
      "localhost",
    ];

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const hostname = url.hostname;
      

      // Checking if the current hostname is in the list of excluded domains
      if (!excludedDomains.includes(hostname)) {
        const subdomain = hostname.split(".")[0];
        setCurrentUrl(subdomain);

        if (allOrganizations) {
          const foundOrganization = allOrganizations.find(
            (org: { prefferedUrl: string }) =>
              org.prefferedUrl?.toLowerCase() === currentUrl.toLowerCase(),
          );

          if (foundOrganization) {
           
            setPreferredUrl(foundOrganization.prefferedUrl);
          } else {
            console.log("No matching URL found.");
            setPreferredUrl("");
            router.push("/not-found");
          }
        }
      } else {
        console.log("Excluded domain. Skipping verification.");
      }
    }
    
  }, [preferredUrl, router, setPreferredUrl, currentUrl, allOrganizations]);

  return null;
};

export default VerifyOrgSubdomain;

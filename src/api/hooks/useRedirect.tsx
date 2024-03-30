import React from "react";
import { selectToken } from "@/slices/OrganizationIdSlice";
import { useRouter } from "next/navigation";
import {useSelector } from "react-redux";

const useRedirect = () => {
  const token = useSelector(selectToken);
  const router = useRouter();

  React.useEffect(() => {
    if (!token) {
      router.replace("/signin");
    }
  }, [router, token]);
};

export default useRedirect;

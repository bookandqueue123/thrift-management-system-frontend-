import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectToken } from "@/slices/OrganizationIdSlice";

const useRedirect = () => {
  const token = useSelector(selectToken);
  const router = useRouter();

  React.useEffect(() => {
    if (!token) {
      router.replace("/signin");
    }
  }, [token]);
};

export default useRedirect;

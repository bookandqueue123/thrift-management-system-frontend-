import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectToken } from "@/slices/OrganizationIdSlice";

const useRedirect = () => {
  const token = useSelector(selectToken);
  const router = useRouter();

  React.useEffect(() => {
    console.log("redirection fxn is running");
    console.log("token", token);
    if (!token) {
      router.replace("/signin");
    }
  }, [token]);
};

export default useRedirect;

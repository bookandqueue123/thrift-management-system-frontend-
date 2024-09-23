// hooks/useServiceCheckPermission.js

import { selectUser } from "@/slices/OrganizationIdSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "./useAuth";

const useServiceCheckPermission = () => {
  const user = useSelector(selectUser);
  const { client } = useAuth();
  const {
    data: loggedInUser,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: async () => {
      return client
        .get(`/api/user/${user._id}`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });
  const [checkPermission, setCheckPermission] = useState({
    savings: false,
    purpose: false,
  });

  useEffect(() => {
    if (loggedInUser && loggedInUser.subscriptions) {
      const activeSubscription = loggedInUser.subscriptions.find(
        (subscription: { isActive: boolean }) => subscription.isActive === true,
      );
      console.log(activeSubscription);
      if (activeSubscription) {
        const services = activeSubscription.servicePackage.service || [];
        console.log(services, "services");
        setCheckPermission({
          savings: services.includes("savings"),
          purpose: services.includes("purpose"),
        });
      } else {
        // If no active subscription, set both to false
        setCheckPermission({
          savings: false,
          purpose: false,
        });
      }
    }
  }, [loggedInUser]);

  return checkPermission;
};

export default useServiceCheckPermission;

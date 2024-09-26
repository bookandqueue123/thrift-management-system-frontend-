import { selectUser } from "@/slices/OrganizationIdSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "./useAuth";

interface PermissionState {
  savings: boolean;
  purpose: boolean;
}

const useServiceCheckPermission = () => {
  const user = useSelector(selectUser);
  const { client } = useAuth();
  const [checkPermission, setCheckPermission] = useState<PermissionState>({
    savings: false,
    purpose: false,
  });
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const { data: loggedInUser } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: async () => {
      return client
        .get(`/api/user/${user._id}`, {})
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        });
    },
  });

  useEffect(() => {
    if (loggedInUser && loggedInUser.subscriptions) {
      const activeSubscription = loggedInUser.subscriptions.find(
        (subscription: { isActive: boolean }) => subscription.isActive === true,
      );

      if (activeSubscription) {
        const services = activeSubscription.servicePackage.service || [];
        setCheckPermission({
          savings: services.includes("savings"),
          purpose: services.includes("purpose"),
        });
      } else {
        setCheckPermission({
          savings: false,
          purpose: false,
        });
      }

      setIsLoadingPermissions(false); // Permissions have been fully loaded
    }
  }, [loggedInUser]);

  return { checkPermission, isLoadingPermissions };
};

export default useServiceCheckPermission;

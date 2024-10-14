import useServiceCheckPermission from "@/api/hooks/useServicePermission";
import { useRouter } from "next/navigation";

import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSavings?: boolean;
  requirePurpose?: boolean;
  requireAIPhotoEditor?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireSavings = false,
  requirePurpose = false,
  requireAIPhotoEditor = false,
}) => {
  const { checkPermission, isLoadingPermissions } = useServiceCheckPermission();
  const router = useRouter();

  useEffect(() => {
    // Wait until permissions have been fully loaded
    if (!isLoadingPermissions) {
      if (requireSavings && !checkPermission?.savings) {
        router.push("/pricing");
      } else if (requirePurpose && !checkPermission?.purpose) {
        router.push("/pricing");
      } else if (requireAIPhotoEditor && !checkPermission?.aIPhotoEditor) {
        router.push("/pricing");
      }
    }
  }, [
    requireAIPhotoEditor,
    checkPermission,
    isLoadingPermissions,
    requireSavings,
    requirePurpose,
    router,
  ]);

  // Display loading state while permissions are being fetched
  if (isLoadingPermissions) {
    return <div>Loading...</div>; // Optionally replace with a spinner or skeleton
  }

  return <>{children}</>;
};

export default ProtectedRoute;

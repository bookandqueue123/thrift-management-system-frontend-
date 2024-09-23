// components/ProtectedRoute.js
import useServiceCheckPermission from "@/api/hooks/useServicePermission";
import { useRouter } from "next/navigation";

import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSavings?: boolean;
  requirePurpose?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireSavings = false,
  requirePurpose = false,
}) => {
  const checkPermission = useServiceCheckPermission();
  const router = useRouter();

  useEffect(() => {
    if (!checkPermission.savings && requireSavings) {
      router.push("/pricing");
    } else if (!checkPermission.purpose && requirePurpose) {
      router.push("/pricing");
    }
  }, [checkPermission, requireSavings, requirePurpose, router]);

  // You can add a loading state if needed
  if (
    (!checkPermission.savings && requireSavings) ||
    (!checkPermission.purpose && requirePurpose)
  ) {
    return <div className="text-white">Loading...</div>; // Optional: Display a spinner or skeleton UI
  }

  return children;
};

export default ProtectedRoute;

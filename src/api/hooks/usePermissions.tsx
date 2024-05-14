import { selectUser } from "@/slices/OrganizationIdSlice";
import {
  PermissionsMap,
  PermissionsProviderProps,
  permissionObject,
  permissionsState,
  roleResponse,
} from "@/types";
import { AxiosResponse } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "./useAuth";

const PermissionsContext = createContext<permissionsState | undefined>(
  undefined,
);

export const PermissionsProvider = ({ children }: PermissionsProviderProps) => {
  const { client } = useAuth();
  const user = useSelector(selectUser);
  const [permissionsMap, setPermissionsMap] = useState<{
    [key: string]: string;
  }>({});
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState<boolean>(true);

  useEffect(() => {
    setPermissionsLoading(true);
    if (user && user.role !== "customer") {
      const fetchPermissions = async () => {
        try {
          const response: AxiosResponse<permissionObject[], any> =
            await client.get("api/permission");
          const permissionsMapUpdate = response.data.reduce(
            (acc, permission) => {
              acc[permission.title] = permission._id;
              return acc;
            },
            {} as PermissionsMap,
          );
          setPermissionsMap(permissionsMapUpdate);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchRoles = async () => {
        try {
          const response: AxiosResponse<roleResponse[], any> = await client.get(
            `/api/role?organisation=${user?.role === "organisation" ? user._id : user.organisation}`,
          );

          const userPermissionsUpdate = user.roles.flatMap(
            (roleId) =>
              response.data.find((role) => role._id === roleId)?.permissions ||
              [],
          );
          setUserPermissions(userPermissionsUpdate);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchData = async () => {
        await fetchPermissions();
        await fetchRoles();
        setPermissionsLoading(false);
      };
      fetchData();
    }
  }, [user]);
  console.log("permissionMap", permissionsMap);
  console.log("userPermissions", userPermissions);

  return (
    <PermissionsContext.Provider
      value={{ permissionsMap, permissionsLoading, userPermissions }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

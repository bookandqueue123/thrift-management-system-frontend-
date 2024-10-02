"use client";
import { selectUser, selectUserId } from "@/slices/OrganizationIdSlice";
import {
  AssignedUser,
  PermissionsMap,
  PermissionsProviderProps,
  User,
  permissionObject,
  permissionsState,
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
  const userId = useSelector(selectUserId);
  const [permissionsMap, setPermissionsMap] = useState<{
    [key: string]: string;
  }>({});
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState<boolean>(true);
  const [assignedCustomers, setAssignedCustomers] = useState<AssignedUser[]>(
    [],
  );

  useEffect(() => {
    setPermissionsLoading(true);
    if (user && user.role !== "customer") {
      const fetchActiveUser = async () => {
        try {
          const response: AxiosResponse<User, any> = await client.get(
            `api/user/${userId}`,
          );

          const userPermissionsUpdate = response.data.roles.flatMap((role) =>
            role.permissions.map((permission) => permission._id),
          );
          setAssignedCustomers(response.data.assignedUser);
          setUserPermissions(userPermissionsUpdate);
          return response.data;
        } catch (error) {
          console.error(error);
        }
      };

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

      const fetchData = async () => {
        await fetchActiveUser();
        await fetchPermissions();
        // await fetchRoles();
        setPermissionsLoading(false);
      };
      fetchData();
    }
  }, [user]);
  // console.log("assignedCustomers", assignedCustomers);
  // console.log("permissionMap", permissionsMap);
  // console.log("userPermissions", userPermissions);

  return (
    <PermissionsContext.Provider
      value={{
        permissionsMap,
        permissionsLoading,
        userPermissions,
        assignedCustomers,
      }}
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

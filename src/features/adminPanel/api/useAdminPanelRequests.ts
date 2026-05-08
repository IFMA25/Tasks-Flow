import { UseApiOptions, useApiDelete, useApiGet, useApiPatch } from "@ametie/vue-muza-use";
import { MaybeRefOrGetter, toValue } from "vue";

import { Permission, PermissionRole } from "@/features/adminPanel/types";
import { User, UsersResponse } from "@/shared/types";
import { permissionsCacheKeys } from "@/shared/variables/cacheKey";

export const useAdminPanelRequests = () => {

  const usersDataRequest = (options?: UseApiOptions<UsersResponse>) => {
    return useApiGet<UsersResponse>("/users", {
      ...options,
    });
  };

  const userInfoRequest = (
    userId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<User>,
  ) => {
    return useApiGet<User>(() => `/users/${toValue(userId)}`, {
      cache: {
        id: `user-${toValue(userId)}`,
        swr: true,
      },
      ...options,
    });
  };

  const permissionsRequest = (
    options?: UseApiOptions<Permission[]>,
  ) => {
    return useApiGet<Permission[]>("/permissions", {
      cache: permissionsCacheKeys.permissions,
      ...options,
    });
  };

  const permissionsRoleRequest = (
    options?: UseApiOptions<PermissionRole>,
  ) => {
    return useApiGet<PermissionRole>("/permissions/roles", {
      cache: permissionsCacheKeys.permissionsRoles,
      ...options,
    });
  };

  const updateUserPermissions = (
    userId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<User, { permissions: string[] }>,
  ) => {
    return useApiPatch<User, { permissions: string[] }>(
      () => `/users/${toValue(userId)}/permissions`,
      {
        invalidateCache: `user-${toValue(userId)}`,
        ...options,
      },
    );
  };

  const updateUserRole = (
    userId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<User, { role: string }>,
  ) => {
    return useApiPatch<User, { role: string }>(() => `/users/${toValue(userId)}/role`, {
      invalidateCache: `user-${toValue(userId)}`,
      ...options,
    });
  };

  const userDelete = (
    userId: MaybeRefOrGetter<string>,
    options?: UseApiOptions<User>,
  ) => {
    return useApiDelete<User>(() => `/users/${toValue(userId)}`, {
      invalidateCache: `user-${toValue(userId)}`,
      ...options,
    });
  };

  const updateUserProfile = (
    options?: UseApiOptions<User>,
  ) => {
    return useApiPatch("/me", {
      ...options,
    });
  };

  return {
    usersDataRequest,
    userInfoRequest,
    permissionsRequest,
    permissionsRoleRequest,
    updateUserPermissions,
    updateUserRole,
    userDelete,
    updateUserProfile,
  };
};

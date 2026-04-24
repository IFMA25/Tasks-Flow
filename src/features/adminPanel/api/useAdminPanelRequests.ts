import { UseApiOptions, useApiDelete, useApiGet, useApiPatch } from "@ametie/vue-muza-use";
import { MaybeRefOrGetter, toValue } from "vue";

import { Permission, PermissionRole } from "@/features/adminPanel/types";
import { User, UsersResponse } from "@/shared/types";

export const useUsersDataRequest = (options?: UseApiOptions<UsersResponse>) => {
  return useApiGet<UsersResponse>("/users", {
    // cache: {
    //   id: "users", //не подходит из-за фильтров
    //   swr: true, //на ux  получаем странный эффект не понятный юзеру
    // },
    ...options,
  });
};

export const useUserInfoRequest = (
  userId: MaybeRefOrGetter<string>,
  options?: UseApiOptions<User>,
) => {
  return useApiGet<User>(`/users/${toValue(userId)}`, {
    cache: {
      id: `user-${toValue(userId)}`,
      swr: true,
    },
    ...options,
  });
};

export const usePermissionsRequest = (
  options?: UseApiOptions<Permission[]>,
) => {
  return useApiGet<Permission[]>("/permissions", {
    cache: "permissions",
    ...options,
  });
};

export const usePermissionsRoleRequest = (
  options?: UseApiOptions<PermissionRole>,
) => {
  return useApiGet<PermissionRole>("/permissions/roles", {
    cache: "permissions-roles",
    ...options,
  });
};

export const useUpdateUserPermissions = (
  userId: MaybeRefOrGetter<string>,
  options?: UseApiOptions<User, { permissions: string[] }>,
) => {
  return useApiPatch<User, { permissions: string[] }>(
    `/users/${toValue(userId)}/permissions`,
    {
      invalidateCache: `user-${toValue(userId)}`,
      ...options,
    },
  );
};

export const useUpdateUserRole = (
  userId: MaybeRefOrGetter<string>,
  options?: UseApiOptions<User, { role: string }>,
) => {
  return useApiPatch<User, { role: string }>(`/users/${toValue(userId)}/role`, {
    invalidateCache: `user-${toValue(userId)}`,
    ...options,
  });
};

export const useUserDelete = (
  userId: MaybeRefOrGetter<string>,
  options?: UseApiOptions<User>,
) => {
  return useApiDelete<User>(() => `/users/${toValue(userId)}`, {
    lazy: true,
    invalidateCache: `user-${toValue(userId)}`,
    ...options,
  });
};


export const useUpdateUserProfile = (
  options?: UseApiOptions<User>,
) => {
  return useApiPatch("/me", {
    ...options,
  });
};

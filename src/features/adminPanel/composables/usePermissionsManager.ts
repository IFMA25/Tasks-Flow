import { ref, computed, MaybeRefOrGetter, toValue } from "vue";

import type { Permission } from "../types/index";
import { usePermissionsRules } from "@/shared/composables/usePermissionsRules";

export const usePermissionsManager = (allAvailablePermissions: MaybeRefOrGetter<Permission[]>) => {
  const userPermissions = ref<Record<string, boolean>>({});

  const { hasPermission } = usePermissionsRules();

  const setPermissions = (activePermissions: string[]) => {
    const permissionsMap: Record<string, boolean> = {};

    toValue(allAvailablePermissions)?.forEach((permission) => {
      permissionsMap[permission.value] = activePermissions.includes(permission.value);
    });

    userPermissions.value = permissionsMap;
  };

  const getActivePermissions = (): string[] => {
    return Object.entries(userPermissions.value)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key)
      .sort();
  };

  const areAllSelected = computed(() => {
    const currentActiveCount = Object.values(userPermissions.value).filter((v) => v).length;
    return currentActiveCount === toValue(allAvailablePermissions)?.length;
  });

  const toggleAllPermissions = () => {
    const allPermissions = toValue(allAvailablePermissions)?.map((p) => p.value);
    if (areAllSelected.value) {
      setPermissions([]);
    } else {
      setPermissions(allPermissions);
    }
  };

  return {
    userPermissions,
    areAllSelected,
    hasPermission,
    setPermissions,
    getActivePermissions,
    toggleAllPermissions,
  };
}

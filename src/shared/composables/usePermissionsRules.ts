import { computed } from "vue";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import type { Actions, TaskActionConfig } from "@/shared/types";

export const usePermissionsRules = (actionsConfig?: TaskActionConfig[]) => {
  const profileStore = useProfileStore();

  const hasPermission = (permission: string) => profileStore.hasAccess(permission);

  const flagPermission = (permission: string) =>
    computed(() => profileStore.hasAccess(permission));

  const rowActions = computed<Actions[]>(() => {
    if (!actionsConfig) return [];
    return actionsConfig
      .filter((action) => hasPermission(action.permission))
      .map((action) => ({
        key: action.key,
        label: action.label,
      }));
  });

  return {
    rowActions,
    hasPermission,
    flagPermission,
  };
};

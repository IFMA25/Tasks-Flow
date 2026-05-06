<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import PermissionsControl from "./PermissionsControl.vue";
import { usePermissionsManager } from "../composables/usePermissionsManager";
import { Category, Permission, PermissionRole } from "../types";
import { sameArray } from "../utils";
import PermissionsList from "./PermissionsList.vue";
import { useAdminPanelRequests } from "../api/useAdminPanelRequests";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import { RoleOption, User } from "@/shared/types";
import VButton from "@/shared/ui/common/VButton.vue";

const {
  loading,
  userId,
  userData,
  permissions,
  permissionsRole,
}= defineProps<{
  userId:string;
  userData: User | null;
  permissions: Permission[] | null;
  permissionsRole: PermissionRole | null;
  loading?: boolean;
}>();

const savedPermissions = ref<string[]>([]);

const { t } = useI18n();
const { updateUserPermissions, updateUserRole } = useAdminPanelRequests();

const userRolesList = computed<RoleOption[]>(() => [
  { key: "admin", label: t("roles.admin"), value: "admin" },
  { key: "user", label: t("roles.user"), value: "user" },
]);

const category = computed<Category[]> (() => [
  {
    key: "list",
    value: ["list", "all-lists"],
    label: t("userInfo.categoryList"),
  },
  {
    key: "tasks",
    value: ["task", "all-tasks"],
    label: t("userInfo.categoryTasks"),
  },
  {
    key: "user",
    value: ["users", "user", "roles", "permissions"],
    label: t("userInfo.categoryUser"),
  },
  {
    key: "analytics",
    value: ["analytics", "dashboard"],
    label: t("userInfo.categoryAnalytics"),
  },
]);

const userRole = ref<string | null>(null);

const {
  userPermissions,
  areAllSelected,
  hasPermission,
  setPermissions,
  getActivePermissions,
  toggleAllPermissions,
} = usePermissionsManager(() => permissions);


const {
  execute: updateUserPermissionsExecute,
  loading: updateUserPermissionsLoad,
  data: updateUserPermissionsData,
} = updateUserPermissions(userId, {
  lazy: true,
  data: () => ({ permissions: getActivePermissions() }),
  onSuccess: () => {
    const newPermissions = updateUserPermissionsData.value?.permissions ?? [];
    setPermissions(newPermissions);
    savedPermissions.value = [...newPermissions].sort();
  },
});

const {
  execute: updateUserRoleExecute,
  loading: updateUserRoleLoad,
  data: updateUserRoleData,
} = updateUserRole(userId, {
  lazy: true,
  onSuccess: () => {
    userRole.value = updateUserRoleData.value.role;
  },
});

const handleSubmit = async () => {
  try {
    const promises = [];
    if (isRoleChanged.value) {
      promises.push(updateUserRoleExecute({
        data: { role: userRole.value ?? "" },
      }));
    }
    promises.push(updateUserPermissionsExecute());

    await Promise.all(promises);
    toast.success(t("userInfo.saveSuccess"));
  } catch (e) {
    toast.error(t("userInfo.saveError"));
  }
};

const isUpdating = computed(() => updateUserPermissionsLoad.value || updateUserRoleLoad.value);

const isRoleChanged = computed(() => userRole.value !== userData?.role);

const isDataChanged = computed(() => {
  if (!userData) return false;
  const current = [...getActivePermissions()].sort();
  const isPermissionsChanged = !sameArray(current, savedPermissions.value);

  return isRoleChanged.value || isPermissionsChanged;
});

const isDisabled = computed(() => {
  return isUpdating.value 
    || (!hasPermission('manage:roles') && !hasPermission('manage:permissions'))
    
});

watch(
  () => userData,
  (newUser) => {
    if (!newUser) return;
    userRole.value = newUser.role;
    savedPermissions.value = [...newUser.permissions].sort();

    setPermissions(savedPermissions.value);
  },
  { immediate: true },
);
</script>

<template>
  <form
    id="userInfoForm"
    class="flex flex-col gap-6 p-6 border border-surface rounded-xl"
    @submit.prevent="handleSubmit()"
  >
    <PermissionsControl
      v-model:role="userRole"
      :role-options="userRolesList"
      :all-selected="areAllSelected"
      :loading="loading"
      :disabled="isDisabled"
      @update:all-selected="toggleAllPermissions"
      @update:role="(value) => setPermissions(permissionsRole[value.toUpperCase()])"
    />
    <PermissionsList
      v-model="userPermissions"
      :categories="category"
      :all-permissions="permissions"
      :loading="loading"
      :disabled="isDisabled || userData?.role === 'admin'"
    />
    <div class="ml-auto">
      <VButton
        type="submit"
        variant="primary"
        :text="$t('saveBtnText')"
        :loading="isUpdating"
        :disabled="!isDataChanged || isUpdating || loading"
      />
    </div>
  </form>
</template>

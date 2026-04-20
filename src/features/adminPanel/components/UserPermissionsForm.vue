<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import PermissionsControl from "./PermissionsControl.vue";
import { useUpdateUserPermissions, useUpdateUserRole } from "../api/useAdminPanelRequests";
import { usePermissionsManager } from "../composables/usePermissionsManager";
import { Category, Permission, PermissionRole } from "../types";
import { sameArray } from "../utils";
import PermissionsList from "./PermissionsList.vue";

import { RoleOption, User } from "@/shared/types";
import VButton from "@/shared/ui/common/VButton.vue";

const { t } = useI18n();

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

// const emit = defineEmits(["update-success"]);

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
  setPermissions,
  getActivePermissions,
  areAllSelected,
  toggleAllPermissions,
} = usePermissionsManager(() => permissions);


const {
  execute: updateUserPermissions,
  loading: updateUserPermissionsLoad,
  data: updateUserPermissionsData,
} = useUpdateUserPermissions(() => userId, {
  // data: () => ({ permissions: getActivePermissions() }),
  onSuccess: () => {
    setPermissions(updateUserPermissionsData.value.permissions);
  },
});

const {
  execute: updateUserRole,
  loading: updateUserRoleLoad,
  data: updateUserRoleData,
} = useUpdateUserRole(() => userId, {
  onSuccess: () => {
    userRole.value = updateUserRoleData.value.role;
  },
});

const handleSubmit = async () => {
  try {
    const promises = [];
    if (isRoleChanged.value) {
      promises.push(updateUserRole({
        data: { role: userRole.value ?? "" },
      }));
    }
    promises.push(updateUserPermissions({
      data: { permissions: getActivePermissions() },
    }));

    await Promise.all(promises);
    toast.success(t("userInfo.saveSuccess"));
    // emit("update-success"); - ??? думаю не стоит делать дополнительный гет запрос, патч ответы такие же как и гет. есть ли смысл?
  } catch (e) {
    toast.error(t("userInfo.saveError"));
  }
};

const isUpdating = computed(() => updateUserPermissionsLoad.value || updateUserRoleLoad.value);

const isRoleChanged = computed(() => userRole.value !== userData?.role);

const isDataChanged = computed(() => {
  if (!userData) return false;
  const currentPermissions = getActivePermissions();
  const initialPermissions = [...userData.permissions]?.sort();
  const isPermissionsChanged = !sameArray(currentPermissions, initialPermissions);

  return isRoleChanged.value || isPermissionsChanged;
});

watch(
  [() => userData, () => permissions],
  ([newUser, allPermissions]) => {
    if (!newUser || !allPermissions?.length) return;
    setPermissions(newUser.permissions);
    userRole.value = newUser.role;
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
      :disabled="isUpdating"
      @update:all-selected="toggleAllPermissions"
      @update:role="(value) => setPermissions(permissionsRole[value.toUpperCase()])"
    />
    <PermissionsList
      v-model="userPermissions"
      :categories="category"
      :all-permissions="permissions"
      :loading="loading"
      :disabled="isUpdating"
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

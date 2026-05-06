<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import {
  computed,
  ref,
  useTemplateRef,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { useAdminPanelRequests } from "./api/useAdminPanelRequests";
import DeleteUserModal from "./components/DeleteUserModal.vue";
import UsersTableToolbar from "./components/UsersTableToolbar.vue";
import { formatDate } from "./utils";

import {
  ActionKey,
  RoleOption,
  SortOption,
  TaskActionConfig,
  User,
} from "@/shared/types";
import { RouteNames } from "@/shared/types/routeNames";
import VActionsDropdown from "@/shared/ui/VActionsDropdown.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";
import VTable from "@/shared/ui/table/VTable.vue";
import { usePermissionsRules } from "@/shared/composables/usePermissionsRules";

const { t } = useI18n();

const actionsConfig:TaskActionConfig[]= [
    {
      key: "edit", 
      label: t("usersList.userProfile"),
      permission:"update:user",
    },
     {
        key: "delete",
        label: t("deleteModal.title", { entityName: t("usersList.user") }),
        permission:"delete:user",
      }
  ];

const { rowActions } = usePermissionsRules(actionsConfig);

const tableHeads = computed(() => [
  { key: "member", label: t("table.tableHeads.member"), position: "text-left" },
  { key: "role", label: t("table.tableHeads.role"), position: "text-left", columnStyles: "text-toggle capitalize" },
  { key: "createdAt", label: t("table.tableHeads.createdAt"), position: "text-left" },
  { key: "action", label: t("table.tableHeads.action"), position: "text-center" },
]);

const roleOptions = computed<RoleOption[]>(() => [
  { key: "allRoles", label: t("filters.allRoles"), value: undefined },
  { key: "admins", label: t("filters.admins"), value: "admin" },
  { key: "users", label: t("filters.users"), value: "user" },
]);

const sortOptions = computed<SortOption[]>(() => [
  { key: "newestFirst", label: t("filters.newestFirst"), params: { sort: "createdAt", order: "desc" } },
  { key: "oldestFirst", label: t("filters.oldestFirst"), params: { sort: "createdAt", order: "asc" } },
  { key: "nameAsc", label: t("filters.nameAsc"), params: { sort: "name", order: "asc" } },
  { key: "nameDesc", label: t("filters.nameDesc"), params: { sort: "name", order: "desc" } },
]);

const currentLimit = ref(20);
const roleModel = ref<string>(roleOptions.value[0].key);
const sortModel = ref<string>(sortOptions.value[0].key);
const modelSearch = ref<string>("");
const debouncedSearch = refDebounced(modelSearch, 800);

const deleteModalRef = useTemplateRef<InstanceType<typeof DeleteUserModal>>("deleteModalRef");

const router = useRouter();
const { usersDataRequest } = useAdminPanelRequests();

const fetchParams = computed(() => {
  const selectedSort = sortOptions.value.find(o => o.key === sortModel.value)?.params;
  const selectedRole = roleOptions.value.find(o => o.key === roleModel.value)?.value;
  return {
    limit: currentLimit.value,
    q: debouncedSearch.value || undefined,
    role: selectedRole,
    sort: selectedSort?.sort,
    order: selectedSort?.order,
  };
});

const { execute, loading, data: usersData } = usersDataRequest({
  immediate: true,
  params: () => fetchParams.value,
});

const loadMore = (limit: number) => {
  currentLimit.value += limit;
  execute();
};

const actionHandlers: Record<ActionKey, (user: User) => void> = {
  edit: (user) => router.push({ name: RouteNames.profile, query: { id: user.id } }),
  delete: (user) => deleteModalRef.value?.openModal(user),
};
</script>

<template>
  <DeleteUserModal
    ref="deleteModalRef"
    @deleted="execute()"
  />
  <div class="h-full flex flex-col gap-6">
    <VTitle :text="$t('usersList.title')" />
    <VTable
      :rows="usersData?.data ?? []"
      :heads="tableHeads"
      :loading="loading"
      :pagination="usersData?.pagination"
      @load-more="loadMore"
    >
      <template #toolbar>
        <UsersTableToolbar
          v-model:search="modelSearch"
          v-model:role="roleModel"
          v-model:sort="sortModel"
          :role-options="roleOptions"
          :sort-options="sortOptions"
        />
      </template>
      <template #cell-member="{ row }">
        <div class="flex flex-col leading-tight">
          <span class="mb-1">{{ row.name }}</span>
          <span class="text-xs text-secondary">{{ row.email }}</span>
        </div>
      </template>
      <template #cell-role="{ row }">
        <span :class="{ 'font-medium': row.role === 'admin' }">
          {{ t(`roles.${row.role}`) }}
        </span>
      </template>
      <template #cell-createdAt="{ row }">
        <span class="text-xs text-secondary">{{ formatDate(row.createdAt) }}</span>
      </template>
      <template
        #cell-action="{ row }"
      >
        <VActionsDropdown
          :actions="rowActions"
          @action="(actionKey) => actionHandlers[actionKey]?.(row)"
        />
      </template>
    </VTable>
  </div>
</template>

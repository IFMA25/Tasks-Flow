<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import {
  computed,
  ref,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import {
  useUsersDataRequest,
} from "./api/useAdminPanelRequests";
import UsersTableToolbar from "./components/UsersTableToolbar.vue";
import { formatDate } from "./utils";

import { useSelectedOption } from "@/shared/composables/useSelectedOption";
import {
  ActionKey,
  Actions,
  RoleOption,
  SortOption,
  User,
} from "@/shared/types";
import { RouteNames } from "@/shared/types/routeNames";
import VTitle from "@/shared/ui/common/VTitle.vue";
import VTable from "@/shared/ui/table/VTable.vue";
import VActionsDropdown from "@/shared/ui/VActionsDropdown.vue";
import DeleteUserModal from "./components/DeleteUserModal.vue";

const { t } = useI18n();

const tableHeads = computed(() => [
  { key: "member", label: t("table.tableHeads.member"), position: "text-left" },
  { key: "role", label: t("table.tableHeads.role"), position: "text-left", columnStyles: "text-toggle capitalize" },
  { key: "createdAt", label: t("table.tableHeads.createdAt"), position: "text-left" },
  { key: "action", label: t("table.tableHeads.action"), position: "text-center" },
]);

const actions = computed<Actions[]>(() => [
  { key: "edit", label: t("usersList.userProfile") },
  { key: "delete", label: t("deleteModal.title", { entityName: t("usersList.user") }) },
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

const activeRoleKey = ref<string>(roleOptions.value[0].key);
const activeSortKey = ref<string>(sortOptions.value[0].key);

const selectedRole = useSelectedOption<RoleOption>(
  roleOptions,
  activeRoleKey,
  (value) => {
    activeRoleKey.value = String(value);
  }
);

const selectedSort = useSelectedOption<SortOption>(
  sortOptions,
  activeSortKey,
  (value) => {
    activeSortKey.value = String(value);
  }
);

const modelSearch = ref<string>("");
const debouncedSearch = refDebounced(modelSearch, 800);
const currentLimit = ref<number>(20);
const deleteModalRef = ref<InstanceType<typeof DeleteUserModal> | null>(null);

const router = useRouter();

const { execute, loading, data: usersData } = useUsersDataRequest({
  immediate: true,
  watch: [selectedRole, selectedSort, debouncedSearch],
  params: () => ({
    limit: currentLimit.value,
    q: modelSearch.value.trim() || undefined,
    role: selectedRole.value?.value,
    sort: selectedSort.value.params.sort,
    order: selectedSort.value.params.order,
  }),
});

const loadMore = (limit: number) => {
  currentLimit.value += limit;
  execute();
};

const handleAction = (user: User, action: ActionKey) => {
  if (action === "edit") {
    router.push({ name: RouteNames.profile, query: { id: user.id } });
  }
  if (action === "delete") {
    deleteModalRef.value?.openModal(user);
  }
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
          v-model:role="selectedRole"
          v-model:sort="selectedSort"
          :options="{
            roleOptions: roleOptions,
            sortOptions: sortOptions
          }"
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
          :actions="actions"
          @action="(actionKey) => handleAction(row, actionKey)" />
      </template>
    </VTable>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import {
  computed,
  ref,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import {
  useUserDelete,
  useUsersDataRequest,
} from "./api/useAdminPanelRequests";
import UsersTableToolbar from "./components/UsersTableToolbar.vue";
import { formatDate } from "./utils";
import LangSwitcher from "../translation/components/LangSwitcher.vue";

import { useModal } from "@/shared/composables/useModal";
import {
  RoleOption,
  SortOption,
  User,
} from "@/shared/types";
import { RouteNames } from "@/shared/types/routeNames";
import VButton from "@/shared/ui/common/VButton.vue";
import VModal from "@/shared/ui/common/VModal.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";
import VDropdown from "@/shared/ui/common/dropdown/VDropdown.vue";
import VTable from "@/shared/ui/table/VTable.vue";
import { capitalizeFirstLetter } from "@/shared/utils";


const { t } = useI18n();

const tableHeads = computed(() => [
  { key: "member", label: t("table.tableHeads.member"), position: "text-left" },
  { key: "role", label: t("table.tableHeads.role"), position: "text-left", columnStyles: "text-toggle capitalize" },
  { key: "createdAt", label: t("table.tableHeads.createdAt"), position: "text-left" },
  { key: "action", label: t("table.tableHeads.action"), position: "text-center" },
]);

const actions = computed(() => [
  { key: "edit", label: t("usersList.userProfile") },
  { key: "delete", label: t("usersList.removeUser") },
]);

const roleOptions = computed<RoleOption[]>(() => [
  { label: t("filters.allRoles"), value: undefined },
  { label: t("filters.admins"), value: "admin" },
  { label: t("filters.users"), value: "user" },
]);

const sortOptions = computed<SortOption[]>(() => [
  { key: "newestFirst", label: t("filters.newestFirst"), params: { sort: "createdAt", order: "desc" } },
  { key: "oldestFirst", label: t("filters.oldestFirst"), params: { sort: "createdAt", order: "asc" } },
  { key: "nameAsc", label: t("filters.nameAsc"), params: { sort: "name", order: "asc" } },
  { key: "nameDesc", label: t("filters.nameDesc"), params: { sort: "name", order: "desc" } },
]);

const selectedUser = ref<User | null>(null);
const activeRoleKey = ref<string>(roleOptions.value[0].value);
const activeSortKey = ref<string>(sortOptions.value[0].key);

const selectedRole = computed({
  get: () => roleOptions.value
    .find(option => option.value === activeRoleKey.value)
      || roleOptions.value[0],
  set: (option: RoleOption) => {
    activeRoleKey.value = option.value;
  },
});

const selectedSort = computed({
  get: () => sortOptions.value
    .find(option => option.key === activeSortKey.value)
      || sortOptions.value[0],
  set: (option: SortOption) => {
    activeSortKey.value = option.key;
  },
});
const modelSearch = ref<string>("");
const debouncedSearch = refDebounced(modelSearch, 800);
const currentLimit = ref<number>(20);

const router = useRouter();
const { open: openDeleteModal, close: closeDeleteModal } = useModal("userDeleteModal");

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

const { execute: deleteUser, loading: deletingLoading  }
= useUserDelete(() => selectedUser.value.id, {
  onSuccess: () => {
    execute();
    closeDeleteModal();
    toast.warning(t("usersList.removeUserModal.msgDeleteSuccess"));
  },
});

const loadMore = (limit: number) => {
  currentLimit.value += limit;
  execute();
};

const handelAction = (user: User, action: string) => {
  if (action === "edit") {
    router.push({ name: RouteNames.profile, query: { id: user.id } });
  }
  if (action === "delete") {
    selectedUser.value = user;
    openDeleteModal();
  }
};
</script>

<template>
  <VModal
    id="userDeleteModal"
    :title="$t('usersList.removeUserModal.title')"
    max-width="md"
  >
    <p class="font-semibold mb-2">
      {{ $t('usersList.removeUserModal.titleContent') }}
      {{ selectedUser?.name }} ({{ selectedUser?.email }})?
    </p>
    <p class="text-xs">
      {{ $t('usersList.removeUserModal.subtitleContent') }}
    </p>
    <template #footer>
      <VButton
        :text="$t('usersList.removeUserModal.cancel')"
        variant="outline"
        @click="closeDeleteModal"
      />
      <VButton
        :text="$t('usersList.removeUserModal.confirmRemove')"
        variant="danger"
        :loading="deletingLoading"
        @click="deleteUser()"
      />
    </template>
  </VModal>
  <LangSwitcher class="absolute top-4 right-6" />
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
        <VDropdown>
          <template #trigger="{toggle}">
            <VButton
              icon="actions-btn"
              icon-size="w-8 h-8"
              class="w-full justify-center text-primaryBg font-bold text-lg"
              @click="toggle"
            />
          </template>
          <ul class="cursor-pointer flex flex-col gap-2">
            <li
              v-for="action in actions"
              :key="action.key"
              :class="action.key === 'delete'
                ? 'text-danger hover:text-dangerHover'
                : 'hover:text-primaryBg'"
              @click="handelAction(row, action.key)"
            >
              {{ capitalizeFirstLetter(action.label) }}
            </li>
          </ul>
        </VDropdown>
      </template>
    </VTable>
  </div>
</template>

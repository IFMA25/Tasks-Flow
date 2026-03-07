<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import {
  computed,
  ref,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { useListsRequests } from "./api/useListsRequest";
import DeleteListModal from "./components/DeleteListModal.vue";
import ListFormModal from "./components/ListFormModal.vue";
import ListItem from "./components/ListItem.vue";
import ListsToolbar from "./components/ListsToolbar.vue";
import UsersListItem from "./components/UsersListItem.vue";
import { useDeleteList } from "./composable/useDeleteList";
import { useListForm } from "./composable/useListForm";
import { useListModalManager } from "./composable/useListModalManager";
import { useListsStore } from "./store/useListsStore";

import { SortOption } from "@/shared/types";
import VEmptyState from "@/shared/ui/EmptyState.vue";
import VButton from "@/shared/ui/common/VButton.vue";
import VLoader from "@/shared/ui/common/VLoader.vue";
import VTab from "@/shared/ui/common/VTab.vue";

const { t } = useI18n();

const actions = computed(() => [
  { key: "edit", label: t("lists.editList") },
  { key: "delete", label: t("lists.deleteList.title") },
]);

const sortOptions = computed<SortOption[]>(() => [
  { key: "recentlyCreated", label: t("filters.recentlyCreated"), params: { sort: "createdAt", order: "asc" } },
  { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } },
]);

const tabs = computed(() => [
  { value: "myLists", label: t("lists.myLists") },
  { value: "usersLists", label: t("lists.usersLists") },
]);

const modelSearch = ref<string>("");
const currentLimit = ref<number>(20);
const activeSortKey = ref<string>(sortOptions.value[0].key);

const route = useRoute();
const router = useRouter();

const onSearchInput = useDebounceFn(() => {
  fetchListsData();
}, 800);

const selectedSort = computed({
  get: () => sortOptions.value
    .find(option => option.key === activeSortKey.value)
      || sortOptions.value[0],
  set: (option: SortOption) => {
    activeSortKey.value = option.key;
  },
});

const activeTab = computed({
  get: () => {
    const tab = route.query.tab;
    return typeof tab === "string" ? tab : "myLists";
  },
  set: (value) => {
    activeSortKey.value = sortOptions.value[0].key;
    modelSearch.value = "";
    router.replace({ query: { ...route.query, tab: value } });
  },
});

const {
  selectedList,
  editListName,
  editListColor,
  handleCloseFormModal,
  handleCloseDeleteModal,
  openCreateModal,
  handleAction,
} = useListModalManager();

const { getAllLists } = useListsRequests();
const listsStore = useListsStore();

const {
  execute: fetchListsData,
  loading: fetchListsLoading,
  data: listsDataResponse,
} = getAllLists({
  immediate: true,
  watch: [selectedSort, () => activeTab.value],
  params: () => ({
    limit: currentLimit.value,
    q: modelSearch.value || undefined,
    sort: selectedSort.value.params.sort,
    order: selectedSort.value.params.order,
    isOwn: activeTab.value === "myLists" ? true : undefined,
  }),
  onSuccess: () => {
    listsStore.setLists(listsDataResponse.value?.data);
  },
});

const { deleteListExecute, deleteListLoading } = useDeleteList(
  selectedList,
  () => { fetchListsData(); handleCloseDeleteModal(); },
);

const { handleSubmit, createListLoading, updateListLoading } = useListForm(
  selectedList,
  { name: editListName, color: editListColor },
  () => { fetchListsData(); handleCloseFormModal(); },
);

const isLoading = computed(() =>
  fetchListsLoading.value ||
  createListLoading.value ||
  updateListLoading.value,
);
</script>

<template>
  <Teleport
    to="#header-actions"
    defer
  >
    <VButton
      icon="icon-plus"
      variant="primary"
      :text="$t('tasks.createTasksBtn')"
      @click="openCreateModal()"
    />
  </Teleport>
  <ListFormModal
    v-model:name="editListName"
    v-model:color="editListColor"
    :selected-list-data="selectedList"
    :loading="updateListLoading"
    @save-changes="handleSubmit"
    @close="handleCloseFormModal"
  />
  <DeleteListModal
    :selected-list-data="selectedList"
    :loading="deleteListLoading"
    @close="handleCloseDeleteModal"
    @confirm-delete="deleteListExecute"
  />
  <ListsToolbar
    v-model:search="modelSearch"
    v-model:sort="selectedSort"
    :active-tab="activeTab"
    :sort-options="sortOptions"
    @update:search="onSearchInput"
  />
  <div class="border border-subtle p-1 rounded-2xl w-fit mb-7">
    <VTab
      v-model="activeTab"
      :tab-items="tabs"
    />
  </div>
  <div
    v-if="listsStore.listsData.length"
    class="relative min-h-96 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6"
  >
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm"
      >
        <VLoader
          color="primaryDark"
          size="h-[100px]"
        />
      </div>
    </Transition>
    <template
      v-for="data in listsStore.listsData"
      :key="data.id"
    >
      <ListItem
        v-if="activeTab === 'myLists'"
        :actions="actions"
        :data="data"
        @action="handleAction"
      />
      <UsersListItem
        v-else-if="activeTab === 'usersLists'"
        :data="data"
      />
    </template>
  </div>
  <div
    v-else-if="!isLoading && !listsStore.listsData.length"
    class="py-16 px-4"
  >
    <VEmptyState
      :title="$t('table.emptyState.title')"
      :subtitle="$t('table.emptyState.subtitle')"
    />
  </div>
</template>

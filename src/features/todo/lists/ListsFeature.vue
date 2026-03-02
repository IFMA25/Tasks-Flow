<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useCreateNewList, useDeleteList, useListsDataRequest, useUpdateList } from "./api/useListsRequest";
import DeleteListModal from "./components/DeleteListModal.vue";
import ListFormModal from "./components/ListFormModal.vue";
import ListItem from "./components/ListItem.vue";
import ToolbarLists from "./components/ToolbarLists.vue";
import UserListItem from "./components/UserListItem.vue";
import { useListModalState } from "./composable/useListModalState";
import { ListData } from "./types";

import { SortOption } from "@/shared/types";
import VLoader from "@/shared/ui/common/VLoader.vue";

const { t } = useI18n();

const { activeTab } = defineProps<{
  activeTab: string;
}>();

const actions = computed(() => [
  { key: "edit", label: t("lists.editList") },
  { key: "delete", label: t("lists.deleteList.title") },
]);

const sortOptions = computed<SortOption[]>(() => [
  { key: "recentlyCreated", label: t("filters.recentlyCreated"), params: { sort: "createdAt", order: "asc" } },
  { key: "recentlyUpdated", label: t("filters.recentlyUpdated"), params: { sort: "updatedAt", order: "desc" } },
  { key: "nameAsc", label: t("filters.nameAsc"), params: { sort: "title", order: "asc" } },
  { key: "nameDesc", label: t("filters.nameDesc"), params: { sort: "title", order: "desc" } },
]);

const listsData = ref<ListData[]>([]);
const modelSearch = ref<string>("");
const debouncedSearch = refDebounced(modelSearch, 800);
const currentLimit = ref<number>(20);
// const activeRoleValue = ref<string | undefined>(undefined);
const activeSortKey = ref<string>(sortOptions.value[0].label);

const selectedSort = computed({
  get: () => sortOptions.value
    .find(option => option.key === activeSortKey.value)
      || sortOptions.value[0],
  set: (option: SortOption) => {
    activeSortKey.value = option.key;
  },
});

const {
  selectedList,
  editListName,
  editListColor,
  handleCloseFormModal,
  handleCloseDeleteModal,
  handleAction,
} = useListModalState();

const {
  execute: fetchListsData,
  loading: fetchListsLoading,
  data: ListsResponse,
} = useListsDataRequest({
  immediate: true,
  watch: [selectedSort, debouncedSearch,() => activeTab],
  params: () => ({
    limit: currentLimit.value,
    q: debouncedSearch.value.trim() || undefined,
    sort: selectedSort.value.params.sort,
    order: selectedSort.value.params.order,
    isOwn: activeTab === "myLists" ? true : undefined,
  }),
  onSuccess: () => {
    listsData.value = ListsResponse.value?.data || [];
    console.log("Fetched lists data:", listsData.value);
  },
});

const submitOptions = {
  data: () => ({
    title: editListName.value,
    hexColor: editListColor.value,
  }),
  onSuccess: () => {
    fetchListsData();
    handleCloseFormModal();
  },
};

const {
  execute: createNewList,
  loading: createListLoading,
} = useCreateNewList(submitOptions);
const {
  execute: updateSelectedList,
  loading: updateListLoading }
  = useUpdateList(() => selectedList.value?.id, submitOptions);

const {
  execute: deleteList,
  loading: deleteListLoading,
} = useDeleteList(() => selectedList.value?.id, {
  onSuccess: () => {
    fetchListsData();
    handleCloseDeleteModal();
  },
});

const handleSubmit = () => {
  if (selectedList.value?.id) {
    updateSelectedList();
  } else {
    createNewList();
  }
};

const isLoading = computed(() =>
  fetchListsLoading.value ||
  createListLoading.value ||
  updateListLoading.value,
);

</script>


<template>
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
    @confirm-delete="deleteList"
  />
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
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
  <ToolbarLists
    v-model:search="modelSearch"
    v-model:sort="selectedSort"
    :active-tab="activeTab"
    :sort-options="sortOptions"
  />
  <div class="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
    <template
      v-for="data in listsData"
      :key="data.id"
    >
      <UserListItem
        v-if="activeTab === 'myLists'"
        :actions="actions"
        :data="data"
        @action="handleAction"
      />
      <ListItem
        v-else-if="activeTab === 'usersLists'"
        :data="data"
      />
    </template>
  </div>
</template>

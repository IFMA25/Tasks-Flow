<script setup lang="ts">


import { refDebounced } from "@vueuse/core";
import {
  computed,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";

import { ListData } from "../types";
import {
  useCreateNewList,
  useDeleteList,
  useListsDataRequest,
  useUpdateList,
} from "./api/useListsRequest";
import DeleteListModal from "./components/DeleteListModal.vue";
import ListFormModal from "./components/ListFormModal.vue";
import ListItem from "./components/ListItem.vue";
import ListsToolbar from "./components/ListsToolbar.vue";
import UsersListItem from "./components/UsersListItem.vue";
import { useListModalState } from "./composable/useListModalState";

import { SortOption } from "@/shared/types";
import VEmptyState from "@/shared/ui/EmptyState.vue";
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
]);

const listsData = ref<ListData[]>([]);
const modelSearch = ref<string>("");
const debouncedSearch = refDebounced(modelSearch, 800);
const currentLimit = ref<number>(20);
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
    q: debouncedSearch.value || undefined,
    sort: selectedSort.value.params.sort,
    order: selectedSort.value.params.order,
    isOwn: activeTab === "myLists" ? true : undefined,
  }),
  onSuccess: () => {
    listsData.value = ListsResponse.value?.data || [];
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

// ??? нужен ли тут вотчер

watch(() => activeTab, () => {
  selectedSort.value = sortOptions.value[0];
  modelSearch.value = "";
});
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
  <ListsToolbar
    v-model:search="modelSearch"
    v-model:sort="selectedSort"
    :active-tab="activeTab"
    :sort-options="sortOptions"
  />
  <div
    v-if="listsData.length > 0"
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
      v-for="data in listsData"
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
    v-else-if="!isLoading && listsData.length === 0"
    class="py-16 px-4"
  >
    <VEmptyState
      :title="$t('table.emptyState.title')"
      :subtitle="$t('table.emptyState.subtitle')"
    />
  </div>
</template>

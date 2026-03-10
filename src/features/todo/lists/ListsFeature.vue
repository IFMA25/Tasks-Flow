<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from 'vue';

import { useI18n } from 'vue-i18n';
import {
  useRoute,
  useRouter,
} from 'vue-router';

import { SortOption } from '@/shared/types';
import VButton from '@/shared/ui/common/VButton.vue';
import VLoader from '@/shared/ui/common/VLoader.vue';
import VTab from '@/shared/ui/common/VTab.vue';
import VEmptyState from '@/shared/ui/EmptyState.vue';
import { useDebounceFn } from '@vueuse/core';

import { ListData } from '../types';
import DeleteListModal from './components/DeleteListModal.vue';
import ListFormModal from './components/ListFormModal.vue';
import ListItem from './components/ListItem.vue';
import ListsToolbar from './components/ListsToolbar.vue';
import UsersListItem from './components/UsersListItem.vue';
import { useListsStore } from './store/useListsStore';

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
const activeSortKey = ref<string>(sortOptions.value[0].key);

const route = useRoute();
const router = useRouter();

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
    modelSearch.value = "";
    router.replace({ query: { ...route.query, tab: value } });
  },
});

const listsStore = useListsStore();

const formModalRef = ref<InstanceType<typeof ListFormModal> | null>(null);
const deleteModalRef = ref<InstanceType<typeof DeleteListModal> | null>(null);

const handleAction = (list: ListData, action: string) => {
  if (action === "edit") {
    formModalRef.value?.open(list);
  } else if (action === "delete") {
    deleteModalRef.value?.open(list);
  }
};

const openCreateModal = () => {
  formModalRef.value?.open();
};

const updateLists = () => {
  listsStore.fetchFilteredLists({
    q: modelSearch.value || undefined,
    sort: selectedSort.value.params.sort,
    order: selectedSort.value.params.order,
    isOwn: activeTab.value === "myLists" ? true : undefined,
  });
};

const onSearchInput = useDebounceFn(() => {
  updateLists();
}, 800);

watch(
  [() => route.query.tab, activeSortKey],
  () => {
    updateLists();
  },
  { immediate: true },
);
</script>

<template>
  <Teleport
    to="#header-actions"
    defer
  >
    <VButton
      v-if="activeTab === 'myLists'"
      icon="icon-plus"
      variant="primary"
      :text="$t('lists.createListBtn')"
      @click="openCreateModal()"
    />
  </Teleport>
  <ListFormModal ref="formModalRef" />
  <DeleteListModal ref="deleteModalRef" />
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
        v-if="listsStore.isLoading"
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
    v-else-if="!listsStore.isLoading && !listsStore.listsData.length"
    class="py-16 px-4"
  >
    <VEmptyState
      :title="$t('table.emptyState.title')"
      :subtitle="$t('table.emptyState.subtitle')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { ListAction, ListData } from "../types";
import DeleteListModal from "./components/DeleteListModal.vue";
import ListFormModal from "./components/ListFormModal.vue";
import ListItem from "./components/ListItem.vue";
import ListsToolbar from "./components/ListsToolbar.vue";
import UsersListItem from "./components/UsersListItem.vue";
import { useListsFeature } from "./composable/useListsFeature";

import VEmptyState from "@/shared/ui/EmptyState.vue";
import VTransitionLoader from "@/shared/ui/VTransitionLoader.vue";
import VButton from "@/shared/ui/common/VButton.vue";
import VTab from "@/shared/ui/common/VTab.vue";
import { listsTabs } from "@/shared/variables/tabListsPage";

const {
  listsStore,
  sortOptions,
  tabs,
  actions,
  modelSearch,
  selectedSort,
  activeTab,
  userLists,
  onSearchInput,
  updateLists,
} = useListsFeature();

const formModalRef = ref<InstanceType<typeof ListFormModal> | null>(null);
const deleteModalRef = ref<InstanceType<typeof DeleteListModal> | null>(null);

const handleAction = (list: ListData, action: ListAction) => {
  if (action === "edit") {
    formModalRef.value?.openModal(list);
  } else if (action === "delete") {
    deleteModalRef.value?.openModal(list);
  }
};
</script>

<template>
  <Teleport
    to="#header-actions"
    defer
  >
    <VButton
      v-if="activeTab === listsTabs.myLists"
      icon="icon-plus"
      variant="primary"
      :text="$t('lists.createListBtn')"
      @click="formModalRef?.openModal()"
    />
  </Teleport>
  <ListFormModal ref="formModalRef" />
  <DeleteListModal
    ref="deleteModalRef"
    @deleted="updateLists"
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
  <div class="relative min-h-[200px]">
    <VTransitionLoader :is-loading="listsStore.isLoading" />
    <div
      v-if="listsStore.dataLists?.data.length"
      class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6"
    >
      <template v-if="activeTab === listsTabs.myLists">
        <ListItem
          v-for="data in listsStore.dataLists?.data"
          :key="data.id"
          :data="data"
          :actions="actions"
          @action="handleAction"
        />
      </template>
      <template v-else-if="activeTab === listsTabs.usersLists">
        <UsersListItem
          v-for="group in userLists"
          :key="group.owner.id"
          :data="group"
        />
      </template>
    </div>
    <div
      v-else-if="!listsStore.isLoading"
      class="py-16 px-4"
    >
      <VEmptyState
        :title="$t('table.emptyState.title')"
        :subtitle="$t('table.emptyState.subtitle')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import VButton from '@/shared/ui/common/VButton.vue';
import VTab from '@/shared/ui/common/VTab.vue';
import VEmptyState from '@/shared/ui/EmptyState.vue';
import VTransitionLoader from '@/shared/ui/VTransitionLoader.vue';

import { ListData } from '../types';
import DeleteListModal from './components/DeleteListModal.vue';
import ListFormModal from './components/ListFormModal.vue';
import ListItem from './components/ListItem.vue';
import ListsToolbar from './components/ListsToolbar.vue';
import UsersListItem from './components/UsersListItem.vue';
import { useListForm } from './composable/useListForm';
import { useListsFeature } from './composable/useListsFeature';

const {
  listsStore,
  actions,
  sortOptions,
  tabs,
  modelSearch,
  selectedSort,
  activeTab,
  userLists,
  onSearchInput,
} = useListsFeature();

const {open} = useListForm();

const deleteModalRef = ref<InstanceType<typeof DeleteListModal> | null>(null);

const handleAction = (list: ListData, action: string) => {
  if (action === "edit") {
    console.log("handelAction", list);
    open(list);
  } else if (action === "delete") {
    deleteModalRef.value?.open(list);
  }
};
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
      @click="open()"
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
  <div class="relative min-h-[200px]">
    <VTransitionLoader :is-loading="listsStore.isLoading" />
    <div
      v-if="listsStore.dataLists?.data.length"
      class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6"
    >
      <template v-if="activeTab === 'myLists'">
        <ListItem
          v-for="data in listsStore.dataLists?.data"
          :key="data.id"
          :actions="actions"
          :data="data"
          @action="handleAction"
        />
      </template>
      <template v-else-if="activeTab === 'usersLists'">
        <UsersListItem
          v-for="group in userLists"
          :key="group.owner.id"
          :data="group"
        />
      </template>
    </div>
    <div
      v-else-if="!listsStore.isLoading && !listsStore.dataLists?.data.length"
      class="py-16 px-4"
    >
      <VEmptyState
        :title="$t('table.emptyState.title')"
        :subtitle="$t('table.emptyState.subtitle')"
      />
    </div>
  </div>
</template>

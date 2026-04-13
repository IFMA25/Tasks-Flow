<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

import { ListAction, ListData } from "../types";
import DeleteListModal from "./components/DeleteListModal.vue";
import ListFormModal from "./components/ListFormModal.vue";
import ListItem from "./components/ListItem.vue";
import ListsToolbar from "./components/ListsToolbar.vue";
import UsersListItem from "./components/UsersListItem.vue";
import ListItemSkeleton from "./components/skeleton/ListItemSkeleton.vue";
import UsersListItemSkeleton from "./components/skeleton/UsersListItemSkeleton.vue";
import { useListsFeature } from "./composable/useListsFeature";

import type { Actions } from "@/shared/types";
import VEmptyState from "@/shared/ui/EmptyState.vue";
import VButton from "@/shared/ui/common/VButton.vue";
import VTab from "@/shared/ui/common/VTab.vue";
import { listsTabs } from "@/shared/variables/tabListsPage";

const skeletonCount = 6;

const { t } = useI18n();

const formModalRef = useTemplateRef<InstanceType<typeof ListFormModal>>("formModalRef");
const deleteModalRef = useTemplateRef<InstanceType<typeof DeleteListModal>>("deleteModalRef");

const { activeTab, userLists, filters, sortOptions, listsStore, handleRequest } = useListsFeature();

const actions = computed<Actions[]>(() => [
  { key: "edit",   label: t("lists.editList") },
  { key: "delete", label: t("deleteModal.title", { entityName: t("lists.list") }) },
]);

const tabs = computed(() => [
  { value: "myLists",    label: t("lists.myLists")    },
  { value: "usersLists", label: t("lists.usersLists") },
]);

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

  <ListFormModal
    ref="formModalRef"
    @request="handleRequest"
  />
  <DeleteListModal
    ref="deleteModalRef"
    @request="handleRequest"
  />

  <ListsToolbar
    v-model:search="filters.search"
    v-model:sort="filters.sort"
    :sort-options="sortOptions"
    :show-search="activeTab === listsTabs.myLists"
  />

  <div class="border border-subtle p-1 rounded-2xl w-fit mb-7">
    <VTab
      v-model="activeTab"
      :tab-items="tabs"
    />
  </div>

  <div class="relative min-h-[12.5rem]">
    <template v-if="listsStore.isLoading">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 h-full">
        <template v-if="activeTab === listsTabs.myLists">
          <ListItemSkeleton
            v-for="n in skeletonCount"
            :key="n"
          />
        </template>
        <template v-else-if="activeTab === listsTabs.usersLists">
          <UsersListItemSkeleton
            v-for="n in skeletonCount"
            :key="n"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <div
        v-if="listsStore.dataLists?.data.length"
        class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6"
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
    </template>
  </div>
</template>

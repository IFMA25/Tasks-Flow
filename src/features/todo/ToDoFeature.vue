<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  useRoute,
  useRouter,
} from "vue-router";

import ListsFeature from "./lists/ListsFeature.vue";
import { useListModalState } from "./lists/composable/useListModalState";
import TasksFeature from "./tasks/TaskFeature.vue";

import VButton from "@/shared/ui/common/VButton.vue";
import VTab from "@/shared/ui/common/VTab.vue";


const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const listId = computed(() => {
  const id = route.query.id;
  return typeof id === "string" ? id : undefined;
});

const isTasksMode = computed(() => !!listId.value);

const {
  openCreateModal,
} = useListModalState();

const tabs = computed(() => [
  { value: "myLists", label: t("lists.myLists") },
  { value: "usersLists", label: t("lists.usersLists") },
]);

const activeTab = computed({
  get: () => route.query.tab || "myLists",
  set: (value) => {
    router.replace({ query: { ...route.query, tab: value } });
  },
});
</script>
<template>
  <Teleport
    v-if="route.query.tab !== 'usersLists'"
    to="#header-actions"
    defer
  >
    <VButton
      icon="icon-plus"
      variant="primary"
      :text="isTasksMode ? $t('tasks.createTasksBtn') : $t('lists.createListBtn')"
      @click="isTasksMode ? null : openCreateModal()"
    />
  </Teleport>
  <div class="border border-subtle p-1 rounded-2xl w-fit mb-7">
    <VTab
      v-if="!isTasksMode"
      v-model="activeTab"
      :tab-items="tabs"
    />
  </div>
  <component
    :is="isTasksMode ? TasksFeature : ListsFeature"
    :active-tab="activeTab"
  />
</template>

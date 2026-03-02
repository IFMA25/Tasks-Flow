<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import ListsFeature from "./lists/ListsFeature.vue";
import { useListModalState } from "./lists/composable/useListModalState";

import VButton from "@/shared/ui/common/VButton.vue";
import VTab from "@/shared/ui/common/VTab.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

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
      :text="$t('lists.createListBtn')"
      @click="openCreateModal"
    />
  </Teleport>
  <VTab
    v-model="activeTab"
    :tab-items="tabs"
    class="mb-7"
  />
  <ListsFeature :active-tab="activeTab" />
</template>

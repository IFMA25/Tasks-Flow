<script setup lang="ts">
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { RouteNames } from '@/shared/config/routeNames';
import VTitle from '@/shared/ui/common/VTitle.vue';

const route = useRoute();
const { t } = useI18n();

const title = computed(() => {
   if (route.name === RouteNames.lists && route.query.id) return;
  if (route.name === RouteNames.lists) {
    const tab = route.query.tab;
    return tab === "usersLists" ? t("lists.titleOverview") : t("lists.title");
  }
  const metaTitle = route.meta.titleHeader;
  return typeof metaTitle === "string" ? t(metaTitle) : "";
});

const styleHeader = computed(() => {
  if (route.name !== RouteNames.profile && !route.query.id) {
    return {
      wrapper: "bg-border-gradient p-[2px] rounded-xl",
      innerContainer: "flex items-center w-full h-full bg-bgSecondary px-3 py-4 rounded-[10px]",
    };
  }

  const baseWrapper = "rounded-xl border border-surface";
  const baseInner = "flex w-full h-full";
  
  const paddingClass = route.query.id ? "p-4" : "p-6";

  return {
    wrapper: `${baseWrapper} ${paddingClass}`,
    innerContainer: baseInner,
  };
});
</script>

<template>
  <div :class="styleHeader.wrapper">
    <div :class="styleHeader.innerContainer">
      <div v-if="!route.query.id" class="flex-1 min-w-0">
        <VTitle
          v-if="title"
          :text="title"
          variant="headerTitle"
        />
        <div id="header-content" />
      </div>
      <div id="header-actions" />
    </div>
  </div>
</template>

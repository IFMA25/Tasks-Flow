<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import VTitle from "@/shared/ui/common/VTitle.vue";

const route = useRoute();
const { t } = useI18n();

const title = computed(() => {
  const metaTitle = route.meta.titleHeader;
  if (typeof metaTitle === "function") {
    return t(metaTitle(route));
  }
  return t(metaTitle);
});
</script>

<template>
  <div class="bg-border-gradient p-[2px] rounded-xl">
    <div class="flex items-center w-full h-full bg-bgSecondary px-3 py-4 rounded-[10px] p-4">
      <div
        v-if="!route.query.id"
        class="flex-1 min-w-0"
      >
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

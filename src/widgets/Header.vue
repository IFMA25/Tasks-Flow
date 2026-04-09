<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import ThemeToggle from "@/features/theme/components/ThemeToggle.vue";
import LangSwitcher from "@/features/translation/components/LangSwitcher.vue";
import { useProfileStore } from "@/shared/stores/useProfileStore";
import VTitle from "@/shared/ui/common/VTitle.vue";


const { t } = useI18n();
const route = useRoute();
const profileStore = useProfileStore();

const title = computed(() => {
  const metaTitle = route.meta.titleHeader;
  const userName = profileStore.profileData.name;
  if (typeof metaTitle === "function") {
    const { translateKey, paramsStore } = metaTitle({ route, userName });
    return t(translateKey, paramsStore);
  }
  return typeof metaTitle === "string" ? t(metaTitle) : "";
});
</script>

<template>
  <div class="bg-border-gradient p-[2px] rounded-xl">
    <div class="flex items-center w-full h-full bg-bgSecondary rounded-[10px] p-4">
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
      <div class="flex items-center">
        <div
          id="header-actions"
          class="pr-3 border-r border-muted"
        />
        <div class="flex items-center gap-2 pl-3">
          <ThemeToggle />
          <LangSwitcher size="sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteNames } from "@/shared/types/routeNames";
import VButton from "@/shared/ui/common/VButton.vue";
import VSkeleton from "@/shared/ui/common/VSkeleton.vue";
import { useI18n } from "vue-i18n";

defineProps<{
  title?: string;
  subtitle?: string;
  date?: string;
  loading?: boolean;
}>();

const { t } = useI18n();
</script>

<template>
   <div class="inline-block mb-6">
    <VButton
      variant="navItem"
      :to="RouteNames.users"
      :text="t('userInfo.backAllUsers')"
      icon="chevron-left"
    />
  </div>
  <div class="flex justify-between items-start rounded-xl border border-surface p-6 mb-6">
    <div>
      <template v-if="loading">
        <VSkeleton
          height="h-6"
          width="w-3/4"
          class="mb-2"
          rounded="md"
        />
        <VSkeleton
          height="h-5"
          width="w-[12rem]"
        />
      </template>
      <template v-else>
        <h3 class="text-xl font-medium leading-[1.2] mb-2">
          {{ title }}
        </h3>
        <p class="text-secondary text-sm leading-[1.3]">
          {{ subtitle }}
        </p>
      </template>
    </div>
    <VSkeleton
      v-if="loading"
      height="h-4"
      width="w-[10rem]"
    />
    <p
      v-else
      class="text-secondary text-xs leading=[1.1]"
    >
      {{ $t('userInfo.since') }} <span class="capitalize">{{ date }}</span>
    </p>
  </div>
</template>

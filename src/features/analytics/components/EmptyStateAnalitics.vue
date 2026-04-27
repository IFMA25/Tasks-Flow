<script setup lang="ts">
import VIcon from "@/shared/ui/common/VIcon.vue";
</script>

<template>
  <div class="flex flex-col gap-2 items-center justify-center text-muted h-full">
    <div class="flex items-center gap-3">
      <VIcon
        type="analytics"
        size="w-8 h-8"
      />
      <p class="leading-[1.3]">
        {{ $t('analytics.noAnalyticsTitle') }}
      </p>
    </div>
    <p class="text-xs leading-[1.1]">
      {{ $t('analytics.noAnalyticsSubtitle') }}
    </p>
  </div>
</template>

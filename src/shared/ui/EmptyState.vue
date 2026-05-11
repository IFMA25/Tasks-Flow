<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <h3 class="text-fluid-h3 font-semibold leading-[1.2] text-center mb-2">
    {{ title }}
  </h3>
  <p
    v-if="subtitle"
    class="text-sm text-secondary leading-[1.3] text-center"
  >
    {{ subtitle }}
  </p>
</template>

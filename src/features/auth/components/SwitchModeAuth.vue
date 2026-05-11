<script setup lang="ts">
import { AuthMode } from "../types";

import VButton from "@/shared/ui/common/VButton.vue";

const pages = ["signin", "signup"];

defineProps<{
  pageMode: AuthMode;
}>();

const emit = defineEmits<{
  switchMode: [mode: AuthMode]
}>();
</script>

<template>
  <div class="flex gap-6 mb-6 items-center justify-center">
    <div
      v-for="page in pages"
      :key="page"
      class="auth-btn-wrapper"
      :class="{ 'active': pageMode === page }"
    >
      <VButton
        variant="authMode"
        :text="$t(`auth.${page}`)"
        @click="emit('switchMode', page === 'signin' ? 'signin' : 'signup')"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.auth-btn-wrapper) {
  @apply relative font-medium;
}

:deep(.auth-btn-wrapper::after) {
  @apply bg-primaryTextDark;
}

:deep(.auth-btn-wrapper.active button) {
  @apply text-primaryTextDark text-lg font-semibold;
}

.auth-btn-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.auth-btn-wrapper:hover::after,
.auth-btn-wrapper.active::after {
  transform: scaleX(1);
}
</style>

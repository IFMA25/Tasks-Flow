<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";
import { computed } from "vue";

import LangSwitcher from "@/features/translation/components/LangSwitcher.vue";
import VLogo from "@/shared/ui/VLogo.vue";
import AuthBgAnimate from "@/shared/ui/authBgAnimate.vue";

const { y } = useWindowScroll();
const isScrolled = computed(() => y.value > 20);
</script>
<template>
  <div
    class="relative min-h-screen flex flex-col"
  >
    <AuthBgAnimate />
    <header
      class="fixed top-0 inset-x-0 flex justify-between items-center px-5
      z-10 transition-all duration-300 ease-in-out"
      :class="[
        isScrolled
          ? 'bg-intro/95 backdrop-blur-2xl py-3'
          : 'bg-transparent py-5'
      ]"
    >
      <VLogo />
      <LangSwitcher data-theme="dark" />
    </header>
    <main class="flex-grow flex flex-col justify-center w-full pt-24 pb-10">
      <router-view />
    </main>
  </div>
</template>


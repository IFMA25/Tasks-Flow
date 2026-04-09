<script setup lang="ts">
import LangSwitcher from "@/features/translation/components/LangSwitcher.vue";
import AuthBgAnimate from "@/shared/ui/authBgAnimate.vue";
</script>
<template>
  <div
    class="relative h-full bg-authBg bg-cover bg-no-repeat"
  >
    <AuthBgAnimate class="absolute top-0 left-0 w-full h-full" />
    <LangSwitcher
      class="absolute top-4 right-6"
      data-theme="dark"
    />
    <div class="container flex flex-col items-center justify-center mx-auto">
      <router-view />
    </div>
  </div>
</template>


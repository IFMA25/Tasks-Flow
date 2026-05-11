<script setup lang="ts">
import webmVideo from "@/shared/assets/bg/AnimDune.webm";
import mp4Video from "@/shared/assets/bg/AnimateDune.mp4";
</script>

<template>
  <div class="fixed inset-0 z-0 bg-[#0A0A0F] pointer-events-none overflow-hidden">
    <video
      autoplay
      loop
      muted
      playsinline
      class="absolute inset-0 w-full h-full object-cover scale-105"
    >
      <source
        :src="webmVideo"
        type="video/webm"
      >
      <source
        :src="mp4Video"
        type="video/mp4"
      >
    </video>
  </div>
</template>

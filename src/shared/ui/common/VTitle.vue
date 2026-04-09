<script setup lang="ts">
const { text, variant = "base" } = defineProps<{
  text: string;
  variant?: string;
}>();

const variantStyle = {
  auth: "text-5xl text-primaryTextDark font-semibold font-rubik text-center",
  base: "text-left font-semibold text-[2rem]",
  headerTitle: "text-2xl text-intro font-medium leading-[1.2] ",
  containerTitle: "text-left text-xl font-semibold leading-[1.3]",
};
</script>

<template>
  <h2 :class="variantStyle[variant]">
    {{ text }}
  </h2>
</template>

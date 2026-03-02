<script setup lang="ts">
import VIcon from "./VIcon.vue";
import VTitle from "./VTitle.vue";

const {
  titleText,
  as="div",
  icon,
  colorIcon,
} = defineProps<{
  titleText: string;
  as?: string;
  icon?: string;
  colorIcon?: string;
}>();

</script>

<template>
  <component
    :is="as"
    class="relative rounded-xl border border-surface shadow bg-base transition hover:shadow-md p-6"
  >
    <div class="flex gap-2 items-center">
      <slot
        v-if="icon"
        name="icon"
      >
        <VIcon
          :type="icon"
          size="w-2.5 h-2.5"
          :style="{ color: colorIcon }"
        />
      </slot>
      <VTitle
        :text="titleText"
        variant="containerTitle"
      />
    </div>
    <div
      v-if="$slots.default"
      class="flex flex-col gap-8"
    >
      <slot />
    </div>
    <div
      v-if="$slots['container-actions']"
    >
      <slot name="container-actions" />
    </div>
  </component>
</template>

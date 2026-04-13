<script setup lang="ts">

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    text?: string;
    color?: string;
    size?: string;
    type?: "spinner" | "dots";
  }>(),
  {
    text: "",
    color: "text-loaderColor",
    size: "w-full h-full",
    type: "spinner",
  },
);

</script>

<template>
  <div
    class="flex gap-3 justify-center items-center"
    :class="[props.size, props.color]"
    v-bind="$attrs"
  >
    <p v-if="props.text">
      {{ props.text }}
    </p>
    <slot name="loader">
      <div
        v-if="props.type === 'spinner'"
        class="loader-spinner"
      />
      <div
        v-else-if="props.type === 'dots'"
        class="loader-dots"
      >
        <span class="loader-dot" />
        <span class="loader-dot" />
        <span class="loader-dot" />
      </div>
    </slot>
  </div>
</template>

<style>
.loader-spinner {
  padding: 4px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: currentColor;
  --_m:
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: loader-spin 1s infinite linear;
}
@keyframes loader-spin {
  to { transform: rotate(1turn); }
}

.loader-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loader-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: currentColor;
  animation: loader-bounce 1.4s ease-in-out infinite both;
}

.loader-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loader-dot:nth-child(2) {
  animation-delay: -0.16s;
}

.loader-dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes loader-bounce {
  0%, 80%, 100% {
    transform: scale(0.4);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

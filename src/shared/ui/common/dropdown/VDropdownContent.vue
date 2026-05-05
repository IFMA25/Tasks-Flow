<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits<{ (e: "close"): void }>();

const props = withDefaults(defineProps<{
  isOpen: boolean;
  rect: DOMRect | null;
  width?: string;
  placement?: keyof typeof placeVariant;
}>(), {
  width: "w-fit",
  placement: "bottom",
});

const placeVariant: Record<string, string> = {
  bottom: "",
  bottomRight: "",
  top: "-translate-y-full",
};

const propContentClass = computed(() => {
  const placementClass = placeVariant[props.placement] ?? "";
  return [props.width, placementClass].join(" ");
});

const positionStyle = computed(() => {
  if (!props.rect) return {};
  const r = props.rect;

  return {
    top: `${props.placement === "top" ? r.top : r.bottom}px`,
    left: `${props.placement === "bottomRight" ? r.right : r.left - 40}px`,
  };
});
</script>

<template>
  <Teleport to="body">
    <Transition name="dropdown">
      <div
        v-if="props.isOpen && props.rect"
        class="fixed text-nowrap min-w-40 border border-default bg-bgBase
            shadow-dropdown rounded text-primary text-base
            translate-all duration-50 z-[1000]"
        :class="propContentClass"
        :style="positionStyle"
        v-bind="$attrs"
        @click="emit('close')"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

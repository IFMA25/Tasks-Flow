<script setup lang="ts">
import { computed } from "vue";
import { RouteLocationRaw, RouterLink, useLink } from "vue-router";

import VIcon from "./VIcon.vue";
import VLoader from "./VLoader.vue";

const props = withDefaults(
  defineProps<{
    text?: string;
    loading?: boolean;
    loadColor?: string;
    type?: string;
    variant?: string;
    disabled?: boolean;
    to?: RouteLocationRaw | null;
    icon?: string;
    iconSize?: string;
    collapsed?: boolean;
    activeClass?: string;
  }>(),
  {
    type: "button",
    loadColor: "text-white",
    variant: "",
    text: "",
    to: null,
    icon: "",
    iconSize: "w-5 h-5",
    collapsed: false,
    activeClass: "navItem-active",
  },
);

const btnStyles = {
  primary: "justify-center bg-btn-gradient px-3 py-3 text-base font-medium rounded-xl hover:shadow-btnHover hover:bg-btn-gradient-hover disabled:opacity-30 disabled:text-muted",
  outline: "bg-transparent py-3 px-4 text-primaryTextDark font-medium border-2 border-borders rounded-xl hover:shadow-btnHover hover:border-borderFocus disabled:border-disabled disabled:text-disabled",
  navItem: "py-3 text-mutedText font-medium hover:text-borderFocus disabled:text-disabled ",
  "navItem-active": "py-3 text-primaryTextDark font-medium",
  authMode: "text-title hover:text-title",
  cardTitle: "text-lg font-semibold text-primary hover:text-borderFocus",
  dashboardNav: "font-medium text-primaryTextDark hover:text-primary disabled:text-disabled",
  danger: "bg-danger py-3 px-4 text-base font-medium border-2 border-danger rounded-xl hover:bg-dangerHover disabled:bg-disabled disabled:text-muted disabled:border-disabled",
};

const { isActive } = (props.to && props.to !== "")
  ? useLink(props)
  : { isActive: computed(() => false) };

const btnClass = computed(() => {
  if (isActive.value && props.variant === "navItem") {
    return btnStyles["navItem-active"];
  }
  return btnStyles[props.variant] ?? "";
});

const isDisabled = computed(() => props.disabled || props.loading);

const disabledClass = computed(() =>
  isDisabled.value
    ? "cursor-default shadow-none pointer-events-none"
    : "cursor-pointer",
);

const isRouterLink = computed(() => !!props.to);
</script>

<template>
  <component
    :is="isRouterLink ? RouterLink : 'button'"
    :to="isRouterLink ? props.to : undefined"
    :disabled="!isRouterLink ? isDisabled : undefined"
    :aria-disabled="String(isDisabled)"
    class="flex gap-2 items-center overflow-hidden transition-all duration-300"
    :class="[
      btnClass,
      disabledClass,
      (isActive && props.activeClass) ? props.activeClass : '',
    ]"
  >
    <span
      v-if="props.icon || props.loading"
      :class="props.iconSize"
    >
      <VLoader
        v-if="props.loading && !$slots['icon-start'] && !props.icon"
        :color="props.loadColor"
      />
      <slot
        v-else-if="$slots['icon-start']"
        name="icon-start"
      />
      <VIcon
        v-else
        :type="props.icon"
        :size="props.iconSize"
      />
    </span>

    <span
      v-if="props.text"
      class="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap"
      :class="props.collapsed
        ? 'opacity-0'
        : 'opacity-100'"
    >
      {{ props.text }}
    </span>

    <span
      v-if="$slots['icon-end']"
      class="w-5 h-5"
    >
      <slot name="icon-end" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { NavItem } from "../types";

import VButton from "@/shared/ui/common/VButton.vue";
import { capitalizeFirstLetter } from "@/shared/utils";

defineProps<{
  item: NavItem
  collapsed?: boolean
}>();
</script>

<template>
  <li
    class="transition-all duration-300 "
    :class="collapsed ? '' : 'px-4'"
  >
    <VButton
      :text="capitalizeFirstLetter(item.text)"
      :icon="item.icon"
      :to="item.to"
      variant="navItem"
      :collapsed="collapsed"
      active-class="navItem-active"
    />
  </li>
</template>

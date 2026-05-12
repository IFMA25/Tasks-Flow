<script setup lang="ts">
import { ActionKey, Actions } from "../types";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

import VButton from "@/shared/ui/common/VButton.vue";
import VDropdown from "@/shared/ui/common/dropdown/VDropdown.vue";


defineProps<{
  actions: Actions[];
}>();

const emit = defineEmits<{
  action: [key: ActionKey];
}>();

</script>

<template>
  <VDropdown>
    <template #trigger="{ toggle }">
      <VButton
        icon="actions-btn"
        icon-size="w-8 h-8"
        class="w-full justify-center text-primaryTextDark font-bold text-lg"
        @click="toggle"
      />
    </template>
    <ul class="cursor-pointer flex flex-col gap-2 py-3 px-5">
      <li
        v-for="action in actions"
        :key="action.key"
        :class="
          action.key === 'delete'
            ? 'text-danger hover:text-dangerHover'
            : 'hover:text-primaryTextDark'
        "
        @click="emit('action', action.key)"
      >
        {{ capitalizeFirstLetter(action.label) }}
      </li>
    </ul>
  </VDropdown>
</template>

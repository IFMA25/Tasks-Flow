<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { ListData } from "../../types";

import { Actions } from "@/shared/types";
import { RouteNames } from "@/shared/types/routeNames";
import VButton from "@/shared/ui/common/VButton.vue";
import VContainer from "@/shared/ui/common/VContainer.vue";
import VDropdown from "@/shared/ui/common/dropdown/VDropdown.vue";
import { capitalizeFirstLetter } from "@/shared/utils";

const { t } = useI18n();

const { data, actions } = defineProps<{
  data: ListData;
  actions: Actions[];
}>();

const emit = defineEmits(["action"]);
</script>

<template>
  <VContainer
    icon="circle"
    :color-icon="data.hexColor"
    class=" flex flex-col gap-4"
  >
    <template #title>
      <VButton
        :text="data.title"
        :to="{ name: RouteNames.tasks, params: { listId: data.id } }"
        variant="cardTitle"
      />
    </template>
    <div class="flex gap-4">
      <p class="text-secondary">
        {{ data.totalTasks }} {{ t('lists.tasks') }}
      </p>
      <p class="text-muted">
        {{ data.completedTasks }} {{ t('lists.completed') }}
      </p>
    </div>
    <template #container-actions>
      <div class="absolute top-2 right-2">
        <VDropdown>
          <template #trigger="{toggle}">
            <VButton
              icon="actions-btn"
              icon-size="w-8 h-8"
              class="w-full justify-center text-primaryBg font-bold text-lg"
              @click="toggle"
            />
          </template>
          <ul class="cursor-pointer flex flex-col gap-2">
            <li
              v-for="action in actions"
              :key="action.key"
              :class="action.key === 'delete'
                ? 'text-danger hover:text-dangerHover'
                : 'hover:text-primaryBg'"
              @click="emit('action', data, action.key)"
            >
              {{ capitalizeFirstLetter(action.label) }}
            </li>
          </ul>
        </VDropdown>
      </div>
    </template>
  </VContainer>
</template>

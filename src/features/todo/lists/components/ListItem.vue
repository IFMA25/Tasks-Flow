<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { ListData } from "../../types";

import { ActionKey, Actions } from "@/shared/types";
import { RouteNames } from "@/shared/types/routeNames";
import VActionsDropdown from "@/shared/ui/VActionsDropdown.vue";
import VButton from "@/shared/ui/common/VButton.vue";
import VContainer from "@/shared/ui/common/VContainer.vue";

const { data } = defineProps<{
  data: ListData;
  actions: Actions[];
}>();

const { t } = useI18n();

const emit = defineEmits<{
  action: [list: ListData, action: ActionKey];
}>();
</script>

<template>
  <VContainer
    icon="circle"
    :color-icon="data.hexColor"
    class=" flex flex-col gap-4 bg-bgBase"
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
        <VActionsDropdown
          :actions="actions"
          @action="(actionKey) => emit('action', data, actionKey)"
        />
      </div>
    </template>
  </VContainer>
</template>

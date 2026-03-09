<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { ListData } from "../../types";

import VButton from "@/shared/ui/common/VButton.vue";
import VContainer from "@/shared/ui/common/VContainer.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VDropdown from "@/shared/ui/common/dropdown/VDropdown.vue";
import { capitalizeFirstLetter } from "@/shared/utils";


const { data } = defineProps<{
  data: ListData;
}>();

// const emit = defineEmits(["action"]);

const { t } = useI18n();
</script>

<template>
  <VContainer
    :title-text="data.owner?.name"
    class=" max-h-40"
  >
    <div class="flex flex-col gap-2 border-b border-default pb-2">
      <p class="text-xs text-muted">
        {{ data.owner?.email }}
      </p>
      <p class="text-sm text-secondary leading-[1.3]">
        <span class=" font-semibold leading-[1.2] text-primary">Role:
        </span>{{ capitalizeFirstLetter(data.owner?.role || '') }}
      </p>
    </div>
    <template #container-actions>
      <div class="mt-2">
        <VDropdown>
          <template #trigger="{toggle}">
            <VButton
              :text="`${t('lists.lists')} (${data.totalTasks})`"
              class="w-full text-primary leading-[1.3]"
              @click="toggle"
            >
              <template #icon-end>
                <VIcon
                  type="chevron-down"
                  class="text-secondary"
                />
              </template>
            </VButton>
          </template>
          <!-- <ul class="cursor-pointer flex flex-col gap-2">
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
            </ul> -->
        </VDropdown>
      </div>
    </template>
  </VContainer>
</template>

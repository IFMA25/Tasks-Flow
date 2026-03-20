<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { UserListGroup } from "../../types";

import { RouteNames } from "@/shared/types/routeNames";
import VButton from "@/shared/ui/common/VButton.vue";
import VContainer from "@/shared/ui/common/VContainer.vue";
import VIcon from "@/shared/ui/common/VIcon.vue";
import VDropdown from "@/shared/ui/common/dropdown/VDropdown.vue";
import { capitalizeFirstLetter } from "@/shared/utils";
import { listsTabs } from "@/shared/variables/tabListsPage";

const { data } = defineProps<{
  data: UserListGroup;
}>();

const { t } = useI18n();
const router = useRouter();
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
      <VDropdown placement="bottomRight">
        <template #trigger="{toggle, isOpen}">
          <VButton
            :text="`${t('lists.lists')} (${data.lists.length})`"
            class="w-full text-primary leading-[1.3] py-3"
            @click="toggle"
          >
            <template #icon-end>
              <VIcon
                type="chevron-down"
                class="text-secondary transition-transform duration-300"
                :class="{ 'rotate-180': isOpen }"
              />
            </template>
          </VButton>
        </template>
        <ul class="cursor-pointer flex flex-col">
          <li
            v-for="list in data.lists"
            :key="list.id"
            class="border-b border-default hover:bg-hover
              py-3 px-5 last:border-none transition-all duration-300"
            @click="router.push({
              name: RouteNames.tasks,
              params: { listId: list.id },
              query: { tab: listsTabs.usersLists }
            })"
          >
            {{ capitalizeFirstLetter(list.title) }}
          </li>
        </ul>
      </VDropdown>
    </template>
  </VContainer>
</template>

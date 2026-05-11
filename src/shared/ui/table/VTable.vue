<script setup lang="ts" generic="T extends { id: string }">
import VTransitionLoader from "../VTransitionLoader.vue";
import VButton from "../common/VButton.vue";

import { Pagination } from "@/shared/types";
import VEmptyState from "@/shared/ui/EmptyState.vue";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  position?: string;
  columnStyles?: string;
}

interface Props {
  rows: T[];
  heads?: TableColumn<T>[];
  loading?: boolean;
  pagination?: Pagination;
  showEmptyState?: boolean;
}

const {
  rows = [],
  heads = [],
  loading = false,
  pagination = undefined,
  showEmptyState = true,
} = defineProps<Props>();

defineEmits<{
  "load-more": [currentLimit: number]
}>();
</script>

<template>
  <div class="h-full w-full overflow-hidden flex flex-col">
    <div class="flex-none ">
      <slot name="toolbar" />
    </div>

    <div
      class="flex-1 overflow-auto relative w-full min-h-0 transition-opacity duration-300"
      :class="{ 'pointer-events-none select-none': loading }"
    >
      <VTransitionLoader
        :is-loading="loading"
        variant="overlay"
      />
      <div
        v-if="!loading && showEmptyState && !rows.length"
        class="py-16 px-4"
      >
        <slot name="emptyState">
          <VEmptyState
            :title="$t('table.emptyState.title')"
            :subtitle="$t('table.emptyState.subtitle')"
          />
        </slot>
      </div>
      <table
        v-else
        class="min-w-full text-primary leading-[1.3] rounded-lg"
      >
        <colgroup>
          <col
            v-for="head in heads"
            :key="String(head.key)"
            :class="head.columnStyles"
          >
        </colgroup>
        <thead
          v-if="heads.some(h => h.label)"
          class="sticky top-0 left-0 z-10 bg-bgCards"
        >
          <tr>
            <th
              v-for="head in heads"
              :key="String(head.key)"
              :class="[`py-3 px-2 font-semibold
                first:rounded-tl-lg last:rounded-tr-lg`, head.position]"
            >
              {{ head.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="group border-b border-default last:border-b-0
              hover:bg-default transition-colors delay-100"
          >
            <td
              v-for="head in heads"
              :key="String(head.key)"
              class="pt-6 pb-2 px-2 first:pl-6 last:pr-6 text-sm "
              :class="head.position"
            >
              <slot
                :name="`cell-${String(head.key)}`"
                :row="row"
              >
                {{ String(row[head.key as keyof T] ?? "") }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="pagination && pagination.hasMore">
        <slot name="pagination" />
        <VButton
          class="mx-auto px-8 mt-2"
          :text="$t('table.loadMore')"
          variant="outline"
          load-color="text-primaryDark"
          @click="$emit('load-more', pagination.limit)"
        />
      </div>
    </div>
  </div>
</template>

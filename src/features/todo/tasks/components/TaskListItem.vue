<script setup lang="ts">
import { computed } from "vue";

import { TaskData } from "../../types";

import VCheckbox from "@/shared/ui/common/VCheckbox.vue";
import VDropdown from "@/shared/ui/common/dropdown/VDropdown.vue";


const props = defineProps<{
  task: TaskData;
}>();

// Обчислення стилів для Пріоритету (кольори з макета)
const priorityStyle = computed(() => {
  const map: Record<string, string> = {
    low: "text-green-500 before:bg-green-500",
    medium: "text-yellow-500 before:bg-yellow-500",
    high: "text-red-500 before:bg-red-500",
  };
  return map[props.task.priority] || "text-gray-500 before:bg-gray-500";
});
</script>

<template>
  <!--
    GRID-СІТКА:
    1. 24px - чекбокс
    2. minmax(200px, 2fr) - назва (найширша колонка)
    3. 100px - пріоритет
    4. 120px - дедлайн
    5. minmax(150px, 1fr) - теги (займають залишок простору)
    6. 32px - кнопка "..."
  -->
  <div
    class="grid grid-cols-[24px_minmax(200px,2fr)_100px_120px_minmax(150px,1fr)_32px]
           gap-4 items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    :class="{ 'opacity-60 grayscale': task.status === 'completed' }"
  >
    <!-- 1. Чекбокс -->
    <div class="flex items-center justify-center">
      <VCheckbox
        width="w-5"
        height="h-5"
        :variant="task.status === 'completed' ? 'checked' : 'notChecked'"
        :model-value="task.status === 'completed'"
      />
    </div>

    <!-- 2. Назва -->
    <div
      class="font-medium text-gray-900 truncate"
      :class="{ 'line-through text-gray-500': task.status === 'completed' }"
    >
      {{ task.title }}
    </div>

    <!-- 3. Пріоритет (з крапкою перед текстом) -->
    <div
      class="text-sm font-medium flex items-center gap-1.5
      capitalize before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full"
      :class="priorityStyle"
    >
      {{ task.priority }}
    </div>

    <!-- 4. Дедлайн -->
    <div class="text-sm text-gray-600">
      <!-- Якщо overdue (протерміновано) - можна додати клас text-red-500 -->
      <span :class="{'text-red-500 font-medium': task.deadline === 'Overdue'}">
        {{ task.deadline }}
      </span>
    </div>

    <!-- 5. Теги -->
    <div class="text-sm text-gray-500 truncate flex items-center gap-1.5">
      <span
        v-for="(tag, index) in task.tags"
        :key="tag"
      >
        {{ tag }}
        <span
          v-if="index !== task.tags.length - 1"
          class="text-gray-300"
        >•</span>
      </span>
    </div>
    <div class="flex justify-end">
      <VDropdown />
    </div>
  </div>
</template>

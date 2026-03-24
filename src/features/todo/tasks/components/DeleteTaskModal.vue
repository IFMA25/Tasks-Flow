<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";

import { TaskData } from "../../types";
import { useTasksRequest } from "../api/useTasksRequest";
import { useTasksStore } from "../store/useTasksStore";

import { useModal } from "@/shared/composables/useModal";
import VConfirmDeleteModal from "@/shared/ui/VConfirmDeleteModal.vue";

const selectedTask = ref<TaskData | null>(null);
const selectedListId = ref("");

const { t } = useI18n();
const { open, close } = useModal("listDeleteModal");
const { deleteTask } = useTasksRequest();
const tasksStore = useTasksStore();
const route = useRoute();

const listId = computed(() => String(route.params.listId));

const openModal = (listId: string, task: TaskData) => {
  selectedTask.value = task;
  selectedListId.value = listId;
  open();
};

const { execute, loading } = deleteTask(
  () => selectedTask.value?.id,
  {
    onSuccess: () => {
      close();
      tasksStore.fetchTasksForList(listId.value);
      toast.warning(t("tasks.msgDeleteSuccess"));
    },
  },
);

defineExpose({ openModal });
</script>

<template>
  <VConfirmDeleteModal
    id="listDeleteModal"
    entity-name="task"
    :item-name="selectedTask?.title || ''"
    :loading="loading"
    @confirm="execute()"
  />
</template>

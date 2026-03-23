<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { TaskData } from "../../types";

import { useModal } from "@/shared/composables/useModal";
import VConfirmDeleteModal from "@/shared/ui/VConfirmDeleteModal.vue";
import { useTasksRequest } from "../api/useTasksRequest";

const selectedTask = ref<TaskData | null>(null);
const selectedListId = ref("");

const { t } = useI18n();
const { open, close } = useModal("listDeleteModal");
const { deleteTask } = useTasksRequest();

const emit = defineEmits(["deleted"]);

const openModal = (listId: string, task: TaskData) => {
  selectedTask.value = task;
  selectedListId.value = listId;
  open();
};

const { execute, loading } = deleteTask(
  () => selectedTask.value?.id,
  {
    onSuccess: () => {
      emit("deleted");
      close();
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

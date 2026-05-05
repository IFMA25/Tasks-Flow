<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { useAdminPanelRequests } from "../api/useAdminPanelRequests";

import { useModal } from "@/shared/composables/useModal";
import { User } from "@/shared/types";
import VConfirmDeleteModal from "@/shared/ui/VConfirmDeleteModal.vue";

const { t } = useI18n();
const { open, close } = useModal("userDeleteModal");
const { userDelete } = useAdminPanelRequests();

const emit = defineEmits<{
  deleted: []
}>();

const selectedUser = ref<User | null>(null);

const openModal = (user: User) => {
  selectedUser.value = user;
  open();
};

const { execute, loading  }
= userDelete(() => selectedUser.value?.id, {
  lazy: true,
  onSuccess: () => {
    emit("deleted");
    close();
    toast.warning(t("usersList.msgDeleteSuccess"));
  },
});

defineExpose({ openModal });
</script>

<template>
  <VConfirmDeleteModal
    id="userDeleteModal"
    entity-name="user"
    :item-name="selectedUser?.name || ''"
    :loading="loading"
    @confirm="execute()"
  />
</template>

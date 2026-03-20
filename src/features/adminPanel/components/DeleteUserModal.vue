<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { useModal } from "@/shared/composables/useModal";
import VConfirmDeleteModal from "@/shared/ui/VConfirmDeleteModal.vue";
import { User } from "@/shared/types";
import { useUserDelete } from "../api/useAdminPanelRequests";
import { ref } from "vue";

const { t } = useI18n();
const { open, close } = useModal("userDeleteModal");

const emit = defineEmits<{
  deleted: []
}>();

const selectedUser = ref<User | null>(null);

const openModal = (user: User) => {
  selectedUser.value = user;
  open();
};

const { execute, loading  }
= useUserDelete(() => selectedUser.value.id, {
  onSuccess: () => {
    emit('deleted');
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

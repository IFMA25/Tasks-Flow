<script setup lang="ts">
import { useModal } from "@/shared/composables/useModal";
import { useProfileStore } from "@/shared/stores/useProfileStore";
import  VButton  from "@/shared/ui/common/VButton.vue";
import VModal from "@/shared/ui/common/VModal.vue";

defineProps<{
  collapsed?: boolean
}>();

const profileStore = useProfileStore();
const { open: openLogoutModal, close: closeLogoutModal } = useModal("logout");
</script>

<template>
  <VModal
    id="logout"
    :title="$t('auth.logout.modalTitle')"
    max-width="md"
  >
    <p class="font-semibold mb-2">
      {{ $t('auth.logout.modalContentTitle') }}
    </p>
    <p class="text-xs">
      {{ $t('auth.logout.modalContentSubtitle') }}
    </p>
    <template #footer>
      <VButton
        :text="$t('auth.logout.modalCancel')"
        variant="outline"
        @click="closeLogoutModal"
      />
      <VButton
        :text="$t('auth.logout.modalLogout')"
        variant="primary"
        @click="profileStore.handleLogout"
      />
    </template>
  </VModal>
  <VButton
    text="Logout"
    variant="navItem"
    icon="logout"
    :collapsed="collapsed"
    @click="openLogoutModal"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";

import { useAdminPanelRequests } from "../api/useAdminPanelRequests";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import VButton from "@/shared/ui/common/VButton.vue";
import VInput from "@/shared/ui/common/VInput.vue";


const profileStore = useProfileStore();
const { updateUserProfile } = useAdminPanelRequests();
const { t } = useI18n();

const userName = ref<string>("");

const { execute, loading, data } = updateUserProfile({
  onSuccess: () => {
    profileStore.profileData = data.value;
    toast.success(t("userInfo.saveSuccess"));
  },
  skipErrorNotification: true,
});

const handleSubmit = () => {
  execute({
    data: { name: userName.value },
  });
};

const isChanged = computed(() => profileStore.profileData.name !== userName.value);

watch(
  () => profileStore.profileData,
  (newVal) => {
    if (newVal?.name) {
      userName.value = newVal.name;
    }
  },
  { immediate: true },
);
</script>

<template>
  <form
    id="formOwnProfile"
    class="gap-6 p-6 border border-surface rounded-xl"
    @submit.prevent="handleSubmit()"
  >
    <div class="flex flex-col gap-4 max-w-[22.5rem] mb-6 text-secondary">
      <VInput
        v-model="userName"
        :label="$t('userInfo.userName')"
      />
      <VInput
        label="Email"
        :model-value="profileStore.profileData?.email"
        :readonly="true"
      />
    </div>

    <VButton
      type="submit"
      variant="primary"
      :text="$t('saveBtnText')"
      :loading="loading"
      :disabled="loading || !isChanged"
    />
  </form>
</template>

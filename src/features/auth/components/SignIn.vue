<script setup lang="ts">
import { tokenManager } from "@ametie/vue-muza-use";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { useAuth } from "../api/composables/useAuthRequests";
import { useSignInValidation } from "../composables/useSignInValidation";
import { AuthMode } from "../types";

import { useProfileStore } from "@/shared/stores/useProfileStore";
import VButton from "@/shared/ui/common/VButton.vue";
import VInput from "@/shared/ui/common/VInput.vue";

type SigninFieldName = keyof typeof formData;

const signinFormFields: {
  name: SigninFieldName;
  label: string;
  placeholder: string
}[] = [
  { name: "email", label: "labelEmail", placeholder: "placeholderEmail" },
  { name: "password", label: "labelPassword", placeholder: "placeholderPassword" },
];

const router = useRouter();

defineEmits<{
  switchMode: [mode: AuthMode]
}>();

const profileStore = useProfileStore();

const { formData, v$ } = useSignInValidation();

const errorLogin = ref<string | null>(null);

const { login } = useAuth();

const { execute, loading, error } = login({
  onSuccess: (response) => {
    tokenManager.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
    toast.success("auth.msgLoginSuccess");

    if (profileStore.profileData?.role === "admin") {
      router.replace({ name: "users" });
    } else {
      router.replace({ name: "home" });
    }

  },
  onError: () => {
    errorLogin.value = error.value.message;
  },
});

const handleSubmit = async() => {
  const isValid = await v$.value.$validate();

  if (!isValid) {
    return;
  }

  await execute({
    data: {
      email: formData.email,
      password: formData.password,
    },
  });
};
</script>

<template>
  <form
    action="#"
    class="flex flex-col gap-4 text-secondaryText"
    @submit.prevent="handleSubmit"
  >
    <VInput
      v-for="field in signinFormFields"
      :key="field.name"
      v-model="formData[field.name]"
      :type="field.name === 'password' ? 'password' : 'text'"
      :label="$t(`auth.${field.label}`)"
      :placeholder="$t(`auth.${field.placeholder}`)"
      :validation="v$[field.name]"
      @blur="v$[field.name].$touch()"
    />
    <p
      v-if="error"
      class="text-sm text-danger font-medium mb-4"
    >
      {{ errorLogin }}
    </p>
    <VButton
      type="submit"
      class="mt-2"
      variant="primary"
      :text="$t('auth.signin')"
      :loading="loading"
    />
  </form>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { AuthMode } from "../types";

import { useAuth } from "@/features/auth/api/composables/useAuthRequests";
import { useSignUpValidation } from "@/features/auth/composables/useSignUpValidation";
import { RouteNames } from "@/shared/types/routeNames";
import VButton from "@/shared/ui/common/VButton.vue";
import VInput from "@/shared/ui/common/VInput.vue";

const signupFormFields = [
  { name: "name", label: "labelName", placeholder: "placeholderName" },
  { name: "email", label: "labelEmail", placeholder: "placeholderEmail" },
  { name: "password", label: "labelPassword", placeholder: "placeholderCreatePassword", supportText: "supportTextPassword" },
];

defineEmits<{
  switchMode: [mode: AuthMode]
}>();

const router = useRouter();
const { formData, v$ } = useSignUpValidation();

const { t } = useI18n();

const { register } = useAuth();

const { execute, loading } = register({
  lazy: true,
  onSuccess: () => {
    toast.success(t("auth.registrationMsg"));
    router.push({ name: RouteNames.auth, query: { mode: "signin" } });
  },
});

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) return;

  await execute({
    data: {
      email: formData.email,
      password: formData.password,
      name: formData.name,
    },
  });
};
</script>

<template>
  <form
    class="flex flex-col gap-4 text-secondaryText"
    @submit.prevent="handleSubmit"
  >
    <VInput
      v-for="field in signupFormFields"
      :key="field.name"
      v-model="formData[field.name]"
      :type="field.name === 'password' ? 'password' : 'text'"
      :label="$t(`auth.${field.label}`)"
      :placeholder="$t(`auth.${field.placeholder}`)"
      :validation="v$[field.name]"
      :support-text="field.supportText ? $t(`auth.${field.supportText}`) : ''"
      @blur="v$[field.name].$touch()"
    />
    <VButton
      type="submit"
      variant="primary"
      class="mt-2"
      :text="$t('auth.signup')"
      :loading="loading"
    />
  </form>
</template>

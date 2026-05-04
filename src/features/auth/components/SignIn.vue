<script setup lang="ts">
import { tokenManager } from "@ametie/vue-muza-use";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { useAuth } from "../api/composables/useAuthRequests";
import { useSignInValidation } from "../composables/useSignInValidation";
import type { AuthMode, LoginResponse } from "../types";

import VButton from "@/shared/ui/common/VButton.vue";
import VInput from "@/shared/ui/common/VInput.vue";

const TEST_USER_EMAIL = import.meta.env.VITE_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = import.meta.env.VITE_TEST_USER_PASSWORD;

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

const { formData, v$ } = useSignInValidation();

const errorLogin = ref<string | null>(null);

const { login } = useAuth();

const handleSuccess = (response: { data: LoginResponse }) => {
  tokenManager.setTokens({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  });
  toast.success("auth.msgLoginSuccess");
  router.replace({ name: "home" });
};

const { execute: executeForm, loading: loadingForm, error: errorForm } = login({
  lazy: true,
  data: () => ({
    email: formData.email,
    password: formData.password,
  }),
  onSuccess: handleSuccess,
  onError: () => {
    if (errorForm.value) {
      errorLogin.value = errorForm.value.message;
    }
  },
});

const { execute: executeTest, loading: loadingTest, error: errorTest } = login({
  data: () => ({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  }),
  onSuccess: handleSuccess,
  onError: () => {
    if (errorTest.value) {
      errorLogin.value = errorTest.value.message;
    }
  },
});

const handleSubmit = async() => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }
  await executeForm();
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
      v-if="errorForm || errorTest"
      class="text-sm text-danger font-medium mb-4"
    >
      {{ errorLogin }}
    </p>
    <VButton
      type="submit"
      class="mt-2"
      variant="primary"
      :text="$t('auth.signin')"
      :loading="loadingForm"
    />
  </form>
  <p
    class="relative my-4 text-center text-secondaryText
         before:absolute before:left-0 before:top-1/2 before:h-px
         before:w-[20%] before:-translate-y-1/2 before:bg-surface
         after:absolute after:right-0 after:top-1/2 after:h-px
         after:w-[20%] after:-translate-y-1/2 after:bg-surface"
  >
    or log in with test account
  </p>

  <VButton
    type="button"
    class="w-full mt-2"
    variant="primary"
    :text="$t('auth.testUser')"
    :loading="loadingTest"
    @click="executeTest"
  />
</template>

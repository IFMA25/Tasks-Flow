<script setup lang="ts">
import SignIn from "./components/SignIn.vue";
import SignUp from "./components/SignUp.vue";
import { useAuthMode } from "./composables/useAuthMode";

import ActionAuth from "@/features/auth/components/SwitchModeAuth.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";

const { pageMode, switchMode } = useAuthMode();

const page = {
  signin: SignIn,
  signup: SignUp,
};
</script>

<template>
  <section
    class="w-[28rem] h-[35.2rem] bg-intro/95 backdrop-blur-xl
    px-8 py-10 border border-borderAuth rounded-2xl"
  >
    <ActionAuth
      :page-mode="pageMode || 'signin'"
      @switch-mode="switchMode"
    />
    <VTitle
      :text="$t('auth.titleSignIn')"
      variant="auth"
      class="mb-8"
    />
    <component
      :is="page[pageMode]"
      :page-mode="pageMode"
      @switch-mode="switchMode"
    />
  </section>
</template>

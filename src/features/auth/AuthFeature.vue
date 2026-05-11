<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import SignIn from "./components/SignIn.vue";
import SignUp from "./components/SignUp.vue";
import { useAuthMode } from "./composables/useAuthMode";

import ActionAuth from "@/features/auth/components/SwitchModeAuth.vue";
import VTitle from "@/shared/ui/common/VTitle.vue";

const { t } = useI18n();
const { pageMode, switchMode } = useAuthMode();

const pointsWelcome = computed(() => [
  { id: 1, text: t("welcome.point1"), bulletClass: "before:bg-listsBlue" },
  { id: 2, text: t("welcome.point2"), bulletClass: "before:bg-listsGreen" },
  { id: 3, text: t("welcome.point3"), bulletClass: "before:bg-listsPurple" },
]);

const page = {
  signin: SignIn,
  signup: SignUp,
};
</script>

<template>
  <section
    data-theme="dark"
    class="container flex flex-col justify-center items-center
      gap-10 lg:flex-row lg:gap-4 lg:justify-around"
  >
    <div class="relative flex flex-col justify-center items-center gap-8 lg:items-start">
      <div>
        <h1 class="flex flex-col text-title text-fluid-h1 font-bold mb-7 text-center lg:text-start">
          <span>{{ t('welcome.title1') }}</span>
          <span>{{ t('welcome.title2') }}</span>
        </h1>
        <p class="max-w-lg text-text text-xl leading-relaxed text-center lg:text-start">
          {{ t('welcome.subtitle') }}
        </p>
      </div>

      <ul class="hidden lg:block space-y-5">
        <li
          v-for="point in pointsWelcome"
          :key="point.id"
          class="relative text-textLight text-lg leading-relaxed
          before:size-[0.6rem]
          before:rounded-full before:absolute before:top-[50%]
          before:left-0 before:translate-y-[-50%] pl-6"
          :class="point.bulletClass"
        >
          {{ point.text }}
        </li>
      </ul>
    </div>
    <div
      class="w-full max-w-[28rem] bg-intro/95 backdrop-blur-xl
    p-8 border border-borders rounded-2xl"
    >
      <ActionAuth
        :page-mode="pageMode || 'signin'"
        @switch-mode="switchMode"
      />
      <VTitle
        :text="$t('auth.titleSignIn')"
        variant="auth"
        class="mb-8 text-fluid-h2"
      />
      <component
        :is="page[pageMode]"
        @switch-mode="switchMode"
      />
    </div>
  </section>
</template>

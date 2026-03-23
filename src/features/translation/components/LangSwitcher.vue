<script setup lang="ts">
import { computed } from "vue";

import {
  useLanguageStore,
} from "@/features/translation/store/useLanguageStore";
import { useSelectedOption } from "@/shared/composables/useSelectedOption";
import { supportedLocales } from "@/shared/config/locale";
import type { LanguageOption } from "@/shared/types";
import VSelect from "@/shared/ui/common/VSelect.vue";

const localeLabels: Record<string, string> = {
  en: "EN",
  uk: "UA",
};

const language = useLanguageStore();

const localeOptions = computed(
  () => supportedLocales.map((locale: string) => ({
    key: locale,
    label: localeLabels[locale],
  }))
);

const currentLangDisplay = useSelectedOption<LanguageOption>(
  localeOptions,
  () => language.currentLang,
  (val: string) => {
    language.setLanguage(val);
  }
);
</script>

<template>
  <VSelect
    id="language-switcher"
    v-model="currentLangDisplay"
    :options="localeOptions"
    label="label"
    track-by="key"
    :close-on-select="true"
  />
</template>

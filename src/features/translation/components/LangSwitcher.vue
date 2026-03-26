<script setup lang="ts">
import { computed } from "vue";

import {
  useLanguageStore,
} from "@/features/translation/store/useLanguageStore";
import { supportedLocales } from "@/shared/config/locale";
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
  })),
);

</script>

<template>
  <VSelect
    id="language-switcher"
    v-model="language.currentLang"
    :options="localeOptions"
    label="label"
    track-by="key"
    :close-on-select="true"
    @update:model-value="(value: string) => language.setLanguage(value)"
  />
</template>

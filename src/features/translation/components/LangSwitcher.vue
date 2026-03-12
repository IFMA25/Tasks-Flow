<script setup lang="ts">
import { computed } from "vue";

import {
  useLanguageStore,
} from "@/features/translation/store/useLanguageStore";
import { supportedLocales } from "@/shared/config/locale";
import VSelect from "@/shared/ui/common/VSelect.vue";

interface Option {
  label: string;
  value: string;
}

const language = useLanguageStore();

const localeOptions = computed(
  () => supportedLocales.map((locale: string) => ({
    label: locale.toUpperCase(),
    value: locale,
  })));


const currentLangDisplay = computed({
  get: () => localeOptions.value.find((option: Option) => option.value === language.currentLang),
  set: (option: Option) => {
    language.setLanguage(option.value);
  },
});
</script>

<template>
  <VSelect
    id="language-switcher"
    v-model="currentLangDisplay"
    :options="localeOptions"
    label="label"
    track-by="value"
    :close-on-select="true"
  />
</template>

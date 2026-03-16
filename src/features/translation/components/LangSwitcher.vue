<script setup lang="ts">
import { computed } from "vue";

import {
  useLanguageStore,
} from "@/features/translation/store/useLanguageStore";
import { useSelectedOption } from "@/shared/composables/useSelectedOption";
import { supportedLocales } from "@/shared/config/locale";
import type { Option } from "@/shared/types";
import VSelect from "@/shared/ui/common/VSelect.vue";

const language = useLanguageStore();

const localeOptions = computed(
  () => supportedLocales.map((locale: string) => ({
    label: locale.toUpperCase(),
    value: locale,
  })));


const currentLangDisplay = useSelectedOption<Option>(
  localeOptions,
  () => language.currentLang,
  (val: string) => {
    language.setLanguage(val);
  },
  "value",
);
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

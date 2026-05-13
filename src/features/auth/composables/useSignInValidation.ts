import useVuelidate from "@vuelidate/core";
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

import { createValidationRules } from "@/features/auth/utils/createValidationRules";

export function useSignInValidation() {
  const { t } = useI18n();

  const formData = reactive({
    email: "",
    password: "",
  });

  const rules = computed(() => {
    const validators = createValidationRules(t);

    return {
      email: {
        required: validators.required,
        email: validators.email,
      },
      password: {
        required: validators.required,

      },
    };
  });

  const v$ = useVuelidate(rules, formData);

  return { formData, v$ };
}

import useVuelidate from "@vuelidate/core";
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

import { createValidationRules } from "@/features/auth/utils/createValidationRules";

export function useSignUpValidation() {
  const { t } = useI18n();

  const formData = reactive({
    email: "",
    name: "",
    password: "",
  });

  const rules = computed(() => {
    const validators = createValidationRules(t);
    return {
      email: {
        required: validators.required,
        email: validators.email,
      },
      name: {
        requiredTrimmed: validators.requiredTrimmed,
      },
      password: {
        required: validators.required,
        minLength: validators.minLength(8),
        hasUppeerCase: validators.hasUpperCase,
        hasNumber: validators.hasNumber,
      },
    };

  });

  const v$ = useVuelidate(rules, formData);

  return { formData, v$ };
}
